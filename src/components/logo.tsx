import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden="true">
      <path d="M8 4h24a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H17l-7 6v-6H8a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z" fill="#B52B38" />
      <path d="M8 31.5h2v-1H8" fill="#8C1E2A" />
      <circle cx="13" cy="11.5" r="2.2" fill="#FF914D" />
      <rect x="11.2" y="15.5" width="3.6" height="11" rx="1.8" fill="#FF914D" />
      <path d="M20 10.5v16M29 10.5v16M20 18.5h9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ href = "/", className, compact }: { href?: string; className?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)} aria-label="¡Hola! — Learn Spanish">
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-xl font-black tracking-tight">
          <span className="text-brand">¡</span>Hola<span className="text-brand">!</span>
        </span>
        {!compact && <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Learn Spanish</span>}
      </span>
    </Link>
  );
}
