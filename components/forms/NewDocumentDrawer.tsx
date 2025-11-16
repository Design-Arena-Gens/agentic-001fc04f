"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ControlledDocument, DocumentType, UserProfile, WorkflowDefinition } from "../../lib/types";
import { v4 as uuid } from "uuid";
import { formatISO } from "date-fns";

interface NewDocumentDrawerProps {
  open: boolean;
  onClose: () => void;
  documentTypes: DocumentType[];
  workflows: WorkflowDefinition[];
  users: UserProfile[];
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

const categories = ["Manufacturing", "Quality", "Training", "Regulatory", "Engineering", "Validation"];
const securityLevels = ["Confidential", "Internal", "Restricted", "Public"];

export default function NewDocumentDrawer({ open, onClose, documentTypes, workflows, users, onSubmit, isSubmitting }: NewDocumentDrawerProps) {
  const [selectedType, setSelectedType] = useState(documentTypes[0]?.id ?? "");
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows.find((wf) => wf.isDefault)?.id ?? workflows[0]?.id ?? "");
  const [selectedIssuer, setSelectedIssuer] = useState(users[0]?.id ?? "");
  const issuerProfile = users.find((user) => user.id === selectedIssuer) ?? users[0];
  const createdAt = formatISO(new Date());
  const nextIssueDate = formatISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 365));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.append("id", uuid());
    form.append("createdAt", createdAt);
    form.append("issuedAt", createdAt);
    form.append("effectiveFrom", createdAt);
    form.append("nextIssueDate", nextIssueDate);
    form.append("issuerRole", issuerProfile.role);
    form.append("issuedBy", issuerProfile.id);
    form.append("issuedByName", issuerProfile.name);
    form.append("createdBy", issuerProfile.id);
    form.append("createdByName", issuerProfile.name);
    form.append("workflowId", selectedWorkflow);
    form.append("workflowName", workflows.find((workflow) => workflow.id === selectedWorkflow)?.name ?? "");
    form.append("documentTypeName", documentTypes.find((type) => type.id === selectedType)?.code ?? "");
    form.append("documentTypeId", selectedType);
    onSubmit(form);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/40" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex max-w-full justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-screen max-w-3xl bg-white shadow-2xl">
                <form onSubmit={handleSubmit} className="flex h-full flex-col divide-y divide-slate-200">
                  <div className="flex-1 overflow-y-auto px-10 py-8">
                    <Dialog.Title className="text-2xl font-semibold text-slate-900">Create Controlled Document</Dialog.Title>
                    <p className="mt-2 text-sm text-slate-500">Capture mandatory metadata, select workflow automation, and enforce lifecycle governance.</p>
                    <section className="mt-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Document Title
                          <input
                            name="title"
                            required
                            placeholder="e.g. Sterile Fill Finish SOP"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Document Number
                          <input
                            name="number"
                            required
                            placeholder="e.g. SOP-QA-021"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Document Type
                          <select
                            name="documentTypeId"
                            value={selectedType}
                            onChange={(event) => setSelectedType(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          >
                            {documentTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.code} — {type.description}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Category
                          <select
                            name="category"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          >
                            {categories.map((category) => (
                              <option key={category}>{category}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Issuer / Owner
                          <select
                            value={selectedIssuer}
                            onChange={(event) => setSelectedIssuer(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          >
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Workflow
                          <select
                            name="workflowId"
                            value={selectedWorkflow}
                            onChange={(event) => setSelectedWorkflow(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          >
                            {workflows.map((workflow) => (
                              <option key={workflow.id} value={workflow.id}>
                                {workflow.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Security Classification
                          <select
                            name="security"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          >
                            {securityLevels.map((level) => (
                              <option key={level}>{level}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Tags (comma separated)
                          <input
                            name="tags"
                            placeholder="GMP, Cleaning"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Linked Documents (IDs)
                          <input
                            name="linkedDocuments"
                            placeholder="doc-cleanroom-operations"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Initial Version Label
                          <input
                            name="versionLabel"
                            defaultValue="1.0"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Change Summary
                          <input
                            name="changeSummary"
                            placeholder="Initial controlled release"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </label>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-500">
                        Electronic signatures will be enforced for all workflow steps requiring regulated approval. Audit events record actor identity, role, and decision context per 21 CFR Part 11.
                      </div>
                    </section>
                  </div>
                  <div className="flex items-center justify-between px-10 py-5">
                    <div className="text-xs text-slate-500">
                      Issued by <span className="font-semibold text-slate-700">{issuerProfile.name}</span> ({issuerProfile.role})
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-400/30 hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-primary-300"
                      >
                        Create Document
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
