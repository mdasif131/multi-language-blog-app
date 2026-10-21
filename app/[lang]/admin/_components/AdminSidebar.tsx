"use client"

import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
 
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  lang: string
}

export function AppSidebar({ lang, ...props }: AppSidebarProps) {
  const navMain = [
    { title: "Dashboard", url: `/${lang}/admin`, icon: IconDashboard },
    { title: "Blog Posts", url: `/${lang}/admin/blog-posts`, icon: IconListDetails },
    { title: "Analytics", url: "#", icon: IconChartBar },
    { title: "Projects", url: "#", icon: IconFolder },
    { title: "Team", url: "#", icon: IconUsers },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link href="/">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser  />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
