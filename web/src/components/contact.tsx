import { ArrowUpRightIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"
import { cn } from "@/lib/utils"

import { GitHubIcon, LinkedInIcon, XIcon } from "./icons"
import { Panel } from "./panel"

export function Contact() {
  const links = [
    { title: "GitHub", href: PROFILE.socials.github, icon: <GitHubIcon /> },
    { title: "Twitter", href: PROFILE.socials.x, icon: <XIcon /> },
    { title: "LinkedIn", href: PROFILE.socials.linkedin, icon: <LinkedInIcon /> },
  ].filter((l) => l.href)

  if (links.length === 0) return null

  return (
    <Panel id="contact" aria-label="Contact" className="target-flash">
      <ul className={cn("grid grid-cols-1", links.length > 1 && "sm:grid-cols-3")}>
        {links.map((item, i) => (
          <li key={item.title} className={cn(i > 0 && "border-t border-line sm:border-t-0 sm:border-l")}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener"
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
        ))}
      </ul>
    </Panel>
  )
}
