import { MailIcon } from "lucide-react"

import { PROFILE } from "@/content/profile"

import { GitHubIcon, LinkedInIcon, XIcon } from "./icons"
import { Panel, PanelContent } from "./panel"

export function SocialLinks() {
  const links = [
    { title: "GitHub", href: PROFILE.socials.github, icon: <GitHubIcon /> },
    { title: "X", href: PROFILE.socials.x, icon: <XIcon /> },
    { title: "LinkedIn", href: PROFILE.socials.linkedin, icon: <LinkedInIcon /> },
    { title: "Email", href: PROFILE.email && `mailto:${PROFILE.email}`, icon: <MailIcon /> },
  ].filter((l) => l.href)

  return (
    <Panel>
      <h2 className="sr-only">Social links</h2>
      <PanelContent>
        <ul className="flex flex-wrap gap-2">
          {links.map((item) => (
            <li key={item.title}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener"
                title={item.title}
                className="flex size-8 items-center justify-center rounded-lg border text-foreground/80 transition-colors hover:bg-accent [&_svg]:size-4"
              >
                {item.icon}
                <span className="sr-only">{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  )
}
