"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface SettingsPageWrapperProps {
  title: string;
  children: ReactNode;
}

export function SettingsPageWrapper({ title, children }: SettingsPageWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];
  const prefix = locale ? `/${locale}` : "";

  return (
    <div className="flex flex-col gap-4">
      {/* Мобильная кнопка "Назад" */}
      <div className="md:hidden">
        <Button
          className="mb-2"
          variant="ghost"
          onClick={() => router.push(`${prefix}/dashboard/settings`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к настройкам
        </Button>
      </div>

      {children}
    </div>
  );
}