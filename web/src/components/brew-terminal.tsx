"use client"

import { useEffect, useState } from "react"
import { CheckIcon } from "lucide-react"

type Cask = { name: string; token: string; version?: string }

const TYPE_MS = 45
const HOLD_MS = 2600

/** A small terminal that types `brew install` for each cask in turn, then reports it installed. */
export function BrewTerminal({ tap, casks }: { tap: string; casks: Cask[] }) {
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(Number.POSITIVE_INFINITY)

  const cask = casks[index % casks.length]
  const command = `brew install ${tap}/${cask.token}`
  const done = typed >= command.length

  useEffect(() => {
    // Reduced motion: show each finished command, changing only every few seconds.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setInterval(() => setIndex((i) => i + 1), HOLD_MS * 2)
      return () => clearInterval(id)
    }
    if (typed === Number.POSITIVE_INFINITY) {
      setTyped(0)
      return
    }
    const id = done
      ? setTimeout(() => {
          setIndex((i) => i + 1)
          setTyped(0)
        }, HOLD_MS)
      : setTimeout(() => setTyped((t) => t + 1), TYPE_MS)
    return () => clearTimeout(id)
  }, [typed, done])

  return (
    <div className="w-full max-w-[19rem] overflow-hidden rounded-xl border bg-background/85 font-mono text-[0.6875rem] shadow-xl backdrop-blur-sm sm:max-w-md sm:text-[0.8125rem]">
      <div className="flex items-center gap-1.5 border-b px-3 py-2 max-sm:hidden">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-muted-foreground/30" />
        ))}
        <span className="ml-2 text-muted-foreground">zsh</span>
      </div>
      <div className="space-y-1 px-3 py-2.5 sm:py-3" aria-live="off">
        <p className="truncate">
          <span className="text-muted-foreground">$ </span>
          {command.slice(0, typed)}
          {!done && <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] animate-pulse bg-foreground" />}
        </p>
        <p
          className={`flex items-center gap-1.5 text-muted-foreground transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}
        >
          <CheckIcon className="size-3.5 text-success" aria-hidden />
          {cask.name}
          {cask.version ? ` ${cask.version}` : ""} installed
        </p>
      </div>
    </div>
  )
}
