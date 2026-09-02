import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Building2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  SlidersHorizontal,
  LogOut,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { UserRole } from "@/src/types";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

export function Header() {
  const {
    currentView,
    setCurrentView,
    currentRole,
    setCurrentRole,
    setCommandPaletteOpen,
    theme,
    toggleTheme,
    patients,
    selectedPatientId,
    labOrders,
    inventory,
  } = useStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [clinicSelectOpen, setClinicSelectOpen] = useState(false);
  const [currentClinic, setCurrentClinic] = useState("Pétion-Ville Main Clinic");

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const delayedJobs = labOrders.filter((j) => j.isDelayed);
  const lowStockItems = inventory.filter((i) => i.stockQty <= i.minStockLevel);

  const roles: UserRole[] = [
    "Admin",
    "Practitioner",
    "Technician",
    "Receptionist",
    "Optician",
    "Accountant",
    "Patient",
  ];

  const getViewBreadcrumb = () => {
    switch (currentView) {
      case "overview":
        return "Overview";
      case "patients":
        return "Patients";
      case "patient-detail":
        return `Patients / ${selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Detail"}`;
      case "appointments":
        return "Appointments & Queue";
      case "consultations":
        return "Consultations";
      case "consultation-detail":
        return "Consultations / Clinical Exam";
      case "prescriptions":
        return "Prescriptions";
      case "prescription-detail":
        return "Prescriptions / Preview";
      case "lab":
        return "Lab & Workshop Kanban";
      case "lab-detail":
        return "Lab & Workshop / Job Order";
      case "inventory":
        return "Inventory & Frames";
      case "billing":
        return "Billing & Documents";
      case "invoice-detail":
        return "Billing / Invoice";
      case "insurance":
        return "Insurance & Claims";
      case "reports":
        return "Reports & Analytics";
      case "settings":
        return "Settings";
      case "patient-portal":
        return "Patient Portal";
      default:
        return "Management";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 sm:px-6 transition-colors">
      {/* Left: Breadcrumbs & Clinic Switcher */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Clinic Switcher */}
        <div className="relative">
          <button
            onClick={() => setClinicSelectOpen(!clinicSelectOpen)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden md:inline">{currentClinic}</span>
            <span className="md:hidden">Clinic</span>
          </button>

          {clinicSelectOpen && (
            <div className="absolute left-0 mt-1 w-56 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
              {["Pétion-Ville Main Clinic", "Delmas 75 Branch", "Cap-Haïtien Satellite Center"].map(
                (clinic) => (
                  <button
                    key={clinic}
                    onClick={() => {
                      setCurrentClinic(clinic);
                      setClinicSelectOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                      currentClinic === clinic
                        ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {clinic}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <ChevronRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />

        {/* Current View Breadcrumb */}
        <nav className="flex items-center text-xs text-zinc-400 dark:text-zinc-500 gap-1.5 truncate max-w-[200px] sm:max-w-xs">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-700 shrink-0" />
          <span className="text-black dark:text-white font-medium truncate">
            {getViewBreadcrumb()}
          </span>
        </nav>
      </div>

      {/* Center: Search Field (High Density Input) */}
      <div className="hidden md:flex flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <div className="absolute left-2.5 top-2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search records (Cmd+K)"
            onClick={() => setCommandPaletteOpen(true)}
            readOnly
            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-md py-1.5 pl-8 pr-3 text-xs text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifications, Theme, User */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Mobile Search button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="md:hidden p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleSelectOpen(!roleSelectOpen)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white px-2.5 py-1 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
            <span>{currentRole} Role</span>
          </button>

          {roleSelectOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Simulate System Role
              </div>
              <div className="space-y-0.5 mt-1">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setRoleSelectOpen(false);
                      if (r === "Patient") {
                        setCurrentView("patient-portal");
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between ${
                      currentRole === r
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-semibold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-8 h-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {(delayedJobs.length > 0 || lowStockItems.length > 0) && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-xl z-50 text-left text-xs text-black dark:text-white animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
                <span className="font-semibold text-xs">Clinic Alerts & Notifications</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 uppercase">
                  {delayedJobs.length + lowStockItems.length} active
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {delayedJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => {
                      setCurrentView("lab");
                      setNotificationsOpen(false);
                    }}
                    className="p-2 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Lab Delay Alert: {j.orderNo}</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-[11px]">
                      Patient {j.patientName} - blank in customs hold.
                    </p>
                  </div>
                ))}
                {lowStockItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentView("inventory");
                      setNotificationsOpen(false);
                    }}
                    className="p-2 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Low Stock Alert: {item.name}</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-[11px]">
                      Only {item.stockQty} units remaining in {item.location}.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Inversion Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Monochrome Inversion (Light / Dark)"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white cursor-pointer"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-black dark:text-white">
            {currentRole === "Patient" ? "PT" : "JD"}
          </div>
        </div>
      </div>
    </header>
  );
}
