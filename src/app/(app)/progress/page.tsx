"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, BookOpen, Brain, Check, Clock, Flame, Lock, MessageCircle, Medal, Sparkles, Star, Target, Trophy, Zap } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { ACHIEVEMENTS, currentStreak, levelProgress, longestStreak, masteredCount, milestoneFor, XP_MILESTONES, type Achievement } from "@/lib/gamification";
import { daySeries, totalSeconds } from "@/lib/selectors";
import { AVAILABLE_LESSONS } from "@/data/curriculum";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ActivityChart } from "@/components/activity-chart";
import { IconTile } from "@/components/icon-tile";
import { PageSkeleton } from "@/components/states";
import { addDays, cn, formatMinutes, todayKey, WEEKDAY_VI } from "@/lib/utils";

const ICONS: Record<Achievement["icon"], React.ReactNode> = {
  sparkles: <Sparkles />,
  book: <BookOpen />,
  trophy: <Trophy />,
  flame: <Flame />,
  zap: <Zap />,
  brain: <Brain />,
  message: <MessageCircle />,
  target: <Target />,
  medal: <Medal />,
  star: <Star />,
};

export default function ProgressPage() {
  const { state, hydrated } = useProgress();
  if (!hydrated) return <PageSkeleton />;

  const ms = milestoneFor(state.xp);
  const streak = currentStreak(state);
  const best = longestStreak(state);
  const secs = totalSeconds(state);
  const acc = state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : null;
  const month = daySeries(state, 30);
  const levels = levelProgress(state);
  const unlockedCount = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;

  return (
    <div>
      <PageHeader
        pill="Progreso"
        pillText="Phân tích học tập"
        title="Nhìn lại"
        highlight="chặng đường."
        description="Mọi số liệu ở đây được tính từ hoạt động thật của bạn trên thiết bị này hoặc tài khoản đã đăng nhập."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Zap />} tone="accent" label="Tổng XP" value={state.xp} sub={`Cột mốc: ${ms.current.name}`} />
        <StatCard icon={<Flame />} tone="peach" label="Chuỗi hiện tại" value={streak} sub={`Dài nhất: ${best} ngày`} />
        <StatCard icon={<Clock />} tone="sky" label="Thời gian học" value={Math.round(secs / 60)} sub="phút có thao tác thật" />
        <StatCard icon={<Target />} tone="sage" label="Độ chính xác" value={acc === null ? "–" : `${acc}%`} sub={`${state.stats.correct}/${state.stats.answered} câu trả lời`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>XP 30 ngày qua</CardTitle>
            <CardDescription>Cột đỏ là ngày đạt mục tiêu {state.settings.dailyGoalXp} XP.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={month.map((d, i) => ({ ...d, label: i % 3 === 2 || d.isToday ? d.label : "" }))} goal={state.settings.dailyGoalXp} height={240} />
          </CardContent>
        </Card>

        <Card tone="accent">
          <CardHeader>
            <CardTitle>Cột mốc XP</CardTitle>
            <CardDescription>
              {ms.next ? `Còn ${ms.next.xp - state.xp} XP để lên «${ms.next.name}».` : "Bạn đã đạt cột mốc cao nhất."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm font-bold">
                <span className="es">{ms.current.name}</span>
                <span className="text-ink-muted">{ms.next?.name}</span>
              </div>
              <Progress value={ms.pct} />
            </div>
            <ol className="space-y-1.5">
              {XP_MILESTONES.map((m, i) => (
                <li key={m.name} className={cn("flex items-center justify-between rounded-xl px-3 py-1.5 text-sm", i === ms.index ? "bg-accent-soft font-bold" : i < ms.index ? "text-ink-soft" : "text-ink-muted")}>
                  <span className="flex items-center gap-2">
                    {i <= ms.index ? <Check className="size-4 text-success" /> : <Lock className="size-3.5" />}
                    <span className="es">{m.name}</span> <span className="font-normal">· {m.vi}</span>
                  </span>
                  <span className="tnum">{m.xp} XP</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lịch chuỗi ngày</CardTitle>
            <CardDescription>5 tuần gần nhất. Ô càng đậm, ngày đó càng nhiều XP.</CardDescription>
          </CardHeader>
          <CardContent>
            <StreakCalendar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thời gian học mỗi ngày</CardTitle>
            <CardDescription>Chỉ tính lúc bạn đang thao tác trong bài, luyện tập, ôn tập, AI Tutor.</CardDescription>
          </CardHeader>
          <CardContent>
            <MinutesChart data={daySeries(state, 14)} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tiến độ theo cấp độ CEFR</CardTitle>
          <CardDescription>Tính trên số bài đã phát hành của mỗi cấp.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((l) => (
            <div key={l.code} className={cn("rounded-2xl border-2 p-4", l.total ? "border-brand-tint bg-brand-soft/30" : "border-dashed border-line-strong")}>
              <div className="flex items-center justify-between">
                <p className="font-display text-xl font-black">
                  {l.code} <span className="text-sm font-bold text-ink-muted">· {l.name}</span>
                </p>
                {l.total ? <Badge variant="brand">{Math.round((l.done / l.total) * 100)}%</Badge> : <Badge variant="neutral">Sắp có</Badge>}
              </div>
              <Progress value={l.total ? (l.done / l.total) * 100 : 0} className="mt-3 h-2.5" />
              <p className="mt-2 text-xs text-ink-muted">
                {l.total ? `${l.done}/${l.total} bài đã có · ${l.plannedUnits} unit đang soạn` : `${l.plannedUnits} unit đang soạn`}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bài học đã hoàn thành</CardTitle>
          <CardDescription>
            {Object.keys(state.lessons).length}/{AVAILABLE_LESSONS.length} bài · {masteredCount(state)} từ đã thuộc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-muted">
                  <th className="py-2 pr-4">Bài</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2 pr-4">Điểm cao nhất</th>
                  <th className="py-2">Số lần làm</th>
                </tr>
              </thead>
              <tbody>
                {AVAILABLE_LESSONS.map((l) => {
                  const r = state.lessons[l.id];
                  return (
                    <tr key={l.id} className="border-t border-line">
                      <td className="py-2.5 pr-4">
                        <span className="es">{l.title}</span>
                        <span className="block text-xs text-ink-muted">{l.titleVi}</span>
                      </td>
                      <td className="py-2.5 pr-4">{r ? <Badge variant="success">Hoàn thành</Badge> : <Badge variant="neutral">Chưa học</Badge>}</td>
                      <td className="py-2.5 pr-4 tnum">{r ? `${Math.round(r.bestScore * 100)}%` : "–"}</td>
                      <td className="py-2.5 tnum">{r?.attempts ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <section id="achievements" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-black">Huy hiệu</h2>
          <p className="text-sm font-bold text-ink-muted tnum">
            {unlockedCount}/{ACHIEVEMENTS.length}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const got = state.achievements[a.id];
            return (
              <Card key={a.id} tone={got ? "butter" : "neutral"} className={cn("flex items-center gap-3 p-4", !got && "opacity-60")}>
                <IconTile tone={got ? "butter" : "lilac"} className={cn(!got && "grayscale")}>
                  {got ? ICONS[a.icon] : <Lock />}
                </IconTile>
                <div className="min-w-0">
                  <p className="es truncate">{a.title}</p>
                  <p className="text-xs text-ink-muted">{a.description}</p>
                  {got && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-tone-butter">
                      <Award className="size-3" /> {got.split("-").reverse().join("/")}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      <p className="mt-6 text-xs text-ink-muted">Tổng thời gian: {formatMinutes(secs)}.</p>
    </div>
  );
}

function StreakCalendar() {
  const { state } = useProgress();
  const today = todayKey();
  const [y, m, d] = today.split("-").map(Number);
  const dow = (new Date(y, m - 1, d).getDay() + 6) % 7; // T2 = 0
  const start = addDays(today, -(dow + 28));
  const cells = Array.from({ length: 35 }, (_, i) => addDays(start, i));
  const goal = state.settings.dailyGoalXp;
  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-ink-muted">
        {[1, 2, 3, 4, 5, 6, 0].map((i) => (
          <span key={i}>{WEEKDAY_VI[i]}</span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {cells.map((k) => {
          const xp = state.activity[k]?.xp ?? 0;
          const future = k > today;
          const level = xp === 0 ? 0 : xp < goal / 2 ? 1 : xp < goal ? 2 : 3;
          return (
            <span
              key={k}
              title={future ? "" : `${k.split("-").reverse().join("/")}: ${xp} XP`}
              className={cn(
                "grid aspect-square place-items-center rounded-lg text-[11px] font-bold",
                future && "border-2 border-dashed border-line text-ink-muted/40",
                !future && level === 0 && "bg-ink/[0.05] text-ink-muted",
                level === 1 && "bg-accent-tint text-accent-dark",
                level === 2 && "bg-accent text-white",
                level === 3 && "bg-brand text-white",
                k === today && "ring-2 ring-ink ring-offset-2 ring-offset-white",
              )}
            >
              {Number(k.split("-")[2])}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MinutesChart({ data }: { data: { key: string; label: string; minutes: number }[] }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="minFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3C86C2" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3C86C2" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#EFE3D8" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6E6773", fontSize: 11 }} interval={1} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: "#6E6773", fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [`${v} phút`, "Thời gian"]} contentStyle={{ borderRadius: 12, border: "2px solid #E2D2C4" }} />
          <Area type="monotone" dataKey="minutes" stroke="#3C86C2" strokeWidth={2.5} fill="url(#minFill)" dot={{ r: 3, fill: "#3C86C2" }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
