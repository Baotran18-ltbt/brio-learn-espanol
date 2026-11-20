"use client";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="chunky mx-auto max-w-lg border-danger/30 border-b-danger p-8 text-center">
      <h2 className="font-display text-2xl font-black">Có lỗi xảy ra</h2>
      <p className="mt-2 text-ink-muted">Tiến độ của bạn vẫn được giữ nguyên. Thử tải lại phần này.</p>
      <p className="mt-2 text-xs text-ink-muted">{error.message}</p>
      <Button className="mt-5" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
