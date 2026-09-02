import * as React from "react";
import { cn } from "@/src/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800", className)}
      {...props}
    />
  );
}

export function Avatar({
  className,
  src,
  alt,
  fallback,
}: {
  className?: string;
  src?: string;
  alt?: string;
  fallback: string;
}) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold items-center justify-center text-black dark:text-white select-none",
        className
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
