import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  FileText,
  Glasses,
  Receipt,
  Settings,
  Shield,
  Activity,
  Box,
  Layers,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Dialog } from "@/src/components/ui/dialog";

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentView,
    patients,
    inventory,
    setSelectedPatientId,
  } = useStore();

  const [query, setQuery] = useState("");

  if (!commandPaletteOpen) return null;

  const filteredPatients = patients
    .filter((p) =>
      `${p.firstName} ${p.lastName} ${p.patientNo} ${p.phone}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 5);

  const filteredFrames = inventory
    .filter(
      (item) =>
        item.category === "Frames" &&
        `${item.name} ${item.sku} ${item.brand}`
          .toLowerCase()
          .includes(query.toLowerCase())
    )
    .slice(0, 4);

  const navActions = [
    { label: "Dashboard Overview", icon: Activity, view: "overview" as const },
    { label: "Patients Directory", icon: User, view: "patients" as const },
    { label: "Appointments & Queue", icon: Calendar, view: "appointments" as const },
    { label: "Clinical Consultations", icon: FileText, view: "consultations" as const },
    { label: "Optical Prescriptions", icon: Glasses, view: "prescriptions" as const },
    { label: "Lab & Workshop Kanban", icon: Layers, view: "lab" as const },
    { label: "Frames & Lens Inventory", icon: Box, view: "inventory" as const },
    { label: "Billing & Invoices", icon: Receipt, view: "billing" as const },
    { label: "Insurance Claims & Aging", icon: Shield, view: "insurance" as const },
    { label: "Clinic Reports & Analytics", icon: Activity, view: "reports" as const },
    { label: "System Settings & Logs", icon: Settings, view: "settings" as const },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <Search className="mr-3 h-5 w-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search patients, frames, prescriptions, or jump to screen... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-black dark:text-white placeholder:text-zinc-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 text-xs text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Navigation Section */}
          {navActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Screens & Navigation
              </div>
              <div className="space-y-0.5 mt-1">
                {navActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.view}
                      onClick={() => {
                        setCurrentView(action.view);
                        setCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors text-left"
                    >
                      <Icon className="h-4 w-4 text-zinc-500" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Patients Section */}
          {filteredPatients.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Patients ({filteredPatients.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setCurrentView("patient-detail");
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-zinc-400" />
                      <span className="font-medium text-black dark:text-white">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">({p.patientNo})</span>
                    </div>
                    <span className="text-xs text-zinc-500">{p.phone}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Frames Section */}
          {filteredFrames.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Optical Frames
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredFrames.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setCurrentView("inventory");
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Glasses className="h-4 w-4 text-zinc-400" />
                      <span>{f.name}</span>
                      <span className="text-xs text-zinc-400 font-mono">{f.sku}</span>
                    </div>
                    <span className="text-xs font-medium text-black dark:text-white">
                      {f.retailPriceHTG.toLocaleString()} HTG
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {navActions.length === 0 && filteredPatients.length === 0 && filteredFrames.length === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500">
              No matching results found for "{query}".
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
