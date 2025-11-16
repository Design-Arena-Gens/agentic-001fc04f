import { ComplianceRequirement } from "../../lib/types";
import { BanknotesIcon } from "@heroicons/react/24/outline";

interface CompliancePanelProps {
  compliance: ComplianceRequirement[];
}

export default function CompliancePanel({ compliance }: CompliancePanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm">
      <header>
        <h3 className="text-lg font-semibold text-slate-900">Compliance Controls</h3>
        <p className="text-sm text-slate-500">Traceable linkage to 21 CFR Part 11, ISO 9001, ICH Q7, and GMP expectations.</p>
      </header>
      <div className="mt-4 space-y-4">
        {compliance.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">
                <BanknotesIcon className="h-4 w-4" />
                {item.verificationFrequency}
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              <p className="font-semibold uppercase tracking-wide text-slate-400">Associated Regulations</p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {item.regulations.map((reg) => (
                  <li key={reg}>{reg}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
