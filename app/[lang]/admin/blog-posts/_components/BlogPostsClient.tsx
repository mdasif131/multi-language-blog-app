"use client"

import Image from "next/image"
import ReactPaginate from "react-paginate"
import {
  Grid2X2,
  LoaderCircle,
  List,
  MoreHorizontal,
  Search,
  X,
  FileText,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import type { AdminGetCategoryType } from "@/app/data/admin/admin-get-categories"
import type { AdminBlogPost } from "@/app/data/admin/admin-get-blog-posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useConstructUrl } from "@/hooks/use-construct-url"
import { BlogPostsTable } from "./BlogPostsTable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type BlogPostsResponse = {
  data: AdminBlogPost[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

type ViewMode = "table" | "grid"

const languageOptions = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
  { value: "hi", label: "हिन्दी" },
  { value: "ar", label: "العربية" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "en-SG", label: "English (Singapore)" },
]

function statusStyle(status: string) {
  if (status === "Published") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
  }
  if (status === "Draft") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
  }
  return "border-border bg-muted text-muted-foreground"
}

function PostActions({
  post,
  onPreview,
}: {
  post: AdminBlogPost
  onPreview: (post: AdminBlogPost) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${post.title}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onPreview(post)}>
          Preview
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function BlogPostCard({
  post,
  onPreview,
}: {
  post: AdminBlogPost
  onPreview: (post: AdminBlogPost) => void
}) {
  const imageUrl = useConstructUrl(post.fileKey)

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 bg-muted">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute right-2 top-2">
          <PostActions post={post} onPreview={onPreview} />
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={statusStyle(post.status)}>
            {post.status}
          </Badge>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {post.language}
          </span>
        </div>
        <h2 className="line-clamp-2 font-semibold leading-6">{post.title}</h2>
        <p className="line-clamp-3 min-h-15 text-sm leading-6 text-muted-foreground">
          {post.smallDescription}
        </p>
      </div>
    </article>
  )
}

function PostPreview({
  post,
  onClose,
}: {
  post: AdminBlogPost
  onClose: () => void
}) {
  const imageUrl = useConstructUrl(post.fileKey)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-preview-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-background shadow-xl"
      >
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 z-10"
          aria-label="Close preview"
          onClick={onClose}
        >
          <X />
        </Button>
        <div className="relative h-64 bg-muted sm:h-80">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusStyle(post.status)}>
              {post.status}
            </Badge>
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {post.language}
            </span>
          </div>
          <h2 id="post-preview-title" className="text-2xl font-semibold">
            {post.title}
          </h2>
          <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
            {post.smallDescription}
          </p>
        </div>
      </section>
    </div>
  )
}

export default function BlogPostsClient({
  categories,
}: {
  categories: AdminGetCategoryType[]
}) {
  const [view, setView] = useState<ViewMode>("table")
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("all")
  const [categoryId, setCategoryId] = useState("all")
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<BlogPostsResponse>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewPost, setPreviewPost] = useState<AdminBlogPost | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
        language,
        categoryId,
      })

      try {
        const response = await fetch(`/api/admin/blog-posts?${params}`, {
          signal: controller.signal,
        })
        const payload = (await response.json()) as
          | BlogPostsResponse
          | { error?: string }

        if (!response.ok || !("data" in payload)) {
          throw new Error(
            "error" in payload && payload.error
              ? payload.error
              : "Could not load blog posts."
          )
        }

        setResult(payload)
        setPage(payload.page)
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === "AbortError") {
          return
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load blog posts."
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [categoryId, language, page, pageSize, search])

  const closePreview = useCallback(() => setPreviewPost(null), [])
  const firstItem = result.total === 0 ? 0 : (result.page - 1) * pageSize + 1
  const lastItem = Math.min(result.page * pageSize, result.total)

  return (
    <section className="space-y-5">
      {/* <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold tracking-tight">Blog posts</h1>
          <p className="text-sm text-muted-foreground">Manage your content</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <label className="flex flex-col gap-1.5 text-sm ">
              <span className="font-medium">Per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setPage(1)
                }}
              >
                <SelectTrigger aria-label="Items per page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} items
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm w-full">
              <span className="font-medium">Search posts</span>
              <span className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search title or description..."
                  className="pl-9"
                  aria-label="Search by title or description"
                />
              </span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm ">
              <span className="font-medium">Language</span>
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value)
                  setPage(1)
                }}
              >
                <SelectTrigger aria-label="Filter by language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm max-w-64">
              <span className="font-medium">Category</span>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value)
                  setPage(1)
                }}
              >
                <SelectTrigger aria-label="Filter by category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>
        </CardContent>
      </Card> */}
      {/*  */}
      
      <Card className="overflow-hidden rounded-xl  border-border/70 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b bg-muted/20 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Blog posts
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and organize your content
            </p>
          </div>
          <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <FileText className="size-5" />
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Per page */}
            <div className="min-w-0 space-y-2">
              <label htmlFor="page-size" className="text-sm font-medium">
                Per page
              </label>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setPage(1)
                }}
              >
                <SelectTrigger id="page-size" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} items
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="min-w-0 space-y-2">
              <label htmlFor="post-search" className="text-sm font-medium">
                Search posts
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="post-search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search title or description..."
                  className="h-10 w-full pl-9"
                />
              </div>
            </div>

            {/* Language */}
            <div className="min-w-0 space-y-2">
              <label htmlFor="post-language" className="text-sm font-medium">
                Language
              </label>
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value)
                  setPage(1)
                }}
              >
                <SelectTrigger id="post-language" className="h-10 w-full">
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="min-w-0 space-y-2">
              <label htmlFor="post-category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value)
                  setPage(1)
                }}
              >
                <SelectTrigger id="post-category" className="h-10 w-full">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-lg border bg-muted/40 p-1">
          <Button
            type="button"
            size="sm"
            variant={view === "grid" ? "default" : "ghost"}
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <Grid2X2 className="size-4" />
            Grid
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === "table" ? "default" : "ghost"}
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            <List className="size-4" />
            Table
          </Button>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing {firstItem}–{lastItem} of {result.total} items
        </p>
      </div>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="relative min-h-40">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-12 backdrop-blur-[1px]">
              <span className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm shadow-sm">
                <LoaderCircle className="size-4 animate-spin" />
                Loading posts
              </span>
            </div>
          )}
          {view === "table" ? (
            <BlogPostsTable posts={result.data} onPreview={setPreviewPost} />
          ) : result.data.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.data.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onPreview={setPreviewPost}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
              No blog posts found.
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Items per page: {pageSize}
        </p>
        {result.totalPages > 1 && (
          <ReactPaginate
            breakLabel="…"
            previousLabel="Previous"
            nextLabel="Next"
            forcePage={Math.max(result.page - 1, 0)}
            pageCount={result.totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            containerClassName="flex flex-wrap items-center justify-center gap-1"
            disabledClassName="pointer-events-none opacity-40"
            pageLinkClassName="flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors hover:bg-accent"
            previousLinkClassName="flex h-9 items-center rounded-md border px-3 text-sm transition-colors hover:bg-accent"
            nextLinkClassName="flex h-9 items-center rounded-md border px-3 text-sm transition-colors hover:bg-accent"
            breakLinkClassName="flex h-9 min-w-9 items-center justify-center px-2 text-sm text-muted-foreground"
            activeLinkClassName="border-primary bg-primary text-primary-foreground hover:bg-primary"
            ariaLabelBuilder={(pageNumber) => `Go to page ${pageNumber}`}
          />
        )}
      </div>
      {previewPost && <PostPreview post={previewPost} onClose={closePreview} />}
    </section>
  )
}
