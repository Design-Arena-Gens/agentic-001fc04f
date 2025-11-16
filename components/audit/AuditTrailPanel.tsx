import { AuditLogEntry } from "../../lib/types";
import { format } from "date-fns";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

interface AuditTrailPanelProps {
  auditTrail: AuditLogEntry[];
}

export default function AuditTrailPanel({ auditTrail }: AuditTrailPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Audit Trail</h3>
          <p className="text-sm text-slate-500">Immutable event ledger with actor accountability and contextual metadata.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheckIcon className="h-4 w-4" />
          CFR Part 11 compliant
        </span>
      </header>
      <div className="mt-4 space-y-3">
        {auditTrail.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-slate-800">{entry.actorName} ({entry.actorRole})</p>
                <p className="text-xs text-slate-500">{entry.action}</p>
              </div>
              <div className="text-xs text-slate-500">
                {format(new Date(entry.timestamp), "dd MMM yyyy HH:mm:ss")}
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-500">
              <pre className="whitespace-pre-wrap break-words">{JSON.stringify(entry.context, null, 2)}</pre>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
