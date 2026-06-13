// app/[locale]/legal/layout.tsx
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import GoBack from "@/shared/components/ui/GoBack";
import { NextIntlClientProvider } from "next-intl";
import { Locale, routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";



export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}


interface LegalLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}


export default async function LegalLayout({
  children,
  params,
}: Readonly<LegalLayoutProps>) {
  const t = await getTranslations("Legal");
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[680px] mx-auto px-6 py-12 sm:py-20">
        <GoBack
          title={t("back")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        />

        {children}

        <footer className="mt-20 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground/50 font-mono">
            mirchan.site
          </span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
            <Link href="/legal/terms" className="hover:text-muted-foreground transition-colors">
              {t("Terms.title")}
            </Link>
            <Link href="/legal/privacy" className="hover:text-muted-foreground transition-colors">
              {t("Privacy.title")}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}