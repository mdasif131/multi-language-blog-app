import { adminGetCategories } from "@/app/data/admin/admin-get-categories"
import BlogPostsClient from "./_components/BlogPostsClient"

export default async function BlogPostsPage() {
  const categories = await adminGetCategories()
  return <BlogPostsClient categories={categories} />
}
