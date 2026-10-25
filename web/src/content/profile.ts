// Everything personal on the site lives here. Leave a field empty ("") to hide it.

export const PROFILE = {
  name: "Chiranjeeb Jena",
  username: "chiranjeebhub",
  avatar: "https://github.com/chiranjeebhub.png?size=320",
  avatarLight: "/avatar-sketch.png", // optional pencil-sketch version shown in light mode; empty uses `avatar` in both themes
  ogImage: "/og.png", // 1200×630 link-preview card in web/public
  cover: "", // optional banner image in web/public, e.g. "/cover.jpg"; empty shows the default pattern
  siteUrl: "https://chiranjeeb.dev", // makes share-image and page links absolute in the metadata

  role: "Independent App Developer",
  tagline: "Building apps for macOS, iOS and Android.",

  // Rotating lines under the name.
  flipSentences: [
    "Independent App Developer",
    "Building apps for macOS, iOS and Android.",
    "Shipping native Mac utilities through Homebrew.",
  ],
  location: "", // e.g. "Bengaluru, India"
  email: "hello@chiranjeeb.dev",

  // The About section: an intro paragraph, then a line per platform.
  intro:
    "I'm Chiranjeeb Jena, an independent developer building native apps for the Mac and iPhone, and products for the web. Most start as small tools I wanted for myself, then get polished until they're worth sharing.",
  // One line per platform, each shown with its icon. [label](url) becomes a link.
  about: [
    {
      platform: "mac",
      label: "Mac",
      text: "open-source utilities: [Clipstack](https://github.com/chiranjeebhub/ClipStack), [NotchDeck](https://github.com/chiranjeebhub/NotchDeck), [Bucket Browser](https://chiranjeebhub.github.io/bucket-browser-site/), [Hushtype](https://github.com/chiranjeebhub/hushtype), [Shotwright](https://github.com/chiranjeebhub/Shotwright) and [Sweep](https://github.com/chiranjeebhub/Sweep), each one Homebrew command away.",
    },
    {
      platform: "iphone",
      label: "iPhone",
      text: "[Garage HQ](https://apps.apple.com/in/app/garage-hq/id6754905027), [Garage Connect](https://apps.apple.com/in/app/garage-connect/id6758221987) and [GarageIRL](https://apps.apple.com/in/app/garageirl/id6799842262) on the App Store, with more in TestFlight.",
    },
    {
      platform: "web",
      label: "Web",
      text: "[TaskRooms](https://taskrooms.com/) is live, with [DevStorage](https://www.devstorage.io/), DevMailer and JSFramework.dev on the way.",
    },
  ] as { platform: "mac" | "iphone" | "web"; label: string; text: string }[],
  outro: "Open to collaborating on ambitious ideas. [Say hello](#contact).",

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
