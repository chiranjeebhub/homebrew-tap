import { PROFILE } from "@/content/profile"
import type { App } from "@/lib/types"

import { BrewTerminal } from "./brew-terminal"

/** The cover at the top: a slanted wall of app icons drifting past, with a terminal installing each Mac app. */
export function CoverBanner({ apps }: { apps: App[] }) {
  const icons = apps.filter((a) => a.icon && (a.platforms.includes("macOS") || a.platforms.includes("iOS")))
  const casks = apps.flatMap((a) =>
    a.links.cask ? [{ name: a.name, token: a.links.cask, version: a.version }] : [],
  )

  // Enough tiles per row to cover the slanted wall at any width, then doubled for a seamless loop.
  const row = (offset: number) => {
    if (icons.length === 0) return []
    const tiles = Array.from({ length: 12 }, (_, i) => icons[(i + offset) % icons.length])
    return [...tiles, ...tiles]
  }

  return (
    <figure className="relative aspect-[2.6/1] overflow-hidden rounded-2xl border bg-surface sm:aspect-[3.4/1]">
      <div className="dot-grid absolute inset-0" aria-hidden />

      {icons.length > 0 && (
        <div
          className="absolute inset-[-40%] flex rotate-[-12deg] flex-col justify-center gap-3 sm:gap-4"
          style={{ maskImage: "radial-gradient(ellipse 45% 50% at 50% 50%, black 30%, transparent 75%)" }}
          aria-hidden
        >
          {[0, 3, 6, 9].map((offset, r) => (
            <div
              key={offset}
              className="cover-marquee flex w-max gap-3 sm:gap-4"
              style={{
                animationDuration: `${60 + r * 12}s`,
                animationDirection: r % 2 ? "reverse" : "normal",
                marginLeft: `${-r * 2.25}rem`,
              }}
            >
              {row(offset).map((app, i) => (
                <img
                  key={i}
                  src={app.icon}
                  alt=""
                  loading="lazy"
                  className="size-11 shrink-0 rounded-[22%] object-contain opacity-55 grayscale sm:size-14 dark:opacity-40"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* A slow light that sweeps across the wall. */}
      <div className="cover-sweep pointer-events-none absolute inset-0" aria-hidden />

      <figcaption className="absolute inset-0 flex items-center justify-center p-4">
        {casks.length > 0 ? (
          <BrewTerminal tap={PROFILE.tap} casks={casks} />
        ) : (
          <span className="font-mono text-sm text-muted-foreground">{PROFILE.tagline}</span>
        )}
      </figcaption>
    </figure>
  )
}
