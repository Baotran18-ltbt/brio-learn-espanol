import * as React from "react";
import { cn } from "@/lib/utils";

export type TileTone = "rose" | "peach" | "butter" | "sage" | "sky" | "lilac" | "brand" | "accent";

const tones: Record<TileTone, string> = {
  rose: "bg-pastel-rose border-[#F4C3CB] text-tone-rose",
  peach: "bg-pastel-peach border-[#FFD1B3] text-tone-peach",
  butter: "bg-pastel-butter border-[#F2DD95] text-tone-butter",
  sage: "bg-pastel-sage border-[#BFE3C9] text-tone-sage",
  sky: "bg-pastel-sky border-[#BFDDF3] text-tone-sky",
  lilac: "bg-pastel-lilac border-[#D8CBF1] text-tone-lilac",
  brand: "bg-brand-soft border-brand-tint text-brand",
  accent: "bg-accent-soft border-accent-tint text-accent-dark",
};

/** Ô biểu tượng bo tròn có viền, như góc trên trái mỗi thẻ trong hình tham khảo. */
export function IconTile({ tone, children, size = "md", className }: { tone: TileTone; children: React.ReactNode; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl border-2",
        size === "sm" && "size-9 [&_svg]:size-[18px]",
        size === "md" && "size-12 [&_svg]:size-6",
        size === "lg" && "size-14 [&_svg]:size-7",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
