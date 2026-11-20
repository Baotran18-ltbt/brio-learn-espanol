"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Check, HelpCircle, Layers, Search, X } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { VOCABULARY, VOCAB_TOPICS } from "@/data/vocabulary";
import { isMastered } from "@/lib/srs";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SpeakButton } from "@/components/speak-button";
import { Flashcard } from "@/components/flashcard";
import { EmptyState, PageSkeleton } from "@/components/states";
import { cn, normalizeAnswer } from "@/lib/utils";

type Filter = "all" | "saved" | "new" | "learning" | "mastered";

interface Word {
  id: string;
  es: string;
  vi: string;
  kind?: string;
  pron?: string;
  topic: string;
  example?: { es: string; vi: string };
}

export default function VocabularyPage() {
  const { state, hydrated, toggleSaved, markKnown, markUnknown } = useProgress();
  const [q, setQ] = React.useState("");
  const [topic, setTopic] = React.useState<string>("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [deck, setDeck] = React.useState<Word[] | null>(null);

  const words: Word[] = React.useMemo(
    () => [
      ...VOCABULARY.map((v) => ({ id: v.id, es: v.es, vi: v.vi, kind: v.kind, pron: v.pron, topic: v.topic, example: v.example })),
      ...state.custom.map((c) => ({ id: c.id, es: c.es, vi: c.vi, kind: "lưu từ AI Tutor", topic: "AI Tutor" })),
    ],
    [state.custom],
  );

  if (!hydrated) return <PageSkeleton />;

  const statusOf = (id: string): Exclude<Filter, "all" | "saved"> => {
    const c = state.srs[id];
    if (!c) return "new";
    return isMastered(c) ? "mastered" : "learning";
  };

  const nq = normalizeAnswer(q);
  const list = words.filter(
    (w) =>
      (!topic || w.topic === topic) &&
      (filter === "all" || (filter === "saved" ? state.saved.includes(w.id) : statusOf(w.id) === filter)) &&
      (!nq || normalizeAnswer(w.es).includes(nq) || normalizeAnswer(w.vi).includes(nq)),
  );

  const counts = {
    all: words.length,
    saved: state.saved.length,
    new: words.filter((w) => statusOf(w.id) === "new").length,
    learning: words.filter((w) => statusOf(w.id) === "learning").length,
    mastered: words.filter((w) => statusOf(w.id) === "mastered").length,
  };
  const topics = [...VOCAB_TOPICS, ...(state.custom.length ? ["AI Tutor"] : [])];

  if (deck) return <Deck deck={deck} onClose={() => setDeck(null)} onKnown={markKnown} onUnknown={markUnknown} />;

  return (
    <div>
      <PageHeader
        pill="Vocabulario"
        pillText="Thư viện từ vựng"
        title="Mỗi từ một câu ví dụ,"
        highlight="một giọng đọc."
        description={`${VOCABULARY.length} từ và cụm từ của A1 · Unit 1, chia theo chủ đề. Từ bạn lưu từ AI Tutor cũng nằm ở đây.`}
        actions={
          <>
            <Button variant="outline" onClick={() => list.length && setDeck(list)} disabled={!list.length}>
              <Layers /> Học {list.length} từ bằng flashcard
            </Button>
            <Button asChild>
              <Link href="/review">Ôn tập hôm nay</Link>
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
          <label htmlFor="vocab-search" className="sr-only">
            Tìm từ
          </label>
          <Input id="vocab-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm bằng tiếng Tây Ban Nha hoặc tiếng Việt" className="pl-12" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Lọc theo trạng thái">
          {(
            [
              ["all", "Tất cả"],
              ["saved", "Đã lưu"],
              ["new", "Chưa học"],
              ["learning", "Đang học"],
              ["mastered", "Đã thuộc"],
            ] as [Filter, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={cn(
                "shrink-0 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition",
                filter === id ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink-soft hover:border-ink/40",
              )}
            >
              {label} <span className="tnum opacity-70">{counts[id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <TopicChip active={!topic} onClick={() => setTopic("")}>
          Mọi chủ đề
        </TopicChip>
        {topics.map((t) => (
          <TopicChip key={t} active={topic === t} onClick={() => setTopic(t)}>
            {t}
          </TopicChip>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={filter === "saved" ? <Bookmark /> : <Search />}
          title={filter === "saved" ? "Chưa lưu từ nào" : "Không có từ nào khớp"}
          action={
            <Button variant="outline" onClick={() => {
                setQ("");
                setTopic("");
                setFilter("all");
              }}>
              Bỏ bộ lọc
            </Button>
          }
        >
          {filter === "saved" ? "Bấm biểu tượng dấu trang trên một từ để lưu, hoặc lưu từ mới khi trò chuyện với AI Tutor." : "Thử từ khoá khác hoặc bỏ bớt bộ lọc."}
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((w) => {
            const st = statusOf(w.id);
            const saved = state.saved.includes(w.id);
            return (
              <Card key={w.id} className="flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <SpeakButton text={w.es} />
                  <div className="min-w-0 flex-1">
                    <p className="es text-[22px] leading-tight">{w.es}</p>
                    <p className="font-semibold text-ink-soft">{w.vi}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaved(w.id)}
                    aria-pressed={saved}
                    aria-label={saved ? "Bỏ lưu" : "Lưu từ"}
                    className={cn("rounded-xl p-2 transition", saved ? "text-brand" : "text-ink-muted hover:bg-ink/5 hover:text-ink")}
                  >
                    {saved ? <BookmarkCheck className="size-5 fill-brand-soft" /> : <Bookmark className="size-5" />}
                  </button>
                </div>
                {w.example && (
                  <p className="rounded-xl bg-pastel-sky/70 px-3 py-2 text-sm">
                    <span className="es text-[15px]">{w.example.es}</span>
                    <span className="block text-ink-muted">{w.example.vi}</span>
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={st === "mastered" ? "success" : st === "learning" ? "sky" : "neutral"}>
                      {st === "mastered" ? "Đã thuộc" : st === "learning" ? "Đang học" : "Chưa học"}
                    </Badge>
                    <Badge variant="outline">{w.topic}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => markUnknown(w.id)}
                      className="rounded-lg px-2 py-1 text-xs font-bold text-ink-muted hover:bg-danger-soft hover:text-danger-dark"
                      title="Chưa biết: đưa vào ôn tập hôm nay"
                    >
                      Chưa biết
                    </button>
                    <button
                      type="button"
                      onClick={() => markKnown(w.id)}
                      className="rounded-lg px-2 py-1 text-xs font-bold text-ink-muted hover:bg-success-soft hover:text-success-dark"
                      title="Đã biết: giãn lịch ôn"
                    >
                      Đã biết
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopicChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border-2 border-b-[4px] px-3.5 py-1.5 text-sm font-bold transition",
        active ? "border-brand-tint border-b-brand bg-brand-soft text-brand" : "border-line-strong bg-white text-ink-soft hover:border-brand-tint",
      )}
    >
      {children}
    </button>
  );
}

function Deck({ deck, onClose, onKnown, onUnknown }: { deck: Word[]; onClose: () => void; onKnown: (id: string) => void; onUnknown: (id: string) => void }) {
  const [i, setI] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [tally, setTally] = React.useState({ known: 0, unknown: 0 });
  const w = deck[i];
  const next = (known: boolean) => {
    if (known) onKnown(w.id);
    else onUnknown(w.id);
    setTally((t) => ({ known: t.known + (known ? 1 : 0), unknown: t.unknown + (known ? 0 : 1) }));
    setFlipped(false);
    setI((x) => x + 1);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " && document.activeElement === document.body) {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!w)
    return (
      <EmptyState
        icon={<Check />}
        tone="sage"
        title="Xong bộ thẻ!"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/review">Sang Ôn tập</Link>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Về thư viện
            </Button>
          </div>
        }
      >
        {tally.known} từ đã biết, {tally.unknown} từ chưa biết. Từ chưa biết đã được đưa vào danh sách ôn hôm nay.
      </EmptyState>
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-1 rounded-full px-3 py-1.5 font-bold text-ink-muted hover:bg-ink/5">
          <X className="size-5" /> Đóng
        </button>
        <span className="font-display font-black text-ink-muted tnum">
          {i + 1} / {deck.length}
        </span>
      </div>
      <Flashcard card={w} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" onClick={() => next(false)}>
          <HelpCircle /> Chưa biết
        </Button>
        <Button size="lg" variant="success" onClick={() => next(true)}>
          <Check /> Đã biết
        </Button>
      </div>
      <p className="mt-3 text-center text-sm text-ink-muted">«Chưa biết» đưa từ vào ôn tập hôm nay. «Đã biết» giãn lịch ôn của từ.</p>
    </div>
  );
}
