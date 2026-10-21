"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { blogPostSchema, categorySchema } from "@/lib/zodSchemas"
import type { BlogPostSchemaType, CategorySchemaType } from "@/lib/zodSchemas"
import { ApiResponse } from "@/lib/types"
import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet, { fixedWindow } from "@/lib/arcjet"
import { request } from "@arcjet/next"

type CreateCategoryResponse =
  | {
      status: "success"
      message: string
      category: { id: string; name: string; slug: string }
    }
  | { status: "error"; message: string }

function hasPrismaCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  )
}

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
)

export async function createCategoryAction(
  input: CategorySchemaType
): Promise<CreateCategoryResponse> {
  const session = await requireAdmin()
  try {
    const req = await request()
    const decision = await aj.protect(req, { fingerprint: session.user.id })
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        }
      } else {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake contact our support",
        }
      }
    }
    const validation = categorySchema.safeParse(input)
    if (!validation.success) {
      return {
        status: "error",
        message:
          validation.error.issues[0]?.message ?? "Check the category fields.",
      }
    }

    const category = await prisma.category.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    })

    revalidatePath("/[lang]/admin/blog-posts/create", "page")
    return {
      status: "success",
      message: "Category created successfully.",
      category,
    }
  } catch (error) {
    if (hasPrismaCode(error, "P2002")) {
      return {
        status: "error",
        message: "That category slug is already in use.",
      }
    }

    return {
      status: "error",
      message: "Could not create the category.",
    }
  }
}
export async function createBlogPostAction(
  input: BlogPostSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin()

  try {
    const req = await request()
    const decision = await aj.protect(req, { fingerprint: session.user.id })
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        }
      } else {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake contact our support",
        }
      }
    }
      const parsed = blogPostSchema.safeParse(input)
      if (!parsed.success) {
        return {
          status: "error",
          message:
            parsed.error.issues[0]?.message ?? "Check the blog post fields.",
        }
      }

    await prisma.post.create({
      data: {
        ...parsed.data,
        userId: session?.user.id as string,
      },
    })

    revalidatePath("/[lang]/admin/blog-posts", "page")
    return { status: "success", message: "Blog created successfully." }
  } catch (error) {
    if (hasPrismaCode(error, "P2002")) {
      return {
        status: "error",
        message: "That blog post slug is already in use.",
      }
    }

    if (hasPrismaCode(error, "P2025")) {
      return { status: "error", message: "Please select an existing category." }
    }

    return { status: "error", message: "Could not create the blog post." }
  }
}
