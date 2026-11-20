import type { SrsCard } from "./types";
import { addDays, todayKey } from "./utils";

/**
 * Lặp lại ngắt quãng theo tinh thần SM-2 (SuperMemo 2).
 * grade: 0–5. Dưới 3 là quên → học lại từ đầu.
 * Khác SM-2 gốc: khoảng thứ hai là 3 ngày (thay vì 6) cho người mới học.
 */
export type Grade = 1 | 3 | 4 | 5;

export const GRADE_LABELS: Record<Grade, { label: string; hint: string }> = {
  1: { label: "Quên", hint: "Gặp lại ngay trong lượt này" },
  3: { label: "Khó", hint: "Nhớ nhưng phải nghĩ lâu" },
  4: { label: "Nhớ", hint: "Nhớ đúng" },
  5: { label: "Dễ", hint: "Nhớ ngay lập tức" },
};

export const MASTERED_REPS = 3;

export function newCard(id: string, due = todayKey()): SrsCard {
  return { id, ease: 2.5, interval: 0, reps: 0, lapses: 0, due };
}

export function reviewCard(card: SrsCard, grade: Grade, today = todayKey()): SrsCard {
  const q = grade;
  let { ease, interval, reps, lapses } = card;
  if (q < 3) {
    reps = 0;
    interval = 0;
    lapses += 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = q === 5 ? 4 : 3;
    else interval = Math.round(Math.max(1, interval) * ease * (q === 3 ? 0.8 : q === 5 ? 1.15 : 1));
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  return {
    ...card,
    ease: Math.round(ease * 100) / 100,
    interval,
    reps,
    lapses,
    due: addDays(today, interval),
    lastReviewed: today,
  };
}

/** Xem trước khoảng ngày cho từng nút — hiển thị dưới nút chấm điểm. */
export function previewInterval(card: SrsCard, grade: Grade): string {
  const next = reviewCard(card, grade);
  if (next.interval === 0) return "hôm nay";
  if (next.interval === 1) return "1 ngày";
  if (next.interval < 30) return `${next.interval} ngày`;
  return `${Math.round(next.interval / 30)} tháng`;
}

export function isDue(card: SrsCard, today = todayKey()): boolean {
  return card.due <= today;
}

export function isMastered(card: SrsCard | undefined): boolean {
  return Boolean(card && card.reps >= MASTERED_REPS);
}
