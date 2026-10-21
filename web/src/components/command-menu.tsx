"use client"

import { useCallback, useEffect, useState } from "react"
import { Command } from "cmdk"
import {
  BriefcaseIcon,
  CoffeeIcon,
  CornerDownLeftIcon,
  FolderIcon,
  HeartIcon,
  HouseIcon,
  LayersIcon,
  LaptopIcon,
  MessageCircleIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
  BeerIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { PROFILE } from "@/content/profile"
import { SECTIONS } from "@/lib/sections"
import { cn } from "@/lib/utils"

import { GitHubIcon, LinkedInIcon, XIcon } from "./icons"
import { Monogram } from "./monogram"

export type MenuApp = { id: string; name: string; icon?: string; platforms: string[] }

// Icon and "G then key" shortcut for each section. Sections missing from the page are left out.
const SECTION_META: Record<string, { icon: React.ElementType; key: string }> = {
  "": { icon: HouseIcon, key: "h" },
  about: { icon: UserIcon, key: "a" },
  contact: { icon: MessageCircleIcon, key: "c" },
  projects: { icon: FolderIcon, key: "p" },
  experience: { icon: BriefcaseIcon, key: "e" },
  stack: { icon: LayersIcon, key: "t" },
  homebrew: { icon: BeerIcon, key: "b" },
  sponsor: { icon: HeartIcon, key: "s" },
}

const MENU = [{ id: "", label: "Home" }, ...SECTIONS].map((s) => ({ ...s, ...SECTION_META[s.id] }))

const LINKS = [
  { label: "GitHub", href: PROFILE.socials.github, icon: GitHubIcon },
  { label: "X (Twitter)", href: PROFILE.socials.x, icon: XIcon },
  { label: "LinkedIn", href: PROFILE.socials.linkedin, icon: LinkedInIcon },
  { label: "GitHub Sponsors", href: PROFILE.support.githubSponsors, icon: HeartIcon },
  { label: "Buy Me a Coffee", href: PROFILE.support.buyMeACoffee, icon: CoffeeIcon },
].filter((l) => l.href)

const ACTIONS = { section: "Go to section", app: "Show project", link: "Open link", theme: "Set theme" }

/** Scrolls to a section the same way a nav link does, so the header highlight follows. */
function goTo(id: string) {
  if (!id) {
    history.pushState(null, "", location.pathname)
    window.scrollTo({ top: 0 })
    window.dispatchEvent(new HashChangeEvent("hashchange"))
    return
  }
  if (location.hash === `#${id}`) {
    document.getElementById(id)?.scrollIntoView()
    window.dispatchEvent(new HashChangeEvent("hashchange"))
  } else {
    location.hash = id
  }
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))

/** Search button for the header, and the ⌘K command menu it opens. */
export function CommandMenu({ apps }: { apps: MenuApp[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const [mac, setMac] = useState(true)
  const { setTheme } = useTheme()

  const run = useCallback((fn: () => void) => {
    setOpen(false)
    fn()
  }, [])

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent))

    // ⌘K / Ctrl+K toggles the menu. "G" then a key jumps to a section, as listed in the menu.
    let pending: ReturnType<typeof setTimeout> | undefined
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      const key = e.key.toLowerCase()
      if (pending) {
        clearTimeout(pending)
        pending = undefined
        const item = MENU.find((m) => m.key === key)
        if (item) {
          e.preventDefault()
          setOpen(false)
          goTo(item.id)
        }
      } else if (key === "g") {
        pending = setTimeout(() => (pending = undefined), 1000)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const kind = selected.split(":")[0] as keyof typeof ACTIONS

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-full border pr-1.5 pl-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground max-sm:w-9 max-sm:justify-center max-sm:px-0"
        aria-label="Search"
      >
        <SearchIcon className="size-4" />
        <kbd className="flex gap-0.5 font-sans text-xs max-sm:hidden">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-muted px-1">{mac ? "⌘" : "Ctrl"}</span>
          <span className="flex size-6 items-center justify-center rounded-md bg-muted">K</span>
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command menu"
        value={selected}
        onValueChange={setSelected}
        overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        contentClassName="fixed top-[12vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 px-4">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <Command.Input
            placeholder="Type a command or search…"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Command.List className="mx-1.5 max-h-[min(24rem,55vh)] scroll-py-2 overflow-y-auto overscroll-contain rounded-xl border bg-background p-1.5">
          <Command.Empty className="py-10 text-center text-sm text-muted-foreground">No results.</Command.Empty>

          <Group heading="Menu">
            {MENU.map((m) => (
              <Item key={m.id || "home"} value={`section:${m.label}`} onSelect={() => run(() => goTo(m.id))}>
                <m.icon />
                {m.label}
                <Shortcut keys={["G", m.key.toUpperCase()]} />
              </Item>
            ))}
          </Group>

          {apps.length > 0 && (
            <Group heading="Projects">
              {apps.map((app) => (
                <Item
                  key={app.id}
                  value={`app:${app.name}`}
                  keywords={app.platforms}
                  onSelect={() => run(() => window.dispatchEvent(new CustomEvent("show-project", { detail: app.id })))}
                >
                  {app.icon ? (
                    <img src={app.icon} alt="" className="size-4 rounded-[22%] object-contain" />
                  ) : (
                    <LaptopIcon />
                  )}
                  {app.name}
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{app.platforms.join(" · ")}</span>
                </Item>
              ))}
            </Group>
          )}

          <Group heading="Links">
            {LINKS.map((l) => (
              <Item key={l.label} value={`link:${l.label}`} onSelect={() => run(() => window.open(l.href, "_blank", "noopener"))}>
                <l.icon />
                {l.label}
              </Item>
            ))}
          </Group>

          <Group heading="Theme">
            {(
              [
                ["light", "Light", SunIcon],
                ["dark", "Dark", MoonIcon],
                ["system", "System", MonitorIcon],
              ] as const
            ).map(([value, label, Icon]) => (
              <Item key={value} value={`theme:${label}`} onSelect={() => run(() => setTheme(value))}>
                <Icon />
                {label}
              </Item>
            ))}
          </Group>
        </Command.List>

        <div className="flex h-12 items-center justify-between px-4">
          <Monogram className="h-3.5 w-6.5 text-muted-foreground" />
          <span className="flex items-center gap-2 text-sm">
            {ACTIONS[kind] ?? "Go to section"}
            <kbd className="flex size-6 items-center justify-center rounded-md border bg-muted text-muted-foreground">
              <CornerDownLeftIcon className="size-3.5" />
            </kbd>
          </span>
        </div>
      </Command.Dialog>
    </>
  )
}

function Group({ className, ...props }: React.ComponentProps<typeof Command.Group>) {
  return (
    <Command.Group
      className={cn(
        "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function Item({ className, ...props }: React.ComponentProps<typeof Command.Item>) {
  return (
    <Command.Item
      className={cn(
        "flex h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 text-[0.9375rem] select-none data-[selected=true]:bg-accent",
        "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function Shortcut({ keys }: { keys: string[] }) {
  return (
    <span className="ml-auto flex gap-1.5 font-mono text-xs tracking-widest text-muted-foreground">
      {keys.map((k) => (
        <span key={k}>{k}</span>
      ))}
    </span>
  )
}
