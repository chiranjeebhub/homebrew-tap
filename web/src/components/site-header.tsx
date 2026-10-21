import { PROFILE } from "@/content/profile"

import { getApps } from "@/lib/casks"

import { CommandMenu } from "./command-menu"
import { GitHubIcon } from "./icons"
import { Monogram } from "./monogram"
import { SiteNav } from "./site-nav"
import { ThemeToggle } from "./theme-toggle"

export async function SiteHeader() {
  const apps = await getApps()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="screen-line-bottom mx-auto flex h-(--header-height) max-w-3xl items-center gap-4 border-x border-dashed border-line px-4">
        <a href="#" className="text-foreground" aria-label="Home">
          <Monogram />
        </a>

        <SiteNav />

        <div className="flex items-center gap-2 max-sm:ml-auto">
          <CommandMenu
            apps={apps.map((a) => ({ id: a.id, name: a.name, icon: a.icon, platforms: a.platforms }))}
          />
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
