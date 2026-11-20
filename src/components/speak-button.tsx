"use client";
import * as React from "react";
import { Volume2 } from "lucide-react";
import { useSpeak } from "@/lib/hooks";
import { canSpeak } from "@/lib/speech";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

export function SpeakButton({
  text,
  size = "md",
  rate,
  className,
  label,
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  rate?: number;
  className?: string;
  label?: string;
}) {
  const say = useSpeak();
  const [playing, setPlaying] = React.useState(false);
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canSpeak()) {
      notify({ title: "Trình duyệt chưa hỗ trợ đọc to", body: "Thử Chrome, Edge hoặc Safari bản mới.", tone: "error" });
      return;
    }
    setPlaying(true);
    say(text, rate);
    setTimeout(() => setPlaying(false), Math.min(4000, 600 + text.length * 70));
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? `Nghe: ${text}`}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full border-2 border-b-[3px] border-[#BFDDF3] bg-pastel-sky text-tone-sky transition hover:-translate-y-px hover:border-tone-sky active:translate-y-px",
        size === "sm" && "size-8 [&_svg]:size-4",
        size === "md" && "size-10 [&_svg]:size-5",
        size === "lg" && "size-14 [&_svg]:size-7",
        playing && "animate-pulse border-tone-sky",
        className,
      )}
    >
      <Volume2 />
    </button>
  );
}
