"use client";
import confetti from "canvas-confetti";

export function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#B52B38", "#FF914D", "#FFD166", "#3E9A5C", "#3C86C2"];
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors, scalar: 0.9 });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 180);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 300);
}

let ctx: AudioContext | null = null;
/** Âm báo ngắn cho đúng/sai, tạo bằng WebAudio (không cần file âm thanh). */
export function chime(kind: "correct" | "wrong") {
  try {
    ctx = ctx ?? new AudioContext();
    const now = ctx.currentTime;
    const notes = kind === "correct" ? [659.25, 987.77] : [220, 196];
    notes.forEach((f, i) => {
      const o = ctx!.createOscillator();
      const g = ctx!.createGain();
      o.type = kind === "correct" ? "sine" : "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.12, now + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.22);
      o.connect(g).connect(ctx!.destination);
      o.start(now + i * 0.09);
      o.stop(now + i * 0.09 + 0.25);
    });
  } catch {
    /* trình duyệt chặn âm thanh — bỏ qua */
  }
}
