"use client"

import { cn } from "@/lib/utils"

import { useActiveSection } from "./use-active-section"

const NAV = [
  { id: "", label: "Home" },
  { id: "apps", label: "Apps" },
  { id: "homebrew", label: "Homebrew" },
  { id: "contact", label: "Contact" },
]

const IDS = NAV.map((n) => n.id).filter(Boolean)

export function SiteNav() {
  const active = useActiveSection(IDS)

  return (
    <nav className="ml-auto flex items-center gap-5 text-sm max-sm:hidden" aria-label="Main">
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
