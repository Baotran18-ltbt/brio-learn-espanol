import * as React from "react";
import { cn } from "@/lib/utils";
import { IconTile, type TileTone } from "./icon-tile";

export function EmptyState({
  icon,
  tone = "butter",
  title,
  children,
  action,
  className,
}: {
  icon: React.ReactNode;
  tone?: TileTone;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("chunky flex flex-col items-center gap-3 border-dashed border-line-strong px-6 py-12 text-center", className)}>
      <IconTile tone={tone} size="lg">
        {icon}
      </IconTile>
      <h3 className="font-display text-xl font-black">{title}</h3>
      {children && <div className="max-w-md text-ink-muted">{children}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-ink/[0.06]", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải">
      <Skeleton className="h-8 w-48 rounded-full" />
      <Skeleton className="h-12 w-3/4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
