import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4 — используем requestLocale вместо locale
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale, // обязательно в v4
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});