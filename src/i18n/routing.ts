import {defineRouting} from 'next-intl/routing';
 


export type Locale = (typeof routing.locales)[number]
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ru'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});