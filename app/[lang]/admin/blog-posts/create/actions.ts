"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { blogPostSchema, categorySchema } from "@/lib/zodSchemas"
import type { BlogPostSchemaType, CategorySchemaType } from "@/lib/zodSchemas"
import { ApiResponse } from "@/lib/types"

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
export async function createCategoryAction(
  input: CategorySchemaType,
): Promise<CreateCategoryResponse> {
  const validation = categorySchema.safeParse(input)
  if (!validation.success) {
    return {
      status: "error",
      message: validation.error.issues[0]?.message ?? "Check the category fields.",
    }
  }

  try {
    const category = await prisma.category.create({
      data: validation.data,
      select: { id: true, name: true, slug: true },
    })

    revalidatePath("/[lang]/admin/blog-posts/create", "page")
    return {
      status: "success",
      message: "Category created successfully.",
      category,
    }
  } catch (error) {
    if (hasPrismaCode(error, "P2002")) {
      return { status: "error", message: "That category slug is already in use." }
    }

    return {
      status: "error",
      message: "Could not create the category.",
    }
  }
}
export async function createBlogPostAction(input: BlogPostSchemaType):Promise<ApiResponse> {
  const parsed = blogPostSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the blog post fields.",
    }
  }

  const { categoryId, ...postData } = parsed.data

  try {
    await prisma.post.create({
      data: {
        ...postData,
        category: { connect: { id: categoryId } },
      },
    })

    revalidatePath("/[lang]/admin/blog-posts", "page")
    return { status: "success", message: "Blog created successfully." }
  } catch (error) {
    if (hasPrismaCode(error, "P2002")) {
      return { status: "error", message: "That blog post slug is already in use." }
    }

    if (hasPrismaCode(error, "P2025")) {
      return { status: "error", message: "Please select an existing category." }
    }

    return { status: "error", message: "Could not create the blog post." }
  }
}
