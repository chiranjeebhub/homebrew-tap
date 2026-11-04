import { MapPinIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"
import type { App } from "@/lib/types"
import { cn } from "@/lib/utils"

import { CoverBanner } from "./cover-banner"
import { FlipSentences } from "./flip-sentences"
import { VerifiedIcon } from "./icons"

export function ProfileHeader({ apps }: { apps: App[] }) {
  return (
    <section className="screen-line-bottom border-x border-dashed border-line">
      <div className="p-4">
        {PROFILE.cover ? (
          <figure data-inspect="cover" className="aspect-[3/1] overflow-hidden rounded-2xl border bg-surface sm:aspect-[4.2/1]">
            <img src={PROFILE.cover} alt="" className="size-full object-cover grayscale" />
          </figure>
        ) : (
          <div data-inspect="cover"><CoverBanner apps={apps} /></div>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 pb-5">
        {PROFILE.avatarLight && (
          <img
            src={PROFILE.avatarLight}
            alt={`${PROFILE.name}'s avatar`}
            data-inspect="avatar"
            className="size-18 shrink-0 rounded-xl border border-foreground/40 bg-white object-cover select-none sm:size-20 dark:hidden"
          />
        )}
        <img
          src={PROFILE.avatar}
          alt={`${PROFILE.name}'s avatar`}
          data-inspect="avatar"
          className={cn(
            "size-18 shrink-0 rounded-xl border border-foreground/40 object-cover select-none sm:size-20",
            PROFILE.avatarLight && "not-dark:hidden",
          )}
        />
        <div className="min-w-0 space-y-1">
          <div data-inspect="name" className="flex w-fit items-center gap-2">
            <h1 className="text-2xl/tight font-medium tracking-tight sm:text-[1.75rem]/tight">{PROFILE.name}</h1>
            <VerifiedIcon className="size-5 select-none" />
          </div>
          <div data-inspect="tagline">
            <FlipSentences className="h-6" sentences={PROFILE.flipSentences} />
          </div>
          {PROFILE.location && (
            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <MapPinIcon className="size-3.5" aria-hidden />
              {PROFILE.location}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
