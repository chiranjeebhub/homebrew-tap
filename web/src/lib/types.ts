export type Platform = "macOS" | "iOS" | "Android" | "Web"

export type App = {
  id: string
  name: string
  description: string
  platforms: Platform[]
  icon?: string
  version?: string
  requirement?: string
  autoUpdates?: boolean
  order?: number
  links: {
    cask?: string
    download?: string
    source?: string
    appStore?: string
    googlePlay?: string
    website?: string
  }
}
