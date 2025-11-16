import { ControlledDocument } from "../../lib/types";
import { clsx } from "clsx";
import { format } from "date-fns";

interface DocumentTableProps {
  documents: ControlledDocument[];
  selectedDocumentId: string;
  onSelectDocument: (id: string) => void;
}

const statusColors: Record<string, string> = {
  Draft: "bg-slate-200 text-slate-700",
  "In Review": "bg-amber-100 text-amber-600",
  "In Approval": "bg-amber-100 text-amber-700",
  Effective: "bg-emerald-100 text-emerald-600",
  Superseded: "bg-slate-200 text-slate-600",
  Obsolete: "bg-rose-100 text-rose-600",
};

export default function DocumentTable({ documents, selectedDocumentId, onSelectDocument }: DocumentTableProps) {
  return (
    <section className="rounded-3xl border border-slate-200/60 bg-white/90 shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Controlled Documents</h2>
          <p className="text-sm text-slate-500">Lifecycle-managed inventory aligned with ISO 9001, ICH Q7 and GMP.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-600">Immutability protected</span>
        </div>
      </header>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-500">Title</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-500">Type</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-500">Security</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-500">Workflow</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-500">Next Issue</th>
              <th className="px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {documents.map((document) => (
              <tr
                key={document.id}
                onClick={() => onSelectDocument(document.id)}
                className={clsx(
                  "cursor-pointer transition hover:bg-primary-50",
                  selectedDocumentId === document.id && "bg-primary-50/60"
                )}
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{document.title}</div>
                  <div className="text-xs text-slate-500">{document.number}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{document.documentTypeName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-700">{document.security}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{document.workflowName}</td>
                <td className="px-6 py-4 text-slate-600">{format(new Date(document.nextIssueDate), "dd MMM yyyy")}</td>
                <td className="px-6 py-4">
                  <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", statusColors[document.lifecycleStatus] ?? "bg-slate-200 text-slate-600")}>{document.lifecycleStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
