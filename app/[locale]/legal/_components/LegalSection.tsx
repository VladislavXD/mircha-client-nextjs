// app/[locale]/legal/_components/LegalSection.tsx
interface LegalSectionProps {
  index: number;
  title: string;
  body: string;
  items?: string[];
}

export function LegalSection({ index, title, body, items }: LegalSectionProps) {
  return (
    <section className="group relative">
      {/* Number accent */}
      <div className="flex items-baseline gap-4 mb-3">
        <span
          className="text-[11px] font-mono tabular-nums text-muted-foreground/30 w-5 shrink-0 select-none"
          aria-hidden
        >
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      <div className="ml-9 space-y-3">
        <p className="text-sm text-muted-foreground leading-[1.75]">{body}</p>

        {items && items.length > 0 && (
          <ul className="space-y-2 pt-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-[1.75]">
                <span className="mt-[9px] w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom separator — hidden on last */}
      <div className="ml-9 mt-8 h-px bg-border/40 group-last:hidden" />
    </section>
  );
}