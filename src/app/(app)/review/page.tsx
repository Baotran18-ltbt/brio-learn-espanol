"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, PartyPopper, Repeat2 } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { useStudyTimer } from "@/lib/hooks";
import { dueCards, lookupWord } from "@/lib/selectors";
import { GRADE_LABELS, previewInterval, type Grade } from "@/lib/srs";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/components/flashcard";
import { EmptyState, PageSkeleton } from "@/components/states";
import { celebrate } from "@/components/celebrate";
import { cn, diffDays, todayKey } from "@/lib/utils";

const GRADES: Grade[] = [1, 3, 4, 5];
const GRADE_STYLE: Record<Grade, "danger" | "accent" | "success" | "outline"> = { 1: "danger", 3: "accent", 4: "success", 5: "outline" };
const DAILY_LIMIT = 30;

export default function ReviewPage() {
  const { state, hydrated, reviewCard } = useProgress();
  const [queue, setQueue] = React.useState<string[] | null>(null);
  const [pos, setPos] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [done, setDone] = React.useState({ total: 0, again: 0 });
  const requeued = React.useRef(new Set<string>());
  useStudyTimer(Boolean(queue));

  const due = hydrated ? dueCards(state) : [];

  const start = () => {
    requeued.current.clear();
    setQueue(due.slice(0, DAILY_LIMIT).map((c) => c.id));
    setPos(0);
    setFlipped(false);
    setDone({ total: 0, again: 0 });
  };

  const currentId = queue?.[pos];
  const grade = React.useCallback(
    (g: Grade) => {
      if (!queue || !currentId) return;
      reviewCard(currentId, g);
      setDone((d) => ({ total: d.total + 1, again: d.again + (g === 1 ? 1 : 0) }));
      let q = queue;
      if (g === 1 && !requeued.current.has(currentId)) {
        requeued.current.add(currentId);
        q = [...queue, currentId];
        setQueue(q);
      }
      setFlipped(false);
      if (pos + 1 >= q.length) celebrate();
      setPos((p) => p + 1);
    },
    [queue, currentId, pos, reviewCard],
  );

  React.useEffect(() => {
    if (!queue) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (flipped && ["1", "2", "3", "4"].includes(e.key)) grade(GRADES[Number(e.key) - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queue, flipped, grade]);

  if (!hydrated) return <PageSkeleton />;

  const allCards = Object.values(state.srs);
  const upcoming = allCards.filter((c) => c.due > todayKey()).sort((a, b) => a.due.localeCompare(b.due));

  /* ---------- đang ôn ---------- */
  if (queue) {
    if (!currentId) {
      return (
        <EmptyState
          icon={<PartyPopper />}
          tone="peach"
          title="¡Repaso terminado!"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              {dueCards(state).length > 0 && <Button onClick={start}>Ôn tiếp {dueCards(state).length} thẻ</Button>}
              <Button asChild variant="outline">
                <Link href="/dashboard">Về tổng quan</Link>
              </Button>
            </div>
          }
        >
          Bạn vừa ôn {done.total} lượt thẻ{done.again ? `, trong đó ${done.again} lần chọn «Quên»` : ""}. Lịch ôn của từng từ đã được cập nhật.
        </EmptyState>
      );
    }
    const w = lookupWord(state, currentId);
    const card = state.srs[currentId];
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => setQueue(null)} className="rounded-full px-3 py-1.5 text-sm font-bold text-ink-muted hover:bg-ink/5">
            Dừng
          </button>
          <Progress value={(pos / queue.length) * 100} className="h-4 flex-1" />
          <span className="font-display text-sm font-black text-ink-muted tnum">
            {pos + 1}/{queue.length}
          </span>
        </div>
        {w ? (
          <Flashcard card={w} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        ) : (
          <p className="text-center text-ink-muted">Không tìm thấy từ này (có thể đã bị xoá).</p>
        )}
        <div className="mt-6">
          {flipped ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GRADES.map((g, i) => (
                <Button key={g} variant={GRADE_STYLE[g]} size="lg" className="h-auto flex-col gap-0 py-2.5" onClick={() => grade(g)}>
                  <span>
                    <span className="mr-1 text-xs opacity-70">{i + 1}</span>
                    {GRADE_LABELS[g].label}
                  </span>
                  <span className="text-xs font-semibold opacity-80">{card ? previewInterval(card, g) : ""}</span>
                </Button>
              ))}
            </div>
          ) : (
            <Button size="lg" className="w-full" onClick={() => setFlipped(true)}>
              Xem nghĩa
            </Button>
          )}
          <p className="mt-3 text-center text-xs text-ink-muted">Space để lật thẻ · phím 1–4 để chấm mức nhớ · dòng nhỏ là lần ôn tiếp theo</p>
        </div>
      </div>
    );
  }

  /* ---------- màn hình bắt đầu ---------- */
  const nextDue = upcoming[0];
  const buckets = [
    { label: "Ngày mai", n: upcoming.filter((c) => diffDays(c.due, todayKey()) === 1).length },
    { label: "Trong 7 ngày", n: upcoming.filter((c) => diffDays(c.due, todayKey()) <= 7).length },
    { label: "Sau 7 ngày", n: upcoming.filter((c) => diffDays(c.due, todayKey()) > 7).length },
  ];

  return (
    <div>
      <PageHeader
        pill="Repaso"
        pillText="Ôn tập ngắt quãng"
        title="Ôn đúng lúc,"
        highlight="nhớ thật lâu."
        description="Thuật toán dựa trên SM-2: nhớ tốt thì khoảng cách giữa các lần ôn giãn ra, quên thì học lại từ đầu."
      />
      {allCards.length === 0 ? (
        <EmptyState
          icon={<Repeat2 />}
          tone="lilac"
          title="Chưa có thẻ nào để ôn"
          action={
            <Button asChild>
              <Link href="/learn/a1-u1-l1">Học bài đầu tiên</Link>
            </Button>
          }
        >
          Từ vựng của mỗi bài sẽ vào lịch ôn khi bạn học xong bài đó. Bạn cũng có thể bấm «Chưa biết» ở trang Từ vựng.
        </EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className={cn("chunky flex flex-col items-start gap-4 p-7", due.length ? "border-brand-tint border-b-brand/70" : "border-[#BFE3C9] border-b-tone-sage")}>
            <p className="font-display text-6xl font-black tnum">{due.length}</p>
            <p className="text-lg font-semibold">{due.length ? "thẻ đến hạn hôm nay" : "Hôm nay không còn thẻ đến hạn"}</p>
            <p className="text-ink-muted">
              {due.length
                ? `Mỗi lượt tối đa ${DAILY_LIMIT} thẻ, mất khoảng ${Math.max(1, Math.round((Math.min(due.length, DAILY_LIMIT) * 8) / 60))} phút.`
                : nextDue
                  ? `Thẻ tiếp theo đến hạn ngày ${nextDue.due.split("-").reverse().join("/")}.`
                  : ""}
            </p>
            {due.length ? (
              <Button size="lg" onClick={start}>
                Bắt đầu ôn
              </Button>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/practice">Luyện tập thêm</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/learn">Học bài mới</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="chunky border-line-strong p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <CalendarClock className="size-5 text-tone-lilac" /> Lịch ôn sắp tới
            </h2>
            <ul className="mt-4 space-y-3">
              {buckets.map((b) => (
                <li key={b.label} className="flex items-center justify-between rounded-2xl bg-pastel-lilac/60 px-4 py-2.5">
                  <span className="font-semibold">{b.label}</span>
                  <span className="font-display text-xl font-black tnum">{b.n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-muted">Tổng cộng {allCards.length} từ trong lịch ôn.</p>
          </div>
        </div>
      )}
    </div>
  );
}
