import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'bn', 'hi', 'ar', 'ja', 'ko', 'en-SG'],
  
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(en|bn|hi|ar|ja|ko|en-SG)/:path*']
};