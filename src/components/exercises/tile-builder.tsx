"use client";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Ghép câu bằng thẻ — giống "Build the Sentence Using Blocks" trong hình tham khảo. */
export function TileBuilder({
  bank,
  value,
  onChange,
  locked,
  spanish,
}: {
  bank: string[];
  value: string[];
  onChange: (v: string[]) => void;
  locked: boolean;
  spanish?: boolean;
}) {
  // Lưu theo chỉ số để cho phép từ trùng nhau
  const usedIdx: number[] = [];
  value.forEach((w) => {
    const idx = bank.findIndex((b, i) => b === w && !usedIdx.includes(i));
    if (idx >= 0) usedIdx.push(idx);
  });

  const tileCls = cn(
    "rounded-xl border-2 border-b-[4px] border-line-strong bg-white px-3.5 py-2 text-[16px] font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-accent-tint disabled:hover:translate-y-0",
    spanish && "es text-[17px]",
  );

  return (
    <div className="space-y-4">
      <div
        className="flex min-h-[72px] flex-wrap content-start gap-2 rounded-2xl border-2 border-dashed border-line-strong bg-white/60 p-3"
        aria-label="Câu của bạn"
      >
        <AnimatePresence initial={false}>
          {value.map((w, i) => (
            <motion.button
              layout
              key={`${w}-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="button"
              disabled={locked}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className={cn(tileCls, "border-accent-tint border-b-accent bg-accent-soft")}
            >
              {w}
            </motion.button>
          ))}
        </AnimatePresence>
        {value.length === 0 && <span className="self-center px-1 text-sm text-ink-muted">Chạm vào các thẻ bên dưới để ghép câu</span>}
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Các thẻ từ">
        {bank.map((w, i) => {
          const used = usedIdx.includes(i);
          return (
            <button
              key={`${w}-${i}`}
              type="button"
              disabled={locked || used}
              onClick={() => onChange([...value, w])}
              className={cn(tileCls, used && "border-line bg-ink/[0.04] text-transparent shadow-none")}
              aria-hidden={used}
            >
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}
