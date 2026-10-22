import { adminGetBlogPostById } from "@/app/data/admin/admin-get-blog-post-byId"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EditBlogPostForm from "./_components/EditBlogForm";
import { adminGetCategories } from "@/app/data/admin/admin-get-categories";

type Params = Promise<{ blogId: string; lang:string}>
const EditBlogPage = async ({ params }: { params: Params }) => {
  const { blogId,lang } = await params
  const data = await adminGetBlogPostById(blogId);
   const categories = await adminGetCategories();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Edit Blog: <span className="text-primary underline">{data.title}</span>
      </h1>
          <EditBlogPostForm categories={categories} data={data} lang={lang} />
    </div>
  )
}

export default EditBlogPage