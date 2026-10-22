"use client"

import Image from "next/image"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { Delete, Eye, MoreHorizontal, SquarePen } from "lucide-react"
import { useState } from "react"

import type { AdminBlogPost } from "@/app/data/admin/admin-get-blog-posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useConstructUrl } from "@/hooks/use-construct-url"
import Link from "next/link"
import { useParams } from "next/navigation"

function PostThumbnail({ post }: { post: AdminBlogPost }) {
  return (
    <Image
      src={useConstructUrl(post.fileKey)}
      alt={post.title}
      width={88}
      height={60}
      unoptimized
      className="h-14 w-20 rounded-md object-cover"
    />
  )
}

function statusStyle(status: string) {
  switch (status) {
    case "Published":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
    case "Draft":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function PostActions({
  post,
  onPreview,
  onDelete,
}: {
  post: AdminBlogPost
  onPreview: (post: AdminBlogPost) => void
  onDelete: (post: AdminBlogPost) => void
}) {
  const { lang } = useParams<{ lang: string }>()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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
            <Eye className="size-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/admin/blog-posts/${post.id}/edit`}>
              <SquarePen className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => {
              setMenuOpen(false)
              window.setTimeout(() => onDelete(post), 0)
            }}
          >
            <Delete className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function BlogPostsTable({
  posts,
  onPreview,
  onDelete,
}: {
  posts: AdminBlogPost[]
  onPreview: (post: AdminBlogPost) => void
  onDelete: (post: AdminBlogPost) => void
}) {


  const columns: ColumnDef<AdminBlogPost>[] = [
    {
      accessorKey: "fileKey",
      header: "Image",
      cell: ({ row }) => (
        <PostThumbnail post={row.original} />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="block max-w-52 truncate font-medium text-foreground">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "smallDescription",
      header: "Description",
      cell: ({ row }) => (
        <span className="block max-w-sm truncate text-muted-foreground">
          {row.original.smallDescription}
        </span>
      ),
    },
    {
      accessorKey: "language",
      header: "Language",
      cell: ({ row }) => (
        <span className="uppercase">{row.original.language}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={statusStyle(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <PostActions
          post={row.original}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ),
    },
  ]

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-28 text-center">
                No blog posts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
