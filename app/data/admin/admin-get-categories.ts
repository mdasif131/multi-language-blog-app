import "server-only"
import { requireAdmin } from "./require-admin"
import { prisma } from "@/lib/db";

export async function adminGetCategories() {
  await requireAdmin();
  const data = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    },
    select: {
      id: true,
      name: true,
      slug:true,
    }
  })
  return data
}
export type AdminGetCategoryType = Awaited<ReturnType<typeof adminGetCategories>>[0]