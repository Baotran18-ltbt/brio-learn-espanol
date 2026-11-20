"use client";
import * as React from "react";
import { useProgress } from "./progress/store";
import { speak } from "./speech";

/**
 * Đếm thời gian học thật: chỉ cộng khi tab đang mở VÀ người dùng có thao tác trong 60 giây gần nhất.
 */
export function useStudyTimer(active = true) {
  const { addStudySeconds } = useProgress();
  const add = React.useRef(addStudySeconds);
  add.current = addStudySeconds;
  React.useEffect(() => {
    if (!active) return;
    let last = Date.now();
    const mark = () => {
      last = Date.now();
    };
    window.addEventListener("pointerdown", mark);
    window.addEventListener("keydown", mark);
    window.addEventListener("scroll", mark, { passive: true });
    const t = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - last < 60_000) add.current(15);
    }, 15_000);
    return () => {
      clearInterval(t);
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
      window.removeEventListener("scroll", mark);
    };
  }, [active]);
}

export function useSpeak() {
  const { state } = useProgress();
  const { speechRate, accent } = state.settings;
  return React.useCallback(
    (text: string, rate?: number) => speak(text, { rate: rate ?? speechRate, accent }),
    [speechRate, accent],
  );
}
