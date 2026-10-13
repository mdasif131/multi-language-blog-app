import * as React from "react"
import { ThemeProvider as WrkszThemeProvider } from "@wrksz/themes/next"
import { ThemeHotkey } from "./theme-hotkey"



function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof WrkszThemeProvider>) {
  return (
    <WrkszThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </WrkszThemeProvider>
  )
}

export { ThemeProvider }
