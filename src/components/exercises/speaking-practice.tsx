"use client";

import * as React from "react";
import { Info, Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/speak-button";
import { compareWords, getRecognitionCtor, recognitionErrorMessage, type Recognizer } from "@/lib/speech";
import { useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/utils";

/**
 * Luyện nói: nghe mẫu → bấm micro → xem bản ghi chữ.
 * Không chấm điểm phát âm: chỉ hiển thị những từ trình duyệt nhận ra được.
 */
export function SpeakingPractice({ phrase, translation, onAttempt }: { phrase: string; translation: string; onAttempt?: () => void }) {
  const { state } = useProgress();
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [selfCheck, setSelfCheck] = React.useState<null | "ok" | "again">(null);
  const rec = React.useRef<Recognizer | null>(null);

  React.useEffect(() => {
    setSupported(Boolean(getRecognitionCtor()));
    return () => rec.current?.abort();
  }, []);

  const start = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    setError(null);
    setTranscript("");
    const r = new Ctor();
    r.lang = state.settings.accent;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.continuous = false;
    r.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
    };
    r.onerror = (e) => {
      setError(recognitionErrorMessage(e.error));
      setListening(false);
    };
    r.onend = () => {
      setListening(false);
      onAttempt?.();
    };
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setError("Không bật được micro. Thử tải lại trang.");
    }
  };

  const stop = () => rec.current?.stop();
  const words = transcript ? compareWords(phrase, transcript) : null;
  const matched = words?.filter((w) => w.matched).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="chunky flex items-center gap-4 border-[#BFDDF3] border-b-tone-sky p-5">
        <SpeakButton text={phrase} size="lg" />
        <div className="min-w-0">
          <p className="es text-2xl text-ink sm:text-[28px]">{phrase}</p>
          <p className="text-ink-muted">{translation}</p>
        </div>
      </div>

      {supported === false ? (
        <div className="rounded-2xl border-2 border-line-strong bg-white p-4">
          <p className="flex items-start gap-2 text-sm text-ink-soft">
            <MicOff className="mt-0.5 size-4 shrink-0" />
            Trình duyệt này chưa hỗ trợ nhận diện giọng nói (Chrome và Edge trên máy tính hỗ trợ tốt nhất). Bạn vẫn có thể nghe mẫu, đọc to theo, rồi tự đánh giá.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selfCheck === "ok" ? "success" : "outline"}
              onClick={() => {
                setSelfCheck("ok");
                onAttempt?.();
              }}
            >
              Mình đọc được rồi
            </Button>
            <Button size="sm" variant={selfCheck === "again" ? "accent" : "outline"} onClick={() => setSelfCheck("again")}>
              Cần nghe lại
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <Button size="lg" variant={listening ? "danger" : "accent"} onClick={listening ? stop : start} disabled={supported === null}>
            {listening ? <Square /> : <Mic />}
            {listening ? "Dừng" : transcript ? "Nói lại" : "Bấm để nói"}
          </Button>
          {listening && (
            <p className="flex items-center gap-2 text-sm font-semibold text-accent-dark">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-accent" />
              </span>
              Đang nghe… hãy đọc câu ở trên
            </p>
          )}
          {error && <p className="text-sm font-semibold text-danger-dark">{error}</p>}
        </div>
      )}

      {words && (
        <div className="rounded-2xl border-2 border-line-strong bg-white p-4" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Trình duyệt nghe được</p>
          <p className="mt-1 text-lg font-semibold">“{transcript}”</p>
          <p className="mt-3 flex flex-wrap gap-1.5">
            {words.map((w, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-lg px-2 py-0.5 font-display font-extrabold",
                  w.matched ? "bg-success-soft text-success-dark" : "bg-ink/5 text-ink-muted line-through decoration-2",
                )}
              >
                {w.word}
              </span>
            ))}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Nhận ra {matched}/{words.length} từ của câu mẫu.
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Đây chỉ là bản ghi chữ của trình duyệt, không phải chấm điểm phát âm. Từ bị gạch có thể do phát âm chưa rõ hoặc do micro.
          </p>
        </div>
      )}
    </div>
  );
}
