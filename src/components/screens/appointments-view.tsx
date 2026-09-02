import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  MoreVertical,
  Check,
  X,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Appointment, AppointmentStatus } from "@/src/types";
import { mockPractitioners } from "@/src/lib/mock/practitioners";
import { mockRooms } from "@/src/lib/mock/settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { toast } from "sonner";

export function AppointmentsView() {
  const {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    patients,
    setSelectedPatientId,
    setCurrentView,
    devEmptyState,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"calendar" | "queue" | "reminders">("calendar");
  const [calendarView, setCalendarView] = useState<"Day" | "Week" | "Month">("Day");
  const [selectedDate, setSelectedDate] = useState("2026-09-02");
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [targetAppointment, setTargetAppointment] = useState<Appointment | null>(null);

  // New Booking State
  const [bookPatientId, setBookPatientId] = useState(patients[0]?.id || "PT-001");
  const [bookPractitionerId, setBookPractitionerId] = useState("PR-01");
  const [bookVisitType, setBookVisitType] = useState("Comprehensive Eye Exam");
  const [bookRoom, setBookRoom] = useState("Lane A (Exam Room 1)");
  const [bookDate, setBookDate] = useState("2026-09-02");
  const [bookStartTime, setBookStartTime] = useState("10:00");
  const [bookNotes, setBookNotes] = useState("");

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState("2026-09-02");
  const [rescheduleTime, setRescheduleTime] = useState("11:00");

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "13:00", "13:30", "14:00",
    "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === bookPatientId);
    const practitioner = mockPractitioners.find((p) => p.id === bookPractitionerId);

    // Collision check
    const collision = appointments.some(
      (a) =>
        a.date === bookDate &&
        a.startTime === bookStartTime &&
        a.practitionerId === bookPractitionerId &&
        a.status !== "Cancelled"
    );

    if (collision) {
      toast.error(`Slot collision: ${practitioner?.name} is already booked at ${bookStartTime}`);
      return;
    }

    addAppointment({
      patientId: bookPatientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Walk-in Patient",
      practitionerId: bookPractitionerId,
      practitionerName: practitioner?.name || "Dr. Jean-Claude Pierre-Louis",
      visitType: bookVisitType,
      date: bookDate,
      startTime: bookStartTime,
      endTime: "10:45",
      durationMinutes: 45,
      room: bookRoom,
      status: "Booked",
      notes: bookNotes,
    });

    setBookModalOpen(false);
  };

  const handleRescheduleSubmit = () => {
    if (!targetAppointment) return;
    rescheduleAppointment(targetAppointment.id, rescheduleDate, rescheduleTime);
    setRescheduleModalOpen(false);
  };

  const statusColumns: AppointmentStatus[] = [
    "Booked",
    "Confirmed",
    "Checked in",
    "Waiting",
    "In consultation",
    "Completed",
    "No-show",
  ];

  const filteredDayAppointments = appointments.filter((a) => a.date === selectedDate);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Appointments & Queue</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Manage multi-lane practitioner agendas, waiting room flows, and automated SMS reminders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setBookModalOpen(true)} size="sm" className="text-xs">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Book Appointment
          </Button>
        </div>
      </div>

      {/* Main Tabs: Calendar vs Queue vs Reminders */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="calendar">Lane Calendar</TabsTrigger>
            <TabsTrigger value="queue">
              Live Queue Board ({filteredDayAppointments.filter((a) => a.status !== "Completed" && a.status !== "No-show").length})
            </TabsTrigger>
            <TabsTrigger value="reminders">Automated Reminders</TabsTrigger>
          </TabsList>

          {activeTab === "calendar" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-50 dark:bg-zinc-900">
                {(["Day", "Week", "Month"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setCalendarView(view)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      calendarView === view
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-8 text-xs w-36"
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: CALENDAR (Multi-Lane Grid) */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-x-auto shadow-xs">
            <div className="min-w-[850px]">
              {/* Lane Header */}
              <div className="grid grid-cols-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold py-3 px-4">
                <div className="text-zinc-400">Time Slot</div>
                {mockPractitioners.map((pr) => (
                  <div key={pr.id} className="text-center">
                    <span className="block text-black dark:text-white">{pr.name}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">{pr.specialty}</span>
                  </div>
                ))}
              </div>

              {/* Time Slots Rows */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {timeSlots.map((slot) => (
                  <div key={slot} className="grid grid-cols-5 min-h-[56px] text-xs">
                    {/* Time Label */}
                    <div className="p-3 font-mono text-[11px] text-zinc-400 border-r border-zinc-100 dark:border-zinc-800/60 flex items-center justify-center bg-zinc-50/40 dark:bg-zinc-900/30">
                      {slot}
                    </div>

                    {/* Practitioner Columns */}
                    {mockPractitioners.map((pr) => {
                      const apt = appointments.find(
                        (a) =>
                          a.date === selectedDate &&
                          a.startTime === slot &&
                          a.practitionerId === pr.id &&
                          a.status !== "Cancelled"
                      );

                      return (
                        <div
                          key={pr.id}
                          className="p-1.5 border-r border-zinc-100 dark:border-zinc-800/60 relative group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                        >
                          {apt ? (
                            <div
                              onClick={() => {
                                setTargetAppointment(apt);
                                setRescheduleDate(apt.date);
                                setRescheduleTime(apt.startTime);
                                setRescheduleModalOpen(true);
                              }}
                              className="h-full rounded-md p-2 bg-black text-white dark:bg-zinc-100 dark:text-black flex flex-col justify-between shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold truncate text-[11px]">
                                  {apt.patientName}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] px-1 py-0 bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <div className="text-[10px] text-zinc-300 dark:text-zinc-600 truncate mt-1">
                                {apt.visitType} · {apt.room.split(" ")[0]}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setBookPractitionerId(pr.id);
                                setBookStartTime(slot);
                                setBookDate(selectedDate);
                                setBookModalOpen(true);
                              }}
                              className="w-full h-full rounded border border-dashed border-transparent group-hover:border-zinc-300 dark:group-hover:border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 text-[11px]"
                            >
                              + Book
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: LIVE WAITING ROOM QUEUE BOARD */}
        <TabsContent value="queue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {statusColumns.map((status) => {
              const colApts = filteredDayAppointments.filter((a) => a.status === status);

              return (
                <div
                  key={status}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 flex flex-col min-h-[420px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                    <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                      {status}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono h-4 px-1.5">
                      {colApts.length}
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {colApts.map((apt) => (
                      <div
                        key={apt.id}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2.5 shadow-xs text-xs space-y-2 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-zinc-500">
                            {apt.startTime}
                          </span>
                          <span className="text-[10px] text-zinc-400">{apt.room.split("(")[0]}</span>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              setSelectedPatientId(apt.patientId);
                              setCurrentView("patient-detail");
                            }}
                            className="font-semibold text-black dark:text-white hover:underline text-left block"
                          >
                            {apt.patientName}
                          </button>
                          <span className="text-[11px] text-zinc-500 block truncate">
                            {apt.visitType}
                          </span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">
                            {apt.practitionerName.split(" ")[1]}
                          </span>
                        </div>

                        {/* Fast status advancer */}
                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-1">
                          {status === "Booked" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-[10px] h-6 py-0"
                              onClick={() => updateAppointmentStatus(apt.id, "Checked in")}
                            >
                              Check In
                            </Button>
                          )}
                          {status === "Checked in" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-[10px] h-6 py-0"
                              onClick={() => updateAppointmentStatus(apt.id, "Waiting")}
                            >
                              Seat in Waiting
                            </Button>
                          )}
                          {status === "Waiting" && (
                            <Button
                              size="sm"
                              className="w-full text-[10px] h-6 py-0"
                              onClick={() => updateAppointmentStatus(apt.id, "In consultation")}
                            >
                              Call to Lane
                            </Button>
                          )}
                          {status === "In consultation" && (
                            <Button
                              size="sm"
                              className="w-full text-[10px] h-6 py-0"
                              onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                            >
                              Finish Exam
                            </Button>
                          )}
                          {status === "Completed" && (
                            <span className="text-[10px] text-zinc-400 block text-center w-full">
                              Completed ✓
                            </span>
                          )}
                          {status === "No-show" && (
                            <span className="text-[10px] text-zinc-400 block text-center w-full">
                              Marked No-Show
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {colApts.length === 0 && (
                      <div className="py-8 text-center text-[10px] text-zinc-400">
                        Empty column
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 3: AUTOMATED REMINDERS */}
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Multi-Channel Appointment Reminder Dispatcher
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated SMS, WhatsApp Business, and Email notifications dispatched 24h before exam
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => toast.success("Batch reminders successfully queued and dispatched to 18 patients")}
                className="text-xs"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" /> Dispatch Batch Today
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                {appointments.slice(0, 8).map((apt, idx) => (
                  <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{apt.patientName}</span>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {apt.date} @ {apt.startTime}
                        </Badge>
                      </div>
                      <p className="text-zinc-500 text-[11px]">
                        Template: "Rappel: Votre rendez-vous chez Optique Vision est confirmé pour le {apt.date} à {apt.startTime} avec {apt.practitionerName}."
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp: Sent</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        Delivered
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Book Appointment Dialog */}
      <Dialog open={bookModalOpen} onOpenChange={setBookModalOpen}>
        <DialogContent onClose={() => setBookModalOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Clinical Appointment</DialogTitle>
            <DialogDescription>
              Schedule consultation slot, assign practitioner lane, and dispatch confirmation
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Select Patient *</label>
              <select
                value={bookPatientId}
                onChange={(e) => setBookPatientId(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.patientNo} · {p.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Practitioner *</label>
                <select
                  value={bookPractitionerId}
                  onChange={(e) => setBookPractitionerId(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  {mockPractitioners.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.name} ({pr.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Exam Room</label>
                <select
                  value={bookRoom}
                  onChange={(e) => setBookRoom(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  {mockRooms.map((rm) => (
                    <option key={rm.id} value={rm.name}>
                      {rm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Visit Type</label>
                <select
                  value={bookVisitType}
                  onChange={(e) => setBookVisitType(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  <option value="Comprehensive Eye Exam">Full Exam (45m)</option>
                  <option value="Contact Lens Fitting">Contact Lens (30m)</option>
                  <option value="Glaucoma / IOP Follow-up">IOP Check (20m)</option>
                  <option value="Pediatric Refraction">Pediatric (45m)</option>
                  <option value="Post-Op Check">Post-Op (15m)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Date</label>
                <Input
                  type="date"
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Start Time</label>
                <select
                  value={bookStartTime}
                  onChange={(e) => setBookStartTime(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Clinical Notes</label>
              <Input
                value={bookNotes}
                onChange={(e) => setBookNotes(e.target.value)}
                placeholder="e.g. Patient complains of asthenopia and night driving glare"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBookModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent onClose={() => setRescheduleModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Modify date and time slot for {targetAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">New Date</label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">New Start Time</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleSubmit}>Apply Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
