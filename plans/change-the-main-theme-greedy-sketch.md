# Plan: R&D Portal Overhaul — Driver.js Tour + Library Grid + Reports Removal

## Context
Three improvements requested for the R&D portal:
1. **Onboarding tour** using driver.js — guided walkthrough of Overview, New Design process, and Collections
2. **Design Library redesign** — remove sub-nav links, switch from table to image grid, load product photos from a numbered file folder
3. **Remove Reports** from sidebar — its analytics are redundant with the Overview dashboard

---

## 1. Install driver.js

```bash
npm install driver.js
```

driver.js ships its own CSS; import it once at the top of `RDApp.tsx`:
```ts
import "driver.js/dist/driver.css";
import { driver } from "driver.js";
```

---

## 2. Image folder for Design Library

Create folder: **`public/designs/`**

Images should be named numerically: `1.jpg`, `2.jpg`, `3.jpg`, … etc. (JPEG or PNG both fine — use the extension that matches the dropped file.)

In code, designs are mapped to image numbers by their index in the `rdDesigns` array (1-indexed):
```ts
const imgSrc = (idx: number) => `/designs/${idx}.jpg`;
```

If a file doesn't exist the `<img>` falls back to a placeholder div (same diagonal-stripe pattern used in Collections today).

---

## 3. Sidebar changes (`rdNav` in `RDApp.tsx`)

### Remove Reports
Remove the `Reports` entry from `rdNav` entirely. Also remove `RDReports` from `renderRDContent()`.

### Design Library — remove sub-items
Change the Design Library section from 3 sub-items (My Designs, All Designs, Archived) to a **direct link** with no sub-menu (same as New Design):
```ts
{ label: "Design Library", icon: Palette, key: "rd-lib", items: [{ label: "Design Library", key: "rd-library" }] }
```

---

## 4. RDLibrary — grid view redesign

Replace the full table UI with a responsive image grid.

### Filter bar (keep existing, just remove Reports-related ones)
Keep: Search input, Brand filter, Collection filter, Status filter, Season filter — all unchanged.

### Grid layout
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {filtered.map((d, idx) => <DesignCard key={d.code} design={d} imgIndex={rdDesigns.indexOf(d) + 1} onView={setViewDesign} onEdit={openEdit} />)}
</div>
```

### DesignCard component (inline function, not exported)
```tsx
function DesignCard({ design, imgIndex, onView, onEdit }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors cursor-pointer" onClick={() => onView(design)}>
      {/* Image area */}
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {!imgErr ? (
          <img src={`/designs/${imgIndex}.jpg`} alt={design.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px)" }}>
            <Palette size={20} className="text-muted-foreground/30" />
            <span className="text-[10px] font-mono text-muted-foreground">{design.code}</span>
          </div>
        )}
        {/* Brand pill overlay top-left */}
        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border backdrop-blur-sm ${design.brand === "Mera" ? "bg-violet-500/80 text-white border-violet-400/30" : "bg-orange-500/80 text-white border-orange-400/30"}`}>{design.brand}</span>
        </div>
        {/* Action hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
          <button onClick={e => { e.stopPropagation(); onEdit(design); }}
            className="p-1.5 bg-card/90 rounded border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Pencil size={12} />
          </button>
        </div>
      </div>
      {/* Card footer */}
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
```

Keep the existing View and Edit modals — they still work with the grid.

---

## 5. Onboarding tour — driver.js

### Where to trigger
Add a **"Tour"** button to the R&D header (between the search bar and bell icon). Icon: `BookOpen` from lucide-react. On click, `startTour()` is called.

Also auto-start the tour the **first time** the user lands on `rd-overview` — store a `tourSeen` flag in `localStorage` (`mera_rd_tour_seen`). If not set, trigger after 500ms delay.

### Tour stops

The tour is built as a single `driver()` instance with sequential steps. Steps use `element` selectors — we add `id` attributes to key landmarks in `RDOverview` and `RDCollections`.

**IDs to add:**
| ID | Element |
|---|---|
| `rd-kpi-section` | The KPI cards `<div>` wrapper |
| `rd-quick-actions` | The Quick Actions `<div>` wrapper |
| `rd-recent-drafts` | The "Recent Drafts" card |
| `rd-recent-released` | The "Recent Released" card |
| `rd-recent-activity` | The "Recent Activity" card |
| `rd-collections-intro` | The first paragraph/description in RDCollections |
| `rd-sidebar-newdesign` | The "New Design" sidebar nav button |
| `rd-sidebar-collections` | The "Collections" sidebar nav button |

**Tour steps:**
```ts
const steps = [
  {
    element: "#rd-kpi-section",
    popover: {
      title: "Welcome to R&D",
      description: "This is your overview — track total designs, drafts, released designs, collections, and items awaiting approval at a glance.",
      side: "bottom",
    },
  },
  {
    element: "#rd-quick-actions",
    popover: {
      title: "Quick Actions",
      description: "Jump straight to creating a new design, viewing the library, uploading pattern files, or releasing a design to production.",
      side: "bottom",
    },
  },
  {
    element: "#rd-recent-drafts",
    popover: {
      title: "Recent Drafts",
      description: "Designs you're actively working on. Pick up where you left off.",
      side: "right",
    },
  },
  {
    element: "#rd-recent-released",
    popover: {
      title: "Recent Released",
      description: "Designs that have been approved and handed off to Production. These are now read-only.",
      side: "left",
    },
  },
  {
    element: "#rd-recent-activity",
    popover: {
      title: "Activity Feed",
      description: "A live log of everything happening — saves, uploads, releases, and version updates.",
      side: "top",
    },
  },
  {
    element: "#rd-sidebar-newdesign",
    popover: {
      title: "New Design",
      description: "Click here to start a new design. You'll walk through 6 steps: General Info → Tech Specs → Bill of Materials → Attachments → Version History → Preview & Release. The tour ends here — explore at your own pace!",
      side: "right",
    },
  },
  {
    element: "#rd-sidebar-collections",
    popover: {
      title: "Collections",
      description: "Organize your designs into collections by brand (Mera or Sponty) and season. A collection groups related designs so they're easy to find, filter, and present.",
      side: "right",
    },
  },
];
```

driver.js config:
```ts
const driverObj = driver({
  showProgress: true,
  animate: true,
  overlayColor: "rgba(0,0,0,0.5)",
  popoverClass: "mera-tour-popover",
  onDestroyed: () => localStorage.setItem("mera_rd_tour_seen", "1"),
  steps,
});
driverObj.drive();
```

### CSS override for driver.js popover
Add a small `<style>` block or inline styles to make the popover match the app's dark aesthetic (bg-card border color, font family).

---

## Files to modify

| File | Changes |
|---|---|
| `src/app/RDApp.tsx` | Install tour import, add BookOpen import, add tour button in header, add `startTour` / auto-start logic, add IDs to Overview/Collections elements, remove Reports nav + function, simplify Library nav, replace RDLibrary table with grid + DesignCard |
| `public/designs/` | **Create this folder** (empty — user drops numbered images) |

---

## Verification
1. R&D login → Overview auto-starts tour after 500ms (first visit only)
2. Tour highlights KPIs → Quick Actions → Drafts → Released → Activity → New Design sidebar → Collections sidebar; "Done" marks it seen
3. Clicking the BookOpen button in the header re-triggers the tour anytime
4. Sidebar no longer shows "My Designs / All Designs / Archived" sub-items under Design Library
5. Sidebar no longer shows Reports
6. Design Library renders as an image grid (4–5 columns on wide screens)
7. Dropping `1.jpg` in `public/designs/` causes first design card to show the photo
8. Cards without matching images show the diagonal-stripe placeholder
9. Clicking a grid card opens the View modal; Edit pencil icon opens Edit modal

---

# Plan: Brand re-theming — Mera Philippine Womenswear

## Context
All four data files currently use placeholder brand data (generic design names, generic collection titles, incorrect fabric specs). The user provided detailed real-world product specs for their brand **Mera**, a Philippine womenswear label. This plan replaces only the *values* inside data constants — no UI, no structure, no component logic changes.

The company name "TILAO CORP" is replaced with **"MERA"** throughout headers, footers, and login screen.

## Files to modify

| File | What changes |
|---|---|
| `src/app/RDApp.tsx` | rdDesigns, rdCollections, rdVersionHistory, rdBOM, rdActivity, rdNotifications, rdCostData |
| `src/app/ProdApp.tsx` | prodBundles, prodPendingQC, prodBackJobs, prodNotifications, prodInspections, prodQualityData |
| `src/app/EAApp.tsx` | eaBundlesInit, eaInventoryData, eaTriageFeed |
| `src/app/data.ts` | allDesigns, allBundles |

---

## Brand name replacement

**None.** TILAO CORP is the parent company. Mera and Sponty are two sub-brands/labels it produces under. They appear as a `brand` field in design and collection data — not in system headers, logos, footers, or login screens. No UI branding strings change.

A `brand` column is added to design and collection tables where relevant (showing "Mera" or "Sponty" as a tag/badge). Existing generic collection names ("Heritage Line", "Core Basics", etc.) are replaced with Mera-branded collections for the Mera product lines, and Sponty gets a couple of its own collections to show the multi-brand split.

---

## RDApp.tsx — new data values

### `rdDesigns` (10 rows) — Mera (MR-xxx) and Sponty (SP-xxx) product codes
```ts
{ code: "MR-103", name: "Alexa Long Sleeve Top", collection: "Mera Essentials", brand: "Mera", season: "SS 2027", category: "Knit", version: "3.0", status: "Draft", released: "—", by: "a.reyes" },
{ code: "MR-102", name: "Martina Scoop Neck Top", collection: "Mera Essentials", brand: "Mera", season: "SS 2027", category: "Knit", version: "2.0", status: "Released", released: "Jul 22, 2026", by: "rd.lead" },
{ code: "MR-101", name: "Arya Tank Top", collection: "Mera Essentials", brand: "Mera", season: "SS 2027", category: "Knit", version: "1.5", status: "Released", released: "Jul 21, 2026", by: "a.reyes" },
{ code: "MR-100", name: "Lounge Pants Plain", collection: "Mera Loungewear", brand: "Mera", season: "AW 2026", category: "Knit", version: "4.2", status: "Released", released: "Jul 18, 2026", by: "rd.lead" },
{ code: "MR-099", name: "Lounge Pants Ribbed", collection: "Mera Loungewear", brand: "Mera", season: "AW 2026", category: "Knit", version: "2.0", status: "Released", released: "Jul 15, 2026", by: "a.reyes" },
{ code: "MR-098", name: "Klea Mini Dress", collection: "Mera Signature", brand: "Mera", season: "SS 2026", category: "Knit", version: "2.3", status: "Released", released: "Jul 10, 2026", by: "rd.lead" },
{ code: "MR-097", name: "Premium Jeans High Rise", collection: "Mera Denim Edit", brand: "Mera", season: "SS 2026", category: "Denim", version: "1.1", status: "Released", released: "Jun 30, 2026", by: "a.reyes" },
{ code: "SP-045", name: "Oversized Street Tee", collection: "Sponty Street", brand: "Sponty", season: "SS 2027", category: "Knit", version: "1.0", status: "Draft", released: "—", by: "rd.lead" },
{ code: "SP-044", name: "Biker Shorts", collection: "Sponty Active", brand: "Sponty", season: "AW 2026", category: "Knit", version: "2.1", status: "Released", released: "Jul 8, 2026", by: "a.reyes" },
{ code: "SP-043", name: "Cropped Hoodie", collection: "Sponty Street", brand: "Sponty", season: "AW 2026", category: "Knit", version: "1.2", status: "Released", released: "Jun 25, 2026", by: "rd.lead" },
```

`rdDesigns` shape gains a `brand` field. Design Library table adds a "Brand" column showing a small colored pill ("Mera" in one accent color, "Sponty" in another) to distinguish the two labels at a glance.

### New Design form — Brand field
In `RDNewDesign`, the General Info tab gains a **"Brand"** select field placed after the Category field:
```
Brand: [ Mera ▾ ]   options: Mera | Sponty
```
"Brand" is the recommended term — it's the common garment industry label (as in "house brand", "sub-brand label") and is immediately understood by both R&D staff and production operators. "Sub-brand" is also acceptable but adds a word without clarity. The field feeds into the design's `brand` value used in Library and Collections filtering.

### `rdCollections` (6 rows) — split between Mera and Sponty brands
```ts
{ name: "Mera Essentials", brand: "Mera", season: "SS 2027", designs: 24, status: "Active", desc: "Cotton-spandex basics — slim fit tops, tanks, and long sleeves" },
{ name: "Mera Loungewear", brand: "Mera", season: "SS 2027", designs: 18, status: "Active", desc: "Comfortable knit lounge pants in plain and ribbed fabrics" },
{ name: "Mera Signature", brand: "Mera", season: "AW 2026", designs: 15, status: "Active", desc: "Premium silhouettes — mini dresses and statement knit pieces" },
{ name: "Mera Denim Edit", brand: "Mera", season: "AW 2026", designs: 8, status: "Active", desc: "Stretch denim bottoms for everyday and office wear" },
{ name: "Sponty Street", brand: "Sponty", season: "SS 2027", designs: 12, status: "Active", desc: "Casual streetwear separates and relaxed everyday basics" },
{ name: "Sponty Active", brand: "Sponty", season: "AW 2026", designs: 9, status: "Active", desc: "Sporty activewear pieces — biker shorts, sports bras, joggers" },
```

`rdCollections` shape gains a `brand` field. The Collection cards in `RDCollections` display a small "Mera" or "Sponty" tag alongside the season pill.

A **Brand filter** is added to the `RDCollections` page — a segmented pill group: **All | Mera | Sponty** — that filters which collection cards are displayed. Default is "All".

### `rdBOM` (7 rows) — real Mera fabric specs for Alexa Long Sleeve
```ts
{ material: "Cotton Spandex Jersey (92/8)", supplier: "Textiles PH Inc.", qty: "1.1", unit: "meters/pc" },
{ material: "Rib Knit (Neckband)", supplier: "Textiles PH Inc.", qty: "0.15", unit: "meters/pc" },
{ material: "Polyester Thread (504)", supplier: "ThreadCo PH", qty: "180", unit: "meters/pc" },
{ material: "Polyester Thread (406 Coverstitch)", supplier: "ThreadCo PH", qty: "120", unit: "meters/pc" },
{ material: "Clear Elastic Tape (Shoulder)", supplier: "AccessoriesPH", qty: "0.4", unit: "meters/pc" },
{ material: "Care Label", supplier: "LabelMakers PH", qty: "1", unit: "pcs/pc" },
{ material: "Poly Bag 12×18", supplier: "PackagingCo PH", qty: "1", unit: "pcs/pc" },
```

### `rdCostData` (4 rows) — based on Mera's actual estimated factory costs
```ts
{ category: "Knit Tops", material: 160, labor: 80, overhead: 40 },
{ category: "Loungewear", material: 220, labor: 100, overhead: 50 },
{ category: "Dresses", material: 240, labor: 110, overhead: 60 },
{ category: "Trousers/Denim", material: 380, labor: 180, overhead: 90 },
```

### `rdVersionHistory` — updates scoped to MR-103 (Alexa Long Sleeve)
```ts
{ version: "3.0", by: "a.reyes", date: "Jul 22, 2026", changes: "Updated to 4-thread overlock on shoulder seam; added clear elastic tape spec" },
{ version: "2.1", by: "rd.lead", date: "Jul 10, 2026", changes: "Adjusted GSM from 200 to 210; corrected fabric consumption to 1.1m" },
{ version: "2.0", by: "a.reyes", date: "Jun 28, 2026", changes: "Added colorways: Ivory, Charcoal, Black, Dusty Pink" },
{ version: "1.0", by: "rd.lead", date: "Jun 15, 2026", changes: "Initial draft — Alexa Long Sleeve Top" },
```

### `rdActivity` — Mera context
```ts
{ time: "11:30 AM", action: "Design MR-103 (Alexa Long Sleeve) saved as Draft v3.0", type: "save" },
{ time: "9:30 AM", action: "Design MR-102 (Martina Scoop Neck) released to Production", type: "release" },
{ time: "Yesterday 4:00 PM", action: "Pattern file uploaded for MR-101 (Arya Tank Top)", type: "upload" },
{ time: "Yesterday 2:15 PM", action: "Version history updated for MR-100 (Lounge Pants Plain)", type: "update" },
{ time: "Jul 20, 2026", action: "Design MR-099 (Lounge Pants Ribbed) approved for release", type: "approve" },
{ time: "Jul 18, 2026", action: "BOM revised for MR-098 (Klea Mini Dress) — fabric qty corrected", type: "save" },
```

### `rdNotifications`
```ts
{ type: "ok", msg: "Design MR-102 (Martina Scoop Neck) successfully released to Production", time: "9:30 AM" },
{ type: "warn", msg: "Pattern file missing for MR-103 (Alexa Long Sleeve) — required before release", time: "10:50 AM" },
{ type: "info", msg: "Version 3.0 of MR-103 saved by a.reyes", time: "11:30 AM" },
{ type: "ok", msg: "BOM approved for MR-101 (Arya Tank Top)", time: "Yesterday 3:00 PM" },
{ type: "warn", msg: "GSM mismatch on MR-099 — spec says 250 GSM but supplier sheet shows 240", time: "Yesterday 9:10 AM" },
```

---

## ProdApp.tsx — new data values

### `prodBundles` — use Mera product names + realistic Mera colors/sizes
```ts
{ id: "BND-20260722-0012", design: "Alexa Long Sleeve Top", qty: 24, size: "M", color: "Black", seamstress: "Maria Santos", status: "Pending QC", updated: "1:05 PM", batch: "B-07" },
{ id: "BND-20260722-0011", design: "Martina Scoop Neck Top", qty: 30, size: "S", color: "Ivory", seamstress: "Liza Cruz", status: "Pending QC", updated: "12:45 PM", batch: "B-06" },
{ id: "BND-20260722-0010", design: "Arya Tank Top", qty: 20, size: "M", color: "Dusty Pink", seamstress: "Rosa Mendez", status: "Approved", updated: "11:30 AM", batch: "B-05" },
{ id: "BND-20260722-0009", design: "Lounge Pants Plain", qty: 15, size: "L", color: "Charcoal", seamstress: "Cita Bautista", status: "In Progress", updated: "10:15 AM", batch: "B-04" },
{ id: "BND-20260722-0008", design: "Klea Mini Dress", qty: 18, size: "S", color: "Black", seamstress: "Ana Torres", status: "Back Job", updated: "9:50 AM", batch: "B-03" },
{ id: "BND-20260722-0007", design: "Lounge Pants Ribbed", qty: 20, size: "M", color: "Oat", seamstress: "Maria Santos", status: "In Progress", updated: "9:30 AM", batch: "B-02" },
{ id: "BND-20260722-0006", design: "Trouser Pants Straight", qty: 12, size: "S", color: "Black", seamstress: "Liza Cruz", status: "Approved", updated: "Yesterday 4:00 PM", batch: "B-01" },
// ... remaining 3 rows similar pattern
```

### `prodQualityData` — use Mera product names
```ts
{ design: "Alexa Long Sleeve Top", inspected: 24, approved: 21, rejected: 1, backjob: 2 },
{ design: "Martina Scoop Neck Top", inspected: 18, approved: 15, rejected: 2, backjob: 1 },
{ design: "Arya Tank Top", inspected: 20, approved: 19, rejected: 1, backjob: 0 },
{ design: "Klea Mini Dress", inspected: 18, approved: 14, rejected: 2, backjob: 2 },
{ design: "Lounge Pants Ribbed", inspected: 15, approved: 14, rejected: 0, backjob: 1 },
```

---

## EAApp.tsx — new data values

### `eaInventoryData` — replace with Mera-specific fabrics and trims
```ts
{ id: "MAT-001", name: "Cotton Spandex Jersey 92/8 (Black)", category: "Fabrics", unit: "meters", stock: 120, min: 50, max: 200 },
{ id: "MAT-002", name: "Cotton Spandex Jersey 92/8 (Ivory)", category: "Fabrics", unit: "meters", stock: 35, min: 50, max: 200 },
{ id: "MAT-003", name: "French Terry 240 GSM (Charcoal)", category: "Fabrics", unit: "meters", stock: 80, min: 40, max: 150 },
{ id: "MAT-004", name: "Poly Rib Knit 62/33/5 (Oat)", category: "Fabrics", unit: "meters", stock: 12, min: 30, max: 120 },
{ id: "MAT-005", name: "Polyester Thread 504 (Black)", category: "Threads", unit: "spools", stock: 8, min: 20, max: 60 },
{ id: "MAT-006", name: "Polyester Thread 406 Coverstitch (White)", category: "Threads", unit: "spools", stock: 14, min: 20, max: 60 },
{ id: "MAT-007", name: "Wooly Nylon (Overlock Looper)", category: "Threads", unit: "cones", stock: 22, min: 10, max: 40 },
{ id: "MAT-008", name: "Poly Bag 12×18", category: "Packaging", unit: "pieces", stock: 450, min: 200, max: 1000 },
{ id: "MAT-009", name: "Hang Tag (Mera Standard)", category: "Packaging", unit: "pieces", stock: 85, min: 100, max: 500 },
{ id: "MAT-010", name: "Care Label (Woven)", category: "Packaging", unit: "pieces", stock: 320, min: 150, max: 600 },
{ id: "MAT-011", name: "Clear Elastic Tape 12mm (Shoulder)", category: "Accessories", unit: "meters", stock: 45, min: 80, max: 300 },
{ id: "MAT-012", name: "YKK Zipper 20cm (Black)", category: "Accessories", unit: "pieces", stock: 38, min: 60, max: 200 },
```

### `eaBundlesInit` — update design names to Mera products (same structure)

### `eaTriageFeed` — update bundle/design mentions to Mera product names

---

## data.ts — new data values

### `allDesigns` — use MR-xxx codes and Mera product names
```ts
{ id: "MR-103", name: "Alexa Long Sleeve Top", version: "3.0", by: "a.reyes", released: "Jul 22, 2026", status: "Pending" },
{ id: "MR-102", name: "Martina Scoop Neck Top", version: "2.0", by: "rd.lead", released: "Jul 22, 2026", status: "Active" },
// ... remaining 6 rows with Mera products
```

### `allBundles` — update design references to MR-xxx

---

## Brand name string replacements (all files)

Use `replace_all: true` targeted edits:
- `"TILAO CORP"` → `"MERA"` in all 5 files
- `"TC"` (logo initials) → `"ME"` in all 5 files
- Footer copyright: `"© 2026 TILAO CORP"` → `"© 2026 MERA"`

---

## What does NOT change
- All UI structure, components, layouts
- All headers, footers, logos — TILAO CORP branding stays as-is
- Seamstress names (already Filipino — realistic for PH manufacturing)
- Statuses, role names, system user accounts
- All chart data shapes and numeric values (only the labels change)
- Login credentials (system_admin, research_dev, prod_head, executive)

---

## Verification
1. Login screen — TILAO CORP logo/branding unchanged
2. R&D Library shows MR-xxx codes and Mera product names
3. Collections show Essentials, Loungewear, Signature, Denim Edit, Office Basics, Core Basics
4. BOM for MR-103 shows Cotton Spandex Jersey 92/8, Rib Knit neckband, Thread specs
5. Cost data shows realistic PH factory cost ranges per category
6. Production bundles show Mera product names and colorways (Black, Ivory, Dusty Pink, Charcoal, Oat)
7. Inventory shows Mera-specific fabrics (French Terry, Poly Rib Knit, Clear Elastic Tape)
8. All portals footer and header show "MERA" brand name

---

# Plan: Collections — New Collection modal form with toast

## Context
The R&D Collections page (`RDCollections` in `src/app/RDApp.tsx`) has a "New Collection" button (line ~1037) that is currently inert. The user wants it to open a modal form where they can fill in collection details, and submitting fires a `sonner` toast. The existing View modal pattern (fixed inset-0 backdrop, inner panel, X close) is the established style to follow. `toast` is already imported from `sonner` in `RDApp.tsx`.

## File to modify
`src/app/RDApp.tsx` — `RDCollections` function only.

## Changes

### 1. Add state
Inside `RDCollections`, add:
```ts
const [showNewModal, setShowNewModal] = useState(false);
const [newForm, setNewForm] = useState({ name: "", season: "SS 2027", status: "Active", desc: "" });
```

### 2. Wire the "New Collection" button
```tsx
<button onClick={() => setShowNewModal(true)} className="...existing classes...">
  <Plus size={13} /> New Collection
</button>
```

### 3. New Collection modal
Same overlay pattern used by the View modal: `fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4`, click-outside closes. Inner panel: `max-w-md w-full bg-card border border-border rounded-xl shadow-xl`.

**Header**: "New Collection" title + X close button.

**Form fields** (using the same input class used throughout RDApp: `w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30`):
- Collection Name (text input, required)
- Season (select: SS 2027 / AW 2026 / SS 2026 / AW 2025 / SS 2025)
- Status (select: Active / Archived)
- Description (textarea, 3 rows)

**Footer buttons**:
- "Create Collection" (primary): validates that Name is non-empty → fires `toast.success("Collection created", { description: newForm.name })` → closes modal + resets form
- "Cancel": closes modal

## Verification
1. Click "New Collection" button → modal opens over dark overlay
2. Clicking outside or X closes modal without submitting
3. "Create Collection" with empty name does nothing (button disabled or no-op)
4. Filling in name + clicking Create → sonner success toast appears, modal closes
5. Form resets when modal reopens

---

# Plan: Notification badge — red background across all portals

## Context
The notification count bubbles on the Bell icon in the header currently use `bg-foreground` (black) in the R&D, Production, and EA portals. The admin portal already uses `bg-red-500`. The user wants a consistent red badge across all four portals.

## Changes

Three files each have one badge span to update — replace `bg-foreground text-background` with `bg-red-500 text-white`:

| File | Current badge classes |
|---|---|
| `src/app/RDApp.tsx` line ~229 | `absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-foreground text-background text-[8px] font-bold rounded-full flex items-center justify-center` |
| `src/app/ProdApp.tsx` line ~191 | same |
| `src/app/EAApp.tsx` line ~995 | same |

In each file replace: `bg-foreground text-background` → `bg-red-500 text-white`

`src/app/App.tsx` admin badge already uses `bg-red-500` — no change needed.

## Verification
- All 4 portals show a red notification dot on the Bell icon in the header.

---

# Plan: Executive Assistant Portal — executive/executive account

## Context
Add a fourth user role `exec` (login: `executive` / `executive`) routing to a self-contained `EAApp` portal. The EA acts as the operations nerve centre: watching production flow without touching QC scans, gatekeeping petty cash requests before they reach the Boss, tracking inventory, and generating piece-rate payroll. The spec describes 5 screens.

## Files to modify / create

| Action | File |
|---|---|
| Create | `src/app/EAApp.tsx` |
| Modify | `src/app/App.tsx` — add import + routing |
| Modify | `src/app/LoginView.tsx` — add credential check + hint row |

---

## Step 1 — Extend type union & credentials

### `src/app/LoginView.tsx`
- Change `onLogin` prop type: `(role: "admin" | "rd" | "prod" | "exec") => void`
- Add credential check after the `prod_head` block:
```ts
} else if (username === "executive" && password === "executive") {
  onLogin("exec");
}
```
- Add 4th row to prototype credentials hint card:
```tsx
<div className="flex items-center gap-3">
  <span className="text-muted-foreground w-24">executive</span>
  <span className="text-foreground">executive</span>
  <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-sans">EA</span>
</div>
```

### `src/app/App.tsx`
- Extend state: `useState<"admin" | "rd" | "prod" | "exec" | null>(null)`
- Add import: `import EAApp from "./EAApp";`
- Add routing before admin block: `if (userRole === "exec") return <EAApp onLogout={() => setUserRole(null)} />;`

---

## Step 2 — EAApp shell (`src/app/EAApp.tsx`)

Same shell pattern as `RDApp` / `ProdApp`:
- Fixed header (`h-12`): TC logo + "TILAO CORP", breadcrumb, search bar, Bell (badge), Profile "Sofia Lim · Executive Assistant" (initials SL), Logout → `onLogout()`
- Collapsible sidebar (`w-56` / `w-14`): 5 flat nav items (no sub-items)
- Scrollable main + footer `v2.4.1 · EA Portal · Sofia Lim`

### Sidebar nav
```
Command Center   → ea-dashboard    icon: LayoutDashboard
Production       → ea-production   icon: Package
Petty Cash       → ea-pettycash    icon: DollarSign
Inventory        → ea-inventory    icon: Archive
Payroll          → ea-payroll      icon: FileText
```

---

## Step 3 — Data constants (top of `EAApp.tsx`)

```ts
const eaCashSpend = [10 data points: day + amount over last 30 days]
const eaBundles = [8 bundles with id, design, seamstress, status, flagged bool, timeline array]
const eaCashRequests = [5 requests with id, manager, dept, amount, reason, status, items array]
const eaInventory = [12 materials across 4 categories with stock/min/max]
const eaSeamstresses = [6 seamstresses with bundles, rate, deductions, bonus fields]
```

---

## Step 4 — Screen views

### `EADashboard` (ea-dashboard)
- 3 KPI cards: Pending Petty Cash (4), Low Stock Alerts (3), Bundles in Back Job (2)
- Cash Burn Sparkline: `LineChart` on `eaCashSpend` (day × amount), height 160, no legend, single dark line
- Task Triage feed: 8 actionable notification rows with icon, message, timestamp, "View" button (no-op)

### `EAProduction` (ea-production)
- **Kanban board** (4 columns): "In Progress" | "Pending QC" | "Back Job" | "Approved" — filter `eaBundles` by status into each column. Cards show bundle ID, design, seamstress, Rush badge if flagged. "Flag Rush" icon button toggles `flagged` local state.
- **Bundle Audit Trail** below: searchable table. Clicking a row expands inline to show `timeline` events (time | event | by). `expandedBundle` state tracks which row is open.

### `EAPettyCash` (ea-pettycash)
- Two-column layout (`flex gap-4`):
  - **Left** (`w-64`): clickable request list — REQ ID, manager, amount, status badge
  - **Right** (flex-1): selected request detail — metadata, line items table (Payee | Amount | Reason), 3 action buttons:
    - "Endorse to Boss" → success toast + status → "Endorsed"
    - "Return to Sender" → small inline textarea for reason → toast + status → "Returned"  
    - "Approve (Proxy)" → confirm → toast + status → "Approved"
- Empty state when nothing selected

### `EAInventory` (ea-inventory)
- Category tabs: Fabrics | Threads | Packaging | Accessories
- Table: Material | Unit | Stock | Min | Stock Level (progress bar: green/yellow/red) | Status badge (Good/Low/Critical) | Actions
- Reorder button on Low/Critical rows → inline draft petty cash form (item, qty, cost) → "Save Draft" toast

### `EAPayroll` (ea-payroll)
- Pay period date inputs (From / To), pre-filled Jul 1–15 2026
- Piece-rate table: Seamstress | Bundles | Rate | Gross | Deductions (editable input) | Bonus (editable input) | Net Pay (computed)
- Summary totals row
- "Generate Payslips" → `toast.success("Payroll submitted for approval")`
- Payroll history table: 3 prior runs (Period | Seamstresses | Total | Status)

---

## Imports for `EAApp.tsx`
```ts
import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  LayoutDashboard, Package, DollarSign, Archive, FileText,
  ChevronDown, ChevronRight, Search, LogOut, User, Bell,
  Menu, X, AlertCircle, Clock, CheckCircle, Flag, Eye, Plus, Save,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatusBadge, KPICard, SectionHeader } from "./shared";
```

---

## Verification
1. `executive` / `executive` → EA portal renders; other 3 logins unchanged
2. Login screen shows 4 prototype account rows
3. Command Center: 3 KPIs, sparkline, triage feed render
4. Production: Kanban columns correct; flagging adds badge; row expand shows timeline
5. Petty Cash: left-panel click populates right; each action fires toast + updates badge
6. Inventory: tabs filter; progress bars color-code correctly; Reorder opens draft form
7. Payroll: editing deductions/bonus re-computes Net Pay; Generate fires toast

---

# Plan: RDLibrary — working action buttons (modal + toaster)

## Context
The Design Library (`RDLibrary`, ~line 2292 in `src/app/App.tsx`) has 5 action buttons per row (View, Edit, Duplicate, Release, Archive) that are currently inert. The user wants them to actually do something. `sonner` v2.0.3 is installed but not yet imported. The existing collection modal pattern (fixed inset-0 overlay) is the established in-app modal style.

## File to modify
`src/app/App.tsx` only.

---

## Changes

### 1. Add sonner import (top of file)
```ts
import { Toaster, toast } from "sonner";
```

### 2. Add `<Toaster />` to `RDApp` shell
Inside the `RDApp` return JSX, just before the final closing `</div>`, add:
```tsx
<Toaster position="bottom-right" richColors />
```

### 3. Extend `RDLibrary` with state + modals

Add two state variables inside `RDLibrary`:
```ts
const [viewDesign, setViewDesign] = useState<typeof rdDesigns[0] | null>(null);
const [editDesign, setEditDesign] = useState<typeof rdDesigns[0] | null>(null);
```

### 4. Wire action buttons

Replace the inert buttons with:
```tsx
<button title="View"      onClick={() => setViewDesign(d)}  ...><Eye size={12} /></button>
<button title="Edit"      onClick={() => setEditDesign(d)}  ...><Pencil size={12} /></button>
<button title="Duplicate" onClick={() => toast.success(`Design ${d.code} duplicated`, { description: "Saved as a new draft" })} ...><RefreshCw size={12} /></button>
{d.status === "Draft" && (
  <button title="Release" onClick={() => toast.success(`${d.code} released to Production`, { description: d.name })} ...><CheckCircle size={12} /></button>
)}
<button title="Archive"   onClick={() => toast(`${d.code} archived`, { description: "Moved to archived designs" })} ...><Archive size={12} /></button>
```

### 5. View modal
Reuse the same overlay pattern as the collection modal (fixed inset-0 bg-black/40 z-50, click-outside closes):

Content panel (`max-w-lg`):
- **Header**: Design code + name, status badge, X close button
- **Info grid** (2-col): Collection, Season, Category, Version, Released By, Release Date
- **Status section**: current status badge + descriptive text
- **Footer actions**: "Edit Design" button (closes View, opens Edit) + "Close"

### 6. Edit modal
Same overlay pattern, panel `max-w-md`:

- **Header**: "Edit Design — {code}", X close button
- **Form fields**:
  - Design Name (text input, pre-filled)
  - Collection (select, pre-filled)
  - Season (select, pre-filled)
  - Status (select: Draft / Released / Archived)
- **Footer**: "Save Changes" → `toast.success("Changes saved")` + close modal | "Cancel" → close modal

---

## Verification
1. Hover a row in Design Library → action buttons appear
2. Click **View** → modal opens with design details; X/backdrop closes it
3. Click **Edit** → edit modal opens with pre-filled fields; Save → toast + close; Cancel → close
4. Click **Duplicate** → `sonner` toast "Design D-xxx duplicated" appears bottom-right
5. Click **Release** (Draft rows only) → success toast "released to Production"
6. Click **Archive** → neutral toast "archived"
7. Toaster appears only in RD portal (scoped to `RDApp`)

---

# Plan: RDNewDesign — full-width form panels

## Context
All six tab panels in `RDNewDesign` (`src/app/App.tsx`) are constrained to `max-w-2xl`, making the form narrower than the available content area. The user wants the form to stretch to full width and be flexible.

## File to modify
`src/app/App.tsx` — `RDNewDesign` function only.

## Changes
Remove `max-w-2xl` from these five locations (line numbers approximate — use string matching):

| Current class string | Replace with |
|---|---|
| `"bg-card border border-border rounded-lg p-5 space-y-4 max-w-2xl"` (General Info panel) | remove `max-w-2xl` |
| `"bg-card border border-border rounded-lg p-5 space-y-4 max-w-2xl"` (Tech Specs panel) | remove `max-w-2xl` |
| `"bg-card border border-border rounded-lg p-4 max-w-2xl"` (Cost Estimation card in BOM tab) | remove `max-w-2xl` |
| `"bg-card border border-border rounded-lg p-5 space-y-4 max-w-2xl"` (Attachments panel) | remove `max-w-2xl` |
| `"space-y-4 max-w-2xl"` (Preview & Release wrapper) | `"space-y-4"` |

The `max-w-[72px]` on the stepper step-label span is intentional — leave it untouched.

## Verification
1. Navigate to R&D → New Design
2. Each tab's form card stretches edge-to-edge within the main content area
3. Stepper step labels are still truncated correctly at 72px

---

# Plan: RDNewDesign — stepper tab redesign

## Context
The "Create / Edit Design" form (`RDNewDesign`, lines 2377–2726 in `src/app/App.tsx`) currently uses a plain underline tab strip for navigation between its 6 steps. The user wants this replaced with a horizontal step-progress stepper matching the attached image: numbered circles (filled black when active/completed, gray-outlined when pending), a connecting line between steps, a "STEP N" micro-label above each circle, the step name below, and a status badge ("In Progress" / "Pending" / "Complete") beneath the name.

## File to modify
`src/app/App.tsx` only.

---

## Changes

### 1. Add `Check` to lucide-react imports
The stepper needs a checkmark inside completed step circles. Add `Check` to the existing import line (line ~2–10).

### 2. Replace the tab strip with a stepper in `RDNewDesign`

The 6 tabs and their keys stay exactly the same:
```
general → General Info
tech    → Tech Specs
bom     → Bill of Materials
attach  → Attachments
versions → Version History
preview → Preview & Release
```

Replace the current:
```tsx
<div className="flex gap-0 border-b border-border overflow-x-auto">
  {tabs.map(t => ( <button ...> ))}
</div>
```

With this stepper:
```tsx
const tabKeys = ["general", "tech", "bom", "attach", "versions", "preview"];
const currentIdx = tabKeys.indexOf(activeTab);

<div className="flex items-start w-full mb-6">
  {tabs.map((t, i) => {
    const isCompleted = i < currentIdx;
    const isCurrent   = i === currentIdx;
    return (
      <div key={t.key} className="flex items-start flex-1 min-w-0">
        {/* Step column */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {/* "STEP N" micro-label */}
          <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
            Step {i + 1}
          </span>
          {/* Circle */}
          <button
            onClick={() => (isCompleted || isCurrent) && setActiveTab(t.key)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
              ${isCompleted ? "bg-foreground border-foreground cursor-pointer"
                : isCurrent  ? "bg-foreground border-foreground cursor-default"
                : "bg-background border-border cursor-default"}`}
          >
            {isCompleted
              ? <Check size={13} className="text-background" />
              : <span className={`text-[11px] font-bold leading-none
                  ${isCurrent ? "text-background" : "text-muted-foreground"}`}>
                  {i + 1}
                </span>}
          </button>
          {/* Step name */}
          <span className={`text-[10px] font-medium text-center leading-tight max-w-[72px] truncate
            ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
            {t.label}
          </span>
          {/* Status badge */}
          <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap
            ${isCompleted ? "bg-foreground/8 text-foreground"
              : isCurrent  ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"}`}>
            {isCompleted ? "Complete" : isCurrent ? "In Progress" : "Pending"}
          </span>
        </div>
        {/* Connector line — between steps only */}
        {i < tabs.length - 1 && (
          <div className={`h-0.5 flex-1 mx-2 mt-[22px] transition-colors
            ${i < currentIdx ? "bg-foreground" : "bg-border"}`} />
        )}
      </div>
    );
  })}
</div>
```

All 6 tab panel content blocks (`{activeTab === "general" && ...}` etc.) remain completely unchanged — only the navigation strip is replaced.

---

## Verification
1. `RDNewDesign` page renders with the horizontal stepper instead of underline tabs
2. Step 1 starts as "In Progress" (filled black circle, "In Progress" badge), steps 2–6 as "Pending"
3. Clicking "Next" advances the stepper — previous step shows checkmark + "Complete", new step is "In Progress"
4. Clicking a completed circle navigates back to that step
5. Connecting line between steps fills black as steps are completed
6. All form content (fields, BOM table, attachments, version history, preview) is unchanged

---

# Plan: Production / QA Dashboard — prod_head account

## Context
A third user role (`prod_head` / `prod_head`) needs its own fully separate dashboard for Production Heads who also handle QC inspection. The spec is defined in `src/imports/pasted_text/production-qa-dashboard.md`. The implementation mirrors the `RDApp` pattern already established in `App.tsx` — same shell (header, collapsible sidebar, scrollable main, footer), same `useState`-based navigation, same shared components (`StatusBadge`, `KPICard`, `SectionHeader`).

## File to modify
`src/app/App.tsx` only.

---

## Step 1 — Extend type union + credentials

**LoginView** (line ~3048): add third credential check:
```ts
} else if (username === "prod_head" && password === "prod_head") {
  onLogin("prod");
}
```

**`onLogin` prop type** (line ~3036): `(role: "admin" | "rd" | "prod") => void`

**App `userRole` state** (line ~3157): `useState<"admin" | "rd" | "prod" | null>(null)`

**Routing** (line ~3209): add before admin block:
```tsx
if (userRole === "prod") return <ProdApp onLogout={() => setUserRole(null)} />;
```

**Prototype credentials hint** in `LoginView` footer: add a third row:
```tsx
<div className="flex items-center gap-3">
  <span className="text-muted-foreground w-24">prod_head</span>
  <span className="text-foreground">prod_head</span>
  <span className="...rounded font-sans">Production</span>
</div>
```

---

## Step 2 — Data constants (insert above `ProdApp`)

```ts
const prodBundles = [
  { id: "BND-20260722-0012", design: "Classic Polo", qty: 25, size: "L", color: "White",
    seamstress: "Maria Santos", status: "Pending QC", updated: "1:05 PM", batch: "B-07" },
  // 9 more rows — mix of: In Progress, Pending QC, Approved, Rejected, Back Job, Completed
];

const prodSeamstresses = [
  { name: "Maria Santos", active: 3, completedToday: 5, status: "Active" },
  // 5 more
];

const prodTimeline = [
  { time: "8:30 AM", activity: "Bundle Created", by: "prod_head" },
  { time: "8:45 AM", activity: "Assigned to Maria Santos", by: "prod_head" },
  { time: "12:15 PM", activity: "Sewing Completed", by: "m.santos" },
  { time: "1:05 PM", activity: "QC Inspection Started", by: "prod_head" },
  { time: "1:20 PM", activity: "Approved", by: "prod_head" },
];

const prodPendingQC = [
  { id: "BND-20260722-0011", design: "Heritage Stripe", seamstress: "Liza Cruz",
    completedAt: "12:45 PM", waiting: "35 min" },
  // 3 more
];

const prodBackJobs = [
  { id: "BND-20260722-0008", reason: "Stitch defect on collar", seamstress: "Ana Reyes",
    status: "In Rework", due: "Jul 23, 2026" },
  // 2 more
];

const prodNotifications = [
  { type: "warn", msg: "Bundle BND-0011 has been waiting for QC for 35 minutes", time: "12:45 PM" },
  // 3 more
];

const prodInspections = [
  { id: "BND-20260722-0010", design: "Diamond Weave", result: "Approved",
    inspector: "prod_head", time: "11:30 AM" },
  // 3 more
];

const prodReportData = [
  { month: "Feb", created: 38, completed: 34, approved: 30, backjobs: 4 },
  // 5 months
];
```

---

## Step 3 — ProdApp shell

Identical pattern to `RDApp` (lines 1941–2163):

```tsx
function ProdApp({ onLogout }: { onLogout: () => void }) {
  const [prodPage, setProdPage] = useState("prod-overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string,boolean>>({});
  // notifOpen, profileOpen, refs, useEffect click-outside — same pattern
```

**Header**: "TILAO CORP" logo · breadcrumb · Search Bundle input · QR scan icon button (no-op) · Bell with badge · Profile "Juan dela Cruz · Production Head" (initials JD)

**Sidebar nav** (4 top-level, no sub-items needed):
```
Dashboard   → prod-overview    icon: LayoutDashboard
Bundles     → prod-bundles     icon: Package
QC Inspect  → prod-qc          icon: ClipboardList
Reports     → prod-reports     icon: BarChart3
```

**renderProdContent()**:
```tsx
if (prodPage === "prod-overview")  return <ProdOverview navigate={setProdPage} />;
if (prodPage === "prod-bundles")   return <ProdBundles />;
if (prodPage === "prod-qc")        return <ProdQC />;
if (prodPage === "prod-reports")   return <ProdReports />;
```

**Footer**: `v2.4.1 · Production Portal · Juan dela Cruz`

---

## Step 4 — Page views

### `ProdOverview` (`prod-overview`)
- **7 KPI cards**: Total Bundles (78), In Progress (19), Pending QC (8), Approved (41), Rejected (3), Back Jobs (4), Completed Today (12)
- **Quick Actions**: Create Bundle, Scan QR Code, Assign Seamstress, View Pending QC, Print Bundle Label
- **Bundle table** (main): all columns from spec — Bundle No. | Design | Qty | Size | Seamstress | Status | Last Updated | Actions (View, Scan, Edit, Update Status, Print QR). Show top 6 rows from `prodBundles`.
- **Two-col row**: Pending QC Queue (table: Bundle | Design | Seamstress | Completed At | Waiting Time) | Back Job Queue (table: Bundle | Reason | Seamstress | Status | Due Date)
- **Two-col row**: Production Timeline (vertical list for BND-20260722-0012) | Recent Inspections (table with result badge)

### `ProdBundles` (`prod-bundles`)
- Filter bar: Search, Status filter, Design filter, Seamstress filter, Size filter
- Full bundle table (all 10 rows, same columns as overview)
- **Create Bundle inline panel** (toggled by "Create Bundle" button): Select Design, Quantity, Size, Color, Batch Number, Production Date. Buttons: "Save & Print QR" / "Save Only" (both no-op)
- **Seamstress Assignment panel** below table: table of seamstresses (Name | Active Bundles | Completed Today | Status) + Assign form (Select Bundle, Select Seamstress, Assign button)

### `ProdQC` (`prod-qc`)
- **QR Scan display card**: shows a selected bundle's info (bundle no, design, size, qty, current status, seamstress). "Simulate Scan" dropdown to pick a bundle from `prodPendingQC`.
- **QC Inspection form** (shows when a bundle is selected): Bundle info section, Upload Photo placeholder, Inspection Checklist (5 checkboxes: Stitch Quality, Measurement, Fabric Defects, Accessories, Overall Appearance), Remarks textarea, Status buttons (Approve / Reject / Back Job). Clicking one updates local state to show a result card.
- **Pending QC Queue table** (below): same columns as spec — Bundle | Design | Seamstress | Completed At | Waiting Time. Clicking a row populates the scan display card.
- **Back Job Management table**: Bundle | Reason | Assigned Seamstress | Status | Due Date

### `ProdReports` (`prod-reports`)
- Sub-tabs: **Production** | **Quality** | **Productivity**
- Export PDF / Export Excel buttons (no-op)
- **Production tab**: BarChart (monthly: Created / Completed / Approved / Back Jobs using `prodReportData`) + summary table (Month | Created | Completed | QC Approved | Back Jobs | Efficiency %)
- **Quality tab**: KPIs (Pass Rate 89%, Rejection Rate 4%, Back Job Rate 5%, Avg Inspection Time 18 min) + table (Design | Inspected | Approved | Rejected | Back Job | Pass Rate)
- **Productivity tab**: table (Seamstress | Bundles Completed | Back Jobs | Avg Time | Efficiency %)

---

## Reuse
- `StatusBadge`, `KPICard`, `SectionHeader` — unchanged
- `productionData` (already defined) — reuse in Production tab bar chart alongside new `prodReportData`
- All table/input/card CSS patterns from existing admin and RDApp pages
- `recharts` already imported — `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `ResponsiveContainer`

---

## Verification
1. Login `prod_head` / `prod_head` → Production dashboard renders
2. Login `system_admin` / `system_admin` → admin dashboard unchanged
3. Login `research_dev` / `research_dev` → R&D dashboard unchanged
4. Login screen shows 3 prototype account rows
5. All 4 sidebar pages render with data
6. QC Inspection: clicking a pending QC row populates the scan card; clicking Approve/Reject/Back Job updates status display
7. Create Bundle panel toggles open/closed
8. Reports: 3 sub-tabs switch, bar chart renders

---

# Plan: Login screen — remove subtitle + add prototype credentials hint

## Context
The login screen currently shows "System Administration" under the TILAO CORP logo — this should be removed since the portal now serves multiple roles. Additionally, since this is a prototype, the known test accounts should be visibly displayed in the lower-right corner of the screen so testers don't need to remember credentials.

## File to modify
`src/app/App.tsx` — `LoginView` function only (~lines 3067–3132).

## Changes

### 1. Remove subtitle (line 3072)
Delete this line:
```tsx
<p className="text-xs text-muted-foreground mt-1 tracking-wide">System Administration</p>
```

### 2. Add prototype credentials hint — lower-right corner
Wrap the entire login page `<div>` in a `relative` container (it likely already is), then add a fixed/absolute credentials panel in the bottom-right:

```tsx
<div className="fixed bottom-5 right-5 bg-card border border-border rounded-lg p-3 shadow-lg text-[10px] font-mono space-y-1.5">
  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 font-sans font-medium">Prototype Accounts</div>
  <div className="flex items-center gap-3">
    <span className="text-muted-foreground w-20">system_admin</span>
    <span className="text-foreground">system_admin</span>
    <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Admin</span>
  </div>
  <div className="flex items-center gap-3">
    <span className="text-muted-foreground w-20">research_dev</span>
    <span className="text-foreground">research_dev</span>
    <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">R&D</span>
  </div>
</div>
```

Place this just before the closing tag of the outermost `LoginView` div (after the existing footer). Use `fixed` positioning so it always appears in the corner regardless of scroll.

## Verification
1. Login page loads — "System Administration" text is gone
2. Bottom-right corner shows a small card with both account credentials and role labels
3. Both credentials still work for login

---

# Plan: Collections "View" modal with placeholder images

## Context
The Collections page (`RDCollections`, ~line 2728 in `src/app/App.tsx`) shows 6 collection cards, each with a "View" button that currently does nothing. The user wants clicking "View" to open a modal showing the designs in that collection, with placeholder images for each design card. No external image service is needed — placeholder images are styled `<div>` elements with a subtle diagonal-stripe pattern and the design code centered.

## File to modify
`src/app/App.tsx` only — edit the `RDCollections` function.

---

## Implementation

### State
Add `selectedCollection` (`typeof rdCollections[0] | null`, default `null`) inside `RDCollections`.

### "View" button wire-up
Each card: `onClick={() => setSelectedCollection(c)}`.

### Designs to show in modal
```ts
const realDesigns = rdDesigns.filter(d => d.collection === selectedCollection.name);
const placeholderCount = Math.min(Math.max(0, selectedCollection.designs - realDesigns.length), 11);
const placeholders = Array.from({ length: placeholderCount }, (_, i) => ({
  code: `D-0${80 + i}`, name: `Design ${80 + i}`, status: "Released", version: "1.0",
}));
const designs = [...realDesigns, ...placeholders];
```

### Modal structure
Fixed inset-0 backdrop (`bg-black/40 z-50`), click-outside closes. Inner panel: `max-w-3xl max-h-[80vh] flex flex-col`.

- **Header**: collection name + season tag + status badge + `X` close button. Description line below.
- **Sub-header**: design count + "(showing X designs)" label.
- **Design grid** (scrollable, 4-column): each card has a placeholder image `<div>` (`h-28 bg-muted`) with a diagonal stripe overlay and the design code centered in `font-mono`, then a small footer with design name + `StatusBadge`.

### Placeholder image pattern
```tsx
<div className="h-28 bg-muted relative overflow-hidden flex items-center justify-center">
  <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px)" }} />
  <span className="relative text-[10px] font-mono text-muted-foreground">{d.code}</span>
</div>
```

---

## Verification
1. Click "View" on any collection card → modal appears over dark overlay
2. Clicking outside backdrop or X button closes modal
3. Grid shows real matched designs + padded placeholders up to ~15 items
4. Each card has striped placeholder image, design code, name, status badge
5. Header shows collection name, season, description, and design count

---

# Plan: R&D Dashboard — research_dev account

## Context
A second user account (`research_dev` / `research_dev`) needs its own fully separate dashboard tailored for R&D personnel. The existing `system_admin` dashboard stays untouched. The login screen already supports credential-based routing via `onLogin` — we extend this to pass back which role logged in, then render the correct dashboard root.

## File to modify
`src/app/App.tsx` only. No new files needed.

---

## Step 1 — Extend LoginView to return the role

Change `LoginView`'s `onLogin` prop signature from `() => void` to `(role: "admin" | "rd") => void`.

Add a second credential check in `handleSubmit`:
```ts
if (username === "system_admin" && password === "system_admin") {
  onLogin("admin");
} else if (username === "research_dev" && password === "research_dev") {
  onLogin("rd");
} else {
  setError(true); setLoading(false);
}
```

The login card subtitle should stay generic: `"System Administration"` — it fits both roles since it's a shared entry point.

---

## Step 2 — Route by role in App

In `App`, change `isAuthenticated: boolean` to `userRole: "admin" | "rd" | null` (default `null`).

```ts
const [userRole, setUserRole] = useState<"admin" | "rd" | null>(null);
```

- `if (!userRole)` → render `<LoginView onLogin={(role) => setUserRole(role)} />`
- `if (userRole === "rd")` → render `<RDApp onLogout={() => setUserRole(null)} />`
- otherwise → existing admin dashboard JSX (unchanged, just replace `setIsAuthenticated(false)` with `setUserRole(null)` on logout)

---

## Step 3 — RDApp component

A self-contained component: `function RDApp({ onLogout }: { onLogout: () => void })`.

### Layout
Same shell pattern as the admin dashboard:
- Fixed header (h-12)
- Sidebar (w-56 / w-14 collapsed)
- Scrollable main content
- Footer (h-8)

### Header
- TC logo mark + "TILAO CORP" wordmark
- Page title / breadcrumb
- Search bar ("Search designs…")
- Notifications bell with unread badge
- Profile dropdown: "Ana Reyes · R&D Lead", My Profile, Change Password, Logout → calls `onLogout()`

### Sidebar navigation (R&D-specific)
```
Dashboard        → rd-overview
Design Library   → rd-library
  My Designs
  All Designs
  Archived
New Design       → rd-new-design   (direct link, no sub-items)
Collections      → rd-collections
Reports
  Design Release Report
  Material Report
  Version History
  Cost Estimation
```

### Pages inside RDApp (all via `rdPage` state):

#### `rd-overview` — R&D Dashboard
- 6 KPI cards: Total Designs (148), Draft (12), Released (132), Archived (16), Active Collections (6), Awaiting Approval (4)
- Quick Actions: Create New Design, View Design Library, Upload Pattern, Upload Tech Pack, Release Design
- Design Library mini-table (last 5 designs with status badges)
- Two-column row: Recent Drafts | Recent Released Designs (3 items each)
- Recent Activity feed (6 items: saved, released, pattern uploaded, version updated, etc.)

#### `rd-library` — Design Library
- Filter bar: search, Collection filter, Status filter (Draft/Released/Archived/Pending), Season filter
- Full design table: Design Code | Design Name | Collection | Version | Status | Release Date | Actions
  - Actions: View, Edit, Duplicate, Release (only if Draft), Archive
- 10 rows of realistic design data across 3 collections
- Pagination footer

#### `rd-new-design` — Create / Edit Design (tabbed form)

6 tabs:
1. **General Info** — Design Code (auto `D-104`), Design Name, Collection (select), Season, Category, Description
2. **Tech Specs** — Garment Type, Fabric Type, GSM/Weight, Color Options (tag input), Sizes (checkboxes: XS–3XL), Stitch Type, Sewing Instructions (textarea), Measurement Chart (mini table: S/M/L/XL × Chest/Waist/Length)
3. **Bill of Materials** — editable table rows: Material | Supplier | Quantity | Unit. Pre-filled with Fabric, Thread, Buttons, Zipper, Labels, Packaging, Hang Tags. Add Row button.
4. **Attachments** — upload placeholders for Tech Pack (PDF), Pattern Files, CAD Files, Marker Files, Sewing Guide, Size Chart. Each shows filename slot + "Browse" button (non-functional).
5. **Version History** — table: Version | Modified By | Date | Changes Summary. 3 rows for D-103. View / Restore / Compare action buttons.
6. **Preview & Release** — read-only summary card showing all entered info. Two action buttons: "Print Tech Pack" (no-op) and "Release Design" (sets status to Released with a confirmation step).

Design form state lives inside `RDNewDesignView` using local `useState` with a `activeTab` string.

#### `rd-collections` — Collections
- KPI: Active Collections (6), Total Designs (148), Avg per Collection (24), New This Season (3)
- Cards grid (3 columns): Collection name, season tag, design count, status badge, View button

#### `rd-reports` — Reports
- Tabs: Design Release | Material Requirements | Version History | Cost Estimation
- Each tab shows a table + an Export (PDF/Excel) button row
- Design Release tab reuses the `allDesigns` data as a release log table
- Cost Estimation tab shows a mini bar chart of estimated cost per design category

---

## R&D-specific data constants to add (above RDApp)

```ts
const rdDesigns = [ /* 10 designs D-094 to D-103 */ ];
const rdCollections = [ /* 6 collections */ ];
const rdVersionHistory = [ /* 3 versions for D-103 */ ];
const rdBOM = [ /* 7 materials */ ];
const rdActivity = [ /* 6 recent activity items */ ];
const rdNotifications = [ /* 5 notifications */ ];
```

---

## Reuse from existing code
- `StatusBadge` — reused as-is
- `KPICard` — reused as-is
- `SectionHeader` — reused as-is
- Table pattern, input/select styling, form patterns — all identical to admin pages
- `recharts` — already imported; used for cost estimation bar chart in Reports

---

## Verification
1. Login with `research_dev` / `research_dev` → R&D dashboard renders (not admin)
2. Login with `system_admin` / `system_admin` → admin dashboard as before
3. Wrong credentials → error state on login screen
4. R&D sidebar navigation: all 5 top-level items navigate correctly
5. New Design form: all 6 tabs switch correctly, BOM add row works
6. Release Design button in Preview tab shows confirmation then updates status
7. R&D Logout → returns to login screen


## Context
13 pages in the app currently render a `PlaceholderView` ("This section is under development."). The user wants all of them fully built out with realistic data and working UI — tables, forms, charts, toggles, etc. — matching the visual style and patterns already established in `DashboardView` and `UsersView`.

## File to modify
`src/app/App.tsx` only — replace `PlaceholderView` usages in `renderContent()` with real view components, and add the new view functions above `PlaceholderView`. Also add new data constants at the top of the file alongside the existing ones.

## Existing patterns to reuse
- `SectionHeader` — title + optional action slot
- `StatusBadge` — maps status strings to styled badges
- `KPICard` — icon + number + subtitle card
- Table pattern: `bg-card border border-border rounded-lg overflow-hidden` > `overflow-x-auto` > `<table>` with `divide-y divide-border/50` rows and `hover:bg-white/[0.02]` hover
- Input/select pattern: `bg-muted border border-border rounded px-3 py-2 text-xs focus:border-primary/50`
- `recharts` for all charts (LineChart, BarChart, PieChart) — already imported

---

## Pages to implement

### 1. `RolesView` (key: `roles`)
- KPI row: Total Roles (6), System Roles (2), Custom Roles (4), Users Assigned (32)
- Table: Role Name | Description | Users | Permissions | Status | Actions (Edit, Delete)
- Data: Admin, R&D Lead, Production Operator, QC Inspector, Finance Officer, Manager
- "Create Role" button opens an inline form: Role Name, Description, Status toggles for permission groups (User Mgmt, Production, Finance, Reports, System)

### 2. `PermissionsView` (key: `permissions`)
- Matrix layout: rows = permission actions (View, Create, Edit, Delete, Approve, Export), columns = roles (Admin, R&D, Production, QC, Finance, Manager)
- Each cell is a read-only checkbox/tick showing whether that role has that permission
- Admin has all ticked; others have subsets
- Header: "Permission Matrix" with a "Save Changes" button

### 3. `BundleManagementView` (key: `bundles`)
- KPI row: Total Bundles (78), Active (19), Completed (55), Back Jobs (14)
- Filter bar: search, status filter, date range
- Table: Bundle ID | Design | Quantity | Assigned To | Status | QC Status | Date | Actions
- 8 rows of realistic data with statuses: In Progress, QC Pending, Completed, Back Job

### 4. `QRCodeManagementView` (key: `qr`)
- KPI row: Total Generated (1,204), Active (892), Expired (312), Today (47)
- Table: QR ID | Bundle ID | Design | Generated By | Date | Status | Actions (View, Download, Deactivate)
- 6 rows of data
- "Generate QR" button

### 5. `DesignManagementView` (key: `designs`)
- KPI row: Total Designs (148), Active (132), Archived (16), Pending Approval (4)
- Table: Design ID | Name | Version | Created By | Release Date | Status | Actions
- 8 rows with statuses: Active, Archived, Pending
- "Upload Design" button

### 6. `PettyCashView` (key: `pettycash`)
- KPI row: Current Balance (₱12,450), Total Disbursed This Month (₱8,320), Pending (₱1,200), Replenishments (3)
- Table: Transaction ID | Description | Amount | Requested By | Date | Status | Actions
- 7 rows mixing disbursements and replenishments
- "New Request" button

### 7. `ReplenishmentView` (key: `replenishment`)
- KPI row: Total Requests (12), Approved (8), Pending (3), Rejected (1)
- Table: Request ID | Amount | Requested By | Department | Date | Approver | Status | Actions
- 6 rows
- "Submit Request" button opens inline form: Amount, Purpose, Department, Attachment note

### 8. `ProductionReportsView` (key: `prod-reports`)
- Date range filter + Export button
- Summary KPIs: Bundles Created, Completed, QC Pass Rate, Back Job Rate
- BarChart: Monthly production (reuse `productionData`)
- Table: Month | Created | Completed | QC Approved | Back Jobs | Efficiency %

### 9. `FinancialReportsView` (key: `fin-reports`)
- Date range filter + Export button
- KPIs: Total Petty Cash Used, Replenishments, Average Request, Largest Disbursement
- LineChart: Monthly petty cash spend (6 months of data)
- Table: Month | Petty Cash Used | Replenishments | Net Balance

### 10. `AuditReportsView` (key: `audit-reports`)
- Date range + module filter + Export
- KPIs: Total Events (284), User Actions (198), System Events (86), Failed Logins (7)
- BarChart: Events by module (Users, Finance, Production, QC, System, Design)
- Table: Date | User | Action | Module | IP Address

### 11. `AuditLogsView` (key: `audit-logs`)
- Full audit log table with search + module filter + date filter
- Columns: Timestamp | User | Role | Action | Module | IP Address | Status
- 12 rows of detailed log entries
- Pagination row (showing 1–12 of 284)
- "Export Log" button

### 12. `NotificationsView` (key: `notifications`)
- Filter tabs: All | Unread | Warnings | System
- List of 10 notifications with type icon, message, timestamp, and "Mark Read" / dismiss actions
- "Mark All Read" button
- Each notification row has a left-border accent color by type (warn=amber, ok=green, info=blue)

### 13. `SettingsView` (key: `settings`)
- Tabbed layout: General | Security | Notifications | Integrations
- General tab: System Name (editable), Timezone (select), Language (select), Date Format (select), Maintenance Mode toggle
- Security tab: Password policy fields (min length, expiry days, max attempts), Session timeout, 2FA toggle
- Notifications tab: toggles for Email Alerts, SMS Alerts, In-App Notifications, each with sub-toggles per event type
- Integrations tab: QR Generator URL, Backup Storage Path, API Key (masked), Status indicators
- "Save Settings" button per tab

### 14. `BackupView` (key: `backup`)
- KPI row: Last Backup (Today 2:00 AM), Next Scheduled (Tomorrow 2:00 AM), Backup Size (4.2 GB), Retention (30 days)
- System Health mini-panel (reuse same pattern from dashboard)
- Table: Backup history — ID | Type | Date & Time | Size | Status | Actions (Download, Restore, Delete)
- 6 rows: daily automated + 2 manual
- "Run Backup Now" button + "Configure Schedule" button

---

## renderContent() update
Replace the `PlaceholderView` fallback map with direct component calls:
```tsx
if (activePage === "roles")          return <RolesView />;
if (activePage === "permissions")    return <PermissionsView />;
if (activePage === "bundles")        return <BundleManagementView />;
if (activePage === "qr")             return <QRCodeManagementView />;
if (activePage === "designs")        return <DesignManagementView />;
if (activePage === "pettycash")      return <PettyCashView />;
if (activePage === "replenishment")  return <ReplenishmentView />;
if (activePage === "prod-reports")   return <ProductionReportsView />;
if (activePage === "fin-reports")    return <FinancialReportsView />;
if (activePage === "audit-reports")  return <AuditReportsView />;
if (activePage === "audit-logs")     return <AuditLogsView />;
if (activePage === "notifications")  return <NotificationsView />;
if (activePage === "settings")       return <SettingsView />;
if (activePage === "backup")         return <BackupView />;
```
Keep `PlaceholderView` as a final fallback for any unmapped key.

## Verification
1. Click every sidebar item — no page shows "under development"
2. Tables render with realistic data and correct columns
3. Charts render without duplicate-key warnings
4. Forms/buttons are interactive (state-driven open/close)
5. Settings tabs switch correctly
6. Notifications filter tabs filter the list
