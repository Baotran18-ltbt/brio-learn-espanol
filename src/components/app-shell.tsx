"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChartColumn,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Map,
  Menu,
  MessagesSquare,
  Repeat2,
  Settings,
  Zap,
} from "lucide-react";
import { Logo } from "./logo";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useProgress } from "@/lib/progress/store";
import { currentStreak } from "@/lib/gamification";
import { isDue } from "@/lib/srs";
import { cn, todayKey } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Tổng quan", en: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Lộ trình", en: "Learning Path", icon: Map },
  { href: "/practice", label: "Luyện tập", en: "Practice", icon: Dumbbell },
  { href: "/vocabulary", label: "Từ vựng", en: "Vocabulary", icon: BookOpen },
  { href: "/review", label: "Ôn tập", en: "Review", icon: Repeat2 },
  { href: "/ai-tutor", label: "AI Tutor", en: "Conversation", icon: MessagesSquare },
  { href: "/progress", label: "Tiến độ", en: "My Progress", icon: ChartColumn },
  { href: "/settings", label: "Cài đặt", en: "Settings", icon: Settings },
] as const;

const MOBILE_NAV = ["/dashboard", "/learn", "/practice", "/review", "/ai-tutor"];

function useDueCount() {
  const { state } = useProgress();
  const t = todayKey();
  return Object.values(state.srs).filter((c) => isDue(c, t)).length;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const due = useDueCount();
  return (
    <nav aria-label="Điều hướng chính" className="flex flex-col gap-1">
      {NAV.map(({ href, label, en, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border-2 border-transparent px-3 py-2.5 font-bold text-ink-soft transition",
              active ? "border-brand-tint border-b-[4px] bg-brand-soft text-brand" : "hover:bg-ink/[0.04] hover:text-ink",
            )}
          >
            <Icon className={cn("size-5 transition-transform group-hover:scale-110", active && "text-brand")} />
            <span className="flex-1">
              {label}
              <span className="sr-only"> ({en})</span>
            </span>
            {href === "/review" && due > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-black text-white tnum">{due}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function StatusChips() {
  const { state, hydrated } = useProgress();
  const streak = currentStreak(state);
  const today = state.activity[todayKey()]?.xp ?? 0;
  const goal = state.settings.dailyGoalXp;
  const pct = Math.min(100, (today / goal) * 100);
  if (!hydrated) return <div className="h-10 w-48" />;
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/progress"
        className="flex items-center gap-1.5 rounded-full border-2 border-b-[4px] border-accent-tint bg-white px-3 py-1.5 text-sm font-black text-accent-dark"
        title="Chuỗi ngày học liên tiếp"
      >
        <Flame className={cn("size-4", streak > 0 ? "fill-accent text-accent" : "text-ink-muted")} />
        <span className="tnum">{streak}</span>
        <span className="sr-only">ngày liên tiếp</span>
      </Link>
      <Link
        href="/progress"
        className="flex items-center gap-2 rounded-full border-2 border-b-[4px] border-line-strong bg-white py-1.5 pl-3 pr-2 text-sm font-black"
        title={`Hôm nay ${today}/${goal} XP`}
      >
        <Zap className="size-4 fill-[#FFC94D] text-[#E8A91B]" />
        <span className="tnum">
          {today}
          <span className="font-semibold text-ink-muted">/{goal} XP</span>
        </span>
        <span className="hidden h-2.5 w-16 overflow-hidden rounded-full bg-ink/10 sm:block" aria-hidden="true">
          <span className="block h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </span>
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const due = useDueCount();
  const inLesson = /^\/learn\/.+/.test(pathname);

  return (
    <div className="min-h-dvh">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r-2 border-line bg-cream/95 px-4 py-6 backdrop-blur lg:flex">
        <Logo href="/dashboard" className="px-2" />
        <div className="mt-8 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <div className="rounded-3xl border-2 border-b-[5px] border-[#F2DD95] border-b-tone-butter bg-pastel-butter p-4">
          <p className="font-display text-sm font-black">A1 · Unit 1 đã sẵn sàng</p>
          <p className="mt-1 text-xs text-ink-soft">Các unit khác đang được soạn. Mở Lộ trình để xem kế hoạch.</p>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b-2 border-line bg-cream/90 backdrop-blur lg:ml-[264px]">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 lg:hidden">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="rounded-xl p-2 text-ink hover:bg-ink/5" aria-label="Mở menu">
                <Menu className="size-6" />
              </DialogTrigger>
              <DialogContent side="left">
                <DialogTitle className="sr-only">Menu</DialogTitle>
                <Logo href="/dashboard" />
                <div className="mt-8">
                  <NavList onNavigate={() => setOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
            <Logo href="/dashboard" compact className="max-[380px]:hidden" />
          </div>
          <p className="hidden text-sm font-semibold text-ink-muted lg:block">
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <StatusChips />
        </div>
      </header>

      <main className={cn("px-4 pb-28 pt-8 sm:px-6 lg:ml-[264px] lg:px-10 lg:pb-16", inLesson && "pb-10")}>
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Bottom nav mobile */}
      {!inLesson && (
        <nav
          aria-label="Điều hướng nhanh"
          className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur lg:hidden"
        >
          <ul className="mx-auto flex max-w-md justify-between">
            {NAV.filter((n) => MOBILE_NAV.includes(n.href)).map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative flex w-16 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-bold", active ? "text-brand" : "text-ink-muted")}
                  >
                    <Icon className={cn("size-6", active && "fill-brand-soft")} />
                    {label}
                    {href === "/review" && due > 0 && (
                      <span className="absolute right-2 top-0 rounded-full bg-accent px-1.5 text-[10px] font-black text-white">{due}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
