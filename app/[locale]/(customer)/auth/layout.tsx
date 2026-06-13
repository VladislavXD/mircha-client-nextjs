"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCurrentUser } from "@/src/hooks/user";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: currentUser, isLoading } = useCurrentUser();
  const t = useTranslations("Legal");

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [currentUser, isLoading, router]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>

      <footer className="shrink-0 border-t border-border/40 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground/40 font-mono">
            © 2026 mirchan.site
          </span>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40">
            <Link
              href="/legal/terms"
              className="hover:text-muted-foreground transition-colors"
            >
              {t("Terms.title")}
            </Link>
            <span className="w-px h-3 bg-border/60" />
            <Link
              href="/legal/privacy"
              className="hover:text-muted-foreground transition-colors"
            >
              {t("Privacy.title")}
            </Link>

            {/* Скрываем на мобилке */}
            <span className="hidden sm:block w-px h-3 bg-border/60" />
            <Link
              href="/about"
              className="hidden sm:block hover:text-muted-foreground transition-colors"
            >
              {t("about")}
            </Link>
            <span className="hidden sm:block w-px h-3 bg-border/60" />

            <a
              href="mailto:mirchan.contact@gmail.com"
              className="hidden sm:block hover:text-muted-foreground transition-colors"
            >
              mirchan.contact@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
