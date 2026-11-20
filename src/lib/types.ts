/* ============================================================
 * Data model — curriculum (tĩnh) và tiến độ người học (động)
 * ============================================================ */

export type CEFRCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Example {
  es: string;
  vi: string;
}

export interface VocabItem {
  id: string;
  es: string;
  vi: string;
  /** loại từ / ghi chú ngắn: "cụm từ", "danh từ giống đực"… */
  kind?: string;
  example: Example;
  /** gợi ý phát âm cho người Việt */
  pron?: string;
  note?: string;
  topic: string;
  lessonId: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarPoint {
  id: string;
  title: string;
  /** đoạn giải thích bằng tiếng Việt */
  body: string[];
  table?: GrammarTable;
  examples: Example[];
  tip?: string;
}

export interface DialogueLine {
  speaker: string;
  es: string;
  vi: string;
}

/* ---------------- Exercises ---------------- */

interface ExerciseBase {
  id: string;
  /** giải thích khi trả lời sai (tiếng Việt) */
  explanation: string;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple-choice";
  prompt: string;
  /** câu tiếng Tây Ban Nha cần hiển thị lớn (tuỳ chọn) */
  focus?: string;
  options: string[];
  answer: string;
}

export interface FillBlankExercise extends ExerciseBase {
  type: "fill-blank";
  /** dùng "___" cho chỗ trống */
  sentence: string;
  translation: string;
  options: string[];
  answer: string;
}

export interface TranslateExercise extends ExerciseBase {
  type: "translate";
  direction: "es-vi" | "vi-es";
  source: string;
  /** các đáp án chấp nhận được */
  accepted: string[];
  /** es-vi: ghép thẻ; vi-es: gõ tay */
  tiles?: string[];
}

export interface SentenceOrderExercise extends ExerciseBase {
  type: "sentence-order";
  /** các từ theo đúng thứ tự */
  words: string[];
  translation: string;
}

export interface ListeningExercise extends ExerciseBase {
  type: "listening";
  audio: string;
  prompt: string;
  options: string[];
  answer: string;
}

export interface MatchingExercise extends ExerciseBase {
  type: "matching";
  pairs: [string, string][];
}

export interface SpeakingExercise extends ExerciseBase {
  type: "speaking";
  phrase: string;
  translation: string;
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | TranslateExercise
  | SentenceOrderExercise
  | ListeningExercise
  | MatchingExercise
  | SpeakingExercise;

export type ExerciseType = Exercise["type"];

/* ---------------- Curriculum ---------------- */

export interface Lesson {
  id: string;
  unitId: string;
  level: CEFRCode;
  order: number;
  title: string;
  titleVi: string;
  kind: "lesson" | "assessment";
  minutes: number;
  xp: number;
  objectives: string[];
  vocabIds: string[];
  grammar: GrammarPoint[];
  dialogue?: { title: string; lines: DialogueLine[] };
  exercises: Exercise[];
  summary: string[];
  /** Bài kiểm tra: tỉ lệ đúng tối thiểu để đạt */
  passRate?: number;
}

export interface Unit {
  id: string;
  level: CEFRCode;
  order: number;
  title: string;
  titleVi: string;
  description: string;
  status: "available" | "upcoming";
  lessons: Lesson[];
  /** chủ đề dự kiến cho unit chưa làm */
  plannedTopics?: string[];
}

export interface CEFRLevel {
  code: CEFRCode;
  name: string;
  nameVi: string;
  description: string;
  units: Unit[];
}

/* ---------------- Progress (lưu bền) ---------------- */

export interface SrsCard {
  id: string; // vocab id hoặc "custom:<id>"
  ease: number;
  interval: number; // ngày
  reps: number;
  lapses: number;
  due: string; // YYYY-MM-DD
  lastReviewed?: string;
}

export interface LessonRecord {
  completedAt: string;
  bestScore: number; // 0..1
  attempts: number;
}

export interface DayActivity {
  xp: number;
  seconds: number;
  lessons: number;
  reviews: number;
  exercises: number;
}

export interface CustomVocab {
  id: string;
  es: string;
  vi: string;
  source: "ai-tutor";
  addedAt: string;
}

export interface Settings {
  displayName: string;
  dailyGoalXp: number;
  speechRate: number;
  accent: "es-ES" | "es-MX";
  soundEffects: boolean;
  showHints: boolean;
}

export interface ProgressState {
  version: 1;
  createdAt: string;
  updatedAt: number;
  xp: number;
  lessons: Record<string, LessonRecord>;
  srs: Record<string, SrsCard>;
  saved: string[];
  known: string[];
  custom: CustomVocab[];
  activity: Record<string, DayActivity>;
  achievements: Record<string, string>; // id -> date unlocked
  stats: { correct: number; answered: number; perfectPractices: number; tutorMessages: number; reviews: number };
  settings: Settings;
}
