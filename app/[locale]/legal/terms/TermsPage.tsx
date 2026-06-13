// app/[locale]/legal/terms/page.tsx
import { getTranslations } from "next-intl/server";
import { Shield } from "lucide-react";
import { LegalContact, LegalHeader, LegalSection } from "../_components/index";

const SECTIONS = [
  "acceptance", "description", "account",
  "conduct", "content", "liability",
  "changes", "termination",
] as const;

export default async function TermsPage() {
  const t = await getTranslations("Legal.Terms");
console.log("locale test:", t("title")); // что выводит?
  console.log("section test:", t("sections.acceptance.title"));

  return (
    <article>
      <LegalHeader
        icon={<Shield className="w-5 h-5" />}
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