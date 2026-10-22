import arcjet, {
  createMiddleware as createArcjetMiddleware,
  detectBot,
} from "@arcjet/next"
import { getSessionCookie } from "better-auth/cookies"
import createIntlMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { env } from "./lib/env"

const locales = ["en", "bn", "hi", "ar", "ja", "ko", "en-SG"] as const
type Locale = (typeof locales)[number]

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
})

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
})

function getLocalizedPath(pathname: string) {
  const [, locale, ...segments] = pathname.split("/")
  if (!locales.includes(locale as Locale)) return null

  return {
    locale: locale as Locale,
    pathname: segments.length ? `/${segments.join("/")}` : "/",
  }
}

async function handleRequest(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes have their own handlers and must not be rewritten with a locale.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const localizedPath = getLocalizedPath(pathname)
  if (
    localizedPath &&
    (localizedPath.pathname === "/admin" ||
      localizedPath.pathname.startsWith("/admin/"))
  ) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
      // Sign-in is available from the public page's user drawer.
      return NextResponse.redirect(
        new URL(`/${localizedPath.locale}`, request.url)
      )
    }
  }

  return intlMiddleware(request)
}

export default createArcjetMiddleware(aj, handleRequest)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
