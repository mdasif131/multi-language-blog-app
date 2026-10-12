"use client"

import { Check, ChevronDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import Image from "next/image"

const languages = [
  { value: "en", label: "English", country: "us" },
  { value: "bn", label: "বাংলা", country: "bd" },
  { value: "hi", label: "हिन्दी", country: "in" },
  { value: "ar", label: "العربية", country: "sa" },
  { value: "ja", label: "日本語", country: "jp" },
  { value: "ko", label: "한국어", country: "kr" },
  { value: "en-SG", label: "English (SG)", country: "sg" },
]

function Flag({ country }: { country: string }) {
  return (
    <Image
      src={`https://flagcdn.com/w80/${country}.png`}
      width={20}
      height={15}
      alt=""
      className="h-3.75 w-5 rounded-[2px] object-cover"
    />
  )
}
export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split("/")[1] || "en"
  const currentLanguage =
    languages.find((l) => l.value === currentLocale) ?? languages[0]

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 text-sm"
          aria-label="Change language"
        >
          <Flag country={currentLanguage.country} />
          <span>{currentLanguage.label}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => handleLanguageChange(language.value)}
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2">
              <Flag country={language.country} />
              {language.label}
            </span>
            {currentLocale === language.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
