import { MapPinIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"

import { FlipSentences } from "./flip-sentences"
import { VerifiedIcon } from "./icons"

export function ProfileHeader() {
  return (
    <section className="screen-line-bottom border-x border-dashed border-line">
      <div className="p-4">
        <figure className="relative aspect-[3/1] overflow-hidden rounded-2xl border bg-surface sm:aspect-[4.2/1]">
          {PROFILE.cover ? (
            <img src={PROFILE.cover} alt="" className="size-full object-cover grayscale" />
          ) : (
            <div className="dot-grid flex size-full items-center justify-center">
              <DevicesMark className="h-1/2 w-auto text-foreground/70" />
            </div>
          )}
        </figure>
      </div>

      <div className="flex items-center gap-4 px-4 pb-5">
        <img
          src={PROFILE.avatar}
          alt={`${PROFILE.name}'s avatar`}
          className="size-18 shrink-0 rounded-xl border border-foreground/40 object-cover select-none sm:size-20"
        />
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl/tight font-medium tracking-tight sm:text-[1.75rem]/tight">{PROFILE.name}</h1>
            <VerifiedIcon className="size-5 select-none" />
          </div>
          <FlipSentences className="h-6" sentences={PROFILE.flipSentences} />
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

/** Line drawing of a laptop flanked by two phones: the three platforms. */
function DevicesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="42" y="14" width="136" height="72" rx="6" />
      <path d="M100 14h20v3a3 3 0 0 1-3 3h-14a3 3 0 0 1-3-3v-3Z" fill="currentColor" />
      <path d="M30 86h160l-6 8H36l-6-8Z" />
      <rect x="4" y="30" width="34" height="64" rx="7" className="fill-surface" />
      <rect x="15" y="34" width="12" height="4" rx="2" fill="currentColor" />
      <rect x="182" y="30" width="34" height="64" rx="5" className="fill-surface" />
      <circle cx="199" cy="36" r="2" fill="currentColor" />
      <path d="M60 34h44M60 44h64M60 54h36" strokeLinecap="round" opacity=".5" />
    </svg>
  )
}
