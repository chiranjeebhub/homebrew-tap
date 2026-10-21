import { PROFILE } from "@/content/profile"
import { cn } from "@/lib/utils"

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

/** Contribution heatmap, fetched once at build time. Fills the column width. */
export async function ContributionGraph({ className }: { className?: string }) {
  const data = await getContributions()
  if (!data || data.days.length === 0) return null

  // Pad the front so the first column starts on a Sunday; the grid then fills column by column.
  const offset = new Date(data.days[0].date).getUTCDay()
  const cells: (Day | null)[] = [...Array(offset).fill(null), ...data.days]
  const weeks = Math.ceil(cells.length / 7)

  return (
    <figure className={cn("space-y-3", className)}>
      {/* Right-to-left scrolling so narrow screens open on the most recent weeks. */}
      <div className="overflow-x-auto [direction:rtl] [scrollbar-width:none]">
        <div
          className="grid min-w-[36rem] [direction:ltr] grid-flow-col grid-rows-7 gap-[3px] sm:gap-1"
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
        >
          {cells.map((day, i) => (
            <div
              key={i}
              title={day ? `${day.count} contributions on ${day.date}` : undefined}
              className={cn("aspect-square rounded-[3px]", day ? LEVELS[day.level] : "bg-transparent")}
            />
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
        <span className="flex items-center gap-1">
          Less
          {LEVELS.map((c) => (
            <span key={c} className={cn("size-3 rounded-[3px]", c)} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  )
}
