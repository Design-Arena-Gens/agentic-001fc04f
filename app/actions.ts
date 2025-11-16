"use server";

import { revalidatePath } from "next/cache";
import { documentSchema, workflowActionSchema } from "../lib/schema";
import {
  createDocument,
  updateDocument,
  progressWorkflow,
  getDocuments,
  getWorkflows,
  getUsers,
  getDocument,
  appendAuditLog,
} from "../lib/store";
import { v4 as uuid } from "uuid";

export async function createDocumentAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const tags = (raw.tags as string | undefined)?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
  const linkedDocuments = (raw.linkedDocuments as string | undefined)?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];

  const revisions = [
    {
      id: uuid(),
      versionLabel: (raw.versionLabel as string) || "1.0",
      changeSummary: (raw.changeSummary as string) || "Initial release",
      effectiveFrom: raw.effectiveFrom as string,
      nextReviewDate: raw.nextIssueDate as string,
      status: "Draft",
      approvals: [],
      files: [],
    },
  ];

  const payload = {
    title: raw.title,
    number: raw.number,
    category: raw.category,
    issuerRole: raw.issuerRole,
    issuedBy: raw.issuedBy,
    issuedByName: raw.issuedByName,
    createdBy: raw.createdBy,
    createdByName: raw.createdByName,
    createdAt: raw.createdAt,
    issuedAt: raw.issuedAt,
    effectiveFrom: raw.effectiveFrom,
    nextIssueDate: raw.nextIssueDate,
    security: raw.security,
    documentTypeId: raw.documentTypeId,
    documentTypeName: raw.documentTypeName,
    lifecycleStatus: "Draft",
    workflowId: raw.workflowId,
    workflowName: raw.workflowName,
    tags,
    linkedDocuments,
    revisions,
  };

  documentSchema.parse(payload);

  const document = createDocument(payload as any);
  revalidatePath("/");
  return document;
}

export async function progressWorkflowAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = workflowActionSchema.parse({
    documentId: raw.documentId,
    stepId: raw.stepId,
    performerId: raw.performerId,
    decision: raw.decision,
    comments: raw.comments,
    signature: raw.signature
      ? JSON.parse(raw.signature as string)
      : undefined,
  });

  const workflows = getWorkflows();
  const users = getUsers();
  const documents = getDocuments();

  const document = documents.find((doc) => doc.id === parsed.documentId);
  if (!document) {
    throw new Error("Document not found");
  }

  const workflow = workflows.find((wf) => wf.id === document.workflowId);
  if (!workflow) {
    throw new Error("Workflow not configured");
  }

  const step = workflow.steps.find((s) => s.id === parsed.stepId);
  if (!step) {
    throw new Error("Workflow step not found");
  }

  const performer = users.find((user) => user.id === parsed.performerId);
  if (!performer) {
    throw new Error("Performer not recognised");
  }

  if (step.requiresSignature && !parsed.signature) {
    throw new Error("Electronic signature required for this step");
  }

  const decisionResult = progressWorkflow(
    parsed.documentId,
    step,
    performer,
    parsed.decision,
    parsed.comments ?? "",
    parsed.signature
      ? {
          id: uuid(),
          signerId: performer.id,
          signerName: performer.name,
          role: performer.role,
          signedAt: new Date().toISOString(),
          challengeQuestion: parsed.signature.challengeQuestion ?? "Password authenticated",
          signatureStatement: parsed.signature.signatureStatement ?? "Approved via electronic signature",
        }
      : undefined,
  );

  if (!decisionResult) {
    throw new Error("Failed to progress workflow");
  }

  revalidatePath("/");
  return decisionResult;
}

export async function updateLifecycleStatusAction(documentId: string, lifecycleStatus: string, actorId: string) {
  const document = getDocument(documentId);
  if (!document) throw new Error("Document not found");
  const user = getUsers().find((u) => u.id === actorId);
  if (!user) throw new Error("User not found");

  const updated = updateDocument(documentId, { lifecycleStatus: lifecycleStatus as any });

  if (updated) {
    appendAuditLog({
      action: `Lifecycle status updated to ${lifecycleStatus}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      entity: "document",
      entityId: documentId,
      context: { lifecycleStatus },
    });
  }

  revalidatePath("/");
  return updated;
}
