import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Thẻ chunky: viền 2px, đáy 5px — tông màu theo `tone`. */
const cardVariants = cva("chunky", {
  variants: {
    tone: {
      neutral: "border-line-strong",
      brand: "border-brand-tint border-b-brand/70",
      accent: "border-accent-tint border-b-accent/80",
      rose: "border-[#F4C3CB] border-b-tone-rose",
      peach: "border-[#FFD1B3] border-b-tone-peach",
      butter: "border-[#F2DD95] border-b-tone-butter",
      sage: "border-[#BFE3C9] border-b-tone-sage",
      sky: "border-[#BFDDF3] border-b-tone-sky",
      lilac: "border-[#D8CBF1] border-b-tone-lilac",
    },
    flat: { true: "border-b-2", false: "" },
  },
  defaultVariants: { tone: "neutral", flat: false },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, tone, flat, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ tone, flat }), className)} {...props} />
));
Card.displayName = "Card";

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0 sm:p-6 sm:pb-0", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-lg font-extrabold leading-tight", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-ink-muted", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export type Tone = NonNullable<CardProps["tone"]>;
