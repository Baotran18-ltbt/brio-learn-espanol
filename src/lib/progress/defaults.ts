import type { DayActivity, ProgressState, Settings } from "../types";
import { todayKey } from "../utils";

export const DEFAULT_SETTINGS: Settings = {
  displayName: "",
  dailyGoalXp: 30,
  speechRate: 0.9,
  accent: "es-ES",
  soundEffects: true,
  showHints: true,
};

export function freshState(): ProgressState {
  return {
    version: 1,
    createdAt: todayKey(),
    updatedAt: 0,
    xp: 0,
    lessons: {},
    srs: {},
    saved: [],
    known: [],
    custom: [],
    activity: {},
    achievements: {},
    stats: { correct: 0, answered: 0, perfectPractices: 0, tutorMessages: 0, reviews: 0 },
    settings: { ...DEFAULT_SETTINGS },
  };
}

export const emptyDay = (): DayActivity => ({ xp: 0, seconds: 0, lessons: 0, reviews: 0, exercises: 0 });

/** Chuẩn hoá dữ liệu đọc từ localStorage/Supabase (phòng dữ liệu cũ, thiếu trường). */
export function normalizeState(raw: unknown): ProgressState {
  const base = freshState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<ProgressState>;
  return {
    ...base,
    ...r,
    version: 1,
    lessons: r.lessons ?? {},
    srs: r.srs ?? {},
    saved: Array.isArray(r.saved) ? r.saved : [],
    known: Array.isArray(r.known) ? r.known : [],
    custom: Array.isArray(r.custom) ? r.custom : [],
    activity: r.activity ?? {},
    achievements: r.achievements ?? {},
    stats: { ...base.stats, ...(r.stats ?? {}) },
    settings: { ...base.settings, ...(r.settings ?? {}) },
  };
}
