import React, { useState } from "react";
import {
  Building,
  Save,
  Download,
} from "lucide-react";
import {
  mockClinicProfile,
  mockOpeningHours,
  mockRooms,
  mockAuditLogs,
} from "@/src/lib/mock/settings";
import { mockPractitioners } from "@/src/lib/mock/practitioners";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
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

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [clinicName, setClinicName] = useState(mockClinicProfile.name);
  const [address, setAddress] = useState(mockClinicProfile.address);
  const [phone, setPhone] = useState(mockClinicProfile.phone);
  const [taxId, setTaxId] = useState(mockClinicProfile.taxIdNIF);
  const [currencyRate, setCurrencyRate] = useState("132.50");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Clinic settings & currency configurations updated successfully");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">System Settings & Administration</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Clinic legal metadata, operating schedule, exam lane equipment, notification templates, and audit logs
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Clinic Profile</TabsTrigger>
          <TabsTrigger value="staff">Staff & Practitioners ({mockPractitioners.length})</TabsTrigger>
          <TabsTrigger value="lanes">Exam Rooms & Equipment ({mockRooms.length})</TabsTrigger>
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="audit">Security Audit Log</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        {/* TAB 1: Clinic Profile */}
        <TabsContent value="profile" className="space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Clinic Legal & Contact Information</CardTitle>
                <CardDescription className="text-xs">
                  This metadata appears on printable A5 Prescriptions, A4 Invoices, and Official Receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 mb-1 font-medium">Clinic Name</label>
                    <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1 font-medium">Tax ID / NIF</label>
                    <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 mb-1 font-medium">Street Address</label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1 font-medium">Contact Phone</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <label className="block text-zinc-500 mb-1 font-medium">Base Exchange Rate (USD to HTG)</label>
                    <Input
                      value={currencyRate}
                      onChange={(e) => setCurrencyRate(e.target.value)}
                      className="font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1 font-medium">Standard Value Added Tax (TCA)</label>
                    <Input value="10% (Fixed national rate)" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours Schedule */}
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-semibold">Operating Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day of Week</TableHead>
                      <TableHead>Opening Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOpeningHours.map((h) => (
                      <TableRow key={h.day}>
                        <TableCell className="text-xs font-semibold">{h.day}</TableCell>
                        <TableCell className="text-xs font-mono">
                          {h.isOpen ? `${h.open} – ${h.close}` : "Closed"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={h.isOpen ? "secondary" : "outline"}>
                            {h.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="sm" className="text-xs">
                <Save className="mr-1.5 h-3.5 w-3.5" /> Save Configuration
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* TAB 2: Staff & Practitioners */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Staff & Practitioner Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title & Specialty</TableHead>
                    <TableHead>Assigned Lane / Room</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPractitioners.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs font-bold">{p.name}</TableCell>
                      <TableCell className="text-xs">{p.title} · {p.specialty}</TableCell>
                      <TableCell className="text-xs">{p.room}</TableCell>
                      <TableCell className="text-xs font-mono">{p.schedule}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toast.success(`Schedule rules loaded for ${p.name}`)}
                        >
                          Schedule Rules
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Exam Lanes & Diagnostic Rooms */}
        <TabsContent value="lanes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockRooms.map((room) => (
              <Card key={room.id} className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">{room.name}</span>
                  <Badge variant="outline">{room.id}</Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{room.equipment}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: Notification Templates */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">SMS: 24-Hour Appointment Reminder</span>
                <Badge variant="secondary">Automated</Badge>
              </div>
              <Textarea
                className="text-xs font-mono"
                rows={3}
                defaultValue="Bonswa {{patient_name}}, rapèl pou randevou w nan Clinique Optique Vision Caraïbes demen {{time}} avèk {{doctor}}. Pou konfime, reponn WI."
              />
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Template saved")}>
                  Save Template
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">WhatsApp: Eyewear Ready for Pickup</span>
                <Badge variant="secondary">Automated</Badge>
              </div>
              <Textarea
                className="text-xs font-mono"
                rows={3}
                defaultValue="Chè {{patient_name}}, linèt ou yo (Kòmand #{{order_no}}) pare pou livre nan klinik Pétion-Ville! Tanpri pase pran yo ak resi w la."
              />
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Template saved")}>
                  Save Template
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: Security Audit Log */}
        <TabsContent value="audit">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">HIPAA / Security Audit Trail</CardTitle>
              <CardDescription className="text-xs">
                Immutable activity records of patient chart views, prescription signatures, and cash transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs text-zinc-500">{log.timestamp}</TableCell>
                      <TableCell className="text-xs font-semibold">{log.user}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline">{log.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{log.module}</TableCell>
                      <TableCell className="font-mono text-xs text-zinc-400">{log.ipAddress}</TableCell>
                      <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm truncate">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: Backup & Restore */}
        <TabsContent value="backup">
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-sm">System Database Snapshot & Local Persistence</h3>
              <p className="text-xs text-zinc-500">
                Generate an encrypted full snapshot of patient records, prescriptions, lab orders, and financial invoices.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="text-xs"
                onClick={() => toast.success("Encrypted snapshot generated: vision_caraibes_backup_2026-09-02.json")}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download Full Snapshot (.json)
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => toast.success("Local store reset to default baseline fixtures")}
              >
                Reset Database to Clean Baseline
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
