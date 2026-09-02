import { UserRole, AuditLog } from "@/src/types";

export interface ClinicProfile {
  name: string;
  tagline: string;
  registrationNumber: string;
  taxIdNIF: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  country: string;
  currencies: {
    primary: "HTG";
    secondary: "USD";
    exchangeRateUsdToHtg: number;
    autoUpdate: boolean;
  };
  taxRatePercent: number;
}

export const mockClinicProfile: ClinicProfile = {
  name: "Clinique Optique Vision Caraïbes",
  tagline: "Centre d'Excellence en Soins Visuels & Réfraction Avancée",
  registrationNumber: "MSPP-DE-88219-OPT",
  taxIdNIF: "001-829-440-9",
  phone: "+509 2940-8800 / +509 3701-4422",
  email: "contact@optiquevision.ht",
  website: "www.optiquevision.ht",
  address: "42 Angle Rue Grégoire et Panaméricaine",
  city: "Pétion-Ville",
  country: "Haïti",
  currencies: {
    primary: "HTG",
    secondary: "USD",
    exchangeRateUsdToHtg: 132.50,
    autoUpdate: false,
  },
  taxRatePercent: 10,
};

export const mockOpeningHours = [
  { day: "Monday", open: "08:00", close: "17:00", isOpen: true },
  { day: "Tuesday", open: "08:00", close: "17:00", isOpen: true },
  { day: "Wednesday", open: "08:00", close: "17:00", isOpen: true },
  { day: "Thursday", open: "08:00", close: "17:00", isOpen: true },
  { day: "Friday", open: "08:00", close: "17:00", isOpen: true },
  { day: "Saturday", open: "08:30", close: "14:00", isOpen: true },
  { day: "Sunday", open: "Closed", close: "Closed", isOpen: false },
];

export const mockRooms = [
  { id: "RM-01", name: "Lane A (Exam Room 1)", equipment: "Nidek RT-6100 Digital Phoropter, Haag-Streit BM900 Slit Lamp, Topcon Autorefractor" },
  { id: "RM-02", name: "Lane B (Pediatric & Contact Lens)", equipment: "Reichert Ultramatic Phoropter, Keratometer, Slit Lamp with Imaging" },
  { id: "RM-03", name: "Lane C (Special Diagnostics)", equipment: "Heidelberg Spectralis OCT, Humphrey HFA3 Visual Field Analyzer" },
  { id: "RM-04", name: "In-House Edging Lab", equipment: "Essilor Delta 2 Edger & Blocker, Lensmeter LM-700" },
];

export const mockRolePermissions: Record<UserRole, string[]> = {
  Admin: [
    "overview", "patients", "appointments", "consultations", "prescriptions",
    "lab", "inventory", "billing", "insurance", "reports", "settings"
  ],
  Practitioner: [
    "overview", "patients", "appointments", "consultations", "prescriptions",
    "lab", "inventory", "reports"
  ],
  Technician: [
    "overview", "lab", "inventory", "prescriptions"
  ],
  Receptionist: [
    "overview", "patients", "appointments", "billing", "insurance"
  ],
  Optician: [
    "overview", "patients", "prescriptions", "lab", "inventory", "billing"
  ],
  Accountant: [
    "overview", "billing", "insurance", "reports"
  ],
  Patient: [
    "portal-appointments", "portal-prescriptions", "portal-invoices", "portal-documents"
  ],
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-1001",
    timestamp: "2026-09-02 09:14:22",
    user: "Dr. Jean-Claude Pierre-Louis",
    role: "Practitioner",
    action: "SIGN_CONSULTATION",
    module: "Consultations",
    details: "Signed and locked refractive consultation CNS-2024-001 (Patient: Jean-Baptiste Alexandre)",
    ipAddress: "192.168.1.45",
  },
  {
    id: "LOG-1002",
    timestamp: "2026-09-02 09:10:05",
    user: "Marie-Ange Joseph",
    role: "Receptionist",
    action: "RECORD_PAYMENT",
    module: "Billing",
    details: "Processed cash payment 14,500 HTG for INV-2026-0001 (Receipt #TRX-10047)",
    ipAddress: "192.168.1.12",
  },
  {
    id: "LOG-1003",
    timestamp: "2026-09-02 08:35:10",
    user: "David Cherenfant",
    role: "Technician",
    action: "UPDATE_LAB_STATUS",
    module: "Lab & Workshop",
    details: "Moved Job LAB-2026-1002 to 'Edged & mounted' status",
    ipAddress: "192.168.1.80",
  },
  {
    id: "LOG-1004",
    timestamp: "2026-09-02 08:00:00",
    user: "Admin System",
    role: "Admin",
    action: "DAILY_BACKUP",
    module: "Settings",
    details: "Automated snapshot backup generated and encrypted",
    ipAddress: "127.0.0.1",
  },
  {
    id: "LOG-1005",
    timestamp: "2026-09-01 16:55:12",
    user: "Marie-Ange Joseph",
    role: "Receptionist",
    action: "SEND_REMINDERS",
    module: "Appointments",
    details: "Dispatched 16 automated WhatsApp / SMS appointment reminders for 2026-09-02 queue",
    ipAddress: "192.168.1.12",
  },
];
