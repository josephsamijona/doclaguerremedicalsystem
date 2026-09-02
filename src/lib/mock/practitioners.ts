export interface Practitioner {
  id: string;
  name: string;
  title: string;
  specialty: string;
  room: string;
  color: string;
  avatar: string;
  schedule: string;
  phone: string;
  email: string;
}

export const mockPractitioners: Practitioner[] = [
  {
    id: "PR-01",
    name: "Dr. Jean-Claude Pierre-Louis",
    title: "O.D., F.A.A.O. - Chief Optometrist",
    specialty: "Primary Eye Care, Low Vision & Glaucoma",
    room: "Examination Room 1 (Lane A)",
    color: "bg-zinc-900 text-white",
    avatar: "JPL",
    schedule: "Mon-Fri: 08:00 - 16:30",
    phone: "+509 3701-4422",
    email: "dr.pierrelouis@optiquevision.ht",
  },
  {
    id: "PR-02",
    name: "Dr. Céline Augustin",
    title: "O.D. - Senior Pediatric & Contact Lens Specialist",
    specialty: "Pediatric Optometry & Orthokeratology",
    room: "Examination Room 2 (Lane B)",
    color: "bg-zinc-800 text-white",
    avatar: "CA",
    schedule: "Mon-Sat: 08:30 - 15:00",
    phone: "+509 3812-9901",
    email: "dr.augustin@optiquevision.ht",
  },
  {
    id: "PR-03",
    name: "Dr. Frantz Delmas",
    title: "M.D. - Consultant Ophthalmologist",
    specialty: "Anterior Segment & Cataract Evaluation",
    room: "Surgical / Special Diagnostics Suite",
    color: "bg-zinc-700 text-white",
    avatar: "FD",
    schedule: "Tue, Thu, Sat: 09:00 - 17:00",
    phone: "+509 3445-1288",
    email: "dr.delmas@optiquevision.ht",
  },
  {
    id: "PR-04",
    name: "Dr. Mireille Saint-Juste",
    title: "O.D. - Refraction & Binocular Vision Specialist",
    specialty: "Vision Therapy & Digital Ergonomics",
    room: "Examination Room 3 (Lane C)",
    color: "bg-zinc-600 text-white",
    avatar: "MS",
    schedule: "Mon, Wed, Fri: 08:00 - 16:00",
    phone: "+509 3672-0044",
    email: "dr.saintjuste@optiquevision.ht",
  },
];
