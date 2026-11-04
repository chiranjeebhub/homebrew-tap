"use client"

import { useEffect, useRef, useState } from "react"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/"

/** Text that decodes from random glyphs, left to right, the first time it scrolls into view. */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(text)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const duration = 260 + text.length * 45
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const settled = Math.floor(p * text.length)
          setShown(
            text
              .split("")
              .map((c, i) => (i < settled || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join(""),
          )
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [text])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  )
}
