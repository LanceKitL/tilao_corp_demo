import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, Shield, Key, Package, QrCode, Palette,
  DollarSign, RefreshCw, BarChart3, FileText, ClipboardList,
  Activity, Bell, Settings, Database, ChevronDown, ChevronRight,
  Search, LogOut, User, Lock, Plus, RotateCcw, Eye, Pencil,
  Trash2, CheckCircle, XCircle, AlertCircle, Clock, Server,
  HardDrive, Menu, X, TrendingUp, Download, Filter,
  UserPlus, Save, Archive, ShieldCheck, Cpu
} from "lucide-react";
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { StatusBadge, KPICard, SectionHeader } from "./shared";
import {
  productionData, auditLog, allUsers, allRoles, allBundles,
  allQRCodes, allDesigns, auditEventsData, pettyCashTx,
  replenishments, finData, fullAuditLog, backupHistory
} from "./data";
import RDApp from "./RDApp";
import ProdApp from "./ProdApp";
import EAApp from "./EAApp";
import ExecApp from "./ExecApp";
import LoginView from "./LoginView";

// ─── Data ───────────────────────────────────────────────────────────────────

const userDistData = [
  { name: "Admin", value: 3 },
  { name: "R&D", value: 7 },
  { name: "Production", value: 10 },
  { name: "QC", value: 5 },
  { name: "Finance", value: 4 },
  { name: "Manager", value: 3 },
];

const activityData = [
  { day: "Mon", logins: 24, bundles: 8, qc: 12 },
  { day: "Tue", logins: 31, bundles: 14, qc: 9 },
  { day: "Wed", logins: 27, bundles: 11, qc: 15 },
  { day: "Thu", logins: 38, bundles: 19, qc: 11 },
  { day: "Fri", logins: 42, bundles: 22, qc: 18 },
  { day: "Sat", logins: 14, bundles: 5, qc: 6 },
  { day: "Sun", logins: 9, bundles: 2, qc: 3 },
];

const CHART_COLORS = ["#3b82f6", "#22d3ee", "#10b981", "#f59e0b", "#a78bfa", "#f87171"];

const recentActivities = [
  { time: "9:30 AM", user: "R&D", activity: "Released Design D-102", module: "Design" },
  { time: "10:05 AM", user: "QC Team", activity: "Approved Bundle B-201", module: "QC" },
  { time: "10:30 AM", user: "Finance", activity: "Submitted Replenishment #R-088", module: "Finance" },
  { time: "11:15 AM", user: "Admin", activity: "Created New User — J. Reyes", module: "Users" },
  { time: "11:42 AM", user: "Production", activity: "Bundle B-205 sent to QC", module: "Production" },
  { time: "12:10 PM", user: "Manager", activity: "Approved Petty Cash #PC-034", module: "Finance" },
];

const pendingApprovals = [
  { id: "REQ-2041", type: "Replenishment", by: "Maria Santos", date: "Jul 22, 2026", status: "Pending" },
  { id: "REQ-2042", type: "Petty Cash", by: "Jose Cruz", date: "Jul 22, 2026", status: "Pending" },
  { id: "REQ-2043", type: "Bundle Release", by: "Ana Reyes", date: "Jul 21, 2026", status: "Under Review" },
  { id: "REQ-2044", type: "Design Approval", by: "R&D Team", date: "Jul 21, 2026", status: "Pending" },
  { id: "REQ-2045", type: "System Access", by: "IT Support", date: "Jul 20, 2026", status: "Under Review" },
];

const notifications = [
  { type: "warn", icon: AlertCircle, msg: "Failed login attempt — user: j.dela.cruz (3×)", time: "8 min ago" },
  { type: "warn", icon: HardDrive, msg: "Storage at 72% — approaching threshold", time: "1 hr ago" },
  { type: "info", icon: Clock, msg: "4 requests pending approval review", time: "2 hr ago" },
  { type: "ok", icon: CheckCircle, msg: "Daily backup completed successfully", time: "6 hr ago" },
  { type: "info", icon: Palette, msg: "New design D-103 released by R&D", time: "Yesterday" },
];

const permMatrix: Record<string, Record<string, boolean>> = {
  "View": { Admin: true, Manager: true, "R&D": true, Production: true, QC: true, Finance: true },
  "Create": { Admin: true, Manager: false, "R&D": true, Production: true, QC: false, Finance: true },
  "Edit": { Admin: true, Manager: false, "R&D": true, Production: true, QC: false, Finance: false },
  "Delete": { Admin: true, Manager: false, "R&D": false, Production: false, QC: false, Finance: false },
  "Approve": { Admin: true, Manager: true, "R&D": false, Production: false, QC: true, Finance: true },
  "Export": { Admin: true, Manager: true, "R&D": false, Production: false, QC: false, Finance: true },
};


// ─── Nav config ─────────────────────────────────────────────────────────────

const navSections = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
    items: [{ label: "Overview", key: "overview" }],
  },
  {
    label: "User Management",
    icon: Users,
    key: "users",
    items: [
      { label: "Users", key: "users-list" },
      { label: "Roles", key: "roles" },
      { label: "Permissions", key: "permissions" },
    ],
  },
  {
    label: "Production",
    icon: Package,
    key: "production",
    items: [
      { label: "Bundle Management", key: "bundles" },
      { label: "QR Code Management", key: "qr" },
    ],
  },
  {
    label: "Product",
    icon: Palette,
    key: "product",
    items: [{ label: "Design Management", key: "designs" }],
  },
  {
    label: "Finance",
    icon: DollarSign,
    key: "finance",
    items: [
      { label: "Petty Cash", key: "pettycash" },
      { label: "Replenishment Requests", key: "replenishment" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    key: "reports",
    items: [
      { label: "Production Reports", key: "prod-reports" },
      { label: "Financial Reports", key: "fin-reports" },
      { label: "Audit Reports", key: "audit-reports" },
    ],
  },
  {
    label: "System",
    icon: Settings,
    key: "system",
    items: [
      { label: "Audit Logs", key: "audit-logs" },
      { label: "Notifications", key: "notifications" },
      { label: "Settings", key: "settings" },
      { label: "Backup & Restore", key: "backup" },
    ],
  },
];

// ─── Views ──────────────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div>
        <SectionHeader title="System Overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard label="Total Users" value={32} sub="All registered accounts" icon={Users} accent="bg-blue-500/15 text-blue-400" trend="up" />
          <KPICard label="Active Users" value={27} sub="Currently enabled" icon={Activity} accent="bg-emerald-500/15 text-emerald-400" trend="up" />
          <KPICard label="Total Designs" value={148} sub="Released by R&D" icon={Palette} accent="bg-violet-500/15 text-violet-400" trend="up" />
          <KPICard label="Active Bundles" value={19} sub="In production" icon={Package} accent="bg-cyan-500/15 text-cyan-400" />
          <KPICard label="Pending QC" value={6} sub="Awaiting inspection" icon={ShieldCheck} accent="bg-amber-500/15 text-amber-400" />
          <KPICard label="Pending Approvals" value={5} sub="Requires action" icon={Clock} accent="bg-orange-500/15 text-orange-400" />
          <KPICard label="Petty Cash Balance" value="₱12,450" sub="Available funds" icon={DollarSign} accent="bg-emerald-500/15 text-emerald-400" />
          <KPICard label="System Health" value="98%" sub="All services nominal" icon={Cpu} accent="bg-blue-500/15 text-blue-400" trend="up" />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Add User", icon: UserPlus, color: "bg-blue-600 hover:bg-blue-500 text-white" },
            { label: "Create Role", icon: Shield, color: "bg-violet-600 hover:bg-violet-500 text-white" },
            { label: "Reset Password", icon: Lock, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
            { label: "View Audit Logs", icon: ClipboardList, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
            { label: "Backup Database", icon: Database, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
            { label: "System Settings", icon: Settings, color: "bg-slate-700 hover:bg-slate-600 text-slate-100" },
          ].map(({ label, icon: Icon, color }) => (
            <button key={label} className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${color}`}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Middle row — Activities + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Activities */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">Recent Activities</span>
            <span className="text-[10px] text-muted-foreground font-mono">Live</span>
          </div>
          <div className="divide-y divide-border">
            {recentActivities.map((a, i) => (
              <div key={i} className="px-4 py-2.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                <span className="text-[11px] text-muted-foreground font-mono w-16 shrink-0 pt-0.5">{a.time}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-foreground">{a.activity}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{a.user}</span>
                    <span className="text-[10px] text-border">·</span>
                    <span className="text-[10px] text-primary font-mono">{a.module}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333]">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">System Health</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: "Server Status", value: "Online", icon: Server, ok: true },
              { label: "Database", value: "Healthy", icon: Database, ok: true },
              { label: "QR Generator", value: "Running", icon: QrCode, ok: true },
              { label: "Daily Backup", value: "Completed", icon: Archive, ok: true },
            ].map(({ label, value, icon: Icon, ok }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <Icon size={13} className="text-muted-foreground" />
                  <span className="text-xs text-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`} />
                  <StatusBadge status={value} />
                </div>
              </div>
            ))}
            <div className="mt-2">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5"><HardDrive size={11} /> Storage</span>
                <span className="text-amber-400 font-mono font-medium">72% Used</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-amber-400" style={{ width: "72%" }} />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">108 GB / 150 GB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Pending Approvals</span>
          <button className="text-[11px] text-primary hover:text-accent transition-colors font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Request ID</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Type</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Requested By</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Date</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Status</th>
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pendingApprovals.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-2.5 font-mono text-primary">{r.id}</td>
                  <td className="px-4 py-2.5 text-foreground">{r.type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.by}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono">{r.date}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-2.5">
                    <button className="flex items-center gap-1 text-[11px] text-primary hover:text-accent transition-colors font-medium">
                      <Eye size={11} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333]">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">User Distribution</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={userDistData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {userDistData.map((entry, i) => (
                    <Cell key={`cell-${entry.name}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              {userDistData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="text-foreground font-mono ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333]">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">System Activity</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#94a3b8" }}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: "#64748b" }} />
                <Line key="line-logins" type="monotone" dataKey="logins" stroke="#0a0a0a" strokeWidth={2} dot={false} name="Logins" />
                <Line key="line-bundles" type="monotone" dataKey="bundles" stroke="#525252" strokeWidth={2} dot={false} name="Bundles" />
                <Line key="line-qc" type="monotone" dataKey="qc" stroke="#a3a3a3" strokeWidth={2} dot={false} name="QC" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333]">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">Monthly Production</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0f1623", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#94a3b8" }}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: "#64748b" }} />
                <Bar key="bar-created" dataKey="created" fill="#0a0a0a" radius={[2, 2, 0, 0]} name="Created" />
                <Bar key="bar-completed" dataKey="completed" fill="#404040" radius={[2, 2, 0, 0]} name="Completed" />
                <Bar key="bar-approved" dataKey="approved" fill="#737373" radius={[2, 2, 0, 0]} name="Approved" />
                <Bar key="bar-backjobs" dataKey="backjobs" fill="#c4c4c4" radius={[2, 2, 0, 0]} name="Back Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row — User Widget + Notifications + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Management Widget */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">User Accounts</span>
            <div className="flex gap-1">
              <button className="flex items-center gap-1 text-[11px] text-primary hover:text-accent transition-colors font-medium px-2 py-1 rounded border border-border hover:border-primary/40">
                <UserPlus size={10} /> Add
              </button>
              <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1 rounded border border-border">
                View All
              </button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Active", value: 27, color: "text-emerald-400" },
              { label: "Inactive", value: 3, color: "text-slate-400" },
              { label: "Locked", value: 2, color: "text-red-400" },
              { label: "New This Month", value: 4, color: "text-blue-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-muted/40 rounded p-3">
                <span className={`text-xl font-semibold font-mono ${color}`}>{value}</span>
                <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Recently Added</div>
            {allUsers.slice(0, 3).map((u) => (
              <div key={u.id} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
                <div>
                  <div className="text-[11px] text-foreground">{u.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{u.username}</div>
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">Notifications</span>
            <span className="w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">5</span>
          </div>
          <div className="divide-y divide-border/50">
            {notifications.map((n, i) => {
              const Icon = n.icon;
              const iconColor = n.type === "warn" ? "text-amber-400" : n.type === "ok" ? "text-emerald-400" : "text-blue-400";
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <Icon size={13} className={`${iconColor} mt-0.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground leading-snug">{n.msg}</p>
                    <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log Preview */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#333] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-white">Audit Log</span>
            <button className="text-[11px] text-primary hover:text-accent transition-colors font-medium">Full Log</button>
          </div>
          <div className="divide-y divide-border/50">
            {auditLog.map((a, i) => (
              <div key={i} className="px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-primary font-mono">{a.user}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{a.module}</span>
                </div>
                <div className="text-[11px] text-foreground">{a.action}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{a.dt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersView() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const roles = ["All", "Admin", "R&D", "Production", "QC", "Finance", "Manager"];
  const statuses = ["All", "Active", "Inactive", "Locked"];

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">User Management</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{allUsers.length} total accounts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-500 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
        >
          <UserPlus size={13} /> Add User
        </button>
      </div>

      {/* Add User Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">New User Account</span>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Employee ID", placeholder: "EMP-00X", type: "text" },
              { label: "Full Name", placeholder: "Juan Dela Cruz", type: "text" },
              { label: "Email", placeholder: "juan@tilao.com", type: "email" },
              { label: "Username", placeholder: "j.dela.cruz", type: "text" },
              { label: "Temp Password", placeholder: "••••••••", type: "password" },
              { label: "Contact Number", placeholder: "+63 9XX XXX XXXX", type: "text" },
            ].map(({ label, placeholder, type }) => (
              <div key={label}>
                <label className="text-[11px] text-muted-foreground mb-1 block">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Role</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                {roles.filter(r => r !== "All").map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Department</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                {["IT", "Finance", "Research", "Operations", "Quality"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Status</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-1.5 bg-primary hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-medium transition-colors">
              <Save size={12} /> Save User
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-1.5 bg-muted hover:bg-secondary text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors border border-border">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted border border-border rounded pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={11} className="text-muted-foreground" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors">
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-border text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
          <Download size={12} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Name", "Username", "Role", "Department", "Status", "Last Login", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{u.id}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{u.username}</td>
                  <td className="px-4 py-3 text-foreground">{u.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.dept}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{u.last}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {[
                        { icon: Eye, title: "View", color: "text-blue-400 hover:text-blue-300" },
                        { icon: Pencil, title: "Edit", color: "text-slate-400 hover:text-slate-200" },
                        { icon: Lock, title: "Reset Password", color: "text-amber-400 hover:text-amber-300" },
                        { icon: u.status === "Active" ? XCircle : CheckCircle, title: u.status === "Active" ? "Deactivate" : "Activate", color: "text-slate-400 hover:text-slate-200" },
                        { icon: Trash2, title: "Delete", color: "text-red-400 hover:text-red-300" },
                      ].map(({ icon: Icon, title, color }) => (
                        <button key={title} title={title} className={`p-1 rounded transition-colors ${color}`}><Icon size={12} /></button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {allUsers.length} users</span>
          <div className="flex gap-1">
            {[1].map(p => (
              <button key={p} className="w-6 h-6 text-[11px] rounded bg-primary text-white font-mono">{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Views ─────────────────────────────────────────────────────────────

function RolesView() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Roles</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage system roles and access levels</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> Create Role
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Roles" value={6} sub="All defined roles" icon={Shield} accent="bg-muted text-muted-foreground" />
        <KPICard label="System Roles" value={2} sub="Cannot be deleted" icon={Lock} accent="bg-muted text-muted-foreground" />
        <KPICard label="Custom Roles" value={4} sub="User-defined" icon={Key} accent="bg-muted text-muted-foreground" />
        <KPICard label="Users Assigned" value={32} sub="Across all roles" icon={Users} accent="bg-muted text-muted-foreground" />
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest">New Role</span>
            <button onClick={() => setShowForm(false)}><X size={13} className="text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Role Name</label>
              <input className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="e.g. Supervisor" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Description</label>
              <input className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="Role description" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-[11px] text-muted-foreground mb-2 block uppercase tracking-wider">Permission Groups</label>
            <div className="flex flex-wrap gap-2">
              {["User Management", "Production", "Finance", "Reports", "System"].map(g => (
                <label key={g} className="flex items-center gap-2 bg-muted border border-border rounded px-3 py-1.5 text-[11px] text-foreground cursor-pointer">
                  <input type="checkbox" className="accent-foreground" /> {g}
                </label>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Save Role
          </button>
        </div>
      )}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Role Name", "Description", "Users", "Permissions", "Type", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {allRoles.map(r => (
                <tr key={r.name} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.desc}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.users}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.perms}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-mono ${r.system ? "text-muted-foreground" : "text-foreground"}`}>{r.system ? "System" : "Custom"}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={12} /></button>
                      {!r.system && <button className="p-1 text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PermissionsView() {
  const roles = ["Admin", "Manager", "R&D", "Production", "QC", "Finance"];
  const actions = Object.keys(permMatrix);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Permissions</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Role-based permission matrix</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Save size={13} /> Save Changes
        </button>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px] w-32">Action</th>
                {roles.map(r => (
                  <th key={r} className="text-center px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {actions.map(action => (
                <tr key={action} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{action}</td>
                  {roles.map(role => {
                    const allowed = permMatrix[action]?.[role] ?? false;
                    return (
                      <td key={role} className="px-4 py-3 text-center">
                        <input type="checkbox" defaultChecked={allowed} className="accent-foreground w-3.5 h-3.5 cursor-pointer" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BundleManagementView() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const statuses = ["All", "In Progress", "QC Pending", "Completed", "Back Job"];
  const filtered = allBundles.filter(b =>
    (statusF === "All" || b.status === statusF) &&
    (b.id.toLowerCase().includes(search.toLowerCase()) || b.design.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Bundle Management</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{allBundles.length} total bundles</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> New Bundle
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Bundles" value={78} sub="All time" icon={Package} accent="bg-muted text-muted-foreground" />
        <KPICard label="Active" value={19} sub="In production" icon={Activity} accent="bg-muted text-muted-foreground" />
        <KPICard label="Completed" value={55} sub="QC approved" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="Back Jobs" value={14} sub="Needs rework" icon={RotateCcw} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bundle ID or design…" className="w-full bg-muted border border-border rounded pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Bundle ID", "Design", "Quantity", "Assigned To", "Status", "QC Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{b.id}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{b.design}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{b.qty.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.assigned}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={b.qc} /></td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{b.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QRCodeManagementView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">QR Code Management</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Track and manage generated QR codes</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> Generate QR
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Generated" value="1,204" sub="All time" icon={QrCode} accent="bg-muted text-muted-foreground" />
        <KPICard label="Active" value={892} sub="Currently valid" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="Expired" value={312} sub="Past validity" icon={XCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="Today" value={47} sub="Generated today" icon={Activity} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["QR ID", "Bundle ID", "Design", "Generated By", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {allQRCodes.map(q => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{q.id}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{q.bundle}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{q.design}</td>
                  <td className="px-4 py-3 text-muted-foreground">{q.by}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{q.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground" title="View"><Eye size={12} /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground" title="Download"><Download size={12} /></button>
                      {q.status === "Active" && <button className="p-1 text-muted-foreground hover:text-red-500" title="Deactivate"><XCircle size={12} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DesignManagementView() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const filtered = allDesigns.filter(d =>
    (statusF === "All" || d.status === statusF) &&
    (d.id.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Design Management</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{allDesigns.length} designs in library</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> Upload Design
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Designs" value={148} sub="In library" icon={Palette} accent="bg-muted text-muted-foreground" />
        <KPICard label="Active" value={132} sub="In production use" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="Archived" value={16} sub="Retired designs" icon={Archive} accent="bg-muted text-muted-foreground" />
        <KPICard label="Pending Approval" value={4} sub="Awaiting review" icon={Clock} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search design ID or name…" className="w-full bg-muted border border-border rounded pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
          {["All", "Active", "Archived", "Pending"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Design ID", "Name", "Version", "Created By", "Release Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{d.id}</td>
                  <td className="px-4 py-3 text-foreground">{d.name}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{d.version}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.by}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{d.released}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={12} /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Archive size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PettyCashView() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Petty Cash</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Transaction ledger and fund tracking</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> New Request
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Current Balance" value="₱12,450" sub="Available funds" icon={DollarSign} accent="bg-muted text-muted-foreground" />
        <KPICard label="Disbursed (Jul)" value="₱8,320" sub="This month" icon={TrendingUp} accent="bg-muted text-muted-foreground" />
        <KPICard label="Pending" value="₱1,200" sub="Awaiting approval" icon={Clock} accent="bg-muted text-muted-foreground" />
        <KPICard label="Replenishments" value={3} sub="This month" icon={RefreshCw} accent="bg-muted text-muted-foreground" />
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest">New Petty Cash Request</span>
            <button onClick={() => setShowForm(false)}><X size={13} className="text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Description</label>
              <input className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="e.g. Office supplies" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Amount (₱)</label>
              <input type="number" className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="0.00" />
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Submit Request
          </button>
        </div>
      )}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Transaction ID", "Description", "Amount", "Requested By", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pettyCashTx.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{t.id}</td>
                  <td className="px-4 py-3 text-foreground">{t.desc}</td>
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{t.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.by}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{t.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReplenishmentView() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Replenishment Requests</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Fund replenishment request tracking</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> Submit Request
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Requests" value={12} sub="All time" icon={RefreshCw} accent="bg-muted text-muted-foreground" />
        <KPICard label="Approved" value={8} sub="Processed" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="Pending" value={3} sub="Awaiting review" icon={Clock} accent="bg-muted text-muted-foreground" />
        <KPICard label="Rejected" value={1} sub="Declined" icon={XCircle} accent="bg-muted text-muted-foreground" />
      </div>
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest">New Replenishment Request</span>
            <button onClick={() => setShowForm(false)}><X size={13} className="text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Amount (₱)</label>
              <input type="number" className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Department</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                {["Finance", "IT", "Operations", "Research", "Quality"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[11px] text-muted-foreground mb-1 block">Purpose</label>
              <input className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="Reason for replenishment" />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] text-muted-foreground mb-1 block">Attachment Note</label>
              <input className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" placeholder="Reference document name" />
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Submit
          </button>
        </div>
      )}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Request ID", "Amount", "Requested By", "Department", "Date", "Approver", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {replenishments.map(r => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{r.id}</td>
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{r.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.by}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.dept}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{r.date}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">{r.approver}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductionReportsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Production Reports</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Feb – Jul 2026</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
            {["Feb–Jul 2026", "Aug–Jan 2026", "2025 Full Year"].map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Bundles Created" value={381} sub="6-month total" icon={Package} accent="bg-muted text-muted-foreground" />
        <KPICard label="Completed" value={340} sub="6-month total" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="QC Pass Rate" value="89%" sub="Avg over period" icon={ShieldCheck} accent="bg-muted text-muted-foreground" trend="up" />
        <KPICard label="Back Job Rate" value="11%" sub="Avg over period" icon={RotateCcw} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="bg-black border border-border rounded-lg overflow-hidden p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Monthly Production Activity</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#737373" }} />
            <Bar key="rpt-created" dataKey="created" fill="#0a0a0a" radius={[2, 2, 0, 0]} name="Created" />
            <Bar key="rpt-completed" dataKey="completed" fill="#404040" radius={[2, 2, 0, 0]} name="Completed" />
            <Bar key="rpt-approved" dataKey="approved" fill="#737373" radius={[2, 2, 0, 0]} name="QC Approved" />
            <Bar key="rpt-backjobs" dataKey="backjobs" fill="#c4c4c4" radius={[2, 2, 0, 0]} name="Back Jobs" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Month", "Created", "Completed", "QC Approved", "Back Jobs", "Efficiency"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {productionData.map(r => (
                <tr key={r.month} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{r.month} 2026</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.created}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.completed}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.approved}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.backjobs}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{Math.round((r.approved / r.created) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinancialReportsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Financial Reports</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Petty cash and replenishment summary</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
            {["Feb–Jul 2026", "Aug–Jan 2026"].map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total PC Used" value="₱45,120" sub="6-month total" icon={DollarSign} accent="bg-muted text-muted-foreground" />
        <KPICard label="Replenishments" value={6} sub="Over 6 months" icon={RefreshCw} accent="bg-muted text-muted-foreground" />
        <KPICard label="Avg Request" value="₱687" sub="Per transaction" icon={TrendingUp} accent="bg-muted text-muted-foreground" />
        <KPICard label="Largest Disbursement" value="₱1,200" sub="Pantry restock" icon={Activity} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="bg-black border border-border rounded-lg overflow-hidden p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Monthly Petty Cash Spend (₱)</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={finData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#737373" }} />
            <Line key="fin-spend" type="monotone" dataKey="spend" stroke="#0a0a0a" strokeWidth={2} dot={false} name="PC Spend (₱)" />
            <Line key="fin-balance" type="monotone" dataKey="balance" stroke="#737373" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Balance (₱)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Month", "Petty Cash Used", "Replenishments", "Net Balance"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {finData.map(r => (
                <tr key={r.month} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{r.month} 2026</td>
                  <td className="px-4 py-3 font-mono text-foreground">₱{r.spend.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{r.replen}</td>
                  <td className="px-4 py-3 font-mono text-foreground">₱{r.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditReportsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Audit Reports</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">System event summary and analysis</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
            {["All Modules", "Users", "Finance", "Production", "QC", "System"].map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Total Events" value={284} sub="Last 30 days" icon={Activity} accent="bg-muted text-muted-foreground" />
        <KPICard label="User Actions" value={198} sub="Manual operations" icon={Users} accent="bg-muted text-muted-foreground" />
        <KPICard label="System Events" value={86} sub="Automated" icon={Server} accent="bg-muted text-muted-foreground" />
        <KPICard label="Failed Logins" value={7} sub="Security alerts" icon={AlertCircle} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="bg-black border border-border rounded-lg overflow-hidden p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Events by Module</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={auditEventsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="module" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, fontSize: 11 }} />
            <Bar key="audit-events" dataKey="events" fill="#0a0a0a" radius={[0, 2, 2, 0]} name="Events" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Timestamp", "User", "Action", "Module", "IP Address"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {fullAuditLog.slice(0, 6).map((e, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground text-[10px]">{e.ts}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{e.user}</td>
                  <td className="px-4 py-3 text-foreground">{e.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.module}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground text-[10px]">{e.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditLogsView() {
  const [search, setSearch] = useState("");
  const [moduleF, setModuleF] = useState("All");
  const modules = ["All", "Users", "Auth", "Finance", "QC", "Design", "Roles", "System"];
  const filtered = fullAuditLog.filter(e =>
    (moduleF === "All" || e.module === moduleF) &&
    (e.user.includes(search) || e.action.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Audit Logs</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Complete system activity record</p>
        </div>
        <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
          <Download size={12} /> Export Log
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user or action…" className="w-full bg-muted border border-border rounded pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30" />
        </div>
        <select value={moduleF} onChange={e => setModuleF(e.target.value)} className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
          {modules.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Timestamp", "User", "Role", "Action", "Module", "IP Address", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground text-[10px] whitespace-nowrap">{e.ts}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{e.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.role}</td>
                  <td className="px-4 py-3 text-foreground">{e.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.module}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground text-[10px]">{e.ip}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of 284 entries</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-6 h-6 text-[11px] rounded font-mono transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  const allNotifs = [
    { type: "warn", msg: "Failed login attempt — user: j.dela.cruz (3×)", time: "Jul 22, 2026 10:55 AM", read: false },
    { type: "warn", msg: "Storage at 72% — approaching 75% threshold", time: "Jul 22, 2026 9:00 AM", read: false },
    { type: "info", msg: "4 requests pending management approval", time: "Jul 22, 2026 8:30 AM", read: false },
    { type: "ok", msg: "Daily backup completed successfully (BKP-088)", time: "Jul 22, 2026 2:00 AM", read: true },
    { type: "info", msg: "New design D-103 submitted for approval by R&D", time: "Jul 21, 2026 4:00 PM", read: true },
    { type: "warn", msg: "Failed login attempt — user: j.dela.cruz (1×)", time: "Jul 21, 2026 3:22 PM", read: true },
    { type: "ok", msg: "Bundle B-201 approved by QC Inspector", time: "Jul 22, 2026 10:05 AM", read: true },
    { type: "info", msg: "Replenishment REQ-2041 submitted by Finance", time: "Jul 22, 2026 10:30 AM", read: true },
    { type: "ok", msg: "User account EMP-009 created by Admin", time: "Jul 22, 2026 11:15 AM", read: true },
    { type: "system", msg: "System scheduled maintenance window: Jul 27, 2026 12:00 AM", time: "Jul 20, 2026 9:00 AM", read: true },
  ];

  const [tab, setTab] = useState("All");
  const [dismissed, setDismissed] = useState<number[]>([]);

  const tabs = ["All", "Unread", "Warnings", "System"];
  const visible = allNotifs.filter((n, i) => {
    if (dismissed.includes(i)) return false;
    if (tab === "Unread") return !n.read;
    if (tab === "Warnings") return n.type === "warn";
    if (tab === "System") return n.type === "system" || n.type === "ok";
    return true;
  });

  const borderColor: Record<string, string> = {
    warn: "border-l-amber-400",
    ok: "border-l-emerald-400",
    info: "border-l-blue-400",
    system: "border-l-foreground",
  };
  const iconColor: Record<string, string> = {
    warn: "text-amber-500",
    ok: "text-emerald-500",
    info: "text-blue-500",
    system: "text-foreground",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Notifications</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{allNotifs.filter(n => !n.read).length} unread</p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium border border-border rounded px-3 py-2">
          Mark All Read
        </button>
      </div>
      <div className="flex gap-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-2">
        {visible.map((n, i) => (
          <div key={i} className={`bg-card border border-border border-l-4 ${borderColor[n.type]} rounded-lg px-4 py-3 flex items-start gap-3`}>
            <AlertCircle size={13} className={`${iconColor[n.type]} mt-0.5 shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug ${n.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>{n.msg}</p>
              <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-foreground" />}
              <button onClick={() => setDismissed(d => [...d, i])} className="text-muted-foreground hover:text-foreground transition-colors"><X size={12} /></button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-xs">No notifications in this category.</div>
        )}
      </div>
    </div>
  );
}

function SettingsView() {
  const [tab, setTab] = useState("General");
  const [maintenance, setMaintenance] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [inApp, setInApp] = useState(true);
  const tabs = ["General", "Security", "Notifications", "Integrations"];

  const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
    <button onClick={() => set(!val)} className={`relative w-9 h-5 rounded-full transition-colors ${val ? "bg-foreground" : "bg-muted border border-border"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${val ? "translate-x-4 bg-background" : "translate-x-0.5 bg-muted-foreground"}`} />
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Settings</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">System configuration and preferences</p>
      </div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${tab === t ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "General" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4 max-w-xl">
          {[
            { label: "System Name", defaultVal: "TILAO CORP — Admin System" },
            { label: "Contact Email", defaultVal: "admin@tilao.com" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider">{f.label}</label>
              <input defaultValue={f.defaultVal} className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" />
            </div>
          ))}
          {[
            { label: "Timezone", opts: ["Asia/Manila (UTC+8)", "UTC", "Asia/Tokyo (UTC+9)"] },
            { label: "Language", opts: ["English (US)", "Filipino"] },
            { label: "Date Format", opts: ["MMM DD, YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider">{f.label}</label>
              <select className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-medium text-foreground">Maintenance Mode</div>
              <div className="text-[11px] text-muted-foreground">Restrict access to admins only</div>
            </div>
            <Toggle val={maintenance} set={setMaintenance} />
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Save Settings
          </button>
        </div>
      )}

      {tab === "Security" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4 max-w-xl">
          <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Password Policy</div>
          {[
            { label: "Minimum Password Length", val: "8" },
            { label: "Password Expiry (days)", val: "90" },
            { label: "Max Failed Login Attempts", val: "3" },
            { label: "Session Timeout (minutes)", val: "30" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider">{f.label}</label>
              <input type="number" defaultValue={f.val} className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" />
            </div>
          ))}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-medium text-foreground">Two-Factor Authentication</div>
              <div className="text-[11px] text-muted-foreground">Require 2FA for all admin accounts</div>
            </div>
            <Toggle val={twoFA} set={setTwoFA} />
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Save Settings
          </button>
        </div>
      )}

      {tab === "Notifications" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4 max-w-xl">
          {[
            { label: "Email Alerts", sub: "Send critical alerts to admin email", val: emailAlerts, set: setEmailAlerts },
            { label: "SMS Alerts", sub: "Send SMS for security events", val: smsAlerts, set: setSmsAlerts },
            { label: "In-App Notifications", sub: "Show notification bell in dashboard", val: inApp, set: setInApp },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-xs font-medium text-foreground">{f.label}</div>
                <div className="text-[11px] text-muted-foreground">{f.sub}</div>
              </div>
              <Toggle val={f.val} set={f.set} />
            </div>
          ))}
          <div className="border-t border-border pt-4">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">Alert Events</div>
            <div className="space-y-2">
              {["Failed login attempts", "Low storage warning", "Pending approvals", "Backup completed", "New design released"].map(e => (
                <label key={e} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-foreground" /> {e}
                </label>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Save Settings
          </button>
        </div>
      )}

      {tab === "Integrations" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4 max-w-xl">
          {[
            { label: "QR Generator URL", val: "http://qr-service.tilao.local:8080", status: "Online" },
            { label: "Backup Storage Path", val: "/mnt/backup/tilao", status: "Healthy" },
          ].map(f => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-muted-foreground uppercase tracking-wider">{f.label}</label>
                <StatusBadge status={f.status} />
              </div>
              <input defaultValue={f.val} className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-foreground/30" />
            </div>
          ))}
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider">API Key</label>
            <input type="password" defaultValue="sk-tilao-prod-••••••••••••••••" className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-foreground/30" />
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
            <Save size={12} /> Save Settings
          </button>
        </div>
      )}
    </div>
  );
}

function BackupView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Backup & Restore</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Automated and manual backup management</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
            <Settings size={12} /> Configure Schedule
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
            <Database size={13} /> Run Backup Now
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Last Backup" value="2:00 AM" sub="Today, Jul 22" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
        <KPICard label="Next Scheduled" value="2:00 AM" sub="Tomorrow, Jul 23" icon={Clock} accent="bg-muted text-muted-foreground" />
        <KPICard label="Backup Size" value="4.2 GB" sub="Latest snapshot" icon={HardDrive} accent="bg-muted text-muted-foreground" />
        <KPICard label="Retention" value="30 days" sub="Auto-purge policy" icon={Archive} accent="bg-muted text-muted-foreground" />
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-[#333]">
          <span className="text-xs font-semibold uppercase tracking-widest text-white">System Services</span>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Server Status", value: "Online", icon: Server },
            { label: "Database", value: "Healthy", icon: Database },
            { label: "Storage", value: "72% Used", icon: HardDrive },
            { label: "QR Service", value: "Running", icon: QrCode },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between bg-muted/40 rounded p-3">
              <div className="flex items-center gap-2">
                <Icon size={12} className="text-muted-foreground" />
                <span className="text-[11px] text-foreground">{label}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-[#333]">
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Backup History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Backup ID", "Type", "Date & Time", "Size", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {backupHistory.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 font-mono text-foreground font-medium">{b.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.type}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{b.dt}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{b.size}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-foreground" title="Download"><Download size={12} /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground" title="Restore"><RotateCcw size={12} /></button>
                      <button className="p-1 text-muted-foreground hover:text-red-500" title="Delete"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
          <FileText size={20} className="text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">This section is under development.</p>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [userRole, setUserRole] = useState<"admin" | "rd" | "prod" | "exec" | null>(null);
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dashboard: true, users: false, production: false, product: false,
    finance: false, reports: false, system: false,
  });
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

  function toggleSection(key: string) {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function navigate(pageKey: string, sectionKey: string) {
    setActivePage(pageKey);
    setExpandedSections(prev => ({ ...prev, [sectionKey]: true }));
  }

  function renderContent() {
    if (activePage === "overview")         return <DashboardView />;
    if (activePage === "users-list")       return <UsersView />;
    if (activePage === "roles")            return <RolesView />;
    if (activePage === "permissions")      return <PermissionsView />;
    if (activePage === "bundles")          return <BundleManagementView />;
    if (activePage === "qr")               return <QRCodeManagementView />;
    if (activePage === "designs")          return <DesignManagementView />;
    if (activePage === "pettycash")        return <PettyCashView />;
    if (activePage === "replenishment")    return <ReplenishmentView />;
    if (activePage === "prod-reports")     return <ProductionReportsView />;
    if (activePage === "fin-reports")      return <FinancialReportsView />;
    if (activePage === "audit-reports")    return <AuditReportsView />;
    if (activePage === "audit-logs")       return <AuditLogsView />;
    if (activePage === "notifications")    return <NotificationsView />;
    if (activePage === "settings")         return <SettingsView />;
    if (activePage === "backup")           return <BackupView />;
    return <PlaceholderView title={activePage} />;
  }

  const unreadCount = notifications.filter(n => n.type === "warn").length;

  if (!userRole) return <LoginView onLogin={(role) => setUserRole(role)} />;
  if (userRole === "rd") return <RDApp onLogout={() => setUserRole(null)} />;
  if (userRole === "prod") return <ProdApp onLogout={() => setUserRole(null)} />;
  if (userRole === "exec") return <ExecApp onLogout={() => setUserRole(null)} />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-display)" }}>

      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 border-r border-border transition-all duration-200 ${sidebarOpen ? "w-56" : "w-14"}`}
        style={{ background: "var(--sidebar)", fontFamily: "var(--font-display)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--sidebar-border)]">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white font-mono">TC</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-foreground tracking-widest uppercase whitespace-nowrap">TILAO CORP</div>
              <div className="text-[9px] text-muted-foreground font-mono whitespace-nowrap">System Admin</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-none">
          {navSections.map((section) => {
            const SIcon = section.icon;
            const isExpanded = expandedSections[section.key];
            const isSectionActive = section.items.some(i => i.key === activePage);

            return (
              <div key={section.key}>
                <button
                  onClick={() => toggleSection(section.key)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-[11px] font-medium transition-colors ${isSectionActive ? "text-foreground bg-[var(--sidebar-accent)]" : "text-[var(--sidebar-foreground)] hover:text-foreground hover:bg-[var(--sidebar-accent)]"}`}
                >
                  <SIcon size={14} className="shrink-0" />
                  {sidebarOpen && <span className="flex-1 text-left">{section.label}</span>}
                  {sidebarOpen && (
                    isExpanded
                      ? <ChevronDown size={11} className="shrink-0 text-muted-foreground" />
                      : <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
                  )}
                </button>

                {sidebarOpen && isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {section.items.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => navigate(item.key, section.key)}
                        className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors ${activePage === item.key ? "text-primary bg-primary/10 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-[var(--sidebar-accent)]"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar version */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-[var(--sidebar-border)]">
            <div className="text-[10px] text-muted-foreground font-mono">v2.4.1 · Build 20260722</div>
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

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Dashboard</span>
            {activePage !== "overview" && (
              <>
                <ChevronRight size={11} />
                <span className="text-foreground font-medium capitalize">{activePage.replace(/-/g, " ")}</span>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative ml-auto w-52">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="w-full bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                  <button className="text-[11px] text-primary hover:text-accent">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                  {notifications.map((n, i) => {
                    const Icon = n.icon;
                    const iconColor = n.type === "warn" ? "text-amber-400" : n.type === "ok" ? "text-emerald-400" : "text-blue-400";
                    return (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer">
                        <Icon size={12} className={`${iconColor} mt-0.5 shrink-0`} />
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
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">SA</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-medium text-foreground leading-none">Sys Admin</div>
                <div className="text-[9px] text-muted-foreground font-mono leading-none mt-0.5">admin</div>
              </div>
              <ChevronDown size={11} className="text-muted-foreground" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                {[
                  { label: "My Profile", icon: User },
                  { label: "Change Password", icon: Lock },
                ].map(({ label, icon: Icon }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
                <div className="border-t border-border" />
                <button onClick={() => setUserRole(null)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                  <LogOut size={12} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-5 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span>v2.4.1</span>
            <span className="text-border">|</span>
            <span>Last Backup: Jul 22, 2026 02:00 AM</span>
            <span className="text-border">|</span>
            <span>Last Login: Jul 22, 2026 08:30 AM</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">© 2026 TILAO CORP. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}
