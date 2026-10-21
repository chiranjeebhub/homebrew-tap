import { About } from "@/components/about"
import { Apps } from "@/components/apps"
import { GitHubContributions } from "@/components/github-contributions"
import { Homebrew } from "@/components/homebrew"
import { Overview } from "@/components/overview"
import { Separator } from "@/components/panel"
import { ProfileHeader } from "@/components/profile-header"
import { SocialLinks } from "@/components/social-links"
import { Sponsor } from "@/components/sponsor"
import { getApps } from "@/lib/casks"

export default function HomePage() {
  const apps = getApps()

  return (
    <div className="mx-auto md:max-w-3xl">
      <ProfileHeader />
      <Separator />

      <SocialLinks />
      <Overview apps={apps} />
      <GitHubContributions />
      <Separator />

      <About />
      <Separator />

      <Apps apps={apps} />
      <Separator />

      <Homebrew apps={apps} />
      <Separator />

      <Sponsor />
    </div>
  )
}
