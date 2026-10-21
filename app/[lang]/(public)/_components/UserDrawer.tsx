"use client"

import { useTransition } from "react"
import {
  Bookmark,
  CircleUserRound,
  LoaderIcon,
  LogOut,
  User2,
  X,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSignOut } from "@/hooks/use-signout"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
export default function UserDrawer({ lang }: { lang: string }) {
  const isRtl = lang === "ar"
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [authPending, startAuthTransition] = useTransition()
  const name = session?.user.name?.trim() ?? ""
  const email = session?.user.email ?? ""
  const image = session?.user.image
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || email.slice(0, 2).toUpperCase() || "U"
  // const displayName = name.split(/\s+/)[0] || email.split("@")[0] || "Account"

  const handleGoogleSignIn = () => {
    startAuthTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `/${lang}`,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully")
          },
          onError: (error) => {
            toast.error(error.error.message || "Something went wrong")
          },
        },
      })
    })
  }

  const handleSignOut = useSignOut()

  if (sessionPending && !session) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Loading account"
        className="rounded-full border-primary"
        disabled
      >
        <LoaderIcon className="size-4 animate-spin" />
      </Button>
    )
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label={`Account menu for ${name || email}`}
            className="flex h-auto max-w-44 items-center gap-2 rounded-full px-1.5 py-1"
          >
            <Avatar>
              {image && <AvatarImage src={image} alt={name || "Profile"} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={isRtl ? "start" : "end"}
          className="w-72 rounded-3xl p-3"
        >
          <DropdownMenuItem asChild className="h-12 gap-3 px-3 text-base">
            <Link href={`/${lang}/saved`}>
              <Bookmark className="size-5" />
              <span>Saved</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-12 gap-3 px-3 text-base">
            <Link href={`/${lang}/account`}>
              <CircleUserRound className="size-5" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            className="h-12 gap-3 px-3 text-base text-destructive focus:text-destructive"
            disabled={authPending}
            onSelect={handleSignOut}
          >
            {authPending ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <LogOut className="size-5" />
            )}
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Drawer direction={isRtl ? "left" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Account"
          className="rounded-full border-primary"
        >
            <User2 className="h-4 w-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={`top-1 bottom-1 mt-0 h-auto w-[calc(100vw-0.5rem)] max-w-sm overflow-x-hidden overflow-y-auto overscroll-contain rounded-3xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl sm:w-96 ${
          isRtl ? "right-auto left-4" : "right-4 left-auto"
        } [&>div:first-child]:hidden`}
      >
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close account drawer"
            className="absolute top-[calc(env(safe-area-inset-top)+0.75rem)] right-3 z-10 min-h-11 min-w-11 rounded-full"
          >
            <X className="size-6" />
          </Button>
        </DrawerClose>

        <div className="mx-auto flex min-h-full w-full max-w-sm flex-col">
          <DrawerHeader className="items-center px-5 py-8 text-center sm:px-6">
            <div className="mb-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xl font-bold text-white">
              H
            </div>
            <DrawerTitle className="text-2xl">
              Sign in to HealthRemedy
            </DrawerTitle>
            <DrawerDescription>
              Save articles and get health tips that match your interests.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 px-5 sm:px-6">
            <Button
              variant="outline"
              className="min-h-12 w-full rounded-full"
              disabled={authPending}
              onClick={handleGoogleSignIn}
            >
              {authPending ? (
                <>
                  <LoaderIcon className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          <p className="px-5 pt-5 text-center text-sm leading-6 text-muted-foreground sm:px-6">
            By signing in, you agree to our{" "}
            <Link href={`/${lang}/terms`} className="text-primary underline">
              terms of use
            </Link>{" "}
            and acknowledge you have read our{" "}
            <Link href={`/${lang}/privacy`} className="text-primary underline">
              privacy notice
            </Link>
            .
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
