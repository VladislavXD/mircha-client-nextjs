// app/[locale]/legal/_components/LegalHeader.tsx
import { ReactNode } from "react";

interface LegalHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  updated: string;
}

export function LegalHeader({ icon, title, subtitle, updated }: LegalHeaderProps) {
  return (
    <header className="space-y-4">
      {/* Icon badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-muted-foreground text-xs font-medium mb-2">
        {icon}
        <span className="font-mono">{updated}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
        {title}
      </h1>

      <p className="text-base text-muted-foreground leading-relaxed max-w-[540px]">
        {subtitle}
      </p>

      {/* Decorative divider */}
      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <div className="w-1 h-1 rounded-full bg-primary/40" />
      </div>
    </header>
  );
}