import { Appointment, AppointmentStatus, VisitType } from "@/src/types";
import { mockPatients } from "./patients";
import { mockPractitioners } from "./practitioners";

const visitTypes: VisitType[] = [
  "Routine Check (20m)",
  "Full Exam (45m)",
  "Contact Lens Fitting (40m)",
  "Emergency",
  "Follow-up (15m)",
  "Frame Selection & Dispense (30m)",
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

export const mockAppointments: Appointment[] = [];

// 1. Generate 16 realistic appointments for TODAY (2026-09-02)
const todayQueueStatuses: AppointmentStatus[] = [
  "Completed",
  "Completed",
  "In consultation",
  "In consultation",
  "Waiting",
  "Waiting",
  "Checked in",
  "Checked in",
  "Confirmed",
  "Confirmed",
  "Booked",
  "Booked",
  "Booked",
  "No-show",
  "Cancelled",
  "Confirmed",
];

todayQueueStatuses.forEach((status, idx) => {
  const patient = mockPatients[idx % mockPatients.length];
  const practitioner = mockPractitioners[idx % mockPractitioners.length];
  const startTime = timeSlots[idx % timeSlots.length];
  const [h, m] = startTime.split(":").map(Number);
  const endMinutes = m + (idx % 2 === 0 ? 45 : 30);
  const endTime = `${String(h + Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

  mockAppointments.push({
    id: `APT-20260902-${String(idx + 1).padStart(3, "0")}`,
    appointmentNo: `AP-2026-0902-${String(idx + 1).padStart(3, "0")}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    practitionerId: practitioner.id,
    practitionerName: practitioner.name,
    visitType: visitTypes[idx % visitTypes.length],
    date: "2026-09-02",
    startTime,
    endTime,
    durationMinutes: idx % 2 === 0 ? 45 : 30,
    room: practitioner.room.split(" ")[0] + " " + practitioner.room.split(" ")[1],
    status,
    notes: idx % 3 === 0 ? "Patient requested English / French consultation sheet" : "Annual checkup",
    checkedInAt: ["Checked in", "Waiting", "In consultation", "Completed"].includes(status) ? `${startTime}` : undefined,
    remindersSent: [
      { channel: "WhatsApp", sentAt: "2026-09-01 09:00", status: "Delivered" },
      { channel: "SMS", sentAt: "2026-09-02 07:15", status: "Delivered" },
    ],
  });
});

// 2. Generate Past Appointments (2026-08-01 through 2026-09-01) ~65 records
for (let day = 1; day <= 31; day++) {
  const dateStr = `2026-08-${String(day).padStart(2, "0")}`;
  for (let slot = 0; slot < 2; slot++) {
    const patientIdx = (day * 3 + slot) % mockPatients.length;
    const patient = mockPatients[patientIdx];
    const practitioner = mockPractitioners[(day + slot) % mockPractitioners.length];
    const status: AppointmentStatus = (day + slot) % 11 === 0 ? "No-show" : (day + slot) % 15 === 0 ? "Cancelled" : "Completed";

    mockAppointments.push({
      id: `APT-202608-${String(day).padStart(2, "0")}-${slot + 1}`,
      appointmentNo: `AP-2026-08${String(day).padStart(2, "0")}-${slot + 1}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      practitionerId: practitioner.id,
      practitionerName: practitioner.name,
      visitType: visitTypes[(day + slot) % visitTypes.length],
      date: dateStr,
      startTime: timeSlots[(day + slot * 4) % timeSlots.length],
      endTime: timeSlots[((day + slot * 4) % timeSlots.length) + 1] || "17:00",
      durationMinutes: 45,
      room: practitioner.room,
      status,
      notes: "Follow-up consultation or routine eye examination.",
      remindersSent: [
        { channel: "WhatsApp", sentAt: `${dateStr} 08:00`, status: "Delivered" },
      ],
    });
  }
}

// 3. Generate Future Appointments (2026-09-03 to 2026-09-18) ~40 records
for (let day = 3; day <= 18; day++) {
  const dateStr = `2026-09-${String(day).padStart(2, "0")}`;
  for (let slot = 0; slot < 3; slot++) {
    const patientIdx = (day * 4 + slot) % mockPatients.length;
    const patient = mockPatients[patientIdx];
    const practitioner = mockPractitioners[(day + slot) % mockPractitioners.length];
    const status: AppointmentStatus = slot === 0 ? "Confirmed" : "Booked";

    mockAppointments.push({
      id: `APT-202609-${String(day).padStart(2, "0")}-${slot + 1}`,
      appointmentNo: `AP-2026-09${String(day).padStart(2, "0")}-${slot + 1}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      practitionerId: practitioner.id,
      practitionerName: practitioner.name,
      visitType: visitTypes[(day + slot) % visitTypes.length],
      date: dateStr,
      startTime: timeSlots[(day + slot * 3) % timeSlots.length],
      endTime: timeSlots[((day + slot * 3) % timeSlots.length) + 1] || "17:00",
      durationMinutes: 30,
      room: practitioner.room,
      status,
      notes: "Scheduled upcoming appointment.",
      remindersSent: [
        { channel: "Email", sentAt: "2026-09-01 10:00", status: "Sent" },
      ],
    });
  }
}
