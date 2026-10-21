"use client"

import { useEffect, useState } from "react"

// Just below where a link lands a section (header height plus the 2rem scroll padding).
const LINE = 120

/** The id of the section being read, or "" above the first one. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("")

  useEffect(() => {
    // A section picked from a link stays active while it is on screen, until the reader scrolls
    // by hand. Short sections, and the last ones on the page, never reach the line on their own.
    let pinned = decodeURIComponent(window.location.hash.slice(1))

    const rect = (id: string) => document.getElementById(id)?.getBoundingClientRect()
    const onScreen = (r?: DOMRect) => !!r && r.top < window.innerHeight && r.bottom > 0

    function update() {
      if (ids.includes(pinned) && onScreen(rect(pinned))) return setActive(pinned)

      // Otherwise the lowest section whose top has passed the line, by position on the page.
      let current = ""
      let best = -Infinity
      for (const id of ids) {
        const top = rect(id)?.top
        if (top !== undefined && top <= LINE && top > best) {
          best = top
          current = id
        }
      }

      // At the very bottom, the last section on screen.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        const last = ids.filter((id) => onScreen(rect(id))).sort((a, b) => rect(b)!.top - rect(a)!.top)[0]
        if (last) current = last
      }

      setActive(current)
    }

    function onClick(e: MouseEvent) {
      const link = (e.target as Element).closest?.('a[href^="#"]')
      if (!link) return
      pinned = decodeURIComponent(link.getAttribute("href")!.slice(1))
      requestAnimationFrame(update)
    }

    // Hash changes made without a click, such as from the command menu or its G shortcuts.
    function onHash() {
      pinned = decodeURIComponent(window.location.hash.slice(1))
      requestAnimationFrame(update)
    }

    function unpin() {
      pinned = ""
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    document.addEventListener("click", onClick)
    window.addEventListener("hashchange", onHash)
    for (const type of ["wheel", "touchmove", "keydown"]) window.addEventListener(type, unpin, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      document.removeEventListener("click", onClick)
      window.removeEventListener("hashchange", onHash)
      for (const type of ["wheel", "touchmove", "keydown"]) window.removeEventListener(type, unpin)
    }
  }, [ids])

  return active
}
