import { PROFILE } from "@/content/profile"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  if (PROFILE.about.length === 0) return null

  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle id="about">About</PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-3 text-[15px]/relaxed text-pretty">
        {PROFILE.about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </PanelContent>
    </Panel>
  )
}
