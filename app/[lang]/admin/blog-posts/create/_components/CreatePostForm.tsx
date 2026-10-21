"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader, PlusIcon, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import slugify from "slugify"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  blogLanguages,
  blogPostSchema,
  blogStatuses,
  categorySchema,
  type BlogLanguage,
  type BlogPostSchemaType,
  type CategorySchemaType,
} from "@/lib/zodSchemas"
import { createBlogPostAction, createCategoryAction } from "../actions"
import { tryCatch } from "@/hooks/try-catch"
import RichTextEditor from "@/components/rich-text-editor/Editor"

import { AdminGetCategoryType } from "@/app/data/admin/admin-get-categories"
import Uploader from "@/components/file-uploader/Uploader"

export default function CreatePostForm({
  categories,
  lang,
}: {
  categories: AdminGetCategoryType[]
  lang: string
}) {
  const router = useRouter()
  const [categoryOptions, setCategoryOptions] = useState(categories)

  const language = blogLanguages.includes(lang as BlogLanguage)
    ? (lang as BlogLanguage)
    : "en"

  const categoryForm = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "" },
  })

  const blogForm = useForm<BlogPostSchemaType>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      smallDescription: "",
      fileKey: "",
      language,
      status: "Draft",
      categoryId: "",
    },
  })

  async function onCreateCategory(values: CategorySchemaType) {
    const { data: result, error } = await tryCatch(createCategoryAction(values))

    if (error) {
      toast.error("An unexpected error occurred. Please try again")
      return
    }

    if (result.status === "error") {
      toast.error(result.message)
      return
    }

    setCategoryOptions((current) =>
      [
        ...current.filter((category) => category.id !== result.category.id),
        result.category,
      ].sort((a, b) => a.name.localeCompare(b.name))
    )
    blogForm.setValue("categoryId", result.category.id, {
      shouldValidate: true,
    })
    categoryForm.reset()
    router.refresh()
    toast.success(result.message)
  }

  async function onCreatePost(values: BlogPostSchemaType) {
    const { data: result, error } = await tryCatch(createBlogPostAction(values))
    if (error) {
      toast.error("An unexpected error occurred. Please try again")
      return
    }
    if (result.status === "success") {
      toast.success("Blog post created")
      router.push(`/${lang}/admin/blog-posts`)
    } else if (result.status === "error") {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/admin/blog-posts`}
          aria-label="Back to blog posts"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create blog post</h1>
          <p className="text-sm text-muted-foreground">
            Add a category if needed, then fill in the post details.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create category</CardTitle>
            <CardDescription>
              Categories organize posts and must have a unique slug.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...categoryForm}>
              <form
                className="space-y-5"
                onSubmit={categoryForm.handleSubmit(onCreateCategory)}
              >
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Nutrition" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end gap-3">
                  <FormField
                    control={categoryForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="min-w-0 flex-1">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="nutrition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const name = categoryForm.getValues("name")
                      categoryForm.setValue(
                        "slug",
                        slugify(name, { lower: true, strict: true }),
                        { shouldValidate: true }
                      )
                    }}
                  >
                    Generate <Sparkles className="ml-1 size-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={categoryForm.formState.isSubmitting}
                  >
                    {categoryForm.formState.isSubmitting ? (
                      <>
                        Createing... <Loader className="ml-1 animate-spin" />
                      </>
                    ) : (
                      <>
                        Create Course <PlusIcon size={16} />
                      </>
                    )}
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => categoryForm.reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog post details</CardTitle>
            <CardDescription>
              The fields below match the required fields in the Post model.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...blogForm}>
              <form
                className="space-y-5"
                onSubmit={blogForm.handleSubmit(onCreatePost)}
              >
                <FormField
                  control={blogForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end gap-3">
                  <FormField
                    control={blogForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="min-w-0 flex-1">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="my-first-post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const title = blogForm.getValues("title")
                      blogForm.setValue(
                        "slug",
                        slugify(title, { lower: true, strict: true }),
                        { shouldValidate: true }
                      )
                    }}
                  >
                    Generate <Sparkles className="ml-1 size-4" />
                  </Button>
                </div>

                <FormField
                  control={blogForm.control}
                  name="smallDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          maxLength={200}
                          placeholder="A short summary for cards and search results"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={blogForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full description</FormLabel>
                      <FormControl>
                        <RichTextEditor field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={blogForm.control}
                  name="fileKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <Uploader
                          onChange={field.onChange}
                          value={field.value || ""}
                          fileTypeAccepted="image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-3">
                  <FormField
                    control={blogForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="bn">Bengali</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="ko">Korean</SelectItem>
                            <SelectItem value="en-SG">
                              Singapore English
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={blogForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {blogStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status === "Archie" ? "Archived" : status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={blogForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={blogForm.formState.isSubmitting}
                  >
                    {blogForm.formState.isSubmitting ? (
                      <>
                        Createing... <Loader className="ml-1 animate-spin" />
                      </>
                    ) : (
                      <>
                        Create blog post <PlusIcon size={16} />
                      </>
                    )}
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => blogForm.reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
