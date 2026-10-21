import { prisma } from "@/lib/db"
import CreatePostForm from "./_components/CreatePostForm"
import { adminGetCategories } from "@/app/data/admin/admin-get-categories"


export default async function CreateBlogPostPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const categories = await adminGetCategories();
  return <CreatePostForm categories={categories} lang={lang} />
}
