"use client"

import { useEffect, useState } from "react"

/** The id of the section nearest the top of the viewport, or "" above the first one. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("")

  useEffect(() => {
    function update() {
      const line = window.innerHeight * 0.35
      let current = ""
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids])

  return active
}
