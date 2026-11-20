"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { SpeakButton } from "./speak-button";
import { cn } from "@/lib/utils";

export interface FlashcardData {
  es: string;
  vi: string;
  kind?: string;
  pron?: string;
  example?: { es: string; vi: string };
  topic?: string;
}

export function Flashcard({
  card,
  flipped,
  onFlip,
  className,
}: {
  card: FlashcardData;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto h-[340px] w-full max-w-xl [perspective:1400px] sm:h-[360px]", className)}>
      <motion.div
        className="preserve-3d relative size-full cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Mặt sau thẻ. Bấm để lật lại" : "Mặt trước thẻ. Bấm để xem nghĩa"}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        {/* Mặt trước */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-b-[6px] border-brand-tint border-b-brand/70 bg-white p-8 text-center">
          {card.topic && <span className="absolute left-6 top-5 text-xs font-bold uppercase tracking-widest text-ink-muted">{card.topic}</span>}
          <p className="es text-[40px] leading-tight text-ink sm:text-5xl">{card.es}</p>
          {card.pron && <p className="text-sm text-ink-muted">Đọc gần như: {card.pron}</p>}
          <SpeakButton text={card.es} size="lg" />
          <span className="absolute bottom-5 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
            <RotateCw className="size-3.5" /> Bấm thẻ hoặc phím Space để lật
          </span>
        </div>
        {/* Mặt sau */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-b-[6px] border-accent-tint border-b-accent bg-pastel-peach p-8 text-center">
          <p className="es text-2xl text-brand">{card.es}</p>
          <p className="font-display text-3xl font-black leading-tight">{card.vi}</p>
          {card.kind && <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">{card.kind}</p>}
          {card.example && (
            <div className="mt-2 w-full max-w-sm rounded-2xl bg-white/70 p-4 text-left">
              <div className="flex items-center gap-2">
                <SpeakButton text={card.example.es} size="sm" label="Nghe câu ví dụ" />
                <p className="es text-lg">{card.example.es}</p>
              </div>
              <p className="mt-1 pl-10 text-sm text-ink-soft">{card.example.vi}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
