"use client"

import { SECTIONS } from "@/lib/sections"
import { cn } from "@/lib/utils"

import { useActiveSection } from "./use-active-section"

// Same sections, in the same order, as the side index. The monogram links home.
const NAV = SECTIONS
const IDS = NAV.map((n) => n.id)

export function SiteNav() {
  const active = useActiveSection(IDS)

  return (
    <nav className="ml-auto flex items-center gap-4 text-sm max-md:hidden" aria-label="Main">
      {NAV.map((item) => (
        <a
          key={item.label}
          href={`#${item.id}`}
          className={cn(
            "underline-offset-[6px] transition-colors hover:text-foreground",
            active === item.id ? "font-medium text-foreground underline" : "text-muted-foreground"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
