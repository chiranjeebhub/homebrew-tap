import { PROFILE } from "@/content/profile"
import { cn } from "@/lib/utils"

import { Panel, PanelHeader, PanelTitle } from "./panel"

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

const LEVELS = [
  "bg-muted",
  "bg-zinc-300 dark:bg-zinc-700",
  "bg-zinc-400 dark:bg-zinc-500",
  "bg-zinc-600 dark:bg-zinc-300",
  "bg-zinc-900 dark:bg-zinc-50",
]

async function getContributions(): Promise<{ total: number; days: Day[] } | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${PROFILE.username}?y=last`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { total: Record<string, number>; contributions: Day[] }
    return { total: data.total.lastYear ?? 0, days: data.contributions }
  } catch {
    // Offline build or API down: the section is simply left out.
    return null
  }
}

/** Contribution heatmap, fetched once at build time. */
export async function GitHubContributions() {
  const data = await getContributions()
  if (!data || data.days.length === 0) return null

  // Pad the front so the first column starts on a Sunday, then split into weeks.
  const offset = new Date(data.days[0].date).getUTCDay()
  const cells: (Day | null)[] = [...Array(offset).fill(null), ...data.days]
  const weeks: (Day | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <Panel id="github">
      <PanelHeader>
        <PanelTitle id="github">GitHub</PanelTitle>
      </PanelHeader>
      <figure className="space-y-3 p-4">
        <div className="overflow-x-auto [scrollbar-width:none]">
          <div className="flex w-max gap-[3px]">
            {weeks.map((week, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {week.map((day, d) => (
                  <div
                    key={d}
                    title={day ? `${day.count} contributions on ${day.date}` : undefined}
                    className={cn("size-2.5 rounded-[2px]", day ? LEVELS[day.level] : "bg-transparent")}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            {data.total.toLocaleString("en-US")} contributions in the last year on{" "}
            <a className="link text-foreground" href={PROFILE.socials.github} target="_blank" rel="noopener">
              GitHub
            </a>
          </span>
          <span className="flex items-center gap-1 text-xs">
            Less
            {LEVELS.map((c) => (
              <span key={c} className={cn("size-2.5 rounded-[2px]", c)} />
            ))}
            More
          </span>
        </figcaption>
      </figure>
    </Panel>
  )
}
