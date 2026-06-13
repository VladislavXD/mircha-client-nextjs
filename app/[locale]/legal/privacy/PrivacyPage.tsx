// app/[locale]/legal/privacy/page.tsx
import { getTranslations } from "next-intl/server";
import { Lock } from "lucide-react";
import { LegalContact, LegalHeader, LegalSection } from "../_components/index";

const SECTIONS = [
  "collected", "usage", "storage",
  "sharing", "cookies", "rights", "age", "changes",
] as const;

export default async function PrivacyPage() {
  const t = await getTranslations("Legal.Privacy");

  return (
    <article>
      <LegalHeader
        icon={<Lock className="w-5 h-5" />}
        title={t("title")}
        subtitle={t("subtitle")}
        updated={t("updated")}
      />
      <div className="mt-14 space-y-10">
        {SECTIONS.map((key, i) => (
          <LegalSection
            key={key}
            index={i + 1}
            title={t(`sections.${key}.title`)}
            body={t(`sections.${key}.body`)}
            // @ts-ignore
            items={t.has(`sections.${key}.items`) ? t.raw(`sections.${key}.items`) : undefined}
          />
        ))}
      </div>
      <LegalContact email="mirchan.contact@gmail.com" label={t("contact")} />
    </article>
  );
}