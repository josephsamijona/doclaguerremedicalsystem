import React from "react";
import { StoreProvider, useStore } from "@/src/lib/mock/store";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Header } from "@/src/components/layout/header";
import { CommandPalette } from "@/src/components/layout/command-palette";
import { DevToolbar } from "@/src/components/layout/dev-toolbar";
import { Toaster } from "sonner";

// Screens
import { DashboardView } from "@/src/components/screens/dashboard-view";
import { PatientsView } from "@/src/components/screens/patients-view";
import { AppointmentsView } from "@/src/components/screens/appointments-view";
import { ConsultationsView } from "@/src/components/screens/consultations-view";
import { PrescriptionsView } from "@/src/components/screens/prescriptions-view";
import { LabView } from "@/src/components/screens/lab-view";
import { InventoryView } from "@/src/components/screens/inventory-view";
import { BillingView } from "@/src/components/screens/billing-view";
import { InsuranceView } from "@/src/components/screens/insurance-view";
import { ReportsView } from "@/src/components/screens/reports-view";
import { SettingsView } from "@/src/components/screens/settings-view";
import { PatientPortalView } from "@/src/components/screens/patient-portal-view";

function AppContent() {
  const { currentView } = useStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "patients":
        return <PatientsView />;
      case "appointments":
        return <AppointmentsView />;
      case "consultations":
        return <ConsultationsView />;
      case "prescriptions":
        return <PrescriptionsView />;
      case "lab":
        return <LabView />;
      case "inventory":
        return <InventoryView />;
      case "billing":
        return <BillingView />;
      case "insurance":
        return <InsuranceView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      case "patient-portal":
        return <PatientPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
          {renderCurrentView()}
        </main>
      </div>

      {/* Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette />

      {/* Floating State Simulator (Empty, Loading, Error state tester) */}
      <DevToolbar />

      {/* Global Toast Notifications */}
      <Toaster position="bottom-right" theme="system" />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
