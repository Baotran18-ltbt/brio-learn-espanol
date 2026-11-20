/* Trình duyệt: SpeechSynthesis (đọc) và SpeechRecognition (nghe). Không chấm điểm phát âm. */

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
function loadVoices() {
  if (!canSpeak()) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) cachedVoices = v;
  return cachedVoices;
}
if (typeof window !== "undefined" && canSpeak()) {
  loadVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
}

export function pickSpanishVoice(accent: string): SpeechSynthesisVoice | undefined {
  const voices = loadVoices();
  const lc = accent.toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === lc) ||
    (lc === "es-mx" ? voices.find((v) => /^es[-_](us|419|mx|co|ar)/i.test(v.lang)) : undefined) ||
    voices.find((v) => /^es/i.test(v.lang))
  );
}

export function hasSpanishVoice(): boolean {
  return Boolean(loadVoices().find((v) => /^es/i.test(v.lang)));
}

export interface SpeakOptions {
  rate?: number;
  accent?: "es-ES" | "es-MX";
  onEnd?: () => void;
}

export function speak(text: string, { rate = 0.9, accent = "es-ES", onEnd }: SpeakOptions = {}): boolean {
  if (!canSpeak()) return false;
  try {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[«»—]/g, " ").replace(/\s\/\s/g, ", ");
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = accent;
    const voice = pickSpanishVoice(accent);
    if (voice) u.voice = voice;
    u.rate = rate;
    if (onEnd) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

/* ---------- SpeechRecognition ---------- */

interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }> & { isFinal: boolean }>;
}
interface RecognitionErrorEvent {
  error: string;
}
export interface Recognizer {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export function getRecognitionCtor(): (new () => Recognizer) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognizer; webkitSpeechRecognition?: new () => Recognizer };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function recognitionErrorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Trình duyệt chưa được cấp quyền dùng micro. Bấm biểu tượng ổ khoá cạnh thanh địa chỉ, cho phép Micro, rồi thử lại.";
    case "no-speech":
      return "Không nghe thấy tiếng nói. Thử nói to hơn hoặc đưa micro lại gần.";
    case "audio-capture":
      return "Không tìm thấy micro trên thiết bị này.";
    case "network":
      return "Nhận diện giọng nói cần kết nối mạng. Kiểm tra mạng rồi thử lại.";
    case "aborted":
      return "Đã dừng ghi âm.";
    default:
      return "Có lỗi khi nhận diện giọng nói. Thử lại sau giây lát.";
  }
}

/** So từng từ trong câu mẫu với bản ghi — chỉ để tham khảo, KHÔNG phải chấm phát âm. */
export function compareWords(target: string, transcript: string) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[¿?¡!.,;:]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  const heard = new Set(norm(transcript));
  const words = target.split(/\s+/).filter(Boolean);
  return words.map((w) => {
    const key = norm(w)[0] ?? "";
    return { word: w, matched: key ? heard.has(key) : true };
  });
}
