import { PROFILE } from "@/content/profile"

import { MusicPlayer } from "./music-player"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  if (PROFILE.about.length === 0) return null

  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle id="about">About</PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-10 py-8">
        <ul className="list-disc space-y-4 pl-5 text-lg/relaxed text-pretty text-muted-foreground marker:text-muted-foreground/50">
          {PROFILE.about.map((item, i) => (
            <li key={i} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
        {PROFILE.music.length > 0 && <MusicPlayer tracks={PROFILE.music} />}
      </PanelContent>
    </Panel>
  )
}
