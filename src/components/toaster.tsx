"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { subscribe, type Notice } from "@/lib/notify";
import { cn } from "@/lib/utils";

export function Toaster() {
  const [items, setItems] = React.useState<Notice[]>([]);
  React.useEffect(
    () =>
      subscribe((n) => {
        setItems((cur) => [...cur.slice(-2), n]);
        setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== n.id)), 4200);
      }),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:pr-6" aria-live="polite">
      <AnimatePresence>
        {items.map((n) => {
          const Icon = n.tone === "achievement" ? Award : n.tone === "error" ? TriangleAlert : n.tone === "success" ? CheckCircle2 : Info;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border-2 border-b-[4px] bg-white p-3.5 shadow-lift",
                n.tone === "achievement" ? "border-accent-tint border-b-accent" : n.tone === "error" ? "border-danger/30 border-b-danger" : "border-line-strong",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl",
                  n.tone === "achievement" ? "bg-accent-soft text-accent-dark" : n.tone === "error" ? "bg-danger-soft text-danger" : "bg-success-soft text-success",
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-bold leading-snug">{n.title}</p>
                {n.body && <p className="text-sm text-ink-muted">{n.body}</p>}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
