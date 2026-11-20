import type { Exercise, ExerciseType, ProgressState, VocabItem } from "./types";
import { AVAILABLE_LESSONS } from "@/data/curriculum";
import { VOCABULARY } from "@/data/vocabulary";
import { sample, shuffle } from "./utils";

export type PracticeMode = "mixed" | Exclude<ExerciseType, "speaking">;

export const PRACTICE_MODES: { id: PracticeMode; label: string; hint: string }[] = [
  { id: "mixed", label: "Trộn tất cả", hint: "Mỗi lượt một kiểu khác nhau" },
  { id: "multiple-choice", label: "Trắc nghiệm", hint: "Chọn nghĩa đúng" },
  { id: "fill-blank", label: "Điền chỗ trống", hint: "Hoàn thành câu" },
  { id: "translate", label: "Dịch câu", hint: "Tây Ban Nha ⇄ Việt" },
  { id: "sentence-order", label: "Sắp xếp câu", hint: "Ghép thẻ thành câu" },
  { id: "listening", label: "Nghe hiểu", hint: "Nghe rồi chọn nghĩa" },
  { id: "matching", label: "Nối từ", hint: "Nối 5 cặp từ" },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const explain = (w: VocabItem) => `«${w.es}» nghĩa là «${w.vi}». Ví dụ: ${w.example.es} (${w.example.vi})`;

/** Từ được dùng để luyện: từ của bài đã học + từ trong lịch ôn. Nếu quá ít thì dùng cả Unit 1. */
export function practicePool(state: ProgressState): { words: VocabItem[]; limited: boolean } {
  const doneLessons = new Set(Object.keys(state.lessons));
  const learned = VOCABULARY.filter((v) => doneLessons.has(v.lessonId) || state.srs[v.id]);
  if (learned.length >= 8) return { words: learned, limited: false };
  return { words: VOCABULARY, limited: true };
}

function distractors<T>(all: T[], exclude: (x: T) => boolean, n: number): T[] {
  return sample(all.filter((x) => !exclude(x)), n);
}

function pickOthers(pool: VocabItem[], w: VocabItem, n: number) {
  const sameTopic = pool.filter((x) => x.id !== w.id && x.topic === w.topic && x.vi !== w.vi && x.es !== w.es);
  const rest = VOCABULARY.filter((x) => x.id !== w.id && x.vi !== w.vi && x.es !== w.es && !sameTopic.includes(x));
  return [...sample(sameTopic, n), ...sample(rest, n)].slice(0, n);
}

function genMcq(pool: VocabItem[]): Exercise {
  const w = sample(pool, 1)[0];
  const others = pickOthers(pool, w, 3);
  if (Math.random() < 0.5) {
    return { id: uid(), type: "multiple-choice", prompt: "Từ này nghĩa là gì?", focus: w.es, options: [w.vi, ...others.map((o) => o.vi)], answer: w.vi, explanation: explain(w) };
  }
  return { id: uid(), type: "multiple-choice", prompt: `Chọn cách nói «${w.vi}» bằng tiếng Tây Ban Nha`, options: [w.es, ...others.map((o) => o.es)], answer: w.es, explanation: explain(w) };
}

function genListening(pool: VocabItem[]): Exercise {
  const w = sample(pool, 1)[0];
  const others = pickOthers(pool, w, 3);
  const useSentence = Math.random() < 0.4;
  if (useSentence) {
    const otherEx = distractors(VOCABULARY, (x) => x.id === w.id, 3).map((x) => x.example.vi);
    return {
      id: uid(),
      type: "listening",
      audio: w.example.es,
      prompt: "Câu bạn nghe có nghĩa là gì?",
      options: [w.example.vi, ...otherEx],
      answer: w.example.vi,
      explanation: `Câu bạn nghe: «${w.example.es}» = ${w.example.vi}`,
    };
  }
  return { id: uid(), type: "listening", audio: w.es, prompt: "Bạn nghe thấy từ nào? Chọn nghĩa đúng.", options: [w.vi, ...others.map((o) => o.vi)], answer: w.vi, explanation: explain(w) };
}

function genFill(pool: VocabItem[]): Exercise | null {
  const candidates = shuffle(pool).filter((w) => {
    const token = w.es.replace(/[¿?¡!]/g, "").split(" / ")[0];
    return token.split(" ").length <= 2 && new RegExp(`(^|[\\s¿¡—])${escapeRe(token)}(?=[\\s,.?!]|$)`, "i").test(w.example.es);
  });
  const w = candidates[0];
  if (!w) return null;
  const token = w.es.replace(/[¿?¡!]/g, "").split(" / ")[0];
  const re = new RegExp(`(^|[\\s¿¡—])(${escapeRe(token)})(?=[\\s,.?!]|$)`, "i");
  const match = w.example.es.match(re)!;
  const actual = match[2];
  const sentence = w.example.es.replace(re, `$1___`);
  const others = VOCABULARY.filter((x) => x.id !== w.id && !x.es.includes("/") && x.es.split(" ").length <= 2)
    .map((x) => x.es.replace(/[¿?¡!]/g, ""))
    .filter((x) => x.toLowerCase() !== actual.toLowerCase());
  return {
    id: uid(),
    type: "fill-blank",
    sentence,
    translation: w.example.vi,
    options: [actual, ...sample(Array.from(new Set(others)), 3)],
    answer: actual,
    explanation: explain(w),
  };
}

function genOrder(pool: VocabItem[]): Exercise | null {
  const w = shuffle(pool).find((x) => {
    const n = x.example.es.split(" ").length;
    return n >= 3 && n <= 7 && !x.example.es.startsWith("—");
  });
  if (!w) return null;
  return { id: uid(), type: "sentence-order", words: w.example.es.split(" "), translation: w.example.vi, explanation: `Câu đúng: «${w.example.es}»` };
}

function genTranslate(pool: VocabItem[]): Exercise | null {
  if (Math.random() < 0.5) {
    const w = shuffle(pool).find((x) => x.example.vi.split(" ").length <= 7 && !x.example.es.startsWith("—"));
    if (!w) return null;
    const words = w.example.vi.split(" ");
    const extra = sample(
      VOCABULARY.filter((x) => x.id !== w.id).flatMap((x) => x.example.vi.split(" ")).filter((t) => !words.includes(t)),
      3,
    );
    return { id: uid(), type: "translate", direction: "es-vi", source: w.example.es, tiles: [...words, ...extra], accepted: [w.example.vi], explanation: `«${w.example.es}» = ${w.example.vi}` };
  }
  const w = shuffle(pool).find((x) => !x.vi.includes(";") && !x.es.includes("/") && !x.vi.includes("("));
  if (!w) return null;
  return { id: uid(), type: "translate", direction: "vi-es", source: w.vi, accepted: [w.es], explanation: explain(w) };
}

function genMatching(pool: VocabItem[]): Exercise {
  const chosen: VocabItem[] = [];
  for (const w of shuffle(pool)) {
    if (chosen.length === 5) break;
    if (chosen.some((c) => c.vi === w.vi || c.es === w.es)) continue;
    chosen.push(w);
  }
  return { id: uid(), type: "matching", pairs: chosen.map((w) => [w.es, w.vi] as [string, string]), explanation: chosen.map((w) => `${w.es} = ${w.vi}`).join(" · ") };
}

/** Bài tập soạn sẵn trong các bài đã học (hoặc tất cả nếu chưa học bài nào). */
function authored(state: ProgressState, type: ExerciseType): Exercise[] {
  const done = AVAILABLE_LESSONS.filter((l) => state.lessons[l.id]);
  const lessons = done.length ? done : AVAILABLE_LESSONS.filter((l) => l.kind === "lesson");
  return lessons.flatMap((l) => l.exercises).filter((e) => e.type === type).map((e) => ({ ...e, id: `${e.id}-${uid()}` }));
}

const GENERATORS: Record<Exclude<PracticeMode, "mixed">, (pool: VocabItem[], state: ProgressState) => Exercise | null> = {
  "multiple-choice": (p) => genMcq(p),
  listening: (p) => genListening(p),
  "fill-blank": (p, s) => (Math.random() < 0.5 ? sample(authored(s, "fill-blank"), 1)[0] ?? genFill(p) : genFill(p) ?? sample(authored(s, "fill-blank"), 1)[0]),
  "sentence-order": (p, s) => (Math.random() < 0.4 ? sample(authored(s, "sentence-order"), 1)[0] ?? genOrder(p) : genOrder(p)),
  translate: (p, s) => (Math.random() < 0.5 ? sample(authored(s, "translate"), 1)[0] ?? genTranslate(p) : genTranslate(p)),
  matching: (p) => genMatching(p),
};

function signature(e: Exercise): string {
  switch (e.type) {
    case "multiple-choice":
    case "listening":
    case "fill-blank":
      return `${e.type}:${e.answer}`;
    case "translate":
      return `${e.type}:${e.source}`;
    case "sentence-order":
      return `${e.type}:${e.words.join(" ")}`;
    case "matching":
      return `${e.type}:${e.pairs.map((p) => p[0]).sort().join()}`;
    default:
      return e.id;
  }
}

export function buildSession(state: ProgressState, mode: PracticeMode, size = 10): Exercise[] {
  const { words } = practicePool(state);
  const types = Object.keys(GENERATORS) as Exclude<PracticeMode, "mixed">[];
  const out: Exercise[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < size && guard++ < size * 12) {
    const t = mode === "mixed" ? types[(out.length + Math.floor(Math.random() * types.length)) % types.length] : mode;
    // tránh 2 câu nối từ liên tiếp trong chế độ trộn
    if (mode === "mixed" && t === "matching" && out[out.length - 1]?.type === "matching") continue;
    const ex = GENERATORS[t](words, state);
    if (!ex) continue;
    const sig = signature(ex);
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push(ex);
  }
  return mode === "mixed" ? shuffle(out) : out;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
