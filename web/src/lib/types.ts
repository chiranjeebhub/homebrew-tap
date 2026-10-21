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
  /** Short note shown as a tag, such as "In progress" or "TestFlight review". */
  status?: string
  links: {
    cask?: string
    download?: string
    source?: string
    appStore?: string
    testFlight?: string
    googlePlay?: string
    website?: string
  }
}
