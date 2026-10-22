import "server-only"
import { requireAdmin } from "./require-admin"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
export const adminGetBlogPostById = async (id: string) => {
  await requireAdmin()
  const data = await prisma.post.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      slug: true,
      language: true,
      title: true,
      description: true,
      smallDescription: true,
      fileKey: true,
      status: true,
      categoryId: true,
    },
  })
  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminBlogPostType= Awaited<ReturnType<typeof adminGetBlogPostById>>