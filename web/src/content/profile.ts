// Everything personal on the site lives here. Leave a field empty ("") to hide it.

export const PROFILE = {
  name: "Chiranjeeb",
  username: "chiranjeebhub",
  avatar: "https://github.com/chiranjeebhub.png?size=320",
  cover: "", // optional banner image in web/public, e.g. "/cover.jpg"; empty shows the default pattern
  siteUrl: "", // e.g. "https://chiranjeeb.dev", used for metadata once the domain is live

  role: "Independent App Developer",
  tagline: "Building apps for macOS, iOS and Android.",

  // Rotating lines under the name.
  flipSentences: [
    "Independent App Developer",
    "Building apps for macOS, iOS and Android.",
    "Shipping native Mac utilities through Homebrew.",
  ],
  location: "", // e.g. "Bengaluru, India"
  email: "", // e.g. "hello@chiranjeeb.dev"

  // The About section: an intro paragraph, then a line per platform.
  intro:
    "I'm an independent developer building apps for the Mac, iPhone and the web, mostly small tools I wanted for myself first.",
  // One line per platform, each shown with its icon.
  about: [
    { platform: "mac", label: "Mac", text: "open-source utilities that install with one Homebrew command." },
    { platform: "iphone", label: "iPhone", text: "apps on the App Store, with more in TestFlight." },
    { platform: "web", label: "Web", text: "tools like TaskRooms and Gita Shuffle, with more on the way." },
  ] as { platform: "mac" | "iphone" | "web"; label: string; text: string }[],

  socials: {
    github: "https://github.com/chiranjeebhub",
    x: "https://x.com/ichiranjeeb",
    linkedin: "https://www.linkedin.com/in/ichiranjeeb/",
  },

  support: {
    githubSponsors: "https://github.com/sponsors/chiranjeebhub",
    buyMeACoffee: "https://buymeacoffee.com/chiranjeeb",
  },

  // The Homebrew tap this repo publishes.
  tap: "chiranjeebhub/tap",
  repo: "https://github.com/chiranjeebhub/homebrew-tap",
}
