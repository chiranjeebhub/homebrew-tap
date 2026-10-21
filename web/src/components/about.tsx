import { GlobeIcon, LaptopIcon, SmartphoneIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"

import { ContributionGraph } from "./github-contributions"
import { IconTile, Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

const ICONS = { mac: LaptopIcon, iphone: SmartphoneIcon, web: GlobeIcon }

/** Turns [label](url) in a line of copy into links. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/)
  return parts.map((part, i) => {
    if (i % 3 === 0) return part
    if (i % 3 === 2) return null
    const href = parts[i + 1]
    const external = !href.startsWith("#")
    return (
      <a
        key={i}
        href={href}
        className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
        {...(external && { target: "_blank", rel: "noopener" })}
      >
        {part}
      </a>
    )
  })
}

export function About() {
  if (!PROFILE.intro && PROFILE.about.length === 0) return null

  return (
    <Panel id="about" screenLines="top">
      <PanelHeader>
        <PanelTitle id="about">About</PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-4 py-6">
        {PROFILE.intro && (
          <p className="text-base/relaxed text-pretty text-muted-foreground">
            <Inline text={PROFILE.intro} />
          </p>
        )}
        <ul className="space-y-3 text-base/relaxed text-pretty text-muted-foreground">
          {PROFILE.about.map((item) => {
            const Icon = ICONS[item.platform]
            return (
              <li key={item.platform} className="flex items-start gap-3">
                <IconTile className="-mt-px size-7 rounded-lg text-foreground/80">
                  <Icon aria-hidden />
                </IconTile>
                <span>
                  <span className="font-medium text-foreground">{item.label}:</span> <Inline text={item.text} />
                </span>
              </li>
            )
          })}
        </ul>
        {PROFILE.outro && (
          <p className="text-base/relaxed text-pretty text-muted-foreground">
            <Inline text={PROFILE.outro} />
          </p>
        )}
      </PanelContent>
      <ContributionGraph className="border-t border-line p-4" />
    </Panel>
  )
}
