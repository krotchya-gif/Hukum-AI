import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['id', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'id',

  // Prefix every URL with the locale
  localePrefix: 'always'
});
