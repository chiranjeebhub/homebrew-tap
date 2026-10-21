import { PROFILE } from "@/content/profile"

import { FlipSentences } from "./flip-sentences"
import { VerifiedIcon } from "./icons"

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] border-x border-dashed border-line">
      <figure className="dot-grid relative col-span-2 flex aspect-[2.6/1] items-center justify-center p-4 sm:col-span-1 sm:col-start-2 sm:aspect-auto sm:min-h-40">
        <DevicesMark className="h-20 w-auto text-foreground/80 sm:h-24" />
        <figcaption className="pointer-events-none absolute right-2 bottom-2 text-sm/none tracking-wide text-muted-foreground/60 tabular-nums select-none sm:right-4 sm:bottom-4">
          Fig. 1.
        </figcaption>
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="mx-0.5 my-0.75 flex">
            <div className="relative size-30 rounded-full min-[24rem]:size-32 sm:size-40">
              <img
                className="block size-full rounded-[inherit] object-cover select-none"
                src={PROFILE.avatar}
                alt={`${PROFILE.name}'s avatar`}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-foreground/20 ring-inset dark:ring-foreground/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex items-center gap-2 pl-4">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">{PROFILE.name}</h1>
            <VerifiedIcon className="size-4.5 select-none" />
          </div>
          <FlipSentences className="h-12.5 border-t border-line py-1 pl-4 sm:h-9" sentences={PROFILE.flipSentences} />
        </div>
      </div>
    </div>
  )
}

/** Line drawing of a laptop flanked by two phones: the three platforms. */
function DevicesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="42" y="14" width="136" height="72" rx="6" />
      <path d="M100 14h20v3a3 3 0 0 1-3 3h-14a3 3 0 0 1-3-3v-3Z" fill="currentColor" />
      <path d="M30 86h160l-6 8H36l-6-8Z" />
      <rect x="4" y="30" width="34" height="64" rx="7" className="fill-background" />
      <rect x="15" y="34" width="12" height="4" rx="2" fill="currentColor" />
      <rect x="182" y="30" width="34" height="64" rx="5" className="fill-background" />
      <circle cx="199" cy="36" r="2" fill="currentColor" />
      <path d="M60 34h44M60 44h64M60 54h36" strokeLinecap="round" opacity=".5" />
    </svg>
  )
}
