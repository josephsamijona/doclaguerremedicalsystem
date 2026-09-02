import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Sheet({ open, onOpenChange, children, side = "right" }: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const sideClasses = {
    top: "inset-x-0 top-0 border-b max-h-[85vh]",
    bottom: "inset-x-0 bottom-0 border-t max-h-[85vh]",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-md",
    right: "inset-y-0 right-0 h-full w-full sm:max-w-2xl border-l",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed z-50 bg-white dark:bg-zinc-950 p-6 shadow-2xl transition-transform duration-300 border-zinc-200 dark:border-zinc-800 overflow-y-auto text-black dark:text-white flex flex-col",
          sideClasses[side]
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 flex flex-col", className)}>{children}</div>;
}

export function SheetHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}>
      {children}
    </div>
  );
}

export function SheetFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SheetTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function SheetDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-zinc-500 dark:text-zinc-400 mt-1", className)}>
      {children}
    </p>
  );
}
