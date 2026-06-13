// LegalLayout.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LegalLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  updated: string;
  children: ReactNode;
}

export function LegalLayout({ icon, title, subtitle, updated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border bg-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{subtitle}</p>
          <p className="mt-4 text-xs text-muted-foreground/60 font-mono">{updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-10">{children}</div>
      </div>
    </div>
  );
}