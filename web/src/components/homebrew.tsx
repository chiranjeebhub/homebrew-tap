import type { App } from "@/lib/types"
import { PROFILE } from "@/content/profile"

import { Command } from "./copy-button"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function Homebrew({ apps }: { apps: App[] }) {
  const casks = apps.flatMap((a) => (a.links.cask ? [a.links.cask] : []))
  if (casks.length === 0) return null

  return (
    <Panel id="homebrew">
      <PanelHeader>
        <PanelTitle id="homebrew">Homebrew</PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-3">
        <p className="text-balance text-muted-foreground">
          Every Mac app here ships through my{" "}
          <a className="link text-foreground" href={PROFILE.repo} target="_blank" rel="noopener">
            Homebrew tap
          </a>
          . Add it once, then install or update anything by name.
        </p>
        <Command value={`brew tap ${PROFILE.tap}`} />
        <Command value={`brew install --cask ${casks.join(" ")}`} />
        <Command value="brew upgrade" />
      </PanelContent>
    </Panel>
  )
}
