// ─── Admin Data Constants ─────────────────────────────────────────────────────

export const productionData = [
  { month: "Feb", created: 48, completed: 41, approved: 38, backjobs: 7 },
  { month: "Mar", created: 62, completed: 55, approved: 51, backjobs: 11 },
  { month: "Apr", created: 57, completed: 53, approved: 49, backjobs: 8 },
  { month: "May", created: 71, completed: 64, approved: 60, backjobs: 13 },
  { month: "Jun", created: 65, completed: 59, approved: 55, backjobs: 9 },
  { month: "Jul", created: 78, completed: 68, approved: 63, backjobs: 14 },
];

export const auditLog = [
  { user: "admin", action: "Created user account", module: "Users", dt: "Jul 22, 2026 11:15 AM" },
  { user: "finance", action: "Submitted replenishment REQ-2041", module: "Finance", dt: "Jul 22, 2026 10:30 AM" },
  { user: "qc.team", action: "Approved bundle B-201", module: "QC", dt: "Jul 22, 2026 10:05 AM" },
  { user: "rd.lead", action: "Released design D-102", module: "Design", dt: "Jul 22, 2026 9:30 AM" },
  { user: "admin", action: "Modified role — Production Lead", module: "Roles", dt: "Jul 21, 2026 4:47 PM" },
  { user: "system", action: "Daily backup completed", module: "System", dt: "Jul 21, 2026 2:00 AM" },
];

export const allUsers = [
  { id: "EMP-001", name: "Admin User", username: "admin", role: "Admin", dept: "IT", status: "Active", last: "Jul 22, 2026 11:15 AM" },
  { id: "EMP-002", name: "Maria Santos", username: "m.santos", role: "Finance", dept: "Finance", status: "Active", last: "Jul 22, 2026 10:30 AM" },
  { id: "EMP-003", name: "Jose Cruz", username: "j.cruz", role: "Finance", dept: "Finance", status: "Active", last: "Jul 22, 2026 9:14 AM" },
  { id: "EMP-004", name: "Ana Reyes", username: "a.reyes", role: "R&D", dept: "Research", status: "Active", last: "Jul 22, 2026 8:55 AM" },
  { id: "EMP-005", name: "Juan Dela Cruz", username: "j.dela.cruz", role: "Production", dept: "Operations", status: "Locked", last: "Jul 21, 2026 3:22 PM" },
  { id: "EMP-006", name: "Liza Tan", username: "l.tan", role: "QC", dept: "Quality", status: "Active", last: "Jul 22, 2026 10:05 AM" },
  { id: "EMP-007", name: "Marco Villanueva", username: "m.villanueva", role: "Manager", dept: "Operations", status: "Active", last: "Jul 22, 2026 12:10 PM" },
  { id: "EMP-008", name: "Rosa Gomez", username: "r.gomez", role: "Production", dept: "Operations", status: "Inactive", last: "Jul 15, 2026 9:00 AM" },
];

export const allRoles = [
  { name: "Admin", desc: "Full system access", users: 3, perms: 24, status: "Active", system: true },
  { name: "Manager", desc: "Approve requests and view all reports", users: 3, perms: 18, status: "Active", system: true },
  { name: "R&D Lead", desc: "Manage and release designs", users: 7, perms: 12, status: "Active", system: false },
  { name: "Production Operator", desc: "Handle bundle creation and tracking", users: 10, perms: 9, status: "Active", system: false },
  { name: "QC Inspector", desc: "Inspect and approve bundles", users: 5, perms: 8, status: "Active", system: false },
  { name: "Finance Officer", desc: "Manage petty cash and replenishments", users: 4, perms: 10, status: "Active", system: false },
];

export const allBundles = [
  { id: "B-201", design: "MR-098", qty: 500, assigned: "Production A", status: "Completed", qc: "Approved", date: "Jul 20, 2026" },
  { id: "B-202", design: "MR-099", qty: 300, assigned: "Production B", status: "Completed", qc: "Approved", date: "Jul 20, 2026" },
  { id: "B-203", design: "MR-100", qty: 750, assigned: "Production A", status: "In Progress", qc: "Pending", date: "Jul 21, 2026" },
  { id: "B-204", design: "MR-101", qty: 200, assigned: "Production C", status: "QC Pending", qc: "Under Review", date: "Jul 21, 2026" },
  { id: "B-205", design: "MR-102", qty: 600, assigned: "Production B", status: "QC Pending", qc: "Under Review", date: "Jul 22, 2026" },
  { id: "B-206", design: "MR-098", qty: 400, assigned: "Production A", status: "Back Job", qc: "Rejected", date: "Jul 21, 2026" },
  { id: "B-207", design: "MR-103", qty: 1000, assigned: "Production C", status: "In Progress", qc: "Pending", date: "Jul 22, 2026" },
  { id: "B-208", design: "SP-044", qty: 250, assigned: "Production B", status: "Back Job", qc: "Rejected", date: "Jul 19, 2026" },
];

export const allQRCodes = [
  { id: "QR-4401", bundle: "B-201", design: "MR-098", by: "system", date: "Jul 20, 2026 9:00 AM", status: "Active" },
  { id: "QR-4402", bundle: "B-202", design: "MR-099", by: "system", date: "Jul 20, 2026 9:15 AM", status: "Active" },
  { id: "QR-4403", bundle: "B-203", design: "MR-100", by: "l.tan", date: "Jul 21, 2026 10:30 AM", status: "Active" },
  { id: "QR-4404", bundle: "B-204", design: "MR-101", by: "system", date: "Jul 21, 2026 11:00 AM", status: "Active" },
  { id: "QR-4350", bundle: "B-188", design: "MR-097", by: "system", date: "Jun 30, 2026 2:00 AM", status: "Expired" },
  { id: "QR-4351", bundle: "B-189", design: "SP-043", by: "admin", date: "Jun 30, 2026 2:05 AM", status: "Expired" },
];

export const allDesigns = [
  { id: "MR-103", name: "Alexa Long Sleeve Top", version: "3.0", by: "a.reyes", released: "Jul 22, 2026", status: "Pending" },
  { id: "MR-102", name: "Martina Scoop Neck Top", version: "2.0", by: "rd.lead", released: "Jul 22, 2026", status: "Active" },
  { id: "MR-101", name: "Arya Tank Top", version: "1.5", by: "a.reyes", released: "Jul 21, 2026", status: "Active" },
  { id: "MR-100", name: "Lounge Pants Plain", version: "4.2", by: "rd.lead", released: "Jul 18, 2026", status: "Active" },
  { id: "MR-099", name: "Lounge Pants Ribbed", version: "2.0", by: "a.reyes", released: "Jul 15, 2026", status: "Active" },
  { id: "MR-098", name: "Klea Mini Dress", version: "2.3", by: "rd.lead", released: "Jul 10, 2026", status: "Active" },
  { id: "SP-044", name: "Biker Shorts", version: "2.1", by: "a.reyes", released: "Jul 8, 2026", status: "Active" },
  { id: "MR-097", name: "Premium Jeans High Rise", version: "1.1", by: "a.reyes", released: "Jun 30, 2026", status: "Archived" },
];

export const auditEventsData = [
  { module: "Users", events: 58 },
  { module: "Finance", events: 42 },
  { module: "Production", events: 71 },
  { module: "QC", events: 39 },
  { module: "System", events: 46 },
  { module: "Design", events: 28 },
];

export const pettyCashTx = [
  { id: "PC-041", desc: "Office supplies", amount: "₱480", by: "m.santos", date: "Jul 22, 2026", status: "Approved" },
  { id: "PC-040", desc: "Courier fees", amount: "₱320", by: "j.cruz", date: "Jul 22, 2026", status: "Pending" },
  { id: "PC-039", desc: "Pantry restock", amount: "₱1,200", by: "m.santos", date: "Jul 21, 2026", status: "Approved" },
  { id: "PC-038", desc: "Printer cartridge", amount: "₱750", by: "admin", date: "Jul 21, 2026", status: "Approved" },
  { id: "PC-037", desc: "Taxi reimbursement", amount: "₱380", by: "j.cruz", date: "Jul 20, 2026", status: "Approved" },
  { id: "PC-036", desc: "Miscellaneous tools", amount: "₱940", by: "m.villanueva", date: "Jul 18, 2026", status: "Approved" },
  { id: "REP-003", desc: "Fund replenishment", amount: "₱10,000", by: "admin", date: "Jul 15, 2026", status: "Completed" },
];

export const replenishments = [
  { id: "REQ-2041", amount: "₱10,000", by: "Maria Santos", dept: "Finance", date: "Jul 22, 2026", approver: "—", status: "Pending" },
  { id: "REQ-2038", amount: "₱8,500", by: "Jose Cruz", dept: "Finance", date: "Jul 18, 2026", approver: "m.villanueva", status: "Approved" },
  { id: "REQ-2035", amount: "₱12,000", by: "Maria Santos", dept: "Finance", date: "Jul 10, 2026", approver: "m.villanueva", status: "Approved" },
  { id: "REQ-2030", amount: "₱9,200", by: "Jose Cruz", dept: "Finance", date: "Jun 25, 2026", approver: "m.villanueva", status: "Approved" },
  { id: "REQ-2028", amount: "₱7,000", by: "Maria Santos", dept: "Finance", date: "Jun 18, 2026", approver: "admin", status: "Approved" },
  { id: "REQ-2020", amount: "₱5,500", by: "Jose Cruz", dept: "Finance", date: "Jun 05, 2026", approver: "admin", status: "Rejected" },
];

export const finData = [
  { month: "Feb", spend: 6200, replen: 1, balance: 12400 },
  { month: "Mar", spend: 7800, replen: 1, balance: 14600 },
  { month: "Apr", spend: 5400, replen: 0, balance: 9200 },
  { month: "May", spend: 9100, replen: 2, balance: 13800 },
  { month: "Jun", spend: 8300, replen: 1, balance: 11500 },
  { month: "Jul", spend: 8320, replen: 1, balance: 12450 },
];

export const fullAuditLog = [
  { ts: "Jul 22, 2026 11:15 AM", user: "admin", role: "Admin", action: "Created user account — EMP-009", module: "Users", ip: "192.168.1.10", status: "Success" },
  { ts: "Jul 22, 2026 10:55 AM", user: "j.dela.cruz", role: "Production", action: "Failed login attempt (3rd)", module: "Auth", ip: "192.168.1.44", status: "Failed" },
  { ts: "Jul 22, 2026 10:30 AM", user: "m.santos", role: "Finance", action: "Submitted REQ-2041", module: "Finance", ip: "192.168.1.22", status: "Success" },
  { ts: "Jul 22, 2026 10:05 AM", user: "l.tan", role: "QC", action: "Approved bundle B-201", module: "QC", ip: "192.168.1.31", status: "Success" },
  { ts: "Jul 22, 2026 9:30 AM", user: "rd.lead", role: "R&D", action: "Released design D-102", module: "Design", ip: "192.168.1.18", status: "Success" },
  { ts: "Jul 21, 2026 4:47 PM", user: "admin", role: "Admin", action: "Modified role — Production Lead", module: "Roles", ip: "192.168.1.10", status: "Success" },
  { ts: "Jul 21, 2026 3:22 PM", user: "j.dela.cruz", role: "Production", action: "Failed login attempt (1st)", module: "Auth", ip: "192.168.1.44", status: "Failed" },
  { ts: "Jul 21, 2026 2:10 PM", user: "m.villanueva", role: "Manager", action: "Approved Petty Cash PC-034", module: "Finance", ip: "192.168.1.55", status: "Success" },
  { ts: "Jul 21, 2026 1:00 PM", user: "a.reyes", role: "R&D", action: "Uploaded design D-103 draft", module: "Design", ip: "192.168.1.19", status: "Success" },
  { ts: "Jul 21, 2026 10:20 AM", user: "l.tan", role: "QC", action: "Rejected bundle B-208", module: "QC", ip: "192.168.1.31", status: "Success" },
  { ts: "Jul 21, 2026 9:05 AM", user: "j.cruz", role: "Finance", action: "Submitted petty cash PC-040", module: "Finance", ip: "192.168.1.23", status: "Success" },
  { ts: "Jul 21, 2026 2:00 AM", user: "system", role: "System", action: "Daily backup completed", module: "System", ip: "127.0.0.1", status: "Success" },
];

export const backupHistory = [
  { id: "BKP-088", type: "Automated", dt: "Jul 22, 2026 2:00 AM", size: "4.2 GB", status: "Completed" },
  { id: "BKP-087", type: "Automated", dt: "Jul 21, 2026 2:00 AM", size: "4.1 GB", status: "Completed" },
  { id: "BKP-086", type: "Manual", dt: "Jul 20, 2026 3:45 PM", size: "4.1 GB", status: "Completed" },
  { id: "BKP-085", type: "Automated", dt: "Jul 20, 2026 2:00 AM", size: "4.0 GB", status: "Completed" },
  { id: "BKP-084", type: "Automated", dt: "Jul 19, 2026 2:00 AM", size: "4.0 GB", status: "Completed" },
  { id: "BKP-083", type: "Manual", dt: "Jul 18, 2026 11:30 AM", size: "3.9 GB", status: "Completed" },
];
