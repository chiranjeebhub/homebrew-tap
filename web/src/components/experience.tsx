import { BriefcaseIcon, ChevronsDownUpIcon, ChevronsUpDownIcon, CodeXmlIcon, LightbulbIcon, PenToolIcon, SmartphoneIcon, UsersIcon } from "lucide-react"

import { EXPERIENCE, SHOW_EXPERIENCE } from "@/content/experience"
import type { Company, Role } from "@/lib/types"
import { cn } from "@/lib/utils"

import { IconTile, Panel, PanelHeader, PanelTitle, Tag } from "./panel"

const ROLE_ICONS = {
  engineering: CodeXmlIcon,
  design: PenToolIcon,
  mobile: SmartphoneIcon,
  lead: UsersIcon,
  founder: LightbulbIcon,
}

const month = (ym: string) => {
  const [y, m] = ym.split("-")
  return `${m}.${y}`
}

/** "2y 8m" between two "YYYY-MM" months, counting the build month for a current role. */
function duration(start: string, end?: string) {
  const [sy, sm] = start.split("-").map(Number)
  const now = new Date()
  const [ey, em] = end ? end.split("-").map(Number) : [now.getUTCFullYear(), now.getUTCMonth() + 1]
  const total = Math.max(1, (ey - sy) * 12 + (em - sm) + 1)
  const years = Math.floor(total / 12)
  const months = total % 12
  return [years && `${years}y`, months && `${months}m`].filter(Boolean).join(" ")
}

export function Experience() {
  if (!SHOW_EXPERIENCE || EXPERIENCE.length === 0) return null

  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle id="experience">Experience</PanelTitle>
      </PanelHeader>
      {EXPERIENCE.map((company, i) => (
        <CompanyItem key={company.name} company={company} first={i === 0} />
      ))}
    </Panel>
  )
}

function CompanyItem({ company, first }: { company: Company; first: boolean }) {
  const current = company.roles.some((r) => !r.end)

  return (
    <div className={cn("space-y-4 p-4", !first && "border-t border-line")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {company.logo ? (
          <img src={company.logo} alt="" className="size-8 shrink-0 rounded-full border object-cover" />
        ) : (
          <IconTile className="size-8 rounded-full">
            <BriefcaseIcon />
          </IconTile>
        )}
        <h3 className="text-lg font-medium">
          {company.url ? (
            <a href={company.url} target="_blank" rel="noopener" className="link">
              {company.name}
            </a>
          ) : (
            company.name
          )}
        </h3>
        {(company.location || company.workplace || current) && (
          <p className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            {company.location}
            {company.workplace && <span>({company.workplace})</span>}
            {current && (
              <span className="relative flex size-2.5" title="Current">
                <span className="absolute inset-0 animate-ping rounded-full bg-sky-500/60 motion-reduce:hidden" />
                <span className="relative size-2.5 rounded-full bg-sky-500 ring-2 ring-sky-500/25" />
              </span>
            )}
          </p>
        )}
      </div>

      <div className="space-y-5">
        {company.roles.map((role, i) => (
          <RoleItem key={`${role.title}-${role.start}`} role={role} defaultOpen={first && i === 0} />
        ))}
      </div>
    </div>
  )
}

function RoleItem({ role, defaultOpen }: { role: Role; defaultOpen: boolean }) {
  const Icon = ROLE_ICONS[role.kind ?? "engineering"]
  const hasHighlights = (role.highlights?.length ?? 0) > 0

  const header = (
    <div className="flex items-start gap-3">
      <IconTile className="size-8 rounded-lg">
        <Icon />
      </IconTile>
      <div className="min-w-0 flex-1 space-y-0.5">
        <h4 className="font-medium">{role.title}</h4>
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {role.type && <span className="border-r pr-2">{role.type}</span>}
          <span className="tabular-nums">
            {month(role.start)}–{role.end ? month(role.end) : "∞"}
          </span>
          <span className="border-l pl-2">{duration(role.start, role.end)}</span>
        </p>
      </div>
      {hasHighlights && (
        <span className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden>
          <ChevronsUpDownIcon className="size-4 group-open:hidden" />
          <ChevronsDownUpIcon className="hidden size-4 group-open:block" />
        </span>
      )}
    </div>
  )

  // A line runs down from the role's icon and turns, like an L, into the last row: the tags, or the
  // highlights while they're open. Classes are written out in full so Tailwind can find them.
  const hasSkills = (role.skills?.length ?? 0) > 0
  const lineClass = hasSkills
    ? "before:absolute before:top-10 before:bottom-3 before:left-4 before:w-px before:bg-line after:absolute after:bottom-3 after:left-4 after:h-px after:w-4 after:bg-line"
    : hasHighlights
      ? "has-[details[open]]:before:absolute has-[details[open]]:before:top-10 has-[details[open]]:before:bottom-3 has-[details[open]]:before:left-4 has-[details[open]]:before:w-px has-[details[open]]:before:bg-line has-[details[open]]:after:absolute has-[details[open]]:after:bottom-3 has-[details[open]]:after:left-4 has-[details[open]]:after:h-px has-[details[open]]:after:w-4 has-[details[open]]:after:bg-line"
      : ""

  return (
    <div className={cn("relative space-y-3", lineClass)}>
      {hasHighlights ? (
        <details open={defaultOpen} className="group">
          <summary className="cursor-pointer" aria-label={`${role.title}: show or hide details`}>
            {header}
          </summary>
          <ul className="mt-3 list-disc space-y-1.5 pl-16 text-sm/relaxed text-muted-foreground marker:text-muted-foreground/50">
            {role.highlights!.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      ) : (
        header
      )}
      {hasSkills && (
        <ul className="flex flex-wrap gap-1.5 pl-11">
          {role.skills!.map((s) => (
            <li key={s} className="flex">
              <Tag className="px-2 text-[0.8125rem]">{s}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
