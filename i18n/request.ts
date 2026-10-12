import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'bn', 'hi', 'ar', 'ja', 'ko', 'en-SG'] as const;

type Locale = (typeof locales)[number];

function isLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale ?? await requestLocale;

  if (!resolvedLocale || !isLocale(resolvedLocale)) notFound();

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
