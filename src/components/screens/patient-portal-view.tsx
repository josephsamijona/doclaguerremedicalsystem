import React, { useState } from "react";
import {
  Calendar,
  Glasses,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { toast } from "sonner";

export function PatientPortalView() {
  const { patients, appointments, prescriptions, labOrders, invoices, addAppointment } = useStore();

  // Active logged-in patient simulation
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "PT-001");
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookDate, setBookDate] = useState("2026-09-10");
  const [bookTime, setBookTime] = useState("10:00 AM");
  const [bookReason, setBookReason] = useState("Annual Comprehensive Refraction Check");

  const patientAppointments = appointments.filter((a) => a.patientId === currentPatient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === currentPatient.id);
  const patientLabOrders = labOrders.filter((l) => l.patientId === currentPatient.id);
  const patientInvoices = invoices.filter((i) => i.patientId === currentPatient.id);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: currentPatient.id,
      patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
      patientPhone: currentPatient.phone,
      practitionerId: "PRAC-01",
      practitionerName: "Dr. Jean-Claude Pierre-Louis",
      date: bookDate,
      time: bookTime,
      type: "Comprehensive Exam",
      reason: bookReason,
    });
    setBookingModalOpen(false);
    toast.success("Appointment request booked successfully! Confirmation SMS dispatched.");
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Patient Portal Header Banner */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-lg">
            {currentPatient.firstName[0]}{currentPatient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                Welcome, {currentPatient.firstName} {currentPatient.lastName}
              </h1>
              <Badge variant="secondary">Patient Portal</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              File #{currentPatient.patientNo} · DOB: {currentPatient.dateOfBirth} · Phone: {currentPatient.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Patient Selector for Prototype Testing */}
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs text-black dark:text-white"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                Simulate: {p.firstName} {p.lastName}
              </option>
            ))}
          </select>

          <Button size="sm" onClick={() => setBookingModalOpen(true)} className="text-xs">
            <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book Appointment
          </Button>
        </div>
      </div>

      {/* Main Portal Tabs */}
      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">My Glasses & Lab Orders ({patientLabOrders.length})</TabsTrigger>
          <TabsTrigger value="prescriptions">My Prescriptions ({patientPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="appointments">Appointments ({patientAppointments.length})</TabsTrigger>
          <TabsTrigger value="billing">Invoices & Receipts ({patientInvoices.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: Live Eyewear Order Tracking */}
        <TabsContent value="orders" className="space-y-4">
          {patientLabOrders.map((order) => (
            <Card key={order.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-zinc-500">Order #{order.orderNo}</span>
                  <h3 className="font-bold text-sm mt-0.5">{order.frameName}</h3>
                  <p className="text-xs text-zinc-500">{order.lensSpec.type} ({order.lensSpec.material})</p>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === "Delivered" ? "secondary" : "default"}>
                    {order.status}
                  </Badge>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Estimated Pickup: <span className="font-semibold text-black dark:text-white">{order.promisedDate}</span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-zinc-500 block mb-3 uppercase tracking-wider">
                  Workshop Production Stages
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg border border-black dark:border-white bg-zinc-100 dark:bg-zinc-800">
                    <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-black dark:text-white" />
                    <span className="font-bold block">1. Ordered</span>
                    <span className="text-[10px] text-zinc-500">Lens blank allocated</span>
                  </div>
                  <div className="p-2 rounded-lg border border-black dark:border-white bg-zinc-100 dark:bg-zinc-800">
                    <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-black dark:text-white" />
                    <span className="font-bold block">2. Surfacing</span>
                    <span className="text-[10px] text-zinc-500">Digital generator</span>
                  </div>
                  <div className="p-2 rounded-lg border border-black dark:border-white bg-zinc-100 dark:bg-zinc-800">
                    <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-black dark:text-white" />
                    <span className="font-bold block">3. Edging & QC</span>
                    <span className="text-[10px] text-zinc-500">Mounted in frame</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${order.status === "Delivered" || order.status === "Ready" ? "border-black dark:border-white bg-zinc-100 dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    <span className="font-bold block">4. Ready</span>
                    <span className="text-[10px]">Clinic collection</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {patientLabOrders.length === 0 && (
            <div className="py-12 text-center text-xs text-zinc-500 border rounded-xl">
              No active glasses orders found for this patient profile.
            </div>
          )}
        </TabsContent>

        {/* TAB 2: Active Prescriptions */}
        <TabsContent value="prescriptions" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {patientPrescriptions.map((rx) => (
              <Card key={rx.id} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">{rx.type}</Badge>
                    <div className="font-bold text-sm">{rx.rxNumber}</div>
                    <div className="text-xs text-zinc-500">Issued: {rx.date} · Valid until: {rx.validUntil}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => toast.success(`Downloading official Rx PDF: ${rx.rxNumber}`)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> PDF
                  </Button>
                </div>

                {rx.type === "Spectacles" && (
                  <div className="text-xs font-mono bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div>OD: SPH {rx.od.sph} CYL {rx.od.cyl} AXIS {rx.od.axis}° ADD {rx.od.add}</div>
                    <div>OS: SPH {rx.os.sph} CYL {rx.os.cyl} AXIS {rx.os.axis}° ADD {rx.os.add}</div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: Appointments */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="space-y-3">
            {patientAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs">{apt.type}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {apt.date} at {apt.time} · {apt.practitionerName}
                  </div>
                </div>
                <Badge variant={apt.status === "Completed" ? "secondary" : "outline"}>
                  {apt.status}
                </Badge>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: Invoices & Receipts */}
        <TabsContent value="billing" className="space-y-4">
          <div className="space-y-3">
            {patientInvoices.map((inv) => (
              <Card key={inv.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-bold">{inv.invoiceNo}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {inv.date} · Total: {inv.totalHTG.toLocaleString()} HTG
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={inv.status === "Paid" ? "secondary" : "default"}>
                    {inv.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => toast.success(`Downloaded official receipt for ${inv.invoiceNo}`)}
                  >
                    <Download className="h-3 w-3 mr-1" /> Receipt
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Book Appointment Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent onClose={() => setBookingModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Examination Appointment</DialogTitle>
            <DialogDescription>
              Select preferred date and clinical checkup reason
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookAppointment} className="space-y-3 text-xs py-2">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Preferred Date</label>
              <Input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Time Slot</label>
              <select
                value={bookTime}
                onChange={(e) => setBookTime(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Reason for Visit</label>
              <Input value={bookReason} onChange={(e) => setBookReason(e.target.value)} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
