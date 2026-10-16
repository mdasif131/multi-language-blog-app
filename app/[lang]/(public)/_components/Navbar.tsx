"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "./LanguageSwitcher"
import MobileMenu from "./MobileMenu"
import UserDrawer from "./UserDrawer"


export default function Navbar({ lang }: { lang: string }) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const navLinks = [
    { name: t("health"), href: `/${lang}/category/health` },
    { name: t("nutrition"), href: `/${lang}/category/nutrition` },
    { name: t("sports"), href: `/${lang}/category/sports` },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between gap-x-2 px-3 sm:h-16 sm:gap-x-4 sm:px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="shrink-0 whitespace-nowrap text-base font-bold text-emerald-700 sm:text-xl"
        >
          HealthRemedy
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-emerald-600 ${
                pathname === link.href ? "font-semibold text-emerald-600" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <ModeToggle />
          <LanguageSwitcher />
          <Button className="hidden rounded-full px-3 sm:inline-flex">
            {t("subscribe")}
          </Button>
          <UserDrawer lang={lang} />
          <MobileMenu lang={lang} />
        </div>
      </div>
    </header>
  )
}
