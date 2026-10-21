"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSignOut } from "@/hooks/use-signout"
import { authClient } from "@/lib/auth-client"
import { IconDashboard } from "@tabler/icons-react"
import {
  EllipsisVerticalIcon,
  HomeIcon,
  LogOutIcon,
  Tv2
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
export function NavUser() {
  const { lang } = useParams();
  const { isMobile } = useSidebar()
  const { data: session} = authClient.useSession()
  const handleSignOut = useSignOut()
  if (!session) {
    return null
  }
  const isAdmin = session?.user.role === "admin"

  const name =
    session?.user.name && session.user.name.length > 0
      ? session.user.name
      : session.user.email.split("@")[0]
  const subName =
    session.user.name && session.user.name.length > 0
      ? session.user.name.charAt(0).toUpperCase()
      : session.user.email.charAt(0).toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    session?.user.image ??
                    `https://avatar.vercel.sh/rauchg.svg?text=${subName}`
                  }
                  alt={name}
                />
                <AvatarFallback className="rounded-lg">
                  {subName}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      session?.user.image ??
                      `https://avatar.vercel.sh/rauchg.svg?text=${subName}`
                    }
                    alt={name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {subName}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/${lang}`}>
                  <HomeIcon />
                  Homepage
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href={`/${lang}/admin`}>
                    <IconDashboard />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={isAdmin ? `/${lang}/admin/blog-posts` : `/${lang}`}>
                  <Tv2 />
                  Blog
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
