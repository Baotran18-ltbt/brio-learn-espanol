"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => {
    const v = Math.max(0, Math.min(100, value));
    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={v}
        className={cn("relative h-3 w-full overflow-hidden rounded-full bg-ink/[0.07]", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "relative h-full rounded-full bg-accent transition-[width] duration-700 ease-out after:absolute after:left-2 after:right-2 after:top-[3px] after:h-[3px] after:rounded-full after:bg-white/40",
            indicatorClassName,
          )}
          style={{ width: `${v}%` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = "Progress";
