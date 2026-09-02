import {
  Prescription,
  SpectaclePrescription,
  ContactLensPrescription,
  MedicationPrescription,
} from "@/src/types";
import { mockPatients } from "./patients";
import { mockPractitioners } from "./practitioners";

export const mockPrescriptions: Prescription[] = [];

// 1. Generate ~50 Spectacle Prescriptions
for (let i = 0; i < 50; i++) {
  const patient = mockPatients[i % mockPatients.length];
  const practitioner = mockPractitioners[i % mockPractitioners.length];
  const isPresbyopic = patient.age >= 42;
  const sphList = ["-5.50", "-3.75", "-2.25", "-1.50", "-0.75", "+1.00", "+1.75", "+2.50", "+3.50"];
  const addList = ["+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50"];

  const specRx: SpectaclePrescription = {
    type: "Spectacles",
    id: `RX-SPEC-${String(i + 1).padStart(3, "0")}`,
    rxNumber: `RX-SPEC-2026-${String(i + 1).padStart(4, "0")}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    practitionerId: practitioner.id,
    practitionerName: practitioner.name,
    date: i === 0 ? "2026-09-02" : `2026-08-${String(Math.max(1, 30 - Math.floor(i / 2))).padStart(2, "0")}`,
    validUntil: "2028-09-02",
    od: {
      sph: sphList[(i * 2) % sphList.length],
      cyl: i % 3 === 0 ? "-0.75" : i % 3 === 1 ? "-1.25" : "0.00",
      axis: i % 3 === 2 ? "" : "180",
      add: isPresbyopic ? addList[(patient.age - 42) % addList.length] : "",
      prism: i % 8 === 0 ? "1.5" : "",
      base: i % 8 === 0 ? "BI" : "",
      pdMono: "31.5",
    },
    os: {
      sph: sphList[(i * 2 + 1) % sphList.length],
      cyl: i % 3 === 0 ? "-0.75" : i % 3 === 1 ? "-1.00" : "0.00",
      axis: i % 3 === 2 ? "" : "175",
      add: isPresbyopic ? addList[(patient.age - 42) % addList.length] : "",
      prism: i % 8 === 0 ? "1.5" : "",
      base: i % 8 === 0 ? "BO" : "",
      pdMono: "31.5",
    },
    pdTotal: "63.0",
    segmentHeight: isPresbyopic ? "18.5 mm" : undefined,
    lensType: isPresbyopic ? "Progressive" : "Single Vision",
    material: i % 4 === 0 ? "Hi-Index 1.67" : i % 4 === 1 ? "Polycarbonate (1.59)" : "CR-39 (1.50)",
    coatings: [
      "Anti-Reflective Premium (Crizal Prevencia)",
      "Blue Light Filter / UV400",
      ...(i % 2 === 0 ? ["Photochromic Gray (Transitions Gen S)"] : ["Hydrophobic & Oleophobic"]),
    ],
    usage: isPresbyopic ? "Constant" : i % 2 === 0 ? "Distance Only" : "Computer / VDU",
    notes: "Patient prefers lightweight aspheric design with clean edge polish.",
  };

  mockPrescriptions.push(specRx);
}

// 2. Generate ~18 Contact Lens Prescriptions
for (let i = 0; i < 18; i++) {
  const patient = mockPatients[(i * 2 + 1) % mockPatients.length];
  const practitioner = mockPractitioners[(i + 1) % mockPractitioners.length];
  const brands = [
    "Acuvue Oasys 1-Day",
    "Dailies Total1 (Alcon)",
    "Biofinity Toric (CooperVision)",
    "Air Optix Plus HydraGlyde",
    "Bausch + Lomb ULTRA",
  ];
  const modalities: ContactLensPrescription["modality"][] = [
    "Daily Disposable",
    "Daily Disposable",
    "Toric Monthly",
    "Monthly",
    "Bi-Weekly",
  ];

  const clRx: ContactLensPrescription = {
    type: "Contact Lenses",
    id: `RX-CL-${String(i + 1).padStart(3, "0")}`,
    rxNumber: `RX-CL-2026-${String(i + 1).padStart(4, "0")}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    practitionerId: practitioner.id,
    practitionerName: practitioner.name,
    date: `2026-08-${String(Math.max(1, 28 - i)).padStart(2, "0")}`,
    validUntil: "2027-08-28",
    brand: brands[i % brands.length],
    modality: modalities[i % modalities.length],
    od: {
      bc: "8.5",
      dia: "14.2",
      power: "-3.25",
      cyl: i % 3 === 0 ? "-0.75" : undefined,
      axis: i % 3 === 0 ? "180" : undefined,
    },
    os: {
      bc: "8.5",
      dia: "14.2",
      power: "-3.50",
      cyl: i % 3 === 0 ? "-0.75" : undefined,
      axis: i % 3 === 0 ? "170" : undefined,
    },
    careSolution: "Opti-Free PureMoist Multi-Purpose Solution",
    wearingSchedule: "Daily wear, maximum 12 hours/day. Do NOT sleep in lenses.",
    notes: "Follow-up fluorescein evaluation showed excellent centration and 0.5mm movement on blink.",
  };

  mockPrescriptions.push(clRx);
}

// 3. Generate ~15 Medication Prescriptions
for (let i = 0; i < 15; i++) {
  const patient = mockPatients[(i * 3 + 2) % mockPatients.length];
  const practitioner = mockPractitioners[(i + 2) % mockPractitioners.length];

  const medRx: MedicationPrescription = {
    type: "Medication",
    id: `RX-MED-${String(i + 1).padStart(3, "0")}`,
    rxNumber: `RX-MED-2026-${String(i + 1).padStart(4, "0")}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    practitionerId: practitioner.id,
    practitionerName: practitioner.name,
    date: `2026-08-${String(Math.max(1, 29 - i)).padStart(2, "0")}`,
    validUntil: "2026-11-29",
    items: [
      {
        drugName: i % 3 === 0 ? "Latanoprost 0.005% (Xalatan)" : i % 3 === 1 ? "Systane Hydration PF" : "Tobramycin 0.3% / Dexamethasone 0.1% (Tobradex)",
        dose: i % 3 === 0 ? "1 drop QHS" : i % 3 === 1 ? "1 drop 4x/day" : "1 drop TID",
        form: i % 3 === 0 ? "Eye Drops (Solution)" : i % 3 === 1 ? "Eye Drops (Solution)" : "Eye Drops (Suspension)",
        posology: i % 3 === 0 ? "Instill 1 drop into both eyes at bedtime every night" : i % 3 === 1 ? "Instill 1 drop into both eyes as needed for lubrication" : "Instill 1 drop in affected eye for 7 days then taper",
        duration: i % 3 === 2 ? "7 Days" : "90 Days",
        refills: i % 3 === 2 ? 0 : 3,
        substitutionAllowed: true,
      },
    ],
    instructions: "Store in cool place. Discard open bottle after 28 days.",
  };

  mockPrescriptions.push(medRx);
}
