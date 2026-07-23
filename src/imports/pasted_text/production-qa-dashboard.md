Since Production Head and QA/QC are combined into one role, their screen should be the operations hub of the system. This is where they monitor production, assign seamstresses, inspect completed bundles, and update statuses after scanning QR codes.

The goal is to answer:

    Which bundles are still in production?
    Which bundles are waiting for inspection?
    Which seamstress worked on this bundle?
    Which bundles passed or failed QC?

Production / QA Dashboard
Purpose

Manage the entire production process from bundle creation to quality inspection and completion.
1. Header

Components

    Dashboard Title
    Search Bundle
    QR Scan Button
    Notifications
    User Profile

2. KPI Cards

Displays today's production summary.
KPI	Description
Total Bundles	All bundles created
In Progress	Currently being sewn
Pending QC	Awaiting inspection
Approved	Passed QC
Rejected	Failed QC
Back Jobs	Returned for rework
Completed Today	Finished bundles
3. Quick Actions

Buttons:

    Create Bundle
    Scan QR Code
    Assign Seamstress
    View Pending QC
    Print Bundle Label

4. Bundle Management (Main Screen)

This is the heart of the module.
Bundle Table
Bundle No.	Design	Qty	Size	Seamstress	Status	Last Updated	Actions

Filters

    Date
    Design
    Status
    Seamstress
    Size
    Color

Actions

    View
    Scan
    Edit
    Update Status
    Print QR

5. Create Bundle

Production creates a new bundle from a released design.

Fields

    Select Design
    Quantity
    Size
    Color
    Batch Number (optional)
    Production Date

System automatically:

    Generates Bundle Number
    Generates QR Code
    Saves Bundle

Buttons

    Save & Print QR
    Save Only

6. QR Scan Screen

After scanning:

Display:

Bundle No.
BND-20260722-0012

Design
Classic Polo

Size
Large

Quantity
25 pcs

Current Status
Pending QC

Assigned Seamstress
Maria Santos

Buttons

    Update Status
    Upload Photo
    Add Remarks
    Print Label

7. Seamstress Assignment

Assign or reassign work.
Table
Seamstress	Active Bundles	Completed Today	Status

Assign

    Select Bundle
    Select Seamstress
    Assign

The seamstress assignment becomes part of the bundle's production history.
8. QC Inspection

After scanning a completed bundle:
Inspection Form

Bundle Information

    Bundle Number
    Design
    Quantity
    Seamstress
    Completion Date

Inspection

Upload Photo

Inspection Checklist

    Stitch Quality
    Measurement
    Fabric Defects
    Accessories
    Overall Appearance

Remarks

Status

    Approved
    Rejected
    Back Job

Save
9. Production Timeline

Every bundle has a history.

Example
Time	Activity
8:30 AM	Bundle Created
8:45 AM	Assigned to Maria
12:15 PM	Sewing Completed
1:05 PM	QC Inspection
1:20 PM	Approved

This provides complete traceability for every bundle.
10. Pending QC Queue

Instead of searching manually, QC can quickly see bundles waiting for inspection.
Bundle	Design	Seamstress	Completed At	Waiting Time

Clicking a row opens the inspection form.
11. Back Job Management

Tracks bundles that require rework.
Bundle	Reason	Assigned Seamstress	Status	Due Date

After rework:

    Scan QR again
    Reinspect
    Approve if compliant

12. Photo Gallery

Stores inspection photos.

Each bundle can have:

    Before inspection photo
    Defect close-up (if applicable)
    After rework photo

This creates a visual quality record.
13. Reports

Generate reports such as:
Production

    Daily Production
    Bundle History
    Production by Design
    Bundle Status Summary

Quality

    QC Pass Rate
    Rejection Report
    Back Job Report
    Defect Summary

Productivity

    Seamstress Productivity
    Average Completion Time
    Rework Frequency

Export to:

    PDF
    Excel

Suggested Layout

---------------------------------------------------------
Header
---------------------------------------------------------

KPI Cards
---------------------------------------------------------

Quick Actions
---------------------------------------------------------

Bundle Management Table (Main Area)
---------------------------------------------------------

Pending QC Queue        Back Job Queue
---------------------------------------------------------

Production Timeline     Recent Inspections
---------------------------------------------------------

Production Workflow

Released Design
        │
        ▼
Create Bundle
        │
        ▼
Generate QR Code
        │
        ▼
Assign Seamstress
        │
        ▼
Sewing in Progress
        │
        ▼
Bundle Completed
        │
        ▼
Pending QC
        │
        ▼
Scan QR Code
        │
        ▼
Quality Inspection
        │
   ┌────┼─────┐
   ▼    ▼     ▼
Approved Rejected Back Job
   │      │      │
   │      │      ▼
   │      └── Rework
   │             │
   └─────────────┘
         │
         ▼
     Completed

Recommendation

Because Production Head and QA are one user role, avoid separating them into different modules. Instead, organize the screen into four functional tabs:

    Dashboard – KPIs, production progress, and pending inspections.
    Bundles – Create bundles, generate/print QR codes, assign seamstresses, and monitor statuses.
    QC Inspection – Scan QR codes, inspect bundles, upload photos, record remarks, and approve/reject/back job.
    Reports – Production, quality, and seamstress performance reports.

This design reflects their actual workflow: they oversee production, then inspect the finished work, all within the same interface without switching between separate systems.
