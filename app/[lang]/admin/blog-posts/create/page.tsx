import { prisma } from "@/lib/db"
import CreatePostForm from "./_components/CreatePostForm"

export default async function CreateBlogPostPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  })

  return <CreatePostForm categories={categories} lang={lang} />
}
