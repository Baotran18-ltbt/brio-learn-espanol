"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock, Flag, Lock, Play, Sparkles, Star } from "lucide-react";
import { CURRICULUM, isLessonUnlocked } from "@/data/curriculum";
import type { CEFRCode, Lesson, Unit } from "@/lib/types";
import { useProgress } from "@/lib/progress/store";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageSkeleton } from "@/components/states";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const { state, hydrated } = useProgress();
  const [level, setLevel] = React.useState<CEFRCode>("A1");
  if (!hydrated) return <PageSkeleton />;
  const lvl = CURRICULUM.find((l) => l.code === level)!;

  return (
    <div>
      <PageHeader
        pill="Ruta"
        pillText="Lộ trình CEFR"
        title="Từng bước, từ A1"
        highlight="đến C2."
        description="Mỗi cấp gồm nhiều unit, mỗi unit có bài học, bài tập và một bài kiểm tra. Hiện đã mở A1 · Unit 1."
      />

      <div role="tablist" aria-label="Cấp độ CEFR" className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {CURRICULUM.map((l) => {
          const lessons = l.units.flatMap((u) => u.lessons);
          const done = lessons.filter((x) => state.lessons[x.id]).length;
          const active = l.code === level;
          return (
            <button
              key={l.code}
              role="tab"
              aria-selected={active}
              onClick={() => setLevel(l.code)}
              className={cn(
                "flex min-w-[112px] shrink-0 flex-col items-start rounded-2xl border-2 border-b-[4px] px-4 py-2.5 text-left transition",
                active ? "border-brand border-b-brand-dark bg-brand text-white" : "border-line-strong bg-white hover:border-brand-tint",
              )}
            >
              <span className="font-display text-xl font-black">{l.code}</span>
              <span className={cn("text-xs font-semibold", active ? "text-white/85" : "text-ink-muted")}>
                {l.nameVi}
                {lessons.length > 0 && ` · ${done}/${lessons.length}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-2xl font-black">
          {lvl.code} · {lvl.name}
        </h2>
        <p className="text-ink-muted">{lvl.description}</p>
      </div>

      <div className="space-y-6">
        {lvl.units.map((u) =>
          u.status === "available" ? <UnitMap key={u.id} unit={u} /> : <UpcomingUnit key={u.id} unit={u} />,
        )}
      </div>
    </div>
  );
}

function UnitMap({ unit }: { unit: Unit }) {
  const { state } = useProgress();
  const done = unit.lessons.filter((l) => state.lessons[l.id]).length;
  const current = unit.lessons.find((l) => !state.lessons[l.id] && isLessonUnlocked(l, state.lessons));

  return (
    <Card tone="brand" className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b-2 border-line bg-brand-soft/50 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="brand">Unit {unit.order}</Badge>
            {done === unit.lessons.length && (
              <Badge variant="success">
                <Check /> Đã hoàn thành
              </Badge>
            )}
          </div>
          <h3 className="mt-2 font-display text-2xl font-black">
            <span className="es">{unit.title}</span> <span className="text-ink-muted">· {unit.titleVi}</span>
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{unit.description}</p>
        </div>
        <div className="w-full sm:w-56">
          <Progress value={(done / unit.lessons.length) * 100} />
          <p className="mt-1 text-right text-xs font-bold text-ink-muted tnum">
            {done}/{unit.lessons.length} bài
          </p>
        </div>
      </div>

      {/* Bản đồ cấp độ zig-zag */}
      <ol className="relative mx-auto flex max-w-3xl flex-col gap-2 px-5 py-8 sm:px-8">
        {unit.lessons.map((l, i) => {
          const status: NodeStatus = state.lessons[l.id] ? "done" : l.id === current?.id ? "current" : isLessonUnlocked(l, state.lessons) ? "open" : "locked";
          const offset = [0, 1, 2, 1, 0, 1][i % 6];
          return <PathNode key={l.id} lesson={l} status={status} offset={offset} score={state.lessons[l.id]?.bestScore} last={i === unit.lessons.length - 1} />;
        })}
      </ol>
    </Card>
  );
}

type NodeStatus = "done" | "current" | "open" | "locked";

function PathNode({ lesson, status, offset, score, last }: { lesson: Lesson; status: NodeStatus; offset: number; score?: number; last: boolean }) {
  const isTest = lesson.kind === "assessment";
  const Icon = status === "done" ? Check : status === "locked" ? Lock : isTest ? Flag : status === "current" ? Play : Star;
  return (
    <li className="relative">
      <div className="flex items-center gap-4 sm:gap-6" style={{ paddingLeft: `calc(${offset} * clamp(0px, 9vw, 96px))` }}>
        <Link href={`/learn/${lesson.id}`} aria-label={`${lesson.title}: ${status === "done" ? "đã xong" : status === "locked" ? "chưa mở" : "học ngay"}`} className="relative shrink-0">
          {status === "current" && (
            <motion.span
              aria-hidden="true"
              className="absolute -inset-2 rounded-full border-4 border-accent/40"
              animate={{ scale: [1, 1.08, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <span
            className={cn(
              "relative grid size-[72px] place-items-center rounded-full border-2 border-b-[6px] transition-transform hover:-translate-y-0.5 [&_svg]:size-8",
              status === "done" && "border-brand border-b-brand-dark bg-brand text-white",
              status === "current" && "border-accent border-b-accent-dark bg-accent text-white",
              status === "open" && "border-accent-tint border-b-accent bg-white text-accent-dark",
              status === "locked" && "border-line-strong bg-[#F4EEE8] text-ink-muted",
            )}
          >
            <Icon strokeWidth={2.6} />
          </span>
        </Link>
        <div className={cn("min-w-0 rounded-2xl border-2 border-b-4 bg-white px-4 py-3", status === "current" ? "border-accent-tint border-b-accent" : "border-line")}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{isTest ? "Kiểm tra" : `Bài ${lesson.order}`}</span>
            {status === "current" && (
              <Badge variant="accent">
                <Sparkles /> Tiếp theo
              </Badge>
            )}
            {status === "done" && score !== undefined && <Badge variant="success">{Math.round(score * 100)}% đúng</Badge>}
          </div>
          <p className="es truncate text-lg leading-tight">{lesson.title}</p>
          <p className="truncate text-sm text-ink-muted">{lesson.titleVi}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="size-3" /> {lesson.minutes} phút · +{lesson.xp} XP
          </p>
        </div>
      </div>
      {!last && <span aria-hidden="true" className="ml-[34px] block h-4 w-1 rounded bg-line-strong" style={{ marginLeft: `calc(${offset} * clamp(0px, 9vw, 96px) + 34px)` }} />}
    </li>
  );
}

function UpcomingUnit({ unit }: { unit: Unit }) {
  return (
    <Card flat className="flex flex-col gap-3 border-dashed p-5 opacity-90 sm:flex-row sm:items-center sm:p-6">
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#F4EEE8] text-ink-muted">
        <Lock className="size-6" />
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Unit {unit.order}</Badge>
          <Badge variant="neutral">Sắp ra mắt</Badge>
        </div>
        <h3 className="mt-1.5 font-display text-xl font-black">
          <span className="es">{unit.title}</span> <span className="text-ink-muted">· {unit.titleVi}</span>
        </h3>
        <p className="mt-1 text-sm text-ink-muted">Dự kiến: {unit.plannedTopics?.join(", ")}</p>
      </div>
      <Button variant="outline" disabled>
        Chưa mở
      </Button>
    </Card>
  );
}
