import Navbar from "@/app/[lang]/(public)/_components/Navbar"
import { ReactNode } from "react"

export default async function LayoutPublic({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div>
      <Navbar lang={lang} />
      <main className="container mx-auto mb-32 px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
