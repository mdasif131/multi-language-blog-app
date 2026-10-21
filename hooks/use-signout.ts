"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useSignOut() {
  const router = useRouter()
  const handleSignOut = async function sigout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          toast.success("Signout successfully")
        },
        onError: (err) => {
          toast.error(err.error.message || "Failed to sign out")
        },
      },
    })
  }
  return handleSignOut
}
