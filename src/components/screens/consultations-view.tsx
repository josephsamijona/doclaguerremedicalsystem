import React, { useState } from "react";
import {
  FileText,
  Plus,
  Eye,
  CheckCircle,
  Lock,
  ChevronLeft,
  Search,
  Sparkles,
  ArrowRightLeft,
  Upload,
  Calendar,
  User,
  ShieldCheck,
  Glasses,
  Printer,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Consultation } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
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

export function ConsultationsView() {
  const {
    consultations,
    patients,
    addConsultation,
    signConsultation,
    selectedConsultationId,
    setSelectedConsultationId,
    setCurrentView,
    addPrescription,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"exam" | "history" | "compare">("exam");
  const [activeConsultation, setActiveConsultation] = useState<Consultation>(
    consultations.find((c) => c.id === selectedConsultationId) || consultations[0]
  );

  const [signModalOpen, setSignModalOpen] = useState(false);
  const [signerName, setSignerName] = useState("Dr. Jean-Claude Pierre-Louis, OD");

  // Clinical form editing state
  const [chiefComplaint, setChiefComplaint] = useState(activeConsultation.chiefComplaint);
  const [vaOdDist, setVaOdDist] = useState(activeConsultation.visualAcuity.odCorrectedDistance);
  const [vaOsDist, setVaOsDist] = useState(activeConsultation.visualAcuity.osCorrectedDistance);
  const [vaOdNear, setVaOdNear] = useState(activeConsultation.visualAcuity.odCorrectedNear);
  const [vaOsNear, setVaOsNear] = useState(activeConsultation.visualAcuity.osCorrectedNear);

  // Subjective Refraction
  const [odSph, setOdSph] = useState(activeConsultation.subjectiveRefraction.od.sph);
  const [odCyl, setOdCyl] = useState(activeConsultation.subjectiveRefraction.od.cyl);
  const [odAxis, setOdAxis] = useState(activeConsultation.subjectiveRefraction.od.axis);
  const [odAdd, setOdAdd] = useState(activeConsultation.subjectiveRefraction.od.add || "+2.00");

  const [osSph, setOsSph] = useState(activeConsultation.subjectiveRefraction.os.sph);
  const [osCyl, setOsCyl] = useState(activeConsultation.subjectiveRefraction.os.cyl);
  const [osAxis, setOsAxis] = useState(activeConsultation.subjectiveRefraction.os.axis);
  const [osAdd, setOsAdd] = useState(activeConsultation.subjectiveRefraction.os.add || "+2.00");

  const [iopOd, setIopOd] = useState(String(activeConsultation.iop.od));
  const [iopOs, setIopOs] = useState(String(activeConsultation.iop.os));
  const [treatmentPlan, setTreatmentPlan] = useState(activeConsultation.treatmentPlan);

  const handleSelectExam = (c: Consultation) => {
    setActiveConsultation(c);
    setSelectedConsultationId(c.id);
    setChiefComplaint(c.chiefComplaint);
    setVaOdDist(c.visualAcuity.odCorrectedDistance);
    setVaOsDist(c.visualAcuity.osCorrectedDistance);
    setOdSph(c.subjectiveRefraction.od.sph);
    setOdCyl(c.subjectiveRefraction.od.cyl);
    setOdAxis(c.subjectiveRefraction.od.axis);
    setOdAdd(c.subjectiveRefraction.od.add || "+2.00");
    setOsSph(c.subjectiveRefraction.os.sph);
    setOsCyl(c.subjectiveRefraction.os.cyl);
    setOsAxis(c.subjectiveRefraction.os.axis);
    setOsAdd(c.subjectiveRefraction.os.add || "+2.00");
    setIopOd(String(c.iop.od));
    setIopOs(String(c.iop.os));
    setTreatmentPlan(c.treatmentPlan);
  };

  const handleCreateNewExam = () => {
    addConsultation({
      chiefComplaint: "Routine optical refraction and anterior segment screening",
      practitionerName: "Dr. Jean-Claude Pierre-Louis",
    });
  };

  const handleSignConfirm = () => {
    signConsultation(activeConsultation.id, signerName);
    setSignModalOpen(false);
  };

  const handleGeneratePrescription = () => {
    addPrescription({
      id: `RX-SPEC-${Date.now().toString().slice(-4)}`,
      rxNumber: `RX-SPEC-2026-${Date.now().toString().slice(-4)}`,
      type: "Spectacles",
      patientId: activeConsultation.patientId,
      patientName: activeConsultation.patientName,
      practitionerName: activeConsultation.practitionerName,
      date: activeConsultation.date,
      validUntil: "2027-09-02",
      spectaclesDetails: {
        od: { sph: odSph, cyl: odCyl, axis: odAxis, add: odAdd, prism: "", base: "", pd: "31.5 mm" },
        os: { sph: osSph, cyl: osCyl, axis: osAxis, add: osAdd, prism: "", base: "", pd: "32.0 mm" },
        recommendedLenses: "Progressive Varilux Comfort Max Anti-Reflective Crizal",
        usage: "Constant wear (Driving & Reading)",
      },
      notes: "Dispense high-index thin lenses with blue protection",
    });
    setCurrentView("prescriptions");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Clinical Refraction & Exam</h1>
            <Badge variant={activeConsultation.isSigned ? "secondary" : "outline"}>
              {activeConsultation.isSigned ? (
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Signed & Locked</span>
              ) : (
                "Draft Exam Record"
              )}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Exam No: {activeConsultation.consultationNo} · Patient: {activeConsultation.patientName} · {activeConsultation.date}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCreateNewExam} className="text-xs">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Start New Exam
          </Button>

          {!activeConsultation.isSigned ? (
            <Button size="sm" onClick={() => setSignModalOpen(true)} className="text-xs">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Sign & Lock Record
            </Button>
          ) : (
            <Button size="sm" onClick={handleGeneratePrescription} className="text-xs">
              <Glasses className="mr-1.5 h-3.5 w-3.5" /> Issue Optical Rx
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="exam">Clinical Examination Record</TabsTrigger>
          <TabsTrigger value="compare">Side-by-Side Past Exam Compare</TabsTrigger>
          <TabsTrigger value="history">All Exam Logs ({consultations.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: Main Clinical Exam Record */}
        <TabsContent value="exam" className="space-y-6">
          {/* Chief Complaint */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                1. Chief Complaint & Visual Demands
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Input
                disabled={activeConsultation.isSigned}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="text-xs"
                placeholder="Describe reason for visit and optical complaints..."
              />
            </CardContent>
          </Card>

          {/* 2-Column OD / OS Clinical Matrix */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* OD (Right Eye) Column */}
            <Card className="border-t-4 border-t-black dark:border-t-white">
              <CardHeader className="p-4 pb-2 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">OD — Right Eye (Oculus Dexter)</CardTitle>
                  <Badge variant="outline" className="font-mono text-[10px]">OD</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                {/* Visual Acuity */}
                <div className="space-y-2">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400 block">Visual Acuity</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-400 text-[10px]">VA Distance (Corrected)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={vaOdDist}
                        onChange={(e) => setVaOdDist(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">VA Near (Corrected)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={vaOdNear}
                        onChange={(e) => setVaOdNear(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Subjective Refraction OD */}
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400 block">Subjective Refraction</span>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-zinc-400 text-[10px]">SPH (D)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={odSph}
                        onChange={(e) => setOdSph(e.target.value)}
                        className="text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">CYL (D)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={odCyl}
                        onChange={(e) => setOdCyl(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">AXIS (°)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={odAxis}
                        onChange={(e) => setOdAxis(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">ADD (D)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={odAdd}
                        onChange={(e) => setOdAdd(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Slit Lamp OD */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400 block">Anterior Segment (Biomicroscopy)</span>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                    <div>Cornea: Clear, intact epithelium, no stromal infiltrate</div>
                    <div>Anterior Chamber: Deep, quiet, Van Herick Grade 4</div>
                    <div>Crystalline Lens: Transparent, no nuclear sclerosis</div>
                  </div>
                </div>

                {/* IOP OD */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="font-semibold">IOP (Goldmann Applanation):</span>
                  <div className="flex items-center gap-1">
                    <Input
                      disabled={activeConsultation.isSigned}
                      value={iopOd}
                      onChange={(e) => setIopOd(e.target.value)}
                      className="w-16 text-xs font-mono text-right"
                    />
                    <span className="text-zinc-500">mmHg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OS (Left Eye) Column */}
            <Card className="border-t-4 border-t-black dark:border-t-white">
              <CardHeader className="p-4 pb-2 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">OS — Left Eye (Oculus Sinister)</CardTitle>
                  <Badge variant="outline" className="font-mono text-[10px]">OS</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                {/* Visual Acuity */}
                <div className="space-y-2">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400 block">Visual Acuity</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-400 text-[10px]">VA Distance (Corrected)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={vaOsDist}
                        onChange={(e) => setVaOsDist(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">VA Near (Corrected)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={vaOsNear}
                        onChange={(e) => setVaOsNear(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Subjective Refraction OS */}
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400 block">Subjective Refraction</span>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-zinc-400 text-[10px]">SPH (D)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={osSph}
                        onChange={(e) => setOsSph(e.target.value)}
                        className="text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">CYL (D)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={osCyl}
                        onChange={(e) => setOsCyl(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">AXIS (°)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={osAxis}
                        onChange={(e) => setOsAxis(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-[10px]">ADD (D)</label>
                      <Input
                        disabled={activeConsultation.isSigned}
                        value={osAdd}
                        onChange={(e) => setOsAdd(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Slit Lamp OS */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400 block">Anterior Segment (Biomicroscopy)</span>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                    <div>Cornea: Clear, healthy tear film (TBUT 12s)</div>
                    <div>Anterior Chamber: Deep, quiet</div>
                    <div>Crystalline Lens: Clear, physiological</div>
                  </div>
                </div>

                {/* IOP OS */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="font-semibold">IOP (Goldmann Applanation):</span>
                  <div className="flex items-center gap-1">
                    <Input
                      disabled={activeConsultation.isSigned}
                      value={iopOs}
                      onChange={(e) => setIopOs(e.target.value)}
                      className="w-16 text-xs font-mono text-right"
                    />
                    <span className="text-zinc-500">mmHg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posterior Pole & Diagnosis */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Fundus & Posterior Pole Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Optic Disc / Cup-to-Disc:</span>
                  <span className="font-mono">OD 0.3 / OS 0.3 (Pink, Sharp margins)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Macular Reflex:</span>
                  <span>Normal foveal reflex bilateral</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Retinal Vasculature:</span>
                  <span>A:V ratio 2:3, no crossing defects</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Diagnosis (ICD-10) & Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <span className="font-bold">H52.13 — Myopia, bilateral</span>
                    <span className="block text-[10px] text-zinc-400">Regular astigmatism & Presbyopia</span>
                  </div>
                  <Badge variant="outline">Confirmed</Badge>
                </div>
                <Textarea
                  disabled={activeConsultation.isSigned}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  className="text-xs"
                  rows={2}
                  placeholder="Treatment recommendations and recall instructions..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: Side-by-Side Past Exam Compare */}
        <TabsContent value="compare">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Side-by-Side Longitudinal Exam Comparison</CardTitle>
              <CardDescription className="text-xs">
                Compare current refractive status vs. previous clinical exam (August 15, 2025)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    Current Exam: 2026-09-02 (Dr. Pierre-Louis)
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-zinc-500">Right Eye (OD):</div>
                    <div className="font-mono bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
                      SPH {odSph} · CYL {odCyl} · AXIS {odAxis}° · ADD {odAdd} (VA 20/20)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-zinc-500">Left Eye (OS):</div>
                    <div className="font-mono bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
                      SPH {osSph} · CYL {osCyl} · AXIS {osAxis}° · ADD {osAdd} (VA 20/20)
                    </div>
                  </div>
                  <div className="text-zinc-500 text-[11px]">IOP: OD 15 mmHg / OS 15 mmHg</div>
                </div>

                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3">
                  <div className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2 text-zinc-600 dark:text-zinc-400">
                    Previous Baseline: 2025-08-15 (Dr. Augustin)
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-zinc-500">Right Eye (OD):</div>
                    <div className="font-mono bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                      SPH -2.00 · CYL -0.50 · AXIS 180° · ADD +1.75 (VA 20/20)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-zinc-500">Left Eye (OS):</div>
                    <div className="font-mono bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                      SPH -2.25 · CYL -0.50 · AXIS 175° · ADD +1.75 (VA 20/20)
                    </div>
                  </div>
                  <div className="text-zinc-500 text-[11px]">
                    Myopic progression: -0.25 D shift · Presbyopic progression: +0.25 D add increase
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: All Exam History */}
        <TabsContent value="history">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Consultation Registry</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Practitioner</TableHead>
                    <TableHead>Chief Complaint</TableHead>
                    <TableHead>OD Refraction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      onClick={() => {
                        handleSelectExam(c);
                        setActiveTab("exam");
                      }}
                    >
                      <TableCell className="font-mono text-xs font-semibold">{c.consultationNo}</TableCell>
                      <TableCell className="text-xs">{c.date}</TableCell>
                      <TableCell className="font-medium text-xs">{c.patientName}</TableCell>
                      <TableCell className="text-xs">{c.practitionerName}</TableCell>
                      <TableCell className="text-xs max-w-xs truncate">{c.chiefComplaint}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.subjectiveRefraction.od.sph} / {c.subjectiveRefraction.od.cyl}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.isSigned ? "secondary" : "outline"}>
                          {c.isSigned ? "Signed" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Load Record
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Signature Modal */}
      <Dialog open={signModalOpen} onOpenChange={setSignModalOpen}>
        <DialogContent onClose={() => setSignModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign & Lock Clinical Consultation</DialogTitle>
            <DialogDescription>
              Digitally authenticate and lock this record. Once locked, modifications require an addendum.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Attending Practitioner Name</label>
              <Input
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
              />
            </div>
            <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
              By locking this record, you certify under MSPP regulations that the examination was performed according to standard optometric clinical protocols.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSignConfirm}>
              Authenticate & Lock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
