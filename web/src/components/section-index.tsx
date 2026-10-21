"use client"

import { SECTIONS } from "@/lib/sections"
import { cn } from "@/lib/utils"

import { useActiveSection } from "./use-active-section"

const IDS = SECTIONS.map((s) => s.id)

/** Table of contents pinned in the right gutter on wide screens. */
export function SectionIndex() {
  const active = useActiveSection(IDS)

  return (
    <nav
      aria-label="Index"
      className="fixed top-1/3 left-[calc(50%+32rem+2.5rem)] z-40 hidden font-mono text-sm min-[1400px]:block"
    >
      <p className="mb-4 text-xs tracking-[0.2em] text-muted-foreground uppercase">Index</p>
      <ul className="space-y-3">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn(
                "flex items-center gap-3 transition-colors",
                active === s.id ? "text-foreground" : "pl-[2.125rem] text-muted-foreground hover:text-foreground"
              )}
            >
              {active === s.id && <span className="h-px w-5.5 bg-foreground" aria-hidden />}
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
