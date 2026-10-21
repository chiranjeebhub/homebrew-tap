import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { Homebrew } from "@/components/homebrew"
import { ProfileHeader } from "@/components/profile-header"
import { Projects } from "@/components/projects"
import { Sponsor } from "@/components/sponsor"
import { Stack } from "@/components/stack"
import { getApps } from "@/lib/casks"

export default async function HomePage() {
  const apps = await getApps()

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileHeader apps={apps} />
      <About />
      <Projects apps={apps} />
      <Experience />
      <Stack />
      <Homebrew apps={apps} />
      <Sponsor />
    </div>
  )
}
