import { PROFILE } from "@/content/profile"

import { ContributionGraph } from "./github-contributions"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  if (PROFILE.about.length === 0) return null

  return (
    <Panel id="about" screenLines="top">
      <PanelHeader>
        <PanelTitle id="about">About</PanelTitle>
      </PanelHeader>
      <PanelContent className="py-6">
        <ul className="list-disc space-y-2.5 pl-5 text-base/relaxed text-pretty text-muted-foreground marker:text-muted-foreground/50">
          {PROFILE.about.map((item, i) => {
            // "Mac: ..." shows the platform in the foreground colour.
            const [label, rest] = item.includes(": ") ? item.split(/: (.*)/s) : ["", item]
            return (
              <li key={i} className="pl-1">
                {label && <span className="font-medium text-foreground">{label}: </span>}
                {rest}
              </li>
            )
          })}
        </ul>
      </PanelContent>
      <ContributionGraph className="border-t border-line p-4" />
    </Panel>
  )
}
