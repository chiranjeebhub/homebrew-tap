import type { StackGroup } from "@/lib/types"

// Tools grouped by area. The Stack section stays hidden while STACK is empty.
export const STACK: StackGroup[] = []

// Drafted from the public app repos (imports, Package.swift, project.yml, workflows) and the web
// apps' sites. Not shown until confirmed: move what's right into STACK above.
export const STACK_DRAFT: StackGroup[] = [
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
