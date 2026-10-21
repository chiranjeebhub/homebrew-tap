import { PROFILE } from "@/content/profile"
import { cn } from "@/lib/utils"

import { GraphTooltip } from "./graph-tooltip"

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

// Muted greys, from no contributions to the most.
const LEVELS = [
  "bg-zinc-100 dark:bg-zinc-900",
  "bg-zinc-200 dark:bg-zinc-800",
  "bg-zinc-300 dark:bg-zinc-700",
  "bg-zinc-400 dark:bg-zinc-600",
  "bg-zinc-500 dark:bg-zinc-500",
]

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

const monthOf = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })

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

/** Contribution heatmap, fetched once at build time. Fills the column width. */
export async function ContributionGraph({ className }: { className?: string }) {
  const data = await getContributions()
  if (!data || data.days.length === 0) return null

  // Pad the front so the first column starts on a Sunday; the grid then fills column by column.
  const offset = new Date(data.days[0].date).getUTCDay()
  const cells: (Day | null)[] = [...Array(offset).fill(null), ...data.days]
  const weeks = Math.ceil(cells.length / 7)
  const columns = { gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }

  // Label a week when it starts a new month. Skip the first, partial month if the next label would crowd it.
  const months: { week: number; label: string }[] = []
  for (let w = 0; w < weeks; w++) {
    const day = cells.slice(w * 7, w * 7 + 7).find((d) => d !== null)
    const label = day && monthOf(day.date)
    if (label && label !== months.at(-1)?.label) months.push({ week: w, label })
  }
  if (months.length > 1 && months[1].week - months[0].week < 3) months.shift()

  const first = data.days[0].date
  const last = data.days.at(-1)!.date

  return (
    <figure className={cn("space-y-4", className)}>
      <GraphTooltip>
        {/* Right-to-left scrolling so narrow screens open on the most recent weeks. */}
        <div className="overflow-x-auto [direction:rtl] [scrollbar-width:none]">
          <div className="min-w-[36rem] space-y-2 [direction:ltr]">
            <div className="grid text-sm text-muted-foreground" style={columns} aria-hidden>
              {months.map((m) => (
                <span key={m.week} className="whitespace-nowrap" style={{ gridColumnStart: m.week + 1 }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[2px]" style={columns}>
              {cells.map((day, i) => (
                <div
                  key={i}
                  data-tip={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}` : undefined}
                  className={cn("aspect-square", day ? LEVELS[day.level] : "bg-transparent")}
                />
              ))}
            </div>
          </div>
        </div>
      </GraphTooltip>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
        <span>
          <span className="mr-2 text-muted-foreground">Fig. 1.</span>
          {data.total.toLocaleString("en-US")} contributions, {formatDate(first)} – {formatDate(last)}. Source:{" "}
          <a
            className="underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground"
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
          .
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          Less
          <span className="flex gap-[2px]">
            {LEVELS.map((c) => (
              <span key={c} className={cn("size-3", c)} />
            ))}
          </span>
          More
        </span>
      </figcaption>
    </figure>
  )
}
