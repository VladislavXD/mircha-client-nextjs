"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Lock, Palette, Bell, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SettingsNavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
  descKey: string;
}

interface SettingsSidebarProps {
  isMobile?: boolean;
}

export function SettingsSidebar({ isMobile = false }: SettingsSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Settings");
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];
  const prefix = locale ? `/${locale}` : "";

  const settingsNavItems: SettingsNavItem[] = [
    {
      href: `${prefix}/dashboard/settings/profile`,
      labelKey: "sidebar.profile",
      icon: <User className="w-5 h-5" />,
      descKey: "sidebar.profileDesc",
    },
    {
      href: `${prefix}/dashboard/settings/security`,
      labelKey: "sidebar.security",
      icon: <Shield className="w-5 h-5" />,
      descKey: "sidebar.securityDesc",
    },
    {
      href: `${prefix}/dashboard/settings/privacy`,
      labelKey: "sidebar.privacy",
      icon: <Lock className="w-5 h-5" />,
      descKey: "sidebar.privacyDesc",
    },
    {
      href: `${prefix}/dashboard/settings/appearance`,
      labelKey: "sidebar.appearance",
      icon: <Palette className="w-5 h-5" />,
      descKey: "sidebar.appearanceDesc",
    },
    {
      href: `${prefix}/dashboard/settings/notifications`,
      labelKey: "sidebar.notifications",
      icon: <Bell className="w-5 h-5" />,
      descKey: "sidebar.notificationsDesc",
    },
    {
      href: `${prefix}/dashboard/settings/language`,
      labelKey: "sidebar.language",
      icon: <Globe className="w-5 h-5" />,
      descKey: "sidebar.languageDesc",
    },
  ];

  const isActive = (href: string) => {
    const cleanPathname = pathname.replace(/^\/(ru|en)/, "");
    return cleanPathname === href || cleanPathname.startsWith(href + "/");
  };

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <nav className="flex flex-col gap-2">
          {settingsNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150",
                  active
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border hover:border-border/60 hover:bg-muted/50"
                )}
              >
                <div className={cn(active ? "text-primary" : "text-muted-foreground")}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className={cn("text-base font-semibold", active ? "text-primary" : "")}>
                    {t(item.labelKey)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {t(item.descKey)}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4 px-2">{t("title")}</h2>
        <nav className="flex flex-col gap-1">
          {settingsNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 px-3 py-3 rounded-lg transition-colors duration-150",
                  active
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <div className={cn("mt-0.5", active ? "text-primary" : "text-muted-foreground")}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium", active ? "text-primary" : "")}>
                    {t(item.labelKey)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t(item.descKey)}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}