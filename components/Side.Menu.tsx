"use client"
import { X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


import { useOutsideClick } from "@/hooks/outSideClick"
import { useTranslations } from "next-intl"

interface SidbarProps {
  isOpen: boolean
  onClose: () => void
  lang: string
}

const SideMenu: React.FC<SidbarProps> = ({ isOpen, onClose,lang }) => {
  const pathname = usePathname()
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose)
  const t = useTranslations("nav"); 
  const isRtl = lang === "ar"
    
   const navLinks = [
     { name: t("health"), href: `/${lang}/category/health` },
     { name: t("nutrition"), href: `/${lang}/category/nutrition` },
     { name: t("sports"), href: `/${lang}/category/sports` },
   ]

  return (
    <div
      className={`fixed inset-y-0 z-50 h-screen w-full bg-black/50 text-white/70 shadow-xl ${
        isRtl ? "right-0" : "left-0"
      } ${
        isOpen ? "translate-x-0" : isRtl ? "translate-x-[110%]" : "translate-x-[-110%]"
      }`}
    >
      <div
        ref={sidebarRef}
        className={`flex h-screen max-w-96 min-w-72 flex-col gap-6 bg-background p-10 max-sm:max-w-80 dark:bg-background ${
          isRtl
            ? "ml-auto border-l border-l-border"
            : "border-r border-r-border"
        }`}
      >
        <div className="flex items-center justify-between gap-5">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="text-xl font-bold text-emerald-700"
          >
            HealthRemedy
          </Link>
          <button
            onClick={onClose}
            className="hoverEffect cursor-pointer text-primary hover:text-primary/50"
          >
            <X />
          </button>
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              pathname === link.href
                ? "font-semibold text-emerald-600"
                : "text-slate-600"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideMenu
