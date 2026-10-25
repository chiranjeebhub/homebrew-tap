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
  // Tiles are spaced with a right margin, not a gap, so half the row is exactly one set of tiles.
  const row = (offset: number) => {
    if (icons.length === 0) return []
    const tiles = Array.from({ length: 12 }, (_, i) => icons[(i + offset) % icons.length])
    return [...tiles, ...tiles]
  }

  return (
    <figure className="relative aspect-[2.6/1] overflow-hidden rounded-2xl border bg-surface sm:aspect-[3.4/1]">
      {icons.length > 0 && (
        <div className="absolute inset-[-40%] flex rotate-[-12deg] flex-col justify-center gap-3 sm:gap-4" aria-hidden>
          {[0, 3, 6, 9].map((offset, r) => (
            <div
              key={offset}
              className="cover-marquee flex w-max"
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
                  decoding="async"
                  className="mr-3 size-11 shrink-0 rounded-[22%] object-contain opacity-55 grayscale sm:mr-4 sm:size-14 dark:opacity-40"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Fades the wall out toward the edges. A gradient on top, rather than a mask on the moving
          rows, keeps the animation on the GPU, which stops Safari from flickering. The ellipse matches
          the old mask, which was sized to the wall (1.8 times the banner). */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 81% 90% at 50% 50%, transparent 30%, var(--surface) 75%)" }}
        aria-hidden
      />
      <div className="dot-grid absolute inset-0" aria-hidden />

      {/* A slow light that sweeps across the wall. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="cover-sweep absolute inset-y-0 left-0 w-3/5" />
      </div>

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
