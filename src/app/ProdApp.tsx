import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Package, ClipboardList, BarChart3,
  ChevronDown, ChevronRight, Search, LogOut, User, Lock,
  Bell, Menu, Eye, Pencil, QrCode, Plus, Users,
  CheckCircle, XCircle, RotateCcw, AlertCircle, Clock,
  Download, Save, RefreshCw, FileText, Printer, ShieldCheck,
  Activity, BookOpen, Box, X, Trash2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { StatusBadge, KPICard, SectionHeader } from "./shared";
// import "driver.js/dist/driver.css";
import { driver } from "driver.js";

// ─── Production Data ─────────────────────────────────────────────────────────

const prodBundles = [
  { id: "BND-20260722-0012", design: "Alexa Long Sleeve Top", qty: 24, size: "M", color: "Black", seamstress: "Maria Santos", status: "Pending QC", updated: "1:05 PM", batch: "B-07" },
  { id: "BND-20260722-0011", design: "Martina Scoop Neck Top", qty: 30, size: "S", color: "Ivory", seamstress: "Liza Cruz", status: "Pending QC", updated: "12:45 PM", batch: "B-06" },
  { id: "BND-20260722-0010", design: "Arya Tank Top", qty: 20, size: "M", color: "Dusty Pink", seamstress: "Rosa Mendez", status: "Approved", updated: "11:30 AM", batch: "B-05" },
  { id: "BND-20260722-0009", design: "Lounge Pants Plain", qty: 15, size: "L", color: "Charcoal", seamstress: "Cita Bautista", status: "In Progress", updated: "10:15 AM", batch: "B-04" },
  { id: "BND-20260722-0008", design: "Klea Mini Dress", qty: 18, size: "S", color: "Black", seamstress: "Ana Torres", status: "Back Job", updated: "9:50 AM", batch: "B-03" },
  { id: "BND-20260722-0007", design: "Lounge Pants Ribbed", qty: 20, size: "M", color: "Oat", seamstress: "Maria Santos", status: "In Progress", updated: "9:30 AM", batch: "B-02" },
  { id: "BND-20260722-0006", design: "Trouser Pants Straight", qty: 12, size: "S", color: "Black", seamstress: "Liza Cruz", status: "Approved", updated: "Yesterday 4:00 PM", batch: "B-01" },
  { id: "BND-20260722-0005", design: "Biker Shorts", qty: 22, size: "M", color: "Black", seamstress: "Rosa Mendez", status: "Completed", updated: "Yesterday 3:20 PM", batch: "A-12" },
  { id: "BND-20260722-0004", design: "Martina Scoop Neck Top", qty: 28, size: "L", color: "White", seamstress: "Cita Bautista", status: "Rejected", updated: "Yesterday 2:10 PM", batch: "A-11" },
  { id: "BND-20260722-0003", design: "Arya Tank Top", qty: 50, size: "XL", color: "Black", seamstress: "Ana Torres", status: "Completed", updated: "Yesterday 1:45 PM", batch: "A-10" },
  { id: "BND-20260723-0013", design: "Satin Cami Top", qty: 18, size: "S", color: "Champagne", seamstress: "—", status: "None", updated: "Just now", batch: "C-01" },
];

const prodSeamstresses = [
  { name: "Maria Santos", active: 3, completedToday: 5, status: "Active" },
  { name: "Liza Cruz", active: 2, completedToday: 4, status: "Active" },
  { name: "Rosa Mendez", active: 1, completedToday: 3, status: "Active" },
  { name: "Cita Bautista", active: 2, completedToday: 2, status: "Active" },
  { name: "Ana Torres", active: 1, completedToday: 1, status: "On Break" },
  { name: "Joy Reyes", active: 0, completedToday: 0, status: "Absent" },
];

const prodTimeline = [
  { time: "8:30 AM", activity: "Bundle Created", by: "prod_head" },
  { time: "8:45 AM", activity: "Assigned to Maria Santos", by: "prod_head" },
  { time: "12:15 PM", activity: "Sewing Completed", by: "m.santos" },
  { time: "1:05 PM", activity: "QC Inspection Started", by: "prod_head" },
  { time: "1:20 PM", activity: "Approved — passed all checklist items", by: "prod_head" },
];

const prodPendingQC = [
  { id: "BND-20260722-0012", design: "Alexa Long Sleeve Top", seamstress: "Maria Santos", completedAt: "1:05 PM", waiting: "15 min" },
  { id: "BND-20260722-0011", design: "Martina Scoop Neck Top", seamstress: "Liza Cruz", completedAt: "12:45 PM", waiting: "35 min" },
  { id: "BND-20260722-0009b", design: "Lounge Pants Plain", seamstress: "Rosa Mendez", completedAt: "11:50 AM", waiting: "1h 30m" },
  { id: "BND-20260722-0007b", design: "Lounge Pants Ribbed", seamstress: "Cita Bautista", completedAt: "11:20 AM", waiting: "2h 0m" },
];

const prodBackJobs = [
  { id: "BND-20260722-0008", reason: "Coverstitch break on hem — Klea Mini Dress", seamstress: "Ana Torres", status: "In Rework", due: "Jul 23, 2026" },
  { id: "BND-20260722-0004", reason: "Incorrect seam allowance — neckline drop off", seamstress: "Cita Bautista", status: "Pending Rework", due: "Jul 23, 2026" },
  { id: "BND-20260721-0015", reason: "Overlock thread tension uneven — back panel", seamstress: "Joy Reyes", status: "Re-Inspected", due: "Jul 22, 2026" },
];

const prodNotifications = [
  { type: "warn", msg: "Bundle BND-0011 (Martina Scoop Neck Top) waiting for QC — 35 min", time: "12:45 PM" },
  { type: "warn", msg: "Back job BND-0008 (Klea Mini Dress) due today — rework not yet started", time: "10:00 AM" },
  { type: "ok", msg: "Bundle BND-0010 approved — Arya Tank Top, 20 pcs (Dusty Pink)", time: "11:30 AM" },
  { type: "info", msg: "Seamstress Joy Reyes marked Absent for today", time: "8:05 AM" },
];

const prodNewDesigns = [
  { code: "MR-103", name: "Alexa Long Sleeve Top", brand: "Mera", collection: "Mera Essentials", category: "Knit", released: "Jul 22, 2026", by: "a.reyes" },
  { code: "MR-102", name: "Martina Scoop Neck Top", brand: "Mera", collection: "Mera Essentials", category: "Knit", released: "Jul 22, 2026", by: "rd.lead" },
  { code: "MR-101", name: "Arya Tank Top", brand: "Mera", collection: "Mera Essentials", category: "Knit", released: "Jul 21, 2026", by: "a.reyes" },
  { code: "MR-100", name: "Lounge Pants Plain", brand: "Mera", collection: "Mera Loungewear", category: "Knit", released: "Jul 18, 2026", by: "rd.lead" },
  { code: "MR-099", name: "Lounge Pants Ribbed", brand: "Mera", collection: "Mera Loungewear", category: "Knit", released: "Jul 15, 2026", by: "a.reyes" },
  { code: "MR-098", name: "Klea Mini Dress", brand: "Mera", collection: "Mera Signature", category: "Knit", released: "Jul 10, 2026", by: "rd.lead" },
  { code: "MR-097", name: "Premium Jeans High Rise", brand: "Mera", collection: "Mera Denim Edit", category: "Denim", released: "Jun 30, 2026", by: "a.reyes" },
  { code: "SP-045", name: "Oversized Street Tee", brand: "Sponty", collection: "Sponty Street", category: "Knit", released: "Jun 28, 2026", by: "rd.lead" },
  { code: "SP-044", name: "Biker Shorts", brand: "Sponty", collection: "Sponty Active", category: "Knit", released: "Jul 8, 2026", by: "a.reyes" },
  { code: "SP-043", name: "Cropped Hoodie", brand: "Sponty", collection: "Sponty Street", category: "Knit", released: "Jun 25, 2026", by: "rd.lead" },
  { code: "MR-096", name: "Trouser Pants Straight", brand: "Mera", collection: "Mera Tailored", category: "Woven", released: "Jul 20, 2026", by: "rd.lead" },
  { code: "MR-095", name: "Biker Shorts Mesh", brand: "Mera", collection: "Mera Active", category: "Knit", released: "Jul 19, 2026", by: "a.reyes" },
  { code: "MR-094", name: "Satin Cami Top", brand: "Mera", collection: "Mera Luxe", category: "Woven", released: "Jul 17, 2026", by: "rd.lead" },
  { code: "MR-093", name: "Wide Leg Trouser", brand: "Mera", collection: "Mera Tailored", category: "Woven", released: "Jul 16, 2026", by: "a.reyes" },
  { code: "MR-092", name: "Denim Mini Skirt", brand: "Mera", collection: "Mera Denim Edit", category: "Denim", released: "Jul 14, 2026", by: "rd.lead" },
  { code: "MR-091", name: "Ribbed Bodycon Dress", brand: "Mera", collection: "Mera Signature", category: "Knit", released: "Jul 12, 2026", by: "a.reyes" },
  { code: "SP-042", name: "Cuffed Shorts", brand: "Sponty", collection: "Sponty Active", category: "Knit", released: "Jul 5, 2026", by: "rd.lead" },
  { code: "SP-041", name: "Puffer Vest", brand: "Sponty", collection: "Sponty Street", category: "Woven", released: "Jun 20, 2026", by: "a.reyes" },
  { code: "MR-090", name: "High Waist Legging", brand: "Mera", collection: "Mera Active", category: "Knit", released: "Jul 11, 2026", by: "rd.lead" },
  { code: "MR-089", name: "Peplum Blouse", brand: "Mera", collection: "Mera Luxe", category: "Woven", released: "Jul 9, 2026", by: "a.reyes" },
  { code: "SP-040", name: "Track Pants", brand: "Sponty", collection: "Sponty Active", category: "Knit", released: "Jul 2, 2026", by: "rd.lead" },
  { code: "MR-088", name: "Jumpsuit Wide Leg", brand: "Mera", collection: "Mera Signature", category: "Woven", released: "Jul 7, 2026", by: "a.reyes" },
];

// ─── Design Document Types ──────────────────────────────────────────────────

interface DesignDocTechSpecs {
  garmentType: string; fabric: string; gsm: string; stitch: string;
  colors: string; sizes: string; sewing: string;
}
interface DesignDocMeasurement { point: string; S: number | string; M: number | string; L: number | string; XL: number | string; }
interface DesignDocBOMEntry { material: string; supplier: string; qty: number; unit: string; }
interface DesignDocVersion { version: string; by: string; date: string; changes: string; }
interface DesignDocAttachment { name: string; status: string; }
interface DesignDoc {
  code: string; name: string; brand: string; collection: string; season: string;
  category: string; version: string; status: string; released: string; by: string;
  description: string; techSpecs: DesignDocTechSpecs; measurements: DesignDocMeasurement[];
  bom: DesignDocBOMEntry[]; cost: { material: number; labor: number; overhead: number } | null;
  versions: DesignDocVersion[]; attachments: DesignDocAttachment[];
}

// ─── Generic R&D Reference Data ─────────────────────────────────────────────

const rdBOMMaster: DesignDocBOMEntry[] = [
  { material: "Cotton Spandex Jersey (92/8)", supplier: "Textiles PH Inc.", qty: 1.1, unit: "meters/pc" },
  { material: "Rib Knit (Neckband)", supplier: "Textiles PH Inc.", qty: 0.15, unit: "meters/pc" },
  { material: "Polyester Thread 504 (Black)", supplier: "ThreadCo PH", qty: 180, unit: "meters/pc" },
  { material: "Polyester Thread 406 Coverstitch", supplier: "ThreadCo PH", qty: 120, unit: "meters/pc" },
  { material: "Clear Elastic Tape 12mm (Shoulder)", supplier: "AccessoriesPH", qty: 0.4, unit: "meters/pc" },
  { material: "Care Label (Woven)", supplier: "LabelMakers PH", qty: 1, unit: "pcs/pc" },
  { material: "Poly Bag 12x18", supplier: "PackagingCo PH", qty: 1, unit: "pcs/pc" },
];

const rdCostByCategory: Record<string, { material: number; labor: number; overhead: number }> = {
  Knit: { material: 160, labor: 80, overhead: 40 },
  Denim: { material: 380, labor: 180, overhead: 90 },
  Woven: { material: 220, labor: 100, overhead: 50 },
};

const rdVersionHistoryMaster: DesignDocVersion[] = [
  { version: "1.0", by: "rd.lead", date: "Jun 15, 2026", changes: "Initial draft" },
  { version: "2.0", by: "a.reyes", date: "Jun 28, 2026", changes: "Added colorways: Ivory, Charcoal, Black, Dusty Pink" },
  { version: "2.1", by: "rd.lead", date: "Jul 10, 2026", changes: "Adjusted GSM from 200 to 210; corrected fabric consumption to 1.1m" },
  { version: "3.0", by: "a.reyes", date: "Jul 22, 2026", changes: "Updated to 4-thread overlock on shoulder seam; added clear elastic tape spec" },
];

// ─── Per-Design Tech Specs ──────────────────────────────────────────────────

const designTechSpecs: Record<string, DesignDocTechSpecs> = {
  "Alexa Long Sleeve Top": { garmentType: "Long Sleeve Top", fabric: "Cotton Spandex Jersey", gsm: "200", stitch: "Overlock + Coverstitch", colors: "Black, Ivory, Charcoal, Dusty Pink", sizes: "S, M, L, XL", sewing: "1. Join shoulder seams using 4-thread overlock. 2. Set-in sleeve using overlock. 3. Hem sleeve and bottom using coverstitch. 4. Neckline binding with rib knit." },
  "Martina Scoop Neck Top": { garmentType: "Scoop Neck Top", fabric: "Cotton Spandex Jersey", gsm: "200", stitch: "Overlock + Coverstitch", colors: "Ivory, White, Black, Dusty Pink", sizes: "S, M, L, XL", sewing: "1. Finish neckline with rib knit binding. 2. Join side seams with overlock. 3. Hem bottom with coverstitch. 4. Hem sleeves with coverstitch." },
  "Arya Tank Top": { garmentType: "Tank Top", fabric: "Cotton Spandex Jersey", gsm: "180", stitch: "Overlock + Coverstitch", colors: "Black, White, Olive, Dusty Pink", sizes: "S, M, L, XL", sewing: "1. Join side seams with overlock. 2. Armhole and neckline binding. 3. Hem bottom with coverstitch." },
  "Lounge Pants Plain": { garmentType: "Lounge Pants", fabric: "Cotton-Modal Jersey", gsm: "240", stitch: "Overlock + Coverstitch", colors: "Charcoal, Black, Oat, Navy", sizes: "S, M, L, XL", sewing: "1. Join inseam and outseam with overlock. 2. Attach waistband elastic. 3. Hem leg opening with coverstitch." },
  "Lounge Pants Ribbed": { garmentType: "Ribbed Lounge Pants", fabric: "Cotton-Modal Rib", gsm: "280", stitch: "Overlock + Coverstitch", colors: "Oat, Charcoal, Black, Mauve", sizes: "S, M, L, XL", sewing: "1. Join inseam and outseam with overlock. 2. Attach ribbed waistband. 3. Hem leg opening with coverstitch." },
  "Klea Mini Dress": { garmentType: "Mini Dress", fabric: "Cotton Spandex Jersey", gsm: "210", stitch: "Overlock + Coverstitch", colors: "Black, Ivory, Emerald, Wine", sizes: "S, M, L, XL", sewing: "1. Join front and back bodice at shoulders. 2. Attach skirt panel. 3. Set-in sleeves. 4. Neckline binding. 5. Hem dress bottom." },
  "Trouser Pants Straight": { garmentType: "Straight Trouser", fabric: "Stretch Twill", gsm: "260", stitch: "Lockstitch + Overlock", colors: "Black, Navy, Charcoal, Beige", sizes: "S, M, L, XL", sewing: "1. French seam finish on side seams. 2. Zipper fly installation. 3. Waistband with belt loops. 4. Hem with lockstitch." },
  "Biker Shorts": { garmentType: "Biker Shorts", fabric: "Nylon-Spandex Performance", gsm: "220", stitch: "Overlock + Flatlock", colors: "Black, Navy, Charcoal, Wine", sizes: "S, M, L, XL", sewing: "1. Join inseam with flatlock. 2. Waistband elastic casing. 3. Hem leg opening with coverstitch." },
  "Satin Cami Top": { garmentType: "Cami Top", fabric: "Polyester Satin", gsm: "120", stitch: "French Seam + Lockstitch", colors: "Champagne, Black, Ivory, Dusty Rose", sizes: "S, M, L, XL", sewing: "1. French seam side seams. 2. Adjustable strap hardware. 3. Bound neckline and armholes." },
  "Premium Jeans High Rise": { garmentType: "High Rise Jeans", fabric: "Stretch Denim", gsm: "340", stitch: "Chainstitch + Lockstitch", colors: "Indigo, Black, Light Wash, Vintage", sizes: "S, M, L, XL", sewing: "1. Lap seam construction. 2. YKK zipper fly. 3. Belted waistband. 4. Chainstitch hem." },
  "Oversized Street Tee": { garmentType: "Oversized Tee", fabric: "Cotton Jersey", gsm: "180", stitch: "Overlock + Coverstitch", colors: "Black, White, Grey, Forest", sizes: "S, M, L, XL, 2XL", sewing: "1. Join shoulder seams. 2. Set-in short sleeves. 3. Hem sleeves and bottom. 4. Neckline rib binding." },
  "Cropped Hoodie": { garmentType: "Cropped Hoodie", fabric: "French Terry Fleece", gsm: "320", stitch: "Overlock + Coverstitch", colors: "Black, Grey, Oat, Sage", sizes: "S, M, L, XL", sewing: "1. Join shoulder and side seams. 2. Set-in sleeves. 3. Attach hood. 4. Kanga pocket. 5. Rib hem and cuffs." },
  "Wide Leg Trouser": { garmentType: "Wide Leg Trouser", fabric: "Crepe Fabric", gsm: "200", stitch: "French Seam + Lockstitch", colors: "Black, Navy, Beige, Burgundy", sizes: "S, M, L, XL", sewing: "1. French seam side seams. 2. Elastic waistband. 3. Hem with blind stitch." },
  "Denim Mini Skirt": { garmentType: "Denim Mini Skirt", fabric: "Stretch Denim", gsm: "280", stitch: "Chainstitch + Lockstitch", colors: "Indigo, Black, Acid Wash", sizes: "S, M, L, XL", sewing: "1. Lap seam construction. 2. Zipper fly. 3. Belt loops. 4. Hem with chainstitch." },
  "Ribbed Bodycon Dress": { garmentType: "Bodycon Dress", fabric: "Cotton-Modal Rib", gsm: "260", stitch: "Overlock + Coverstitch", colors: "Black, Dusty Pink, Oat, Teal", sizes: "S, M, L, XL", sewing: "1. Join side seams. 2. Neckline binding. 3. Hem dress bottom. 4. Optional: side zipper." },
  "Biker Shorts Mesh": { garmentType: "Mesh Biker Shorts", fabric: "Nylon Mesh", gsm: "140", stitch: "Flatlock", colors: "Black, White, Neon Green", sizes: "S, M, L, XL", sewing: "1. Flatlock seam construction. 2. Elastic waistband. 3. Raw edge hem." },
  "Cuffed Shorts": { garmentType: "Cuffed Short", fabric: "Cotton Twill", gsm: "240", stitch: "Lockstitch + Overlock", colors: "Black, Khaki, Olive, Navy", sizes: "S, M, L, XL", sewing: "1. Side seam with overlock. 2. Zip fly with button closure. 3. Cuffed hem." },
  "Puffer Vest": { garmentType: "Puffer Vest", fabric: "Nylon Taslon", gsm: "60 (shell)", stitch: "Lockstitch + Taped Seam", colors: "Black, Navy, Red, Olive", sizes: "S, M, L, XL", sewing: "1. Quilted baffle construction. 2. Zip front closure. 3. Elastic armhole binding. 4. Hem drawcord." },
  "High Waist Legging": { garmentType: "High Waist Legging", fabric: "Nylon-Spandex Performance", gsm: "220", stitch: "Flatlock + Overlock", colors: "Black, Charcoal, Midnight Blue, Wine", sizes: "XS, S, M, L, XL", sewing: "1. Flatlock inseam and outseam. 2. Elastic waistband. 3. Hem leg opening." },
  "Peplum Blouse": { garmentType: "Peplum Blouse", fabric: "Polyester Crepe", gsm: "140", stitch: "French Seam + Lockstitch", colors: "White, Black, Blush, Navy", sizes: "S, M, L, XL", sewing: "1. French seam construction. 2. Dart fitting at bust. 3. Attach peplum ruffle. 4. Button back closure." },
  "Track Pants": { garmentType: "Track Pants", fabric: "Polyester Fleece", gsm: "300", stitch: "Overlock + Coverstitch", colors: "Black, Grey, Navy, Maroon", sizes: "S, M, L, XL, 2XL", sewing: "1. Side stripe insert. 2. Elastic waistband with drawcord. 3. Rib cuff hem." },
  "Jumpsuit Wide Leg": { garmentType: "Jumpsuit Wide Leg", fabric: "Viscose Crepe", gsm: "180", stitch: "French Seam + Lockstitch", colors: "Black, Navy, Dusty Pink, Olive", sizes: "S, M, L, XL", sewing: "1. French seam construction. 2. Bodice dart fitting. 3. Invisible zipper back. 4. Wide leg hem." },
};

// ─── Per-Design Measurements ────────────────────────────────────────────────

const designMeasurements: Record<string, DesignDocMeasurement[]> = {
  "Alexa Long Sleeve Top": [
    { point: "Chest", S: 36, M: 38, L: 40, XL: 42 },
    { point: "Waist", S: 34, M: 36, L: 38, XL: 40 },
    { point: "Hip", S: 38, M: 40, L: 42, XL: 44 },
    { point: "Length", S: 24, M: 25, L: 26, XL: 27 },
  ],
  "Martina Scoop Neck Top": [
    { point: "Chest", S: 34, M: 36, L: 38, XL: 40 },
    { point: "Waist", S: 32, M: 34, L: 36, XL: 38 },
    { point: "Hip", S: 36, M: 38, L: 40, XL: 42 },
    { point: "Length", S: 22, M: 23, L: 24, XL: 25 },
  ],
  "Arya Tank Top": [
    { point: "Chest", S: 32, M: 34, L: 36, XL: 38 },
    { point: "Waist", S: 30, M: 32, L: 34, XL: 36 },
    { point: "Hip", S: 34, M: 36, L: 38, XL: 40 },
    { point: "Length", S: 21, M: 22, L: 23, XL: 24 },
  ],
  "Lounge Pants Plain": [
    { point: "Waist", S: 28, M: 30, L: 32, XL: 34 },
    { point: "Hip", S: 40, M: 42, L: 44, XL: 46 },
    { point: "Inseam", S: 28, M: 29, L: 30, XL: 31 },
    { point: "Leg Opening", S: 10, M: 10.5, L: 11, XL: 11.5 },
  ],
  "Lounge Pants Ribbed": [
    { point: "Waist", S: 27, M: 29, L: 31, XL: 33 },
    { point: "Hip", S: 39, M: 41, L: 43, XL: 45 },
    { point: "Inseam", S: 27, M: 28, L: 29, XL: 30 },
    { point: "Leg Opening", S: 9.5, M: 10, L: 10.5, XL: 11 },
  ],
  "Klea Mini Dress": [
    { point: "Chest", S: 34, M: 36, L: 38, XL: 40 },
    { point: "Waist", S: 30, M: 32, L: 34, XL: 36 },
    { point: "Hip", S: 38, M: 40, L: 42, XL: 44 },
    { point: "Length", S: 34, M: 35, L: 36, XL: 37 },
  ],
  "Trouser Pants Straight": [
    { point: "Waist", S: 28, M: 30, L: 32, XL: 34 },
    { point: "Hip", S: 40, M: 42, L: 44, XL: 46 },
    { point: "Inseam", S: 30, M: 31, L: 32, XL: 33 },
    { point: "Leg Opening", S: 14, M: 14.5, L: 15, XL: 15.5 },
  ],
  "Biker Shorts": [
    { point: "Waist", S: 26, M: 28, L: 30, XL: 32 },
    { point: "Hip", S: 36, M: 38, L: 40, XL: 42 },
    { point: "Inseam", S: 6, M: 7, L: 8, XL: 9 },
    { point: "Leg Opening", S: 18, M: 19, L: 20, XL: 21 },
  ],
  "Satin Cami Top": [
    { point: "Chest", S: 32, M: 34, L: 36, XL: 38 },
    { point: "Waist", S: 30, M: 32, L: 34, XL: 36 },
    { point: "Length", S: 20, M: 21, L: 22, XL: 23 },
    { point: "Strap Width", S: 0.5, M: 0.5, L: 0.5, XL: 0.5 },
  ],
  "Premium Jeans High Rise": [
    { point: "Waist", S: 28, M: 30, L: 32, XL: 34 },
    { point: "Hip", S: 38, M: 40, L: 42, XL: 44 },
    { point: "Inseam", S: 29, M: 30, L: 31, XL: 32 },
    { point: "Rise", S: 11, M: 11.5, L: 12, XL: 12.5 },
    { point: "Leg Opening", S: 13, M: 13.5, L: 14, XL: 14.5 },
  ],
};

const designDescriptions: Record<string, string> = {
  "Alexa Long Sleeve Top": "Classic long sleeve silhouette in cotton-spandex jersey. Features rib knit neckline binding and set-in sleeves. Part of the Mera Essentials collection.",
  "Martina Scoop Neck Top": "Scoop neck short sleeve top with rib knit binding at neckline. Easy fit silhouette in cotton-spandex jersey. Part of the Mera Essentials collection.",
  "Arya Tank Top": "Slim fit tank top with bound armholes and neckline. Lightweight cotton-spandex jersey construction. Part of the Mera Essentials collection.",
  "Lounge Pants Plain": "Relaxed fit lounge pants in soft cotton-modal jersey. Elastic waistband with drawcord. Part of the Mera Loungewear collection.",
  "Lounge Pants Ribbed": "Ribbed lounge pants with elasticated waistband. Comfortable body-skimming fit. Part of the Mera Loungewear collection.",
  "Klea Mini Dress": "Body-skimming mini dress with set-in sleeves and neckline binding. Cotton-spandex jersey for comfortable stretch. Part of the Mera Signature collection.",
  "Trouser Pants Straight": "Straight leg trousers in stretch twill fabric. Features zip fly with belt loops and French seam finish. Part of the Mera Tailored collection.",
  "Biker Shorts": "Performance biker shorts in nylon-spandex. Flatlock seams for chafe-free comfort. Part of the Sponty Active collection.",
  "Satin Cami Top": "Luxurious satin cami top with adjustable straps. Bound neckline and armholes. Part of the Mera Luxe collection.",
};

// ─── getDesignDoc ───────────────────────────────────────────────────────────

function getDesignDoc(designName: string): DesignDoc | null {
  const base = prodNewDesigns.find(d => d.name === designName);
  if (!base) return null;
  const ts = designTechSpecs[designName] ?? {
    garmentType: "—", fabric: "—", gsm: "—", stitch: "—",
    colors: "—", sizes: "—", sewing: "—",
  };
  const meas = designMeasurements[designName] ?? [];
  const cost = rdCostByCategory[base.category] ?? null;
  const desc = designDescriptions[designName] ?? "";
  return {
    code: base.code, name: base.name, brand: base.brand,
    collection: base.collection, season: "SS 2027", category: base.category,
    version: "1.0", status: "Released", released: base.released, by: base.by,
    description: desc,
    techSpecs: ts, measurements: meas,
    bom: rdBOMMaster, cost, versions: rdVersionHistoryMaster,
    attachments: [
      { name: "Tech Pack (PDF)", status: "Missing" },
      { name: "Pattern Files", status: "Missing" },
      { name: "CAD Files", status: "Missing" },
      { name: "Marker Files", status: "Missing" },
      { name: "Sewing Guide", status: "Missing" },
      { name: "Size Chart", status: "Missing" },
    ],
  };
}

// ─── Design Doc Modal ───────────────────────────────────────────────────────

function DesignDocModal({ doc, onClose }: { doc: DesignDoc; onClose: () => void }) {
  const costTotal = doc.cost ? doc.cost.material + doc.cost.labor + doc.cost.overhead : null;

  function handlePrint() { window.print(); }

  function handleDownload() {
    const html = buildDocHTML(doc);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DesignDoc_${doc.code}_${doc.name.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0 no-print">
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-foreground" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Design Specification Document</h3>
              <p className="text-[11px] text-muted-foreground font-mono">{doc.code} — {doc.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} title="Print"
              className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-3 py-1.5 rounded text-xs font-medium transition-colors">
              <Printer size={12} /> Print
            </button>
            <button onClick={handleDownload} title="Download"
              className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-3 py-1.5 rounded text-xs font-medium transition-opacity">
              <Download size={12} /> Download
            </button>
            <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
          <div id="design-doc-content" className="max-w-3xl mx-auto space-y-6 text-xs">
            {/* Header section */}
            <div className="text-center pb-4 border-b border-border">
              <div className="text-lg font-bold text-foreground tracking-tight">{doc.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{doc.code} · v{doc.version}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{doc.brand} · {doc.collection} · {doc.season}</div>
            </div>

            {/* 1. General Info */}
            <Section title="General Information">
              <InfoRow label="Design Code" value={doc.code} />
              <InfoRow label="Design Name" value={doc.name} />
              <InfoRow label="Brand" value={doc.brand} />
              <InfoRow label="Collection" value={doc.collection} />
              <InfoRow label="Season" value={doc.season} />
              <InfoRow label="Category" value={doc.category} />
              <InfoRow label="Version" value={doc.version} />
              <InfoRow label="Status" value={doc.status} />
              <InfoRow label="Released" value={doc.released} />
              <InfoRow label="Created by" value={doc.by} />
              {doc.description && <InfoRow label="Description" value={doc.description} />}
            </Section>

            {/* 2. Technical Specifications */}
            <Section title="Technical Specifications">
              <InfoRow label="Garment Type" value={doc.techSpecs.garmentType} />
              <InfoRow label="Fabric Type" value={doc.techSpecs.fabric} />
              <InfoRow label="GSM / Weight" value={doc.techSpecs.gsm} />
              <InfoRow label="Stitch Type" value={doc.techSpecs.stitch} />
              <InfoRow label="Color Options" value={doc.techSpecs.colors} />
              <InfoRow label="Available Sizes" value={doc.techSpecs.sizes} />
              <div className="col-span-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Sewing Instructions</div>
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">{doc.techSpecs.sewing}</div>
              </div>
            </Section>

            {/* 3. Measurement Chart */}
            {doc.measurements.length > 0 && (
              <Section title="Measurement Chart (inches)">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">Point</th>
                      {["S", "M", "L", "XL"].map(s => (
                        <th key={s} className="text-center px-3 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {doc.measurements.map(m => (
                      <tr key={m.point}>
                        <td className="px-3 py-2 text-foreground font-medium">{m.point}</td>
                        <td className="px-3 py-2 text-center text-foreground">{m.S}</td>
                        <td className="px-3 py-2 text-center text-foreground">{m.M}</td>
                        <td className="px-3 py-2 text-center text-foreground">{m.L}</td>
                        <td className="px-3 py-2 text-center text-foreground">{m.XL}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* 4. Bill of Materials */}
            <Section title="Bill of Materials">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {["Material", "Supplier", "Qty", "Unit"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {doc.bom.map((m, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-foreground">{m.material}</td>
                      <td className="px-3 py-2 text-muted-foreground">{m.supplier}</td>
                      <td className="px-3 py-2 text-foreground font-mono">{m.qty}</td>
                      <td className="px-3 py-2 text-muted-foreground font-mono">{m.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* 5. Cost Estimation */}
            {doc.cost && (
              <Section title="Cost Estimation">
                <InfoRow label="Material Cost" value={`PHP ${doc.cost.material.toFixed(2)}`} />
                <InfoRow label="Labor Cost" value={`PHP ${doc.cost.labor.toFixed(2)}`} />
                <InfoRow label="Overhead" value={`PHP ${doc.cost.overhead.toFixed(2)}`} />
                <div className="col-span-2 pt-2 border-t border-border mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Cost / Unit</span>
                    <span className="text-xs font-bold text-foreground">PHP {costTotal!.toFixed(2)}</span>
                  </div>
                </div>
              </Section>
            )}

            {/* 6. Version History */}
            <Section title="Version History">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {["Version", "By", "Date", "Changes"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {doc.versions.map((v, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-foreground font-mono">v{v.version}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v.by}</td>
                      <td className="px-3 py-2 text-muted-foreground font-mono text-[10px]">{v.date}</td>
                      <td className="px-3 py-2 text-foreground">{v.changes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* 7. Attachments */}
            <Section title="Attachments">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">File</th>
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {doc.attachments.map((a, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-foreground">{a.name}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${a.status === "Missing" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-border text-[9px] text-muted-foreground font-mono">
              Generated by TILAO CORP Production Portal · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-2 pb-1 border-b border-border">{title}</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-xs text-foreground font-medium text-right max-w-48 truncate" title={value}>{value}</span>
    </div>
  );
}

function buildDocHTML(doc: DesignDoc): string {
  const costTotal = doc.cost ? doc.cost.material + doc.cost.labor + doc.cost.overhead : null;
  const measRows = doc.measurements.map(m => `<tr><td>${m.point}</td><td>${m.S}</td><td>${m.M}</td><td>${m.L}</td><td>${m.XL}</td></tr>`).join("");
  const bomRows = doc.bom.map(m => `<tr><td>${m.material}</td><td>${m.supplier}</td><td>${m.qty}</td><td>${m.unit}</td></tr>`).join("");
  const versionRows = doc.versions.map(v => `<tr><td>v${v.version}</td><td>${v.by}</td><td>${v.date}</td><td>${v.changes}</td></tr>`).join("");
  const attachRows = doc.attachments.map(a => `<tr><td>${a.name}</td><td><span style="color:${a.status === "Missing" ? "#ef4444" : "#10b981"}">${a.status}</span></td></tr>`).join("");
  const costSection = doc.cost ? `
    <h2>Cost Estimation</h2>
    <table><tbody>
      <tr><td><strong>Material Cost</strong></td><td>PHP ${doc.cost.material.toFixed(2)}</td></tr>
      <tr><td><strong>Labor Cost</strong></td><td>PHP ${doc.cost.labor.toFixed(2)}</td></tr>
      <tr><td><strong>Overhead</strong></td><td>PHP ${doc.cost.overhead.toFixed(2)}</td></tr>
      <tr style="border-top:1px solid #ccc"><td><strong>Total Cost / Unit</strong></td><td><strong>PHP ${costTotal!.toFixed(2)}</strong></td></tr>
    </tbody></table>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Design Doc — ${doc.code} ${doc.name}</title>
<style>
  @page { margin: 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #111; background: #fff; line-height: 1.5; padding: 32px; }
  .container { max-width: 800px; margin: 0 auto; }
  h1 { font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 2px; }
  .subtitle { text-align: center; color: #666; font-family: monospace; font-size: 11px; margin-bottom: 4px; }
  .meta { text-align: center; color: #888; font-size: 10px; margin-bottom: 24px; }
  h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin: 20px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 4px; }
  th { text-align: left; padding: 6px 8px; color: #666; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #ddd; }
  td { padding: 6px 8px; border-bottom: 1px solid #eee; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .info-row { display: flex; justify-content: space-between; align-items: center; }
  .info-label { color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .info-value { color: #111; font-weight: 500; text-align: right; }
  .sewing-text { grid-column: 1 / -1; color: #333; line-height: 1.6; white-space: pre-wrap; font-size: 12px; }
  .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 9px; color: #999; font-family: monospace; }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
  }
</style></head>
<body>
<div class="container">
  <h1>${doc.name}</h1>
  <div class="subtitle">${doc.code} · v${doc.version}</div>
  <div class="meta">${doc.brand} · ${doc.collection} · ${doc.season}</div>

  <h2>General Information</h2>
  <div class="info-grid">
    ${[["Design Code",doc.code],["Design Name",doc.name],["Brand",doc.brand],["Collection",doc.collection],["Season",doc.season],["Category",doc.category],["Version",doc.version],["Status",doc.status],["Released",doc.released],["Created by",doc.by]].map(([l,v]) => `<div class="info-row"><span class="info-label">${l}</span><span class="info-value">${v}</span></div>`).join("")}
    ${doc.description ? `<div class="info-row" style="grid-column:1/-1"><span class="info-label">Description</span><span class="info-value" style="text-align:left;font-weight:400">${doc.description}</span></div>` : ""}
  </div>

  <h2>Technical Specifications</h2>
  <div class="info-grid">
    ${[["Garment Type",doc.techSpecs.garmentType],["Fabric Type",doc.techSpecs.fabric],["GSM / Weight",doc.techSpecs.gsm],["Stitch Type",doc.techSpecs.stitch],["Color Options",doc.techSpecs.colors],["Available Sizes",doc.techSpecs.sizes]].map(([l,v]) => `<div class="info-row"><span class="info-label">${l}</span><span class="info-value">${v}</span></div>`).join("")}
    <div class="sewing-text"><span class="info-label">Sewing Instructions</span><br>${doc.techSpecs.sewing}</div>
  </div>

  ${doc.measurements.length > 0 ? `
  <h2>Measurement Chart (inches)</h2>
  <table><thead><tr><th>Point</th><th style="text-align:center">S</th><th style="text-align:center">M</th><th style="text-align:center">L</th><th style="text-align:center">XL</th></tr></thead>
  <tbody>${measRows}</tbody></table>` : ""}

  <h2>Bill of Materials</h2>
  <table><thead><tr><th>Material</th><th>Supplier</th><th style="text-align:center">Qty</th><th>Unit</th></tr></thead>
  <tbody>${bomRows}</tbody></table>

  ${costSection}

  <h2>Version History</h2>
  <table><thead><tr><th>Version</th><th>By</th><th>Date</th><th>Changes</th></tr></thead>
  <tbody>${versionRows}</tbody></table>

  <h2>Attachments</h2>
  <table><thead><tr><th>File</th><th>Status</th></tr></thead>
  <tbody>${attachRows}</tbody></table>

  <div class="footer">Generated by TILAO CORP Production Portal · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
</div>
</body></html>`;
}

function handlePrintQR(id: string, design: string) {
  const formatted = id.replace("BND-20260722-", "BND-0");
  const printWin = window.open("", "_blank");
  if (!printWin) return;
  printWin.document.write(`
    <html><head><title>Print QR — ${formatted}</title>
    <style>
      @page { margin: 12mm; }
      body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
      .label { text-align: center; padding: 24px; max-width: 320px; }
      .qr-box { width: 180px; height: 180px; margin: 0 auto 16px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666; }
      .bundle-id { font-size: 22px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
      .design-name { font-size: 13px; color: #555; margin-bottom: 24px; }
      .sig-line { border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 6px; font-size: 10px; color: #888; }
    </style></head><body>
    <div class="label">
      <div class="qr-box"><span>QR Code placeholder</span></div>
      <div class="bundle-id">${formatted}</div>
      <div class="design-name">${design}</div>
      <div class="sig-line">Lead Seamstress Signature</div>
    </div>
    <script>window.onload = function() { window.print(); window.close(); }</script>
    </body></html>
  `);
  printWin.document.close();
}

const prodInspections = [
  { id: "BND-20260722-0010", design: "Arya Tank Top", result: "Approved", inspector: "prod_head", time: "11:30 AM" },
  { id: "BND-20260722-0006", design: "Trouser Pants Straight", result: "Approved", inspector: "prod_head", time: "Yesterday 4:00 PM" },
  { id: "BND-20260722-0004", design: "Martina Scoop Neck Top", result: "Rejected", inspector: "prod_head", time: "Yesterday 2:10 PM" },
  { id: "BND-20260721-0015", design: "Klea Mini Dress", result: "Back Job", inspector: "prod_head", time: "Yesterday 1:00 PM" },
];

const prodReportData = [
  { month: "Feb", created: 38, completed: 34, approved: 30, backjobs: 4 },
  { month: "Mar", created: 44, completed: 40, approved: 36, backjobs: 4 },
  { month: "Apr", created: 52, completed: 48, approved: 44, backjobs: 4 },
  { month: "May", created: 49, completed: 45, approved: 41, backjobs: 4 },
  { month: "Jun", created: 61, completed: 57, approved: 52, backjobs: 5 },
  { month: "Jul", created: 78, completed: 55, approved: 41, backjobs: 4 },
];

const prodQualityData = [
  { design: "Alexa Long Sleeve Top", inspected: 24, approved: 21, rejected: 1, backjob: 2 },
  { design: "Martina Scoop Neck Top", inspected: 18, approved: 15, rejected: 2, backjob: 1 },
  { design: "Arya Tank Top", inspected: 20, approved: 19, rejected: 1, backjob: 0 },
  { design: "Klea Mini Dress", inspected: 18, approved: 14, rejected: 2, backjob: 2 },
  { design: "Lounge Pants Ribbed", inspected: 15, approved: 14, rejected: 0, backjob: 1 },
];

// ─── Production App ───────────────────────────────────────────────────────────

export default function ProdApp({ onLogout }: { onLogout: () => void }) {
  const [prodPage, setProdPage] = useState("prod-overview");
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
    if (!localStorage.getItem("mera_prod_tour_seen")) {
      const timer = setTimeout(startProdTour, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (prodPage === "prod-overview" && !localStorage.getItem("mera_prod_tour_seen")) {
      const timer = setTimeout(startProdTour, 400);
      return () => clearTimeout(timer);
    }
    if (prodPage === "prod-bundles" && !localStorage.getItem("mera_prod_bundles_tour_seen")) {
      const timer = setTimeout(startBundlesTour, 400);
      return () => clearTimeout(timer);
    }
    if (prodPage === "prod-qc" && !localStorage.getItem("mera_prod_qc_tour_seen")) {
      const timer = setTimeout(startQCTour, 400);
      return () => clearTimeout(timer);
    }
    if (prodPage === "prod-reports" && !localStorage.getItem("mera_prod_reports_tour_seen")) {
      const timer = setTimeout(startReportsTour, 400);
      return () => clearTimeout(timer);
    }
  }, [prodPage]);

  function startProdTour() {
    setProdPage("prod-overview");
    setTimeout(() => {
      const steps = [
        {
          element: "#prod-kpi-section",
          popover: {
            title: "Production Overview",
            description: "At-a-glance KPIs — total bundles, in progress, pending QC, approved, rejected, back jobs, and completed today.",
            side: "bottom" as const,
          },
        },
        {
          element: "#prod-quick-actions",
          popover: {
            title: "Quick Actions",
            description: "Jump to create bundles, scan QR codes, assign seamstresses, view pending QC, or print bundle labels.",
            side: "bottom" as const,
          },
        },
        {
          element: "#prod-bundle-table",
          popover: {
            title: "Bundle Management",
            description: "Track all bundles with photo preview, status badges, and actions. Click View All for the full list. Use the Documents column to download bundle files.",
            side: "top" as const,
          },
        },
        {
          element: "#prod-pending-back",
          popover: {
            title: "Pending QC & Back Job Queue",
            description: "Monitor bundles waiting for QC inspection and those sent back for rework. Click a row to jump to inspection.",
            side: "left" as const,
          },
        },
        {
          element: "#prod-timeline-inspections",
          popover: {
            title: "Timeline & Recent Inspections",
            description: "View production timeline events for a bundle and see recent QC inspection results at a glance.",
            side: "right" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_prod_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  function startBundlesTour() {
    setTimeout(() => {
      const steps = [
        {
          element: "#prod-create-bundle-btn",
          popover: {
            title: "Create Bundle",
            description: "Click to open the bundle creation form. Fill in design, quantity, size, color, and batch details.",
            side: "left" as const,
          },
        },
        {
          element: "#prod-create-panel",
          popover: {
            title: "Bundle Fields",
            description: "Each field is required — select the design, set quantity, choose size and color, then save.",
            side: "bottom" as const,
          },
        },
        {
          element: "#prod-save-print-btn",
          popover: {
            title: "Save & Print QR / Save Only",
            description: "Save & Print QR generates the bundle and prints its QR label. Save Only just saves the bundle for later.",
            side: "top" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_prod_bundles_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  function startQCTour() {
    setTimeout(() => {
      const steps = [
        {
          element: "#prod-scan-qr",
          popover: {
            title: "Scan QR",
            description: "Select or scan a bundle to load its details for inspection. The bundle info will appear below.",
            side: "bottom" as const,
          },
        },
        {
          element: "#prod-checklist",
          popover: {
            title: "Inspection Checklist",
            description: "Check each quality criterion — stitch quality, measurements, fabric defects, accessories, and overall appearance. Upload a photo for documentation.",
            side: "bottom" as const,
          },
        },
        {
          element: "#prod-actions-bar",
          popover: {
            title: "Decision Buttons",
            description: "Approve passes QC, Reject marks as failed, or Back Job sends the bundle for rework with notes.",
            side: "top" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_prod_qc_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  function startReportsTour() {
    setTimeout(() => {
      const steps = [
        {
          element: "#prod-reports-summary",
          popover: {
            title: "Reports",
            description: "View production output, quality pass rates, and seamstress productivity in one place. Switch between Production, Quality, and Productivity tabs.",
            side: "bottom" as const,
          },
        },
      ];
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0,0,0,0.5)",
        popoverClass: "mera-tour-popover",
        onDestroyed: () => localStorage.setItem("mera_prod_reports_tour_seen", "1"),
        steps,
      });
      driverObj.drive();
    }, 300);
  }

  const prodNav = [
    { label: "Dashboard", icon: LayoutDashboard, key: "prod-overview" },
    { label: "Bundles", icon: Package, key: "prod-bundles" },
    { label: "QC Inspection", icon: ClipboardList, key: "prod-qc" },
    { label: "Reports", icon: BarChart3, key: "prod-reports" },
  ];

  const pageLabel: Record<string, string> = {
    "prod-overview": "Dashboard", "prod-bundles": "Bundles",
    "prod-qc": "QC Inspection", "prod-reports": "Reports",
  };

  function renderProdContent() {
    if (prodPage === "prod-overview") return <ProdOverview navigate={setProdPage} />;
    if (prodPage === "prod-bundles") return <ProdBundles />;
    if (prodPage === "prod-qc")      return <ProdQC />;
    if (prodPage === "prod-reports") return <ProdReports />;
    return <ProdOverview navigate={setProdPage} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-display)" }}>
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

      {/* Sidebar */}
      <aside className={`flex flex-col shrink-0 border-r border-border transition-all duration-200 ${sidebarOpen ? "w-56" : "w-14"}`} style={{ background: "var(--sidebar)" }}>
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--sidebar-border)]">
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-background font-mono">TC</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-foreground tracking-widest uppercase whitespace-nowrap">TILAO CORP</div>
              <div className="text-[9px] text-muted-foreground font-mono whitespace-nowrap">Production Portal</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-none">
          {prodNav.map(item => {
            const Icon = item.icon;
            const isActive = prodPage === item.key;
            return (
              <button key={item.key} onClick={() => setProdPage(item.key)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-[11px] font-medium transition-colors ${isActive ? "text-foreground bg-[var(--sidebar-accent)]" : "text-[var(--sidebar-foreground)] hover:text-foreground hover:bg-[var(--sidebar-accent)]"}`}>
                <Icon size={14} className="shrink-0" />
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-[var(--sidebar-border)]">
            <div className="text-[10px] text-muted-foreground font-mono">v2.4.1 · Production Build</div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-12 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Menu size={15} />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Production</span>
            <ChevronRight size={11} />
            <span className="text-foreground font-medium">{pageLabel[prodPage] ?? prodPage}</span>
          </div>
          <div className="relative ml-auto w-48">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search bundle…" className="w-full bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30 transition-colors" />
          </div>
          {/* QR Scan button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-muted border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
            <QrCode size={13} /> Scan QR
          </button>
          {/* Tour */}
          <button onClick={startProdTour} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Start Tour">
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
                  {prodNotifications.map((n, i) => {
                    const color = n.type === "warn" ? "text-amber-500" : n.type === "ok" ? "text-emerald-500" : "text-blue-500";
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
            <button onClick={() => setProfileOpen(v => !v)} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted transition-colors">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-[10px] font-bold text-background">JD</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] font-medium text-foreground leading-none">Juan dela Cruz</div>
                <div className="text-[9px] text-muted-foreground font-mono leading-none mt-0.5">Production Head</div>
              </div>
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
          {renderProdContent()}
        </main>

        {/* Footer */}
        <footer className="h-8 flex items-center justify-between px-5 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span>v2.4.1</span>
            <span className="text-border">|</span>
            <span>Production Portal · Juan dela Cruz</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">© 2026 TILAO CORP</span>
        </footer>
      </div>
    </div>
  );
}

// ─── Design Thumbnail ──────────────────────────────────────────────────────────

function DesignThumb({ name }: { name: string }) {
  const [err, setErr] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const slug = name.toLowerCase().replace(/\s+/g, "_");
  return (
    <div className="w-7 h-7 rounded bg-muted flex items-center justify-center overflow-hidden">
      {!showFallback ? (
        <img src={`/designs/${slug}.webp`} alt={name}
          onError={() => setShowFallback(true)}
          className="w-full h-full object-cover" />
      ) : (
        <Box size={14} className="text-muted-foreground" />
      )}
    </div>
  );
}

// ─── Production Page Views ────────────────────────────────────────────────────

function ProdOverview({ navigate }: { navigate: (page: string) => void }) {
  const [docName, setDocName] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div id="prod-kpi-section">
        <SectionHeader title="Production Overview — Jul 22, 2026" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <KPICard label="Total Bundles" value={78} sub="All time" icon={Package} accent="bg-muted text-muted-foreground" />
          <KPICard label="In Progress" value={19} sub="Being sewn" icon={Activity} accent="bg-muted text-muted-foreground" />
          <KPICard label="Pending QC" value={8} sub="Awaiting inspect" icon={Clock} accent="bg-muted text-muted-foreground" />
          <KPICard label="Approved" value={41} sub="Passed QC" icon={CheckCircle} accent="bg-muted text-muted-foreground" trend="up" />
          <KPICard label="Rejected" value={3} sub="Failed QC" icon={XCircle} accent="bg-muted text-muted-foreground" />
          <KPICard label="Back Jobs" value={4} sub="For rework" icon={RotateCcw} accent="bg-muted text-muted-foreground" />
          <KPICard label="Completed Today" value={12} sub="Jul 22" icon={CheckCircle} accent="bg-muted text-muted-foreground" trend="up" />
        </div>
      </div>

      {/* Quick Actions */}
      <div id="prod-quick-actions">
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Create Bundle", icon: Plus, primary: true, page: "prod-bundles" },
            { label: "Scan QR Code", icon: QrCode, primary: false, page: "prod-qc" },
            { label: "Assign Seamstress", icon: Users, primary: false, page: "prod-bundles" },
            { label: "View Pending QC", icon: ClipboardList, primary: false, page: "prod-qc" },
            { label: "Print Bundle Label", icon: FileText, primary: false, page: "" },
          ].map(({ label, icon: Icon, primary, page }) => (
            <button key={label} onClick={() => page && navigate(page)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${primary ? "bg-foreground text-background hover:opacity-90" : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bundle table */}
      <div id="prod-bundle-table">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Bundle Management</h2>
          <button onClick={() => navigate("prod-bundles")} className="text-[11px] text-muted-foreground hover:text-foreground hover:underline font-medium transition-all duration-200 group">
            View All <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </button>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/80">
                  {["Bundle No.", "Photo", "Design", "Qty", "Size", "Seamstress", "Status", "Updated", "Actions", "Documents"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-white/70 font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                {prodBundles.slice(0, 6).map((b, i) => (
                  <tr key={b.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-4 py-2.5 font-mono text-foreground font-medium text-[10px]">{b.id.replace("BND-20260722-", "BND-0")}</td>
                    <td className="px-4 py-2.5">
                      <DesignThumb name={b.design} />
                    </td>
                    <td className="px-4 py-2.5 text-foreground">{b.design}</td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono">{b.qty}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{b.size}</td>
                    <td className="px-4 py-2.5 text-foreground">{b.seamstress}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-[10px]">{b.updated}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-muted-foreground hover:text-foreground" title="View"><Eye size={12} /></button>
                        <button className="p-1 text-muted-foreground hover:text-foreground" title="Edit"><Pencil size={12} /></button>
                        <button onClick={() => handlePrintQR(b.id, b.design)} className="p-1 text-muted-foreground hover:text-foreground" title="Print QR"><QrCode size={12} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => setDocName(b.design)}
                        className="p-1 text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-all duration-200" title="View Design Document">
                        <FileText size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {docName && (() => {
        const doc = getDesignDoc(docName);
        if (!doc) return null;
        return <DesignDocModal doc={doc} onClose={() => setDocName(null)} />;
      })()}

      {/* Two-col: Pending QC | Back Jobs */}
      <div id="prod-pending-back" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Pending QC Queue</span>
            <span className="text-[10px] font-mono text-amber-500 font-medium">{prodPendingQC.length} waiting</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Bundle", "Design", "Seamstress", "Completed", "Waiting"].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                {prodPendingQC.map((q, i) => (
                  <tr key={q.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate("prod-qc")}>
                    <td className="px-4 py-2 font-mono text-foreground text-[10px]">{q.id.replace("BND-20260722-", "BND-0")}</td>
                    <td className="px-4 py-2 text-foreground">{q.design}</td>
                    <td className="px-4 py-2 text-muted-foreground">{q.seamstress}</td>
                    <td className="px-4 py-2 text-muted-foreground font-mono text-[10px]">{q.completedAt}</td>
                    <td className="px-4 py-2 font-mono text-amber-500 font-medium">{q.waiting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Back Job Queue</span>
            <span className="text-[10px] font-mono text-muted-foreground">{prodBackJobs.length} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Bundle", "Reason", "Seamstress", "Status", "Due"].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                {prodBackJobs.map((bj, i) => (
                  <tr key={bj.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-2 font-mono text-foreground text-[10px]">{bj.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-")}</td>
                    <td className="px-4 py-2 text-foreground max-w-32 truncate" title={bj.reason}>{bj.reason}</td>
                    <td className="px-4 py-2 text-muted-foreground">{bj.seamstress}</td>
                    <td className="px-4 py-2"><StatusBadge status={bj.status} /></td>
                    <td className="px-4 py-2 text-muted-foreground font-mono text-[10px]">{bj.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two-col: Timeline | Recent Inspections */}
      <div id="prod-timeline-inspections" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Production Timeline</span>
            <span className="text-[10px] text-muted-foreground font-mono ml-2">BND-0012</span>
          </div>
          <div className="p-4 space-y-0">
            {prodTimeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-foreground mt-1 shrink-0" />
                  {i < prodTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className={`pb-3 ${i === prodTimeline.length - 1 ? "" : ""}`}>
                  <div className="text-[10px] text-muted-foreground font-mono">{t.time}</div>
                  <div className="text-xs text-foreground mt-0.5">{t.activity}</div>
                  <div className="text-[10px] text-muted-foreground">by {t.by}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Recent Inspections</span>
          </div>
          <div className="divide-y divide-border/50">
            {prodInspections.map((ins, i) => (
              <div key={ins.id} className={`px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors ${i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}`}>
                <div>
                  <div className="text-xs font-medium text-foreground">{ins.design}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{ins.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-")} · {ins.time}</div>
                </div>
                <StatusBadge status={ins.result} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProdBundles() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [sizeF, setSizeF] = useState("All");
  const [designSearch, setDesignSearch] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<typeof prodNewDesigns[0] | null>(null);
  const [bundleForm, setBundleForm] = useState({ qty: "", color: "", size: "M", batch: "", date: "2026-07-22" });
  const [bundles, setBundles] = useState([...prodBundles]);
  const [viewBundle, setViewBundle] = useState<typeof prodBundles[0] | null>(null);
  const [editBundle, setEditBundle] = useState<typeof prodBundles[0] | null>(null);
  const [editForm, setEditForm] = useState({ qty: 0, size: "", color: "", batch: "" });
  const [statusUpdateBundle, setStatusUpdateBundle] = useState<typeof prodBundles[0] | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState("");
  const [statusImage, setStatusImage] = useState<File | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [docBundle, setDocBundle] = useState<string | null>(null);

  const nextStatuses: Record<string, string[]> = {
    None: ["In Progress"],
    "In Progress": ["Pending QC"],
    Approved: ["Completed"],
    Rejected: ["Back Job"],
    "Back Job": ["In Progress"],
    "Pending QC": [],
    Completed: [],
  };

  const filteredDesigns = prodNewDesigns.filter(d =>
    d.name.toLowerCase().includes(designSearch.toLowerCase()) ||
    d.code.toLowerCase().includes(designSearch.toLowerCase())
  );

  const filtered = bundles.filter(b =>
    (statusF === "All" || b.status === statusF) &&
    (sizeF === "All" || b.size === sizeF) &&
    (b.id.toLowerCase().includes(search.toLowerCase()) || b.design.toLowerCase().includes(search.toLowerCase()))
  );

  const inputCls = "bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  const isNew = (released: string) => {
    const dates = ["Jul 22, 2026", "Jul 21, 2026", "Jul 20, 2026", "Jul 19, 2026"];
    return dates.includes(released);
  };

  function openCreateModal(d: typeof prodNewDesigns[0]) {
    setSelectedDesign(d);
    setBundleForm({ qty: "", color: "", size: "M", batch: "", date: "2026-07-22" });
  }

  function handleCreateBundle() {
    if (!selectedDesign || !bundleForm.qty || !bundleForm.color) return;
    const count = bundles.length + 1;
    const id = `BND-20260723-${String(1000 + count).slice(1)}`;
    const newBundle = {
      id,
      design: selectedDesign.name,
      qty: parseInt(bundleForm.qty),
      size: bundleForm.size,
      color: bundleForm.color,
      status: "None" as const,
      updated: "Just now",
      batch: bundleForm.batch || "—",
    };
    setBundles(prev => [newBundle, ...prev]);
    handlePrintQR(id, selectedDesign.name);
    setSelectedDesign(null);
  }

  function handleEditSave() {
    if (!editBundle) return;
    setBundles(prev => prev.map(b =>
      b.id === editBundle.id
        ? { ...b, qty: editForm.qty, size: editForm.size, color: editForm.color, batch: editForm.batch, updated: "Just now" }
        : b
    ));
    setEditBundle(null);
  }

  function handleStatusUpdate() {
    if (!statusUpdateBundle || !selectedNewStatus) return;
    if (statusUpdateBundle.status === "None" && selectedNewStatus === "In Progress" && !statusImage) return;
    setBundles(prev => prev.map(b =>
      b.id === statusUpdateBundle.id
        ? { ...b, status: selectedNewStatus, updated: "Just now" }
        : b
    ));
    setStatusUpdateBundle(null);
    setSelectedNewStatus("");
    setStatusImage(null);
  }

  function handleDelete(id: string) {
    setBundles(prev => prev.filter(b => b.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Bundle Management</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{bundles.length} total bundles</p>
        </div>
      </div>

      {/* Designs */}
      <div id="prod-new-designs" className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Designs</span>
          <span className="text-[10px] font-mono text-muted-foreground">{prodNewDesigns.length} designs</span>
        </div>
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={designSearch} onChange={e => setDesignSearch(e.target.value)}
              placeholder="Search designs…"
              className="w-full pl-8 bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors" />
          </div>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
            {filteredDesigns.map(d => {
              const slug = d.name.toLowerCase().replace(/\s+/g, "_");
              return (
                <div key={d.code} className="border border-border rounded-lg overflow-hidden hover:border-foreground/40 transition-colors group bg-card cursor-pointer" onClick={() => openCreateModal(d)}>
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {isNew(d.released) && (
                      <div className="absolute top-1.5 right-1.5 z-10 bg-foreground text-background text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">New</div>
                    )}
                    <img src={`/designs/${slug}.webp`} alt={d.name}
                      onError={e => { e.currentTarget.style.display = "none"; }}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={14} />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-[10px] font-medium text-white truncate">{d.name}</div>
                      <div className="text-[9px] text-white/70 font-mono">{d.code}</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-2 flex items-center justify-between">
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${d.brand === "Mera" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>{d.brand}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">{d.released}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredDesigns.length === 0 && (
            <p className="text-[11px] text-muted-foreground text-center py-6">No designs match your search.</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bundle or design…" className={`w-full pl-8 ${inputCls}`} />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className={inputCls}>
          {["All", "None", "In Progress", "Pending QC", "Approved", "Rejected", "Back Job", "Completed"].map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={sizeF} onChange={e => setSizeF(e.target.value)} className={inputCls}>
          {["All", "S", "M", "L", "XL", "2XL"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Bundle table */}
<div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/80">
                {["Bundle No.", "Photo", "Design", "Qty", "Size", "Color", "Status", "Updated", "Actions", "Document"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white/70 font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
              </thead>
              <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-4 py-3 font-mono text-foreground font-medium text-[10px]">{b.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-").replace("BND-20260723-", "BND-0")}</td>
                    <td className="px-4 py-3">
                      <DesignThumb name={b.design} />
                    </td>
                    <td className="px-4 py-3 text-foreground">{b.design}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{b.qty}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.size}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.color}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{b.updated}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewBundle(b)} title="View" className="p-1 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                        <button onClick={() => { setEditBundle(b); setEditForm({ qty: b.qty, size: b.size, color: b.color, batch: b.batch }); }} title="Edit" className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={12} /></button>
                        <button onClick={() => { setStatusUpdateBundle(b); setSelectedNewStatus(""); setStatusImage(null); }} title="Update Status" className="p-1 text-muted-foreground hover:text-foreground"><RefreshCw size={12} /></button>
                        <button onClick={() => handlePrintQR(b.id, b.design)} title="Print QR" className="p-1 text-muted-foreground hover:text-foreground"><QrCode size={12} /></button>
                        <button onClick={() => setDeleteConfirm(b.id)} title="Delete" className="p-1 text-red-500/60 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDocBundle(b.design)} title="View Design Document"
                        className="p-1 text-muted-foreground hover:text-foreground opacity-50 group-hover:opacity-100 transition-all duration-200">
                        <FileText size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {bundles.length} bundles</span>
          </div>
</div>

      {/* ─── Create Bundle Modal ─── */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDesign(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Create Bundle</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{selectedDesign.code} — {selectedDesign.name}</p>
              </div>
              <button onClick={() => setSelectedDesign(null)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Design</label>
                <div className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground">{selectedDesign.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Quantity <span className="text-red-500">*</span></label>
                  <input type="number" placeholder="e.g. 25" value={bundleForm.qty}
                    onChange={e => setBundleForm(f => ({ ...f, qty: e.target.value }))}
                    className={`w-full ${inputCls}`} />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Color <span className="text-red-500">*</span></label>
                  <input placeholder="e.g. White" value={bundleForm.color}
                    onChange={e => setBundleForm(f => ({ ...f, color: e.target.value }))}
                    className={`w-full ${inputCls}`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Size <span className="text-red-500">*</span></label>
                <select value={bundleForm.size}
                  onChange={e => setBundleForm(f => ({ ...f, size: e.target.value }))}
                  className={`w-full ${inputCls}`}>
                  {["S", "M", "L", "XL", "2XL"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Batch No. (optional)</label>
                  <input placeholder="e.g. B-08" value={bundleForm.batch}
                    onChange={e => setBundleForm(f => ({ ...f, batch: e.target.value }))}
                    className={`w-full ${inputCls}`} />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Production Date</label>
                  <input type="date" value={bundleForm.date}
                    onChange={e => setBundleForm(f => ({ ...f, date: e.target.value }))}
                    className={`w-full ${inputCls}`} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setSelectedDesign(null)}
                className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleCreateBundle}
                className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
                <QrCode size={12} /> Save & Print QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Modal ─── */}
      {viewBundle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewBundle(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Bundle Details</h3>
              <button onClick={() => setViewBundle(null)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                ["Bundle No.", viewBundle.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-").replace("BND-20260723-", "BND-0")],
                ["Design", viewBundle.design],
                ["Quantity", String(viewBundle.qty)],
                ["Size", viewBundle.size],
                ["Color", viewBundle.color],
                ["Batch", viewBundle.batch],
                ["Status", viewBundle.status],
                ["Updated", viewBundle.updated],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</span>
                  <span className="text-xs text-foreground font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setViewBundle(null)}
                className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors">
                Close
              </button>
              <button onClick={() => { handlePrintQR(viewBundle.id, viewBundle.design); }}
                className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
                <QrCode size={12} /> Print QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editBundle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditBundle(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Edit Bundle</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{editBundle.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-").replace("BND-20260723-", "BND-0")}</p>
              </div>
              <button onClick={() => setEditBundle(null)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Design</label>
                <div className="bg-muted border border-border rounded px-3 py-2 text-xs text-foreground">{editBundle.design}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Quantity</label>
                  <input type="number" value={editForm.qty}
                    onChange={e => setEditForm(f => ({ ...f, qty: parseInt(e.target.value) || 0 }))}
                    className={`w-full ${inputCls}`} />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Color</label>
                  <input value={editForm.color}
                    onChange={e => setEditForm(f => ({ ...f, color: e.target.value }))}
                    className={`w-full ${inputCls}`} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Size</label>
                <select value={editForm.size}
                  onChange={e => setEditForm(f => ({ ...f, size: e.target.value }))}
                  className={`w-full ${inputCls}`}>
                  {["S", "M", "L", "XL", "2XL"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Batch No.</label>
                <input value={editForm.batch}
                  onChange={e => setEditForm(f => ({ ...f, batch: e.target.value }))}
                  className={`w-full ${inputCls}`} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setEditBundle(null)}
                className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleEditSave}
                className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
                <Save size={12} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Status Update Modal ─── */}
      {statusUpdateBundle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setStatusUpdateBundle(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Update Status</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{statusUpdateBundle.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-").replace("BND-20260723-", "BND-0")} — {statusUpdateBundle.design}</p>
              </div>
              <button onClick={() => setStatusUpdateBundle(null)} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Status</span>
                <StatusBadge status={statusUpdateBundle.status} />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">New Status</label>
                {nextStatuses[statusUpdateBundle.status]?.length > 0 ? (
                  <select value={selectedNewStatus}
                    onChange={e => { setSelectedNewStatus(e.target.value); setStatusImage(null); }}
                    className={`w-full ${inputCls}`}>
                    <option value="">— select —</option>
                    {nextStatuses[statusUpdateBundle.status].map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <div className="bg-muted border border-border rounded px-3 py-2 text-xs text-muted-foreground">No further status changes available from here.</div>
                )}
              </div>
              {statusUpdateBundle.status === "None" && selectedNewStatus === "In Progress" && (
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Attach Image <span className="text-red-500">*</span></label>
                  <input type="file" accept="image/*"
                    onChange={e => setStatusImage(e.target.files?.[0] ?? null)}
                    className="w-full text-xs text-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-foreground file:text-background hover:file:opacity-90" />
                  <p className="text-[9px] text-muted-foreground mt-1">Image required to start production.</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setStatusUpdateBundle(null)}
                className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleStatusUpdate}
                disabled={!selectedNewStatus || (statusUpdateBundle.status === "None" && selectedNewStatus === "In Progress" && !statusImage)}
                className="flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 disabled:opacity-40 px-4 py-2 rounded text-xs font-medium transition-opacity">
                <CheckCircle size={12} /> Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Design Document Modal ─── */}
      {docBundle && (() => {
        const doc = getDesignDoc(docBundle);
        if (!doc) return null;
        return <DesignDocModal doc={doc} onClose={() => setDocBundle(null)} />;
      })()}

      {/* ─── Delete Confirmation ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={18} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Delete Bundle</h3>
              <p className="text-[11px] text-muted-foreground">Are you sure you want to delete bundle <span className="font-mono text-foreground">{deleteConfirm.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-").replace("BND-20260723-", "BND-0")}</span>?</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex items-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded text-xs font-medium transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex items-center gap-1.5 bg-red-500 text-white hover:opacity-90 px-4 py-2 rounded text-xs font-medium transition-opacity">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProdQC() {
  const [scanned, setScanned] = useState<typeof prodPendingQC[0] | null>(null);
  const [checklist, setChecklist] = useState({ stitch: false, measurement: false, fabric: false, accessories: false, appearance: false });
  const [remarks, setRemarks] = useState("");
  const [result, setResult] = useState<"Approved" | "Rejected" | "Back Job" | null>(null);

  function handleDecision(decision: "Approved" | "Rejected" | "Back Job") {
    setResult(decision);
  }

  const inputCls = "bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">QC Inspection</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Scan a QR code or select a bundle from the queue below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Scan / Bundle Info */}
        <div className="space-y-4">
          <div id="prod-scan-qr" className="bg-card border border-border rounded-lg p-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">QR Scan</span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Simulate Scan:</label>
                <select onChange={e => {
                  const b = prodPendingQC.find(q => q.id === e.target.value) ?? null;
                  setScanned(b); setResult(null);
                  setChecklist({ stitch: false, measurement: false, fabric: false, accessories: false, appearance: false });
                  setRemarks("");
                }} className="bg-muted border border-border rounded px-2 py-1 text-[11px] text-foreground focus:outline-none">
                  <option value="">-- select bundle --</option>
                  {prodPendingQC.map(q => <option key={q.id} value={q.id}>{q.id.replace("BND-20260722-", "BND-0")}</option>)}
                </select>
              </div>
            </div>
            {scanned ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Bundle No.", scanned.id.replace("BND-20260722-", "BND-0")],
                  ["Design", scanned.design],
                  ["Seamstress", scanned.seamstress],
                  ["Completed At", scanned.completedAt],
                  ["Waiting", scanned.waiting],
                  ["Current Status", "Pending QC"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</div>
                    <div className="text-xs font-medium text-foreground mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-lg">
                <QrCode size={24} className="text-muted-foreground/40" />
                <span className="text-[11px] text-muted-foreground">No bundle scanned yet</span>
              </div>
            )}
          </div>

          {/* Inspection Form */}
          {scanned && !result && (
            <div id="prod-checklist" className="bg-card border border-border rounded-lg p-4 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Inspection Checklist</span>
              {/* Upload photo placeholder */}
              <div className="border border-dashed border-border rounded-lg h-16 flex items-center justify-center gap-2 hover:border-foreground/30 transition-colors cursor-pointer">
                <Plus size={14} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">Upload Inspection Photo</span>
              </div>
              {/* Checklist */}
              <div className="space-y-2">
                {[
                  { key: "stitch", label: "Stitch Quality" },
                  { key: "measurement", label: "Measurement" },
                  { key: "fabric", label: "Fabric Defects" },
                  { key: "accessories", label: "Accessories" },
                  { key: "appearance", label: "Overall Appearance" },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 text-xs text-foreground cursor-pointer group">
                    <input type="checkbox"
                      checked={checklist[item.key as keyof typeof checklist]}
                      onChange={e => setChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="accent-foreground w-3.5 h-3.5" />
                    <span className={checklist[item.key as keyof typeof checklist] ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Remarks</label>
                <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} placeholder="Optional inspection notes…" className={`w-full ${inputCls} resize-none`} />
              </div>
              {/* Decision buttons */}
              <div id="prod-actions-bar" className="flex gap-2">
                <button onClick={() => handleDecision("Approved")} className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background hover:opacity-90 py-2 rounded text-xs font-medium transition-opacity">
                  <CheckCircle size={12} /> Approve
                </button>
                <button onClick={() => handleDecision("Rejected")} className="flex-1 flex items-center justify-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground py-2 rounded text-xs font-medium transition-colors">
                  <XCircle size={12} /> Reject
                </button>
                <button onClick={() => handleDecision("Back Job")} className="flex-1 flex items-center justify-center gap-1.5 bg-muted border border-border text-muted-foreground hover:text-foreground py-2 rounded text-xs font-medium transition-colors">
                  <RotateCcw size={12} /> Back Job
                </button>
              </div>
            </div>
          )}

          {/* Result card */}
          {scanned && result && (
            <div className="bg-card border border-border rounded-lg p-4 text-center space-y-2">
              {result === "Approved" && <CheckCircle size={28} className="mx-auto text-emerald-500" />}
              {result === "Rejected" && <XCircle size={28} className="mx-auto text-red-500" />}
              {result === "Back Job" && <RotateCcw size={28} className="mx-auto text-amber-500" />}
              <p className="text-sm font-semibold text-foreground">{result}</p>
              <p className="text-[11px] text-muted-foreground">
                {result === "Approved" && "Bundle passed QC. Ready for completion."}
                {result === "Rejected" && "Bundle failed QC. Marked as rejected."}
                {result === "Back Job" && "Bundle sent back for rework."}
              </p>
              {remarks && <p className="text-[11px] text-muted-foreground italic">"{remarks}"</p>}
              <button onClick={() => { setScanned(null); setResult(null); }} className="text-[11px] text-foreground border border-border rounded px-3 py-1.5 hover:bg-muted transition-colors">
                Inspect Another
              </button>
            </div>
          )}
        </div>

        {/* Pending QC + Back Jobs */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Pending QC Queue</span>
              <span className="text-[10px] font-mono text-amber-500">{prodPendingQC.length} waiting</span>
            </div>
            <div className="divide-y divide-border/50">
              {prodPendingQC.map((q, i) => (
                <div key={q.id}
                  onClick={() => { setScanned(q); setResult(null); setChecklist({ stitch: false, measurement: false, fabric: false, accessories: false, appearance: false }); setRemarks(""); }}
                  className={`px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${i % 2 === 0 ? 'bg-card' : 'bg-muted/30'} ${scanned?.id === q.id ? "bg-foreground/5 border-l-2 border-foreground" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-foreground">{q.design}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{q.id.replace("BND-20260722-", "BND-0")} · {q.seamstress}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-amber-500 font-medium">{q.waiting}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{q.completedAt}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Back Job Management</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Bundle", "Reason", "Seamstress", "Status", "Due"].map(h => (
                      <th key={h} className="text-left px-4 py-2 text-muted-foreground font-medium text-[10px] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                  {prodBackJobs.map(bj => (
                    <tr key={bj.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-foreground text-[10px]">{bj.id.replace("BND-20260722-", "BND-0").replace("BND-20260721-", "BND-")}</td>
                      <td className="px-4 py-2.5 text-foreground max-w-28 truncate" title={bj.reason}>{bj.reason}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{bj.seamstress}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={bj.status} /></td>
                      <td className="px-4 py-2.5 text-muted-foreground font-mono text-[10px]">{bj.due}</td>
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

function ProdReports() {
  const [tab, setTab] = useState("production");
  const tabs = [
    { key: "production", label: "Production" },
    { key: "quality", label: "Quality" },
    { key: "productivity", label: "Productivity" },
  ];

  return (
    <div id="prod-reports-summary" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Reports</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Production, quality, and seamstress analytics</p>
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

      {tab === "production" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Total Created" value={322} sub="Feb–Jul 2026" icon={Package} accent="bg-muted text-muted-foreground" />
            <KPICard label="Completed" value={273} sub="84.8% completion" icon={CheckCircle} accent="bg-muted text-muted-foreground" trend="up" />
            <KPICard label="QC Pass Rate" value="89%" sub="Of inspected" icon={ShieldCheck} accent="bg-muted text-muted-foreground" />
            <KPICard label="Back Job Rate" value="5%" sub="Of completed" icon={RotateCcw} accent="bg-muted text-muted-foreground" />
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Monthly Production</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={prodReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#737373" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#f5f5f5", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 6, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#737373" }} />
                <Bar key="prod-created" dataKey="created" fill="#0a0a0a" radius={[2,2,0,0]} name="Created" />
                <Bar key="prod-completed" dataKey="completed" fill="#737373" radius={[2,2,0,0]} name="Completed" />
                <Bar key="prod-approved" dataKey="approved" fill="#a3a3a3" radius={[2,2,0,0]} name="Approved" />
                <Bar key="prod-backjobs" dataKey="backjobs" fill="#d4d4d4" radius={[2,2,0,0]} name="Back Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Month", "Created", "Completed", "QC Approved", "Back Jobs", "Efficiency %"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                  {prodReportData.map(r => (
                    <tr key={r.month} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{r.month} 2026</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.created}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.completed}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.approved}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.backjobs}</td>
                      <td className="px-4 py-3 font-mono text-foreground font-semibold">{Math.round((r.completed / r.created) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "quality" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="QC Pass Rate" value="89%" sub="Of all inspected" icon={ShieldCheck} accent="bg-muted text-muted-foreground" trend="up" />
            <KPICard label="Rejection Rate" value="4%" sub="Failed QC" icon={XCircle} accent="bg-muted text-muted-foreground" />
            <KPICard label="Back Job Rate" value="5%" sub="Sent for rework" icon={RotateCcw} accent="bg-muted text-muted-foreground" />
            <KPICard label="Avg Inspect Time" value="18m" sub="Per bundle" icon={Clock} accent="bg-muted text-muted-foreground" />
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Design", "Inspected", "Approved", "Rejected", "Back Job", "Pass Rate"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                  {prodQualityData.map(r => (
                    <tr key={r.design} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{r.design}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.inspected}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.approved}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.rejected}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{r.backjob}</td>
                      <td className="px-4 py-3 font-mono text-foreground font-semibold">{Math.round((r.approved / r.inspected) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "productivity" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Seamstress", "Bundles Completed", "Back Jobs", "Avg Time / Bundle", "Efficiency %"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 [&>tr:nth-child(odd)]:bg-card [&>tr:nth-child(even)]:bg-muted/30">
                {[
                  { name: "Maria Santos", completed: 48, backjobs: 2, avg: "3h 20m", eff: 96 },
                  { name: "Liza Cruz", completed: 42, backjobs: 1, avg: "3h 45m", eff: 98 },
                  { name: "Rosa Mendez", completed: 36, backjobs: 3, avg: "4h 10m", eff: 92 },
                  { name: "Cita Bautista", completed: 31, backjobs: 2, avg: "4h 30m", eff: 94 },
                  { name: "Ana Torres", completed: 18, backjobs: 4, avg: "5h 00m", eff: 78 },
                  { name: "Joy Reyes", completed: 12, backjobs: 1, avg: "4h 50m", eff: 92 },
                ].map(s => (
                  <tr key={s.name} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{s.completed}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{s.backjobs}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{s.avg}</td>
                    <td className="px-4 py-3 font-mono text-foreground font-semibold">{s.eff}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
