import { Contact } from "./contact"

/** The bottom of the page: the contact tiles, then a striped end cap. */
export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-3xl px-2 md:px-0">
      <Contact />
      <div className="stripe-divider h-16 w-full border-x border-dashed border-line" aria-hidden />
    </footer>
  )
}
