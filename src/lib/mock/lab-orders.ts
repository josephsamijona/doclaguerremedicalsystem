import { LabJobOrder, LabJobStatus } from "@/src/types";
import { mockPatients } from "./patients";

const statuses: LabJobStatus[] = [
  "Ordered",
  "At lab",
  "Received",
  "Edged & mounted",
  "QC",
  "Ready",
  "Delivered",
];

const labs = [
  "Labo Optique Caraïbes (Port-au-Prince)",
  "Essilor Digital Surfacing Lab (Miami)",
  "OptoVision In-House Edging Workshop",
  "Zeiss Precision Optical Lab",
];

const frameNames = [
  "Ray-Ban Clubmaster RX5154",
  "Tom Ford FT5294 Vintage Pantos",
  "Oakley Airdrop Satin Black",
  "Gucci GG0027O Cat-Eye Acetate",
  "Silhouette TMA Icon Pure Titanium",
  "Prada Journal VPR16M",
  "Nano Vista Re-Play Siliflex Junior",
  "Carrera CA-8832 Rectangular",
];

export const mockLabOrders: LabJobOrder[] = [];

for (let i = 0; i < 35; i++) {
  const patient = mockPatients[i % mockPatients.length];
  const status = statuses[i % statuses.length];
  const isDelayed = i === 4 || i === 11 || i === 23; // Realistic delay flags
  const orderDay = Math.max(1, 28 - Math.floor(i / 2));
  const orderDate = `2026-08-${String(orderDay).padStart(2, "0")}`;
  const promisedDate = `2026-09-${String(Math.min(28, (orderDay + 6) % 30 + 1)).padStart(2, "0")}`;

  mockLabOrders.push({
    id: `JOB-${String(i + 1).padStart(3, "0")}`,
    orderNo: `LAB-2026-${String(1000 + i + 1)}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    prescriptionId: `RX-SPEC-${String((i % 50) + 1).padStart(3, "0")}`,
    prescriptionNumber: `RX-SPEC-2026-${String((i % 50) + 1).padStart(4, "0")}`,
    frameSku: `SKU-FR-${String((i % 8) + 1).padStart(3, "0")}`,
    frameName: frameNames[i % frameNames.length],
    lensSpec: {
      type: i % 2 === 0 ? "Progressive Varilux Comfort Max" : "Single Vision Aspheric",
      material: i % 3 === 0 ? "Hi-Index 1.67" : i % 3 === 1 ? "Polycarbonate 1.59" : "CR-39",
      coatings: ["Crizal Prevencia Anti-Reflective", "Blue Filter UV400", "Hydrophobic"],
      odPower: `SPH -2.50 CYL -0.75 AXIS 180 ${patient.age >= 42 ? "ADD +2.00" : ""}`,
      osPower: `SPH -2.75 CYL -0.50 AXIS 175 ${patient.age >= 42 ? "ADD +2.00" : ""}`,
    },
    fittingMeasurements: {
      pupilHeightOd: "19.5 mm",
      pupilHeightOs: "19.5 mm",
      pdOd: "31.5 mm",
      pdOs: "32.0 mm",
      pantoscopicTilt: "8°",
      vertexDistance: "12 mm",
      wrapAngle: "5°",
    },
    externalLabName: labs[i % labs.length],
    technicianAssigned: i % 2 === 0 ? "David Cherenfant" : "Pierre-Richard Noel",
    orderDate,
    promisedDate,
    completedDate: status === "Delivered" || status === "Ready" ? "2026-09-01" : undefined,
    status,
    isDelayed,
    priority: i % 10 === 0 ? "Urgent" : i % 7 === 0 ? "VIP" : "Standard",
    notes: isDelayed ? "Custom semi-finished progressive blank on customs hold at Toussaint Louverture Airport" : "Standard surfacing and beveling requested.",
    afterSales: i === 2 || i === 9 ? [
      {
        type: i === 2 ? "Adjustment" : "Warranty Replacement",
        reportedDate: "2026-09-01",
        reason: i === 2 ? "Temple tip slightly tight behind left ear; pantoscopic tilt re-adjusted." : "Patient noticed small hairline scratch on inner right lens coating.",
        status: i === 2 ? "Resolved" : "In Progress",
      }
    ] : undefined,
  });
}
