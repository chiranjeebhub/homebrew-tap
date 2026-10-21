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

export type Role = {
  title: string
  /** Picks the icon beside the role. */
  kind?: "engineering" | "design" | "mobile" | "lead" | "founder"
  type?: "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship"
  /** "YYYY-MM". Leave `end` out for a role you're still in. */
  start: string
  end?: string
  highlights?: string[]
  skills?: string[]
}

export type Company = {
  name: string
  /** A square image in web/public, or a URL. */
  logo?: string
  url?: string
  location?: string
  workplace?: "Remote" | "On-site" | "Hybrid"
  /** Most recent first. */
  roles: Role[]
}

export type StackItem = {
  name: string
  /** A simple-icons export name, such as "siSwift" (https://simpleicons.org). Leave out for no icon. */
  icon?: string
}

export type StackGroup = { name: string; items: StackItem[] }
