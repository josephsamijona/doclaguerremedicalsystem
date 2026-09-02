import { Consultation } from "@/src/types";
import { mockPatients } from "./patients";
import { mockPractitioners } from "./practitioners";

export const icd10OpticalList = [
  { code: "H52.13", desc: "Myopia, bilateral" },
  { code: "H52.223", desc: "Regular astigmatism, bilateral" },
  { code: "H52.4", desc: "Presbyopia" },
  { code: "H52.03", desc: "Hypermetropia, bilateral" },
  { code: "H52.203", desc: "Unspecified astigmatism, bilateral" },
  { code: "H40.11X1", desc: "Primary open-angle glaucoma, mild stage" },
  { code: "H40.013", desc: "Open angle with borderline findings, high risk, bilateral" },
  { code: "H25.13", desc: "Age-related nuclear cataract, bilateral" },
  { code: "H04.123", desc: "Dry eye syndrome of bilateral lacrimal glands" },
  { code: "H10.13", desc: "Acute atopic conjunctivitis, bilateral" },
  { code: "H53.143", desc: "Visual discomfort (Asthenopia / digital strain), bilateral" },
  { code: "E11.319", desc: "Type 2 diabetes mellitus with unspecified diabetic retinopathy without macular edema" },
  { code: "H52.31", desc: "Anisometropia" },
  { code: "H53.003", desc: "Unspecified amblyopia, bilateral" },
];

export const mockConsultations: Consultation[] = [];

// Generate ~60 comprehensive consultation records
for (let i = 0; i < 60; i++) {
  const patient = mockPatients[i % mockPatients.length];
  const practitioner = mockPractitioners[i % mockPractitioners.length];
  const dayOffset = Math.floor(i / 2);
  const dateStr = i === 0 ? "2026-09-02" : `2026-08-${String(Math.max(1, 31 - dayOffset)).padStart(2, "0")}`;

  // Spheres between -6.00 and +4.00
  const sphValues = ["-5.75", "-3.50", "-2.25", "-1.50", "-0.75", "+0.50", "+1.25", "+2.00", "+3.25", "+4.00"];
  const cylValues = ["-0.50", "-0.75", "-1.25", "-1.75", "-2.00", "0.00"];
  const axisValues = ["180", "175", "90", "85", "10", "15", "165"];
  const addValues = ["+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50"];

  const odSph = sphValues[(i * 3) % sphValues.length];
  const osSph = sphValues[(i * 3 + 1) % sphValues.length];
  const cyl = cylValues[i % cylValues.length];
  const axis = axisValues[i % axisValues.length];
  const add = patient.age >= 42 ? addValues[(patient.age - 42) % addValues.length] : "";

  const iopOd = 12 + (i % 11);
  const iopOs = 12 + ((i + 1) % 10);
  const cdRatio = (0.2 + (i % 5) * 0.1).toFixed(1);

  const icd = icd10OpticalList[i % icd10OpticalList.length];
  const isPresbyopic = patient.age >= 42;

  mockConsultations.push({
    id: `CNS-2024-${String(i + 1).padStart(3, "0")}`,
    consultationNo: `EXAM-2026-${String(i + 1).padStart(4, "0")}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    practitionerId: practitioner.id,
    practitionerName: practitioner.name,
    date: dateStr,
    chiefComplaint: i % 4 === 0
      ? "Blurry vision at distance and digital screen fatigue after 4 hours of computer use."
      : i % 4 === 1
      ? "Difficulty reading small print and restaurant menus in low lighting (arms feel too short)."
      : i % 4 === 2
      ? "Annual routine refractive examination and contact lens renewal check."
      : "Occasional foreign body sensation, burning and mild photophobia in sunny outdoor conditions.",
    visualAcuity: {
      odUncorrectedDistance: "20/60",
      osUncorrectedDistance: "20/70",
      odUncorrectedNear: isPresbyopic ? "J5" : "J1",
      osUncorrectedNear: isPresbyopic ? "J7" : "J1",
      odCorrectedDistance: "20/20",
      osCorrectedDistance: "20/20",
      odCorrectedNear: "J1+",
      osCorrectedNear: "J1+",
      odPinhole: "20/25",
      osPinhole: "20/25",
    },
    objectiveRefraction: {
      od: {
        sph: (parseFloat(odSph) - 0.25).toFixed(2),
        cyl: cyl,
        axis: axis,
        vaDistance: "20/20",
        vaNear: "J1",
      },
      os: {
        sph: (parseFloat(osSph) - 0.25).toFixed(2),
        cyl: cyl,
        axis: axis,
        vaDistance: "20/20",
        vaNear: "J1",
      },
    },
    subjectiveRefraction: {
      od: {
        sph: odSph,
        cyl: cyl,
        axis: axis,
        add: add,
        vaDistance: "20/20",
        vaNear: "J1+",
      },
      os: {
        sph: osSph,
        cyl: cyl,
        axis: axis,
        add: add,
        vaDistance: "20/20",
        vaNear: "J1+",
      },
    },
    keratometry: {
      odK1: "43.25 @ 180",
      odK2: "44.00 @ 90",
      odAxis: "90",
      osK1: "43.50 @ 175",
      osK2: "44.25 @ 85",
      osAxis: "85",
    },
    iop: {
      od: iopOd,
      os: iopOs,
      method: "Goldmann",
      timeTaken: "09:45 AM",
    },
    slitLamp: {
      lids: "Clean lid margins, normal meibomian orifices without telangiectasia.",
      conjunctiva: "Clear and quiet, no hyperemia, trace papillae superiorly.",
      cornea: "Clear and compact, intact epithelium, no staining on sodium fluorescein.",
      anteriorChamber: "Deep and quiet, Van Herick Grade 4 bilaterally.",
      lens: patient.age > 60 ? "Trace nuclear sclerosis (Grade 1+)" : "Clear crystalline lens OU.",
      iris: "Normal architecture, round and reactive to light (PERRLA).",
    },
    fundus: {
      disc: "Pink, sharp well-defined margins, distinct neuroretinal rim.",
      macula: "Flat, good foveal reflex present, no drusen or edema.",
      vessels: "Normal caliber and A/V ratio (2:3), no crossing changes.",
      cdRatioOd: cdRatio,
      cdRatioOs: cdRatio,
      periphery: "360 degrees flat and intact, no retinal tears, holes or lattice.",
    },
    motilityAndBinocular: {
      motility: "Full range of motion in all 9 diagnostic gaze positions (FROM), no nystagmus.",
      coverTest: "Ortho at distance, 2-4 prism diopters exophoria at near with rapid recovery.",
      stereopsis: "40 arc seconds (Randot Stereo Test).",
      npc: "To the nose (< 6 cm).",
    },
    specialTests: {
      colorVisionIshihara: "14/14 plates correct OU",
      visualField: "Full to confrontation OU, no central or arcuate scotoma.",
    },
    diagnosis: [
      {
        icd10Code: icd.code,
        icd10Description: icd.desc,
        notes: "Prescribe corrective spectacle lenses with premium AR and blue blocking coating.",
      },
      ...(isPresbyopic
        ? [{ icd10Code: "H52.4", icd10Description: "Presbyopia", notes: "Add progressive addition +2.00D for near tasks." }]
        : []),
    ],
    treatmentPlan:
      "1. Prescribe updated spectacle Rx (Progressive addition with anti-reflective coating).\n2. 20-20-20 visual hygiene rule for computer work.\n3. Preservative-free artificial tears PRN for ocular lubrication.\n4. Routine eye wellness review in 12 months.",
    followUpDate: "2027-09-02",
    attachments: [
      {
        id: `ATT-${i}-1`,
        type: "OCT",
        title: "Macula & RNFL Thickness Analysis (Spectralis)",
        date: dateStr,
      },
      {
        id: `ATT-${i}-2`,
        type: "Fundus Photo",
        title: "Ultra-widefield Digital Color Retinal Photograph",
        date: dateStr,
      },
    ],
    isSigned: i > 2, // First 3 are active/editable, rest are locked/signed
    signedBy: practitioner.name,
    signedAt: `${dateStr} 10:15`,
  });
}
