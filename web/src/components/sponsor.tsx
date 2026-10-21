import { HeartIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"

import { BuyMeACoffeeIcon } from "./icons"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function Sponsor() {
  const { githubSponsors, buyMeACoffee } = PROFILE.support
  if (!githubSponsors && !buyMeACoffee) return null

  return (
    <Panel id="sponsor">
      <PanelHeader>
        <PanelTitle id="sponsor">Sponsor</PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-4">
        <p className="text-balance text-muted-foreground">
          The apps are free. If one of them saves you time, sponsoring helps me keep them maintained and build the next
          one.
        </p>
        <div className="flex flex-wrap gap-2">
          {githubSponsors && (
            <a
              href={githubSponsors}
              target="_blank"
              rel="noopener"
              className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              <HeartIcon className="size-4 fill-[#db61a2] text-[#db61a2]" aria-hidden />
              Sponsor on GitHub
            </a>
          )}
          {buyMeACoffee && (
            <a
              href={buyMeACoffee}
              target="_blank"
              rel="noopener"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#ffdd00] bg-[#ffdd00] px-3 text-sm font-medium text-zinc-950 transition-[filter] hover:brightness-95"
            >
              <BuyMeACoffeeIcon className="size-4" />
              Buy me a coffee
            </a>
          )}
        </div>
      </PanelContent>
    </Panel>
  )
}
