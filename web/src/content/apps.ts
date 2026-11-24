import type { App } from "@/lib/types"

// Mac apps are read from ../Casks at build time, so a new cask shows up on the
// site automatically. Use this file for the rest.

// Extra details for a cask, keyed by its token (the name in `cask "..." do`).
// Anything set here wins over what the cask says. For example, add an App Store
// link to a Mac app that is also on the Mac App Store. Icons are found in the
// app's GitHub repo automatically; set `icon` here (a file in web/public/icons/)
// only to use a different one.
export const CASK_OVERRIDES: Record<string, Partial<App>> = {
  // Mac Apps order. Casks without an order follow, by name.
  clipstack: { order: 1 },
  notchdeck: { order: 2 },
  "bucket-browser": { order: 3 },
  hushtype: {
    links: { website: "https://hushtype.chiranjeeb.dev/", privacy: "https://hushtype.chiranjeeb.dev/privacy" },
  },
}

const HUSHTYPE_ICON = "https://raw.githubusercontent.com/chiranjeebhub/hushtype/main/docs/icon.png"

// Apps that are not in the tap: iOS, Android and web apps. The Projects toggle
// puts iOS and Android under Mobile Apps and "Web" under Web Apps; an app with
// both shows in both. Icons are filled in at build time from the App Store
// listing, or from the website's icon, unless `icon` is set here.
export const OTHER_APPS: App[] = [
  // Mobile
  {
    id: "gita-shuffle",
    name: "Gita Shuffle",
    description: "A random verse from the Bhagavad Gita, with the Sanskrit, a transliteration, its meaning and recitation audio. Optimised for iPhone, iPhone Duo and iPad.",
    platforms: ["iOS", "Web"],
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/6f/2d/8b/6f2d8b6b-9a9a-0d71-0d03-9481b698d98e/AppIcon-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg",
    order: 0,
    links: { appStore: "https://apps.apple.com/app/gita-shuffle/id6825326033", website: "https://gitashuffle.com/" },
  },
  {
    id: "garage-hq",
    name: "Garage HQ",
    description: "Network OS for business. Manage your company's networks, stakeholders and connections in one virtual office.",
    platforms: ["iOS"],
    order: 1,
    links: { appStore: "https://apps.apple.com/in/app/garage-hq/id6754905027" },
  },
  {
    id: "garage-connect",
    name: "Garage Connect",
    description: "Your network is your net worth. One place for your personal and professional network.",
    platforms: ["iOS"],
    order: 2,
    links: { appStore: "https://apps.apple.com/in/app/garage-connect/id6758221987" },
  },
  {
    id: "garageirl",
    name: "GarageIRL",
    description: "The all-in-one app for merchants on the Garage network: set up a store, take payments and manage products.",
    platforms: ["iOS"],
    order: 3,
    links: { appStore: "https://apps.apple.com/in/app/garageirl/id6799842262" },
  },
  {
    id: "taskrooms",
    name: "TaskRooms",
    description: "A real-time workspace that brings tasks, files, conversations and deadlines together, on web and mobile.",
    platforms: ["Web", "iOS"],
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8d/dd/d4/8dddd40f-a3ec-66e2-5be0-6e7ff005c05b/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.png",
    order: 4,
    links: { appStore: "https://apps.apple.com/in/app/taskrooms-tasks-chat/id6818674318", website: "https://taskrooms.com/" },
  },
  {
    id: "game",
    name: "Untitled game",
    description: "A new iOS game, coming to TestFlight.",
    platforms: ["iOS"],
    status: "TestFlight review",
    order: 5,
    links: { testFlight: "https://testflight.apple.com/join/GAHyDp75" },
  },
  {
    id: "hushtype-ios",
    name: "Hushtype for iPhone",
    description: "A keyboard for iPhone and iPad with Hushtype dictation built in: speak, and polished text lands in any app. Speech is recognized on the device.",
    platforms: ["iOS"],
    icon: HUSHTYPE_ICON,
    status: "Coming soon",
    order: 6,
    links: { website: "https://hushtype.chiranjeeb.dev/", privacy: "https://hushtype.chiranjeeb.dev/privacy" },
  },
  {
    id: "hushtype-android",
    name: "Hushtype for Android",
    description: "Dictate into any app from a floating bubble. On-device speech, polished by Gemini Nano or Claude.",
    platforms: ["Android"],
    icon: HUSHTYPE_ICON,
    status: "Early preview",
    order: 7,
    links: {
      source: "https://github.com/chiranjeebhub/hushtype-android",
      website: "https://hushtype.chiranjeeb.dev/",
      privacy: "https://hushtype.chiranjeeb.dev/privacy",
    },
  },

  // Web
  {
    id: "devstorage",
    name: "DevStorage",
    description: "Developer-first file upload infrastructure, backed by Cloudflare R2.",
    platforms: ["Web"],
    status: "In progress",
    order: 12,
    links: { website: "https://www.devstorage.io/" },
  },
  {
    id: "devmailer",
    name: "DevMailer",
    description: "Coming soon.",
    platforms: ["Web"],
    status: "In progress",
    order: 13,
    links: { website: "https://www.devmailer.io/" },
  },
  {
    id: "jsframework",
    name: "JSFramework.dev",
    description: "Coming soon.",
    platforms: ["Web"],
    status: "In progress",
    order: 14,
    links: { website: "https://jsframework.dev/" },
  },

  // Template for an Android app:
  // {
  //   id: "my-android-app",
  //   name: "My Android App",
  //   description: "What it does, in one line.",
  //   platforms: ["Android"],
  //   links: { googlePlay: "https://play.google.com/store/apps/details?id=com.example.app" },
  // },
]
