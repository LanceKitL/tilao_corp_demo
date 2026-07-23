import React from "react";
import { TrendingUp } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Inactive: "bg-slate-500/15 text-slate-400 border border-slate-500/25",
    Locked: "bg-red-500/15 text-red-400 border border-red-500/25",
    Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    "Under Review": "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    Online: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Healthy: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Running: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    Warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    // R&D statuses
    Draft: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    Released: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Archived: "bg-slate-500/15 text-slate-400 border border-slate-500/25",
    // Production / QC statuses
    "In Progress": "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    "Pending QC": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    Approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Rejected: "bg-red-500/15 text-red-400 border border-red-500/25",
    "Back Job": "bg-orange-500/15 text-orange-400 border border-orange-500/25",
    "In Rework": "bg-orange-500/15 text-orange-400 border border-orange-500/25",
    "QC Pending": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-mono ${map[status] ?? "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  );
}

export function KPICard({
  label, value, sub, icon: Icon, accent, trend,
}: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; accent: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-white/12 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent}`}>
          <Icon size={15} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold text-foreground font-mono leading-none">{value}</span>
        {trend && (
          <span className={`text-xs mb-0.5 flex items-center gap-0.5 ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}>
            {trend === "up" ? <TrendingUp size={11} /> : trend === "down" ? <TrendingUp size={11} className="rotate-180" /> : null}
          </span>
        )}
      </div>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">{title}</h2>
      {action}
    </div>
  );
}
