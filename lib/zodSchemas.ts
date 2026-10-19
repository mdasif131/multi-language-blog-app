import { z } from "zod"

export const blogLanguages = ["en", "bn", "hi", "ar", "ja", "ko", "en-SG"] as const
export const blogStatuses = ["Draft", "Published", "Archie"] as const

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters")
  .max(100, "Slug must be at most 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens")

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(80),
  slug: slugSchema,
})

export const blogPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required"),
  slug: slugSchema,
  smallDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(200, "Short description must be at most 200 characters"),
  fileKey: z.string().trim().min(1, "Cover image file key is required"),
  language: z.enum(blogLanguages, { error: "Please select a valid language" }),
  status: z.enum(blogStatuses, { error: "Please select a status" }),
  categoryId: z.string().min(1, "Please select a category"),
})

export type CategorySchemaType = z.infer<typeof categorySchema>
export type BlogPostSchemaType = z.infer<typeof blogPostSchema>
export type BlogLanguage = (typeof blogLanguages)[number]
