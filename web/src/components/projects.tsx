"use client"

import { useState } from "react"
import { ChevronsUpDownIcon, DownloadIcon, GlobeIcon, LaptopIcon, RefreshCwIcon, SmartphoneIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"
import type { App, Platform } from "@/lib/types"
import { cn } from "@/lib/utils"

import { Command } from "./copy-button"
import { AppleIcon, GitHubIcon, GooglePlayIcon } from "./icons"
import { ButtonLink, IconTile, Panel, PanelHeader, PanelTitle, Tag } from "./panel"

const TABS = [
  { id: "mac", label: "Mac Apps", empty: "No Mac apps here yet.", icon: LaptopIcon, platforms: ["macOS"] },
  { id: "mobile", label: "Mobile Apps", empty: "No mobile apps here yet.", icon: SmartphoneIcon, platforms: ["iOS", "Android"] },
  { id: "web", label: "Web Apps", empty: "No web apps here yet.", icon: GlobeIcon, platforms: ["Web"] },
] as const satisfies { id: string; label: string; empty: string; icon: unknown; platforms: Platform[] }[]

type TabId = (typeof TABS)[number]["id"]

const inTab = (app: App, tab: (typeof TABS)[number]) => app.platforms.some((p) => (tab.platforms as readonly Platform[]).includes(p))

export function Projects({ apps }: { apps: App[] }) {
  const [active, setActive] = useState<TabId>(() => (TABS.find((t) => apps.some((a) => inTab(a, t))) ?? TABS[0]).id)
  const tab = TABS.find((t) => t.id === active)!
  const shown = apps.filter((a) => inTab(a, tab))

  return (
    <Panel id="projects">
      <PanelHeader className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <PanelTitle id="projects" count={apps.length}>
          Projects
        </PanelTitle>

        <div role="tablist" aria-label="Project type" className="flex w-full rounded-xl border bg-surface p-1 sm:w-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm whitespace-nowrap transition-colors sm:px-3",
                "[&_svg]:size-4 [&_svg]:shrink-0 max-[400px]:[&_svg]:hidden",
                active === t.id
                  ? "bg-foreground font-semibold text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon aria-hidden />
              {t.label}
            </button>
          ))}
        </div>
      </PanelHeader>

      {shown.length > 0 ? (
        <ul role="tabpanel" aria-label={tab.label}>
          {shown.map((app, i) => (
            <li key={app.id} className={cn(i > 0 && "border-t border-line")}>
              <AppItem app={app} defaultOpen={i === 0} />
            </li>
          ))}
        </ul>
      ) : (
        <p role="tabpanel" aria-label={tab.label} className="dot-grid px-4 py-10 text-center text-sm text-muted-foreground">
          {tab.empty}
        </p>
      )}
    </Panel>
  )
}

function AppItem({ app, defaultOpen }: { app: App; defaultOpen?: boolean }) {
  const { links } = app

  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center hover:bg-accent-muted">
        {app.icon ? (
          <img src={app.icon} alt="" width={40} height={40} loading="lazy" className="mx-3 size-10 shrink-0 object-contain" />
        ) : (
          <IconTile className="mx-4 size-8 rounded-lg">
            {app.platforms.includes("macOS") ? <LaptopIcon /> : app.platforms.includes("Web") ? <GlobeIcon /> : <SmartphoneIcon />}
          </IconTile>
        )}

        <div className="flex flex-1 items-center gap-2 border-l border-dashed border-line p-4">
          <div className="flex-1">
            <h3 className="mb-1 leading-snug font-medium text-balance">{app.name}</h3>
            <p className="text-sm text-balance text-muted-foreground">{app.description}</p>
          </div>

          <div className="hidden shrink-0 gap-1 sm:flex">
            {app.platforms.map((p) => (
              <Tag key={p}>{p}</Tag>
            ))}
          </div>

          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </div>
      </summary>

      <div className="space-y-4 border-t border-line p-4">
        <ul className="flex flex-wrap gap-1.5">
          {app.platforms.map((p) => (
            <li key={p} className="flex sm:hidden">
              <Tag>{p}</Tag>
            </li>
          ))}
          {app.version && (
            <li className="flex">
              <Tag>v{app.version}</Tag>
            </li>
          )}
          {app.requirement && (
            <li className="flex">
              <Tag>{app.requirement}</Tag>
            </li>
          )}
          {app.autoUpdates && (
            <li className="flex">
              <Tag>
                <RefreshCwIcon className="size-3" />
                Auto-updates
              </Tag>
            </li>
          )}
        </ul>

        {links.cask && <Command value={`brew install --cask ${PROFILE.tap}/${links.cask}`} />}

        <div className="flex flex-wrap gap-2">
          {links.appStore && (
            <ButtonLink
              href={links.appStore}
              className="border-foreground bg-foreground text-background hover:bg-foreground/90"
            >
              <AppleIcon />
              App Store
            </ButtonLink>
          )}
          {links.googlePlay && (
            <ButtonLink
              href={links.googlePlay}
              className="border-foreground bg-foreground text-background hover:bg-foreground/90"
            >
              <GooglePlayIcon className="size-3.5" />
              Google Play
            </ButtonLink>
          )}
          {links.download && (
            <ButtonLink href={links.download}>
              <DownloadIcon />
              Download .dmg
            </ButtonLink>
          )}
          {links.source && (
            <ButtonLink href={links.source}>
              <GitHubIcon className="size-3.5" />
              Source
            </ButtonLink>
          )}
          {links.website && (
            <ButtonLink href={links.website}>
              <GlobeIcon />
              Website
            </ButtonLink>
          )}
        </div>
      </div>
    </details>
  )
}
