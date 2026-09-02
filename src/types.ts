export type UserRole =
  | "Admin"
  | "Practitioner"
  | "Technician"
  | "Receptionist"
  | "Optician"
  | "Accountant"
  | "Patient";

export type Currency = "HTG" | "USD";

export interface Patient {
  id: string;
  patientNo: string; // e.g. "PT-2024-001"
  firstName: string;
  lastName: string;
  gender: "M" | "F" | "Other";
  dateOfBirth: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  city: string;
  nationalId?: string;
  insuranceProviderId?: string;
  insurancePolicyNo?: string;
  insuranceCoveragePercent?: number;
  lastVisit?: string;
  nextVisit?: string;
  balance: number; // in HTG
  status: "Active" | "Inactive" | "Archived";
  notes?: string;
  // Medical History
  medicalHistory: {
    ocularHistory: string[];
    systemicHistory: {
      diabetes: boolean;
      hypertension: boolean;
      cardiac: boolean;
      autoimmune: boolean;
      other?: string;
    };
    familyOcularHistory: string[];
    currentMedications: string[];
    allergies: string[];
    contactLensWearer: boolean;
    contactLensType?: string;
    smoker: boolean;
    lastEyeExamDate?: string;
  };
}

export type AppointmentStatus =
  | "Booked"
  | "Confirmed"
  | "Checked in"
  | "Waiting"
  | "In consultation"
  | "Completed"
  | "Cancelled"
  | "No-show";

export type VisitType =
  | "Routine Check (20m)"
  | "Full Exam (45m)"
  | "Contact Lens Fitting (40m)"
  | "Emergency"
  | "Follow-up (15m)"
  | "Frame Selection & Dispense (30m)";

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  visitType: VisitType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  room: string;
  status: AppointmentStatus;
  notes?: string;
  checkedInAt?: string;
  remindersSent: {
    channel: "SMS" | "WhatsApp" | "Email";
    sentAt: string;
    status: "Delivered" | "Sent" | "Failed";
  }[];
}

export interface EyeRefraction {
  sph: string;
  cyl: string;
  axis: string;
  add?: string;
  prism?: string;
  base?: string;
  vaDistance: string; // e.g. 20/20, 20/40
  vaNear: string; // e.g. J1, J2
  vaPinhole?: string;
}

export interface Consultation {
  id: string;
  consultationNo: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  chiefComplaint: string;
  // Refraction Data
  visualAcuity: {
    odUncorrectedDistance: string;
    osUncorrectedDistance: string;
    odUncorrectedNear: string;
    osUncorrectedNear: string;
    odCorrectedDistance: string;
    osCorrectedDistance: string;
    odCorrectedNear: string;
    osCorrectedNear: string;
    odPinhole?: string;
    osPinhole?: string;
  };
  objectiveRefraction: {
    od: EyeRefraction;
    os: EyeRefraction;
  };
  subjectiveRefraction: {
    od: EyeRefraction;
    os: EyeRefraction;
  };
  keratometry: {
    odK1: string;
    odK2: string;
    odAxis: string;
    osK1: string;
    osK2: string;
    osAxis: string;
  };
  iop: {
    od: number; // mmHg
    os: number; // mmHg
    method: "Goldmann" | "Non-Contact (Air-Puff)" | "Tonopen" | "iCare";
    timeTaken: string;
  };
  slitLamp: {
    lids: string;
    conjunctiva: string;
    cornea: string;
    anteriorChamber: string;
    lens: string;
    iris: string;
  };
  fundus: {
    disc: string;
    macula: string;
    vessels: string;
    cdRatioOd: string; // e.g. 0.3
    cdRatioOs: string; // e.g. 0.3
    periphery: string;
  };
  motilityAndBinocular: {
    motility: string;
    coverTest: string;
    stereopsis: string;
    npc: string;
  };
  specialTests: {
    colorVisionIshihara: string; // e.g. 14/14
    visualField: string;
  };
  diagnosis: {
    icd10Code: string;
    icd10Description: string;
    notes: string;
  }[];
  treatmentPlan: string;
  followUpDate?: string;
  attachments: {
    id: string;
    type: "OCT" | "Fundus Photo" | "Visual Field" | "Corneal Topography";
    title: string;
    date: string;
    thumbnailUrl?: string;
  }[];
  isSigned: boolean;
  signedBy?: string;
  signedAt?: string;
}

export type PrescriptionType = "Spectacles" | "Contact Lenses" | "Medication";

export interface SpectaclePrescription {
  type: "Spectacles";
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  validUntil: string;
  od: {
    sph: string;
    cyl: string;
    axis: string;
    add: string;
    prism: string;
    base: string;
    pdMono: string;
  };
  os: {
    sph: string;
    cyl: string;
    axis: string;
    add: string;
    prism: string;
    base: string;
    pdMono: string;
  };
  pdTotal: string;
  segmentHeight?: string;
  lensType: "Single Vision" | "Bifocal" | "Progressive" | "Occupational / Office";
  material: "CR-39 (1.50)" | "Polycarbonate (1.59)" | "Hi-Index 1.60" | "Hi-Index 1.67" | "Hi-Index 1.74" | "Trivex";
  coatings: string[]; // e.g. ["Anti-Reflective Premium", "Blue Light Filter", "Photochromic Gray", "Hydrophobic"]
  usage: "Constant" | "Distance Only" | "Reading Only" | "Computer / VDU";
  notes?: string;
}

export interface ContactLensPrescription {
  type: "Contact Lenses";
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  validUntil: string;
  brand: string;
  modality: "Daily Disposable" | "Bi-Weekly" | "Monthly" | "Toric Monthly" | "Multifocal Monthly" | "RGP (Rigid Gas Permeable)";
  od: {
    bc: string; // Base Curve e.g. 8.5
    dia: string; // Diameter e.g. 14.2
    power: string; // SPH e.g. -3.25
    cyl?: string;
    axis?: string;
    add?: string;
  };
  os: {
    bc: string;
    dia: string;
    power: string;
    cyl?: string;
    axis?: string;
    add?: string;
  };
  careSolution: string;
  wearingSchedule: string;
  notes?: string;
}

export interface MedicationPrescription {
  type: "Medication";
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  validUntil: string;
  items: {
    drugName: string;
    dose: string;
    form: "Eye Drops (Solution)" | "Eye Drops (Suspension)" | "Ophthalmic Ointment" | "Oral Tablets" | "Eye Gel";
    posology: string; // e.g. 1 drop in affected eye TID for 7 days
    duration: string;
    refills: number;
    substitutionAllowed: boolean;
  }[];
  instructions: string;
}

export type Prescription = SpectaclePrescription | ContactLensPrescription | MedicationPrescription;

export type LabJobStatus =
  | "Ordered"
  | "At lab"
  | "Received"
  | "Edged & mounted"
  | "QC"
  | "Ready"
  | "Delivered";

export interface LabJobOrder {
  id: string;
  orderNo: string;
  patientId: string;
  patientName: string;
  prescriptionId: string;
  prescriptionNumber: string;
  frameSku: string;
  frameName: string;
  lensSpec: {
    type: string;
    material: string;
    coatings: string[];
    odPower: string;
    osPower: string;
  };
  fittingMeasurements: {
    pupilHeightOd: string;
    pupilHeightOs: string;
    pdOd: string;
    pdOs: string;
    pantoscopicTilt: string;
    vertexDistance: string;
    wrapAngle: string;
  };
  externalLabName: string;
  technicianAssigned: string;
  orderDate: string;
  promisedDate: string;
  completedDate?: string;
  status: LabJobStatus;
  isDelayed: boolean;
  priority: "Standard" | "Urgent" | "VIP";
  notes?: string;
  afterSales?: {
    type: "Adjustment" | "Warranty Replacement" | "Lab Return & Remake";
    reportedDate: string;
    resolvedDate?: string;
    reason: string;
    status: "Open" | "In Progress" | "Resolved";
  }[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "Frames" | "Lenses" | "Contact Lenses" | "Solutions & Care" | "Accessories";
  brand: string;
  model?: string;
  color?: string;
  size?: string; // e.g. "52-18-140"
  gender?: "Unisex" | "Men" | "Women" | "Kids";
  material?: string;
  costPriceHTG: number;
  retailPriceHTG: number;
  stockQty: number;
  minStockLevel: number;
  location: string; // e.g. "Display Case A3", "Storage Bin 12"
  barcode?: string;
  imageUrl?: string;
  lastRestocked?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  type: "Sale" | "Restock" | "Return" | "Adjustment" | "Damage";
  quantity: number;
  referenceNo?: string;
  performedBy: string;
  notes?: string;
}

export type InvoiceStatus = "Draft" | "Unpaid" | "Partial" | "Paid" | "Overdue" | "Cancelled";
export type DocumentType = "Quote" | "Invoice" | "Receipt" | "Credit Note";

export interface InvoiceLineItem {
  id: string;
  description: string;
  category: "Clinical Act" | "Frame" | "Lenses" | "Coatings" | "Contact Lenses" | "Accessories" | "Service";
  quantity: number;
  unitPriceHTG: number;
  discountHTG: number;
  taxPercent: number;
  totalHTG: number;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  amountHTG: number;
  amountUSD?: number;
  exchangeRateUsed: number;
  currency: Currency;
  method: "Cash" | "Credit Card" | "Debit Card" | "MonCash" | "Bank Transfer" | "Cheque";
  referenceNo?: string;
  cashierName: string;
  type: "Payment" | "Deposit" | "Refund";
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  documentType: DocumentType;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAddress?: string;
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotalHTG: number;
  taxTotalHTG: number;
  discountTotalHTG: number;
  totalHTG: number;
  // Insurance split
  insurerId?: string;
  insurerName?: string;
  insurerShareHTG: number;
  patientShareHTG: number;
  status: InvoiceStatus;
  payments: PaymentTransaction[];
  amountPaidHTG: number;
  balanceDueHTG: number;
  notes?: string;
  installmentPlan?: {
    enabled: boolean;
    installments: {
      number: number;
      dueDate: string;
      amountHTG: number;
      isPaid: boolean;
      paidAt?: string;
    }[];
  };
}

export interface InsuranceClaim {
  id: string;
  claimNo: string;
  insurerId: string;
  insurerName: string;
  patientId: string;
  patientName: string;
  policyNo: string;
  preAuthNo?: string;
  invoiceId: string;
  invoiceNo: string;
  submissionDate: string;
  claimAmountHTG: number;
  approvedAmountHTG?: number;
  status: "Draft" | "Submitted" | "Approved" | "Paid" | "Rejected";
  rejectionReason?: string;
  paymentDate?: string;
  notes?: string;
}

export interface Insurer {
  id: string;
  name: string;
  code: string;
  contactEmail: string;
  contactPhone: string;
  standardCoveragePercent: number;
  spectacleAllowanceHTG: number;
  requiresPreAuth: boolean;
  claimsCount: number;
  totalReceivablesHTG: number;
}

export interface CashRegisterSession {
  id: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingFloatHTG: number;
  openingFloatUSD: number;
  expectedCashHTG: number;
  actualCashHTG?: number;
  expectedCashUSD: number;
  actualCashUSD?: number;
  varianceHTG?: number;
  varianceUSD?: number;
  status: "Open" | "Closed";
  transactionsCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}
