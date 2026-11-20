import * as React from "react";
import { Card } from "./ui/card";
import { IconTile, type TileTone } from "./icon-tile";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  tone,
  label,
  value,
  sub,
  className,
}: {
  icon: React.ReactNode;
  tone: TileTone;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card tone={tone === "brand" || tone === "accent" ? tone : tone} className={cn("flex items-center gap-4 p-4 sm:p-5", className)}>
      <IconTile tone={tone}>{icon}</IconTile>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-muted">{label}</p>
        <p className="font-display text-[28px] font-black leading-none tnum">{value}</p>
        {sub && <p className="mt-1 truncate text-xs text-ink-muted">{sub}</p>}
      </div>
    </Card>
  );
}
