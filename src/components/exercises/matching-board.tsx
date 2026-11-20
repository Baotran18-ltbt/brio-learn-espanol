"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn, shuffle } from "@/lib/utils";
import { useSpeak } from "@/lib/hooks";

export function MatchingBoard({ pairs, onComplete }: { pairs: [string, string][]; onComplete: (mistakes: number) => void }) {
  const left = React.useMemo(() => shuffle(pairs.map((p) => p[0])), [pairs]);
  const right = React.useMemo(() => shuffle(pairs.map((p) => p[1])), [pairs]);
  const answer = React.useMemo(() => Object.fromEntries(pairs), [pairs]);
  const [sel, setSel] = React.useState<string | null>(null);
  const [selRight, setSelRight] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<string[]>([]);
  const [wrong, setWrong] = React.useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = React.useState(0);
  const say = useSpeak();
  const finished = React.useRef(false);

  const tryPair = (l: string, r: string) => {
    if (answer[l] === r) {
      const next = [...done, l];
      setDone(next);
      setSel(null);
      setSelRight(null);
      if (next.length === pairs.length && !finished.current) {
        finished.current = true;
        setTimeout(() => onComplete(mistakes), 250);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrong([l, r]);
      setTimeout(() => {
        setWrong(null);
        setSel(null);
        setSelRight(null);
      }, 550);
    }
  };

  const pickLeft = (l: string) => {
    say(l);
    if (selRight) tryPair(l, selRight);
    else setSel(l);
  };
  const pickRight = (r: string) => {
    if (sel) tryPair(sel, r);
    else setSelRight(r);
  };

  const btn = (active: boolean, matched: boolean, isWrong: boolean) =>
    cn(
      "min-h-[56px] w-full rounded-2xl border-2 border-b-[5px] bg-white px-4 py-2 text-left font-semibold transition",
      matched && "border-success/40 border-b-success/60 bg-success-soft text-success-dark opacity-70",
      !matched && active && "border-accent border-b-accent-dark bg-accent-soft",
      !matched && !active && "border-line-strong hover:border-accent-tint",
      isWrong && "animate-shake border-danger border-b-danger-dark bg-danger-soft",
    );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-3">
        {left.map((l) => (
          <motion.button
            key={l}
            type="button"
            whileTap={{ scale: 0.98 }}
            disabled={done.includes(l)}
            onClick={() => pickLeft(l)}
            className={cn(btn(sel === l, done.includes(l), wrong?.[0] === l), "es text-[17px]")}
          >
            {l}
          </motion.button>
        ))}
      </div>
      <div className="space-y-3">
        {right.map((r) => {
          const matched = done.some((l) => answer[l] === r);
          return (
            <motion.button
              key={r}
              type="button"
              whileTap={{ scale: 0.98 }}
              disabled={matched}
              onClick={() => pickRight(r)}
              className={btn(selRight === r, matched, wrong?.[1] === r)}
            >
              {r}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
