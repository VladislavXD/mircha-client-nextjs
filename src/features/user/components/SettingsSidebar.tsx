"use client";

import { Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Lock, Palette, Bell, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

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

  const settingsNavItems: SettingsNavItem[] = [
    {
      href: "/dashboard/settings/profile",
      labelKey: "sidebar.profile",
      icon: <User className="w-5 h-5" />,
      descKey: "sidebar.profileDesc",
    },
    {
      href: "/dashboard/settings/security",
      labelKey: "sidebar.security",
      icon: <Shield className="w-5 h-5" />,
      descKey: "sidebar.securityDesc",
    },
    {
      href: "/dashboard/settings/privacy",
      labelKey: "sidebar.privacy",
      icon: <Lock className="w-5 h-5" />,
      descKey: "sidebar.privacyDesc",
    },
    {
      href: "/dashboard/settings/appearance",
      labelKey: "sidebar.appearance",
      icon: <Palette className="w-5 h-5" />,
      descKey: "sidebar.appearanceDesc",
    },
    {
      href: "/dashboard/settings/notifications",
      labelKey: "sidebar.notifications",
      icon: <Bell className="w-5 h-5" />,
      descKey: "sidebar.notificationsDesc",
    },
    {
      href: "/dashboard/settings/language",
      labelKey: "sidebar.language",
      icon: <Globe className="w-5 h-5" />,
      descKey: "sidebar.languageDesc",
    },
  ];

  // Определяем активный путь (убираем locale prefix)
  const isActive = (href: string) => {
    const cleanPathname = pathname.replace(/^\/(ru|en)/, "");
    return cleanPathname === href || cleanPathname.startsWith(href + "/");
  };

  // Для мобильного режима - полноэкранный список
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <nav className="flex flex-col gap-2">
          {settingsNavItems.map((item) => {
            const active = isActive(item.href);

            return (
              
                <Card
                  key={item.href}
                  className={active ? "border-primary" : "border-default-200"}
                >
                  <CardBody
                    className={`
								p-0
								${
                  active
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-default-200 hover:border-default-300 hover:bg-default-50"
                }
							`}
                  >
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
									flex items-center gap-4 p-4 rounded-xl
									transition-all duration-150
									border-2
									${
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-default-200 hover:border-default-300 hover:bg-default-50"
                  }
								`}
                    >
                      <div
                        className={`${active ? "text-primary" : "text-default-600"}`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-base font-semibold ${active ? "text-primary" : "text-default-900"}`}
                        >
                          {t(item.labelKey)}
                        </div>
                        <div className="text-sm text-default-500 mt-1">
                          {t(item.descKey)}
                        </div>
                      </div>
                    </Link>
                  </CardBody>
                </Card>
              
            );
          })}
        </nav>
      </div>
    );
  }

  // Десктопный режим - компактный сайдбар
  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <h2 className="text-lg font-semibold mb-4 px-2">{t("title")}</h2>
        <nav className="flex flex-col gap-1">
          {settingsNavItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
									flex items-start gap-3 px-3 py-3 rounded-lg
									transition-colors duration-150
									${
                    active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-default-100 text-default-700"
                  }
								`}
              >
                <div
                  className={`mt-0.5 ${active ? "text-primary" : "text-default-500"}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${active ? "text-primary" : ""}`}
                  >
                    {t(item.labelKey)}
                  </div>
                  <div className="text-xs text-default-500 mt-0.5">
                    {t(item.descKey)}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </CardBody>
    </Card>
  );
}
