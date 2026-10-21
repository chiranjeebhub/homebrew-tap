import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { PROFILE } from "@/content/profile"

import "@fontsource/instrument-serif/400.css"
import "./globals.css"

const description = PROFILE.flipSentences[0]

export const metadata: Metadata = {
  title: `${PROFILE.name} · Apps for macOS, iOS and Android`,
  description,
  ...(PROFILE.siteUrl && { metadataBase: new URL(PROFILE.siteUrl) }),
  openGraph: { title: PROFILE.name, description, images: [PROFILE.avatar] },
  icons: { icon: PROFILE.avatar },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main className="px-2 md:px-0">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
