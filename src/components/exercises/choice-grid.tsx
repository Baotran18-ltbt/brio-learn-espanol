"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Có chữ cái/thanh điệu chỉ tiếng Việt mới có → font thường; còn lại coi là tiếng Tây Ban Nha. */
const VI_ONLY = /[ăâđêôơưạảãàẹẻẽèịỉĩìọỏõòụủũùỵỷỹỳấầẩẫậắằẳẵặếềểễệốồổỗộớờởỡợứừửữự]/i;
export const looksVietnamese = (s: string) => VI_ONLY.test(s);

export function ChoiceGrid({
  options,
  value,
  onChange,
  locked,
  answer,
  compact,
}: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  locked: boolean;
  answer: string;
  status: "idle" | "correct" | "wrong" | "done";
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2")} role="radiogroup">
      {options.map((opt, i) => {
        const selected = value === opt;
        const isAnswer = opt === answer;
        const showRight = locked && isAnswer;
        const showWrong = locked && selected && !isAnswer;
        return (
          <motion.button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={locked}
            onClick={() => onChange(opt)}
            whileHover={locked ? undefined : { y: -2 }}
            whileTap={locked ? undefined : { y: 1 }}
            className={cn(
              "flex min-h-[60px] items-center gap-3 rounded-2xl border-2 border-b-[5px] bg-white px-4 py-3 text-left text-[17px] font-semibold transition-colors",
              !locked && !selected && "border-line-strong hover:border-accent-tint hover:bg-accent-soft/40",
              !locked && selected && "border-accent border-b-accent-dark bg-accent-soft",
              showRight && "border-success border-b-success-dark bg-success-soft",
              showWrong && "border-danger border-b-danger-dark bg-danger-soft",
              locked && !showRight && !showWrong && "border-line opacity-60",
            )}
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-lg border-2 text-xs font-black",
                selected || showRight ? "border-current" : "border-line-strong text-ink-muted",
              )}
            >
              {i + 1}
            </span>
            <span className={cn(!looksVietnamese(opt) && "es text-lg")}>{opt}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
