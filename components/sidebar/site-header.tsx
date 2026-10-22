"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import { ModeToggle } from "../mode-toggle"

const segmentLabels: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  "blog-posts": "Blog Posts",
  create: "Create",
}

function formatSegment(segment: string) {
  return (
    segmentLabels[segment] ??
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)
  const locale = pathSegments[0]
  const routeSegments = pathSegments.slice(1)
  const isAdminDashboard =
    routeSegments.length === 1 && routeSegments[0] === "admin"
  const breadcrumbSegments =
    routeSegments.length === 0
      ? ["Dashboard"]
      : isAdminDashboard
        ? ["Dashboard"]
        : routeSegments.map(formatSegment)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList className="text-base">
            {breadcrumbSegments.map((label, index) => {
              const isCurrentPage = index === breadcrumbSegments.length - 1
              const href = `/${[locale, ...routeSegments.slice(0, index + 1)]
                .filter(Boolean)
                .join("/")}`

              return (
                <Fragment key={`${label}-${index}`}>
                  <BreadcrumbItem>
                    {isCurrentPage ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isCurrentPage && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ms-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
