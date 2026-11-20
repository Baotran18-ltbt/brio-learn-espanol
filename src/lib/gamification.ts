import type { ProgressState } from "./types";
import { addDays, todayKey } from "./utils";
import { AVAILABLE_LESSONS, CURRICULUM } from "@/data/curriculum";
import { MASTERED_REPS } from "./srs";

export const XP = {
  correctAnswer: 2,
  practiceFinish: 10,
  reviewCard: 1,
  tutorMessage: 2,
  speakingAttempt: 1,
} as const;

export const XP_MILESTONES = [
  { xp: 0, name: "Principiante", vi: "Người mới bắt đầu" },
  { xp: 100, name: "Curioso", vi: "Tò mò" },
  { xp: 250, name: "Explorador", vi: "Nhà thám hiểm" },
  { xp: 500, name: "Conversador", vi: "Người thích trò chuyện" },
  { xp: 1000, name: "Viajero", vi: "Lữ khách" },
  { xp: 2000, name: "Experto", vi: "Chuyên gia" },
  { xp: 4000, name: "Maestro", vi: "Bậc thầy" },
];

export function milestoneFor(xp: number) {
  let idx = 0;
  XP_MILESTONES.forEach((m, i) => {
    if (xp >= m.xp) idx = i;
  });
  const current = XP_MILESTONES[idx];
  const next = XP_MILESTONES[idx + 1];
  const pct = next ? ((xp - current.xp) / (next.xp - current.xp)) * 100 : 100;
  return { index: idx, current, next, pct };
}

export function activeDays(state: ProgressState): Set<string> {
  return new Set(Object.entries(state.activity).filter(([, a]) => a.xp > 0).map(([d]) => d));
}

export function currentStreak(state: ProgressState, today = todayKey()): number {
  const days = activeDays(state);
  let d = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function longestStreak(state: ProgressState): number {
  const days = Array.from(activeDays(state)).sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function masteredCount(state: ProgressState): number {
  return Object.values(state.srs).filter((c) => c.reps >= MASTERED_REPS).length;
}

export function completedLessonCount(state: ProgressState): number {
  return AVAILABLE_LESSONS.filter((l) => state.lessons[l.id]).length;
}

/** Tiến độ CEFR = số bài đã xong / tổng số bài ĐÃ CÓ của cấp đó. */
export function levelProgress(state: ProgressState) {
  return CURRICULUM.map((lvl) => {
    const lessons = lvl.units.filter((u) => u.status === "available").flatMap((u) => u.lessons);
    const done = lessons.filter((l) => state.lessons[l.id]).length;
    const plannedUnits = lvl.units.filter((u) => u.status === "upcoming").length;
    return { code: lvl.code, name: lvl.nameVi, total: lessons.length, done, plannedUnits };
  });
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "book" | "trophy" | "flame" | "zap" | "brain" | "message" | "target" | "medal" | "star";
  check: (s: ProgressState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-lesson", title: "Primer paso", description: "Hoàn thành bài học đầu tiên", icon: "sparkles", check: (s) => completedLessonCount(s) >= 1 },
  { id: "three-lessons", title: "En marcha", description: "Hoàn thành 3 bài học", icon: "book", check: (s) => completedLessonCount(s) >= 3 },
  { id: "unit-1", title: "¡Unidad 1!", description: "Vượt qua bài kiểm tra Unit 1", icon: "trophy", check: (s) => Boolean(s.lessons["a1-u1-test"]) },
  { id: "streak-3", title: "Constancia", description: "Học 3 ngày liên tiếp", icon: "flame", check: (s) => currentStreak(s) >= 3 || longestStreak(s) >= 3 },
  { id: "streak-7", title: "Una semana", description: "Học 7 ngày liên tiếp", icon: "flame", check: (s) => longestStreak(s) >= 7 },
  { id: "xp-100", title: "Cien", description: "Đạt 100 XP", icon: "zap", check: (s) => s.xp >= 100 },
  { id: "xp-500", title: "Quinientos", description: "Đạt 500 XP", icon: "zap", check: (s) => s.xp >= 500 },
  { id: "mastered-10", title: "Memoria", description: "Thuộc 10 từ (nhớ đúng 3 lần liên tiếp)", icon: "brain", check: (s) => masteredCount(s) >= 10 },
  { id: "reviews-25", title: "Repaso", description: "Ôn 25 thẻ từ", icon: "target", check: (s) => s.stats.reviews >= 25 },
  { id: "perfect", title: "Perfecto", description: "Đúng 100% một lượt luyện tập", icon: "star", check: (s) => s.stats.perfectPractices >= 1 },
  { id: "tutor-first", title: "Primera charla", description: "Gửi tin nhắn đầu tiên cho AI Tutor", icon: "message", check: (s) => s.stats.tutorMessages >= 1 },
  { id: "goal-day", title: "Meta cumplida", description: "Đạt mục tiêu XP trong một ngày", icon: "medal", check: (s) => Object.values(s.activity).some((a) => a.xp >= s.settings.dailyGoalXp) },
];

export function newlyUnlocked(state: ProgressState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && a.check(state));
}
