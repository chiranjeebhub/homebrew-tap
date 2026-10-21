import { About } from "@/components/about"
import { Apps } from "@/components/apps"
import { Contact } from "@/components/contact"
import { GitHubContributions } from "@/components/github-contributions"
import { Homebrew } from "@/components/homebrew"
import { ProfileHeader } from "@/components/profile-header"
import { Sponsor } from "@/components/sponsor"
import { getApps } from "@/lib/casks"

export default function HomePage() {
  const apps = getApps()

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileHeader />
      <About />
      <Contact />
      <Apps apps={apps} />
      <Homebrew apps={apps} />
      <GitHubContributions />
      <Sponsor />
    </div>
  )
}
