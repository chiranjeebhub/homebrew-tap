import fs from "node:fs"
import path from "node:path"
import { cache } from "react"

import { CASK_OVERRIDES, OTHER_APPS } from "@/content/apps"
import { findAppStoreIcon, findRepoIcon, findSiteIcon } from "@/lib/app-icons"
import type { App } from "@/lib/types"

const CASKS_DIR = path.join(process.cwd(), "..", "Casks")

const MACOS_NAMES: Record<string, string> = {
  big_sur: "macOS 11 Big Sur",
  monterey: "macOS 12 Monterey",
  ventura: "macOS 13 Ventura",
  sonoma: "macOS 14 Sonoma",
  sequoia: "macOS 15 Sequoia",
  tahoe: "macOS 26 Tahoe",
}

const isGitHubRepo = (url?: string) => !!url && /^https:\/\/github\.com\/[^/]+\/[^/]+/.test(url)

function field(source: string, name: string) {
  const match = source.match(new RegExp(`^\\s*${name}\\s+"([^"]*)"`, "m"))
  return match?.[1]
}

/** Reads the handful of cask fields the site needs. Casks are simple enough that a regex does the job. */
export function parseCask(source: string): App | null {
  const token = source.match(/^cask\s+"([^"]+)"\s+do/m)?.[1]
  if (!token) return null

  const version = field(source, "version")
  const url = field(source, "url")?.replaceAll("#{version}", version ?? "")
  const homepage = field(source, "homepage")
  const macos = source.match(/depends_on\s+macos:\s+(?:">=\s*)?:?(\w+)/)?.[1]

  return {
    id: token,
    name: field(source, "name") ?? token,
    description: field(source, "desc") ?? "",
    platforms: ["macOS"],
    version,
    requirement: macos ? `${MACOS_NAMES[macos] ?? `macOS ${macos}`} or later` : undefined,
    autoUpdates: /^\s*auto_updates\s+true/m.test(source),
    links: {
      cask: token,
      download: url,
      // A GitHub homepage is the source. Otherwise the homepage is a website, and the
      // source is the repo the release is downloaded from, if it is on GitHub.
      source: isGitHubRepo(homepage) ? homepage : url?.match(/^https:\/\/github\.com\/[^/]+\/[^/]+/)?.[0],
      website: isGitHubRepo(homepage) ? undefined : homepage,
    },
  }
}

/** All apps, once per build: the page and the header's command menu share the result. */
export const getApps = cache(async function getApps(): Promise<App[]> {
  let files: string[] = []
  try {
    files = fs.readdirSync(CASKS_DIR).filter((f) => f.endsWith(".rb"))
  } catch {
    // No Casks folder next to web/: show only the apps from content/apps.ts.
  }

  const parsed = files
    .map((f) => parseCask(fs.readFileSync(path.join(CASKS_DIR, f), "utf8")))
    .filter((app): app is App => app !== null)

  const casks = await Promise.all(
    parsed.map(async (app) => {
      const extra = CASK_OVERRIDES[app.id] ?? {}
      const icon = extra.icon ?? (await findRepoIcon(app.links.source)) ?? (await findSiteIcon(app.links.website))
      return { ...app, ...extra, icon, links: { ...app.links, ...extra.links } }
    }),
  )

  const others = await Promise.all(
    OTHER_APPS.map(async (app) => ({
      ...app,
      icon:
        app.icon ??
        (await findAppStoreIcon(app.links.appStore)) ??
        (await findRepoIcon(app.links.source)) ??
        (await findSiteIcon(app.links.website)),
    })),
  )

  return [...casks, ...others].sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name))
})
