import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard, Package, DollarSign, Archive, FileText,
  ChevronRight, Search, LogOut, User, Bell, Menu, X,
  AlertCircle, Clock, CheckCircle, Flag, Eye, Plus, Save,
  TrendingUp, Download, RefreshCw, Filter,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatusBadge, KPICard, SectionHeader } from "./shared";

// ─── Data Constants ───────────────────────────────────────────────────────────

const eaCashSpend = [
  { day: "Jun 24", amount: 1200 }, { day: "Jun 27", amount: 850 },
  { day: "Jun 30", amount: 2100 }, { day: "Jul 3", amount: 650 },
  { day: "Jul 6", amount: 1400 }, { day: "Jul 9", amount: 980 },
  { day: "Jul 12", amount: 3200 }, { day: "Jul 15", amount: 1750 },
  { day: "Jul 18", amount: 2400 }, { day: "Jul 22", amount: 1100 },
];

type TimelineEntry = { time: string; event: string; by: string };
type Bundle = {
  id: string; design: string; seamstress: string;
  status: string; flagged: boolean; timeline: TimelineEntry[];
};

const eaBundlesInit: Bundle[] = [
  { id: "BND-20260722-0012", design: "Alexa Long Sleeve Top", seamstress: "Maria Santos", status: "Pending QC", flagged: false, timeline: [
    { time: "8:30 AM", event: "Bundle Created", by: "prod_head" },
    { time: "8:45 AM", event: "Assigned to Maria Santos", by: "prod_head" },
    { time: "12:15 PM", event: "Sewing Completed", by: "m.santos" },
    { time: "1:05 PM", event: "QC Inspection Started", by: "prod_head" },
  ]},
  { id: "BND-20260722-0011", design: "Martina Scoop Neck Top", seamstress: "Liza Cruz", status: "Pending QC", flagged: false, timeline: [
    { time: "9:00 AM", event: "Bundle Created", by: "prod_head" },
    { time: "9:20 AM", event: "Assigned to Liza Cruz", by: "prod_head" },
    { time: "12:45 PM", event: "Sewing Completed", by: "l.cruz" },
  ]},
  { id: "BND-20260722-0010", design: "Arya Tank Top", seamstress: "Rosa Mendez", status: "Approved", flagged: false, timeline: [
    { time: "7:30 AM", event: "Bundle Created", by: "prod_head" },
    { time: "7:45 AM", event: "Assigned to Rosa Mendez", by: "prod_head" },
    { time: "11:00 AM", event: "Sewing Completed", by: "r.mendez" },
    { time: "11:30 AM", event: "QC Approved", by: "prod_head" },
  ]},
  { id: "BND-20260722-0009", design: "Lounge Pants Plain", seamstress: "Cita Bautista", status: "In Progress", flagged: true, timeline: [
    { time: "10:00 AM", event: "Bundle Created", by: "prod_head" },
    { time: "10:15 AM", event: "Assigned to Cita Bautista", by: "prod_head" },
  ]},
  { id: "BND-20260722-0008", design: "Klea Mini Dress", seamstress: "Ana Torres", status: "Back Job", flagged: false, timeline: [
    { time: "8:00 AM", event: "Bundle Created", by: "prod_head" },
    { time: "8:15 AM", event: "Assigned to Ana Torres", by: "prod_head" },
    { time: "9:50 AM", event: "Sewing Completed", by: "a.torres" },
    { time: "10:10 AM", event: "QC Rejected — coverstitch break on hem", by: "prod_head" },
  ]},
  { id: "BND-20260722-0007", design: "Lounge Pants Ribbed", seamstress: "Maria Santos", status: "In Progress", flagged: false, timeline: [
    { time: "9:30 AM", event: "Bundle Created", by: "prod_head" },
    { time: "9:45 AM", event: "Assigned to Maria Santos", by: "prod_head" },
  ]},
  { id: "BND-20260722-0006", design: "Trouser Pants Straight", seamstress: "Liza Cruz", status: "Approved", flagged: false, timeline: [
    { time: "Yesterday 2:00 PM", event: "Bundle Created", by: "prod_head" },
    { time: "Yesterday 4:00 PM", event: "QC Approved", by: "prod_head" },
  ]},
  { id: "BND-20260722-0005", design: "Biker Shorts", seamstress: "Rosa Mendez", status: "Approved", flagged: false, timeline: [
    { time: "Yesterday 1:00 PM", event: "Bundle Created", by: "prod_head" },
    { time: "Yesterday 3:20 PM", event: "QC Approved", by: "prod_head" },
  ]},
];

type LineItem = { payee: string; amount: number; reason: string };
type CashRequest = {
  id: string; manager: string; dept: string; amount: number;
  reason: string; status: string; submitted: string; items: LineItem[];
};

const eaCashRequestsInit: CashRequest[] = [
  { id: "REQ-2045", manager: "Jose Cruz", dept: "Operations", amount: 3500, reason: "Fabric purchase from online supplier", status: "Pending", submitted: "Jul 22, 2026 9:15 AM",
    items: [
      { payee: "Shopee Seller – FabricPH", amount: 2800, reason: "Cotton fabric 5m" },
      { payee: "GrabExpress", amount: 700, reason: "Delivery fee" },
    ]},
  { id: "REQ-2044", manager: "Marco Villanueva", dept: "Production", amount: 1200, reason: "Thread restock from local supplier", status: "Pending", submitted: "Jul 22, 2026 8:40 AM",
    items: [
      { payee: "Thread World PH", amount: 1200, reason: "20 spools black polyester thread" },
    ]},
  { id: "REQ-2043", manager: "Maria Santos", dept: "Finance", amount: 850, reason: "Office supplies", status: "Endorsed", submitted: "Jul 21, 2026 4:00 PM",
    items: [
      { payee: "SM Stationery", amount: 850, reason: "Bond paper, pens, folders" },
    ]},
  { id: "REQ-2042", manager: "Jose Cruz", dept: "Operations", amount: 2200, reason: "Packaging materials", status: "Returned", submitted: "Jul 21, 2026 2:30 PM",
    items: [
      { payee: "PackShop PH", amount: 2200, reason: "Poly bags 500pcs" },
    ]},
  { id: "REQ-2041", manager: "Liza Tan", dept: "Quality", amount: 450, reason: "Inspection tools", status: "Approved", submitted: "Jul 20, 2026 11:00 AM",
    items: [
      { payee: "Industrial Tools PH", amount: 450, reason: "Measuring tape x10, needles" },
    ]},
];

type InventoryItem = {
  id: string; name: string; category: string; unit: string;
  stock: number; min: number; max: number;
};

const eaInventoryData: InventoryItem[] = [
  { id: "MAT-001", name: "Cotton Spandex Jersey 92/8 (Black)", category: "Fabrics", unit: "meters", stock: 120, min: 50, max: 200 },
  { id: "MAT-002", name: "Cotton Spandex Jersey 92/8 (Ivory)", category: "Fabrics", unit: "meters", stock: 35, min: 50, max: 200 },
  { id: "MAT-003", name: "French Terry 240 GSM (Charcoal)", category: "Fabrics", unit: "meters", stock: 80, min: 40, max: 150 },
  { id: "MAT-004", name: "Poly Rib Knit 62/33/5 (Oat)", category: "Fabrics", unit: "meters", stock: 12, min: 30, max: 120 },
  { id: "MAT-005", name: "Polyester Thread 504 (Black)", category: "Threads", unit: "spools", stock: 8, min: 20, max: 60 },
  { id: "MAT-006", name: "Polyester Thread 406 Coverstitch (White)", category: "Threads", unit: "spools", stock: 14, min: 20, max: 60 },
  { id: "MAT-007", name: "Wooly Nylon — Overlock Looper", category: "Threads", unit: "cones", stock: 22, min: 10, max: 40 },
  { id: "MAT-008", name: "Poly Bag 12×18", category: "Packaging", unit: "pieces", stock: 450, min: 200, max: 1000 },
  { id: "MAT-009", name: "Hang Tag (Mera Standard)", category: "Packaging", unit: "pieces", stock: 85, min: 100, max: 500 },
  { id: "MAT-010", name: "Care Label (Woven)", category: "Packaging", unit: "pieces", stock: 320, min: 150, max: 600 },
  { id: "MAT-011", name: "Clear Elastic Tape 12mm (Shoulder)", category: "Accessories", unit: "meters", stock: 45, min: 80, max: 300 },
  { id: "MAT-012", name: "YKK Zipper 20cm (Black)", category: "Accessories", unit: "pieces", stock: 38, min: 60, max: 200 },
];

type Seamstress = { name: string; bundles: number; rate: number; deductions: number; bonus: number };

const eaSeamstressesInit: Seamstress[] = [
  { name: "Maria Santos", bundles: 18, rate: 45, deductions: 200, bonus: 0 },
  { name: "Liza Cruz", bundles: 22, rate: 45, deductions: 0, bonus: 100 },
  { name: "Rosa Mendez", bundles: 15, rate: 45, deductions: 500, bonus: 0 },
  { name: "Cita Bautista", bundles: 20, rate: 45, deductions: 0, bonus: 50 },
  { name: "Ana Torres", bundles: 12, rate: 45, deductions: 0, bonus: 0 },
  { name: "Tess Reyes", bundles: 19, rate: 45, deductions: 300, bonus: 0 },
];

const eaPayrollHistory = [
  { period: "Jun 16 – Jun 30, 2026", count: 6, total: 28350, status: "Completed" },
  { period: "Jun 1 – Jun 15, 2026", count: 6, total: 26100, status: "Completed" },
  { period: "May 16 – May 31, 2026", count: 6, total: 31500, status: "Completed" },
];

type TriageFeedItem = { type: string; msg: string; time: string; module: string };

const eaTriageFeed: TriageFeedItem[] = [
  { type: "warn", msg: "Manager Jose Cruz submitted Liquidation REQ-2045 (₱3,500)", time: "9:15 AM", module: "Petty Cash" },
  { type: "warn", msg: "Polyester Thread 504 (Black) critically low — 8 spools remaining", time: "8:50 AM", module: "Inventory" },
  { type: "info", msg: "Bundle BND-0011 (Martina Scoop Neck Top) in Pending QC for over 40 minutes", time: "1:25 PM", module: "Production" },
  { type: "warn", msg: "YKK Zipper 20cm stock below minimum — 38 pcs vs 60 min", time: "8:00 AM", module: "Inventory" },
  { type: "ok", msg: "Payroll for Jun 16–30 was approved and disbursed", time: "Yesterday 4:30 PM", module: "Payroll" },
  { type: "info", msg: "Bundle BND-0009 (Lounge Pants Plain) flagged as Rush by EA", time: "10:30 AM", module: "Production" },
  { type: "warn", msg: "REQ-2044 from Marco Villanueva awaiting review — thread restock (₱1,200)", time: "8:40 AM", module: "Petty Cash" },
  { type: "ok", msg: "Cotton Spandex Jersey 92/8 (Black) restocked — 120m available", time: "Yesterday 2:00 PM", module: "Inventory" },
];

// ─── Page Views ───────────────────────────────────────────────────────────────

function EADashboard() {
  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div>
        <SectionHeader title="Command Center — Jul 22, 2026" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KPICard label="Pending Cash Requests" value={2} sub="Awaiting your review" icon={DollarSign} accent="bg-amber-500/15 text-amber-400" />
          <KPICard label="Low Stock Alerts" value={3} sub="Below minimum level" icon={Archive} accent="bg-red-500/15 text-red-400" />
          <KPICard label="Bundles — Back Job" value={1} sub="Require rework today" icon={Package} accent="bg-orange-500/15 text-orange-400" />
        </div>
      </div>

      {/* Cash Burn Sparkline */}
      <div>
        <SectionHeader title="Cash Burn — Last 30 Days" />
        <div className="bg-card border border-border rounded-lg p-4">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={eaCashSpend}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#737373" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#737373" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, fontSize: 11 }}
                formatter={(value: number) => [`₱${value.toLocaleString()}`, "Amount"]}
              />
              <Line type="monotone" dataKey="amount" stroke="#0a0a0a" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Triage */}
      <div>
        <SectionHeader title="Task Triage" />
        <div className="bg-card border border-border rounded-lg divide-y divide-border/50">
          {eaTriageFeed.map((item, i) => {
            const iconColor =
              item.type === "warn" ? "text-amber-400" :
              item.type === "ok" ? "text-emerald-400" : "text-blue-400";
            const Icon =
              item.type === "warn" ? AlertCircle :
              item.type === "ok" ? CheckCircle : Clock;
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <Icon size={13} className={`${iconColor} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground leading-snug">{item.msg}</p>
                  <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted text-muted-foreground border border-border/50">
                    {item.module}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
                  <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium">View</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EAProduction() {
  const [bundles, setBundles] = useState<Bundle[]>(eaBundlesInit);
  const [search, setSearch] = useState("");
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null);

  const columns = ["In Progress", "Pending QC", "Back Job", "Approved"] as const;

  function toggleFlag(id: string) {
    setBundles(prev => prev.map(b => b.id === id ? { ...b, flagged: !b.flagged } : b));
  }

  const filtered = bundles.filter(b =>
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.design.toLowerCase().includes(search.toLowerCase()) ||
    b.seamstress.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  return (
    <div className="space-y-5">
      <SectionHeader title="Production Monitor" />

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map(col => {
          const colBundles = bundles.filter(b => b.status === col);
          const colColor =
            col === "In Progress" ? "text-blue-400" :
            col === "Pending QC" ? "text-amber-400" :
            col === "Back Job" ? "text-orange-400" : "text-emerald-400";
          return (
            <div key={col} className="flex flex-col gap-2 min-w-[200px] flex-1">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{col}</span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-muted ${colColor}`}>
                  {colBundles.length}
                </span>
              </div>
              {colBundles.map(b => (
                <div key={b.id} className="bg-card border border-border rounded-lg p-3 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] text-muted-foreground truncate">
                        {b.id.replace("BND-20260722-", "BND-0")}
                      </div>
                      <div className="text-xs font-medium text-foreground mt-0.5 truncate">{b.design}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{b.seamstress}</div>
                      {b.flagged && (
                        <span className="inline-block mt-1 bg-red-500/15 text-red-500 text-[9px] px-1.5 py-0.5 rounded font-medium">
                          RUSH
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFlag(b.id)}
                      title={b.flagged ? "Unflag" : "Flag as Rush"}
                      className={`p-1 rounded transition-colors shrink-0 ${b.flagged ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Flag size={11} />
                    </button>
                  </div>
                </div>
              ))}
              {colBundles.length === 0 && (
                <div className="bg-card border border-dashed border-border rounded-lg p-4 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/50">Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bundle Audit Trail */}
      <div className="mt-6">
        <SectionHeader
          title="Bundle Audit Trail"
          action={
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search bundles…"
                className={`pl-8 ${inputCls}`}
              />
            </div>
          }
        />
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Bundle ID", "Design", "Seamstress", "Status", "Flagged", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map(b => (
                  <>
                    <tr key={b.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground font-medium text-[10px]">
                        {b.id.replace("BND-20260722-", "BND-0")}
                      </td>
                      <td className="px-4 py-3 text-foreground">{b.design}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b.seamstress}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        {b.flagged ? (
                          <span className="bg-red-500/15 text-red-500 text-[9px] px-1.5 py-0.5 rounded font-medium">RUSH</span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedBundle(expandedBundle === b.id ? null : b.id)}
                          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye size={12} /> Details
                        </button>
                      </td>
                    </tr>
                    {expandedBundle === b.id && (
                      <tr key={`${b.id}-expanded`}>
                        <td colSpan={6} className="px-4 py-4 bg-muted/20">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Audit Timeline — {b.id.replace("BND-20260722-", "BND-0")}
                          </div>
                          <div className="space-y-0">
                            {b.timeline.map((t, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-foreground mt-1 shrink-0" />
                                  {i < b.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1 mb-0" />}
                                </div>
                                <div className="pb-3">
                                  <div className="text-[10px] text-muted-foreground font-mono">{t.time}</div>
                                  <div className="text-xs text-foreground mt-0.5">{t.event}</div>
                                  <div className="text-[10px] text-muted-foreground">by {t.by}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border">
            <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {bundles.length} bundles</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EAPettyCash() {
  const [requests, setRequests] = useState<CashRequest[]>(eaCashRequestsInit);
  const [selected, setSelected] = useState<CashRequest | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [showReturn, setShowReturn] = useState(false);

  function updateStatus(id: string, status: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(prev => prev && prev.id === id ? { ...prev, status } : prev);
  }

  const inputCls = "bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  return (
    <div className="space-y-4">
      <SectionHeader title="Petty Cash Requests" />
      <div className="flex gap-5 items-start">
        {/* Left panel */}
        <div className="w-64 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-border bg-[#333] flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">Requests</span>
            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border">
              {requests.length}
            </span>
          </div>
          <div>
            {requests.map(r => (
              <div
                key={r.id}
                onClick={() => { setSelected(r); setShowReturn(false); setReturnReason(""); }}
                className={`px-3 py-3 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors ${selected?.id === r.id ? "bg-muted" : ""}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono font-medium text-foreground">{r.id}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{r.manager}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-[11px] font-mono font-semibold text-foreground mt-1">
                  ₱{r.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="bg-card border border-border rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <DollarSign size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                <span className="text-[11px] text-muted-foreground">Select a request to review</span>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-foreground">{selected.id}</span>
                  <StatusBadge status={selected.status} />
                </div>
                <button onClick={() => setSelected(null)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Metadata */}
              <div className="px-4 py-4 border-b border-border">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    ["Manager", selected.manager],
                    ["Department", selected.dept],
                    ["Amount", `₱${selected.amount.toLocaleString()}`],
                    ["Submitted", selected.submitted],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</div>
                      <div className="text-xs font-medium text-foreground mt-0.5">{v}</div>
                    </div>
                  ))}
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Reason</div>
                    <div className="text-xs text-foreground mt-0.5">{selected.reason}</div>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="px-4 py-4 border-b border-border">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Line Items</div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Payee", "Amount", "Reason"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {selected.items.map((item, i) => (
                      <tr key={i} className="hover:bg-black/[0.02]">
                        <td className="px-3 py-2 text-foreground">{item.payee}</td>
                        <td className="px-3 py-2 font-mono text-foreground">₱{item.amount.toLocaleString()}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="px-4 py-4 space-y-3">
                {selected.status === "Pending" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        updateStatus(selected.id, "Endorsed");
                        toast.success(`REQ endorsed to Boss`, {
                          description: `${selected.id} — ₱${selected.amount.toLocaleString()} forwarded for approval`,
                        });
                      }}
                      className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity"
                    >
                      <TrendingUp size={12} /> Endorse to Boss
                    </button>
                    <button
                      onClick={() => setShowReturn(v => !v)}
                      className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      <RefreshCw size={12} /> Return to Sender
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selected.id, "Approved");
                        toast.success(`${selected.id} approved`);
                      }}
                      className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      <CheckCircle size={12} /> Approve (Proxy)
                    </button>
                  </div>
                )}
                {showReturn && selected.status === "Pending" && (
                  <div className="space-y-2">
                    <textarea
                      value={returnReason}
                      onChange={e => setReturnReason(e.target.value)}
                      rows={2}
                      placeholder="State reason for returning this request…"
                      className={`w-full ${inputCls} resize-none`}
                    />
                    <button
                      onClick={() => {
                        updateStatus(selected.id, "Returned");
                        toast(`${selected.id} returned`, { description: returnReason });
                        setShowReturn(false);
                        setReturnReason("");
                      }}
                      className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity"
                    >
                      <Save size={12} /> Confirm Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EAInventory() {
  const [activeTab, setActiveTab] = useState("Fabrics");
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [reorderForm, setReorderForm] = useState({ qty: "", cost: "" });

  const tabs = ["Fabrics", "Threads", "Packaging", "Accessories"];
  const filtered = eaInventoryData.filter(item => item.category === activeTab);

  function getStockStatus(item: InventoryItem): "Good" | "Low" | "Critical" {
    if (item.stock <= item.min) return "Critical";
    if (item.stock <= item.min * 1.5) return "Low";
    return "Good";
  }

  function getStockBarColor(status: "Good" | "Low" | "Critical"): string {
    if (status === "Critical") return "bg-red-500";
    if (status === "Low") return "bg-amber-500";
    return "bg-emerald-500";
  }

  function getStatusBadgeClass(status: "Good" | "Low" | "Critical"): string {
    if (status === "Critical") return "bg-red-500/15 text-red-400 border border-red-500/25";
    if (status === "Low") return "bg-amber-500/15 text-amber-400 border border-amber-500/25";
    return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
  }

  const inputCls = "bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  return (
    <div className="space-y-5">
      <SectionHeader title="Inventory Monitor" />

      {/* Category Tabs */}
      <div className="flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
              activeTab === tab
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Material", "Unit", "Stock", "Min", "Stock Level", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(item => {
                const status = getStockStatus(item);
                const pct = Math.min(100, Math.round((item.stock / item.max) * 100));
                return (
                  <tr key={item.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">{item.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{item.id}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.unit}</td>
                    <td className="px-4 py-3 font-mono text-foreground font-semibold">{item.stock}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{item.min}</td>
                    <td className="px-4 py-3 w-32">
                      <div className="bg-muted rounded-full h-1.5 w-full">
                        <div
                          className={`h-1.5 rounded-full ${getStockBarColor(status)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-muted-foreground font-mono mt-1">{pct}%</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-mono ${getStatusBadgeClass(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(status === "Low" || status === "Critical") && (
                        <button
                          onClick={() => { setReorderItem(item); setReorderForm({ qty: "", cost: "" }); }}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 hover:border-foreground/20 transition-colors"
                        >
                          <Plus size={10} /> Reorder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Draft Panel */}
      {reorderItem && (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Draft Petty Cash — Reorder Request</span>
            <button onClick={() => setReorderItem(null)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X size={13} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Item</label>
              <input value={reorderItem.name} readOnly className={`w-full ${inputCls} opacity-60`} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Quantity ({reorderItem.unit})</label>
              <input
                type="number"
                placeholder={`e.g. ${reorderItem.min - reorderItem.stock + reorderItem.max}`}
                value={reorderForm.qty}
                onChange={e => setReorderForm(f => ({ ...f, qty: e.target.value }))}
                className={`w-full ${inputCls}`}
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Estimated Cost (₱)</label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={reorderForm.cost}
                onChange={e => setReorderForm(f => ({ ...f, cost: e.target.value }))}
                className={`w-full ${inputCls}`}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                toast.success(`Reorder draft saved for ${reorderItem.name}`);
                setReorderItem(null);
              }}
              className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity"
            >
              <Save size={12} /> Save Draft
            </button>
            <button
              onClick={() => setReorderItem(null)}
              className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EAPayroll() {
  const [seamstresses, setSeamstresses] = useState<Seamstress[]>(
    eaSeamstressesInit.map(s => ({ ...s }))
  );
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-07-15");

  const inputCls = "bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";
  const inlineInputCls = "w-16 bg-muted border border-border rounded px-1.5 py-1 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  const totalGross = seamstresses.reduce((sum, s) => sum + s.bundles * s.rate, 0);
  const totalDeductions = seamstresses.reduce((sum, s) => sum + s.deductions, 0);
  const totalBonus = seamstresses.reduce((sum, s) => sum + s.bonus, 0);
  const totalNet = totalGross - totalDeductions + totalBonus;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Payroll Generation"
        action={
          <button
            onClick={() => {
              toast.success("Payroll submitted for approval", {
                description: `₱${totalNet.toLocaleString()} total — PDF payslips generated for 6 seamstresses`,
              });
            }}
            className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity"
          >
            <FileText size={12} /> Generate Payslips
          </button>
        }
      />

      {/* Pay Period */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pay Period</div>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Piece-rate Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Seamstress", "Bundles", "Rate/Bundle", "Gross Pay", "Deductions", "Bonus", "Net Pay"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {seamstresses.map((s, i) => {
                const gross = s.bundles * s.rate;
                const net = gross - s.deductions + s.bonus;
                return (
                  <tr key={s.name} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{s.bundles}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">₱{s.rate}</td>
                    <td className="px-4 py-3 font-mono text-foreground">₱{gross.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.deductions}
                        onChange={e => setSeamstresses(prev => prev.map((sm, idx) =>
                          idx === i ? { ...sm, deductions: Number(e.target.value) || 0 } : sm
                        ))}
                        className={inlineInputCls}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={s.bonus}
                        onChange={e => setSeamstresses(prev => prev.map((sm, idx) =>
                          idx === i ? { ...sm, bonus: Number(e.target.value) || 0 } : sm
                        ))}
                        className={inlineInputCls}
                      />
                    </td>
                    <td className={`px-4 py-3 font-mono font-semibold ${net < 0 ? "text-red-500" : "text-emerald-500"}`}>
                      ₱{net.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Summary row */}
            <tfoot>
              <tr className="border-t border-border bg-muted/30 font-semibold">
                <td className="px-4 py-3 text-foreground text-[11px] uppercase tracking-wider" colSpan={3}>Totals</td>
                <td className="px-4 py-3 font-mono text-foreground">₱{totalGross.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-foreground">₱{totalDeductions.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-foreground">₱{totalBonus.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-foreground">₱{totalNet.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payroll History */}
      <div>
        <SectionHeader title="Payroll History" />
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Period", "Seamstresses", "Total", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {eaPayrollHistory.map((p, i) => (
                  <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{p.period}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{p.count}</td>
                    <td className="px-4 py-3 font-mono text-foreground">₱{p.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                        <Download size={11} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EA App Shell ─────────────────────────────────────────────────────────────

export default function EAApp({ onLogout }: { onLogout: () => void }) {
  const [eaPage, setEaPage] = useState("ea-dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function renderEAContent() {
    if (eaPage === "ea-dashboard")  return <EADashboard />;
    if (eaPage === "ea-production") return <EAProduction />;
    if (eaPage === "ea-pettycash")  return <EAPettyCash />;
    if (eaPage === "ea-inventory")  return <EAInventory />;
    if (eaPage === "ea-payroll")    return <EAPayroll />;
    return null;
  }

  const nav = [
    { key: "ea-dashboard",  label: "Command Center", icon: LayoutDashboard },
    { key: "ea-production", label: "Production",     icon: Package },
    { key: "ea-pettycash",  label: "Petty Cash",     icon: DollarSign },
    { key: "ea-inventory",  label: "Inventory",      icon: Archive },
    { key: "ea-payroll",    label: "Payroll",         icon: FileText },
  ];

  const pageLabel: Record<string, string> = {
    "ea-dashboard":  "Command Center",
    "ea-production": "Production",
    "ea-pettycash":  "Petty Cash",
    "ea-inventory":  "Inventory",
    "ea-payroll":    "Payroll",
  };

  const eaNotifications = eaTriageFeed.slice(0, 4);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-display)" }}>
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 border-r border-border transition-all duration-200 ${sidebarOpen ? "w-56" : "w-14"}`}
        style={{ background: "var(--sidebar)" }}
      >
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--sidebar-border)]">
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-background font-mono">TC</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-foreground tracking-widest uppercase whitespace-nowrap">TILAO CORP</div>
              <div className="text-[9px] text-muted-foreground font-mono whitespace-nowrap">EA Portal</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-none">
          {nav.map(item => {
            const Icon = item.icon;
            const isActive = eaPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setEaPage(item.key)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-foreground bg-[var(--sidebar-accent)]"
                    : "text-[var(--sidebar-foreground)] hover:text-foreground hover:bg-[var(--sidebar-accent)]"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-[var(--sidebar-border)]">
            <div className="text-[10px] text-muted-foreground font-mono">v2.4.1 · EA Build</div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-12 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Menu size={15} />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">EA Portal</span>
            <ChevronRight size={11} />
            <span className="text-foreground font-medium">{pageLabel[eaPage] ?? eaPage}</span>
          </div>

          <div className="relative ml-auto w-48">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search requests…"
              className="w-full bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Bell size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                </div>
                <div className="divide-y divide-border/50">
                  {eaNotifications.map((n, i) => {
                    const color =
                      n.type === "warn" ? "text-amber-500" :
                      n.type === "ok" ? "text-emerald-500" : "text-blue-500";
                    return (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] cursor-pointer">
                        <AlertCircle size={12} className={`${color} mt-0.5 shrink-0`} />
                        <div>
                          <p className="text-[11px] text-foreground leading-snug">{n.msg}</p>
                          <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-muted transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-[10px] font-bold text-background">SL</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-medium text-foreground leading-none">Sofia Lim</div>
                <div className="text-[9px] text-muted-foreground font-mono leading-none mt-0.5">Executive Assistant</div>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                {[{ label: "My Profile", icon: User }].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors"
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
                <div className="border-t border-border" />
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {renderEAContent()}
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-5 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span>v2.4.1 · EA Portal · Sofia Lim</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">© 2026 TILAO CORP</span>
        </footer>
      </div>
    </div>
  );
}
