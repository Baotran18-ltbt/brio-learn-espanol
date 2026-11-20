import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  Flame,
  Map,
  MessagesSquare,
  Mic,
  Puzzle,
  Repeat2,
  Volume2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, type Tone } from "@/components/ui/card";
import { Pill } from "@/components/ui/badge";
import { IconTile } from "@/components/icon-tile";
import { CURRICULUM } from "@/data/curriculum";

const unit1 = CURRICULUM[0].units[0];

type Feature = { tone: Tone & ("sky" | "butter" | "sage" | "rose" | "lilac" | "peach"); icon: React.ReactNode; title: string; body: string; art: React.ReactNode };

const FEATURES: Feature[] = [
  {
    tone: "sky",
    icon: <Map />,
    title: "Đi theo lộ trình CEFR",
    body: "Từ A1 đến C2, mỗi cấp chia thành unit và bài học ngắn.",
    art: (
      <div className="grid h-full grid-cols-3 place-items-center gap-y-2 px-4 py-3">
        {["A1", "A2", "B1", "B2", "C1", "C2"].map((c, i) => (
          <span key={c} className={`grid size-10 place-items-center rounded-full border-2 border-b-4 font-display text-sm font-black ${i === 0 ? "border-tone-sky bg-tone-sky text-white" : "border-[#BFDDF3] bg-white/60 text-tone-sky/60"}`}>{c}</span>
        ))}
      </div>
    ),
  },
  {
    tone: "butter",
    icon: <Puzzle />,
    title: "Học qua trò chơi",
    body: "Chọn đáp án, ghép câu bằng thẻ, nối từ, điền chỗ trống.",
    art: (
      <div className="flex h-full flex-col justify-center gap-3 px-5">
        <p className="text-xs font-bold text-ink-soft">Sắp xếp thành câu đúng</p>
        <div className="flex flex-wrap gap-2">
          {["Me", "llamo", "Ana"].map((w) => (
            <span key={w} className="rounded-xl border-2 border-b-4 border-[#F2DD95] bg-white px-3 py-1 font-display text-sm font-extrabold">{w}</span>
          ))}
          <span className="rounded-xl border-2 border-dashed border-[#F2DD95] px-6 py-1" />
        </div>
      </div>
    ),
  },
  {
    tone: "sage",
    icon: <Mic />,
    title: "Nghe và nói",
    body: "Nghe phát âm chuẩn, chỉnh tốc độ, đọc to và xem bản ghi chữ.",
    art: (
      <div className="flex h-full items-center justify-center gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-tone-sage text-white">
          <Mic className="size-6" />
        </span>
        <div className="flex h-12 items-center gap-1">
          {[14, 26, 38, 22, 44, 30, 18, 34, 24, 12].map((h, i) => (
            <span key={i} className="w-1.5 rounded-full bg-tone-sage/70" style={{ height: h }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    tone: "rose",
    icon: <Flame />,
    title: "Giữ chuỗi ngày học",
    body: "Đặt mục tiêu XP mỗi ngày, giữ lửa bằng vài phút học.",
    art: (
      <div className="flex h-full items-center justify-center gap-3">
        <Flame className="size-14 fill-accent text-accent" />
        <div className="flex gap-1.5">
          {["T2", "T3", "T4", "T5", "T6"].map((d, i) => (
            <span key={d} className={`grid size-8 place-items-center rounded-lg text-[11px] font-black ${i < 4 ? "bg-accent text-white" : "border-2 border-dashed border-[#F4C3CB] text-tone-rose"}`}>{d}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    tone: "lilac",
    icon: <Repeat2 />,
    title: "Ôn tập đúng lúc",
    body: "Thẻ từ quay lại theo thuật toán SM-2, ngay trước khi bạn quên.",
    art: (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="relative">
          <span className="absolute -right-2 -top-2 h-12 w-36 rounded-2xl border-2 border-[#D8CBF1] bg-white/60" />
          <span className="relative flex h-12 w-36 items-center justify-center rounded-2xl border-2 border-b-4 border-[#D8CBF1] bg-white font-display font-black">hola</span>
        </div>
        <div className="flex gap-1.5 text-[11px] font-bold">
          {["Quên", "Khó", "Nhớ", "Dễ"].map((g) => (
            <span key={g} className="rounded-lg bg-white/80 px-2 py-1 text-tone-lilac">{g}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    tone: "peach",
    icon: <MessagesSquare />,
    title: "Trò chuyện với AI Tutor",
    body: "Tập hội thoại theo tình huống, được sửa lỗi bằng tiếng Việt.",
    art: (
      <div className="flex h-full flex-col justify-center gap-2 px-5 text-sm">
        <span className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-white px-3 py-1.5 font-semibold">¿Cómo te llamas?</span>
        <span className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-accent px-3 py-1.5 font-semibold text-white">Me llamo Linh.</span>
      </div>
    ),
  },
  {
    tone: "sky",
    icon: <BookOpenCheck />,
    title: "Hiểu vì sao sai",
    body: "Mỗi câu sai đều có đáp án đúng và lời giải thích ngắn.",
    art: (
      <div className="flex h-full flex-col justify-center gap-2 px-5">
        {[
          ["Yo es de Vietnam", "Yo soy de Vietnam"],
          ["Soy una profesora", "Soy profesora"],
        ].map(([w, r]) => (
          <div key={w} className="rounded-xl bg-white px-3 py-1.5 text-xs">
            <span className="text-danger line-through">{w}</span> <ArrowRight className="inline size-3" /> <b className="text-success-dark">{r}</b>
          </div>
        ))}
      </div>
    ),
  },
  {
    tone: "butter",
    icon: <Award />,
    title: "XP, cột mốc, huy hiệu",
    body: "Mọi con số đều tính từ việc bạn đã làm thật.",
    art: (
      <div className="flex h-full items-center justify-center gap-3">
        {["#FF914D", "#B52B38", "#C99A1A", "#3E9A5C"].map((c, i) => (
          <span key={c} className="grid size-12 place-items-center rounded-full border-4 bg-white" style={{ borderColor: c, transform: `translateY(${i % 2 ? 6 : -6}px)` }}>
            <Award className="size-5" style={{ color: c }} />
          </span>
        ))}
      </div>
    ),
  },
];

const artBg: Record<Feature["tone"], string> = {
  sky: "bg-pastel-sky",
  butter: "bg-pastel-butter",
  sage: "bg-pastel-sage",
  rose: "bg-pastel-rose",
  lilac: "bg-pastel-lilac",
  peach: "bg-pastel-peach",
};

export default function Landing() {
  return (
    <div className="min-h-dvh overflow-x-hidden">
      {/* nền trang trí */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(60%_60%_at_85%_10%,#FFE3D1_0%,transparent_70%),radial-gradient(45%_55%_at_5%_0%,#FBE7E9_0%,transparent_70%)]" />

      <header className="container relative flex h-20 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/learn">Lộ trình</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Vào học</Link>
          </Button>
        </nav>
      </header>

      <section className="container relative pb-10 pt-8 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Pill label="Nivel A1">Tiếng Tây Ban Nha cho người Việt</Pill>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="h-3 w-40 overflow-hidden rounded-full border-2 border-line-strong bg-white">
              <span className="block h-full rounded-full bg-accent" style={{ width: `${(1 / CURRICULUM[0].units.length) * 100}%` }} />
            </span>
            <span className="font-display text-lg font-black tnum">
              1 / {CURRICULUM[0].units.length} <span className="text-sm font-bold text-ink-muted">unit A1 đã mở</span>
            </span>
          </div>
        </div>

        <h1 className="mt-8 max-w-4xl font-display text-[44px] font-black leading-[1.02] tracking-tight sm:text-[72px] lg:text-[84px]">
          Học tiếng Tây Ban Nha, <span className="text-brand">vui</span> từ câu ¡Hola! đầu tiên.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">
          Bài học ngắn giải thích bằng tiếng Việt, bài tập tương tác, ôn từ đúng lúc và luyện hội thoại. Mỗi ngày chỉ cần mười phút.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/learn/a1-u1-l1">
              Bắt đầu bài đầu tiên <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Xem trang tổng quan</Link>
          </Button>
        </div>
      </section>

      <section className="container relative pb-16" aria-labelledby="features">
        <h2 id="features" className="sr-only">
          Tính năng
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} tone={f.tone} className="group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1">
              <div className="flex flex-col gap-3 p-6 pb-5">
                <IconTile tone={f.tone}>{f.icon}</IconTile>
                <h3 className="font-display text-[22px] font-black leading-tight">{f.title}</h3>
                <p className="text-ink-muted">{f.body}</p>
              </div>
              <div className={`mx-4 mb-4 mt-auto h-32 rounded-2xl ${artBg[f.tone]}`}>{f.art}</div>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-right text-xs text-ink-muted">Hình trong thẻ là minh hoạ giao diện.</p>
      </section>

      <section className="container relative pb-20">
        <Card tone="brand" className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Pill label="Unidad 1">Đã mở</Pill>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">
              {unit1.title} <span className="text-brand">· {unit1.titleVi}</span>
            </h2>
            <p className="mt-3 text-ink-muted">{unit1.description}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Giải thích ngữ pháp bằng tiếng Việt", "Mỗi từ có câu ví dụ, bản dịch và phát âm", "Bài kiểm tra cuối unit, cần đạt 70%"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-success" strokeWidth={3} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <ol className="grid gap-3">
            {unit1.lessons.map((l) => (
              <li key={l.id}>
                <Link href={`/learn/${l.id}`} className="flex items-center gap-4 rounded-2xl border-2 border-b-4 border-line-strong bg-cream px-4 py-3 transition hover:border-brand-tint hover:bg-white">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft font-display font-black text-brand">{l.order}</span>
                  <span className="min-w-0 flex-1">
                    <span className="es block truncate text-lg">{l.title}</span>
                    <span className="block truncate text-sm text-ink-muted">{l.titleVi}</span>
                  </span>
                  <span className="hidden items-center gap-1 text-xs font-bold text-ink-muted sm:flex">
                    <Volume2 className="size-3.5" /> {l.minutes} phút
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <footer className="border-t-2 border-line">
        <div className="container flex flex-col items-center justify-between gap-3 py-8 text-sm text-ink-muted sm:flex-row">
          <Logo />
          <p>A1 · Unit 1 đã có đầy đủ. Các unit và cấp độ khác đang được soạn.</p>
        </div>
      </footer>
    </div>
  );
}
