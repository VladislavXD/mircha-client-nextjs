// app/[locale]/legal/_components/LegalContact.tsx
import { Mail } from "lucide-react";

export function LegalContact({ email, label }: { email: string; label: string }) {
  return (
    <div className="mt-14 rounded-xl border border-border/50 bg-muted/20 p-5 flex items-center gap-4">
      <div className="w-9 h-9 rounded-lg border border-border/60 bg-muted/60 flex items-center justify-center shrink-0">
        <Mail className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground/60 mb-0.5">{label}</p>
        
         <a href={`mailto:${email}`}
          className="text-sm font-medium hover:text-primary transition-colors truncate block"
        >
          {email}
        </a>
      </div>
    </div>
  );
}