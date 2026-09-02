import React, { useState } from "react";
import {
  Glasses,
  Plus,
  Printer,
  QrCode,
  Layers,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Prescription, PrescriptionType, SpectaclePrescription, ContactLensPrescription, MedicationPrescription } from "@/src/types";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { toast } from "sonner";

export function PrescriptionsView() {
  const {
    prescriptions,
    patients,
    addPrescription,
    createLabOrder,
    setCurrentView,
    selectedPrescriptionId,
    setSelectedPrescriptionId,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"ALL" | PrescriptionType>("ALL");
  const [previewRx, setPreviewRx] = useState<Prescription>(
    prescriptions.find((r) => r.id === selectedPrescriptionId) || prescriptions[0]
  );
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRxType, setNewRxType] = useState<PrescriptionType>("Spectacles");

  // Create Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || "PT-001");
  const [odSph, setOdSph] = useState("-2.50");
  const [odCyl, setOdCyl] = useState("-0.50");
  const [odAxis, setOdAxis] = useState("180");
  const [odAdd, setOdAdd] = useState("+2.00");
  const [osSph, setOsSph] = useState("-2.75");
  const [osCyl, setOsCyl] = useState("-0.50");
  const [osAxis, setOsAxis] = useState("175");
  const [osAdd, setOsAdd] = useState("+2.00");
  const [pdOd, setPdOd] = useState("31.5 mm");
  const [pdOs, setPdOs] = useState("32.0 mm");

  const filteredRx = prescriptions.filter(
    (rx) => activeTab === "ALL" || rx.type === activeTab
  );

  const handleOpenPreview = (rx: Prescription) => {
    setPreviewRx(rx);
    setSelectedPrescriptionId(rx.id);
    setPreviewModalOpen(true);
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);

    if (newRxType === "Spectacles") {
      const specRx: SpectaclePrescription = {
        type: "Spectacles",
        id: `RX-SPEC-${Date.now().toString().slice(-4)}`,
        rxNumber: `RX-SPEC-2026-${Date.now().toString().slice(-4)}`,
        patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Walk-in Patient",
        practitionerId: "PRAC-01",
        practitionerName: "Dr. Jean-Claude Pierre-Louis",
        date: "2026-09-02",
        validUntil: "2027-09-02",
        od: { sph: odSph, cyl: odCyl, axis: odAxis, add: odAdd, prism: "", base: "", pdMono: pdOd },
        os: { sph: osSph, cyl: osCyl, axis: osAxis, add: osAdd, prism: "", base: "", pdMono: pdOs },
        pdTotal: "63.5 mm",
        lensType: "Progressive",
        material: "Hi-Index 1.67",
        coatings: ["Anti-Reflective Premium", "Blue Light Filter"],
        usage: "Constant",
        notes: "Dispense high-index scratch-resistant lenses",
      };
      addPrescription(specRx);
      setCreateModalOpen(false);
      handleOpenPreview(specRx);
    } else if (newRxType === "Contact Lenses") {
      const clRx: ContactLensPrescription = {
        type: "Contact Lenses",
        id: `RX-CL-${Date.now().toString().slice(-4)}`,
        rxNumber: `RX-CL-2026-${Date.now().toString().slice(-4)}`,
        patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Walk-in Patient",
        practitionerId: "PRAC-01",
        practitionerName: "Dr. Jean-Claude Pierre-Louis",
        date: "2026-09-02",
        validUntil: "2027-09-02",
        brand: "Acuvue Oasys with HydraLuxe 1-Day",
        modality: "Daily Disposable",
        od: { bc: "8.5", dia: "14.3", power: odSph },
        os: { bc: "8.5", dia: "14.3", power: osSph },
        careSolution: "Biotrue Multi-Purpose Solution",
        wearingSchedule: "Daily wear",
        notes: "Comfort check scheduled in 14 days",
      };
      addPrescription(clRx);
      setCreateModalOpen(false);
      handleOpenPreview(clRx);
    } else {
      const medRx: MedicationPrescription = {
        type: "Medication",
        id: `RX-MED-${Date.now().toString().slice(-4)}`,
        rxNumber: `RX-MED-2026-${Date.now().toString().slice(-4)}`,
        patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Walk-in Patient",
        practitionerId: "PRAC-01",
        practitionerName: "Dr. Jean-Claude Pierre-Louis",
        date: "2026-09-02",
        validUntil: "2026-10-02",
        items: [
          {
            drugName: "Tobramycin + Dexamethasone (Tobradex)",
            dose: "0.3% / 0.1%",
            form: "Eye Drops (Suspension)",
            posology: "1 drop QID (4x daily)",
            duration: "7 days",
            refills: 0,
            substitutionAllowed: false,
          },
        ],
        instructions: "Instill into right eye. Shake well before use.",
      };
      addPrescription(medRx);
      setCreateModalOpen(false);
      handleOpenPreview(medRx);
    }
  };

  const handleSendToLab = (rx: SpectaclePrescription) => {
    createLabOrder({
      patientId: rx.patientId,
      patientName: rx.patientName,
      prescriptionId: rx.id,
      prescriptionNumber: rx.rxNumber,
      frameName: "Ray-Ban Clubmaster RX5154",
      lensSpec: {
        type: `${rx.lensType} (${rx.material})`,
        material: rx.material,
        coatings: rx.coatings,
        odPower: `SPH ${rx.od.sph} CYL ${rx.od.cyl} AXIS ${rx.od.axis} ADD ${rx.od.add}`,
        osPower: `SPH ${rx.os.sph} CYL ${rx.os.cyl} AXIS ${rx.os.axis} ADD ${rx.os.add}`,
      },
    });
    setPreviewModalOpen(false);
    setCurrentView("lab");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Prescriptions & Dispensary</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Issue and print standardized A5 Spectacle, Contact Lens, and Ophthalmic Medication Rx orders
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} size="sm" className="text-xs">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Issue New Prescription
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="ALL">All Prescriptions ({prescriptions.length})</TabsTrigger>
          <TabsTrigger value="Spectacles">Spectacles</TabsTrigger>
          <TabsTrigger value="Contact Lenses">Contact Lenses</TabsTrigger>
          <TabsTrigger value="Medication">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Rx Number</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRx.map((rx) => (
                    <TableRow
                      key={rx.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      onClick={() => handleOpenPreview(rx)}
                    >
                      <TableCell>
                        <Badge
                          variant={rx.type === "Spectacles" ? "default" : rx.type === "Contact Lenses" ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {rx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{rx.rxNumber}</TableCell>
                      <TableCell className="font-medium text-xs">{rx.patientName}</TableCell>
                      <TableCell className="text-xs text-zinc-500">{rx.practitionerName}</TableCell>
                      <TableCell className="text-xs">{rx.date}</TableCell>
                      <TableCell className="text-xs">{rx.validUntil}</TableCell>
                      <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleOpenPreview(rx)}
                        >
                          <Printer className="h-3 w-3 mr-1" /> View A5
                        </Button>
                        {rx.type === "Spectacles" && (
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleSendToLab(rx)}
                          >
                            <Layers className="h-3 w-3 mr-1" /> Send to Lab
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Printable A5 Prescription Dialog */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent onClose={() => setPreviewModalOpen(false)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* A5 Container with print styles */}
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-black dark:text-white space-y-6">
            {/* Header / Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-black dark:border-white pb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight uppercase">
                  CLINIQUE OPTIQUE VISION CARAÏBES
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Centre d'Optométrie Médicale & Réfraction Avancée
                </p>
                <p className="text-[10px] text-zinc-400">
                  42 Angle Rue Grégoire et Panaméricaine, Pétion-Ville · +509 2940-8800
                </p>
              </div>

              <div className="text-right">
                <Badge variant="outline" className="font-mono text-xs">
                  {previewRx.rxNumber}
                </Badge>
                <div className="text-[10px] text-zinc-500 mt-1">
                  Issued: {previewRx.date} · Valid: {previewRx.validUntil}
                </div>
              </div>
            </div>

            {/* Patient Header */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 dark:bg-zinc-900 p-3 rounded">
              <div>
                <span className="text-zinc-500 block">Patient Name:</span>
                <span className="font-bold text-sm">{previewRx.patientName}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block">Prescribing Practitioner:</span>
                <span className="font-semibold">{previewRx.practitionerName}</span>
              </div>
            </div>

            {/* Prescribed Item Specifics */}
            {previewRx.type === "Spectacles" && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1">
                  Spectacle Refractive Correction
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                  <table className="w-full text-xs text-center">
                    <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
                      <tr>
                        <th className="p-2 text-left">Eye</th>
                        <th className="p-2">SPH</th>
                        <th className="p-2">CYL</th>
                        <th className="p-2">AXIS</th>
                        <th className="p-2">ADD</th>
                        <th className="p-2">PRISM</th>
                        <th className="p-2">MONO PD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                      <tr>
                        <td className="p-2 font-bold text-left bg-zinc-50 dark:bg-zinc-900">OD (Right)</td>
                        <td className="p-2 font-bold">{previewRx.od.sph}</td>
                        <td className="p-2">{previewRx.od.cyl}</td>
                        <td className="p-2">{previewRx.od.axis}°</td>
                        <td className="p-2">{previewRx.od.add || "-"}</td>
                        <td className="p-2">{previewRx.od.prism || "-"}</td>
                        <td className="p-2">{previewRx.od.pdMono}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-left bg-zinc-50 dark:bg-zinc-900">OS (Left)</td>
                        <td className="p-2 font-bold">{previewRx.os.sph}</td>
                        <td className="p-2">{previewRx.os.cyl}</td>
                        <td className="p-2">{previewRx.os.axis}°</td>
                        <td className="p-2">{previewRx.os.add || "-"}</td>
                        <td className="p-2">{previewRx.os.prism || "-"}</td>
                        <td className="p-2">{previewRx.os.pdMono}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-semibold text-zinc-500">Lens Recommendation: </span>
                    <span>{previewRx.lensType} ({previewRx.material}) - {previewRx.coatings.join(", ")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-500">Usage Instructions: </span>
                    <span>{previewRx.usage}</span>
                  </div>
                </div>
              </div>
            )}

            {previewRx.type === "Contact Lenses" && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1">
                  Contact Lens Specification
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded space-y-1">
                    <span className="font-bold block">OD (Right Eye)</span>
                    <div>Power: <span className="font-mono">{previewRx.od.power}</span></div>
                    <div>BC: <span className="font-mono">{previewRx.od.bc}</span> | DIA: <span className="font-mono">{previewRx.od.dia}</span></div>
                  </div>
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded space-y-1">
                    <span className="font-bold block">OS (Left Eye)</span>
                    <div>Power: <span className="font-mono">{previewRx.os.power}</span></div>
                    <div>BC: <span className="font-mono">{previewRx.os.bc}</span> | DIA: <span className="font-mono">{previewRx.os.dia}</span></div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  Brand: {previewRx.brand} · Schedule: {previewRx.wearingSchedule}
                </div>
              </div>
            )}

            {previewRx.type === "Medication" && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1">
                  Ophthalmic Medication Rx
                </div>
                {previewRx.items.map((med, idx) => (
                  <div key={idx} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded text-xs space-y-1">
                    <div className="font-bold text-sm">{med.drugName} ({med.dose})</div>
                    <div>Form: {med.form} · Posology: {med.posology} for {med.duration}</div>
                  </div>
                ))}
                {previewRx.instructions && (
                  <div className="text-xs text-zinc-500 italic">Instructions: "{previewRx.instructions}"</div>
                )}
              </div>
            )}

            {/* Signature & Security Footer */}
            <div className="pt-6 border-t-2 border-black dark:border-white flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 border border-zinc-300 dark:border-zinc-700 rounded flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                  <QrCode className="h-10 w-10 text-black dark:text-white" />
                </div>
                <div className="text-[10px] text-zinc-400">
                  Scan QR for digital prescription verification.<br />
                  MSPP License #DE-88219
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-signature font-bold text-black dark:text-white mb-1">
                  Dr. Jean-Claude Pierre-Louis
                </div>
                <div className="border-t border-zinc-400 w-44 pt-1 text-[10px] text-zinc-500">
                  Optometrist Signature & Stamp
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  window.print();
                  toast.success("Print dialog opened for A5 Prescription");
                }}
              >
                <Printer className="h-3.5 w-3.5 mr-1" /> Print A5
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => toast.success(`Prescription ${previewRx.rxNumber} emailed to patient`)}
              >
                <Mail className="h-3.5 w-3.5 mr-1" /> Email PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => toast.success(`WhatsApp download link dispatched to ${previewRx.patientName}`)}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" /> WhatsApp
              </Button>
            </div>

            {previewRx.type === "Spectacles" && (
              <Button
                size="sm"
                className="text-xs"
                onClick={() => handleSendToLab(previewRx)}
              >
                <Layers className="h-3.5 w-3.5 mr-1" /> Send to Workshop Lab
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Prescription Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent onClose={() => setCreateModalOpen(false)} className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Issue New Optical Prescription</DialogTitle>
            <DialogDescription>
              Select patient, prescription type, and define spherical / cylinder values
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePrescription} className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Prescription Type</label>
                <select
                  value={newRxType}
                  onChange={(e) => setNewRxType(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
                >
                  <option value="Spectacles">Spectacles (Lunettes)</option>
                  <option value="Contact Lenses">Contact Lenses (Lentilles)</option>
                  <option value="Medication">Ophthalmic Medication</option>
                </select>
              </div>
            </div>

            {newRxType === "Spectacles" && (
              <div className="space-y-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-semibold block">Refraction Values</span>
                <div className="grid grid-cols-5 gap-2">
                  <div className="font-medium flex items-center">OD (Right)</div>
                  <Input value={odSph} onChange={(e) => setOdSph(e.target.value)} placeholder="SPH" />
                  <Input value={odCyl} onChange={(e) => setOdCyl(e.target.value)} placeholder="CYL" />
                  <Input value={odAxis} onChange={(e) => setOdAxis(e.target.value)} placeholder="AXIS" />
                  <Input value={odAdd} onChange={(e) => setOdAdd(e.target.value)} placeholder="ADD" />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="font-medium flex items-center">OS (Left)</div>
                  <Input value={osSph} onChange={(e) => setOsSph(e.target.value)} placeholder="SPH" />
                  <Input value={osCyl} onChange={(e) => setOsCyl(e.target.value)} placeholder="CYL" />
                  <Input value={osAxis} onChange={(e) => setOsAxis(e.target.value)} placeholder="AXIS" />
                  <Input value={osAdd} onChange={(e) => setOsAdd(e.target.value)} placeholder="ADD" />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Issue & Preview A5</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
