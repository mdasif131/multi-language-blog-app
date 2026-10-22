import "server-only"

import { prisma } from "@/lib/db"
import { blogLanguages, type BlogLanguage } from "@/lib/zodSchemas"
import { requireAdmin } from "./require-admin"

export const blogPostPageSizes = [5,10, 20, 50, 100] as const
export type BlogPostPageSize = (typeof blogPostPageSizes)[number]

export type AdminBlogPostsQuery = {
  page: number
  pageSize: BlogPostPageSize
  search: string
  language: BlogLanguage | "all"
  categoryId: string | "all"
}

export async function adminGetBlogPosts({
  page,
  pageSize,
  search,
  language,
  categoryId,
}: AdminBlogPostsQuery) {
  await requireAdmin()

  const normalizedSearch = search.trim()
  const where = {
    ...(language !== "all" ? { language } : {}),
    ...(categoryId !== "all" ? { categoryId } : {}),
    ...(normalizedSearch
      ? {
          OR: [
            { title: { contains: normalizedSearch, mode: "insensitive" as const } },
            {
              description: {
                contains: normalizedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              smallDescription: {
                contains: normalizedSearch,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  }

  const total = await prisma.post.count({ where })
  const totalPages = Math.ceil(total / pageSize)
  const currentPage = Math.min(page, Math.max(totalPages, 1))
  const data = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      language: true,
      fileKey: true,
      status: true,
      slug: true,
    },
  })

  return {
    data,
    total,
    page: currentPage,
    pageSize,
    totalPages,
  }
}

export type AdminBlogPost = Awaited<ReturnType<typeof adminGetBlogPosts>>["data"][number]

export function isBlogLanguage(value: string): value is BlogLanguage {
  return (blogLanguages as readonly string[]).includes(value)
}
