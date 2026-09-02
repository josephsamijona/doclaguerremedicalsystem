import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight transition-colors focus:outline-none focus:ring-1 focus:ring-black select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-black text-white dark:bg-white dark:text-black",
        secondary:
          "border-zinc-200 dark:border-zinc-700 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        destructive:
          "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-zinc-100 dark:text-black",
        outline:
          "border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400",
        subtle:
          "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "subtle" | null;
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

