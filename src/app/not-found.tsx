import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-6 text-center">
      <div>
        <p className="font-display text-7xl font-black text-brand">¿404?</p>
        <h1 className="mt-3 font-display text-2xl font-black">Không tìm thấy trang này</h1>
        <p className="mt-2 text-ink-muted">Có thể đường dẫn đã cũ hoặc bài học chưa được phát hành.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Về trang tổng quan</Link>
        </Button>
      </div>
    </main>
  );
}
