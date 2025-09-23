import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';
import {Locale} from './routing'
 const locales = ['ru', 'en']
export default getRequestConfig(async ({locale}) => {
  // Static for now, we'll change this later
  if (!locale || !locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  } 
  return {
    locale,
    // You can also use a dynamic  import with `await import(...)`
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});