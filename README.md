# Clinique Optique Vision Caraïbes — Optical Clinic Management System (PMS)

A clickable, fully simulated, production-grade Prototype of an **Optical Clinic Management System** built with **Next.js / React, TypeScript, Tailwind CSS, and shadcn/ui**.

Designed with **strict Pure Black & White monochrome aesthetics** (high-contrast typography, neutral zinc borders/badges, dark mode inversion, no colored accent fills).

---

## 🧭 Navigation & Screen Map

| Module | Route / Key | Core Capabilities |
| :--- | :--- | :--- |
| **Dashboard** | `dashboard` | 4 KPI Cards (Revenue HTG/USD, Patients, Lab Orders, Overdue), Hourly patient flow chart, 7-day revenue area chart, Live queue snapshot, Recent Activity feed, Quick Action dialogs. |
| **Patients Directory & EHR** | `patients` | Searchable directory (VIP, Glaucoma, High Myopia, Diabetic tags), Patient Profile Drawer with tabs: **Overview, Medical History, Refraction & Exams, Prescriptions, Glasses & Lab Orders, Invoices, Documents & OCT**. Full New Patient intake modal. |
| **Appointments & Queue** | `appointments` | Multi-lane practitioner day calendar (Dr. Pierre-Louis, Dr. Augustin, Opt. Desir), **Live Waiting Room Queue Board** with wait-time tracking and call-in triggers, SMS reminder automation console. |
| **Consultations (EHR)** | `consultations` | Structured 2-column OD/OS Refraction (Visual Acuity, Sphere, Cyl, Axis, Add, Biomicroscopy, IOP Goldmann, Fundus, ICD-10 diagnosis), **Side-by-side longitudinal comparison** with past exam, **Digital Sign & Lock** modal, 1-click Rx generation. |
| **Prescriptions** | `prescriptions` | Filterable table for **Spectacles, Contact Lenses, and Medication Rx**, **Printable A5 Letterhead Preview Modal** with QR Code verification and practitioner signature block, 1-click Dispatch to Workshop Lab. |
| **Lab & Workshop** | `lab` | **7-Column Kanban Board** (`Ordered` → `At lab` → `Received` → `Edged & mounted` → `QC` → `Ready` → `Delivered`), Precision fitting measurements (Pupil height, Pantoscopic tilt, Vertex distance, Wrap angle), Delay alerts banner, After-Sales & Warranty replacement log. |
| **Inventory & Catalog** | `inventory` | **Designer Frames Card Grid** (Ray-Ban, Tom Ford, Oakley, Gucci, Silhouette) with SKU, dimensions, and low-stock indicators, Ophthalmic Blanks & Contact lenses tables, Stock Movement Audit log, Quick Stock-Take adjustment modal. |
| **Billing & Cash Register** | `billing` | Invoices, Quotes, Receipts, Credit Notes table, Itemized Invoice Builder, **Dual-Currency Payment Terminal (HTG / USD with live exchange rate 132.50)**, Installment plan manager, **Daily Cash Register Float & Z-Report** closure journal. |
| **Insurance Claims** | `insurance` | Affiliated third-party insurers (OFATMA, AIC Assurances, SunAssurance, BUH), Claims filing modal, Pre-authorization tracker, **Aging Receivables Dashboard** (<30d, 31-60d, 61-90d, 90+d). |
| **Reports & Analytics** | `reports` | Monthly Clinic Revenue Trend Chart, Average Basket Value (Panier Moyen), AR Coating attach rate (82.4%), 2nd Pair conversion rate, Practitioner productivity breakdown, Top-selling SKU rankings, CSV/PDF export. |
| **Settings & Admin** | `settings` | Clinic profile & tax ID (NIF), Weekly operating schedule, Role-Based Access Control (RBAC) permissions matrix, Haitian Creole / French SMS & WhatsApp notification templates, HIPAA/Security Audit Trail, Encrypted Database backup export. |
| **Patient Portal** | `patient-portal` | Patient self-service experience with active eyewear order stepper, active prescription downloads, appointment booking wizard, and receipt archive. |

---

## ⚡ Global Interactive Controls

- **Command Palette (`Cmd + K` / `Ctrl + K`)**: Instant keyboard search for any patient, invoice, job order, or screen navigation.
- **Role Switcher (Header)**: Switch between **Super Admin, Optometrist, Optician, Receptionist, Cashier, Lab Tech** to inspect dynamic role badges and module contexts.
- **Clinic Branch Switcher (Header)**: Switch between **Pétion-Ville (Main Branch)** and **Delmas 75 (Optical Express)**.
- **Dark Mode Toggle (Header)**: Seamlessly toggle between Pure White (#FFFFFF) and Pure Dark Inversion (#000000).
- **Dev States Toolbar (Bottom Floating)**: Toggle **Empty State**, **Loading Skeletons**, and **Simulated Error States** in real-time across views.
- **Live Local Store**: Adding a patient, appointment, consultation, prescription, or invoice instantly updates all dependent dashboards and tables in real-time.

---

## 🎨 Visual Architecture
- **Pure Black & White palette**: Neutral zinc grayscale (`zinc-100` to `zinc-900`) for structural borders and subtle tags. No colors, no gradients.
- **Typography**: Geometric display and body (`Plus Jakarta Sans`) paired with technical monospace numerals (`JetBrains Mono`).
- **Responsive Layout**: Fluid desktop grid collapsing to mobile-first drawers, touch targets, and side-scrolling Kanban columns.
