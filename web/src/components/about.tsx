import { PROFILE } from "@/content/profile"

import { ContributionGraph } from "./github-contributions"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  if (!PROFILE.about) return null

  return (
    <Panel id="about" screenLines="top">
      <PanelHeader>
        <PanelTitle id="about">About</PanelTitle>
      </PanelHeader>
      <PanelContent className="py-6">
        <p className="text-base/relaxed text-pretty text-muted-foreground">{PROFILE.about}</p>
      </PanelContent>
      <ContributionGraph className="border-t border-line p-4" />
    </Panel>
  )
}
