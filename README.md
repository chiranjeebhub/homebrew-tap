# chiranjeebhub/homebrew-tap

Homebrew casks for:

- [Bucket Browser](https://github.com/chiranjeebhub/Bucket_Browser), which browses Amazon S3, Cloudflare R2 and S3-compatible buckets like folders in Finder.
- [Hushtype](https://github.com/chiranjeebhub/hushtype), push-to-talk dictation that transcribes on-device and types into any app.
- [NotchDeck](https://github.com/chiranjeebhub/NotchDeck), which turns the MacBook notch into a hub for media, files, calendar and dev servers.
- [Sweep](https://github.com/chiranjeebhub/Sweep), a native cleaner for caches, logs, leftovers and large files.
- [Shotwright](https://github.com/chiranjeebhub/Shotwright), a menu bar screenshot tool with scrolling capture, screen recording, OCR and annotation.

```sh
brew install --cask chiranjeebhub/tap/bucket-browser
brew install --cask chiranjeebhub/tap/hushtype
brew install --cask chiranjeebhub/tap/notchdeck
brew install --cask chiranjeebhub/tap/shotwright
brew install --cask chiranjeebhub/tap/sweep
```

## Website

`web/` is a static Next.js site, deployed on Vercel, that lists every app in this tap. Mac apps are read from `Casks/` at build time, so a new cask shows up on the site after the next deploy.

- Personal details, links and sponsor buttons: `web/src/content/profile.ts`
- iOS, Android and web apps, App Store links and icon overrides: `web/src/content/apps.ts` (Mac app icons are picked up from each app's GitHub repo at build time)

```sh
cd web && npm install && npm run dev
```
