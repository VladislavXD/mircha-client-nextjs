import { useLocale } from "next-intl";
import React from "react";
import { useParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { Locale, routing } from "@/src/i18n/routing";

export const LocaleSwitcherSelect = () => {
  const locale: string = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function handleSelect(nextLocale: string) {
    if (nextLocale && nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale as Locale });
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Select value={locale} onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {routing.locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc === "en" ? "English" : loc === "ru" ? "Русский" : loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};