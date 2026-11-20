import * as React from "react";
import { Pill } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Tiêu đề trang theo kiểu hình tham khảo: pill nhỏ + tiêu đề lớn có một cụm chữ nhấn màu. */
export function PageHeader({
  pill,
  pillText,
  title,
  highlight,
  description,
  actions,
  className,
}: {
  pill: string;
  pillText: string;
  title: string;
  highlight?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <Pill label={pill}>{pillText}</Pill>
        <h1 className="mt-4 font-display text-[34px] font-black leading-[1.05] tracking-tight sm:text-[44px]">
          {title} {highlight && <span className="text-brand">{highlight}</span>}
        </h1>
        {description && <p className="mt-3 text-base text-ink-muted sm:text-lg">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
