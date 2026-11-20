import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        brand: "bg-brand-soft text-brand",
        accent: "bg-accent-soft text-accent-dark",
        success: "bg-success-soft text-success-dark",
        danger: "bg-danger-soft text-danger-dark",
        neutral: "bg-ink/5 text-ink-soft",
        outline: "border border-line-strong bg-white text-ink-soft",
        sky: "bg-pastel-sky text-tone-sky",
        lilac: "bg-pastel-lilac text-tone-lilac",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Nhãn pill kiểu "LEVEL 03 · Features" trong hình tham khảo. */
export function Pill({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 border-b-[4px] border-line-strong bg-white px-4 py-1.5 text-sm font-semibold text-ink",
        className,
      )}
    >
      <span className="font-display font-black uppercase tracking-[0.12em] text-brand">{label}</span>
      {children}
    </span>
  );
}
