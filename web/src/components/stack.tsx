import * as simpleIcons from "simple-icons"

import { STACK } from "@/content/stack"
import { cn } from "@/lib/utils"

import { Panel, PanelHeader, PanelTitle } from "./panel"

type SimpleIcon = { title: string; path: string; hex: string }

const findIcon = (name?: string) =>
  name ? (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[name] : undefined

/**
 * The brand colour an icon turns on hover. Near-black brands (Apple, Next.js, Vercel) would vanish
 * on the dark theme, so there they turn the text colour instead.
 */
function brandColors(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return {
    "--brand": `#${hex}`,
    "--brand-dark": luminance < 0.05 ? "var(--foreground)" : `#${hex}`,
  } as React.CSSProperties
}

/** Brand icon by its simple-icons export name. Rendered at build time, so the full icon set never ships to the browser. */
function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5 shrink-0 fill-current transition-colors duration-200 group-hover/chip:text-(--brand) dark:group-hover/chip:text-(--brand-dark)"
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  )
}

export function Stack() {
  if (STACK.length === 0) return null

  return (
    <Panel id="stack">
      <PanelHeader>
        <PanelTitle id="stack">Stack</PanelTitle>
      </PanelHeader>
      {STACK.map((group, i) => (
        <div key={group.name} className={cn("grid sm:grid-cols-[13rem_1fr]", i > 0 && "border-t border-line")}>
          <h3 className="flex items-baseline gap-2.5 px-4 pt-4 font-medium sm:border-r sm:border-dashed sm:border-line sm:py-4">
            <span className="font-mono text-sm text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            {group.name}
          </h3>
          <ul className="flex flex-wrap gap-2 p-4">
            {group.items.map((item) => {
              const icon = findIcon(item.icon)
              return (
                <li
                  key={item.name}
                  style={icon && brandColors(icon.hex)}
                  className="group/chip inline-flex items-center gap-1.5 rounded-full border bg-zinc-50 px-2.5 py-1 font-mono text-[0.8125rem] text-foreground/80 transition-colors hover:text-foreground dark:bg-zinc-900"
                >
                  {icon && <BrandIcon icon={icon} />}
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </Panel>
  )
}
