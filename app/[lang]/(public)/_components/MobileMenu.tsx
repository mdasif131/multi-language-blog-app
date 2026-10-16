"use client"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import SideMenu from "./Side.Menu"

const MobileMenu = ({ lang }: { lang: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={
          isSidebarOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isSidebarOpen}
        aria-controls="mobile-navigation-menu"
        className="lg:hidden"
        onClick={() => setIsSidebarOpen((open) => !open)}
      >
        <Menu className="size-5" />
      </Button>
      <div className="lg:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          lang={lang}
        />
      </div>
    </>
  )
}

export default MobileMenu
