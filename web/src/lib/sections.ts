import { EXPERIENCE } from "@/content/experience"
import { STACK } from "@/content/stack"

// Page sections in order, for the header nav and the side index. Sections with no content are left out.
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "projects", label: "Projects" },
  ...(EXPERIENCE.length > 0 ? [{ id: "experience", label: "Experience" }] : []),
  ...(STACK.length > 0 ? [{ id: "stack", label: "Stack" }] : []),
  { id: "homebrew", label: "Homebrew" },
  { id: "sponsor", label: "Sponsor" },
]
