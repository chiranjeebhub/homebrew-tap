import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Homebrew } from "@/components/homebrew"
import { ProfileHeader } from "@/components/profile-header"
import { Projects } from "@/components/projects"
import { Sponsor } from "@/components/sponsor"
import { getApps } from "@/lib/casks"

export default async function HomePage() {
  const apps = await getApps()

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileHeader />
      <About />
      <Contact />
      <Projects apps={apps} />
      <Homebrew apps={apps} />
      <Sponsor />
    </div>
  )
}
