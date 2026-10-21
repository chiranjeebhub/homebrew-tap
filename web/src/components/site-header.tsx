import { PROFILE } from "@/content/profile"

import { GitHubIcon } from "./icons"
import { SiteNav } from "./site-nav"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="screen-line-bottom mx-auto flex h-(--header-height) max-w-5xl items-center gap-4 border-x border-dashed border-line px-4">
        <a href="#" className="flex min-w-0 items-baseline gap-2" aria-label="Home">
          <span className="text-lg font-medium tracking-tight">{PROFILE.name}</span>
          <span className="truncate font-mono text-xs text-muted-foreground">@{PROFILE.username}</span>
        </a>

        <SiteNav />

        <div className="flex items-center gap-2 max-sm:ml-auto">
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener"
            className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="GitHub"
          >
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
