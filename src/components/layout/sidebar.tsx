import React, { useState } from "react";
import {
  Activity,
  Users,
  Calendar,
  FileText,
  Glasses,
  Layers,
  Box,
  Receipt,
  Shield,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
} from "lucide-react";
import { useStore, ActiveView } from "@/src/lib/mock/store";
import { mockRolePermissions } from "@/src/lib/mock/settings";
import { Badge } from "@/src/components/ui/badge";

interface NavItem {
  id: string;
  label: string;
  view: ActiveView;
  icon: React.ElementType;
  section: "main" | "clinical" | "operations" | "portal";
  badge?: string;
}

export function Sidebar() {
  const { currentView, setCurrentView, currentRole, labOrders, appointments } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  const delayedJobsCount = labOrders.filter((j) => j.isDelayed).length;
  const todayAptsCount = appointments.filter((a) => a.date === "2026-09-02").length;

  const allowedModules = mockRolePermissions[currentRole] || [];

  const allNavItems: NavItem[] = [
    // Main Section
    {
      id: "overview",
      label: "Overview",
      view: "overview",
      icon: Activity,
      section: "main",
    },
    {
      id: "patients",
      label: "Patients",
      view: "patients",
      icon: Users,
      section: "main",
    },
    {
      id: "appointments",
      label: "Appointments",
      view: "appointments",
      icon: Calendar,
      section: "main",
      badge: todayAptsCount > 0 ? String(todayAptsCount) : undefined,
    },
    // Clinical Section
    {
      id: "consultations",
      label: "Consultations",
      view: "consultations",
      icon: FileText,
      section: "clinical",
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      view: "prescriptions",
      icon: Glasses,
      section: "clinical",
    },
    {
      id: "lab",
      label: "Lab & Workshop",
      view: "lab",
      icon: Layers,
      section: "clinical",
      badge: delayedJobsCount > 0 ? "Alert" : undefined,
    },
    // Operations Section
    {
      id: "inventory",
      label: "Inventory",
      view: "inventory",
      icon: Box,
      section: "operations",
    },
    {
      id: "billing",
      label: "Billing",
      view: "billing",
      icon: Receipt,
      section: "operations",
    },
    {
      id: "insurance",
      label: "Insurance",
      view: "insurance",
      icon: Shield,
      section: "operations",
    },
    {
      id: "reports",
      label: "Reports",
      view: "reports",
      icon: BarChart3,
      section: "operations",
    },
    {
      id: "settings",
      label: "Settings",
      view: "settings",
      icon: Settings,
      section: "operations",
    },
  ];

  const patientPortalNav: NavItem[] = [
    {
      id: "portal-appointments",
      label: "My Appointments",
      view: "patient-portal",
      icon: Calendar,
      section: "portal",
    },
    {
      id: "portal-prescriptions",
      label: "My Prescriptions",
      view: "patient-portal",
      icon: Glasses,
      section: "portal",
    },
    {
      id: "portal-invoices",
      label: "My Invoices & Receipts",
      view: "patient-portal",
      icon: Receipt,
      section: "portal",
    },
    {
      id: "portal-documents",
      label: "Clinical Records",
      view: "patient-portal",
      icon: FileText,
      section: "portal",
    },
  ];

  const visibleNav =
    currentRole === "Patient"
      ? patientPortalNav
      : allNavItems.filter((item) => allowedModules.includes(item.id));

  const sections: { key: NavItem["section"]; title: string }[] =
    currentRole === "Patient"
      ? [{ key: "portal", title: "Patient Portal" }]
      : [
          { key: "main", title: "Main" },
          { key: "clinical", title: "Clinical" },
          { key: "operations", title: "Operations" },
        ];

  return (
    <aside
      className={`relative flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black transition-all duration-300 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Clinic Brand Header - High Density Style */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center text-white dark:text-black font-bold shrink-0 text-sm">
            O
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold leading-none text-black dark:text-white truncate">
                OPTICARE Pro
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-tight font-medium truncate">
                Clinic Management
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List with High Density Groupings */}
      <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
        {sections.map((sec) => {
          const items = visibleNav.filter((item) => item.section === sec.key);
          if (items.length === 0) return null;

          return (
            <div key={sec.key} className="space-y-1">
              {!collapsed && (
                <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase px-3 mb-1 tracking-widest">
                  {sec.title}
                </div>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentView === item.view ||
                  (item.view === "patients" && currentView === "patient-detail") ||
                  (item.view === "consultations" && currentView === "consultation-detail") ||
                  (item.view === "prescriptions" && currentView === "prescription-detail") ||
                  (item.view === "lab" && currentView === "lab-detail") ||
                  (item.view === "billing" && currentView === "invoice-detail");

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.view)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-md font-medium transition-colors cursor-pointer group ${
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-semibold"
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-black dark:hover:text-white"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    />

                    {!collapsed && (
                      <div className="flex flex-1 items-center justify-between overflow-hidden">
                        <span className="truncate text-left text-[13px]">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                              isActive
                                ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                                : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-transparent"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer - High Density Profile Card */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-black dark:text-white shrink-0">
              {currentRole === "Practitioner"
                ? "DP"
                : currentRole === "Patient"
                ? "PT"
                : "JD"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-black dark:text-white truncate">
                {currentRole === "Practitioner"
                  ? "Dr. Pierre-Louis"
                  : currentRole === "Patient"
                  ? "J. Alexandre"
                  : "Dr. Jean Dupont"}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                {currentRole === "Admin" ? "Admin/Practitioner" : currentRole}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-black dark:text-white">
              JD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
