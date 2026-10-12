"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ModeToggle } from "../../../../components/ThemeToggle"
import MobileMenu from "./MobileMenu"
import LanguageSwitcher from "./LanguageSwitcher"

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
      <div className="container mx-auto flex h-16 items-center justify-between gap-x-4 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="text-xl font-bold text-emerald-700">
          HealthRemedy
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                pathname === link.href ? "font-semibold text-emerald-600" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <LanguageSwitcher />
          <MobileMenu lang={lang} />
        </div>
      </div>
    </header>
  )
}
