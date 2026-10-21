"use client"

import { useEffect, useState } from "react"

/** The id of the section nearest the top of the viewport, or "" above the first one. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("")

  useEffect(() => {
    function update() {
      // Just below where a nav click lands a section (header height plus the 2rem scroll padding),
      // so a short section such as Contact still wins when it is the one clicked.
      const line = 120
      // Pick by position on the page, not by the order of `ids`, which may differ from it.
      let current = ""
      let best = -Infinity
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top === undefined) continue
        if (top <= line && top > best) {
          best = top
          current = id
        }
      }

      // At the bottom of the page the last sections can't scroll up to the line. Use the one in the
      // URL hash if it is on screen (the one just clicked), otherwise the last one on screen.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        const visible = ids.filter((id) => {
          const r = document.getElementById(id)?.getBoundingClientRect()
          return r && r.top < window.innerHeight && r.bottom > 0
        })
        const hash = decodeURIComponent(window.location.hash.slice(1))
        const pick =
          visible.includes(hash) && document.getElementById(hash)!.getBoundingClientRect().top > line
            ? hash
            : visible.sort((a, b) => document.getElementById(b)!.offsetTop - document.getElementById(a)!.offsetTop)[0]
        if (pick && document.getElementById(pick)!.getBoundingClientRect().top > best) current = pick
      }

      setActive(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    window.addEventListener("hashchange", update)
    return () => {
      window.removeEventListener("hashchange", update)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids])

  return active
}
