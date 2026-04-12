import { Select, SelectItem } from "@heroui/react";
import { useLocale } from "next-intl";
import React from "react";
import { useParams } from "next/navigation";

import { usePathname } from "@/src/i18n/navigation";
import { Locale, routing } from "@/src/i18n/routing";
import { useRouter } from "@/src/i18n/navigation";

export const LocaleSwitcherSelect = () => {
  const locale: string = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function handleSelect(keys: any) {
    const nextLocale = Array.from(keys)[0] as Locale;

    if (nextLocale && nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  }

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        isVirtualized
        className="max-w-xs"
        label="Language"
        maxListboxHeight={90}
        selectedKeys={[locale]}
        size="sm"
        variant="bordered"
        onSelectionChange={handleSelect}
      >
        {routing.locales.map((loc) => (
          <SelectItem key={loc}>
            {loc === "en" ? "English" : loc === "ru" ? "Русский" : loc}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
