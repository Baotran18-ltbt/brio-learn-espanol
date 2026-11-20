"use client";

import * as React from "react";
import type { CustomVocab, DayActivity, ProgressState, Settings } from "../types";
import { emptyDay, freshState } from "./defaults";
import { LocalRepository, SupabaseRepository, type ProgressRepository } from "./repository";
import { getSupabase, isSupabaseConfigured } from "../supabase";
import { newCard, reviewCard as srsReview, type Grade } from "../srs";
import { ACHIEVEMENTS, newlyUnlocked } from "../gamification";
import { notify } from "../notify";
import { todayKey } from "../utils";

type SyncStatus = "local" | "syncing" | "synced" | "error";

interface ProgressContextValue {
  state: ProgressState;
  hydrated: boolean;
  storage: "local" | "supabase";
  sync: SyncStatus;
  userEmail: string | null;
  /* actions */
  addXp: (amount: number, field?: keyof Omit<DayActivity, "xp" | "seconds">) => void;
  recordAnswer: (correct: boolean, xp?: number) => void;
  completeLesson: (lessonId: string, score: number, xp: number, vocabIds: string[]) => void;
  finishPractice: (correct: number, total: number) => void;
  reviewCard: (id: string, grade: Grade) => void;
  addToReview: (ids: string[]) => void;
  toggleSaved: (id: string) => void;
  markKnown: (id: string) => void;
  markUnknown: (id: string) => void;
  addCustomVocab: (es: string, vi: string) => string;
  addStudySeconds: (seconds: number) => void;
  tutorMessageSent: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => Promise<void>;
  replaceState: (s: ProgressState) => void;
  signOut: () => Promise<void>;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

function bumpDay(s: ProgressState, patch: Partial<DayActivity>): ProgressState {
  const key = todayKey();
  const day = { ...emptyDay(), ...(s.activity[key] ?? {}) };
  (Object.keys(patch) as (keyof DayActivity)[]).forEach((k) => {
    day[k] += patch[k] ?? 0;
  });
  return { ...s, activity: { ...s.activity, [key]: day } };
}

function withAchievements(s: ProgressState): ProgressState {
  const unlocked = newlyUnlocked(s);
  if (!unlocked.length) return s;
  const achievements = { ...s.achievements };
  unlocked.forEach((a) => {
    achievements[a.id] = todayKey();
    // thông báo sau khi render xong
    setTimeout(() => notify({ title: `Huy hiệu mới: ${a.title}`, body: a.description, tone: "achievement" }), 0);
  });
  return { ...s, achievements };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(freshState);
  const [hydrated, setHydrated] = React.useState(false);
  const [sync, setSync] = React.useState<SyncStatus>("local");
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const local = React.useMemo(() => new LocalRepository(), []);
  const remote = React.useRef<ProgressRepository | null>(null);
  const skipSave = React.useRef(true);

  /* ---------- tải dữ liệu ---------- */
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromLocal = await local.load();
      if (!cancelled && fromLocal) setState(fromLocal);
      if (!cancelled) setHydrated(true);

      const supabase = getSupabase();
      if (!supabase) return;
      const attach = async (userId: string | null, email: string | null) => {
        if (!userId) {
          remote.current = null;
          setUserEmail(null);
          setSync("local");
          return;
        }
        setUserEmail(email);
        const repo = new SupabaseRepository(supabase, userId);
        remote.current = repo;
        setSync("syncing");
        try {
          const fromRemote = await repo.load();
          setState((cur) => {
            if (fromRemote && fromRemote.updatedAt > cur.updatedAt) return fromRemote;
            // dữ liệu local mới hơn → đẩy lên
            repo.save(cur).catch(() => setSync("error"));
            return cur;
          });
          setSync("synced");
        } catch {
          setSync("error");
        }
      };
      const { data } = await supabase.auth.getSession();
      await attach(data.session?.user.id ?? null, data.session?.user.email ?? null);
      supabase.auth.onAuthStateChange((_evt, session) => {
        attach(session?.user.id ?? null, session?.user.email ?? null);
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [local]);

  /* ---------- lưu dữ liệu (debounce) ---------- */
  React.useEffect(() => {
    if (!hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    local.save(state);
    const repo = remote.current;
    if (!repo) return;
    const t = setTimeout(() => {
      setSync("syncing");
      repo
        .save(state)
        .then(() => setSync("synced"))
        .catch(() => setSync("error"));
    }, 800);
    return () => clearTimeout(t);
  }, [state, hydrated, local]);

  const mutate = React.useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((s) => withAchievements({ ...fn(s), updatedAt: Date.now() }));
  }, []);

  const value: ProgressContextValue = React.useMemo(() => {
    const addXp: ProgressContextValue["addXp"] = (amount, field) =>
      mutate((s) => bumpDay({ ...s, xp: s.xp + amount }, { xp: amount, ...(field ? { [field]: 1 } : {}) }));

    return {
      state,
      hydrated,
      storage: remote.current ? "supabase" : "local",
      sync: isSupabaseConfigured ? sync : "local",
      userEmail,
      addXp,
      recordAnswer: (correct, xp = 2) =>
        mutate((s) => {
          const next = {
            ...s,
            xp: s.xp + (correct ? xp : 0),
            stats: { ...s.stats, answered: s.stats.answered + 1, correct: s.stats.correct + (correct ? 1 : 0) },
          };
          return bumpDay(next, { xp: correct ? xp : 0, exercises: 1 });
        }),
      completeLesson: (lessonId, score, xp, vocabIds) =>
        mutate((s) => {
          const prev = s.lessons[lessonId];
          const firstTime = !prev;
          const srs = { ...s.srs };
          const due = todayKey();
          vocabIds.forEach((id) => {
            if (!srs[id]) srs[id] = newCard(id, due);
          });
          const next: ProgressState = {
            ...s,
            xp: s.xp + (firstTime ? xp : Math.round(xp / 3)),
            srs,
            lessons: {
              ...s.lessons,
              [lessonId]: {
                completedAt: prev?.completedAt ?? new Date().toISOString(),
                bestScore: Math.max(prev?.bestScore ?? 0, score),
                attempts: (prev?.attempts ?? 0) + 1,
              },
            },
          };
          return bumpDay(next, { xp: firstTime ? xp : Math.round(xp / 3), lessons: 1 });
        }),
      finishPractice: (correct, total) =>
        mutate((s) => {
          const perfect = total > 0 && correct === total;
          const next = { ...s, xp: s.xp + 10, stats: { ...s.stats, perfectPractices: s.stats.perfectPractices + (perfect ? 1 : 0) } };
          return bumpDay(next, { xp: 10 });
        }),
      reviewCard: (id, grade) =>
        mutate((s) => {
          const card = s.srs[id] ?? newCard(id);
          const srs = { ...s.srs, [id]: srsReview(card, grade) };
          const next = { ...s, srs, xp: s.xp + 1, stats: { ...s.stats, reviews: s.stats.reviews + 1 } };
          return bumpDay(next, { xp: 1, reviews: 1 });
        }),
      addToReview: (ids) =>
        mutate((s) => {
          const srs = { ...s.srs };
          ids.forEach((id) => {
            if (!srs[id]) srs[id] = newCard(id);
          });
          return { ...s, srs };
        }),
      toggleSaved: (id) =>
        mutate((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
      markKnown: (id) =>
        mutate((s) => {
          const card = s.srs[id] ?? newCard(id);
          // "Đã biết": coi như nhớ dễ một lần → lịch ôn giãn ra, không xoá khỏi hệ thống
          return { ...s, known: Array.from(new Set([...s.known, id])), srs: { ...s.srs, [id]: srsReview(card, 5) } };
        }),
      markUnknown: (id) =>
        mutate((s) => {
          const card = s.srs[id] ?? newCard(id);
          return {
            ...s,
            known: s.known.filter((x) => x !== id),
            srs: { ...s.srs, [id]: { ...card, due: todayKey(), reps: 0, interval: 0 } },
          };
        }),
      addCustomVocab: (es, vi) => {
        const id = `custom:${es.toLowerCase().trim().replace(/\s+/g, "-")}`;
        mutate((s) => {
          if (s.custom.some((c) => c.id === id)) return s;
          const item: CustomVocab = { id, es: es.trim(), vi: vi.trim(), source: "ai-tutor", addedAt: todayKey() };
          return { ...s, custom: [...s.custom, item], saved: [...s.saved, id], srs: { ...s.srs, [id]: newCard(id) } };
        });
        return id;
      },
      addStudySeconds: (seconds) =>
        setState((s) => {
          const key = todayKey();
          const day = { ...emptyDay(), ...(s.activity[key] ?? {}) };
          day.seconds += seconds;
          return { ...s, updatedAt: Date.now(), activity: { ...s.activity, [key]: day } };
        }),
      tutorMessageSent: () =>
        mutate((s) => {
          const next = { ...s, xp: s.xp + 2, stats: { ...s.stats, tutorMessages: s.stats.tutorMessages + 1 } };
          return bumpDay(next, { xp: 2 });
        }),
      updateSettings: (patch) => mutate((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      resetProgress: async () => {
        const settings = state.settings;
        await local.clear();
        if (remote.current) await remote.current.clear().catch(() => undefined);
        setState({ ...freshState(), settings, updatedAt: Date.now() });
      },
      replaceState: (s) => setState({ ...s, updatedAt: Date.now() }),
      signOut: async () => {
        const supabase = getSupabase();
        if (supabase) await supabase.auth.signOut();
      },
    };
  }, [state, hydrated, sync, userEmail, mutate, local]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress phải nằm trong <ProgressProvider>");
  return ctx;
}

export { ACHIEVEMENTS };
