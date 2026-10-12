import { Geist, Geist_Mono } from "next/font/google"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{lang: string}>
}>) {
  const {lang}=await params;
  const isRtl = lang === "ar"
  const messages = await getMessages();
  return (
    <html
      lang={lang} dir={isRtl ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider><NextIntlClientProvider messages={messages}>
          <Navbar lang={lang} />
          {children}
        </NextIntlClientProvider></ThemeProvider>
      </body>
    </html>
  )
}
