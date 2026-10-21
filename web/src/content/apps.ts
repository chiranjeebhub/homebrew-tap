import type { App } from "@/lib/types"

// Mac apps are read from ../Casks at build time, so a new cask shows up on the
// site automatically. Use this file for the rest.

// Extra details for a cask, keyed by its token (the name in `cask "..." do`).
// Anything set here wins over what the cask says. For example, add an App Store
// link to a Mac app that is also on the Mac App Store, or give it an icon placed
// in web/public/icons/.
export const CASK_OVERRIDES: Record<string, Partial<App>> = {
  // notchdeck: { icon: "/icons/notchdeck.png", order: 1 },
}

// Apps that are not in the tap, such as iOS and Android apps.
export const OTHER_APPS: App[] = [
  // {
  //   id: "my-ios-app",
  //   name: "My iOS App",
  //   description: "What it does, in one line.",
  //   platforms: ["iOS"],
  //   icon: "/icons/my-ios-app.png",
  //   links: { appStore: "https://apps.apple.com/app/id0000000000" },
  // },
  // {
  //   id: "my-android-app",
  //   name: "My Android App",
  //   description: "What it does, in one line.",
  //   platforms: ["Android"],
  //   links: { googlePlay: "https://play.google.com/store/apps/details?id=com.example.app" },
  // },
]
