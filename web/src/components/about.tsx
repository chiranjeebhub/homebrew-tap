import { PROFILE } from "@/content/profile"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  if (PROFILE.about.length === 0) return null

  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle id="about">About</PanelTitle>
      </PanelHeader>
      <PanelContent className="py-6">
        <ul className="list-disc space-y-2.5 pl-5 text-base/relaxed text-pretty text-muted-foreground marker:text-muted-foreground/50">
          {PROFILE.about.map((item, i) => (
            <li key={i} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  )
}
