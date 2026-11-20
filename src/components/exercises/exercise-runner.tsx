"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CornerDownLeft, Lightbulb, X } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn, normalizeAnswer, normalizeKeepAccents, shuffle } from "@/lib/utils";
import { useProgress } from "@/lib/progress/store";
import { chime } from "@/components/celebrate";
import { ChoiceGrid } from "./choice-grid";
import { TileBuilder } from "./tile-builder";
import { MatchingBoard } from "./matching-board";
import { SpeakingPractice } from "./speaking-practice";
import { SpeakButton } from "@/components/speak-button";
import { Input } from "@/components/ui/input";

export const EXERCISE_LABEL: Record<Exercise["type"], string> = {
  "multiple-choice": "Trắc nghiệm",
  "fill-blank": "Điền vào chỗ trống",
  translate: "Dịch câu",
  "sentence-order": "Sắp xếp câu",
  listening: "Nghe hiểu",
  matching: "Nối từ",
  speaking: "Luyện nói",
};

export interface ExerciseResult {
  correct: boolean | null; // null = không chấm (luyện nói)
  answer?: string;
}

type Status = "idle" | "correct" | "wrong" | "done";

/** Lấy đáp án đúng để hiển thị khi sai. */
function correctAnswerText(ex: Exercise): string {
  switch (ex.type) {
    case "multiple-choice":
    case "listening":
    case "fill-blank":
      return ex.answer;
    case "translate":
      return ex.accepted[0];
    case "sentence-order":
      return ex.words.join(" ");
    default:
      return "";
  }
}

export function ExerciseRunner({
  exercise,
  onContinue,
  continueLabel = "Tiếp tục",
}: {
  exercise: Exercise;
  onContinue: (r: ExerciseResult) => void;
  continueLabel?: string;
}) {
  const { recordAnswer, state } = useProgress();
  const sound = state.settings.soundEffects;
  const [status, setStatus] = React.useState<Status>("idle");
  const [choice, setChoice] = React.useState<string | null>(null);
  const [tiles, setTiles] = React.useState<string[]>([]);
  const [typed, setTyped] = React.useState("");
  const [note, setNote] = React.useState<string | null>(null);
  const [matchMistakes, setMatchMistakes] = React.useState<number | null>(null);
  const [spoke, setSpoke] = React.useState(false);

  // Xáo phương án mỗi lần làm (tránh nhớ vị trí)
  const options = React.useMemo(() => {
    if (exercise.type === "multiple-choice" || exercise.type === "listening" || exercise.type === "fill-blank") return shuffle(exercise.options);
    return [];
  }, [exercise]);
  const bank = React.useMemo(() => {
    if (exercise.type === "sentence-order") return shuffle(exercise.words);
    if (exercise.type === "translate" && exercise.direction === "es-vi") return shuffle(exercise.tiles ?? []);
    return [];
  }, [exercise]);

  const ready =
    status === "idle" &&
    ((["multiple-choice", "listening", "fill-blank"].includes(exercise.type) && choice !== null) ||
      (exercise.type === "sentence-order" && tiles.length === exercise.words.length) ||
      (exercise.type === "translate" && exercise.direction === "es-vi" && tiles.length > 0) ||
      (exercise.type === "translate" && exercise.direction === "vi-es" && typed.trim().length > 0));

  const finish = React.useCallback(
    (correct: boolean, msg: string | null = null) => {
      setStatus(correct ? "correct" : "wrong");
      setNote(msg);
      recordAnswer(correct);
      if (sound) chime(correct ? "correct" : "wrong");
    },
    [recordAnswer, sound],
  );

  const check = React.useCallback(() => {
    if (!ready) return;
    const ex = exercise;
    if (ex.type === "multiple-choice" || ex.type === "listening" || ex.type === "fill-blank") {
      finish(choice === ex.answer);
    } else if (ex.type === "sentence-order") {
      finish(normalizeAnswer(tiles.join(" ")) === normalizeAnswer(ex.words.join(" ")));
    } else if (ex.type === "translate" && ex.direction === "es-vi") {
      const got = normalizeAnswer(tiles.join(" "));
      finish(ex.accepted.some((a) => normalizeAnswer(a) === got));
    } else if (ex.type === "translate") {
      const loose = ex.accepted.some((a) => normalizeAnswer(a) === normalizeAnswer(typed));
      const strict = ex.accepted.find((a) => normalizeKeepAccents(a) === normalizeKeepAccents(typed));
      if (loose && !strict) {
        const target = ex.accepted.find((a) => normalizeAnswer(a) === normalizeAnswer(typed)) ?? ex.accepted[0];
        finish(true, `Đúng ý! Chú ý dấu: «${target}».`);
      } else finish(loose);
    }
  }, [ready, exercise, choice, tiles, typed, finish]);

  const advance = React.useCallback(() => {
    if (status === "idle") return;
    const correct = status === "done" ? (exercise.type === "matching" ? matchMistakes === 0 : null) : status === "correct";
    onContinue({ correct, answer: choice ?? (tiles.join(" ") || typed) });
  }, [status, exercise.type, matchMistakes, onContinue, choice, tiles, typed]);

  // Enter: kiểm tra / tiếp tục
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.isComposing) return;
      if (status === "idle" && ready) {
        e.preventDefault();
        check();
      } else if (status !== "idle") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, ready, check, advance]);

  const locked = status !== "idle";

  return (
    <div className="flex flex-col gap-6">
      <div className={cn(status === "wrong" && "animate-shake")}>
        {/* ----- Nội dung theo loại bài ----- */}
        {exercise.type === "multiple-choice" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black leading-tight sm:text-[28px]">{exercise.prompt}</h2>
            {exercise.focus && <p className="es text-3xl text-brand">{exercise.focus}</p>}
            <ChoiceGrid options={options} value={choice} onChange={setChoice} locked={locked} answer={exercise.answer} status={status} />
          </div>
        )}

        {exercise.type === "listening" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black leading-tight sm:text-[28px]">{exercise.prompt}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <SpeakButton text={exercise.audio} size="lg" label="Nghe câu" />
              <SpeakButton text={exercise.audio} size="md" rate={0.6} label="Nghe chậm" className="border-[#D8CBF1] bg-pastel-lilac text-tone-lilac" />
              <span className="text-sm text-ink-muted">Bấm loa to để nghe, loa nhỏ để nghe chậm.</span>
            </div>
            {locked && <p className="es text-xl text-ink-soft">«{exercise.audio}»</p>}
            <ChoiceGrid options={options} value={choice} onChange={setChoice} locked={locked} answer={exercise.answer} status={status} />
          </div>
        )}

        {exercise.type === "fill-blank" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black">Chọn từ còn thiếu</h2>
            <div className="chunky border-line-strong p-5">
              <p className="es text-2xl leading-relaxed sm:text-3xl">
                {exercise.sentence.split("___").map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span
                        className={cn(
                          "mx-1 inline-block min-w-[3.5em] border-b-[3px] px-2 text-center",
                          choice ? "border-accent text-accent-dark" : "border-ink/30 text-transparent",
                          status === "correct" && "border-success text-success",
                          status === "wrong" && "border-danger text-danger",
                        )}
                      >
                        {choice ?? "…"}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
              <p className="mt-2 text-ink-muted">{exercise.translation}</p>
            </div>
            <ChoiceGrid options={options} value={choice} onChange={setChoice} locked={locked} answer={exercise.answer} status={status} compact />
          </div>
        )}

        {exercise.type === "translate" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black">
              {exercise.direction === "es-vi" ? "Dịch sang tiếng Việt" : "Dịch sang tiếng Tây Ban Nha"}
            </h2>
            <div className="flex items-center gap-3">
              {exercise.direction === "es-vi" && <SpeakButton text={exercise.source} />}
              <p className={cn("text-2xl font-bold sm:text-[26px]", exercise.direction === "es-vi" && "es text-brand")}>{exercise.source}</p>
            </div>
            {exercise.direction === "es-vi" ? (
              <TileBuilder bank={bank} value={tiles} onChange={setTiles} locked={locked} />
            ) : (
              <div className="space-y-2">
                <label htmlFor={`typed-${exercise.id}`} className="sr-only">
                  Câu trả lời tiếng Tây Ban Nha
                </label>
                <Input
                  id={`typed-${exercise.id}`}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  disabled={locked}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  lang="es"
                  placeholder="Gõ câu tiếng Tây Ban Nha…"
                  className="h-14 text-lg"
                />
                <AccentKeys disabled={locked} onInsert={(c) => setTyped((t) => t + c)} />
              </div>
            )}
          </div>
        )}

        {exercise.type === "sentence-order" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black">Sắp xếp thành câu đúng</h2>
            <p className="text-lg text-ink-soft">“{exercise.translation}”</p>
            <TileBuilder bank={bank} value={tiles} onChange={setTiles} locked={locked} spanish />
          </div>
        )}

        {exercise.type === "matching" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black">Nối từ với nghĩa đúng</h2>
            <MatchingBoard
              pairs={exercise.pairs}
              onComplete={(mistakes) => {
                setMatchMistakes(mistakes);
                setStatus("done");
                recordAnswer(mistakes === 0);
                if (sound) chime(mistakes === 0 ? "correct" : "wrong");
              }}
            />
          </div>
        )}

        {exercise.type === "speaking" && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-black">Đọc to câu này</h2>
            <SpeakingPractice phrase={exercise.phrase} translation={exercise.translation} onAttempt={() => setSpoke(true)} />
          </div>
        )}
      </div>

      {/* ----- Thanh phản hồi ----- */}
      <AnimatePresence mode="wait">
        {status === "idle" ? (
          <motion.div key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-line pt-5">
            <p className="hidden items-center gap-1.5 text-xs text-ink-muted sm:flex">
              <CornerDownLeft className="size-3.5" /> Enter để kiểm tra
            </p>
            {exercise.type === "speaking" ? (
              <Button size="lg" variant={spoke ? "primary" : "outline"} className="ml-auto w-full sm:w-auto" onClick={() => setStatus("done")}>
                {spoke ? "Tiếp tục" : "Bỏ qua phần nói"}
              </Button>
            ) : exercise.type === "matching" ? (
              <p className="ml-auto text-sm text-ink-muted">Chọn một từ bên trái, rồi chọn nghĩa bên phải.</p>
            ) : (
              <Button size="lg" className="ml-auto w-full sm:w-auto" disabled={!ready} onClick={check}>
                Kiểm tra
              </Button>
            )}
          </motion.div>
        ) : (
          <Feedback
            key="fb"
            exercise={exercise}
            status={status}
            note={note}
            matchMistakes={matchMistakes}
            onContinue={advance}
            continueLabel={continueLabel}
            showHint={state.settings.showHints}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Feedback({
  exercise,
  status,
  note,
  matchMistakes,
  onContinue,
  continueLabel,
  showHint,
}: {
  exercise: Exercise;
  status: Status;
  note: string | null;
  matchMistakes: number | null;
  onContinue: () => void;
  continueLabel: string;
  showHint: boolean;
}) {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    btnRef.current?.focus();
  }, []);
  const isMatch = exercise.type === "matching";
  const isSpeak = exercise.type === "speaking";
  const good = status === "correct" || (isMatch && matchMistakes === 0);
  const neutral = isSpeak || (isMatch && (matchMistakes ?? 0) > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl border-2 border-b-[5px] p-5",
        good ? "border-success/30 border-b-success bg-success-soft" : neutral ? "border-[#F2DD95] border-b-tone-butter bg-pastel-butter" : "border-danger/30 border-b-danger bg-danger-soft",
      )}
      role="status"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full text-white",
              good ? "bg-success" : neutral ? "bg-tone-butter" : "bg-danger",
              good && "animate-pop",
            )}
          >
            {good ? <Check className="size-6" strokeWidth={3} /> : neutral ? <Lightbulb className="size-5" /> : <X className="size-6" strokeWidth={3} />}
          </span>
          <div className="space-y-1">
            <p className={cn("font-display text-xl font-black", good ? "text-success-dark" : neutral ? "text-ink" : "text-danger-dark")}>
              {isSpeak ? "Đã luyện xong" : isMatch ? (matchMistakes === 0 ? "¡Perfecto! Nối đúng hết" : `Hoàn thành, sai ${matchMistakes} lần`) : good ? "¡Muy bien!" : "Chưa đúng"}
            </p>
            {status === "wrong" && (
              <p className="text-sm">
                Đáp án đúng: <b className="es text-base">{correctAnswerText(exercise)}</b>
              </p>
            )}
            {note && <p className="text-sm font-semibold">{note}</p>}
            {(status === "wrong" || neutral || (showHint && !isMatch)) && <p className="text-sm text-ink-soft">{exercise.explanation}</p>}
          </div>
        </div>
        <Button ref={btnRef} size="lg" variant={good ? "success" : neutral ? "accent" : "danger"} className="w-full shrink-0 sm:w-auto" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </motion.div>
  );
}

function AccentKeys({ onInsert, disabled }: { onInsert: (c: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Chèn ký tự tiếng Tây Ban Nha">
      {["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"].map((c) => (
        <button
          key={c}
          type="button"
          disabled={disabled}
          onClick={() => onInsert(c)}
          className="h-9 min-w-9 rounded-xl border-2 border-b-[3px] border-line-strong bg-white px-2 font-bold hover:border-accent disabled:opacity-40"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
