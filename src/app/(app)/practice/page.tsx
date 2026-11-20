"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Headphones, Info, Languages, ListChecks, ListOrdered, PencilLine, Puzzle, RotateCcw, Shuffle, X } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { useStudyTimer } from "@/lib/hooks";
import { buildSession, practicePool, PRACTICE_MODES, type PracticeMode } from "@/lib/practice";
import type { Exercise } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IconTile, type TileTone } from "@/components/icon-tile";
import { ExerciseRunner, EXERCISE_LABEL } from "@/components/exercises/exercise-runner";
import { PageSkeleton } from "@/components/states";
import { celebrate } from "@/components/celebrate";
import { cn } from "@/lib/utils";

const ICONS: Record<PracticeMode, { icon: React.ReactNode; tone: TileTone }> = {
  mixed: { icon: <Shuffle />, tone: "brand" },
  "multiple-choice": { icon: <ListChecks />, tone: "sky" },
  "fill-blank": { icon: <PencilLine />, tone: "butter" },
  translate: { icon: <Languages />, tone: "sage" },
  "sentence-order": { icon: <ListOrdered />, tone: "peach" },
  listening: { icon: <Headphones />, tone: "lilac" },
  matching: { icon: <Puzzle />, tone: "rose" },
};

type Session = { mode: PracticeMode; items: Exercise[]; i: number; results: { ex: Exercise; correct: boolean | null }[] };

export default function PracticePage() {
  const { state, hydrated, finishPractice } = useProgress();
  const [session, setSession] = React.useState<Session | null>(null);
  const [finished, setFinished] = React.useState(false);
  useStudyTimer(Boolean(session));

  if (!hydrated) return <PageSkeleton />;
  const { words, limited } = practicePool(state);

  const start = (mode: PracticeMode) => {
    setFinished(false);
    setSession({ mode, items: buildSession(state, mode, mode === "matching" ? 5 : 10), i: 0, results: [] });
  };

  if (session && !finished) {
    const ex = session.items[session.i];
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => setSession(null)} aria-label="Thoát luyện tập" className="rounded-full p-2 text-ink-muted hover:bg-ink/5 hover:text-ink">
            <X className="size-6" />
          </button>
          <Progress value={(session.i / session.items.length) * 100} className="h-4 flex-1" />
          <span className="font-display text-sm font-black text-ink-muted tnum">
            {session.i + 1}/{session.items.length}
          </span>
        </div>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-muted">{EXERCISE_LABEL[ex.type]}</p>
        <motion.div key={ex.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <ExerciseRunner
            key={ex.id}
            exercise={ex}
            continueLabel={session.i === session.items.length - 1 ? "Xem kết quả" : "Tiếp tục"}
            onContinue={(r) => {
              const results = [...session.results, { ex, correct: r.correct }];
              if (session.i + 1 >= session.items.length) {
                const graded = results.filter((x) => x.correct !== null);
                const ok = graded.filter((x) => x.correct).length;
                finishPractice(ok, graded.length);
                if (ok === graded.length) celebrate();
                setSession({ ...session, results });
                setFinished(true);
              } else setSession({ ...session, i: session.i + 1, results });
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (session && finished) {
    const graded = session.results.filter((x) => x.correct !== null);
    const ok = graded.filter((x) => x.correct).length;
    const wrong = session.results.filter((x) => x.correct === false);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card tone={ok === graded.length ? "accent" : "brand"} className="p-8 text-center">
          <p className="font-display text-sm font-black uppercase tracking-[0.2em] text-brand">{ok === graded.length ? "¡Perfecto!" : "¡Buen trabajo!"}</p>
          <h1 className="mt-2 font-display text-5xl font-black tnum">
            {ok}/{graded.length}
          </h1>
          <p className="mt-2 text-ink-soft">câu đúng · +{ok * 2 + 10} XP (2 XP mỗi câu đúng, 10 XP hoàn thành lượt)</p>
        </Card>
        {wrong.length > 0 && (
          <Card className="p-6">
            <h2 className="font-display text-xl font-black">Câu cần xem lại</h2>
            <ul className="mt-3 space-y-2">
              {wrong.map(({ ex }) => (
                <li key={ex.id} className="rounded-2xl bg-danger-soft/60 p-3 text-sm">
                  <p className="font-bold">{EXERCISE_LABEL[ex.type]}</p>
                  <p className="text-ink-soft">{ex.explanation}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => start(session.mode)}>
            <RotateCcw /> Lượt mới (câu hỏi khác)
          </Button>
          <Button size="lg" variant="outline" onClick={() => setSession(null)}>
            Chọn kiểu khác
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/review">Ôn thẻ từ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        pill="Práctica"
        pillText="Trung tâm luyện tập"
        title="Luyện đến khi"
        highlight="thành phản xạ."
        description="Mỗi lượt 10 câu được tạo mới từ những từ bạn đã học, thứ tự và phương án luôn xáo trộn."
      />

      {limited && (
        <p className="mb-6 flex items-start gap-2 rounded-2xl border-2 border-[#F2DD95] bg-pastel-butter p-4 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-tone-butter" />
          Bạn chưa học đủ từ nên lượt luyện sẽ dùng toàn bộ {words.length} từ của Unit 1. Học xong vài bài để luyện đúng phần mình đã biết.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_MODES.map((m, i) => {
          const meta = ICONS[m.id];
          return (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => start(m.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "chunky group flex flex-col gap-3 p-6 text-left transition-transform hover:-translate-y-1",
                m.id === "mixed" ? "border-brand-tint border-b-brand/70 sm:col-span-2 lg:col-span-1" : "border-line-strong",
              )}
            >
              <IconTile tone={meta.tone}>{meta.icon}</IconTile>
              <span className="font-display text-xl font-black">{m.label}</span>
              <span className="text-ink-muted">{m.hint}</span>
              <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-bold text-brand">
                Bắt đầu <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          );
        })}
      </div>

      <Card flat className="mt-8 flex flex-col gap-2 p-5 sm:flex-row sm:items-center">
        <CheckCircle2 className="size-5 shrink-0 text-success" />
        <p className="text-sm text-ink-soft">
          Luyện nói nằm trong từng bài học (bước «Luyện nói»), vì cần câu mẫu cụ thể. Bạn cũng có thể luyện hội thoại tự do ở{" "}
          <Link href="/ai-tutor" className="font-bold text-brand underline-offset-2 hover:underline">
            AI Tutor
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
