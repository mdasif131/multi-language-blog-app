import { NextResponse } from "next/server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import {
  adminGetBlogPosts,
  blogPostPageSizes,
  isBlogLanguage,
} from "@/app/data/admin/admin-get-blog-posts"
import arcjet, { fixedWindow } from "@/lib/arcjet"

export const dynamic = "force-dynamic"

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 120,
  })
)

function parsePositiveInteger(value: string | null, fallback: number) {
  if (value === null || !/^\d+$/.test(value)) return fallback
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

export async function GET(request: Request) {
  const session = await requireAdmin()
  const decision = await aj.protect(request, {
    fingerprint: session.user.id,
  })

  if (decision.isDenied()) {
    const isRateLimited = decision.reason.isRateLimit()
    return NextResponse.json(
      {
        error: isRateLimited
          ? "Too many blog post requests. Please try again shortly."
          : "Request blocked.",
      },
      { status: isRateLimited ? 429 : 403 }
    )
  }

  const searchParams = new URL(request.url).searchParams
  const rawPageSize = searchParams.get("pageSize") ?? "10"
  const pageSize = Number(rawPageSize)

  if (!blogPostPageSizes.some((size) => size === pageSize)) {
    return NextResponse.json(
      { error: "pageSize must be 5,10, 20, 50, or 100." },
      { status: 400 }
    )
  }

  const languageParam = searchParams.get("language") ?? "all"
  if (languageParam !== "all" && !isBlogLanguage(languageParam)) {
    return NextResponse.json({ error: "Invalid language." }, { status: 400 })
  }

  const categoryId = searchParams.get("categoryId") ?? "all"
  if (
    categoryId !== "all" &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      categoryId
    )
  ) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 })
  }

  const search = (searchParams.get("search") ?? "").trim()
  if (search.length > 200) {
    return NextResponse.json(
      { error: "Search must be 200 characters or fewer." },
      { status: 400 }
    )
  }

  const result = await adminGetBlogPosts({
    page: parsePositiveInteger(searchParams.get("page"), 1),
    pageSize: pageSize as (typeof blogPostPageSizes)[number],
    search,
    language: languageParam,
    categoryId,
  })

  return NextResponse.json(result)
}
