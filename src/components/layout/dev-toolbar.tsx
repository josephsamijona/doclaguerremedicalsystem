import React, { useState } from "react";
import {
  Wrench,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertTriangle,
  FolderX,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

export function DevToolbar() {
  const {
    devEmptyState,
    setDevEmptyState,
    devLoadingState,
    setDevLoadingState,
    devErrorState,
    setDevErrorState,
    currentRole,
    setCurrentRole,
    setCurrentView,
  } = useStore();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {expanded ? (
        <div className="w-80 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4 shadow-2xl text-xs text-black dark:text-white animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-black dark:text-white" />
              <span className="font-bold">Prototype Dev Simulation</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded text-zinc-400 hover:text-black dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 mb-3">
            Simulate edge states and test empty, loading, or error boundaries:
          </p>

          <div className="space-y-2">
            {/* Empty State Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <FolderX className="h-4 w-4 text-zinc-500" />
                <span>Simulate Empty States</span>
              </div>
              <input
                type="checkbox"
                checked={devEmptyState}
                onChange={(e) => {
                  setDevEmptyState(e.target.checked);
                  toast(e.target.checked ? "Empty states enabled" : "Empty states disabled");
                }}
                className="h-4 w-4 rounded accent-black dark:accent-white cursor-pointer"
              />
            </div>

            {/* Loading Skeletons Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-zinc-500" />
                <span>Simulate Loading Skeletons</span>
              </div>
              <input
                type="checkbox"
                checked={devLoadingState}
                onChange={(e) => {
                  setDevLoadingState(e.target.checked);
                  toast(e.target.checked ? "Loading skeletons enabled" : "Loading skeletons disabled");
                }}
                className="h-4 w-4 rounded accent-black dark:accent-white cursor-pointer"
              />
            </div>

            {/* Error State Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-zinc-500" />
                <span>Simulate Network / Device Error</span>
              </div>
              <input
                type="checkbox"
                checked={devErrorState}
                onChange={(e) => {
                  setDevErrorState(e.target.checked);
                  toast(e.target.checked ? "Error state enabled" : "Error state disabled");
                }}
                className="h-4 w-4 rounded accent-black dark:accent-white cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">All data in-memory</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDevEmptyState(false);
                setDevLoadingState(false);
                setDevErrorState(false);
                toast.success("Simulation toggles reset to default live state");
              }}
              className="text-[11px] h-7"
            >
              Reset Live Data
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Dev States</span>
          {(devEmptyState || devLoadingState || devErrorState) && (
            <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
          )}
        </button>
      )}
    </div>
  );
}
