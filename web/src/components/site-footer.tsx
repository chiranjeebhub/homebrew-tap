import { PROFILE } from "@/content/profile"

export function SiteFooter() {
  const rows = [
    { label: "Crafted by", value: PROFILE.name, href: PROFILE.socials.github },
    { label: "Deployed on", value: "Vercel", href: "https://vercel.com" },
    { label: "Source code", value: "GitHub", href: PROFILE.repo },
    { label: "Typeface", value: "Geist", href: "https://vercel.com/font" },
  ]

  return (
    <footer className="mx-auto md:max-w-3xl">
      <div className="screen-line-top screen-line-bottom border-x border-dashed border-line p-4">
        <dl className="grid gap-x-4 gap-y-1.5 font-mono text-sm sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex gap-2">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd>
                <a className="link" href={r.href} target="_blank" rel="noopener">
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="stripe-divider h-16 w-full border-x border-dashed border-line" aria-hidden />
    </footer>
  )
}
