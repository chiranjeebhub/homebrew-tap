// Everything personal on the site lives here. Leave a field empty ("") to hide it.

export const PROFILE = {
  name: "Chiranjeeb",
  username: "chiranjeebhub",
  avatar: "https://github.com/chiranjeebhub.png?size=320",
  siteUrl: "", // e.g. "https://chiranjeeb.dev", used for metadata once the domain is live

  // Rotating lines under the name.
  flipSentences: [
    "Building apps for macOS, iOS and Android.",
    "Shipping native Mac utilities through Homebrew.",
    "Indie developer. Open source when it can be.",
  ],

  role: "Independent app developer",
  location: "", // e.g. "Bengaluru, India"
  email: "", // e.g. "hello@chiranjeeb.dev"

  // Bullet points for the About section.
  about: [
    "I build native apps for the Mac, iPhone and Android, mostly small tools that I wanted for myself first.",
    "My Mac apps are open source and install with one Homebrew command. Mobile apps are on the App Store and Google Play.",
  ],

  // Tracks for the "Now playing" record player in About. Leave empty to hide it.
  // `src` lists the same track in several formats; the browser plays the first it supports.
  music: [
    {
      title: "La Campanella",
      artist: "Franz Liszt · Romuald Greiss",
      src: [
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/ca/Liszt-La_Campanella-Greiss.ogg/Liszt-La_Campanella-Greiss.ogg.mp3",
        "https://upload.wikimedia.org/wikipedia/commons/c/ca/Liszt-La_Campanella-Greiss.ogg",
      ],
    },
  ],

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
