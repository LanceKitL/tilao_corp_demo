import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard, Palette, Plus, Archive, BarChart3,
  ChevronDown, ChevronRight, Search, LogOut, User, Lock,
  Bell, Menu, Eye, Pencil, RefreshCw, CheckCircle, X,
  FileText, Clock, AlertCircle, Download, RotateCcw, Trash2, Check, BookOpen,
} from "lucide-react";
import "driver.js/dist/driver.css";
import { driver } from "driver.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { StatusBadge, KPICard, SectionHeader } from "./shared";

// ─── R&D Data ────────────────────────────────────────────────────────────────

const rdDesigns = [
  { code: "MR-103", name: "Alexa Long Sleeve Top", brand: "Mera", collection: "Mera Essentials", season: "SS 2027", category: "Knit", version: "3.0", status: "Draft", released: "—", by: "a.reyes" },
  { code: "MR-102", name: "Martina Scoop Neck Top", brand: "Mera", collection: "Mera Essentials", season: "SS 2027", category: "Knit", version: "2.0", status: "Released", released: "Jul 22, 2026", by: "rd.lead" },
  { code: "MR-101", name: "Arya Tank Top", brand: "Mera", collection: "Mera Essentials", season: "SS 2027", category: "Knit", version: "1.5", status: "Released", released: "Jul 21, 2026", by: "a.reyes" },
  { code: "MR-100", name: "Lounge Pants Plain", brand: "Mera", collection: "Mera Loungewear", season: "AW 2026", category: "Knit", version: "4.2", status: "Released", released: "Jul 18, 2026", by: "rd.lead" },
  { code: "MR-099", name: "Lounge Pants Ribbed", brand: "Mera", collection: "Mera Loungewear", season: "AW 2026", category: "Knit", version: "2.0", status: "Released", released: "Jul 15, 2026", by: "a.reyes" },
  { code: "MR-098", name: "Klea Mini Dress", brand: "Mera", collection: "Mera Signature", season: "SS 2026", category: "Knit", version: "2.3", status: "Released", released: "Jul 10, 2026", by: "rd.lead" },
  { code: "MR-097", name: "Premium Jeans High Rise", brand: "Mera", collection: "Mera Denim Edit", season: "SS 2026", category: "Denim", version: "1.1", status: "Released", released: "Jun 30, 2026", by: "a.reyes" },
  { code: "SP-045", name: "Oversized Street Tee", brand: "Sponty", collection: "Sponty Street", season: "SS 2027", category: "Knit", version: "1.0", status: "Draft", released: "—", by: "rd.lead" },
  { code: "SP-044", name: "Biker Shorts", brand: "Sponty", collection: "Sponty Active", season: "AW 2026", category: "Knit", version: "2.1", status: "Released", released: "Jul 8, 2026", by: "a.reyes" },
  { code: "SP-043", name: "Cropped Hoodie", brand: "Sponty", collection: "Sponty Street", season: "AW 2026", category: "Knit", version: "1.2", status: "Released", released: "Jun 25, 2026", by: "rd.lead" },
];

const rdCollections = [
  { name: "Mera Essentials", brand: "Mera", season: "SS 2027", designs: 24, status: "Active", desc: "Cotton-spandex basics — slim fit tops, tanks, and long sleeves" },
  { name: "Mera Loungewear", brand: "Mera", season: "SS 2027", designs: 18, status: "Active", desc: "Comfortable knit lounge pants in plain and ribbed fabrics" },
  { name: "Mera Signature", brand: "Mera", season: "AW 2026", designs: 15, status: "Active", desc: "Premium silhouettes — mini dresses and statement knit pieces" },
  { name: "Mera Denim Edit", brand: "Mera", season: "AW 2026", designs: 8, status: "Active", desc: "Stretch denim bottoms for everyday and office wear" },
  { name: "Sponty Street", brand: "Sponty", season: "SS 2027", designs: 12, status: "Active", desc: "Casual streetwear separates and relaxed everyday basics" },
  { name: "Sponty Active", brand: "Sponty", season: "AW 2026", designs: 9, status: "Active", desc: "Sporty activewear pieces — biker shorts, sports bras, joggers" },
];

const rdVersionHistory = [
  { version: "3.0", by: "a.reyes", date: "Jul 22, 2026", changes: "Updated to 4-thread overlock on shoulder seam; added clear elastic tape spec" },
  { version: "2.1", by: "rd.lead", date: "Jul 10, 2026", changes: "Adjusted GSM from 200 to 210; corrected fabric consumption to 1.1m" },
  { version: "2.0", by: "a.reyes", date: "Jun 28, 2026", changes: "Added colorways: Ivory, Charcoal, Black, Dusty Pink" },
  { version: "1.0", by: "rd.lead", date: "Jun 15, 2026", changes: "Initial draft — Alexa Long Sleeve Top" },
];

const rdBOM = [
  { material: "Cotton Spandex Jersey (92/8)", supplier: "Textiles PH Inc.", qty: "1.1", unit: "meters/pc" },
  { material: "Rib Knit (Neckband)", supplier: "Textiles PH Inc.", qty: "0.15", unit: "meters/pc" },
  { material: "Polyester Thread 504 (Black)", supplier: "ThreadCo PH", qty: "180", unit: "meters/pc" },
  { material: "Polyester Thread 406 Coverstitch", supplier: "ThreadCo PH", qty: "120", unit: "meters/pc" },
  { material: "Clear Elastic Tape 12mm (Shoulder)", supplier: "AccessoriesPH", qty: "0.4", unit: "meters/pc" },
  { material: "Care Label (Woven)", supplier: "LabelMakers PH", qty: "1", unit: "pcs/pc" },
  { material: "Poly Bag 12×18", supplier: "PackagingCo PH", qty: "1", unit: "pcs/pc" },
];

const rdActivity = [
  { time: "11:30 AM", action: "Design MR-103 (Alexa Long Sleeve) saved as Draft v3.0", type: "save" },
  { time: "9:30 AM", action: "Design MR-102 (Martina Scoop Neck) released to Production", type: "release" },
  { time: "Yesterday 4:00 PM", action: "Pattern file uploaded for MR-101 (Arya Tank Top)", type: "upload" },
  { time: "Yesterday 2:15 PM", action: "Version history updated for MR-100 (Lounge Pants Plain)", type: "edit" },
  { time: "Jul 20, 2026", action: "Design MR-099 (Lounge Pants Ribbed) approved for release", type: "version" },
  { time: "Jul 18, 2026", action: "BOM revised for MR-098 (Klea Mini Dress) — fabric qty corrected", type: "save" },
];

const rdNotifications = [
  { type: "ok", msg: "Design MR-102 (Martina Scoop Neck) successfully released to Production", time: "9:30 AM" },
  { type: "warn", msg: "Pattern file missing for MR-103 (Alexa Long Sleeve) — required before release", time: "10:50 AM" },
  { type: "info", msg: "Version 3.0 of MR-103 saved by a.reyes", time: "11:30 AM" },
  { type: "ok", msg: "BOM approved for MR-101 (Arya Tank Top)", time: "Yesterday 3:00 PM" },
  { type: "warn", msg: "GSM mismatch on MR-099 — spec says 250 GSM but supplier sheet shows 240", time: "Yesterday 9:10 AM" },
];

const rdCostData = [
  { category: "Knit Tops", material: 160, labor: 80, overhead: 40 },
  { category: "Loungewear", material: 220, labor: 100, overhead: 50 },
  { category: "Dresses", material: 240, labor: 110, overhead: 60 },
  { category: "Trousers/Denim", material: 380, labor: 180, overhead: 90 },
];

// ─── R&D App ─────────────────────────────────────────────────────────────────

export default function RDApp({ onLogout }: { onLogout: () => void }) {
  const [rdPage, setRdPage] = useState("rd-overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "rd-dash": true,
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

  useEffect(() => {
    if (!localStorage.getItem("mera_rd_tour_seen")) {
      const timer = setTimeout(startTour, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (rdPage === "rd-collections" && !localStorage.getItem("mera_rd_collections_tour_seen")) {
      const timer = setTimeout(startCollectionsTour, 400);
      return () => clearTimeout(timer);
    }
    if (rdPage === "rd-new-design" && !localStorage.getItem("mera_rd_newdesign_tour_seen")) {
      const timer = setTimeout(startNewDesignTour, 400);
      return () => clearTimeout(timer);
    }
  }, [rdPage]);

  function startTour() {
    setRdPage("rd-overview");
    setTimeout(() => {
      const steps = [
        {
          element: "#rd-kpi-section",
          popover: {
            title: "Welcome to R&D",
            description: "This is your overview — track total designs, drafts, released designs, collections, and items awaiting approval at a glance.",
            side: "bottom" as const,
          },
        },
        {
          element: "#rd-quick-actions",
          popover: {
            title: "Quick Actions",
            description: "Jump straight to creating a new design, viewing the library, uploading pattern files, or releasing a design to production.",
            side: "bottom" as const,
          },
        },
        {
          element: "#rd-recent-drafts",
          popover: {
            title: "Recent Drafts",
            description: "Designs you're actively working on. Pick up where you left off.",
            side: "right" as const,
          },
        },
        {
          element: "#rd-recent-released",
          popover: {
            title: "Recent Released",
            description: "Designs that have been approved and handed off to Production. These are now read-only.",
            side: "left" as const,
          },
        },
        {
          element: "#rd-recent-activity",
          popover: {
            title: "Activity Feed",
            description: "A live log of everything happening — saves, uploads, releases, and version updates.",
            side: "top" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_rd_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  function startCollectionsTour() {
    setTimeout(() => {
      const steps = [
        {
          element: "#rd-collections-kpi",
          popover: {
            title: "Collections at a Glance",
            description: "Quick metrics for active collections, brand split, and new additions this season.",
            side: "bottom" as const,
          },
        },
        {
          element: "#rd-collections-filter",
          popover: {
            title: "Brand Filter",
            description: "Toggle between All, Mera, or Sponty to focus on a specific brand's collections.",
            side: "bottom" as const,
          },
        },
        {
          element: "#rd-collections-grid",
          popover: {
            title: "Collection Cards",
            description: "Each card shows the collection name, season, brand tag, design count, and a View button to explore designs inside.",
            side: "left" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_rd_collections_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  function startNewDesignTour() {
    setTimeout(() => {
      const steps = [
        {
          element: "#rd-stepper",
          popover: {
            title: "6-Step Design Process",
            description: "Walk through General Info → Tech Specs → Bill of Materials → Attachments → Version History → Preview & Release. Completed steps show a checkmark; click any completed step to jump back.",
            side: "bottom" as const,
          },
        },
        {
          element: "#rd-release-btn",
          popover: {
            title: "Release to Production",
            description: "Once all info is filled in, click here to release. A confirmation popup will appear — confirm to officially hand off the design to production. A success toast will confirm the release.",
            side: "top" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_rd_newdesign_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  function toggleSection(key: string) {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const rdNav = [
    {
      label: "Dashboard", icon: LayoutDashboard, key: "rd-dash",
      items: [{ label: "Overview", key: "rd-overview" }],
    },
    {
      label: "Design Library", icon: Palette, key: "rd-lib",
      items: [{ label: "Design Library", key: "rd-library" }],
    },
    {
      label: "New Design", icon: Plus, key: "rd-new",
      items: [{ label: "Create Design", key: "rd-new-design" }],
    },
    {
      label: "Collections", icon: Archive, key: "rd-col",
      items: [{ label: "All Collections", key: "rd-collections" }],
    },
  ];

  function renderRDContent() {
    if (rdPage === "rd-overview")     return <RDOverview navigate={setRdPage} />;
    if (rdPage === "rd-library")      return <RDLibrary />;
    if (rdPage === "rd-new-design")   return <RDNewDesign />;
    if (rdPage === "rd-collections")  return <RDCollections />;
    return <RDOverview navigate={setRdPage} />;
  }

  const pageLabel: Record<string, string> = {
    "rd-overview": "Overview", "rd-library": "Design Library",
    "rd-new-design": "New Design", "rd-collections": "Collections",
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-display)" }}>

      {/* Sidebar */}
      <aside className={`flex flex-col shrink-0 border-r border-border transition-all duration-200 ${sidebarOpen ? "w-56" : "w-14"}`} style={{ background: "var(--sidebar)" }}>
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--sidebar-border)]">
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-background font-mono">TC</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-foreground tracking-widest uppercase whitespace-nowrap">TILAO CORP</div>
              <div className="text-[9px] text-muted-foreground font-mono whitespace-nowrap">R&D Portal</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-none">
          {rdNav.map(section => {
            const SIcon = section.icon;
            const isExpanded = expandedSections[section.key];
            const isActive = section.items.some(i => i.key === rdPage);
            return (
              <div key={section.key}>
                <button
                  id={`rd-sidebar-${section.key}`}
                  onClick={() => {
                    if (section.items.length === 1) { setRdPage(section.items[0].key); }
                    toggleSection(section.key);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-[11px] font-medium transition-colors ${isActive ? "text-foreground bg-[var(--sidebar-accent)]" : "text-[var(--sidebar-foreground)] hover:text-foreground hover:bg-[var(--sidebar-accent)]"}`}
                >
                  <SIcon size={14} className="shrink-0" />
                  {sidebarOpen && <span className="flex-1 text-left">{section.label}</span>}
                  {sidebarOpen && section.items.length > 1 && (
                    isExpanded ? <ChevronDown size={11} className="shrink-0 text-muted-foreground" /> : <ChevronRight size={11} className="shrink-0 text-muted-foreground" />
                  )}
                </button>
                {sidebarOpen && isExpanded && section.items.length > 1 && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {section.items.map((item, idx) => (
                      <button key={`${item.key}-${idx}`} onClick={() => setRdPage(item.key)}
                        className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition-colors ${rdPage === item.key ? "text-foreground bg-foreground/10 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-[var(--sidebar-accent)]"}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-[var(--sidebar-border)]">
            <div className="text-[10px] text-muted-foreground font-mono">v2.4.1 · R&D Build</div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <style>{`
          .mera-tour-popover {
            --driver-popover-bg: var(--card, #1a1a1a) !important;
            --driver-popover-border-color: var(--border, #2a2a2a) !important;
            --driver-popover-color: var(--foreground, #f5f5f5) !important;
            --driver-popover-title-color: var(--foreground, #f5f5f5) !important;
            --driver-popover-font-family: var(--font-display, Inter, system-ui) !important;
          }
          .mera-tour-popover .driver-popover-description {
            color: var(--muted-foreground, #a3a3a3) !important;
          }
          .mera-tour-popover .driver-popover-footer button {
            background: var(--foreground, #0a0a0a) !important;
            color: var(--background, #f5f5f5) !important;
            border: none !important;
            border-radius: 6px !important;
            font-size: 11px !important;
            font-weight: 500 !important;
          }
          .mera-tour-popover .driver-popover-footer button.driver-popover-prev-btn {
            background: transparent !important;
            color: var(--foreground, #f5f5f5) !important;
          }
        `}</style>

        {/* Header */}
        <header className="h-12 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Menu size={15} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">R&D</span>
            <ChevronRight size={11} />
            <span className="text-foreground font-medium">{pageLabel[rdPage] ?? rdPage}</span>
          </div>
          <div className="relative ml-auto w-48">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search designs…" className="w-full bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30 transition-colors" />
          </div>
          {/* Tour */}
          <button onClick={startTour} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Start Tour">
            <BookOpen size={15} />
          </button>
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(v => !v)} className="relative p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                </div>
                <div className="divide-y divide-border/50">
                  {rdNotifications.map((n, i) => {
                    const color = n.type === "warn" ? "text-amber-500" : n.type === "ok" ? "text-emerald-500" : "text-blue-500";
                    return (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors cursor-pointer">
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
            <button onClick={() => setProfileOpen(v => !v)} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted transition-colors">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-[10px] font-bold text-background">AR</span>
              </div>
              {sidebarOpen && (
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] font-medium text-foreground leading-none">Ana Reyes</div>
                  <div className="text-[9px] text-muted-foreground font-mono leading-none mt-0.5">R&D Lead</div>
                </div>
              )}
              <ChevronDown size={11} className="text-muted-foreground" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                {[{ label: "My Profile", icon: User }, { label: "Change Password", icon: Lock }].map(({ label, icon: Icon }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-black/[0.04] transition-colors">
                    <Icon size={12} /> {label}
                  </button>
                ))}
                <div className="border-t border-border" />
                <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={12} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {renderRDContent()}
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-5 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span>v2.4.1</span>
            <span className="text-border">|</span>
            <span>R&D Portal · Ana Reyes</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">© 2026 TILAO CORP</span>
        </footer>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

// ─── R&D Page Views ───────────────────────────────────────────────────────────

function RDOverview({ navigate }: { navigate: (page: string) => void }) {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div id="rd-kpi-section">
        <SectionHeader title="R&D Overview" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPICard label="Total Designs" value={148} sub="In library" icon={Palette} accent="bg-muted text-muted-foreground" />
          <KPICard label="Draft" value={12} sub="In progress" icon={FileText} accent="bg-muted text-muted-foreground" />
          <KPICard label="Released" value={132} sub="In production" icon={CheckCircle} accent="bg-muted text-muted-foreground" trend="up" />
          <KPICard label="Archived" value={16} sub="Retired" icon={Archive} accent="bg-muted text-muted-foreground" />
          <KPICard label="Collections" value={6} sub="Active seasons" icon={BarChart3} accent="bg-muted text-muted-foreground" />
          <KPICard label="Awaiting Approval" value={4} sub="Pending review" icon={Clock} accent="bg-muted text-muted-foreground" />
        </div>
      </div>

      {/* Quick Actions */}
      <div id="rd-quick-actions">
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Create New Design", icon: Plus, primary: true },
            { label: "View Design Library", icon: Palette, primary: false },
          ].map(({ label, icon: Icon, primary }) => (
            <button key={label} onClick={() => primary ? navigate("rd-new-design") : navigate("rd-library")}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${primary ? "bg-foreground text-background hover:opacity-90" : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Design library mini-table + two-column recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Recent Designs</h2>
          <button onClick={() => navigate("rd-library")} className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors">View All</button>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Code", "Name", "Collection", "Version", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rdDesigns.slice(0, 5).map(d => (
                  <tr key={d.code} className="hover:bg-black/[0.02] transition-colors group">
                    <td className="px-4 py-2.5 font-mono text-foreground font-medium">{d.code}</td>
                    <td className="px-4 py-2.5 text-foreground">{d.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{d.collection}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{d.version}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-2.5">
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

      {/* Two-column: Recent Drafts | Recent Released */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div id="rd-recent-drafts" className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Recent Drafts</span>
          </div>
          <div className="divide-y divide-border/50">
            {rdDesigns.filter(d => d.status === "Draft").slice(0, 3).concat(rdDesigns.filter(d => d.status !== "Draft").slice(0, 2)).slice(0, 3).map(d => (
              <div key={d.code} className="px-4 py-3 flex items-center justify-between hover:bg-black/[0.02] transition-colors">
                <div>
                  <div className="text-xs font-medium text-foreground">{d.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{d.code} · {d.collection}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </div>
        <div id="rd-recent-released" className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Recent Released</span>
          </div>
          <div className="divide-y divide-border/50">
            {rdDesigns.filter(d => d.status === "Released").slice(0, 3).map(d => (
              <div key={d.code} className="px-4 py-3 flex items-center justify-between hover:bg-black/[0.02] transition-colors">
                <div>
                  <div className="text-xs font-medium text-foreground">{d.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{d.code} · Released {d.released}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div id="rd-recent-activity" className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Recent Activity</span>
          <span className="text-[10px] text-muted-foreground font-mono">Live</span>
        </div>
        <div className="divide-y divide-border/50">
          {rdActivity.map((a, i) => (
            <div key={i} className="px-4 py-2.5 flex items-start gap-3 hover:bg-black/[0.02] transition-colors">
              <span className="text-[11px] text-muted-foreground font-mono w-28 shrink-0 pt-0.5">{a.time}</span>
              <span className="text-xs text-foreground">{a.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignCard({ design, onView, onEdit }: { design: typeof rdDesigns[0]; onView: (d: typeof rdDesigns[0]) => void; onEdit: (d: typeof rdDesigns[0]) => void }) {
  const [imgErr, setImgErr] = useState(false);
  const slug = design.name.toLowerCase().replace(/\s+/g, "_");
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors cursor-pointer" onClick={() => onView(design)}>
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {!imgErr ? (
          <img src={`/designs/${slug}.webp`} alt={design.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px)" }}>
            <Palette size={20} className="text-muted-foreground/30" />
            <span className="text-[10px] font-mono text-muted-foreground">{design.code}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border backdrop-blur-sm ${design.brand === "Mera" ? "bg-violet-500/80 text-white border-violet-400/30" : "bg-orange-500/80 text-white border-orange-400/30"}`}>{design.brand}</span>
        </div>
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
          <button onClick={e => { e.stopPropagation(); onEdit(design); }}
            className="p-1.5 bg-card/90 rounded border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Pencil size={12} />
          </button>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="text-xs font-medium text-foreground leading-snug">{design.name}</div>
        <div className="flex items-center justify-between">
          <StatusBadge status={design.status} />
          <span className="text-[10px] font-mono text-muted-foreground">{design.code}</span>
        </div>
        <div className="text-[10px] text-muted-foreground truncate">{design.collection}</div>
      </div>
    </div>
  );
}

function RDLibrary() {
  const [search, setSearch] = useState("");
  const [brandF, setBrandF] = useState("All");
  const [collF, setCollF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [seasonF, setSeasonF] = useState("All");
  const [viewDesign, setViewDesign] = useState<typeof rdDesigns[0] | null>(null);
  const [editDesign, setEditDesign] = useState<typeof rdDesigns[0] | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; collection: string; season: string; status: string }>({ name: "", collection: "", season: "", status: "" });

  const filtered = rdDesigns.filter(d =>
    (brandF === "All" || d.brand === brandF) &&
    (collF === "All" || d.collection === collF) &&
    (statusF === "All" || d.status === statusF) &&
    (seasonF === "All" || d.season === seasonF) &&
    (d.code.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase()))
  );

  const collections = ["All", ...Array.from(new Set(rdDesigns.map(d => d.collection)))];
  const seasons = ["All", ...Array.from(new Set(rdDesigns.map(d => d.season)))];

  const openEdit = (d: typeof rdDesigns[0]) => {
    setEditForm({ name: d.name, collection: d.collection, season: d.season, status: d.status });
    setEditDesign(d);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Design Library</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{rdDesigns.length} designs total</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code or name…" className="w-full bg-muted border border-border rounded pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30" />
        </div>
        {[{ val: brandF, set: setBrandF, opts: ["All", "Mera", "Sponty"], label: "Brand" },
          { val: collF, set: setCollF, opts: collections, label: "Collection" },
          { val: statusF, set: setStatusF, opts: ["All", "Draft", "Released", "Archived", "Pending"], label: "Status" },
          { val: seasonF, set: setSeasonF, opts: seasons, label: "Season" }
        ].map(f => (
          <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)} className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
            {f.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((d, idx) => {
          return <DesignCard key={d.code} design={d} onView={setViewDesign} onEdit={openEdit} />;
        })}
      </div>
      <div className="text-[11px] text-muted-foreground">Showing {filtered.length} of {rdDesigns.length} designs</div>

      {/* View Modal */}
      {viewDesign && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewDesign(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{viewDesign.code}</span>
                  <StatusBadge status={viewDesign.status} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-1">{viewDesign.name}</h3>
              </div>
              <button onClick={() => setViewDesign(null)} className="p-1 text-muted-foreground hover:text-foreground ml-3 shrink-0"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Collection", val: viewDesign.collection },
                  { label: "Season", val: viewDesign.season },
                  { label: "Category", val: viewDesign.category },
                  { label: "Version", val: viewDesign.version },
                  { label: "Released By", val: viewDesign.by },
                  { label: "Release Date", val: viewDesign.released },
                ].map(row => (
                  <div key={row.label}>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">{row.label}</span>
                    <span className="text-foreground font-mono">{row.val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                {viewDesign.status === "Released" && "This design has been released and is available for production."}
                {viewDesign.status === "Draft" && "This design is in draft — not yet released to production."}
                {viewDesign.status === "Archived" && "This design has been archived and is no longer active."}
              </div>
            </div>
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-border">
              <button onClick={() => { setViewDesign(null); openEdit(viewDesign); }} className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded hover:opacity-80 transition-opacity">Edit Design</button>
              <button onClick={() => setViewDesign(null)} className="px-3 py-1.5 text-xs font-medium bg-muted text-foreground rounded hover:bg-muted/80 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDesign && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditDesign(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Edit Design — <span className="font-mono text-muted-foreground">{editDesign.code}</span></h3>
              <button onClick={() => setEditDesign(null)} className="p-1 text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Design Name", key: "name" as const, type: "input" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">{f.label}</label>
                  <input value={editForm[f.key]} onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" />
                </div>
              ))}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Collection</label>
                <select value={editForm.collection} onChange={e => setEditForm(prev => ({ ...prev, collection: e.target.value }))}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                  {rdCollections.map(c => <option key={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Season</label>
                <select value={editForm.season} onChange={e => setEditForm(prev => ({ ...prev, season: e.target.value }))}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                  {["SS 2027", "AW 2026", "SS 2026", "AW 2025", "SS 2025"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                  {["Draft", "Released", "Archived"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-border">
              <button onClick={() => { toast.success("Changes saved", { description: `${editDesign.code} — ${editForm.name}` }); setEditDesign(null); }}
                className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded hover:opacity-80 transition-opacity">Save Changes</button>
              <button onClick={() => setEditDesign(null)} className="px-3 py-1.5 text-xs font-medium bg-muted text-foreground rounded hover:bg-muted/80 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RDNewDesign() {
  const [activeTab, setActiveTab] = useState("general");
  const [released, setReleased] = useState(false);
  const [confirmRelease, setConfirmRelease] = useState(false);
  const [bomRows, setBomRows] = useState(rdBOM.map((r, i) => ({ ...r, id: i })));

  const tabs = [
    { key: "general", label: "General Info" },
    { key: "tech", label: "Tech Specs" },
    { key: "bom", label: "Bill of Materials" },
    { key: "attach", label: "Attachments" },
    { key: "versions", label: "Version History" },
    { key: "preview", label: "Preview & Release" },
  ];

  const inputCls = "w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";
  const labelCls = "text-[11px] text-muted-foreground mb-1 block uppercase tracking-wider";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Create / Edit Design</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Design Code: D-104 (Auto-generated)</p>
        </div>
        {released && <StatusBadge status="Released" />}
      </div>

      {/* Stepper */}
      {(() => {
        const tabKeys = ["general", "tech", "bom", "attach", "versions", "preview"];
        const currentIdx = tabKeys.indexOf(activeTab);
        return (
          <div id="rd-stepper" className="flex items-start w-full bg-card border border-border rounded-lg px-6 py-4 mb-2">
            {tabs.map((t, i) => {
              const isCompleted = i < currentIdx;
              const isCurrent   = i === currentIdx;
              return (
                <div key={t.key} className="flex items-start flex-1 min-w-0">
                  {/* Step column */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                      Step {i + 1}
                    </span>
                    <button
                      onClick={() => (isCompleted || isCurrent) ? setActiveTab(t.key) : undefined}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                        ${isCompleted ? "bg-foreground border-foreground cursor-pointer hover:opacity-80"
                          : isCurrent  ? "bg-foreground border-foreground cursor-default"
                          : "bg-background border-border cursor-default"}`}
                    >
                      {isCompleted
                        ? <Check size={13} className="text-background" />
                        : <span className={`text-[11px] font-bold leading-none ${isCurrent ? "text-background" : "text-muted-foreground"}`}>{i + 1}</span>
                      }
                    </button>
                    <span className={`text-[10px] font-medium text-center leading-tight max-w-[72px] ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {t.label}
                    </span>
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap
                      ${isCompleted ? "bg-foreground/10 text-foreground"
                        : isCurrent  ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"}`}>
                      {isCompleted ? "Complete" : isCurrent ? "In Progress" : "Pending"}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < tabs.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 mt-[26px] transition-colors
                      ${i < currentIdx ? "bg-foreground" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Tab: General Info */}
      {activeTab === "general" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Design Code</label><input defaultValue="D-104" className={inputCls} /></div>
            <div><label className={labelCls}>Design Name</label><input placeholder="e.g. Textured Polo V1" className={inputCls} /></div>
            <div>
              <label className={labelCls}>Collection</label>
              <select className={inputCls}>{rdCollections.map(c => <option key={c.name}>{c.name}</option>)}</select>
            </div>
            <div>
              <label className={labelCls}>Season</label>
              <select className={inputCls}>{["SS 2027", "AW 2027", "SS 2026", "AW 2026"].map(s => <option key={s}>{s}</option>)}</select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls}>{["Knit", "Woven", "Denim", "Outerwear", "Accessories"].map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <div>
              <label className={labelCls}>Brand</label>
              <select className={inputCls}>{["Mera", "Sponty"].map(b => <option key={b}>{b}</option>)}</select>
            </div>
            <div className="col-span-2"><label className={labelCls}>Description</label><textarea rows={3} placeholder="Brief description of the design…" className={`${inputCls} resize-none`} /></div>
          </div>
          <div>
            <label className={labelCls}>Product Images</label>
            <div className="grid grid-cols-4 gap-3">
              {["Front View", "Back View", "Side View", "Detail"].map(v => (
                <div key={v} className="border border-dashed border-border rounded-lg h-24 flex flex-col items-center justify-center gap-1 hover:border-foreground/30 transition-colors cursor-pointer">
                  <Plus size={14} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity" onClick={() => setActiveTab("tech")}>
            Next: Tech Specs →
          </button>
        </div>
      )}

      {/* Tab: Tech Specs */}
      {activeTab === "tech" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Garment Type", type: "select", opts: ["Polo Shirt", "T-Shirt", "Trousers", "Jacket", "Shorts"] },
              { label: "Fabric Type", type: "select", opts: ["Cotton Piqué", "Jersey", "Twill", "Denim", "Fleece"] },
              { label: "GSM / Weight", type: "text", placeholder: "e.g. 240 gsm" },
              { label: "Stitch Type", type: "select", opts: ["Lockstitch", "Chainstitch", "Overlock", "Flatlock"] },
            ].map(f => (
              <div key={f.label}>
                <label className={labelCls}>{f.label}</label>
                {f.type === "select"
                  ? <select className={inputCls}>{f.opts!.map(o => <option key={o}>{o}</option>)}</select>
                  : <input placeholder={f.placeholder} className={inputCls} />}
              </div>
            ))}
            <div>
              <label className={labelCls}>Color Options</label>
              <input placeholder="White, Black, Navy, Charcoal…" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Available Sizes</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map(s => (
                  <label key={s} className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                    <input type="checkbox" defaultChecked={["S","M","L","XL"].includes(s)} className="accent-foreground" /> {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Sewing Instructions</label>
              <textarea rows={3} placeholder="Step-by-step sewing and assembly instructions…" className={`${inputCls} resize-none`} />
            </div>
          </div>
          {/* Measurement chart */}
          <div>
            <label className={labelCls}>Measurement Chart (cm)</label>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border rounded">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium text-[10px]">Measurement</th>
                    {["S", "M", "L", "XL"].map(s => <th key={s} className="text-center px-3 py-2 text-muted-foreground font-medium text-[10px]">{s}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {["Chest", "Waist", "Hip", "Length"].map(m => (
                    <tr key={m}>
                      <td className="px-3 py-1.5 text-foreground font-medium">{m}</td>
                      {["S", "M", "L", "XL"].map(s => (
                        <td key={s} className="px-3 py-1.5 text-center">
                          <input type="number" className="w-14 bg-muted border border-border rounded px-2 py-1 text-xs text-foreground text-center focus:outline-none" placeholder="—" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("general")} className="px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <button onClick={() => setActiveTab("bom")} className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">Next: BOM →</button>
          </div>
        </div>
      )}

      {/* Tab: BOM */}
      {activeTab === "bom" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Bill of Materials</span>
              <button onClick={() => setBomRows(r => [...r, { material: "", supplier: "", qty: "", unit: "", id: Date.now() }])}
                className="flex items-center gap-1.5 text-[11px] text-foreground border border-border rounded px-3 py-1.5 hover:bg-muted transition-colors">
                <Plus size={11} /> Add Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Material", "Supplier", "Quantity", "Unit", ""].map((h, i) => (
                      <th key={i} className="text-left px-4 py-2.5 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {bomRows.map((row, i) => (
                    <tr key={row.id}>
                      <td className="px-4 py-2"><input defaultValue={row.material} placeholder="e.g. Main Fabric" className="w-full bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none" /></td>
                      <td className="px-4 py-2"><input defaultValue={row.supplier} placeholder="Supplier name" className="w-full bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none" /></td>
                      <td className="px-4 py-2"><input defaultValue={row.qty} type="number" placeholder="0" className="w-24 bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none" /></td>
                      <td className="px-4 py-2"><input defaultValue={row.unit} placeholder="meters/pc" className="w-full bg-muted border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none" /></td>
                      <td className="px-4 py-2">
                        <button onClick={() => setBomRows(r => r.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <label className="text-[11px] text-muted-foreground mb-3 block uppercase tracking-wider font-medium">Cost Estimation</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Material Cost (₱)", placeholder: "0.00" },
                { label: "Labor Cost (₱)", placeholder: "0.00" },
                { label: "Overhead Cost (₱)", placeholder: "0.00" },
                { label: "Est. Production Cost (₱)", placeholder: "0.00" },
              ].map(f => (
                <div key={f.label}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="number" placeholder={f.placeholder} className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("tech")} className="px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <button onClick={() => setActiveTab("attach")} className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">Next: Attachments →</button>
          </div>
        </div>
      )}

      {/* Tab: Attachments */}
      {activeTab === "attach" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {["Tech Pack (PDF)", "Pattern Files", "CAD Files", "Marker Files", "Sewing Guide", "Size Chart"].map(att => (
              <div key={att} className="border border-dashed border-border rounded-lg p-4 flex items-center justify-between hover:border-foreground/30 transition-colors">
                <div>
                  <div className="text-xs font-medium text-foreground">{att}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">No file uploaded</div>
                </div>
                <button className="text-[11px] text-foreground border border-border rounded px-3 py-1.5 hover:bg-muted transition-colors">Browse</button>
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea rows={3} placeholder="Special instructions, QC notes, production notes…" className={`${inputCls} resize-none`} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("bom")} className="px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <button onClick={() => setActiveTab("versions")} className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">Next: Version History →</button>
          </div>
        </div>
      )}

      {/* Tab: Version History */}
      {activeTab === "versions" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Version History — D-103</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Version", "Modified By", "Date", "Changes", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {rdVersionHistory.map(v => (
                    <tr key={v.version} className="hover:bg-black/[0.02] transition-colors group">
                      <td className="px-4 py-3 font-mono text-foreground font-medium">v{v.version}</td>
                      <td className="px-4 py-3 text-muted-foreground">{v.by}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{v.date}</td>
                      <td className="px-4 py-3 text-foreground">{v.changes}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-muted-foreground hover:text-foreground" title="View"><Eye size={12} /></button>
                          <button className="p-1 text-muted-foreground hover:text-foreground" title="Restore"><RotateCcw size={12} /></button>
                          <button className="p-1 text-muted-foreground hover:text-foreground" title="Compare"><FileText size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("attach")} className="px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">← Back</button>
            <button onClick={() => setActiveTab("preview")} className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">Preview & Release →</button>
          </div>
        </div>
      )}

      {/* Tab: Preview & Release */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Design Preview — D-104</span>
              {released ? <StatusBadge status="Released" /> : <StatusBadge status="Draft" />}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Design Code", "D-104"], ["Design Name", "Textured Polo V1"],
                ["Collection", "Heritage Line"], ["Season", "SS 2027"],
                ["Category", "Knit"], ["Version", "1.0"],
                ["Garment Type", "Polo Shirt"], ["Fabric", "Cotton Piqué 240gsm"],
                ["Colors", "White, Black, Navy"], ["Sizes", "S, M, L, XL"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</span>
                  <span className="text-foreground font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Bill of Materials Summary</div>
              <div className="space-y-1">
                {rdBOM.map(m => (
                  <div key={m.material} className="flex justify-between text-xs">
                    <span className="text-foreground">{m.material}</span>
                    <span className="text-muted-foreground font-mono">{m.qty} {m.unit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Attachments</div>
              <div className="flex flex-wrap gap-2">
                {["Tech Pack", "Pattern Files", "CAD Files"].map(a => (
                  <span key={a} className="text-[11px] bg-muted border border-border rounded px-2 py-1 text-muted-foreground">
                    {a} — <span className="text-red-500">Missing</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {released ? (
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <CheckCircle size={24} className="mx-auto mb-2 text-foreground" />
              <p className="text-xs font-medium text-foreground">Design D-104 has been released to Production.</p>
              <p className="text-[11px] text-muted-foreground mt-1">Production can now create bundles using this design.</p>
            </div>
          ) : confirmRelease ? (
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-foreground font-medium mb-1">Confirm Release</p>
              <p className="text-[11px] text-muted-foreground mb-4">Once released, this design becomes read-only and production can generate bundles from it.</p>
              <div className="flex gap-2">
                <button onClick={() => { setReleased(true); setConfirmRelease(false); }} className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
                  <CheckCircle size={12} /> Confirm Release
                </button>
                <button onClick={() => setConfirmRelease(false)} className="px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setActiveTab("general")} className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">
                <Pencil size={12} /> Edit
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">
                <Download size={12} /> Print Tech Pack
              </button>
              <button id="rd-release-btn" onClick={() => setConfirmRelease(true)} className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
                <CheckCircle size={12} /> Release Design
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RDCollections() {
  const [selectedCollection, setSelectedCollection] = useState<typeof rdCollections[0] | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", brand: "Mera", season: "SS 2027", status: "Active", desc: "" });
  const [brandFilter, setBrandFilter] = useState("All");

  function handleCreate() {
    if (!newForm.name.trim()) return;
    toast.success("Collection created", { description: newForm.name });
    setShowNewModal(false);
    setNewForm({ name: "", brand: "Mera", season: "SS 2027", status: "Active", desc: "" });
  }

  const getDesigns = (col: typeof rdCollections[0]) => {
    const real = rdDesigns.filter(d => d.collection === col.name);
    const padCount = Math.min(Math.max(0, col.designs - real.length), 11);
    const placeholders = Array.from({ length: padCount }, (_, i) => ({
      code: `D-0${String(80 + i).padStart(2, "0")}`,
      name: `Design ${80 + i}`,
      collection: col.name,
      season: col.season,
      category: "Woven",
      version: "1.0",
      status: col.status === "Archived" ? "Archived" : "Released",
      released: "—",
      by: "rd.lead",
    }));
    return [...real, ...placeholders];
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Collections</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">6 collections · Mera &amp; Sponty</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 bg-foreground text-background hover:opacity-90 px-3 py-2 rounded text-xs font-medium transition-opacity">
          <Plus size={13} /> New Collection
        </button>
      </div>
      <div id="rd-collections-kpi" className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard label="Active Collections" value={6} sub="Current seasons" icon={Archive} accent="bg-muted text-muted-foreground" />
        <KPICard label="Mera Collections" value={4} sub="Mera brand" icon={Palette} accent="bg-muted text-muted-foreground" />
        <KPICard label="Sponty Collections" value={2} sub="Sponty brand" icon={BarChart3} accent="bg-muted text-muted-foreground" />
        <KPICard label="New This Season" value={3} sub="SS 2027 additions" icon={CheckCircle} accent="bg-muted text-muted-foreground" />
      </div>

      {/* Brand filter */}
      <div id="rd-collections-filter" className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Brand:</span>
        {["All", "Mera", "Sponty"].map(b => (
          <button key={b} onClick={() => setBrandFilter(b)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors border ${brandFilter === b ? "bg-foreground text-background border-foreground" : "bg-muted text-muted-foreground border-border hover:text-foreground"}`}>
            {b}
          </button>
        ))}
      </div>

      <div id="rd-collections-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rdCollections.filter(c => brandFilter === "All" || c.brand === brandFilter).map(c => (
          <div key={c.name} className="bg-card border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">{c.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground font-mono">{c.season}</span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${c.brand === "Mera" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>{c.brand}</span>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mb-3">{c.desc}</p>
            <div className="flex -space-x-1.5 mb-3">
              {rdDesigns.filter(d => d.collection === c.name).slice(0, 3).map(d => {
                const slug = d.name.toLowerCase().replace(/\s+/g, "_");
                return (
                  <div key={d.code} className="w-7 h-7 rounded-full border-2 border-card bg-muted overflow-hidden">
                    <img src={`/designs/${slug}.webp`} alt={d.name}
                      onError={e => { e.currentTarget.style.display = "none"; }}
                      className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-foreground font-medium">{c.designs} designs</span>
              <button
                onClick={() => setSelectedCollection(c)}
                className="flex items-center gap-1.5 text-[11px] text-foreground border border-border rounded px-3 py-1.5 hover:bg-muted transition-colors"
              >
                <Eye size={11} /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Collection Detail Modal */}
      {selectedCollection && (() => {
        const designs = getDesigns(selectedCollection);
        return (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedCollection(null)}
          >
            <div
              className="bg-popover border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="px-5 py-4 border-b border-border shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{selectedCollection.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{selectedCollection.season}</span>
                        <StatusBadge status={selectedCollection.status} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 leading-snug">{selectedCollection.desc}</p>
              </div>

              {/* Sub-header */}
              <div className="px-5 py-2.5 border-b border-border bg-muted/30 shrink-0 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Showing <span className="text-foreground font-medium">{designs.length}</span> of {selectedCollection.designs} designs
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{selectedCollection.name}</span>
              </div>

              {/* Design grid */}
              <div className="overflow-y-auto p-4">
                <div className="grid grid-cols-4 gap-3">
                  {designs.map((d, idx) => {
                    const dSlug = d.name.toLowerCase().replace(/\s+/g, "_");
                    return (
                      <div key={`${d.code}-${idx}`} className="group rounded-lg border border-border overflow-hidden hover:border-foreground/25 transition-colors cursor-pointer bg-card">
                        <div className="h-28 bg-muted relative overflow-hidden flex items-center justify-center">
                          <img src={`/designs/${dSlug}.webp`} alt={d.name}
                            onError={e => { e.currentTarget.style.display = "none"; }}
                            className="w-full h-full object-cover absolute inset-0" />
                          <div
                            className="absolute inset-0"
                            style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px)" }}
                          />
                          <div className="relative flex flex-col items-center gap-1">
                            <Palette size={16} className="text-muted-foreground/40" />
                            <span className="text-[10px] font-mono text-muted-foreground font-medium">{d.code}</span>
                          </div>
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye size={16} className="text-foreground/60" />
                          </div>
                        </div>
                        <div className="p-2.5 space-y-1">
                          <div className="text-[11px] font-medium text-foreground truncate">{d.name}</div>
                          <div className="flex items-center justify-between">
                            <StatusBadge status={d.status} />
                            <span className="text-[10px] font-mono text-muted-foreground">v{d.version}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* New Collection Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowNewModal(false)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">New Collection</h3>
              <button onClick={() => setShowNewModal(false)} className="p-1 text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Collection Name <span className="text-red-500">*</span></label>
                <input
                  value={newForm.name}
                  onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Heritage Line Vol. 3"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Brand</label>
                  <select value={newForm.brand} onChange={e => setNewForm(f => ({ ...f, brand: e.target.value }))}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                    {["Mera", "Sponty"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Season</label>
                  <select value={newForm.season} onChange={e => setNewForm(f => ({ ...f, season: e.target.value }))}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                    {["SS 2027", "AW 2026", "SS 2026", "AW 2025", "SS 2025"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Status</label>
                  <select value={newForm.status} onChange={e => setNewForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none">
                    {["Active", "Archived"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Description</label>
                <textarea
                  value={newForm.desc}
                  onChange={e => setNewForm(f => ({ ...f, desc: e.target.value }))}
                  rows={3}
                  placeholder="Brief description of this collection…"
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 placeholder:text-muted-foreground/40 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end px-5 py-4 border-t border-border">
              <button
                onClick={handleCreate}
                disabled={!newForm.name.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded hover:opacity-80 disabled:opacity-40 transition-opacity"
              >
                Create Collection
              </button>
              <button onClick={() => setShowNewModal(false)} className="px-3 py-1.5 text-xs font-medium bg-muted text-foreground rounded hover:bg-muted/80 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RDReports() {
  const [tab, setTab] = useState("release");
  const tabs = [
    { key: "release", label: "Design Release" },
    { key: "materials", label: "Material Requirements" },
    { key: "versions", label: "Version History" },
    { key: "cost", label: "Cost Estimation" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Reports</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Design and production analytics</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
            <Download size={12} /> Export PDF
          </button>
          <button className="flex items-center gap-1.5 bg-muted border border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground px-3 py-2 rounded text-xs font-medium transition-colors">
            <Download size={12} /> Export Excel
          </button>
        </div>
      </div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${tab === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "release" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Design Code", "Design Name", "Collection", "Version", "Released By", "Release Date", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rdDesigns.filter(d => d.status === "Released" || d.status === "Archived").map(d => (
                  <tr key={d.code} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-foreground font-medium">{d.code}</td>
                    <td className="px-4 py-3 text-foreground">{d.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.collection}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{d.version}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.by}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{d.released}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "materials" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Material", "Supplier", "Qty per Piece", "Unit", "Est. Total (50 pcs)"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rdBOM.map(m => (
                  <tr key={m.material} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{m.material}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.supplier}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{m.qty}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.unit}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{(parseFloat(m.qty) * 50).toFixed(0)} {m.unit.split("/")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "versions" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Design Code", "Version", "Modified By", "Date", "Changes"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rdVersionHistory.map(v => (
                  <tr key={v.version} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-foreground font-medium">D-103</td>
                    <td className="px-4 py-3 font-mono text-foreground">v{v.version}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.by}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{v.date}</td>
                    <td className="px-4 py-3 text-foreground">{v.changes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "cost" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Estimated Cost by Category (₱)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rdCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#737373" }} />
                <Bar key="rd-material" dataKey="material" fill="#0a0a0a" radius={[2, 2, 0, 0]} name="Material" />
                <Bar key="rd-labor" dataKey="labor" fill="#737373" radius={[2, 2, 0, 0]} name="Labor" />
                <Bar key="rd-overhead" dataKey="overhead" fill="#c4c4c4" radius={[2, 2, 0, 0]} name="Overhead" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Category", "Material (₱)", "Labor (₱)", "Overhead (₱)", "Total (₱)"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {rdCostData.map(r => (
                    <tr key={r.category} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{r.category}</td>
                      <td className="px-4 py-3 font-mono text-foreground">₱{r.material}</td>
                      <td className="px-4 py-3 font-mono text-foreground">₱{r.labor}</td>
                      <td className="px-4 py-3 font-mono text-foreground">₱{r.overhead}</td>
                      <td className="px-4 py-3 font-mono text-foreground font-semibold">₱{r.material + r.labor + r.overhead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
