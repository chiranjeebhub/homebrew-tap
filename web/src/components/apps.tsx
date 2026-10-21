"use client"

import { useState } from "react"
import { ChevronsUpDownIcon, DownloadIcon, GlobeIcon, LaptopIcon, RefreshCwIcon, SmartphoneIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"
import type { App, Platform } from "@/lib/types"
import { cn } from "@/lib/utils"

import { Command } from "./copy-button"
import { AppleIcon, GitHubIcon, GooglePlayIcon } from "./icons"
import { ButtonLink, IconTile, Panel, PanelHeader, PanelTitle, Tag } from "./panel"

const PLATFORMS: Platform[] = ["macOS", "iOS", "Android"]

export function Apps({ apps }: { apps: App[] }) {
  const available = PLATFORMS.filter((p) => apps.some((a) => a.platforms.includes(p)))
  const [filter, setFilter] = useState<Platform | "All">("All")
  const shown = filter === "All" ? apps : apps.filter((a) => a.platforms.includes(filter))

  return (
    <Panel id="apps">
      <PanelHeader className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <PanelTitle id="apps" count={apps.length}>
          Apps
        </PanelTitle>

        {available.length > 1 && (
          <div role="group" aria-label="Filter by platform" className="mb-1 flex gap-1 font-mono text-xs">
            {(["All", ...available] as const).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={filter === p}
                onClick={() => setFilter(p)}
                className={cn(
                  "h-7 rounded-md border px-2 transition-colors",
                  filter === p ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </PanelHeader>

      <ul>
        {shown.map((app, i) => (
          <li key={app.id} className={cn(i > 0 && "border-t border-line")}>
            <AppItem app={app} defaultOpen={i === 0} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function AppItem({ app, defaultOpen }: { app: App; defaultOpen?: boolean }) {
  const { links } = app

  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center hover:bg-accent-muted">
        <IconTile className="mx-4 size-8 rounded-lg">
          {app.icon ? (
            <img src={app.icon} alt="" className="size-full rounded-[inherit] object-cover" />
          ) : app.platforms.includes("macOS") ? (
            <LaptopIcon />
          ) : (
            <SmartphoneIcon />
          )}
        </IconTile>

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
