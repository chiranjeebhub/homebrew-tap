import { BriefcaseIcon, LayersIcon, MailIcon, MapPinIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"
import type { App } from "@/lib/types"

import { IconTile, Panel, PanelContent } from "./panel"

export function Overview({ apps }: { apps: App[] }) {
  const platforms = [...new Set(apps.flatMap((a) => a.platforms))]
  const items = [
    { icon: <BriefcaseIcon />, content: PROFILE.role },
    { icon: <LayersIcon />, content: `${apps.length} apps${platforms.length ? ` · ${platforms.join(", ")}` : ""}` },
    PROFILE.location && {
      icon: <MapPinIcon />,
      content: (
        <a
          className="link"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PROFILE.location)}`}
          target="_blank"
          rel="noopener"
        >
          {PROFILE.location}
        </a>
      ),
    },
    PROFILE.email && {
      icon: <MailIcon />,
      content: (
        <a className="link" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
      ),
    },
  ].filter(Boolean) as { icon: React.ReactNode; content: React.ReactNode }[]

  return (
    <Panel className="before:content-none after:content-none">
      <h2 className="sr-only">Overview</h2>
      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 font-mono text-sm">
            <IconTile>{item.icon}</IconTile>
            <p className="text-balance">{item.content}</p>
          </div>
        ))}
      </PanelContent>
    </Panel>
  )
}
