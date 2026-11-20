"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookmarkPlus, Check, FlaskConical, Languages, Loader2, Mic, RotateCcw, Send, Sparkles, Square, Wand2 } from "lucide-react";
import { SCENARIOS, TUTOR_LEVELS, type Scenario, type TutorLevel } from "@/data/scenarios";
import { VOCABULARY } from "@/data/vocabulary";
import type { TutorReply, TutorStatus } from "@/lib/tutor";
import { useProgress } from "@/lib/progress/store";
import { useStudyTimer } from "@/lib/hooks";
import { getRecognitionCtor, recognitionErrorMessage, type Recognizer } from "@/lib/speech";
import { notify } from "@/lib/notify";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/icon-tile";
import { SpeakButton } from "@/components/speak-button";
import { PageSkeleton } from "@/components/states";
import { cn, normalizeAnswer } from "@/lib/utils";

interface ChatMsg {
  id: number;
  role: "user" | "assistant";
  es: string;
  vi?: string;
  reply?: Omit<TutorReply, "reply_es" | "reply_vi">;
  demo?: boolean;
}

let msgSeq = 0;

export default function TutorPage() {
  const { hydrated, tutorMessageSent } = useProgress();
  const [status, setStatus] = React.useState<TutorStatus | null>(null);
  const [scenario, setScenario] = React.useState<Scenario | null>(null);
  const [level, setLevel] = React.useState<TutorLevel>("A1");
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [corrections, setCorrections] = React.useState<Record<number, TutorReply["corrections"]>>({});
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const demoStep = React.useRef(0);
  const endRef = React.useRef<HTMLDivElement>(null);
  useStudyTimer(Boolean(scenario));

  React.useEffect(() => {
    fetch("/api/tutor")
      .then((r) => r.json())
      .then((s: TutorStatus) => setStatus(s))
      .catch(() => setStatus({ live: false }));
  }, []);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const live = status?.live ?? false;

  const begin = (s: Scenario) => {
    setScenario(s);
    demoStep.current = 0;
    setCorrections({});
    setError(null);
    setMessages([{ id: ++msgSeq, role: "assistant", es: s.opener.es, vi: s.opener.vi, demo: !live }]);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !scenario || loading) return;
    if (text.length > 800) {
      setError("Tin nhắn quá dài, hãy viết ngắn hơn 800 ký tự.");
      return;
    }
    setError(null);
    const userMsg: ChatMsg = { id: ++msgSeq, role: "user", es: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    tutorMessageSent();

    if (!live) {
      const line = scenario.demo[Math.min(demoStep.current, scenario.demo.length - 1)];
      demoStep.current += 1;
      setLoading(true);
      setTimeout(() => {
        setMessages((m) => [...m, { id: ++msgSeq, role: "assistant", es: line.es, vi: line.vi, demo: true }]);
        setLoading(false);
      }, 600);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          level,
          // API cần lượt đầu là user, nên thêm một lượt mở đầu ngắn trước câu chào của AI
          messages: [
            { role: "user", content: "[Inicio de la conversación]" },
            ...history.map((m) => ({ role: m.role, content: m.es })),
          ],
        }),
      });
      if (res.status === 503) {
        setStatus({ live: false });
        throw new Error("Máy chủ chưa cấu hình AI. Đã chuyển sang chế độ demo, hãy gửi lại tin nhắn.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Có lỗi khi gọi AI Tutor.");
      const r = data as TutorReply;
      setCorrections((c) => ({ ...c, [userMsg.id]: r.corrections }));
      setMessages((m) => [...m, { id: ++msgSeq, role: "assistant", es: r.reply_es, vi: r.reply_vi, reply: { corrections: r.corrections, alternatives: r.alternatives, vocabulary: r.vocabulary } }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated || !status) return <PageSkeleton />;

  if (!scenario) {
    return (
      <div>
        <PageHeader
          pill="Tutor"
          pillText="Luyện hội thoại"
          title="Nói chuyện như"
          highlight="ngoài đời thật."
          description="Chọn một tình huống và trình độ. AI Tutor đóng vai, trả lời bằng tiếng Tây Ban Nha và sửa lỗi cho bạn bằng tiếng Việt."
        />
        <ModeBanner live={live} model={status.model} />

        <div className="mb-6">
          <p className="mb-2 text-sm font-bold text-ink-muted">Trình độ hội thoại</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Trình độ">
            {TUTOR_LEVELS.map((l) => (
              <button
                key={l.id}
                role="radio"
                aria-checked={level === l.id}
                onClick={() => setLevel(l.id)}
                className={cn(
                  "rounded-2xl border-2 border-b-[4px] px-4 py-2 text-left transition",
                  level === l.id ? "border-brand border-b-brand-dark bg-brand text-white" : "border-line-strong bg-white hover:border-brand-tint",
                )}
              >
                <span className="block font-display font-black">{l.label}</span>
                <span className={cn("block text-xs", level === l.id ? "text-white/85" : "text-ink-muted")}>{l.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <Card key={s.id} tone={s.tone} className="flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1">
              <IconTile tone={s.tone}>
                <Sparkles />
              </IconTile>
              <div>
                <p className="es text-xl">{s.title}</p>
                <p className="font-display text-lg font-black leading-tight">{s.titleVi}</p>
              </div>
              <p className="text-sm text-ink-muted">{s.description}</p>
              <Button className="mt-auto" variant="outline" onClick={() => begin(s)}>
                Bắt đầu hội thoại
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setScenario(null)}>
          <ArrowLeft /> Tình huống khác
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-black">
            <span className="es">{scenario.title}</span> · {scenario.titleVi}
          </p>
          <p className="truncate text-xs text-ink-muted">AI đóng vai: {scenario.role}</p>
        </div>
        <Badge variant={live ? "success" : "accent"}>{live ? `AI · ${level}` : "Chế độ demo"}</Badge>
        <Button variant="ghost" size="icon" onClick={() => begin(scenario)} aria-label="Bắt đầu lại hội thoại">
          <RotateCcw />
        </Button>
      </div>

      {!live && <ModeBanner live={false} compact />}

      <div className="space-y-4 pb-4" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {m.role === "assistant" ? <AssistantBubble m={m} /> : <UserBubble m={m} corrections={corrections[m.id]} live={live} />}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Loader2 className="size-4 animate-spin" /> {live ? "AI Tutor đang trả lời…" : "Đang lấy câu soạn sẵn…"}
          </div>
        )}
        {error && <p className="rounded-2xl border-2 border-danger/30 bg-danger-soft p-3 text-sm font-semibold text-danger-dark">{error}</p>}
        <div ref={endRef} />
      </div>

      <Composer value={input} onChange={setInput} onSend={send} disabled={loading} />
    </div>
  );
}

function ModeBanner({ live, model, compact }: { live: boolean; model?: string; compact?: boolean }) {
  return live ? (
    <p className={cn("flex items-start gap-2 rounded-2xl border-2 border-success/25 bg-success-soft p-4 text-sm", compact ? "mb-4" : "mb-8")}>
      <Wand2 className="mt-0.5 size-4 shrink-0 text-success" />
      AI Tutor đang chạy thật qua máy chủ{model ? ` (mô hình ${model})` : ""}. Lời sửa lỗi do AI tạo ra, đôi khi có thể chưa chính xác.
    </p>
  ) : (
    <p className={cn("flex items-start gap-2 rounded-2xl border-2 border-accent-tint bg-accent-soft p-4 text-sm", compact ? "mb-4" : "mb-8")}>
      <FlaskConical className="mt-0.5 size-4 shrink-0 text-accent-dark" />
      <span>
        <b>Chế độ demo:</b> máy chủ chưa có ANTHROPIC_API_KEY nên câu trả lời là kịch bản soạn sẵn, không phải AI, và không có sửa lỗi. Thêm khoá API vào biến môi trường để bật AI thật (xem README).
      </span>
    </p>
  );
}

function AssistantBubble({ m }: { m: ChatMsg }) {
  const [showVi, setShowVi] = React.useState(false);
  return (
    <div className="flex max-w-[92%] flex-col gap-2">
      <div className="rounded-3xl rounded-bl-lg border-2 border-b-4 border-line-strong bg-white p-4">
        <div className="flex items-start gap-2">
          <SpeakButton text={m.es} size="sm" />
          <p className="es text-lg leading-snug">{m.es}</p>
        </div>
        {m.vi && (
          <div className="mt-2 pl-10">
            {showVi ? (
              <p className="text-sm text-ink-soft">{m.vi}</p>
            ) : (
              <button onClick={() => setShowVi(true)} className="flex items-center gap-1 text-xs font-bold text-tone-sky hover:underline">
                <Languages className="size-3.5" /> Xem nghĩa tiếng Việt
              </button>
            )}
          </div>
        )}
        {m.demo && <p className="mt-2 pl-10 text-[11px] font-bold uppercase tracking-wider text-accent-dark">Câu soạn sẵn · demo</p>}
      </div>
      {m.reply && (m.reply.alternatives.length > 0 || m.reply.vocabulary.length > 0) && <Extras reply={m.reply} />}
    </div>
  );
}

function Extras({ reply }: { reply: NonNullable<ChatMsg["reply"]> }) {
  const { state, addCustomVocab, toggleSaved } = useProgress();
  const save = (es: string, vi: string) => {
    const existing = VOCABULARY.find((v) => normalizeAnswer(v.es) === normalizeAnswer(es));
    if (existing) {
      if (!state.saved.includes(existing.id)) toggleSaved(existing.id);
    } else addCustomVocab(es, vi);
    notify({ title: `Đã lưu «${es}»`, body: "Từ đã vào thư viện và lịch ôn tập.", tone: "success" });
  };
  const isSaved = (es: string) => {
    const existing = VOCABULARY.find((v) => normalizeAnswer(v.es) === normalizeAnswer(es));
    if (existing) return state.saved.includes(existing.id);
    return state.custom.some((c) => normalizeAnswer(c.es) === normalizeAnswer(es));
  };
  return (
    <div className="space-y-2 pl-2">
      {reply.alternatives.length > 0 && (
        <div className="rounded-2xl border-2 border-[#D8CBF1] bg-pastel-lilac/70 p-3 text-sm">
          <p className="mb-1 text-xs font-black uppercase tracking-wider text-tone-lilac">Cách nói tự nhiên hơn</p>
          {reply.alternatives.map((a) => (
            <p key={a.es}>
              <span className="es">{a.es}</span> <span className="text-ink-muted">· {a.vi}</span>
            </p>
          ))}
        </div>
      )}
      {reply.vocabulary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {reply.vocabulary.map((v) => {
            const saved = isSaved(v.es);
            return (
              <button
                key={v.es}
                onClick={() => !saved && save(v.es, v.vi)}
                disabled={saved}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-semibold transition",
                  saved ? "border-success/30 bg-success-soft text-success-dark" : "border-line-strong bg-white hover:border-brand-tint",
                )}
              >
                {saved ? <Check className="size-3.5" /> : <BookmarkPlus className="size-3.5" />}
                <span className="es">{v.es}</span>
                <span className="text-ink-muted">· {v.vi}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserBubble({ m, corrections, live }: { m: ChatMsg; corrections?: TutorReply["corrections"]; live: boolean }) {
  return (
    <div className="ml-auto flex max-w-[92%] flex-col items-end gap-2">
      <div className="rounded-3xl rounded-br-lg border-2 border-b-4 border-accent-dark bg-accent px-4 py-3 text-white">
        <p className="text-lg font-semibold leading-snug">{m.es}</p>
      </div>
      {corrections && corrections.length > 0 && (
        <div className="w-full rounded-2xl border-2 border-danger/25 bg-danger-soft/70 p-3 text-sm">
          <p className="mb-1 text-xs font-black uppercase tracking-wider text-danger-dark">Sửa lỗi</p>
          <ul className="space-y-1.5">
            {corrections.map((c, i) => (
              <li key={i}>
                <span className="text-danger line-through">{c.original}</span> → <b className="es text-success-dark">{c.corrected}</b>
                <span className="block text-ink-soft">{c.explanation_vi}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {corrections && corrections.length === 0 && live && (
        <p className="flex items-center gap-1 text-xs font-bold text-success-dark">
          <Check className="size-3.5" /> Không thấy lỗi
        </p>
      )}
    </div>
  );
}

function Composer({ value, onChange, onSend, disabled }: { value: string; onChange: (v: string) => void; onSend: () => void; disabled: boolean }) {
  const { state } = useProgress();
  const [listening, setListening] = React.useState(false);
  const rec = React.useRef<Recognizer | null>(null);
  const canDictate = typeof window !== "undefined" && Boolean(getRecognitionCtor());

  const dictate = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = state.settings.accent;
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      onChange(t);
    };
    r.onerror = (e) => notify({ title: "Không nghe được", body: recognitionErrorMessage(e.error), tone: "error" });
    r.onend = () => setListening(false);
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="sticky bottom-24 z-10 mt-2 rounded-3xl border-2 border-b-[5px] border-line-strong bg-white p-3 shadow-lift lg:bottom-6"
    >
      <label htmlFor="tutor-input" className="sr-only">
        Tin nhắn tiếng Tây Ban Nha
      </label>
      <textarea
        id="tutor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={2}
        maxLength={800}
        lang="es"
        placeholder="Escribe en español… (Enter để gửi, Shift+Enter xuống dòng)"
        className="w-full resize-none bg-transparent px-2 py-1 text-[16px] outline-none placeholder:text-ink-muted/70 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        {["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"].map((c) => (
          <button key={c} type="button" onClick={() => onChange(value + c)} className="h-8 min-w-8 rounded-lg border-2 border-line-strong bg-cream px-1.5 text-sm font-bold hover:border-accent">
            {c}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {canDictate && (
            <Button type="button" variant={listening ? "danger" : "outline"} size="icon" onClick={dictate} aria-label={listening ? "Dừng ghi âm" : "Nói thay vì gõ"}>
              {listening ? <Square /> : <Mic />}
            </Button>
          )}
          <Button type="submit" size="icon" disabled={disabled || !value.trim()} aria-label="Gửi">
            <Send />
          </Button>
        </div>
      </div>
    </form>
  );
}
