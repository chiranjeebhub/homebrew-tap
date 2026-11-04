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

/** Runs in <head> before first paint: hides the content when the intro is about to play. */
export const INSPECT_HEAD_SCRIPT = `try{if(sessionStorage.getItem("${SEEN_KEY}")!=="1"&&!location.hash&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("inspecting");window.__inspectFallback=setTimeout(function(){document.documentElement.classList.remove("inspecting")},6000)}}catch(e){}`

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const ease = "cubic-bezier(0.65, 0, 0.35, 1)"

/*
  While <html> has the "inspecting" class, every [data-inspect] element is hidden (globals.css), so the
  page starts as just its frame of lines. The class is set before first paint by the head script, and
  each element is wiped in as a cursor drags its selection box over it: the ones on screen at once,
  the rest as they scroll into view. Once everything has been revealed the class comes off.
*/
const HIDE_CLASS = "inspecting"
const label = (el: HTMLElement) => el.dataset.inspect || el.tagName.toLowerCase()

function reveal(el: HTMLElement, ms: number) {
  el.style.transition = ms ? `clip-path ${ms}ms ${ease}, opacity 150ms ease` : "none"
  el.style.opacity = "1"
  el.style.clipPath = "inset(-12px -12px -12px -12px)"
}

function clearStyles() {
  document.querySelectorAll<HTMLElement>("[data-inspect]").forEach((el) => {
    el.style.removeProperty("transition")
    el.style.removeProperty("opacity")
    el.style.removeProperty("clip-path")
  })
}

const onScreen = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && r.top < window.innerHeight * 0.92 && r.bottom > 0
}

export function InspectSwarm() {
  const layer = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(0)
  const [status, setStatus] = useState({ done: 0, total: 0 })

  useEffect(() => {
    // The head script leaves a fallback timer that shows the page if this component never loads.
    clearTimeout((window as unknown as { __inspectFallback?: number }).__inspectFallback)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const html = document.documentElement

    let pending = new Set<HTMLElement>() // hidden, waiting to be revealed
    let queue: HTMLElement[] = [] // on screen, waiting for a cursor
    const working = new Set<string>() // agent names out on the page
    let done = 0
    let ended = false

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) enqueue(e.target as HTMLElement)
      },
      { rootMargin: "0px 0px -8% 0px" },
    )

    function enqueue(el: HTMLElement) {
      if (!pending.has(el) || queue.includes(el)) return
      queue.push(el)
      queue.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      // Send out another cursor while there is more waiting than the crew can take, up to the whole crew.
      const crew = window.innerWidth < 640 ? 3 : AGENTS.length
      for (const agent of AGENTS) {
        if (working.size >= Math.min(crew, queue.length)) break
        if (!working.has(agent.name)) dispatch(agent)
      }
    }

    function finish(el: HTMLElement) {
      pending.delete(el)
      io.unobserve(el)
      setStatus({ done: ++done, total: done + pending.size })
      if (pending.size === 0) end()
    }

    function end() {
      if (ended) return
      ended = true
      queue = []
      pending.clear()
      io.disconnect()
      html.classList.remove(HIDE_CLASS)
      clearStyles()
    }

    async function dispatch(agent: (typeof AGENTS)[number]) {
      const root = layer.current
      if (!root) return
      working.add(agent.name)
      setBusy(working.size)
      const cursor = makeCursor(agent.name, agent.color)
      root.appendChild(cursor)
      const first = queue[0]?.getBoundingClientRect()
      const enterLeft = Math.random() < 0.5
      const y0 = window.scrollY + (first ? first.top : window.innerHeight / 2) + (Math.random() - 0.5) * 200
      place(cursor, enterLeft ? -40 : window.innerWidth + 40, y0, 0)
      await sleep(30 + Math.random() * 200)

      let idle = 0
      while (!ended && idle < 3) {
        const el = queue.shift()
        if (!el) {
          idle++
          await sleep(250)
          continue
        }
        idle = 0
        const r = el.getBoundingClientRect()
        // Scrolled past already: just show it.
        if (r.bottom < 0 || r.top > window.innerHeight) {
          reveal(el, 0)
          finish(el)
          continue
        }
        const x = r.left + window.scrollX
        const y = r.top + window.scrollY
        place(cursor, x, y, 480)
        await sleep(520)
        if (ended) break
        const box = makeBox(x, y, r.width, r.height, label(el), agent.color)
        root.appendChild(box)
        // Drag out the selection: the cursor travels to the far corner as the box grows and the element wipes in.
        requestAnimationFrame(() => {
          box.style.clipPath = "inset(-6px -200px -32px -200px)"
          reveal(el, 460)
          place(cursor, x + r.width, y + r.height, 460)
        })
        await sleep(500)
        box.querySelector<HTMLElement>("[data-tag]")!.style.opacity = "1"
        finish(el)
        await sleep(320)
        box.style.opacity = "0.35"
        box.style.background = "transparent"
        setTimeout(() => box.remove(), 1400)
      }

      // Leave by the nearest side.
      const r = cursor.getBoundingClientRect()
      place(cursor, r.left < window.innerWidth / 2 ? -60 : window.innerWidth + 60, r.top + window.scrollY - 40, 600)
      await sleep(620)
      cursor.remove()
      working.delete(agent.name)
      setBusy(working.size)
    }

    function start() {
      ended = false
      done = 0
      html.classList.add(HIDE_CLASS)
      clearStyles()
      // Skip parts that aren't rendered (the avatar for the other theme): they could never be reached.
      pending = new Set(
        Array.from(document.querySelectorAll<HTMLElement>("[data-inspect]")).filter((el) => {
          if (el.getClientRects().length > 0) return true
          reveal(el, 0)
          return false
        }),
      )
      setStatus({ done: 0, total: pending.size })
      pending.forEach((el) => io.observe(el))
      pending.forEach((el) => onScreen(el) && enqueue(el))
    }

    // Parts added later (a new Projects tab) appear at once if on screen, or wait for their turn if not.
    const mo = new MutationObserver((records) => {
      if (ended) return
      for (const rec of records)
        rec.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return
          const els = [n, ...Array.from(n.querySelectorAll<HTMLElement>("[data-inspect]"))].filter((e) => e.dataset.inspect)
          for (const el of els) {
            if (onScreen(el)) reveal(el, 0)
            else {
              pending.add(el)
              io.observe(el)
            }
          }
        })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && end()
    const replay = () => start()
    window.addEventListener("keydown", onKey)
    window.addEventListener(INSPECT_EVENT, replay)

    try {
      sessionStorage.setItem(SEEN_KEY, "1")
    } catch {}
    const play = html.classList.contains(HIDE_CLASS) && !reduced
    const timer = play ? setTimeout(start, 500) : (end(), undefined)

    return () => {
      clearTimeout(timer)
      io.disconnect()
      mo.disconnect()
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(INSPECT_EVENT, replay)
    }
  }, [])

  const active = busy > 0
  return (
    <>
      <div ref={layer} aria-hidden className="pointer-events-none absolute top-0 left-0 z-[60] h-0 w-full" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
        <Rulers visible={active} />
        <div
          className="absolute bottom-6 left-1/2 flex items-center gap-2 rounded-full border bg-background/85 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-300"
          style={{ opacity: active ? 1 : 0, transform: `translate(-50%, ${active ? 0 : 8}px)` }}
        >
          <span className="size-1.5 animate-pulse rounded-full bg-link" />
          <span className="text-foreground">Inspecting</span>
          <span>·</span>
          <span>{busy} {busy === 1 ? "agent" : "agents"}</span>
          <span>·</span>
          <span className="tabular-nums">
            {status.done}/{status.total} layers
          </span>
          <span className="ml-1 rounded border px-1 text-[10px] max-sm:hidden">esc</span>
        </div>
      </div>
    </>
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

function makeBox(x: number, y: number, w: number, h: number, label: string, color: string) {
  const el = document.createElement("div")
  el.className = "absolute"
  Object.assign(el.style, {
    left: `${x - 2}px`,
    top: `${y - 2}px`,
    width: `${w + 4}px`,
    height: `${h + 4}px`,
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
      ${label} <span style="opacity:.75">${Math.round(w)} × ${Math.round(h)}</span>
    </span>`
  return el
}
