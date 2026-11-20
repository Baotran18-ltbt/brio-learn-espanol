"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, CheckCircle2, Circle, Clock, Flame, GraduationCap, Repeat2, Trophy } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { ACHIEVEMENTS, completedLessonCount, currentStreak, masteredCount } from "@/lib/gamification";
import { daySeries, dueCards, greeting, nextLesson } from "@/lib/selectors";
import { AVAILABLE_LESSONS, CURRICULUM } from "@/data/curriculum";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ActivityChart } from "@/components/activity-chart";
import { IconTile } from "@/components/icon-tile";
import { PageSkeleton } from "@/components/states";
import { cn, formatMinutes, todayKey } from "@/lib/utils";

export default function DashboardPage() {
  const { state, hydrated } = useProgress();
  if (!hydrated) return <PageSkeleton />;

  const g = greeting();
  const name = state.settings.displayName.trim();
  const today = state.activity[todayKey()];
  const todayXp = today?.xp ?? 0;
  const goal = state.settings.dailyGoalXp;
  const streak = currentStreak(state);
  const lessonsDone = completedLessonCount(state);
  const mastered = masteredCount(state);
  const inReview = Object.keys(state.srs).length;
  const due = dueCards(state).length;
  const next = nextLesson(state);
  const week = daySeries(state, 7);
  const weekXp = week.reduce((s, d) => s + d.xp, 0);
  const a1Lessons = CURRICULUM[0].units.filter((u) => u.status === "available").flatMap((u) => u.lessons);
  const a1Done = a1Lessons.filter((l) => state.lessons[l.id]).length;
  const recent = ACHIEVEMENTS.filter((a) => state.achievements[a.id])
    .sort((a, b) => state.achievements[b.id].localeCompare(state.achievements[a.id]))
    .slice(0, 3);
  const isNew = state.xp === 0 && lessonsDone === 0;

  const goals = [
    { label: "Học hoặc ôn lại một bài", done: (today?.lessons ?? 0) > 0 },
    { label: due > 0 ? `Ôn ${due} thẻ đến hạn` : "Ôn thẻ từ (không còn thẻ đến hạn)", done: due === 0 && inReview > 0 ? true : (today?.reviews ?? 0) > 0 },
    { label: "Làm vài câu luyện tập", done: (today?.exercises ?? 0) >= 5 },
  ];

  return (
    <div>
      <PageHeader
        pill="Hoy"
        pillText={new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}
        title={`${g.es}${name ? `, ${name}` : ""}!`}
        description={
          isNew
            ? "Chào mừng bạn. Bắt đầu với bài đầu tiên để mở khoá thống kê và lịch ôn tập."
            : `${g.vi}! Hôm nay bạn đạt ${todayXp}/${goal} XP${todayXp >= goal ? ", đã xong mục tiêu." : "."}`
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<GraduationCap />} tone="brand" label="Trình độ hiện tại" value="A1" sub={`Nhập môn · ${a1Done}/${a1Lessons.length} bài đã có`} />
        <StatCard icon={<Flame />} tone="peach" label="Chuỗi ngày học" value={streak} sub={streak ? "ngày liên tiếp" : "Học hôm nay để bắt đầu chuỗi"} />
        <StatCard icon={<BookOpen />} tone="sky" label="Bài đã hoàn thành" value={lessonsDone} sub={`trên ${AVAILABLE_LESSONS.length} bài hiện có`} />
        <StatCard icon={<Brain />} tone="lilac" label="Từ đã thuộc" value={mastered} sub={inReview ? `${inReview} từ trong lịch ôn` : "Học bài để thêm từ"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        {/* Tiếp tục học */}
        <Card tone="brand" className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute -right-10 -top-10 size-48 rounded-full bg-brand-soft" />
          <CardContent className="relative flex h-full flex-col gap-5">
            {next ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{next.kind === "assessment" ? "Bài kiểm tra" : `Bài ${next.order}`}</Badge>
                  <Badge variant="outline">
                    <Clock /> {next.minutes} phút · +{next.xp} XP
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-ink-muted">{lessonsDone ? "Bài tiếp theo nên học" : "Bắt đầu từ đây"}</p>
                  <h2 className="es mt-1 text-[34px] leading-tight">{next.title}</h2>
                  <p className="text-lg text-ink-soft">{next.titleVi}</p>
                </div>
                <ul className="grid gap-1.5 text-sm text-ink-soft sm:grid-cols-2">
                  {next.objectives.slice(0, 4).map((o) => (
                    <li key={o} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /> {o}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <Button asChild size="lg">
                    <Link href={`/learn/${next.id}`}>
                      {lessonsDone ? "Tiếp tục học" : "Bắt đầu học"} <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/learn">Xem cả lộ trình</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col justify-center gap-3">
                <Trophy className="size-10 text-accent" />
                <h2 className="font-display text-3xl font-black">Bạn đã xong toàn bộ Unit 1!</h2>
                <p className="text-ink-soft">Unit 2 đang được soạn. Trong lúc chờ, hãy giữ từ vựng bằng ôn tập và luyện hội thoại.</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/review">Ôn tập</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/ai-tutor">Nói chuyện với AI Tutor</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mục tiêu hôm nay */}
        <Card tone="accent">
          <CardHeader>
            <CardTitle>Mục tiêu hôm nay</CardTitle>
            <CardDescription>Đổi mục tiêu XP trong Cài đặt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-5">
              <GoalRing value={todayXp} goal={goal} />
              <div>
                <p className="font-display text-3xl font-black tnum">
                  {todayXp}
                  <span className="text-lg text-ink-muted">/{goal} XP</span>
                </p>
                <p className="text-sm text-ink-muted">
                  <Clock className="mr-1 inline size-3.5" />
                  {formatMinutes(today?.seconds ?? 0)} hôm nay
                </p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {goals.map((g) => (
                <li key={g.label} className={cn("flex items-center gap-2.5 text-sm font-semibold", g.done ? "text-success-dark" : "text-ink-soft")}>
                  {g.done ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-line-strong" />}
                  {g.label}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Hoạt động 7 ngày qua</CardTitle>
              <CardDescription>
                {weekXp} XP · {formatMinutes(week.reduce((s, d) => s + d.minutes * 60, 0))}. Cột đỏ là ngày đạt mục tiêu.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/progress">Chi tiết</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ActivityChart data={week} goal={goal} />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card tone="lilac">
            <CardContent className="flex items-center gap-4">
              <IconTile tone="lilac" size="lg">
                <Repeat2 />
              </IconTile>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-black">{due ? `${due} thẻ cần ôn` : "Không có thẻ đến hạn"}</p>
                <p className="text-sm text-ink-muted">{inReview ? `Tổng cộng ${inReview} từ trong lịch ôn SM-2.` : "Từ của mỗi bài sẽ vào lịch ôn khi bạn học xong bài."}</p>
              </div>
              <Button asChild variant={due ? "primary" : "outline"} size="sm">
                <Link href={due ? "/review" : "/vocabulary"}>{due ? "Ôn ngay" : "Từ vựng"}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card tone="butter">
            <CardHeader>
              <CardTitle>Huy hiệu gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {recent.length ? (
                <ul className="space-y-3">
                  {recent.map((a) => (
                    <li key={a.id} className="flex items-center gap-3">
                      <IconTile tone="butter" size="sm">
                        <Trophy />
                      </IconTile>
                      <div>
                        <p className="font-bold">{a.title}</p>
                        <p className="text-xs text-ink-muted">{a.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">Chưa có huy hiệu. Hoàn thành bài đầu tiên để nhận «Primer paso».</p>
              )}
              <Button asChild variant="link" className="mt-2 h-auto px-0">
                <Link href="/progress#achievements">Xem tất cả huy hiệu</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-display text-lg font-black">Tiến độ A1 · Beginner</p>
            <p className="text-sm text-ink-muted">Tính trên các bài đã phát hành. Unit 2–4 của A1 đang được soạn.</p>
          </div>
          <div className="w-full sm:w-80">
            <Progress value={(a1Done / a1Lessons.length) * 100} />
            <p className="mt-1 text-right text-xs font-bold text-ink-muted tnum">
              {a1Done}/{a1Lessons.length} bài
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(1, value / goal);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 84 84" className="size-24 shrink-0 -rotate-90" role="img" aria-label={`${Math.round(pct * 100)}% mục tiêu`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="#FFEDE1" strokeWidth="10" />
      <circle
        cx="42"
        cy="42"
        r={r}
        fill="none"
        stroke={pct >= 1 ? "#B52B38" : "#FF914D"}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className="transition-[stroke-dashoffset] duration-1000 ease-out"
      />
    </svg>
  );
}
