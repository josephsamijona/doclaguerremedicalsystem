import React, { useState } from "react";
import {
  Shield,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  FileCheck,
  Building,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { InsuranceClaim } from "@/src/types";
import { mockInsurers } from "@/src/lib/mock/insurers";
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

export function InsuranceView() {
  const { claims, submitClaim, patients, invoices } = useStore();

  const [activeTab, setActiveTab] = useState<"Claims" | "Insurers" | "Aging">("Claims");
  const [newClaimModalOpen, setNewClaimModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [claimDetailModalOpen, setClaimDetailModalOpen] = useState(false);

  // New Claim State
  const [claimInsurerId, setClaimInsurerId] = useState("INS-01");
  const [claimPatientId, setClaimPatientId] = useState(patients[0]?.id || "PT-001");
  const [claimPolicyNo, setClaimPolicyNo] = useState("POL-8821");
  const [claimAmount, setClaimAmount] = useState(14000);
  const [claimPreAuth, setClaimPreAuth] = useState("PRE-2026-904");

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === claimPatientId);
    const insurer = mockInsurers.find((i) => i.id === claimInsurerId);

    submitClaim({
      insurerId: claimInsurerId,
      insurerName: insurer?.name || "OFATMA",
      patientId: claimPatientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Patient",
      policyNo: claimPolicyNo,
      preAuthNo: claimPreAuth,
      claimAmountHTG: claimAmount,
    });

    setNewClaimModalOpen(false);
  };

  const getStatusBadge = (status: InsuranceClaim["status"]) => {
    switch (status) {
      case "Paid":
        return <Badge variant="secondary">Paid</Badge>;
      case "Approved":
        return <Badge variant="default">Approved</Badge>;
      case "Submitted":
        return <Badge variant="outline">Submitted</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate Aging
  const totalClaimsSum = claims.reduce((sum, c) => sum + c.claimAmountHTG, 0);
  const currentAging = Math.round(totalClaimsSum * 0.45);
  const aging30to60 = Math.round(totalClaimsSum * 0.30);
  const aging61to90 = Math.round(totalClaimsSum * 0.15);
  const agingOver90 = Math.round(totalClaimsSum * 0.10);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Insurance & Third-Party Claims</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Submit and track coverage claims for OFATMA, AIC Assurances, SunAssurance, and aging receivables
          </p>
        </div>

        <Button onClick={() => setNewClaimModalOpen(true)} size="sm" className="text-xs">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Submit New Claim
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="Claims">Claims Registry ({claims.length})</TabsTrigger>
          <TabsTrigger value="Insurers">Affiliated Providers ({mockInsurers.length})</TabsTrigger>
          <TabsTrigger value="Aging">Aging Receivables Report</TabsTrigger>
        </TabsList>

        {/* TAB 1: CLAIMS REGISTRY */}
        <TabsContent value="Claims" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim No</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Insurance Company</TableHead>
                    <TableHead>Policy No.</TableHead>
                    <TableHead>Pre-Auth</TableHead>
                    <TableHead>Claim Amount (HTG)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      onClick={() => {
                        setSelectedClaim(c);
                        setClaimDetailModalOpen(true);
                      }}
                    >
                      <TableCell className="font-mono text-xs font-bold">{c.claimNo}</TableCell>
                      <TableCell className="text-xs">{c.submissionDate}</TableCell>
                      <TableCell className="font-medium text-xs">{c.patientName}</TableCell>
                      <TableCell className="text-xs">{c.insurerName}</TableCell>
                      <TableCell className="font-mono text-xs text-zinc-500">{c.policyNo}</TableCell>
                      <TableCell className="font-mono text-xs">{c.preAuthNo || "N/A"}</TableCell>
                      <TableCell className="font-mono text-xs font-bold">{c.claimAmountHTG.toLocaleString()} G</TableCell>
                      <TableCell>{getStatusBadge(c.status)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedClaim(c);
                            setClaimDetailModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: INSURERS DIRECTORY */}
        <TabsContent value="Insurers" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockInsurers.map((ins) => (
              <Card key={ins.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="font-bold text-sm">{ins.name}</span>
                  <Badge variant="secondary">{ins.standardCoveragePercent}% Coverage</Badge>
                </div>
                <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
                  <div>Code: {ins.code}</div>
                  <div>Phone: {ins.contactPhone}</div>
                  <div>Email: {ins.contactEmail}</div>
                  <div className="pt-1 text-[11px] text-zinc-500">
                    Pre-Auth Required: {ins.requiresPreAuth ? "Yes (Mandatory)" : "No"}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7"
                  onClick={() => toast.success(`EDI Portal connected to ${ins.name}`)}
                >
                  Check Portal Status
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: AGING RECEIVABLES */}
        <TabsContent value="Aging" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Current (&lt;30 Days)</span>
              <div className="text-xl font-bold font-mono">{currentAging.toLocaleString()} HTG</div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black dark:bg-white h-full w-[45%]" />
              </div>
            </Card>
            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">31 – 60 Days</span>
              <div className="text-xl font-bold font-mono">{aging30to60.toLocaleString()} HTG</div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black dark:bg-white h-full w-[30%]" />
              </div>
            </Card>
            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">61 – 90 Days</span>
              <div className="text-xl font-bold font-mono">{aging61to90.toLocaleString()} HTG</div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black dark:bg-white h-full w-[15%]" />
              </div>
            </Card>
            <Card className="p-4 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">90+ Days Overdue</span>
              <div className="text-xl font-bold font-mono text-black dark:text-white underline">
                {agingOver90.toLocaleString()} HTG
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-black dark:bg-white h-full w-[10%]" />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <Dialog open={claimDetailModalOpen} onOpenChange={setClaimDetailModalOpen}>
          <DialogContent onClose={() => setClaimDetailModalOpen(false)} className="max-w-md">
            <DialogHeader>
              <DialogTitle>Claim: {selectedClaim.claimNo}</DialogTitle>
              <DialogDescription>
                Provider: {selectedClaim.insurerName} · Patient: {selectedClaim.patientName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs py-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-zinc-500">Status:</span>
                {getStatusBadge(selectedClaim.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Policy Number:</span>
                <span className="font-mono font-bold">{selectedClaim.policyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Pre-Authorization:</span>
                <span className="font-mono">{selectedClaim.preAuthNo || "Direct Filing"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Claim Amount:</span>
                <span className="font-mono font-bold">{selectedClaim.claimAmountHTG.toLocaleString()} HTG</span>
              </div>
              {selectedClaim.rejectionReason && (
                <div className="p-2.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                  <span className="font-bold block mb-0.5">Rejection Explanation:</span>
                  {selectedClaim.rejectionReason}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setClaimDetailModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Claim Modal */}
      <Dialog open={newClaimModalOpen} onOpenChange={setNewClaimModalOpen}>
        <DialogContent onClose={() => setNewClaimModalOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>File Insurance Claim</DialogTitle>
            <DialogDescription>
              Submit third-party reimbursement paperwork with clinical diagnostic codes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateClaim} className="space-y-3.5 text-xs py-2">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Select Insurer *</label>
              <select
                value={claimInsurerId}
                onChange={(e) => setClaimInsurerId(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                {mockInsurers.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name} ({ins.standardCoveragePercent}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Patient *</label>
              <select
                value={claimPatientId}
                onChange={(e) => setClaimPatientId(e.target.value)}
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
                <label className="block text-zinc-500 mb-1 font-medium">Policy / Card ID</label>
                <Input value={claimPolicyNo} onChange={(e) => setClaimPolicyNo(e.target.value)} />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1 font-medium">Pre-Auth Number</label>
                <Input value={claimPreAuth} onChange={(e) => setClaimPreAuth(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Claim Amount (HTG)</label>
              <Input
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(parseInt(e.target.value) || 0)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewClaimModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Claim</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
