# chiranjeebhub/homebrew-tap

Homebrew casks for:

- [NotchDeck](https://github.com/chiranjeebhub/NotchDeck), which turns the MacBook notch into a hub for media, files, calendar and dev servers.
- [Sweep](https://github.com/chiranjeebhub/Sweep), a native cleaner for caches, logs, leftovers and large files.
- [Shotwright](https://github.com/chiranjeebhub/Shotwright), a menu bar screenshot tool with scrolling capture, screen recording, OCR and annotation.

```sh
brew install --cask chiranjeebhub/tap/notchdeck
brew install --cask chiranjeebhub/tap/shotwright
brew install --cask chiranjeebhub/tap/sweep
```

## Website

`web/` is a static Next.js site, deployed on Vercel, that lists every app in this tap. Mac apps are read from `Casks/` at build time, so a new cask shows up on the site after the next deploy.

- Personal details, links and sponsor buttons: `web/src/content/profile.ts`
- iOS and Android apps, App Store links and app icons: `web/src/content/apps.ts`

```sh
cd web && npm install && npm run dev
```
