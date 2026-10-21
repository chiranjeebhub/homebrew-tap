// Finds app icons at build time, so the site shows them without copying image files into the repo.
// Every lookup returns undefined when it finds nothing or the network fails, and the site falls back to a plain tile.

const TIMEOUT = 8000

// Where Mac app repos usually keep their icon, best first. {repo} is the repo name.
const ICON_PATHS = [
  "docs/images/icon.png",
  "docs/images/logo.png",
  "{repo}/Resources/Assets.xcassets/AppIcon.appiconset/icon_128x128@2x.png",
  "{repo}/Assets.xcassets/AppIcon.appiconset/icon_128x128@2x.png",
  "Resources/Assets.xcassets/AppIcon.appiconset/icon_128x128@2x.png",
  "Resources/AppIcon.png",
  "Resources/AppIcon.svg",
  "icon.png",
  "logo.png",
  "AppIcon.png",
]

/** Finds the app's icon in its GitHub repo at build time. Returns its raw URL, or undefined if there is none. */
export async function findRepoIcon(homepage?: string): Promise<string | undefined> {
  const repo = homepage?.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!repo) return undefined
  const [, owner, name] = repo

  const urls = ICON_PATHS.map(
    (p) => `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${p.replace("{repo}", name)}`,
  )
  const found = await Promise.all(
    urls.map((url) =>
      fetch(url, { method: "HEAD", signal: AbortSignal.timeout(TIMEOUT) })
        .then((res) => res.ok)
        .catch(() => false),
    ),
  )
  return urls[found.indexOf(true)]
}

/** The 512px artwork of an App Store app, from Apple's lookup API. */
export async function findAppStoreIcon(appStoreUrl?: string): Promise<string | undefined> {
  const id = appStoreUrl?.match(/\/id(\d+)/)?.[1]
  if (!id) return undefined
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${id}`, { signal: AbortSignal.timeout(TIMEOUT) })
    if (!res.ok) return undefined
    const data = (await res.json()) as { results?: { artworkUrl512?: string }[] }
    return data.results?.[0]?.artworkUrl512
  } catch {
    return undefined
  }
}

/** A website's own icon: apple-touch-icon first, then the largest declared icon, then /favicon.ico. */
export async function findSiteIcon(siteUrl?: string): Promise<string | undefined> {
  if (!siteUrl) return undefined
  try {
    const res = await fetch(siteUrl, { signal: AbortSignal.timeout(TIMEOUT) })
    if (!res.ok) return undefined
    const html = await res.text()

    const icons = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map(([tag]) => {
        const attr = (name: string) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1]
        return { rel: attr("rel")?.toLowerCase() ?? "", href: attr("href"), size: Number(attr("sizes")?.split("x")[0]) || 0 }
      })
      .filter((l) => l.href && /(^|\s)(icon|apple-touch-icon)(\s|$)/.test(l.rel))
      .map((l) => ({ ...l, score: (l.rel.includes("apple-touch-icon") ? 1000 : 0) + (l.href!.endsWith(".svg") ? 500 : l.size) }))
      .sort((a, b) => b.score - a.score)

    if (icons[0]) return new URL(icons[0].href!, res.url).href

    const favicon = new URL("/favicon.ico", res.url).href
    const head = await fetch(favicon, { method: "HEAD", signal: AbortSignal.timeout(TIMEOUT) })
    return head.ok ? favicon : undefined
  } catch {
    return undefined
  }
}
