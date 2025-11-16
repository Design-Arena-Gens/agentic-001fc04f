"use client";

import { useMemo, useState, useTransition } from "react";
import { ControlledDocument, DocumentType, UserProfile, WorkflowDefinition, AuditLogEntry, DashboardMetrics, ComplianceRequirement } from "../../lib/types";
import { createDocumentAction, progressWorkflowAction, updateLifecycleStatusAction } from "../../app/actions";
import DocumentTable from "../documents/DocumentTable";
import DocumentInspector from "../documents/DocumentInspector";
import WorkflowSidebar from "../workflows/WorkflowSidebar";
import AuditTrailPanel from "../audit/AuditTrailPanel";
import CompliancePanel from "../compliance/CompliancePanel";
import DashboardHeader from "../layout/DashboardHeader";
import MetricsHeader from "./MetricsHeader";
import NewDocumentDrawer from "../forms/NewDocumentDrawer";
import { Toaster, toast } from "react-hot-toast";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/navigation";

interface DashboardShellProps {
  documents: ControlledDocument[];
  documentTypes: DocumentType[];
  workflows: WorkflowDefinition[];
  users: UserProfile[];
  auditTrail: AuditLogEntry[];
  metrics: DashboardMetrics;
  compliance: ComplianceRequirement[];
}

export default function DashboardShell({ documents, documentTypes, workflows, users, auditTrail, metrics, compliance }: DashboardShellProps) {
  const router = useRouter();
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0]?.id ?? "");
  const [currentUserId, setCurrentUserId] = useState(users.find((u) => u.role === "Admin")?.id ?? users[0]?.id ?? "");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentUser = useMemo(() => users.find((user) => user.id === currentUserId) ?? users[0], [currentUserId, users]);
  const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDocumentId) ?? documents[0], [documents, selectedDocumentId]);

  const handleCreateDocument = (data: FormData) => {
    startTransition(async () => {
      try {
        await createDocumentAction(data);
        router.refresh();
        toast.success("Document created successfully");
        setDrawerOpen(false);
      } catch (err: any) {
        toast.error(err.message ?? "Failed to create document");
      }
    });
  };

  const handleProgressWorkflow = (formData: FormData) => {
    startTransition(async () => {
      try {
        await progressWorkflowAction(formData);
        router.refresh();
        toast.success("Workflow updated");
      } catch (err: any) {
        toast.error(err.message ?? "Workflow update failed");
      }
    });
  };

  const handleLifecycleUpdate = (documentId: string, status: string) => {
    startTransition(async () => {
      try {
        await updateLifecycleStatusAction(documentId, status, currentUser.id);
        router.refresh();
        toast.success("Lifecycle updated");
      } catch (err: any) {
        toast.error(err.message ?? "Unable to update lifecycle");
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        currentUser={currentUser}
        users={users}
        onUserChange={setCurrentUserId}
        onCreateClick={() => setDrawerOpen(true)}
        isSubmitting={isPending}
      />
      <MetricsHeader metrics={metrics} />
      <div className="flex flex-1 gap-6 px-6 pb-10">
        <div className="flex w-3/5 flex-col gap-6">
          <Tab.Group>
            <Tab.List className="grid grid-cols-4 gap-2 rounded-2xl bg-white/60 p-2 shadow-sm">
              {[
                { id: "documents", label: "Documents" },
                { id: "audit", label: "Audit Trail" },
                { id: "compliance", label: "Compliance" },
                { id: "workflows", label: "Workflows" },
              ].map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      selected
                        ? "bg-primary-500 text-white shadow"
                        : "text-slate-500 hover:bg-slate-100"
                    }`
                  }
                >
                  {tab.label}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel>
                <DocumentTable
                  documents={documents}
                  selectedDocumentId={selectedDocument?.id ?? ""}
                  onSelectDocument={setSelectedDocumentId}
                />
              </Tab.Panel>
              <Tab.Panel>
                <AuditTrailPanel auditTrail={auditTrail} />
              </Tab.Panel>
              <Tab.Panel>
                <CompliancePanel compliance={compliance} />
              </Tab.Panel>
              <Tab.Panel>
                <WorkflowSidebar workflows={workflows} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="flex w-2/5 flex-col gap-6">
          {selectedDocument ? (
            <DocumentInspector
              document={selectedDocument}
              users={users}
              currentUser={currentUser}
              workflows={workflows}
              onProgressWorkflow={handleProgressWorkflow}
              onLifecycleUpdate={handleLifecycleUpdate}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
              Select a document to view its lifecycle and workflow details.
            </div>
          )}
        </div>
    </div>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <NewDocumentDrawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        documentTypes={documentTypes}
        workflows={workflows}
        users={users}
        onSubmit={handleCreateDocument}
        isSubmitting={isPending}
      />
    </div>
  );
}
