import { ArrowUpRightIcon, MailIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"
import { cn } from "@/lib/utils"

import { GitHubIcon, LinkedInIcon, XIcon } from "./icons"
import { Panel } from "./panel"

const COLUMNS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
}

export function Contact() {
  const links = [
    { title: "Email", href: PROFILE.email ? `mailto:${PROFILE.email}` : "", icon: <MailIcon /> },
    { title: "GitHub", href: PROFILE.socials.github, icon: <GitHubIcon /> },
    { title: "Twitter", href: PROFILE.socials.x, icon: <XIcon /> },
    { title: "LinkedIn", href: PROFILE.socials.linkedin, icon: <LinkedInIcon /> },
  ].filter((l) => l.href)

  if (links.length === 0) return null

  return (
    <Panel id="contact" aria-label="Contact" className="target-flash">
      <ul className={cn("grid grid-cols-1", COLUMNS[links.length])}>
        {links.map((item, i) => {
          const external = !item.href.startsWith("mailto:")
          return (
            <li key={item.title} className={cn(i > 0 && "border-t border-line sm:border-t-0 sm:border-l")}>
              <a
                href={item.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener" : undefined}
                title={external ? undefined : PROFILE.email}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-accent-muted"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted/50 text-foreground/80 transition-colors group-hover:text-foreground [&_svg]:size-5">
                  {item.icon}
                </span>
                <span className="font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {item.title}
                </span>
                <ArrowUpRightIcon
                  className="size-4 text-muted-foreground transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                  aria-hidden
                />
              </a>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
