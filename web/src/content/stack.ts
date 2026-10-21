import type { StackGroup } from "@/lib/types"

// Tools grouped by area, in the order shown. The Stack section stays hidden while this is empty.
// `icon` is a simple-icons export name (https://simpleicons.org), such as "siSwift".
export const STACK: StackGroup[] = [
  {
    name: "Language",
    items: [
      { name: "Swift", icon: "siSwift" },
      { name: "TypeScript", icon: "siTypescript" },
    ],
  },
  {
    name: "Apple platforms",
    items: [
      { name: "SwiftUI", icon: "siSwift" },
      { name: "AppKit", icon: "siApple" },
      { name: "Combine", icon: "siApple" },
      { name: "ScreenCaptureKit", icon: "siApple" },
      { name: "AVFoundation", icon: "siApple" },
      { name: "Vision", icon: "siApple" },
      { name: "EventKit", icon: "siApple" },
    ],
  },
  {
    name: "Cross-platform",
    items: [
      { name: "React Native", icon: "siReact" },
      { name: "Expo", icon: "siExpo" },
    ],
  },
  {
    name: "Web",
    items: [
      { name: "Next.js", icon: "siNextdotjs" },
      { name: "React", icon: "siReact" },
      { name: "Cloudflare R2", icon: "siCloudflare" },
    ],
  },
  {
    name: "Shipping",
    items: [
      { name: "Xcode", icon: "siXcode" },
      { name: "Sparkle" },
      { name: "Homebrew", icon: "siHomebrew" },
      { name: "GitHub Actions", icon: "siGithubactions" },
      { name: "Vercel", icon: "siVercel" },
    ],
  },
]
