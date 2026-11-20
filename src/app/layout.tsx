import type { Metadata, Viewport } from "next";
import { ProgressProvider } from "@/lib/progress/store";
import { Toaster } from "@/components/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "¡Hola! — Learn Spanish", template: "%s · ¡Hola!" },
  description: "Học tiếng Tây Ban Nha cho người Việt: lộ trình CEFR, bài học tương tác, flashcard ôn tập ngắt quãng, luyện nghe nói và AI Tutor.",
};

export const viewport: Viewport = { themeColor: "#FFF9F4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        {/* Google Fonts nạp lúc chạy (không cần mạng khi build) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap&subset=vietnamese"
        />
      </head>
      <body>
        <ProgressProvider>
          {children}
          <Toaster />
        </ProgressProvider>
      </body>
    </html>
  );
}
