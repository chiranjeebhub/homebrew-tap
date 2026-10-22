import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { SiteFooter } from "@/components/site-footer"
import { SectionIndex } from "@/components/section-index"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { PROFILE } from "@/content/profile"

import "./globals.css"

const description = PROFILE.tagline

const title = `${PROFILE.name} · Apps for macOS, iOS and Android`
const ogImage = PROFILE.ogImage || PROFILE.avatar

// The share card shows as a large preview on WhatsApp, X, LinkedIn and iMessage. metadataBase makes its URL absolute.
export const metadata: Metadata = {
  title,
  description,
  ...(PROFILE.siteUrl && { metadataBase: new URL(PROFILE.siteUrl) }),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: PROFILE.name,
    title,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${PROFILE.name}, ${PROFILE.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
    ...(PROFILE.socials.x && { creator: `@${PROFILE.socials.x.split("/").pop()}` }),
  },
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
          <SectionIndex />
        </ThemeProvider>
      </body>
    </html>
  )
}
