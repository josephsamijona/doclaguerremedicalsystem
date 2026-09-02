import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  Percent,
  Glasses,
  Award,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import {
  mockMonthlyRevenue,
  mockPractitionerStats,
  mockTopSellingItems,
} from "@/src/lib/mock/reports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";

export function ReportsView() {
  const [period, setPeriod] = useState("2026-YTD");

  const handleExport = (format: "CSV" | "PDF" | "Excel") => {
    toast.success(`Exporting Optical Analytics Report (${format}) for ${period}...`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Clinical & Financial Analytics</h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Executive KPI scorecard, optical dispensary conversion rates, and practitioner performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => handleExport("CSV")}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={() => handleExport("PDF")}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export Executive PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">Average Basket Value (Panier Moyen)</span>
          <div className="text-2xl font-bold font-mono">28,450 HTG</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12.4% vs previous quarter
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">Anti-Reflective Coating Attach Rate</span>
          <div className="text-2xl font-bold font-mono">82.4%</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Exceeds clinic target (75%)
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">2nd Pair / Sun Conversion Rate</span>
          <div className="text-2xl font-bold font-mono">24.6%</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 1 in 4 patients purchase 2nd pair
          </div>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">Appointment No-Show Rate</span>
          <div className="text-2xl font-bold font-mono">3.8%</div>
          <div className="text-[10px] text-zinc-500">
            Automated SMS reminders saved ~42 visits
          </div>
        </Card>
      </div>

      {/* Financial Revenue Chart */}
      <Card>
        <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Monthly Clinic Revenue Trend (HTG)</CardTitle>
            <CardDescription className="text-xs">
              Consolidated fees from clinical refractions, frame sales, and workshop services
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Total 2026: 37.8M HTG
          </Badge>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 text-xs shadow-md">
                          <div className="font-bold">{label}</div>
                          <div className="font-mono text-xs mt-1">
                            {data.revenueHTG.toLocaleString()} HTG (≈ ${data.revenueUSD.toLocaleString()} USD)
                          </div>
                          <div className="text-zinc-500 text-[10px]">
                            Consultations: {data.consultationsCount} exams
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenueHTG" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-black dark:fill-white" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid: Practitioner Performance & Top Sellers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Practitioner Productivity */}
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-semibold">Practitioner Productivity & Optical Conversion</CardTitle>
            <CardDescription className="text-xs">
              Exam volume, dispensary conversion rate, and revenue generation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Practitioner</TableHead>
                  <TableHead>Exams</TableHead>
                  <TableHead>Dispensary Conv.</TableHead>
                  <TableHead className="text-right">Revenue (HTG)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPractitionerStats.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="text-xs font-medium">{p.name}</TableCell>
                    <TableCell className="text-xs font-mono">{p.consultationsCount}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary">{p.opticalConversionRate}%</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-right">
                      {p.revenueHTG.toLocaleString()} G
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top-Selling Optical Products */}
        <Card>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-semibold">Top-Selling Eyewear & Lens Treatments</CardTitle>
            <CardDescription className="text-xs">
              Fastest-moving inventory SKUs by units and revenue
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product / Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead className="text-right">Revenue (HTG)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopSellingItems.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell>
                      <div className="font-semibold text-xs">{item.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">SKU: {item.sku}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{item.unitsSold}</TableCell>
                    <TableCell className="text-xs font-mono font-bold text-right">
                      {item.revenueHTG.toLocaleString()} G
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
