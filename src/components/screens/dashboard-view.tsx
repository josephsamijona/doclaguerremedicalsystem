import React from "react";
import {
  Calendar,
  Users,
  DollarSign,
  Layers,
  AlertCircle,
  TrendingUp,
  Clock,
  Plus,
  Glasses,
  FileText,
  Receipt,
  UserCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/src/lib/mock/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton-avatar";
import { formatCurrency } from "@/src/lib/utils";

export function DashboardView() {
  const {
    appointments,
    consultations,
    invoices,
    labOrders,
    patients,
    updateAppointmentStatus,
    setCurrentView,
    setSelectedPatientId,
    setSelectedConsultationId,
    devEmptyState,
    devLoadingState,
    devErrorState,
  } = useStore();

  if (devLoadingState) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (devErrorState) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
          <AlertCircle className="h-6 w-6 text-black dark:text-white" />
        </div>
        <h3 className="mt-4 text-base font-semibold">Simulated Clinical Service Error</h3>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm mx-auto">
          Unable to synchronize with the diagnostic imaging server. Please verify your connection or click retry.
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry Diagnostics
        </Button>
      </div>
    );
  }

  // Today's appointments
  const todayApts = appointments.filter((a) => a.date === "2026-09-02");
  const completedToday = todayApts.filter((a) => a.status === "Completed").length;
  const noShows = appointments.filter((a) => a.status === "No-show").length;
  const totalCompletedOrNoShow = appointments.filter((a) =>
    ["Completed", "No-show"].includes(a.status)
  ).length;
  const noShowRate = totalCompletedOrNoShow > 0 ? Math.round((noShows / totalCompletedOrNoShow) * 100) : 4;

  const todayRevenue = invoices
    .filter((inv) => inv.date === "2026-09-02" || inv.date === "2026-08-30")
    .reduce((sum, inv) => sum + inv.amountPaidHTG, 0);

  const pendingLabJobs = labOrders.filter(
    (j) => !["Delivered"].includes(j.status)
  ).length;
  const delayedLabJobs = labOrders.filter((j) => j.isDelayed).length;

  const outstandingTotal = patients.reduce((sum, p) => sum + (p.balance || 0), 0);

  // Revenue chart 30 days data
  const revenueChartData = [
    { date: "Aug 04", revenue: 84000 },
    { date: "Aug 08", revenue: 112000 },
    { date: "Aug 12", revenue: 95000 },
    { date: "Aug 16", revenue: 140000 },
    { date: "Aug 20", revenue: 128000 },
    { date: "Aug 24", revenue: 165000 },
    { date: "Aug 28", revenue: 198000 },
    { date: "Sep 02", revenue: 215000 },
  ];

  // Appointments per practitioner
  const practitionerAppointmentsData = [
    { name: "Dr. Pierre-Louis", count: 38 },
    { name: "Dr. Augustin", count: 32 },
    { name: "Dr. Delmas", count: 24 },
    { name: "Dr. Saint-Juste", count: 26 },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "secondary";
      case "In consultation":
        return "default";
      case "Waiting":
      case "Checked in":
        return "outline";
      case "No-show":
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Clinical Dashboard</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Wednesday, September 2, 2026 · Morning Clinical Session Active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setCurrentView("appointments")}
            className="text-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Book Appointment
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentView("consultations")}
            className="text-xs"
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" /> New Consultation
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentView("billing")}
            className="text-xs"
          >
            <Receipt className="mr-1.5 h-3.5 w-3.5" /> New Invoice
          </Button>
        </div>
      </div>

      {/* 4 Primary High Density Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            Today's Appointments
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {devEmptyState ? 0 : 24}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">+4 from yesterday</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            Patients Seen
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {devEmptyState ? 0 : 18}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">75% of target</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            Revenue (HTG)
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {devEmptyState ? "0" : "84,250"}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Live update</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
            Pending Lab Orders
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {devEmptyState ? 0 : 12}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">3 high priority</span>
          </div>
        </div>
      </div>

      {/* High Density Grid: Revenue Area Chart (2 cols) & Status Breakdown (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-black dark:text-white">
              Revenue Trend (Last 30 Days)
            </h3>
            <div className="flex gap-1.5">
              <span className="text-[10px] border border-zinc-200 dark:border-zinc-700 bg-zinc-900 text-white dark:bg-white dark:text-black px-2 py-0.5 rounded font-medium cursor-pointer">
                HTG
              </span>
              <span className="text-[10px] border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
                USD
              </span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-zinc-800" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    borderColor: "#333",
                    color: "#fff",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                  formatter={(val: number) => [`${val.toLocaleString()} HTG`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#000000"
                  strokeWidth={2}
                  className="dark:stroke-white"
                  fill="#f4f4f5"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown with Dense Progress Bars */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-black dark:text-white mb-3">
            Status Breakdown
          </h3>
          <div className="space-y-3.5 my-auto">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Booked</span>
              <div className="flex-1 mx-3 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-zinc-300 dark:bg-zinc-600 h-full" style={{ width: "45%" }} />
              </div>
              <span className="font-bold text-black dark:text-white w-8 text-right">45%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Checked In</span>
              <div className="flex-1 mx-3 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-zinc-900 dark:bg-zinc-100 h-full" style={{ width: "20%" }} />
              </div>
              <span className="font-bold text-black dark:text-white w-8 text-right">20%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Completed</span>
              <div className="flex-1 mx-3 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-zinc-500 dark:bg-zinc-400 h-full" style={{ width: "30%" }} />
              </div>
              <span className="font-bold text-black dark:text-white w-8 text-right">30%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">No-show</span>
              <div className="flex-1 mx-3 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-zinc-200 dark:bg-zinc-700 h-full" style={{ width: "5%" }} />
              </div>
              <span className="font-bold text-black dark:text-white w-8 text-right">5%</span>
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 flex justify-between">
            <span>Total sessions: 24</span>
            <span>Target: 95% throughput</span>
          </div>
        </div>
      </div>

      {/* Today's Queue Data Table */}
      <Card>
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <CardTitle className="text-sm font-semibold">Today's Patient Queue Board</CardTitle>
            <CardDescription className="text-xs">
              Live consultation workflow status (September 2, 2026)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView("appointments")}
            className="text-xs"
          >
            Open Full Queue Manager <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {devEmptyState || todayApts.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No appointments scheduled for today. Click "Book Appointment" to add one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden md:table-cell">Practitioner</TableHead>
                  <TableHead className="hidden sm:table-cell">Visit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Quick Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayApts.slice(0, 8).map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      {apt.startTime}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedPatientId(apt.patientId);
                          setCurrentView("patient-detail");
                        }}
                        className="font-medium hover:underline text-left cursor-pointer"
                      >
                        {apt.patientName}
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-zinc-600 dark:text-zinc-400">
                      {apt.practitionerName.split(" ")[1]}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs">
                      {apt.visitType}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(apt.status)}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {apt.status === "Booked" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2"
                          onClick={() => updateAppointmentStatus(apt.id, "Checked in")}
                        >
                          Check In
                        </Button>
                      )}
                      {apt.status === "Checked in" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2"
                          onClick={() => updateAppointmentStatus(apt.id, "In consultation")}
                        >
                          Start Exam
                        </Button>
                      )}
                      {apt.status === "In consultation" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                        >
                          Complete
                        </Button>
                      )}
                      {apt.status === "Completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2"
                          onClick={() => {
                            setSelectedPatientId(apt.patientId);
                            setCurrentView("consultations");
                          }}
                        >
                          View Rx
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
