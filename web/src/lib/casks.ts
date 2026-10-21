import fs from "node:fs"
import path from "node:path"

import { CASK_OVERRIDES, OTHER_APPS } from "@/content/apps"
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
      source: field(source, "homepage"),
    },
  }
}

export function getApps(): App[] {
  let files: string[] = []
  try {
    files = fs.readdirSync(CASKS_DIR).filter((f) => f.endsWith(".rb"))
  } catch {
    // No Casks folder next to web/: show only the apps from content/apps.ts.
  }

  const casks = files
    .map((f) => parseCask(fs.readFileSync(path.join(CASKS_DIR, f), "utf8")))
    .filter((app): app is App => app !== null)
    .map((app) => {
      const extra = CASK_OVERRIDES[app.id] ?? {}
      return { ...app, ...extra, links: { ...app.links, ...extra.links } }
    })

  return [...casks, ...OTHER_APPS].sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name))
}
