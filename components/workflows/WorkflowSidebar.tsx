import { WorkflowDefinition } from "../../lib/types";
import { clsx } from "clsx";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

interface WorkflowSidebarProps {
  workflows: WorkflowDefinition[];
}

export default function WorkflowSidebar({ workflows }: WorkflowSidebarProps) {
  return (
    <aside className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm">
      <header>
        <h3 className="text-lg font-semibold text-slate-900">Workflow Catalog</h3>
        <p className="mt-1 text-sm text-slate-500">Automation templates enforcing role-based review and approval cycles.</p>
      </header>
      <div className="mt-4 space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className={clsx("rounded-2xl border border-slate-200 bg-slate-50/70 p-4", workflow.isDefault && "border-primary-300 bg-primary-50/70")}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{workflow.name}</p>
                <p className="text-xs text-slate-500">{workflow.description}</p>
              </div>
              {workflow.isDefault && <span className="rounded-full bg-primary-500 px-2.5 py-1 text-xs font-semibold text-white">Default</span>}
            </div>
            <div className="mt-3 space-y-2">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold text-primary-600 shadow-sm">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-slate-700">{step.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{step.role} • {step.dueInDays} days • {step.requiresSignature ? "Signature required" : "Sign-off optional"}</p>
                  </div>
                  <ArrowLongRightIcon className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
