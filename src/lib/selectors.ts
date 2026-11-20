import type { ProgressState } from "./types";
import { AVAILABLE_LESSONS, isLessonUnlocked } from "@/data/curriculum";
import { VOCAB_BY_ID } from "@/data/vocabulary";
import { addDays, todayKey, WEEKDAY_VI } from "./utils";
import { isDue } from "./srs";
import type { DayPoint } from "@/components/activity-chart";

export function nextLesson(state: ProgressState) {
  return AVAILABLE_LESSONS.find((l) => !state.lessons[l.id] && isLessonUnlocked(l, state.lessons)) ?? null;
}

export function dueCards(state: ProgressState, today = todayKey()) {
  return Object.values(state.srs)
    .filter((c) => isDue(c, today))
    .sort((a, b) => a.due.localeCompare(b.due));
}

export function daySeries(state: ProgressState, days: number, today = todayKey()): DayPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const key = addDays(today, i - days + 1);
    const a = state.activity[key];
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return {
      key,
      label: days <= 7 ? WEEKDAY_VI[date.getDay()] : `${d}/${m}`,
      xp: a?.xp ?? 0,
      minutes: Math.round((a?.seconds ?? 0) / 60),
      isToday: key === today,
    };
  });
}

export function totalSeconds(state: ProgressState) {
  return Object.values(state.activity).reduce((s, a) => s + a.seconds, 0);
}

/** Từ vựng (có sẵn hoặc lưu từ AI Tutor) theo id. */
export function lookupWord(state: ProgressState, id: string) {
  const v = VOCAB_BY_ID[id];
  if (v) return { id, es: v.es, vi: v.vi, kind: v.kind, pron: v.pron, example: v.example, topic: v.topic };
  const c = state.custom.find((x) => x.id === id);
  if (c) return { id, es: c.es, vi: c.vi, kind: "từ lưu từ AI Tutor", topic: "AI Tutor" };
  return null;
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return { es: "¡Buenos días", vi: "Chào buổi sáng" };
  if (h < 20) return { es: "¡Buenas tardes", vi: "Chào buổi chiều" };
  return { es: "¡Buenas noches", vi: "Chào buổi tối" };
}
