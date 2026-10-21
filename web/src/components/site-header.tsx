import { PROFILE } from "@/content/profile"

import { GitHubIcon } from "./icons"
import { ThemeToggle } from "./theme-toggle"

const NAV = [
  { href: "#apps", label: "Apps" },
  { href: "#homebrew", label: "Homebrew" },
  { href: "#sponsor", label: "Sponsor" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-x border-dashed border-line px-4 md:max-w-3xl">
        <a href="#" className="flex items-center gap-2 font-mono text-sm font-medium" aria-label="Home">
          <img src={PROFILE.avatar} alt="" className="size-6 rounded-full ring-1 ring-border" />
          <span className="max-sm:hidden">{PROFILE.username}</span>
        </a>

        <nav className="ml-auto flex items-center gap-4 text-sm text-muted-foreground" aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-2 flex items-center gap-1 border-l border-dashed border-line pl-2">
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
