"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Gauge, Lightbulb, MessageCircle, RotateCcw, Target, TriangleAlert, X, XCircle } from "lucide-react";
import { getLesson, getUnit, isLessonUnlocked, AVAILABLE_LESSONS } from "@/data/curriculum";
import { VOCAB_BY_ID } from "@/data/vocabulary";
import type { DialogueLine, Exercise, GrammarPoint, VocabItem } from "@/lib/types";
import { useProgress } from "@/lib/progress/store";
import { useStudyTimer } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpeakButton } from "@/components/speak-button";
import { IconTile } from "@/components/icon-tile";
import { ExerciseRunner, EXERCISE_LABEL } from "@/components/exercises/exercise-runner";
import { looksVietnamese } from "@/components/exercises/choice-grid";
import { celebrate } from "@/components/celebrate";
import { PageSkeleton } from "@/components/states";
import { cn } from "@/lib/utils";

type Step =
  | { kind: "intro" }
  | { kind: "vocab"; items: VocabItem[]; page: number; pages: number }
  | { kind: "grammar"; point: GrammarPoint; n: number }
  | { kind: "dialogue"; title: string; lines: DialogueLine[] }
  | { kind: "exercise"; ex: Exercise; n: number; total: number }
  | { kind: "summary" };

const STEP_LABEL: Record<Step["kind"], string> = {
  intro: "Mục tiêu",
  vocab: "Từ vựng mới",
  grammar: "Ngữ pháp",
  dialogue: "Hội thoại mẫu",
  exercise: "Bài tập",
  summary: "Tổng kết",
};

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId)!;
  const unit = getUnit(lesson.unitId)!;
  const { state, hydrated, completeLesson, updateSettings } = useProgress();
  useStudyTimer(true);

  const steps = React.useMemo<Step[]>(() => {
    const out: Step[] = [{ kind: "intro" }];
    const vocab = lesson.vocabIds.map((id) => VOCAB_BY_ID[id]).filter(Boolean);
    const per = 4;
    const pages = Math.ceil(vocab.length / per);
    for (let p = 0; p < pages; p++) out.push({ kind: "vocab", items: vocab.slice(p * per, p * per + per), page: p + 1, pages });
    lesson.grammar.forEach((g, i) => out.push({ kind: "grammar", point: g, n: i + 1 }));
    if (lesson.dialogue) out.push({ kind: "dialogue", ...lesson.dialogue });
    lesson.exercises.forEach((ex, i) => out.push({ kind: "exercise", ex, n: i + 1, total: lesson.exercises.length }));
    out.push({ kind: "summary" });
    return out;
  }, [lesson]);

  const [idx, setIdx] = React.useState(0);
  const [results, setResults] = React.useState<Record<string, boolean | null>>({});
  const [attempt, setAttempt] = React.useState(0);
  const [recorded, setRecorded] = React.useState<null | { passed: boolean; xp: number; first: boolean }>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  const step = steps[idx];
  const graded = lesson.exercises.filter((e) => e.type !== "speaking");
  const correct = graded.filter((e) => results[e.id] === true).length;
  const score = graded.length ? correct / graded.length : 1;
  const passed = lesson.kind !== "assessment" || score >= (lesson.passRate ?? 0.7);

  const go = (n: number) => {
    setIdx(Math.max(0, Math.min(steps.length - 1, n)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Ghi nhận hoàn thành khi tới bước tổng kết
  React.useEffect(() => {
    if (step.kind !== "summary" || recorded) return;
    const first = !state.lessons[lesson.id];
    if (passed) {
      completeLesson(lesson.id, score, lesson.xp, lesson.vocabIds);
      setRecorded({ passed: true, xp: first ? lesson.xp : Math.round(lesson.xp / 3), first });
      celebrate();
    } else {
      setRecorded({ passed: false, xp: 0, first });
    }
  }, [step.kind, recorded, passed, completeLesson, lesson, score, state.lessons]);

  const retry = () => {
    setResults({});
    setRecorded(null);
    setAttempt((a) => a + 1);
    go(steps.findIndex((s) => s.kind === "exercise"));
  };

  if (!hydrated) return <PageSkeleton />;

  const unlocked = isLessonUnlocked(lesson, state.lessons);
  const nextLesson = AVAILABLE_LESSONS[AVAILABLE_LESSONS.findIndex((l) => l.id === lesson.id) + 1];
  const rate = state.settings.speechRate;

  return (
    <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-24">
      {/* Thanh trên */}
      <div className="mb-8 flex items-center gap-3 sm:gap-4">
        <Link href="/learn" aria-label="Thoát bài học" className="rounded-full p-2 text-ink-muted hover:bg-ink/5 hover:text-ink">
          <X className="size-6" />
        </Link>
        <div className="flex-1">
          <Progress value={((idx + (step.kind === "summary" ? 1 : 0)) / (steps.length - 1)) * 100} className="h-4" />
        </div>
        <span className="font-display text-sm font-black text-ink-muted tnum">
          {String(idx + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => updateSettings({ speechRate: rate >= 0.95 ? 0.6 : rate >= 0.75 ? 1 : 0.8 })}
          className="hidden items-center gap-1 rounded-full border-2 border-b-[3px] border-line-strong bg-white px-2.5 py-1 text-xs font-black sm:flex"
          title="Tốc độ đọc"
        >
          <Gauge className="size-3.5" /> {rate.toFixed(1)}×
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="brand">{STEP_LABEL[step.kind]}</Badge>
        {step.kind === "exercise" && (
          <Badge variant="outline">
            {EXERCISE_LABEL[step.ex.type]} · {step.n}/{step.total}
          </Badge>
        )}
        {step.kind === "vocab" && step.pages > 1 && (
          <Badge variant="outline">
            {step.page}/{step.pages}
          </Badge>
        )}
        <span className="text-ink-muted">
          {unit.level} · Unit {unit.order} · <span className="es">{lesson.title}</span>
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${idx}-${attempt}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
        >
          {step.kind === "intro" && (
            <div className="space-y-6">
              <div>
                <h1 className="es text-[40px] leading-tight sm:text-5xl">{lesson.title}</h1>
                <p className="mt-1 text-xl text-ink-soft">{lesson.titleVi}</p>
              </div>
              {!unlocked && (
                <p className="flex items-start gap-2 rounded-2xl border-2 border-[#F2DD95] bg-pastel-butter p-4 text-sm">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-tone-butter" />
                  Bạn chưa hoàn thành bài trước. Vẫn có thể học bài này, nhưng nên đi theo thứ tự để hiểu bài tốt hơn.
                </p>
              )}
              <div className="chunky border-[#BFE3C9] border-b-tone-sage p-6">
                <div className="mb-4 flex items-center gap-3">
                  <IconTile tone="sage">
                    <Target />
                  </IconTile>
                  <h2 className="font-display text-xl font-black">Sau bài này, bạn sẽ</h2>
                </div>
                <ul className="space-y-2.5">
                  {lesson.objectives.map((o) => (
                    <li key={o} className="flex gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-tone-sage" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-ink-muted">
                {lesson.vocabIds.length > 0 && `${lesson.vocabIds.length} từ mới · `}
                {lesson.grammar.length > 0 && `${lesson.grammar.length} điểm ngữ pháp · `}
                {lesson.exercises.length} bài tập · khoảng {lesson.minutes} phút
                {lesson.kind === "assessment" && ` · cần đúng ${Math.round((lesson.passRate ?? 0.7) * 100)}% để đạt`}
              </p>
            </div>
          )}

          {step.kind === "vocab" && (
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-black">Từ mới</h2>
              <p className="text-ink-muted">Bấm loa để nghe. Đọc to theo ít nhất một lần cho mỗi từ.</p>
              <div className="grid gap-4">
                {step.items.map((v) => (
                  <VocabRow key={v.id} v={v} />
                ))}
              </div>
            </div>
          )}

          {step.kind === "grammar" && <GrammarView g={step.point} />}

          {step.kind === "dialogue" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <IconTile tone="peach">
                  <MessageCircle />
                </IconTile>
                <div>
                  <h2 className="font-display text-3xl font-black">{step.title}</h2>
                  <p className="text-sm text-ink-muted">Nghe từng câu, che phần dịch và thử hiểu trước.</p>
                </div>
              </div>
              <ol className="space-y-3">
                {step.lines.map((ln, i) => {
                  const right = i % 2 === 1;
                  return (
                    <li key={i} className={cn("flex", right && "justify-end")}>
                      <div className={cn("max-w-[88%] rounded-3xl border-2 border-b-4 p-4", right ? "rounded-br-lg border-accent-tint border-b-accent bg-accent-soft" : "rounded-bl-lg border-line-strong bg-white")}>
                        <p className="text-xs font-black uppercase tracking-wider text-ink-muted">{ln.speaker}</p>
                        <div className="mt-1 flex items-start gap-2">
                          <SpeakButton text={ln.es} size="sm" />
                          <p className="es text-lg leading-snug">{ln.es}</p>
                        </div>
                        <p className="mt-1 pl-10 text-sm text-ink-soft">{ln.vi}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {step.kind === "exercise" &&
            (step.ex.id in results ? (
              <AnsweredRecap ex={step.ex} result={results[step.ex.id]} />
            ) : (
              <ExerciseRunner
                key={`${step.ex.id}-${attempt}`}
                exercise={step.ex}
                continueLabel={step.n === step.total ? "Xem kết quả" : "Tiếp tục"}
                onContinue={(r) => {
                  setResults((cur) => ({ ...cur, [step.ex.id]: r.correct }));
                  go(idx + 1);
                }}
              />
            ))}

          {step.kind === "summary" && (
            <Summary
              lessonTitle={lesson.title}
              summary={lesson.summary}
              correct={correct}
              total={graded.length}
              passed={passed}
              passRate={lesson.passRate}
              isAssessment={lesson.kind === "assessment"}
              xp={recorded?.xp ?? 0}
              wrong={graded.filter((e) => results[e.id] === false)}
              onRetry={retry}
              nextHref={nextLesson ? `/learn/${nextLesson.id}` : "/practice"}
              nextLabel={nextLesson ? `Bài tiếp: ${nextLesson.title}` : "Sang Luyện tập"}
            />
          )}
        </motion.section>
      </AnimatePresence>

      {/* Điều hướng Back / Next cho bước nội dung */}
      {step.kind !== "summary" && (
        <div className={cn("mt-8 flex items-center justify-between gap-3", step.kind !== "exercise" && "border-t-2 border-line pt-5")}>
          <Button variant="ghost" onClick={() => go(idx - 1)} disabled={idx === 0}>
            <ArrowLeft /> Quay lại
          </Button>
          {(step.kind !== "exercise" || step.ex.id in results) && (
            <Button size="lg" onClick={() => go(idx + 1)}>
              {step.kind === "intro" ? "Bắt đầu" : "Tiếp"} <ArrowRight />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function VocabRow({ v }: { v: VocabItem }) {
  return (
    <div className="chunky flex flex-col gap-3 border-line-strong p-5 sm:flex-row sm:items-start">
      <SpeakButton text={v.es} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <p className="es text-[28px] leading-tight">{v.es}</p>
          {v.kind && <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{v.kind}</span>}
        </div>
        <p className="text-lg font-semibold">{v.vi}</p>
        {v.pron && <p className="text-sm text-ink-muted">Đọc gần như: {v.pron}</p>}
        {v.note && (
          <p className="mt-1 flex gap-1.5 text-sm text-tone-butter">
            <Lightbulb className="mt-0.5 size-4 shrink-0" /> <span className="text-ink-soft">{v.note}</span>
          </p>
        )}
        <div className="mt-3 rounded-2xl bg-pastel-sky/70 p-3">
          <div className="flex items-center gap-2">
            <SpeakButton text={v.example.es} size="sm" label="Nghe câu ví dụ" />
            <p className="es text-[17px]">{v.example.es}</p>
          </div>
          <p className="mt-0.5 pl-10 text-sm text-ink-soft">{v.example.vi}</p>
        </div>
      </div>
    </div>
  );
}

function GrammarView({ g }: { g: GrammarPoint }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-3xl font-black leading-tight">{g.title}</h2>
      <div className="space-y-3 text-[17px] leading-relaxed text-ink-soft">
        {g.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {g.table && (
        <div className="overflow-x-auto rounded-2xl border-2 border-b-4 border-line-strong bg-white">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-brand-soft/60">
              <tr>
                {g.table.headers.map((h) => (
                  <th key={h} className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-brand">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-line">
                  {row.map((c, j) => (
                    <td key={j} className={cn("px-4 py-2.5", !looksVietnamese(c) && "es text-base text-ink")}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="grid gap-3">
        {g.examples.map((e) => (
          <div key={e.es} className="flex items-start gap-3 rounded-2xl border-2 border-[#BFDDF3] bg-pastel-sky p-4">
            <SpeakButton text={e.es} size="sm" />
            <div>
              <p className="es text-lg">{e.es}</p>
              <p className="text-sm text-ink-soft">{e.vi}</p>
            </div>
          </div>
        ))}
      </div>
      {g.tip && (
        <p className="flex gap-2.5 rounded-2xl border-2 border-[#F2DD95] bg-pastel-butter p-4 text-[15px]">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-tone-butter" />
          <span>
            <b>Mẹo: </b>
            {g.tip}
          </span>
        </p>
      )}
    </div>
  );
}

function AnsweredRecap({ ex, result }: { ex: Exercise; result: boolean | null }) {
  return (
    <div className="chunky space-y-2 border-line-strong p-6">
      <p className="flex items-center gap-2 font-display text-xl font-black">
        {result === true ? <CheckCircle2 className="size-6 text-success" /> : result === false ? <XCircle className="size-6 text-danger" /> : <Check className="size-6 text-tone-butter" />}
        {result === true ? "Bạn đã trả lời đúng câu này" : result === false ? "Bạn đã trả lời sai câu này" : "Bạn đã luyện xong phần này"}
      </p>
      <p className="text-ink-soft">{ex.explanation}</p>
      <p className="text-sm text-ink-muted">Muốn làm lại cả bài, đi tới cuối bài và chọn «Làm lại».</p>
    </div>
  );
}

function Summary({
  lessonTitle,
  summary,
  correct,
  total,
  passed,
  passRate,
  isAssessment,
  xp,
  wrong,
  onRetry,
  nextHref,
  nextLabel,
}: {
  lessonTitle: string;
  summary: string[];
  correct: number;
  total: number;
  passed: boolean;
  passRate?: number;
  isAssessment: boolean;
  xp: number;
  wrong: Exercise[];
  onRetry: () => void;
  nextHref: string;
  nextLabel: string;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 100;
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className={cn("chunky p-8 text-center", passed ? "border-accent-tint border-b-accent bg-pastel-peach" : "border-danger/30 border-b-danger bg-danger-soft")}
      >
        <p className="font-display text-sm font-black uppercase tracking-[0.2em] text-brand">{passed ? "¡Lección completada!" : "Todavía no…"}</p>
        <h2 className="mt-2 font-display text-4xl font-black">{passed ? "Hoàn thành bài học" : "Chưa đạt bài kiểm tra"}</h2>
        <p className="es mt-1 text-lg text-ink-soft">{lessonTitle}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="min-w-[120px] rounded-2xl border-2 border-b-4 border-line-strong bg-white px-5 py-3">
            <p className="font-display text-3xl font-black tnum">{pct}%</p>
            <p className="text-xs font-bold text-ink-muted">
              {correct}/{total} câu đúng
            </p>
          </div>
          <div className="min-w-[120px] rounded-2xl border-2 border-b-4 border-line-strong bg-white px-5 py-3">
            <p className="font-display text-3xl font-black text-accent-dark tnum">+{xp}</p>
            <p className="text-xs font-bold text-ink-muted">XP hoàn thành bài</p>
          </div>
        </div>
        {!passed && <p className="mt-4 text-ink-soft">Cần đúng ít nhất {Math.round((passRate ?? 0.7) * 100)}%. Xem lại các câu sai bên dưới rồi làm lại nhé.</p>}
        {passed && isAssessment && <p className="mt-4 font-semibold">Bạn đã hoàn thành Unit 1!</p>}
      </motion.div>

      {summary.length > 0 && passed && (
        <div className="chunky border-line-strong p-6">
          <h3 className="font-display text-xl font-black">Ghi nhớ</h3>
          <ul className="mt-3 space-y-2">
            {summary.map((s) => (
              <li key={s} className="flex gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-success" strokeWidth={3} /> <span className="font-semibold">{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">Từ vựng của bài đã được thêm vào lịch ôn tập.</p>
        </div>
      )}

      {wrong.length > 0 && (
        <div className="chunky border-danger/25 border-b-danger/60 p-6">
          <h3 className="font-display text-xl font-black">Xem lại câu sai</h3>
          <ul className="mt-3 space-y-3">
            {wrong.map((e) => (
              <li key={e.id} className="rounded-2xl bg-danger-soft/60 p-3 text-sm">
                <p className="font-bold">{EXERCISE_LABEL[e.type]}</p>
                <p className="text-ink-soft">{e.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {passed ? (
          <>
            <Button asChild size="lg">
              <Link href={nextHref}>
                {nextLabel} <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={onRetry}>
              <RotateCcw /> Làm lại bài tập
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onRetry}>
            <RotateCcw /> Làm lại bài kiểm tra
          </Button>
        )}
        <Button asChild variant="ghost" size="lg">
          <Link href="/learn">Về lộ trình</Link>
        </Button>
      </div>
    </div>
  );
}
