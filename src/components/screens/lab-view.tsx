import React, { useState } from "react";
import {
  Layers,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Glasses,
  Wrench,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { LabJobOrder, LabJobStatus } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
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

export function LabView() {
  const {
    labOrders,
    updateLabJobStatus,
    createLabOrder,
    patients,
    selectedLabJobId,
    setSelectedLabJobId,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"kanban" | "table" | "aftersales">("kanban");
  const [selectedJob, setSelectedJob] = useState<LabJobOrder>(
    labOrders.find((j) => j.id === selectedLabJobId) || labOrders[0]
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);

  // New Job state
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || "PT-001");
  const [newFrameName, setNewFrameName] = useState("Ray-Ban Clubmaster RX5154");
  const [newLensType, setNewLensType] = useState("Progressive Varilux Comfort Max");
  const [newLabName, setNewLabName] = useState("OptoVision In-House Edging Workshop");
  const [newNotes, setNewNotes] = useState("");

  const columns: LabJobStatus[] = [
    "Ordered",
    "At lab",
    "Received",
    "Edged & mounted",
    "QC",
    "Ready",
    "Delivered",
  ];

  const handleOpenDetail = (job: LabJobOrder) => {
    setSelectedJob(job);
    setSelectedLabJobId(job.id);
    setDetailModalOpen(true);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === newPatientId);

    createLabOrder({
      patientId: newPatientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Walk-in",
      frameName: newFrameName,
      lensSpec: {
        type: newLensType,
        material: "Hi-Index 1.67",
        coatings: ["Crizal Prevencia Anti-Reflective", "Blue UV400"],
        odPower: "SPH -2.50 CYL -0.50 AXIS 180 ADD +2.00",
        osPower: "SPH -2.75 CYL -0.50 AXIS 175 ADD +2.00",
      },
      externalLabName: newLabName,
      notes: newNotes,
    });

    setNewJobModalOpen(false);
  };

  const delayedJobs = labOrders.filter((j) => j.isDelayed);
  const afterSalesCases = labOrders.filter((j) => j.afterSales && j.afterSales.length > 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Lab & Workshop Management</h1>
            {delayedJobs.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {delayedJobs.length} Delayed Shipments
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Track optical job orders across edging, mounting, digital surfacing, and quality control
          </p>
        </div>
        <Button onClick={() => setNewJobModalOpen(true)} size="sm" className="text-xs">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Workshop Job
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Job Order Kanban ({labOrders.length})</TabsTrigger>
          <TabsTrigger value="table">All Orders Table</TabsTrigger>
          <TabsTrigger value="aftersales">
            After-Sales & Warranties ({afterSalesCases.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: KANBAN BOARD */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto min-w-[980px]">
            {columns.map((colStatus, idx) => {
              const colJobs = labOrders.filter((j) => j.status === colStatus);

              return (
                <div
                  key={colStatus}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-2.5 flex flex-col min-h-[480px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                    <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                      {colStatus}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono h-4 px-1.5">
                      {colJobs.length}
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {colJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleOpenDetail(job)}
                        className={`rounded-lg border bg-white dark:bg-zinc-950 p-2.5 shadow-xs text-xs space-y-2 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors ${
                          job.isDelayed
                            ? "border-black dark:border-white ring-1 ring-black dark:ring-white"
                            : "border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-zinc-500">
                            {job.orderNo}
                          </span>
                          {job.isDelayed ? (
                            <Badge variant="destructive" className="text-[9px] px-1 py-0">
                              Delayed
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-zinc-400">{job.priority}</span>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold text-black dark:text-white truncate">
                            {job.patientName}
                          </div>
                          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
                            {job.frameName}
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                            {job.lensSpec.type}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                          <span>Due: {job.promisedDate}</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    ))}

                    {colJobs.length === 0 && (
                      <div className="py-12 text-center text-[10px] text-zinc-400">
                        No jobs in {colStatus}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: Table View */}
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order No</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Frame</TableHead>
                    <TableHead>Lens Type</TableHead>
                    <TableHead>Assigned Lab</TableHead>
                    <TableHead>Promised Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labOrders.map((j) => (
                    <TableRow
                      key={j.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      onClick={() => handleOpenDetail(j)}
                    >
                      <TableCell className="font-mono text-xs font-semibold">{j.orderNo}</TableCell>
                      <TableCell className="font-medium text-xs">{j.patientName}</TableCell>
                      <TableCell className="text-xs">{j.frameName}</TableCell>
                      <TableCell className="text-xs">{j.lensSpec.type}</TableCell>
                      <TableCell className="text-xs text-zinc-500">{j.externalLabName.split("(")[0]}</TableCell>
                      <TableCell className="text-xs">{j.promisedDate}</TableCell>
                      <TableCell>
                        <Badge variant={j.status === "Delivered" ? "secondary" : "default"}>
                          {j.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleOpenDetail(j)}
                        >
                          View Specs
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: After-Sales & Warranty */}
        <TabsContent value="aftersales">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">After-Sales Adjustments & Warranty Cases</CardTitle>
              <CardDescription className="text-xs">
                Log frame adjustments, lens remakes under coating warranty, and patient comfort tweaks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Order</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Case Type</TableHead>
                    <TableHead>Reported Date</TableHead>
                    <TableHead>Reason & Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {afterSalesCases.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-mono text-xs font-bold">{j.orderNo}</TableCell>
                      <TableCell className="text-xs font-medium">{j.patientName}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline">{j.afterSales?.[0]?.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{j.afterSales?.[0]?.reportedDate}</TableCell>
                      <TableCell className="text-xs max-w-sm truncate text-zinc-600 dark:text-zinc-400">
                        {j.afterSales?.[0]?.reason}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{j.afterSales?.[0]?.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toast.success("Case resolved and updated in patient file")}
                        >
                          Resolve Case
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

      {/* Job Order Detail & Fitting Measurements Dialog */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent onClose={() => setDetailModalOpen(false)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Job Order: {selectedJob.orderNo}</DialogTitle>
              <Badge variant={selectedJob.status === "Delivered" ? "secondary" : "default"}>
                {selectedJob.status}
              </Badge>
            </div>
            <DialogDescription>
              Patient: {selectedJob.patientName} · Rx: {selectedJob.prescriptionNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs py-2">
            {/* Delay alert banner if applicable */}
            {selectedJob.isDelayed && (
              <div className="p-3 rounded-lg border border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-black dark:text-white mt-0.5" />
                <div>
                  <span className="font-bold block">Delivery Delay Alert</span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
                    {selectedJob.notes || "Semi-finished progressive blank delayed in international freight clearance."}
                  </p>
                </div>
              </div>
            )}

            {/* Frame & Lens Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-1.5">
                <span className="font-bold block">Selected Frame</span>
                <div>Model: <span className="font-semibold">{selectedJob.frameName}</span></div>
                <div>SKU: <span className="font-mono">{selectedJob.frameSku}</span></div>
                <div className="text-zinc-500">Workshop: In-House Bevel & Groove</div>
              </div>

              <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-1.5">
                <span className="font-bold block">Lens Specification</span>
                <div>Design: <span className="font-semibold">{selectedJob.lensSpec.type}</span></div>
                <div>Material: {selectedJob.lensSpec.material}</div>
                <div>Coatings: {selectedJob.lensSpec.coatings.join(", ")}</div>
              </div>
            </div>

            {/* Precision Fitting Measurements */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-3 bg-zinc-50/50 dark:bg-zinc-900/40">
              <span className="font-bold text-xs uppercase tracking-wider block border-b border-zinc-200 dark:border-zinc-800 pb-1">
                Precision Dispensing & Fitting Geometry
              </span>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Pupil Height (OD / OS)</span>
                  <span className="font-bold font-mono text-xs">{selectedJob.fittingMeasurements.pupilHeightOd} / {selectedJob.fittingMeasurements.pupilHeightOs}</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Pantoscopic Tilt</span>
                  <span className="font-bold font-mono text-xs">{selectedJob.fittingMeasurements.pantoscopicTilt}</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Vertex Distance</span>
                  <span className="font-bold font-mono text-xs">{selectedJob.fittingMeasurements.vertexDistance}</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Wrap Angle</span>
                  <span className="font-bold font-mono text-xs">{selectedJob.fittingMeasurements.wrapAngle}</span>
                </div>
              </div>
            </div>

            {/* Status Workflow Progress Buttons */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-bold block">Advance Job Status</span>
              <div className="flex flex-wrap gap-1.5">
                {columns.map((colStatus) => (
                  <Button
                    key={colStatus}
                    size="sm"
                    variant={selectedJob.status === colStatus ? "default" : "outline"}
                    className="h-7 text-xs px-2.5"
                    onClick={() => {
                      updateLabJobStatus(selectedJob.id, colStatus);
                      setSelectedJob({ ...selectedJob, status: colStatus });
                    }}
                  >
                    {colStatus}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Workshop Job Modal */}
      <Dialog open={newJobModalOpen} onOpenChange={setNewJobModalOpen}>
        <DialogContent onClose={() => setNewJobModalOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Optical Workshop Job</DialogTitle>
            <DialogDescription>
              Assign prescription order to lab surfacing & mounting workflow
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs py-2">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Select Patient *</label>
              <select
                value={newPatientId}
                onChange={(e) => setNewPatientId(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.patientNo})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Frame Model</label>
                <Input value={newFrameName} onChange={(e) => setNewFrameName(e.target.value)} />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Lens Design</label>
                <Input value={newLensType} onChange={(e) => setNewLensType(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Surfacing / Edging Lab</label>
              <select
                value={newLabName}
                onChange={(e) => setNewLabName(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                <option value="OptoVision In-House Edging Workshop">OptoVision In-House Edging Workshop</option>
                <option value="Labo Optique Caraïbes (Port-au-Prince)">Labo Optique Caraïbes (Port-au-Prince)</option>
                <option value="Essilor Digital Surfacing Lab (Miami)">Essilor Digital Surfacing Lab (Miami)</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewJobModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Job Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
