import * as simpleIcons from "simple-icons"

import { STACK } from "@/content/stack"
import { cn } from "@/lib/utils"

import { Panel, PanelHeader, PanelTitle } from "./panel"

type SimpleIcon = { title: string; path: string }

/** Brand icon by its simple-icons export name. Rendered at build time, so the full icon set never ships to the browser. */
function BrandIcon({ name }: { name?: string }) {
  const icon = name ? (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[name] : undefined
  if (!icon) return null
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 fill-current" aria-hidden>
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
            {group.items.map((item) => (
              <li
                key={item.name}
                className="inline-flex items-center gap-1.5 rounded-full border bg-zinc-50 px-2.5 py-1 font-mono text-[0.8125rem] text-foreground/80 dark:bg-zinc-900"
              >
                <BrandIcon name={item.icon} />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Panel>
  )
}
