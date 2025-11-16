import { DashboardMetrics } from "../../lib/types";
import { ChartBarIcon, DocumentDuplicateIcon, ShieldCheckIcon, ClockIcon } from "@heroicons/react/24/outline";

interface MetricsHeaderProps {
  metrics: DashboardMetrics;
}

const cards = [
  {
    key: "totalDocuments",
    title: "Controlled Documents",
    icon: DocumentDuplicateIcon,
    color: "bg-primary-500",
  },
  {
    key: "inReview",
    title: "In Review / Approval",
    icon: ChartBarIcon,
    color: "bg-amber-500",
  },
  {
    key: "dueForReview",
    title: "Due in 45 Days",
    icon: ClockIcon,
    color: "bg-rose-500",
  },
  {
    key: "effective",
    title: "Effective",
    icon: ShieldCheckIcon,
    color: "bg-emerald-500",
  },
] as const;

export default function MetricsHeader({ metrics }: MetricsHeaderProps) {
  return (
    <section className="px-6 py-6">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const value = metrics[card.key];
          return (
            <div key={card.key} className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`${card.color} rounded-2xl p-3 text-white shadow-lg shadow-black/10`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                {card.key === "dueForReview"
                  ? "Automated reminders issued for documents nearing scheduled review."
                  : card.key === "inReview"
                  ? "Workflow automation ensures timely review and approvals."
                  : card.key === "effective"
                  ? "Validated and released documents available to authorised users."
                  : "Globally harmonised document inventory."}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
