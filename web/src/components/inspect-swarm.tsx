"use client"

import { useEffect, useRef, useState } from "react"

/*
  "Inspect" intro: a handful of multiplayer-style cursors, each named after one of the apps, fly in and
  measure the page the way a design tool does: they drag a selection box over an element and tag it
  with its name and size. Rulers and column guides fade in around them, and a status pill counts the
  layers. Runs once per browser session, never with reduced motion, and can be replayed from ⌘K.
*/

const AGENTS = [
  { name: "Clipstack", color: "#3b82f6" },
  { name: "NotchDeck", color: "#d946ef" },
  { name: "Hushtype", color: "#8b5cf6" },
  { name: "Shotwright", color: "#06b6d4" },
  { name: "Sweep", color: "#f59e0b" },
  { name: "Bucket Browser", color: "#22c55e" },
]

const SEEN_KEY = "inspected"
export const INSPECT_EVENT = "inspect-page"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const ease = "cubic-bezier(0.65, 0, 0.35, 1)"

type Target = { el: HTMLElement; label: string }

/** Elements marked with data-inspect that are on screen now, in page order. */
function visibleTargets(): Target[] {
  const vh = window.innerHeight
  return Array.from(document.querySelectorAll<HTMLElement>("[data-inspect]"))
    .filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= vh - 40
    })
    .map((el) => ({ el, label: el.dataset.inspect || el.tagName.toLowerCase() }))
}

export function InspectSwarm() {
  const layer = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState({ done: 0, total: 0, finished: false })
  const running = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    async function run() {
      const root = layer.current
      if (!root || running.current) return
      running.current = true
      const abort = new AbortController()
      const stop = (e: KeyboardEvent) => e.key === "Escape" && abort.abort()
      window.addEventListener("keydown", stop)

      const targets = visibleTargets()
      const agents = AGENTS.slice(0, window.innerWidth < 640 ? 3 : AGENTS.length)
      setStatus({ done: 0, total: targets.length, finished: false })
      setActive(true)
      await sleep(350)

      // Deal the targets out round-robin so every cursor gets work spread across the page.
      const queues = agents.map((_, i) => targets.filter((_, t) => t % agents.length === i))
      let done = 0

      await Promise.all(
        agents.map(async (agent, i) => {
          const cursor = makeCursor(agent.name, agent.color)
          root.appendChild(cursor)
          // Enter from a random edge.
          const fromLeft = i % 2 === 0
          place(cursor, fromLeft ? -40 : window.innerWidth + 40, 80 + Math.random() * (window.innerHeight - 160), 0)
          await sleep(60 + i * 140)

          for (const t of queues[i]) {
            if (abort.signal.aborted) break
            const r = t.el.getBoundingClientRect()
            place(cursor, r.left, r.top, 650)
            await sleep(700)
            if (abort.signal.aborted) break
            const box = makeBox(r, t.label, agent.color)
            root.appendChild(box)
            // Drag out the selection: the cursor travels to the far corner as the box grows.
            requestAnimationFrame(() => {
              box.style.clipPath = "inset(-6px -200px -32px -200px)"
              place(cursor, r.right, r.bottom, 520)
            })
            await sleep(560)
            box.querySelector<HTMLElement>("[data-tag]")!.style.opacity = "1"
            setStatus((s) => ({ ...s, done: ++done }))
            await sleep(420)
            box.style.opacity = "0.35"
            box.style.background = "transparent"
            setTimeout(() => box.remove(), 1600)
          }

          // Leave by the nearest side.
          const r = cursor.getBoundingClientRect()
          place(cursor, r.left < window.innerWidth / 2 ? -60 : window.innerWidth + 60, r.top - 40, 700)
          await sleep(720)
          cursor.remove()
        }),
      )

      setStatus((s) => ({ ...s, done: s.total, finished: true }))
      await sleep(abort.signal.aborted ? 0 : 1300)
      setActive(false)
      await sleep(400)
      root.replaceChildren()
      window.removeEventListener("keydown", stop)
      running.current = false
    }

    const replay = () => run()
    window.addEventListener(INSPECT_EVENT, replay)

    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1"
      sessionStorage.setItem(SEEN_KEY, "1")
    } catch {}
    const startup = !seen && !reduced && window.scrollY < 40 && !location.hash ? setTimeout(run, 700) : undefined

    return () => {
      clearTimeout(startup)
      window.removeEventListener(INSPECT_EVENT, replay)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <Rulers visible={active} />
      <div ref={layer} className="absolute inset-0" />
      <div
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border bg-background/85 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-300"
        style={{ opacity: active ? 1 : 0, transform: `translate(-50%, ${active ? 0 : 8}px)` }}
      >
        {status.finished ? (
          <>
            <span className="size-1.5 rounded-full bg-success" />
            <span className="text-foreground">{status.total} layers checked</span>
            <span>·</span>
            <span>0 issues</span>
          </>
        ) : (
          <>
            <span className="size-1.5 animate-pulse rounded-full bg-link" />
            <span className="text-foreground">Inspecting</span>
            <span>·</span>
            <span>{AGENTS.length} agents</span>
            <span>·</span>
            <span className="tabular-nums">
              {status.done}/{status.total} layers
            </span>
            <span className="ml-1 rounded border px-1 text-[10px] max-sm:hidden">esc</span>
          </>
        )}
      </div>
    </div>
  )
}

/** A pixel ruler along the top of the screen and guides on the column edges, like a design tool's canvas. */
function Rulers({ visible }: { visible: boolean }) {
  const [width, setWidth] = useState(0)
  useEffect(() => setWidth(window.innerWidth), [visible])
  const ticks = Array.from({ length: Math.ceil(width / 100) + 1 }, (_, i) => i * 100)

  return (
    <div className="transition-opacity duration-500" style={{ opacity: visible ? 1 : 0 }}>
      <div className="absolute inset-x-0 top-0 h-4 border-b border-link/30 bg-background/90 font-mono text-[9px] text-link/80 backdrop-blur">
        {ticks.map((x) => (
          <span key={x} className="absolute top-0 h-full border-l border-link/40 pl-0.5 leading-4" style={{ left: x }}>
            {x}
          </span>
        ))}
      </div>
      {/* The column is max-w-3xl (48rem), centred. */}
      <div className="absolute inset-y-0 left-1/2 w-3xl max-w-full -translate-x-1/2 border-x border-link/50" />
    </div>
  )
}

function place(el: HTMLElement, x: number, y: number, ms: number) {
  el.style.transition = ms ? `transform ${ms}ms ${ease}` : "none"
  el.style.transform = `translate(${x}px, ${y}px)`
}

function makeCursor(name: string, color: string) {
  const el = document.createElement("div")
  el.className = "absolute top-0 left-0 will-change-transform"
  el.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" style="filter: drop-shadow(0 1px 2px rgb(0 0 0 / .35))">
      <path d="M2 1.5 L16 7.6 L9.6 9.4 L7.2 16 Z" fill="${color}" stroke="white" stroke-width="1.4" stroke-linejoin="round"/>
    </svg>
    <span style="background:${color}" class="absolute top-4 left-3.5 rounded-full px-1.5 py-px font-sans text-[11px] font-medium whitespace-nowrap text-white shadow-sm">${name}</span>`
  return el
}

function makeBox(r: DOMRect, label: string, color: string) {
  const el = document.createElement("div")
  el.className = "absolute"
  Object.assign(el.style, {
    left: `${r.left - 2}px`,
    top: `${r.top - 2}px`,
    width: `${r.width + 4}px`,
    height: `${r.height + 4}px`,
    border: `1px solid ${color}`,
    background: `color-mix(in oklab, ${color} 8%, transparent)`,
    clipPath: "inset(-6px 100% 100% -6px)",
    transition: `clip-path 520ms ${ease}, opacity 600ms ease, background 600ms ease`,
  })
  const handle = (pos: string) =>
    `<span class="absolute size-1.5 bg-white" style="${pos}; border:1px solid ${color}"></span>`
  el.innerHTML = `
    ${handle("left:-4px;top:-4px")}${handle("right:-4px;top:-4px")}
    ${handle("left:-4px;bottom:-4px")}${handle("right:-4px;bottom:-4px")}
    <span data-tag style="background:${color}; opacity:0; transition: opacity 200ms" class="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white">
      ${label} <span style="opacity:.75">${Math.round(r.width)} × ${Math.round(r.height)}</span>
    </span>`
  return el
}
