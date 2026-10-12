"use client"
import { AlignLeft } from "lucide-react"
import { useState } from "react"
import SideMenu from "./Side.Menu"

const MobileMenu = ({ lang }: { lang: string }) => {
  const [isSidbarOpen, setIsSidbarOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsSidbarOpen(!isSidbarOpen)}>
        <AlignLeft className="hover:text-darkColor hoverEffect hover:cursor-pointer md:hidden" />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidbarOpen}
          onClose={() => setIsSidbarOpen(false)}
          lang={lang}
        />
      </div>
    </>
  )
}

export default MobileMenu
