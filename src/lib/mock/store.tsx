import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import {
  Patient,
  Appointment,
  AppointmentStatus,
  Consultation,
  Prescription,
  LabJobOrder,
  LabJobStatus,
  InventoryItem,
  Invoice,
  InsuranceClaim,
  UserRole,
  Currency,
  CashRegisterSession,
  AuditLog,
} from "@/src/types";
import { mockPatients } from "./patients";
import { mockAppointments } from "./appointments";
import { mockConsultations } from "./consultations";
import { mockPrescriptions } from "./prescriptions";
import { mockFrames, mockLensesAndOthers, allMockInventory, mockStockMovements } from "./inventory";
import { mockLabOrders } from "./lab-orders";
import { mockInvoices, mockCashRegister, EXCHANGE_RATE_USD_HTG } from "./invoices";
import { mockInsurers, mockClaims } from "./insurers";
import { mockClinicProfile, mockOpeningHours, mockRooms, mockRolePermissions, mockAuditLogs, ClinicProfile } from "./settings";

export type ActiveView =
  | "overview"
  | "patients"
  | "patient-detail"
  | "appointments"
  | "consultations"
  | "consultation-detail"
  | "prescriptions"
  | "prescription-detail"
  | "lab"
  | "lab-detail"
  | "inventory"
  | "billing"
  | "invoice-detail"
  | "insurance"
  | "reports"
  | "settings"
  | "patient-portal";

interface StoreContextType {
  // Navigation & Role
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedConsultationId: string | null;
  setSelectedConsultationId: (id: string | null) => void;
  selectedPrescriptionId: string | null;
  setSelectedPrescriptionId: (id: string | null) => void;
  selectedLabJobId: string | null;
  setSelectedLabJobId: (id: string | null) => void;
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;

  // Search & Global Modals
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Dev Toggles for UI States
  devEmptyState: boolean;
  setDevEmptyState: (val: boolean) => void;
  devLoadingState: boolean;
  setDevLoadingState: (val: boolean) => void;
  devErrorState: boolean;
  setDevErrorState: (val: boolean) => void;

  // Data
  patients: Patient[];
  appointments: Appointment[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  labOrders: LabJobOrder[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  claims: InsuranceClaim[];
  cashRegister: CashRegisterSession;
  clinicProfile: ClinicProfile;
  auditLogs: AuditLog[];

  // Actions
  addPatient: (patient: Partial<Patient>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addAppointment: (apt: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, startTime: string) => void;
  addConsultation: (consultation: Partial<Consultation>) => void;
  signConsultation: (id: string, practitionerName: string) => void;
  addPrescription: (rx: Prescription) => void;
  updateLabJobStatus: (id: string, status: LabJobStatus) => void;
  createLabOrder: (order: Partial<LabJobOrder>) => void;
  addInvoice: (invoice: Partial<Invoice>) => void;
  recordPayment: (invoiceId: string, amountHTG: number, currency: Currency, method: string, cashier: string) => void;
  submitClaim: (claim: Partial<InsuranceClaim>) => void;
  updateStock: (itemId: string, qtyDelta: number, reason: string) => void;
  logAction: (action: string, module: string, details: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ActiveView>("overview");
  const [currentRole, setCurrentRole] = useState<UserRole>("Admin");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>("PT-001");
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>("CNS-2024-001");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>("RX-SPEC-001");
  const [selectedLabJobId, setSelectedLabJobId] = useState<string | null>("JOB-001");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>("INV-2024-001");

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Dev state simulation toggles
  const [devEmptyState, setDevEmptyState] = useState(false);
  const [devLoadingState, setDevLoadingState] = useState(false);
  const [devErrorState, setDevErrorState] = useState(false);

  // Entities
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [labOrders, setLabOrders] = useState<LabJobOrder[]>(mockLabOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(allMockInventory);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [claims, setClaims] = useState<InsuranceClaim[]>(mockClaims);
  const [cashRegister, setCashRegister] = useState<CashRegisterSession>(mockCashRegister);
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(mockClinicProfile);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Keyboard shortcut for Cmd+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Theme synchronization
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const logAction = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      user: currentRole === "Patient" ? "Patient Self-Service" : `Staff (${currentRole})`,
      role: currentRole,
      action,
      module,
      details,
      ipAddress: "192.168.1.10",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Actions
  const addPatient = (newP: Partial<Patient>) => {
    const id = `PT-${String(patients.length + 1).padStart(3, "0")}`;
    const p: Patient = {
      id,
      patientNo: `PT-2024-${String(patients.length + 1).padStart(3, "0")}`,
      firstName: newP.firstName || "Nouveau",
      lastName: newP.lastName || "Patient",
      gender: newP.gender || "M",
      dateOfBirth: newP.dateOfBirth || "1990-01-01",
      age: newP.age || 34,
      phone: newP.phone || "+509 3000-0000",
      email: newP.email || "patient@example.ht",
      address: newP.address || "Port-au-Prince",
      city: newP.city || "Pétion-Ville",
      balance: 0,
      status: "Active",
      medicalHistory: newP.medicalHistory || {
        ocularHistory: ["Refractive error"],
        systemicHistory: { diabetes: false, hypertension: false, cardiac: false, autoimmune: false },
        familyOcularHistory: [],
        currentMedications: [],
        allergies: [],
        contactLensWearer: false,
        smoker: false,
      },
    };
    setPatients((prev) => [p, ...prev]);
    logAction("CREATE_PATIENT", "Patients", `Registered new patient ${p.firstName} ${p.lastName} (${p.patientNo})`);
    toast.success(`Patient ${p.firstName} ${p.lastName} registered successfully`);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    logAction("UPDATE_PATIENT", "Patients", `Updated details for patient ID: ${id}`);
    toast.success("Patient record updated");
  };

  const addAppointment = (apt: Partial<Appointment>) => {
    const id = `APT-${Date.now().toString().slice(-6)}`;
    const newApt: Appointment = {
      id,
      appointmentNo: `AP-2026-${Date.now().toString().slice(-4)}`,
      patientId: apt.patientId || patients[0].id,
      patientName: apt.patientName || `${patients[0].firstName} ${patients[0].lastName}`,
      practitionerId: apt.practitionerId || "PR-01",
      practitionerName: apt.practitionerName || "Dr. Jean-Claude Pierre-Louis",
      visitType: apt.visitType || "Full Exam (45m)",
      date: apt.date || "2026-09-02",
      startTime: apt.startTime || "09:00",
      endTime: apt.endTime || "09:45",
      durationMinutes: apt.durationMinutes || 45,
      room: apt.room || "Lane A (Exam Room 1)",
      status: apt.status || "Booked",
      notes: apt.notes,
      remindersSent: [
        { channel: "SMS", sentAt: "Just now", status: "Sent" }
      ],
    };
    setAppointments((prev) => [newApt, ...prev]);
    logAction("BOOK_APPOINTMENT", "Appointments", `Booked appointment for ${newApt.patientName} on ${newApt.date} at ${newApt.startTime}`);
    toast.success(`Appointment booked for ${newApt.patientName}`);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    logAction("APPOINTMENT_STATUS", "Appointments", `Updated appointment ${id} status to ${status}`);
    toast.success(`Queue status updated to "${status}"`);
  };

  const rescheduleAppointment = (id: string, date: string, startTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date, startTime } : a))
    );
    logAction("RESCHEDULE_APPOINTMENT", "Appointments", `Rescheduled appointment ${id} to ${date} at ${startTime}`);
    toast.success(`Appointment rescheduled to ${date} at ${startTime}`);
  };

  const addConsultation = (c: Partial<Consultation>) => {
    const id = `CNS-2024-${String(consultations.length + 1).padStart(3, "0")}`;
    const newC: Consultation = {
      id,
      consultationNo: `EXAM-2026-${String(consultations.length + 1).padStart(4, "0")}`,
      patientId: c.patientId || patients[0].id,
      patientName: c.patientName || `${patients[0].firstName} ${patients[0].lastName}`,
      practitionerId: c.practitionerId || "PR-01",
      practitionerName: c.practitionerName || "Dr. Jean-Claude Pierre-Louis",
      date: c.date || "2026-09-02",
      chiefComplaint: c.chiefComplaint || "Routine refraction exam",
      visualAcuity: c.visualAcuity || {
        odUncorrectedDistance: "20/40",
        osUncorrectedDistance: "20/50",
        odUncorrectedNear: "J2",
        osUncorrectedNear: "J2",
        odCorrectedDistance: "20/20",
        osCorrectedDistance: "20/20",
        odCorrectedNear: "J1+",
        osCorrectedNear: "J1+",
      },
      objectiveRefraction: c.objectiveRefraction || {
        od: { sph: "-2.00", cyl: "-0.50", axis: "180", vaDistance: "20/20", vaNear: "J1" },
        os: { sph: "-2.25", cyl: "-0.50", axis: "175", vaDistance: "20/20", vaNear: "J1" },
      },
      subjectiveRefraction: c.subjectiveRefraction || {
        od: { sph: "-2.25", cyl: "-0.50", axis: "180", vaDistance: "20/20", vaNear: "J1+" },
        os: { sph: "-2.50", cyl: "-0.50", axis: "175", vaDistance: "20/20", vaNear: "J1+" },
      },
      keratometry: c.keratometry || {
        odK1: "43.50 @ 180",
        odK2: "44.00 @ 90",
        odAxis: "90",
        osK1: "43.50 @ 175",
        osK2: "44.25 @ 85",
        osAxis: "85",
      },
      iop: c.iop || { od: 15, os: 15, method: "Goldmann", timeTaken: "10:00 AM" },
      slitLamp: c.slitLamp || {
        lids: "Normal",
        conjunctiva: "Quiet",
        cornea: "Clear",
        anteriorChamber: "Deep and quiet",
        lens: "Clear",
        iris: "Intact",
      },
      fundus: c.fundus || {
        disc: "Sharp margins",
        macula: "Normal reflex",
        vessels: "Normal",
        cdRatioOd: "0.3",
        cdRatioOs: "0.3",
        periphery: "360 flat",
      },
      motilityAndBinocular: c.motilityAndBinocular || {
        motility: "Full range",
        coverTest: "Ortho distance",
        stereopsis: "40 arc sec",
        npc: "< 6cm",
      },
      specialTests: c.specialTests || {
        colorVisionIshihara: "14/14",
        visualField: "Full to confrontation",
      },
      diagnosis: c.diagnosis || [
        { icd10Code: "H52.13", icd10Description: "Myopia, bilateral", notes: "Corrective lenses" }
      ],
      treatmentPlan: c.treatmentPlan || "Prescribed updated spectacles. Follow up in 1 year.",
      attachments: [],
      isSigned: false,
    };
    setConsultations((prev) => [newC, ...prev]);
    setSelectedConsultationId(newC.id);
    logAction("CREATE_CONSULTATION", "Consultations", `Created consultation record ${newC.consultationNo} for ${newC.patientName}`);
    toast.success(`Consultation ${newC.consultationNo} saved`);
  };

  const signConsultation = (id: string, practitionerName: string) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isSigned: true,
              signedBy: practitionerName,
              signedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
            }
          : c
      )
    );
    logAction("SIGN_CONSULTATION", "Consultations", `Consultation ${id} officially signed and locked by ${practitionerName}`);
    toast.success("Consultation signed and locked successfully");
  };

  const addPrescription = (rx: Prescription) => {
    setPrescriptions((prev) => [rx, ...prev]);
    setSelectedPrescriptionId(rx.id);
    logAction("CREATE_PRESCRIPTION", "Prescriptions", `Issued ${rx.type} prescription ${rx.rxNumber} for ${rx.patientName}`);
    toast.success(`${rx.type} Prescription created successfully`);
  };

  const updateLabJobStatus = (id: string, status: LabJobStatus) => {
    setLabOrders((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status, completedDate: status === "Delivered" ? "2026-09-02" : j.completedDate } : j))
    );
    logAction("UPDATE_LAB_ORDER", "Lab & Workshop", `Job order ${id} status moved to ${status}`);
    toast.success(`Lab Job moved to ${status}`);
  };

  const createLabOrder = (order: Partial<LabJobOrder>) => {
    const id = `JOB-${String(labOrders.length + 1).padStart(3, "0")}`;
    const newJob: LabJobOrder = {
      id,
      orderNo: `LAB-2026-${String(1000 + labOrders.length + 1)}`,
      patientId: order.patientId || patients[0].id,
      patientName: order.patientName || `${patients[0].firstName} ${patients[0].lastName}`,
      prescriptionId: order.prescriptionId || "RX-SPEC-001",
      prescriptionNumber: order.prescriptionNumber || "RX-SPEC-2026-0001",
      frameSku: order.frameSku || "RB-5154-2000",
      frameName: order.frameName || "Ray-Ban Clubmaster RX5154",
      lensSpec: order.lensSpec || {
        type: "Progressive Varilux",
        material: "Hi-Index 1.67",
        coatings: ["Anti-Reflective", "Blue Filter"],
        odPower: "SPH -2.50 CYL -0.50 AXIS 180",
        osPower: "SPH -2.75 CYL -0.50 AXIS 175",
      },
      fittingMeasurements: order.fittingMeasurements || {
        pupilHeightOd: "19.5 mm",
        pupilHeightOs: "19.5 mm",
        pdOd: "31.5 mm",
        pdOs: "32.0 mm",
        pantoscopicTilt: "8°",
        vertexDistance: "12 mm",
        wrapAngle: "5°",
      },
      externalLabName: order.externalLabName || "OptoVision In-House Edging Workshop",
      technicianAssigned: order.technicianAssigned || "David Cherenfant",
      orderDate: "2026-09-02",
      promisedDate: "2026-09-08",
      status: "Ordered",
      isDelayed: false,
      priority: order.priority || "Standard",
      notes: order.notes,
    };
    setLabOrders((prev) => [newJob, ...prev]);
    setSelectedLabJobId(newJob.id);
    logAction("CREATE_LAB_ORDER", "Lab & Workshop", `Created lab order ${newJob.orderNo} for ${newJob.patientName}`);
    toast.success(`Lab Order ${newJob.orderNo} created`);
  };

  const addInvoice = (inv: Partial<Invoice>) => {
    const id = `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`;
    const newInv: Invoice = {
      id,
      invoiceNo: `INV-2026-${String(invoices.length + 1).padStart(4, "0")}`,
      documentType: inv.documentType || "Invoice",
      patientId: inv.patientId || patients[0].id,
      patientName: inv.patientName || `${patients[0].firstName} ${patients[0].lastName}`,
      patientPhone: inv.patientPhone || patients[0].phone,
      patientAddress: inv.patientAddress || patients[0].address,
      date: "2026-09-02",
      dueDate: "2026-09-16",
      items: inv.items || [
        {
          id: "item-1",
          description: "Consultation and Frame Dispense",
          category: "Frame",
          quantity: 1,
          unitPriceHTG: 18500,
          discountHTG: 0,
          taxPercent: 10,
          totalHTG: 20350,
        },
      ],
      subtotalHTG: inv.subtotalHTG || 18500,
      taxTotalHTG: inv.taxTotalHTG || 1850,
      discountTotalHTG: 0,
      totalHTG: inv.totalHTG || 20350,
      insurerId: inv.insurerId,
      insurerName: inv.insurerName,
      insurerShareHTG: inv.insurerShareHTG || 0,
      patientShareHTG: inv.patientShareHTG || 20350,
      status: "Unpaid",
      payments: [],
      amountPaidHTG: 0,
      balanceDueHTG: inv.patientShareHTG || 20350,
      notes: inv.notes,
    };
    setInvoices((prev) => [newInv, ...prev]);
    setSelectedInvoiceId(newInv.id);
    logAction("CREATE_INVOICE", "Billing", `Generated invoice ${newInv.invoiceNo} for ${newInv.patientName}`);
    toast.success(`Invoice ${newInv.invoiceNo} generated`);
  };

  const recordPayment = (
    invoiceId: string,
    amountHTG: number,
    currency: Currency,
    method: string,
    cashier: string
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.amountPaidHTG + amountHTG;
        const newBalance = Math.max(0, inv.patientShareHTG - newPaid);
        const newStatus = newBalance === 0 ? "Paid" : "Partial";
        const newPmt = {
          id: `PMT-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().slice(0, 10),
          amountHTG,
          amountUSD: currency === "USD" ? Math.round((amountHTG / EXCHANGE_RATE_USD_HTG) * 100) / 100 : undefined,
          exchangeRateUsed: EXCHANGE_RATE_USD_HTG,
          currency,
          method: method as any,
          referenceNo: `TRX-${Date.now().toString().slice(-5)}`,
          cashierName: cashier,
          type: "Payment" as const,
        };

        return {
          ...inv,
          amountPaidHTG: newPaid,
          balanceDueHTG: newBalance,
          status: newStatus,
          payments: [newPmt, ...inv.payments],
        };
      })
    );
    logAction("RECORD_PAYMENT", "Billing", `Received payment ${amountHTG} HTG via ${method} for invoice ${invoiceId}`);
    toast.success(`Payment of ${amountHTG.toLocaleString()} HTG recorded successfully`);
  };

  const submitClaim = (claim: Partial<InsuranceClaim>) => {
    const id = `CLM-2024-${String(claims.length + 1).padStart(3, "0")}`;
    const newClaim: InsuranceClaim = {
      id,
      claimNo: `CLM-2026-${String(claims.length + 1).padStart(4, "0")}`,
      insurerId: claim.insurerId || "INS-01",
      insurerName: claim.insurerName || "OFATMA",
      patientId: claim.patientId || patients[0].id,
      patientName: claim.patientName || `${patients[0].firstName} ${patients[0].lastName}`,
      policyNo: claim.policyNo || "POL-9921",
      preAuthNo: claim.preAuthNo,
      invoiceId: claim.invoiceId || invoices[0].id,
      invoiceNo: claim.invoiceNo || invoices[0].invoiceNo,
      submissionDate: "2026-09-02",
      claimAmountHTG: claim.claimAmountHTG || 14000,
      status: "Submitted",
      notes: claim.notes,
    };
    setClaims((prev) => [newClaim, ...prev]);
    logAction("SUBMIT_CLAIM", "Insurance", `Submitted insurance claim ${newClaim.claimNo} to ${newClaim.insurerName}`);
    toast.success(`Claim ${newClaim.claimNo} submitted to ${newClaim.insurerName}`);
  };

  const updateStock = (itemId: string, qtyDelta: number, reason: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, stockQty: Math.max(0, item.stockQty + qtyDelta) }
          : item
      )
    );
    logAction("UPDATE_STOCK", "Inventory", `Adjusted stock for item ${itemId} by ${qtyDelta} (${reason})`);
    toast.success(`Inventory stock adjusted (${qtyDelta > 0 ? "+" : ""}${qtyDelta})`);
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentRole,
        setCurrentRole,
        selectedPatientId,
        setSelectedPatientId,
        selectedConsultationId,
        setSelectedConsultationId,
        selectedPrescriptionId,
        setSelectedPrescriptionId,
        selectedLabJobId,
        setSelectedLabJobId,
        selectedInvoiceId,
        setSelectedInvoiceId,
        commandPaletteOpen,
        setCommandPaletteOpen,
        theme,
        toggleTheme,
        devEmptyState,
        setDevEmptyState,
        devLoadingState,
        setDevLoadingState,
        devErrorState,
        setDevErrorState,
        patients,
        appointments,
        consultations,
        prescriptions,
        labOrders,
        inventory,
        invoices,
        claims,
        cashRegister,
        clinicProfile,
        auditLogs,
        addPatient,
        updatePatient,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        addConsultation,
        signConsultation,
        addPrescription,
        updateLabJobStatus,
        createLabOrder,
        addInvoice,
        recordPayment,
        submitClaim,
        updateStock,
        logAction,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
