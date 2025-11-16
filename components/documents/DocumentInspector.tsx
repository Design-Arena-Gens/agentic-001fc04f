"use client";

import { useMemo, useState, FormEvent } from "react";
import { ControlledDocument, UserProfile, WorkflowDefinition } from "../../lib/types";
import { format } from "date-fns";
import { ShieldExclamationIcon, PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface DocumentInspectorProps {
  document: ControlledDocument;
  users: UserProfile[];
  currentUser: UserProfile;
  workflows: WorkflowDefinition[];
  onProgressWorkflow: (formData: FormData) => void;
  onLifecycleUpdate: (documentId: string, status: string) => void;
}

export default function DocumentInspector({ document, users, currentUser, workflows, onProgressWorkflow, onLifecycleUpdate }: DocumentInspectorProps) {
  const revision = document.revisions[0];
  const workflow = workflows.find((wf) => wf.id === document.workflowId);
  const [decision, setDecision] = useState<"approved" | "rejected" | "comment">("approved");
  const [comments, setComments] = useState("");
  const [challenge, setChallenge] = useState("");
  const [signatureStatement, setSignatureStatement] = useState("Approved per 21 CFR Part 11");

  const approvals = useMemo(() => revision?.approvals ?? [], [revision]);
  const completedSteps = useMemo(() => new Set(approvals.map((approval) => approval.stepId)), [approvals]);
  const pendingStep = useMemo(() => {
    if (!workflow || !revision) return undefined;
    return workflow.steps.find((step) => !completedSteps.has(step.id));
  }, [workflow, revision, completedSteps]);

  const userCanAct = pendingStep?.role === currentUser.role;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workflow || !pendingStep || !userCanAct) return;
    const form = new FormData();
    form.append("documentId", document.id);
    form.append("stepId", pendingStep.id);
    form.append("performerId", currentUser.id);
    form.append("decision", decision);
    form.append("comments", comments);
    if (pendingStep.requiresSignature) {
      form.append(
        "signature",
        JSON.stringify({
          signerId: currentUser.id,
          signerName: currentUser.name,
          role: currentUser.role,
          challengeQuestion: challenge || "Password verified",
          signatureStatement,
        })
      );
    }
    onProgressWorkflow(form);
    setComments("");
    setChallenge("");
  };

  return (
    <section className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{document.title}</h3>
          <p className="text-sm text-slate-500">{document.number} • {document.category}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{document.security}</span>
          <span className="text-xs text-slate-500">Issuer: {document.issuedByName}</span>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
        <InfoItem label="Document Type" value={document.documentTypeName} />
        <InfoItem label="Workflow" value={document.workflowName} />
        <InfoItem label="Created" value={format(new Date(document.createdAt), "dd MMM yyyy")} />
        <InfoItem label="Effective From" value={format(new Date(document.effectiveFrom), "dd MMM yyyy")} />
        <InfoItem label="Next Issue" value={format(new Date(document.nextIssueDate), "dd MMM yyyy")} />
        <InfoItem label="Lifecycle Status" value={document.lifecycleStatus} />
      </div>
      {revision && (
        <div className="rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Current Revision {revision.versionLabel}</h4>
              <p className="text-xs text-slate-500">{revision.changeSummary}</p>
            </div>
            <div className="text-xs text-slate-500">Next Review {format(new Date(revision.nextReviewDate), "dd MMM yyyy")}</div>
          </div>
          <div className="mt-4 space-y-3">
            {revision.approvals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{approval.stepName}</p>
                  <p className="text-xs text-slate-500">{approval.performedByName} • {approval.role}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold uppercase tracking-wide text-emerald-600">{approval.decision}</p>
                  <p>{format(new Date(approval.performedAt), "dd MMM yyyy HH:mm")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {workflow && pendingStep ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-primary-200/80 bg-primary-50/70 p-5 text-sm shadow-inner">
          <div className="flex items-center gap-2 text-primary-700">
            <ShieldExclamationIcon className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Pending Step: {pendingStep.name}</p>
              <p className="text-xs text-primary-700/80">Role required: {pendingStep.role} • Due within {pendingStep.dueInDays} days</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="text-xs font-semibold uppercase text-primary-700/80">
              Decision
              <select
                value={decision}
                onChange={(event) => setDecision(event.target.value as any)}
                className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
                <option value="comment">Comment</option>
              </select>
            </label>
            <label className="text-xs font-semibold uppercase text-primary-700/80">
              Comments
              <input
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="Add regulatory justification"
              />
            </label>
            {pendingStep.requiresSignature && (
              <label className="text-xs font-semibold uppercase text-primary-700/80">
                Challenge Question
                <input
                  value={challenge}
                  onChange={(event) => setChallenge(event.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Enter credential validation"
                />
              </label>
            )}
            {pendingStep.requiresSignature && (
              <label className="text-xs font-semibold uppercase text-primary-700/80">
                Signature Statement
                <input
                  value={signatureStatement}
                  onChange={(event) => setSignatureStatement(event.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </label>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-primary-700/80">
              <CheckCircleIcon className="h-4 w-4" />
              Electronic signature captured per 21 CFR Part 11 with immutable audit record.
            </div>
            <button
              type="submit"
              disabled={!userCanAct}
              className={clsx(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                userCanAct
                  ? "bg-primary-600 text-white hover:bg-primary-500"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              )}
            >
              <PencilSquareIcon className="h-4 w-4" />
              Record Decision
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-500">
          Workflow fully approved or awaiting role-authorised reviewer.
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-2">
        {["Draft", "In Review", "In Approval", "Effective", "Superseded", "Obsolete"].map((status) => (
          <button
            key={status}
            onClick={() => onLifecycleUpdate(document.id, status)}
            className={clsx(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              document.lifecycleStatus === status
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-600"
            )}
          >
            {status}
          </button>
        ))}
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}
