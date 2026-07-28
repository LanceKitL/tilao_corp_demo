import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard, Package, DollarSign, Archive, FileText,
  ChevronRight, Search, LogOut, User, Bell, Menu, X,
  AlertCircle, Clock, CheckCircle, Flag, Eye, Plus, Save,
  TrendingUp, TrendingDown, Download, RefreshCw, Filter, BarChart3,
  ShoppingCart, Wallet, Receipt, Zap, Grid3X3, Star, Printer, BookOpen,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatusBadge, KPICard, SectionHeader } from "./shared";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import "driver.js/dist/driver.css";
import { driver } from "driver.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type Bundle = {
  id: string; design: string; seamstress: string;
  status: string; qty: number; updated: string; flagged: boolean;
};

type FinanceMonth = {
  month: string; expense: number; profit: number; revenue: number;
};

type SupplyItem = {
  id: string; name: string; category: string; unit: string;
  stock: number; min: number; max: number;
};

type Replenishment = {
  id: string; amount: number; reason: string; dept: string;
  status: string; submitted: string;
};

type ExecProduct = {
  id: string; name: string; brand: string; collection: string;
  category: string; price: number; sold: number; revenue: number; status: string; stock: number;
};

type SellerSale = {
  product: string; qty: number; price: number;
};

type OnlineSeller = {
  id: string; name: string; platform: string; rate: number; sales: SellerSale[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const execBundles: Bundle[] = [
  { id: "BND-20260722-0012", design: "Alexa Long Sleeve Top", seamstress: "Maria Santos", status: "Pending QC", qty: 24, updated: "1:05 PM", flagged: false },
  { id: "BND-20260722-0011", design: "Martina Scoop Neck Top", seamstress: "Liza Cruz", status: "Pending QC", qty: 30, updated: "12:45 PM", flagged: false },
  { id: "BND-20260722-0010", design: "Arya Tank Top", seamstress: "Rosa Mendez", status: "Approved", qty: 20, updated: "11:30 AM", flagged: false },
  { id: "BND-20260722-0009", design: "Lounge Pants Plain", seamstress: "Cita Bautista", status: "In Progress", qty: 15, updated: "10:15 AM", flagged: true },
  { id: "BND-20260722-0008", design: "Klea Mini Dress", seamstress: "Ana Torres", status: "Back Job", qty: 18, updated: "9:50 AM", flagged: false },
  { id: "BND-20260722-0007", design: "Lounge Pants Ribbed", seamstress: "Maria Santos", status: "In Progress", qty: 20, updated: "9:30 AM", flagged: false },
  { id: "BND-20260722-0006", design: "Trouser Pants Straight", seamstress: "Liza Cruz", status: "Approved", qty: 12, updated: "4:00 PM", flagged: false },
  { id: "BND-20260722-0005", design: "Biker Shorts", seamstress: "Rosa Mendez", status: "Completed", qty: 22, updated: "3:20 PM", flagged: false },
];

const execFinanceData: FinanceMonth[] = [
  { month: "Feb", expense: 6200, profit: 12400, revenue: 18600 },
  { month: "Mar", expense: 7800, profit: 14600, revenue: 22400 },
  { month: "Apr", expense: 5400, profit: 9200, revenue: 14600 },
  { month: "May", expense: 9100, profit: 13800, revenue: 22900 },
  { month: "Jun", expense: 8300, profit: 11500, revenue: 19800 },
  { month: "Jul", expense: 8320, profit: 12450, revenue: 20770 },
];

const execLowSupplies: SupplyItem[] = [
  { id: "MAT-002", name: "Cotton Spandex Jersey 92/8 (Ivory)", category: "Fabrics", unit: "meters", stock: 35, min: 50, max: 200 },
  { id: "MAT-004", name: "Poly Rib Knit 62/33/5 (Oat)", category: "Fabrics", unit: "meters", stock: 12, min: 30, max: 120 },
  { id: "MAT-005", name: "Polyester Thread 504 (Black)", category: "Threads", unit: "spools", stock: 8, min: 20, max: 60 },
  { id: "MAT-006", name: "Polyester Thread 406 Coverstitch (White)", category: "Threads", unit: "spools", stock: 14, min: 20, max: 60 },
  { id: "MAT-009", name: "Hang Tag (Mera Standard)", category: "Packaging", unit: "pieces", stock: 85, min: 100, max: 500 },
  { id: "MAT-011", name: "Clear Elastic Tape 12mm (Shoulder)", category: "Accessories", unit: "meters", stock: 45, min: 80, max: 300 },
  { id: "MAT-012", name: "YKK Zipper 20cm (Black)", category: "Accessories", unit: "pieces", stock: 38, min: 60, max: 200 },
];

const execReplenishments: Replenishment[] = [
  { id: "REQ-2045", amount: 3500, reason: "Fabric purchase from online supplier", dept: "Operations", status: "Pending", submitted: "Jul 22, 2026" },
  { id: "REQ-2044", amount: 1200, reason: "Thread restock from local supplier", dept: "Production", status: "Pending", submitted: "Jul 22, 2026" },
  { id: "REQ-2043", amount: 850, reason: "Office supplies", dept: "Finance", status: "Endorsed", submitted: "Jul 21, 2026" },
  { id: "REQ-2042", amount: 2200, reason: "Packaging materials", dept: "Operations", status: "Returned", submitted: "Jul 21, 2026" },
  { id: "REQ-2041", amount: 450, reason: "Inspection tools", dept: "Quality", status: "Approved", submitted: "Jul 20, 2026" },
];

const execProducts: ExecProduct[] = [
  { id: "MR-098", name: "Klea Mini Dress", brand: "Mera", collection: "Mera Signature", category: "Knit", price: 850, sold: 342, revenue: 290700, status: "Active", stock: 45 },
  { id: "MR-102", name: "Martina Scoop Neck Top", brand: "Mera", collection: "Mera Essentials", category: "Knit", price: 450, sold: 528, revenue: 237600, status: "Active", stock: 120 },
  { id: "MR-101", name: "Arya Tank Top", brand: "Mera", collection: "Mera Essentials", category: "Knit", price: 350, sold: 612, revenue: 214200, status: "Active", stock: 200 },
  { id: "MR-100", name: "Lounge Pants Plain", brand: "Mera", collection: "Mera Loungewear", category: "Knit", price: 520, sold: 278, revenue: 144560, status: "Active", stock: 30 },
  { id: "MR-099", name: "Lounge Pants Ribbed", brand: "Mera", collection: "Mera Loungewear", category: "Knit", price: 580, sold: 195, revenue: 113100, status: "Active", stock: 12 },
  { id: "MR-097", name: "Premium Jeans High Rise", brand: "Mera", collection: "Mera Denim Edit", category: "Denim", price: 1200, sold: 87, revenue: 104400, status: "Active", stock: 8 },
  { id: "MR-103", name: "Alexa Long Sleeve Top", brand: "Mera", collection: "Mera Essentials", category: "Knit", price: 520, sold: 415, revenue: 215800, status: "Pending", stock: 65 },
  { id: "SP-044", name: "Biker Shorts", brand: "Sponty", collection: "Sponty Active", category: "Knit", price: 380, sold: 503, revenue: 191140, status: "Active", stock: 0 },
  { id: "SP-043", name: "Cropped Hoodie", brand: "Sponty", collection: "Sponty Street", category: "Knit", price: 680, sold: 164, revenue: 111520, status: "Active", stock: 22 },
  { id: "SP-045", name: "Oversized Street Tee", brand: "Sponty", collection: "Sponty Street", category: "Knit", price: 420, sold: 221, revenue: 92820, status: "Draft", stock: 15 },
  { id: "MR-104", name: "Satin Cami Top", brand: "Mera", collection: "Mera Signature", category: "Knit", price: 440, sold: 156, revenue: 68640, status: "Active", stock: 40 },
  { id: "SP-046", name: "Jogger Pants Cuffed", brand: "Sponty", collection: "Sponty Active", category: "Knit", price: 590, sold: 132, revenue: 77880, status: "Active", stock: 18 },
  { id: "MR-105", name: "Wide Leg Trouser", brand: "Mera", collection: "Mera Denim Edit", category: "Denim", price: 950, sold: 64, revenue: 60800, status: "Active", stock: 5 },
  { id: "SP-047", name: "Mesh Panel Sports Bra", brand: "Sponty", collection: "Sponty Active", category: "Knit", price: 360, sold: 98, revenue: 35280, status: "Active", stock: 0 },
];

const totalSold = execProducts.reduce((s, p) => s + p.sold, 0);
const totalProductRevenue = execProducts.reduce((s, p) => s + p.revenue, 0);
const sortedBySold = [...execProducts].sort((a, b) => b.sold - a.sold);
const bestPerformers = sortedBySold.slice(0, 3);
const weakPerformers = sortedBySold.slice(-3).reverse();

const latestFinMonth = execFinanceData[execFinanceData.length - 1];
const totalRevenue = execFinanceData.reduce((s, m) => s + m.revenue, 0);
const totalExpense = execFinanceData.reduce((s, m) => s + m.expense, 0);

const execSellers: OnlineSeller[] = [
  {
    id: "SLR-001", name: "Jessa B.", platform: "TikTok Shop", rate: 10,
    sales: [
      { product: "Alexa Long Sleeve Top", qty: 45, price: 520 },
      { product: "Arya Tank Top", qty: 62, price: 350 },
      { product: "Biker Shorts", qty: 38, price: 380 },
      { product: "Lounge Pants Ribbed", qty: 25, price: 580 },
      { product: "Martina Scoop Neck Top", qty: 52, price: 450 },
    ],
  },
  {
    id: "SLR-002", name: "Mico D.", platform: "Shopee", rate: 8,
    sales: [
      { product: "Klea Mini Dress", qty: 30, price: 850 },
      { product: "Lounge Pants Plain", qty: 42, price: 520 },
      { product: "Premium Jeans High Rise", qty: 18, price: 1200 },
      { product: "Cropped Hoodie", qty: 28, price: 680 },
      { product: "Oversized Street Tee", qty: 35, price: 420 },
    ],
  },
];

function calcSellerTotal(seller: OnlineSeller): number {
  return seller.sales.reduce((s, sale) => s + sale.qty * sale.price, 0);
}

function calcSellerCommission(seller: OnlineSeller): number {
  return calcSellerTotal(seller) * (seller.rate / 100);
}

const overallSales = execSellers.reduce((s, slr) => s + calcSellerTotal(slr), 0);
const overallCommissions = execSellers.reduce((s, slr) => s + calcSellerCommission(slr), 0);
const topSeller = [...execSellers].sort((a, b) => calcSellerTotal(b) - calcSellerTotal(a))[0];

// ─── Top KPI Row ──────────────────────────────────────────────────────────────

function ExecKpiRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KPICard label="Total Revenue" value={`₱${(totalRevenue / 1000).toFixed(1)}K`} sub="Feb–Jul 2026" icon={BarChart3} accent="bg-emerald-500/15 text-emerald-400" trend="up" />
      <KPICard label="Active Bundles" value={execBundles.filter(b => b.status === "In Progress" || b.status === "Pending QC").length} sub="Currently in production" icon={Package} accent="bg-blue-500/15 text-blue-400" />
      <KPICard label="Low Stock Items" value={execLowSupplies.length} sub="Below minimum threshold" icon={Archive} accent="bg-amber-500/15 text-amber-400" />
      <KPICard label="Pending Replenish" value={execReplenishments.filter(r => r.status === "Pending").length} sub="Awaiting approval" icon={Wallet} accent="bg-orange-500/15 text-orange-400" />
    </div>
  );
}

// ─── Widget 1: Production Tracking ──────────────────────────────────────────

function ProductionTracking() {
  const [selectedStatus, setSelectedStatus] = useState<string>("Completed");

  const cards = [
    { status: "Completed",   label: "Completed",   color: "bg-green-200",  dot: "bg-green-500" },
    { status: "In Progress", label: "In Progress", color: "bg-yellow-200", dot: "bg-yellow-500" },
    { status: "Back Job",    label: "Back Job",    color: "bg-orange-200", dot: "bg-orange-500" },
  ];

  const getBundles = (status: string) => execBundles.filter(b => b.status === status);
  const selectedBundles = selectedStatus ? getBundles(selectedStatus) : [];

  return (
    <div id="prod-tracking" className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Production Tracking</span>
        <span className="text-[10px] text-muted-foreground font-mono">{execBundles.length} total</span>
      </div>
      <div className="flex-1 flex flex-col gap-3 p-4">
        <div className="grid grid-cols-3 gap-3 min-h-[130px]">
          {cards.map(({ status, label, color, dot }) => {
            const bundles = getBundles(status);
            return (
              <div
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`relative ${color} rounded-lg p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center`}
              >
                <div className="absolute top-2.5 right-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${dot}`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${dot}`} />
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-700">{label}</div>
                <div className="text-3xl font-bold font-mono text-gray-800 mt-2">{bundles.length}</div>
                <div className="text-[11px] text-gray-600 font-mono mt-0.5">
                  bundle{bundles.length !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>

        {selectedBundles.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden flex-1">
            <div className="overflow-y-auto max-h-[220px]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 sticky top-0">
                  {["Bundle ID", "Design", "Seamstress", "Qty", "Updated"].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {selectedBundles.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2 font-mono text-[10px] text-foreground">{b.id.replace("BND-20260722-", "BND-0")}</td>
                    <td className="px-3 py-2 text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{b.design}</span>
                        {b.flagged && <span className="text-[8px] bg-red-500/15 text-red-500 px-1 py-0.5 rounded font-medium">RUSH</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{b.seamstress}</td>
                    <td className="px-3 py-2 font-mono text-foreground">{b.qty}</td>
                    <td className="px-3 py-2 text-muted-foreground font-mono text-[10px]">{b.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground font-mono">
        {execBundles.length} bundles
      </div>
    </div>
  );
}

// ─── Widget 2: Expense & Profit ────────────────────────────────────────────

function ExpenseProfit() {
  const cy = latestFinMonth;
  const margin = cy.revenue - cy.expense;
  const marginRate = ((margin / cy.revenue) * 100).toFixed(1);

  return (
    <div id="expense-profit" className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-[#333]">
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Expense & Profit</span>
      </div>
      <div className="p-4 space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue</div>
            <div className="text-lg font-semibold font-mono text-emerald-400">₱{(cy.revenue / 1000).toFixed(1)}K</div>
          </div>
          <div className="bg-muted/40 rounded p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Expense</div>
            <div className="text-lg font-semibold font-mono text-amber-400">₱{(cy.expense / 1000).toFixed(1)}K</div>
          </div>
          <div className="bg-muted/40 rounded p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Profit</div>
            <div className="text-lg font-semibold font-mono text-blue-400">₱{(margin / 1000).toFixed(1)}K</div>
          </div>
          <div className="bg-muted/40 rounded p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Margin</div>
            <div className="text-lg font-semibold font-mono text-foreground">{marginRate}%</div>
          </div>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={execFinanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, fontSize: 10 }}
                formatter={(value: number) => [`₱${value.toLocaleString()}`, undefined]}
              />
              <Bar dataKey="expense" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Expense" />
              <Bar dataKey="profit" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Widget 3: Low Supplies ─────────────────────────────────────────────────

function LowSupplies() {
  function status(item: SupplyItem): "Critical" | "Low" | "Good" {
    if (item.stock <= item.min * 0.5) return "Critical";
    if (item.stock <= item.min) return "Low";
    return "Good";
  }

  return (
    <div id="low-supplies" className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Low Supplies</span>
        <span className="text-[10px] font-mono bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded font-medium">{execLowSupplies.length}</span>
      </div>
      <div className="divide-y divide-border/50 flex-1 overflow-y-auto max-h-[260px]">
        {execLowSupplies.map(item => {
          const st = status(item);
          const pct = Math.min(100, Math.round((item.stock / item.max) * 100));
          const barColor = st === "Critical" ? "bg-red-500" : st === "Low" ? "bg-amber-500" : "bg-emerald-500";
          return (
            <div key={item.id} className="px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-foreground truncate">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.id} · {item.category}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold font-mono text-foreground">{item.stock}</div>
                  <div className="text-[9px] text-muted-foreground font-mono">min {item.min}</div>
                </div>
              </div>
              <div className="mt-1.5 w-full bg-muted rounded-full h-1">
                <div className={`h-1 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-[9px] font-mono font-medium ${st === "Critical" ? "text-red-400" : st === "Low" ? "text-amber-400" : "text-emerald-400"}`}>
                  {st}
                </span>
                <button className="text-[9px] text-primary hover:text-accent transition-colors font-medium">Reorder</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Widget 5: Quick Actions ───────────────────────────────────────────────

function QuickActions() {
  const actions = [
    { label: "New Bundle", icon: Package, color: "bg-blue-600 hover:bg-blue-500 text-white" },
    { label: "Add Supply", icon: Archive, color: "bg-violet-600 hover:bg-violet-500 text-white" },
    { label: "View Reports", icon: BarChart3, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
    { label: "Petty Cash", icon: Wallet, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
    { label: "Seamstresses", icon: User, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
    { label: "Export Data", icon: Download, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
  ];

  return (
    <div id="quick-actions" className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-[#333]">
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Quick Actions</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2 flex-1 content-start">
        {actions.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            onClick={() => toast(`Navigating to ${label}…`, { description: "This section is coming soon." })}
            className={`flex items-center gap-2 px-3 py-2.5 rounded text-xs font-medium transition-colors ${color}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Widget 6: Request Cash Replenishment ──────────────────────────────────

function CashReplenishment() {
  const [requests, setRequests] = useState<Replenishment[]>(execReplenishments);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", reason: "", dept: "Operations" });

  function submitRequest() {
    if (!form.amount || !form.reason) {
      toast.error("Please fill in all fields");
      return;
    }
    const newReq: Replenishment = {
      id: `REQ-${2000 + requests.length}`,
      amount: Number(form.amount),
      reason: form.reason,
      dept: form.dept,
      status: "Pending",
      submitted: "Just now",
    };
    setRequests(prev => [newReq, ...prev]);
    setForm({ amount: "", reason: "", dept: "Operations" });
    setShowForm(false);
    toast.success(`Request ${newReq.id} submitted`, {
      description: `₱${newReq.amount.toLocaleString()} — ${newReq.reason}`,
    });
  }

  return (
    <div id="cash-replenish" className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Request Cash Replenishment</span>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1 text-[10px] text-white hover:text-white/80 transition-colors font-medium"
        >
          <Plus size={11} /> {showForm ? "Cancel" : "New Request"}
        </button>
      </div>
      <div className="overflow-y-auto flex-1 max-h-[260px]">
        {showForm && (
          <div className="px-4 py-3 border-b border-border bg-muted/20 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-0.5">Amount (₱)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30"
                />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-0.5">Dept</label>
                <select
                  value={form.dept}
                  onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                  className="w-full bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  {["Operations", "Production", "Finance", "Quality", "R&D"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-0.5">Reason</label>
              <input
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                placeholder="Purpose of replenishment…"
                className="w-full bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30"
              />
            </div>
            <button
              onClick={submitRequest}
              className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-3 py-1.5 rounded text-xs font-medium transition-opacity w-full justify-center"
            >
              <Save size={11} /> Submit Request
            </button>
          </div>
        )}
        <div className="divide-y divide-border/50">
          {requests.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-foreground">{r.id}</span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{r.reason}</div>
                <div className="text-[9px] text-muted-foreground font-mono">{r.dept} · {r.submitted}</div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <div className="text-xs font-semibold font-mono text-foreground">₱{r.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Inventory View ─────────────────────────────────────────────────────────

const inventoryCategories = ["All", "Knit", "Denim"];
const inventoryCollections = ["All", "Mera Essentials", "Mera Loungewear", "Mera Signature", "Mera Denim Edit", "Sponty Street", "Sponty Active"];

const knownImages = new Set(["alexa_long_sleeve_top", "arya_tank_top", "martina_scoop_neck_top"]);

function getProductImage(name: string): string | null {
  const slug = name.toLowerCase().replace(/\s+/g, "_");
  return knownImages.has(slug) ? `/designs/${slug}.webp` : null;
}

function ExecInventory() {
  const [catF, setCatF] = useState("All");
  const [colF, setColF] = useState("All");

  const [showGuide, setShowGuide] = useState(true);

  const filtered = execProducts.filter(p =>
    (catF === "All" || p.category === catF) &&
    (colF === "All" || p.collection === colF)
  );

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div id="exec-inv-kpis" className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Sold" value={totalSold.toLocaleString()} sub="All products lifetime" icon={ShoppingCart} accent="bg-blue-500/15 text-blue-400" trend="up" />
        <KPICard label="Total Revenue" value={`₱${(totalProductRevenue / 1000).toFixed(0)}K`} sub="All products lifetime" icon={BarChart3} accent="bg-emerald-500/15 text-emerald-400" trend="up" />
        <KPICard label="Best Seller" value={bestPerformers[0].name.split(" ")[0]} sub={`${bestPerformers[0].sold.toLocaleString()} units sold`} icon={Star} accent="bg-amber-500/15 text-amber-400" />
        <KPICard label="Products" value={execProducts.length} sub="Active in catalog" icon={Package} accent="bg-violet-500/15 text-violet-400" />
      </div>

      {/* Best & Weak Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Performers */}
        <div id="exec-best-performers" className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center gap-2">
        <Star size={12} className="text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Best Performers</span>
      </div>
          {/* #1 - Featured Card */}
          {bestPerformers.slice(0, 1).map(p => {
            const imgSrc = getProductImage(p.name);
            return (
              <div key={p.id} className="px-4 py-4">
                <div className="flex gap-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                  <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0">
                    {imgSrc ? (
                      <ImageWithFallback src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Package size={24} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold font-mono text-white">1</div>
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-sm text-foreground font-bold truncate leading-tight">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{p.brand}<span className="mx-1">·</span>{p.collection}</div>
                    <div className="flex gap-6 mt-1 pt-2 border-t border-emerald-500/20">
                      <div>
                        <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Total Sold</div>
                        <div className="text-sm font-bold font-mono text-emerald-400">{p.sold.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Profit</div>
                        <div className="text-sm font-bold font-mono text-emerald-400">₱{p.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Ranks 2 & 3 */}
          <div className="divide-y divide-border/50 border-t border-border/50">
            {bestPerformers.slice(1).map((p, i) => {
              const imgSrc = getProductImage(p.name);
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[9px] font-bold font-mono shrink-0">
                    {i + 2}
                  </div>
                  <div className="w-8 h-8 rounded bg-muted overflow-hidden shrink-0">
                    {imgSrc ? (
                      <ImageWithFallback src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Package size={12} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{p.brand} · {p.collection}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold font-mono text-emerald-400">{p.sold.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground font-mono">₱{(p.revenue / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Performers */}
        <div id="exec-weak-performers" className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center gap-2">
        <TrendingDown size={12} className="text-amber-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-white">Weak Performers</span>
      </div>
          {/* #1 - Featured Card */}
          {weakPerformers.slice(0, 1).map(p => {
            const imgSrc = getProductImage(p.name);
            return (
              <div key={p.id} className="px-4 py-4">
                <div className="flex gap-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                  <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden shrink-0">
                    {imgSrc ? (
                      <ImageWithFallback src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Package size={24} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold font-mono text-white">1</div>
                      <TrendingDown size={10} className="text-amber-400" />
                    </div>
                    <div className="text-sm text-foreground font-bold truncate leading-tight">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{p.brand}<span className="mx-1">·</span>{p.collection}</div>
                    <div className="flex gap-6 mt-1 pt-2 border-t border-amber-500/20">
                      <div>
                        <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Total Sold</div>
                        <div className="text-sm font-bold font-mono text-amber-400">{p.sold.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Profit</div>
                        <div className="text-sm font-bold font-mono text-amber-400">₱{p.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Ranks 2 & 3 */}
          <div className="divide-y divide-border/50 border-t border-border/50">
            {weakPerformers.slice(1).map((p, i) => {
              const imgSrc = getProductImage(p.name);
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[9px] font-bold font-mono shrink-0">
                    {i + 2}
                  </div>
                  <div className="w-8 h-8 rounded bg-muted overflow-hidden shrink-0">
                    {imgSrc ? (
                      <ImageWithFallback src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Package size={12} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{p.brand} · {p.collection}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold font-mono text-amber-400">{p.sold.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground font-mono">₱{(p.revenue / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Filter size={11} className="text-muted-foreground" />
          <select
            value={catF}
            onChange={e => setCatF(e.target.value)}
            className="bg-muted border border-border rounded px-2 py-1.5 text-[11px] text-foreground focus:outline-none"
          >
            {inventoryCategories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <select
          value={colF}
          onChange={e => setColF(e.target.value)}
          className="bg-muted border border-border rounded px-2 py-1.5 text-[11px] text-foreground focus:outline-none"
        >
          {inventoryCollections.map(c => <option key={c}>{c}</option>)}
        </select>
        <span className="text-[10px] text-muted-foreground font-mono">{filtered.length} products</span>
      </div>

      {/* Product Grid */}
      <div id="exec-product-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {filtered.map(p => {
          const imgSrc = getProductImage(p.name);
          const stockColor = p.stock >= 50 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-400" : "bg-red-500";
          return (
            <div key={p.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-white/15 transition-all duration-200 group">
              <div className="aspect-square bg-muted overflow-hidden relative">
                {imgSrc ? (
                  <ImageWithFallback
                    src={imgSrc}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Package size={20} className="text-muted-foreground/30" />
                  </div>
                )}
                <div className={`absolute top-1.5 right-1.5 ${stockColor} text-white text-[9px] font-bold font-mono w-6 h-6 rounded-full flex items-center justify-center shadow-sm`}>
                  {p.stock}
                </div>
              </div>
              <div className="p-2 space-y-1">
                <div className="text-[11px] font-semibold text-foreground truncate leading-tight">{p.name}</div>
                <div className="text-[9px] font-mono text-muted-foreground">{p.id}</div>
                <div className="text-[11px] font-semibold font-mono text-foreground">₱{p.price}</div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-muted-foreground">{p.sold.toLocaleString()} sold</span>
                  <span className="font-mono font-semibold text-emerald-400">₱{(p.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showGuide && (
        <div className="fixed bottom-4 right-4 z-50 flex items-start gap-3 bg-card border border-border rounded-lg p-3 w-fit shadow-xl">
          <div className="space-y-1">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Stock Guide</div>
            <div className="flex items-center gap-2 text-[10px] text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> ≥50 — In Stock
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" /> 1–49 — Low Stock
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" /> 0 — Out of Stock
            </div>
          </div>
          <button onClick={() => setShowGuide(false)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5">
            <X size={12} />
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package size={24} className="mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-[11px] text-muted-foreground">No products match the selected filters.</p>
        </div>
      )}
    </div>
  );
}

// ─── Payroll View ────────────────────────────────────────────────────────────

function ExecPayroll() {
  const [sellers, setSellers] = useState<OnlineSeller[]>(JSON.parse(JSON.stringify(execSellers)));
  const [period, setPeriod] = useState("July 2026");
  const [payslipSeller, setPayslipSeller] = useState<OnlineSeller | null>(null);
  const [showAddSeller, setShowAddSeller] = useState(false);
  const [newSellerForm, setNewSellerForm] = useState({
    name: "", platform: "TikTok Shop", rate: 10,
    products: [] as { productId: string; productName: string; qty: number; price: number }[],
  });

  const periods = ["July 2026", "June 2026", "May 2026"];

  function updateRate(id: string, rate: number) {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, rate } : s));
  }

  const totalSales = sellers.reduce((s, slr) => s + calcSellerTotal(slr), 0);
  const totalComm = sellers.reduce((s, slr) => s + calcSellerCommission(slr), 0);
  const top = [...sellers].sort((a, b) => calcSellerTotal(b) - calcSellerTotal(a))[0];
  const avgRate = sellers.reduce((s, slr) => s + slr.rate, 0) / sellers.length;

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div id="exec-payroll-kpis" className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Sales" value={`₱${(totalSales / 1000).toFixed(0)}K`} sub="All sellers combined" icon={BarChart3} accent="bg-blue-500/15 text-blue-400" trend="up" />
        <KPICard label="Total Commissions" value={`₱${(totalComm / 1000).toFixed(0)}K`} sub="Payout due" icon={Wallet} accent="bg-emerald-500/15 text-emerald-400" />
        <KPICard label="Top Seller" value={top.name.split(" ")[0]} sub={`₱${(calcSellerTotal(top) / 1000).toFixed(0)}K in sales`} icon={Star} accent="bg-amber-500/15 text-amber-400" />
        <KPICard label="Avg Commission" value={`${avgRate.toFixed(1)}%`} sub="Across all sellers" icon={TrendingUp} accent="bg-violet-500/15 text-violet-400" />
      </div>

      {/* Period Selector + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-muted-foreground" />
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="bg-muted border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none"
          >
            {periods.map(p => <option key={p}>{p}</option>)}
          </select>
          <button
            id="exec-add-seller-btn"
            onClick={() => {
              setNewSellerForm({ name: "", platform: "TikTok Shop", rate: 10, products: [] });
              setShowAddSeller(true);
            }}
            className="flex items-center gap-1 text-[10px] text-black bg-white/80 hover:bg-white transition-colors font-medium rounded px-2.5 py-1.5"
          >
            <Plus size={11} /> Add Seller
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="bg-muted/60 border border-border/50 rounded-full px-2.5 py-1 font-mono text-muted-foreground">{sellers.length} sellers</span>
          <span className="text-muted-foreground font-mono">₱{(totalSales).toLocaleString()} total</span>
        </div>
      </div>

      {/* Per-Seller Cards */}
      <div id="exec-seller-cards" className="space-y-3">
        {sellers.map(slr => {
          const sellerTotal = calcSellerTotal(slr);
          const sellerComm = calcSellerCommission(slr);
          return (
            <div key={slr.id} className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Seller Header */}
              <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {slr.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{slr.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{slr.platform} · {slr.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-muted/20 border border-border/50 rounded px-2 py-1">
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Rate</span>
                    <input
                      type="number"
                      value={slr.rate}
                      onChange={e => updateRate(slr.id, Number(e.target.value) || 0)}
                      className="w-12 bg-transparent border-0 text-xs text-foreground font-mono text-center focus:outline-none p-0"
                    />
                    <span className="text-[9px] text-muted-foreground">%</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold font-mono text-emerald-400">₱{sellerComm.toLocaleString()}</div>
                    <div className="text-[9px] text-muted-foreground">commission</div>
                  </div>
                </div>
              </div>

              {/* Sales Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Product", "Qty", "Unit Price", "Total", "Commission"].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-muted-foreground font-medium uppercase tracking-wider text-[9px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {slr.sales.map((sale, i) => {
                      const lineTotal = sale.qty * sale.price;
                      const lineComm = lineTotal * (slr.rate / 100);
                      return (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-2 text-foreground font-medium">{sale.product}</td>
                          <td className="px-4 py-2 font-mono text-muted-foreground">{sale.qty}</td>
                          <td className="px-4 py-2 font-mono text-muted-foreground">₱{sale.price}</td>
                          <td className="px-4 py-2 font-mono text-foreground">₱{lineTotal.toLocaleString()}</td>
                          <td className="px-4 py-2 font-mono text-foreground">₱{lineComm.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-muted/30 font-semibold">
                      <td className="px-4 py-2 text-[10px] text-foreground uppercase tracking-wider">Subtotal</td>
                      <td className="px-4 py-2 font-mono text-foreground">{slr.sales.reduce((s, x) => s + x.qty, 0)}</td>
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2 font-mono text-foreground">₱{sellerTotal.toLocaleString()}</td>
                      <td className="px-4 py-2 font-mono text-foreground">₱{sellerComm.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Actions */}
              <div className="px-4 py-2.5 border-t border-border bg-muted/10 flex justify-end">
                <button
                  onClick={() => setPayslipSeller(slr)}
                  className="flex items-center gap-1.5 text-[10px] text-black hover:text-black/80 bg-white/80 hover:bg-white transition-colors font-medium rounded px-2.5 py-1"
                >
                  <FileText size={11} /> View Payslip
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Totals */}
      <div id="exec-grand-totals" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
            <BarChart3 size={16} className="text-blue-400" />
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Combined Sales</div>
            <div className="text-lg font-semibold font-mono text-foreground">₱{totalSales.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Wallet size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Total Commissions</div>
            <div className="text-lg font-semibold font-mono text-emerald-400">₱{totalComm.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-violet-400" />
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Average Rate</div>
            <div className="text-lg font-semibold font-mono text-foreground">{avgRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      {payslipSeller && (
        <div className="print-payslip-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <style>{`
            @media print {
              body > :not(.print-payslip-modal) { display: none !important; }
              .print-payslip-modal { position: fixed !important; inset: 0 !important; background: white !important; z-index: 9999 !important; padding: 0 !important; align-items: flex-start !important; }
              .print-payslip-modal .payslip-actions { display: none !important; }
              .print-payslip-modal .payslip-inner { box-shadow: none !important; border: none !important; border-radius: 0 !important; max-width: 100% !important; }
            }
          `}</style>
          <div className="payslip-inner bg-card border border-border rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Payslip Content */}
            <div id="payslip-content" className="p-6 space-y-5">
              {/* Header */}
              <div className="text-center border-b border-border pb-4">
                <div className="text-sm font-bold text-foreground tracking-widest uppercase">TILAO CORP</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Seller Commission Payslip</div>
              </div>

              {/* Seller Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Seller</div>
                  <div className="font-semibold text-foreground mt-0.5">{payslipSeller.name}</div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Platform</div>
                  <div className="font-semibold text-foreground mt-0.5">{payslipSeller.platform}</div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Period</div>
                  <div className="font-semibold text-foreground mt-0.5">{period}</div>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Commission Rate</div>
                  <div className="font-semibold text-foreground mt-0.5">{payslipSeller.rate}%</div>
                </div>
              </div>

              {/* Sales Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Product", "Qty", "Price", "Total", "Comm."].map(h => (
                      <th key={h} className="text-left px-2 py-1.5 text-muted-foreground font-medium uppercase tracking-wider text-[9px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {payslipSeller.sales.map((sale, i) => {
                    const lineTotal = sale.qty * sale.price;
                    const lineComm = lineTotal * (payslipSeller.rate / 100);
                    return (
                      <tr key={i}>
                        <td className="px-2 py-1.5 text-foreground">{sale.product}</td>
                        <td className="px-2 py-1.5 font-mono text-muted-foreground">{sale.qty}</td>
                        <td className="px-2 py-1.5 font-mono text-muted-foreground">₱{sale.price}</td>
                        <td className="px-2 py-1.5 font-mono text-foreground">₱{lineTotal.toLocaleString()}</td>
                        <td className="px-2 py-1.5 font-mono text-foreground">₱{lineComm.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border font-semibold">
                    <td className="px-2 py-2 text-[10px] uppercase tracking-wider">Total</td>
                    <td className="px-2 py-2 font-mono">{payslipSeller.sales.reduce((s, x) => s + x.qty, 0)}</td>
                    <td className="px-2 py-2" />
                    <td className="px-2 py-2 font-mono">₱{calcSellerTotal(payslipSeller).toLocaleString()}</td>
                    <td className="px-2 py-2 font-mono">₱{calcSellerCommission(payslipSeller).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Commission Due */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Commission Due</div>
                  <div className="text-lg font-bold font-mono text-emerald-500">₱{calcSellerCommission(payslipSeller).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Sales Total</div>
                  <div className="text-base font-semibold font-mono text-foreground">₱{calcSellerTotal(payslipSeller).toLocaleString()}</div>
                </div>
              </div>

              {/* Signature */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-12 text-xs">
                  <div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-6">Prepared By</div>
                    <div className="border-b border-border" />
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-6">Approved By</div>
                    <div className="border-b border-border" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="payslip-actions px-6 py-3 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={() => setPayslipSeller(null)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded border border-border hover:border-foreground/20 transition-colors"
              >
                <X size={12} /> Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-3 py-1.5 rounded text-xs font-medium transition-opacity"
              >
                <Printer size={12} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Seller Modal */}
      {showAddSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-border bg-[#333] flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-white">New Seller</span>
              <button onClick={() => setShowAddSeller(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Seller Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Seller Name</label>
                  <input
                    type="text"
                    value={newSellerForm.name}
                    onChange={e => setNewSellerForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Jessa B."
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Platform</label>
                  <select
                    value={newSellerForm.platform}
                    onChange={e => setNewSellerForm(f => ({ ...f, platform: e.target.value }))}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    {["TikTok Shop", "Shopee", "Lazada", "Facebook Marketplace"].map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground uppercase tracking-wider block mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    value={newSellerForm.rate}
                    onChange={e => setNewSellerForm(f => ({ ...f, rate: Number(e.target.value) || 0 }))}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30"
                  />
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Products Sold</span>
                  <button
                    onClick={() => setNewSellerForm(f => ({ ...f, products: [...f.products, { productId: "", productName: "", qty: 1, price: 0 }] }))}
                    className="flex items-center gap-1 text-[10px] text-white bg-foreground/10 hover:bg-foreground/20 transition-colors font-medium rounded px-2 py-1"
                  >
                    <Plus size={10} /> Add Product
                  </button>
                </div>
                {newSellerForm.products.length === 0 && (
                  <div className="text-center py-6 text-[11px] text-muted-foreground">
                    No products added yet. Click "Add Product" to include items.
                  </div>
                )}
                <div className="space-y-2">
                  {newSellerForm.products.map((prod, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/20 border border-border/50 rounded p-2">
                      <select
                        value={prod.productId}
                        onChange={e => {
                          const selected = execProducts.find(p => p.id === e.target.value);
                          const newProds = [...newSellerForm.products];
                          newProds[i] = {
                            productId: e.target.value,
                            productName: selected?.name ?? "",
                            qty: prod.qty,
                            price: selected?.price ?? 0,
                          };
                          setNewSellerForm(f => ({ ...f, products: newProds }));
                        }}
                        className="flex-1 min-w-0 bg-muted border border-border rounded px-2 py-1.5 text-[10px] text-foreground focus:outline-none"
                      >
                        <option value="">Select product</option>
                        {execProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={prod.qty || ""}
                        onChange={e => {
                          const newProds = [...newSellerForm.products];
                          newProds[i] = { ...prod, qty: Number(e.target.value) || 0 };
                          setNewSellerForm(f => ({ ...f, products: newProds }));
                        }}
                        placeholder="Qty"
                        className="w-16 bg-muted border border-border rounded px-2 py-1.5 text-[10px] text-foreground font-mono text-center focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                        ₱{prod.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-foreground w-20 text-right font-semibold">
                        ₱{(prod.qty * prod.price).toLocaleString()}
                      </span>
                      <button
                        onClick={() => setNewSellerForm(f => ({ ...f, products: f.products.filter((_, j) => j !== i) }))}
                        className="text-red-400 hover:text-red-300 transition-colors shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {newSellerForm.products.length > 0 && (
                <div className="bg-muted/30 border border-border/50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Total Sales</div>
                    <div className="text-base font-bold font-mono text-foreground">
                      ₱{newSellerForm.products.reduce((s, p) => s + p.qty * p.price, 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Commission Due</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      ₱{(newSellerForm.products.reduce((s, p) => s + p.qty * p.price, 0) * newSellerForm.rate / 100).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setShowAddSeller(false)}
                  className="text-[10px] text-muted-foreground hover:text-foreground px-3 py-1.5 rounded border border-border hover:border-foreground/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newSellerForm.name.trim()) { toast.error("Please enter a seller name"); return; }
                    const sales: SellerSale[] = newSellerForm.products
                      .filter(p => p.productId && p.qty > 0)
                      .map(p => ({ product: p.productName, qty: p.qty, price: p.price }));
                    if (sales.length === 0) { toast.error("Add at least one product"); return; }
                    const newId = `SLR-${String(sellers.length + 1).padStart(3, "0")}`;
                    const seller: OnlineSeller = {
                      id: newId, name: newSellerForm.name.trim(),
                      platform: newSellerForm.platform, rate: newSellerForm.rate, sales,
                    };
                    setSellers(prev => [seller, ...prev]);
                    setShowAddSeller(false);
                    toast.success(`${seller.name} added as seller`);
                  }}
                  className="flex items-center gap-1 text-[10px] text-black bg-white/80 hover:bg-white transition-colors font-medium rounded px-3 py-1.5"
                >
                  <Save size={11} /> Save Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tour ──────────────────────────────────────────────────────────────────────

function startExecFullTour({ setPage }: { setPage: (page: string) => void }) {
  let phase = 0;

  function runPhase() {
    if (phase === 0) {
      setPage("exec-dashboard");
      setTimeout(() => {
        const d = driver({
          showProgress: true,
          animate: true,
          overlayColor: "rgba(0,0,0,0.5)",
          popoverClass: "mera-tour-popover",
          steps: [
            {
              element: "aside",
              popover: {
                title: "Sidebar Navigation",
                description: "Use the sidebar to switch between Dashboard, Inventory, and Payroll pages. The active page is highlighted.",
                side: "right" as const,
              },
            },
            {
              popover: {
                title: "Dashboard Overview",
                description: "Top-level KPIs show Total Revenue, Active Bundles, Low Stock Items, and Pending Replenishments at a glance.",
              },
            },
            {
              element: "#prod-tracking",
              popover: {
                title: "Production Tracking",
                description: "Click the colored cards (Completed, In Progress, Back Job) to filter bundles. A scrollable table shows details for the selected status.",
                side: "top" as const,
              },
            },
            {
              element: "#expense-profit",
              popover: {
                title: "Expense & Profit",
                description: "Monthly revenue vs expense breakdown with profit margin. The bar chart shows trends across Feb–Jul 2026.",
                side: "left" as const,
              },
            },
            {
              element: "#low-supplies",
              popover: {
                title: "Low Supplies",
                description: "Inventory items below minimum threshold. Red = Critical, Amber = Low. Click Reorder to restock.",
                side: "right" as const,
              },
            },
            {
              element: "#quick-actions",
              popover: {
                title: "Quick Actions",
                description: "Frequently used actions: New Bundle, Add Supply, View Reports, Petty Cash, Seamstresses, and Export Data.",
                side: "top" as const,
              },
            },
            {
              element: "#cash-replenish",
              popover: {
                title: "Request Cash Replenishment",
                description: "Create new cash requests or track existing ones. Each request shows amount, reason, department, and approval status.",
                side: "left" as const,
              },
            },
            {
              popover: {
                title: "Next: Inventory",
                description: "Now let's explore the Inventory page. Click Done to continue.",
              },
            },
          ],
          onFinish: () => { phase = 1; setTimeout(runPhase, 600); },
          onDestroyed: () => { if (phase === 0) localStorage.setItem("mera_exec_tour_seen", "1"); },
        });
        d.drive();
      }, 400);
    } else if (phase === 1) {
      setPage("exec-inventory");
      setTimeout(() => {
        const d = driver({
          showProgress: true,
          animate: true,
          overlayColor: "rgba(0,0,0,0.5)",
          popoverClass: "mera-tour-popover",
          steps: [
            {
              element: "#exec-inv-kpis",
              popover: {
                title: "Inventory Numbers",
                description: "Top KPI cards show Total Sold, Total Revenue, Best Seller name, and Product Count across your entire catalog.",
                side: "bottom" as const,
              },
            },
            {
              element: "#exec-best-performers",
              popover: {
                title: "Best Performers",
                description: "Top 3 products ranked by units sold. The #1 product is featured with image and detailed metrics; ranks 2 and 3 show thumbnail summaries.",
                side: "top" as const,
              },
            },
            {
              element: "#exec-weak-performers",
              popover: {
                title: "Weak Performers",
                description: "Bottom 3 products ranked by units sold. Same layout as Best Performers but with amber highlights for quick identification.",
                side: "top" as const,
              },
            },
            {
              element: "#exec-product-grid",
              popover: {
                title: "Product Grid",
                description: "Filterable catalog showing all products with stock indicator circles — green (≥50 in stock), amber (1–49 low stock), red (0 out of stock). Use the filters above to narrow by category or collection.",
                side: "top" as const,
              },
            },
            {
              popover: {
                title: "Next: Payroll",
                description: "Now let's explore the Payroll page. Click Done to continue.",
              },
            },
          ],
          onFinish: () => { phase = 2; setTimeout(runPhase, 600); },
          onDestroyed: () => { if (phase === 1) localStorage.setItem("mera_exec_tour_seen", "1"); },
        });
        d.drive();
      }, 400);
    } else if (phase === 2) {
      setPage("exec-payroll");
      setTimeout(() => {
        const d = driver({
          showProgress: true,
          animate: true,
          overlayColor: "rgba(0,0,0,0.5)",
          popoverClass: "mera-tour-popover",
          steps: [
            {
              element: "#exec-payroll-kpis",
              popover: {
                title: "Payroll Numbers",
                description: "Top KPI cards show Total Sales, Total Commissions, Top Seller, and Average Commission Rate across all online sellers.",
                side: "bottom" as const,
              },
            },
            {
              element: "#exec-add-seller-btn",
              popover: {
                title: "Add Seller",
                description: "Click 'Add Seller' to open the modal. Enter the seller's name, platform, commission rate, and the products they sold with quantities.",
                side: "left" as const,
              },
            },
            {
              element: "#exec-seller-cards",
              popover: {
                title: "Seller Cards",
                description: "Each seller card shows products sold, quantities, unit prices, line totals, and earned commission. The rate is editable inline and the commission updates in real time.",
                side: "top" as const,
              },
            },
            {
              element: "#exec-grand-totals",
              popover: {
                title: "View Payslip & Grand Totals",
                description: "At the bottom of each seller card, click 'View Payslip' for a detailed printable breakdown. Grand Totals below show combined sales, total commissions due, and average rate.",
                side: "top" as const,
              },
            },
          ],
          onFinish: () => { localStorage.setItem("mera_exec_tour_seen", "1"); },
          onDestroyed: () => { localStorage.setItem("mera_exec_tour_seen", "1"); },
        });
        d.drive();
      }, 400);
    }
  }

  runPhase();
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function ExecDashboard() {
  return (
    <div className="space-y-5">
      <ExecKpiRow />

      {/* Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ProductionTracking /></div>
        <div className="lg:col-span-1"><ExpenseProfit /></div>
      </div>

      {/* Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3"><LowSupplies /></div>
      </div>

      {/* Grid: Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1"><QuickActions /></div>
        <div className="lg:col-span-2"><CashReplenishment /></div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function ExecApp({ onLogout }: { onLogout: () => void }) {
  const [execPage, setExecPage] = useState("exec-dashboard");
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

  useEffect(() => {
    if (!localStorage.getItem("mera_exec_tour_seen")) {
      const timer = setTimeout(() => startExecFullTour({ setPage: setExecPage }), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const nav = [
    { key: "exec-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "exec-inventory", label: "Inventory", icon: Package },
    { key: "exec-payroll", label: "Payroll", icon: DollarSign },
  ];

  const pageLabel: Record<string, string> = {
    "exec-dashboard": "Dashboard",
    "exec-inventory": "Inventory",
    "exec-payroll": "Payroll",
  };

  function renderExecContent() {
    if (execPage === "exec-dashboard") return <ExecDashboard />;
    if (execPage === "exec-inventory") return <ExecInventory />;
    if (execPage === "exec-payroll") return <ExecPayroll />;
    return null;
  }

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
              <div className="text-[9px] text-muted-foreground font-mono whitespace-nowrap">Executive Portal</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-none">
          {nav.map(item => {
            const Icon = item.icon;
            const isActive = execPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setExecPage(item.key)}
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
            <div className="text-[10px] text-muted-foreground font-mono">v2.4.1 · Exec Build</div>
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
            <span className="text-foreground font-medium">Executive Portal</span>
            <ChevronRight size={11} />
            <span className="text-foreground font-medium">{pageLabel[execPage]}</span>
          </div>

          <div className="relative ml-auto w-48">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Tour */}
          <button
            onClick={() => startExecFullTour({ setPage: setExecPage })}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Start Tour"
          >
            <BookOpen size={15} />
          </button>

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
                  {[
                    { type: "warn", msg: "Pending replenishment requests need approval", time: "10 min ago" },
                    { type: "warn", msg: "Clear Elastic Tape stock critically low", time: "1 hr ago" },
                    { type: "info", msg: "Bundle BND-0009 flagged as Rush by EA", time: "2 hr ago" },
                    { type: "ok", msg: "Payroll for Jun 16–30 completed and disbursed", time: "Yesterday" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] cursor-pointer">
                      <AlertCircle size={12} className={`mt-0.5 shrink-0 ${n.type === "warn" ? "text-amber-500" : n.type === "ok" ? "text-emerald-500" : "text-blue-500"}`} />
                      <div>
                        <p className="text-[11px] text-foreground leading-snug">{n.msg}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
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
                <div className="text-[9px] text-muted-foreground font-mono leading-none mt-0.5">Executive</div>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors">
                  <User size={12} /> My Profile
                </button>
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
          {renderExecContent()}
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-5 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span>v2.4.1 · Executive Portal · Sofia Lim</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">© 2026 TILAO CORP</span>
        </footer>
      </div>
    </div>
  );
}
