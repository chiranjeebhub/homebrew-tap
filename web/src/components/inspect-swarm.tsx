"use client"

import { useEffect, useRef, useState } from "react"

import { Monogram } from "./monogram"

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

// Extra unnamed cursors that only join the opening flock.
const FLOCK_COLORS = ["#f43f5e", "#38bdf8", "#a3e635", "#fb923c", "#e879f9", "#2dd4bf", "#facc15", "#818cf8"]

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
  const [logo, setLogo] = useState(false)
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
    let gated = false // true while the opening flock plays; cursors wait to be sent out
    let crewFromFlock = new Map<string, Cursor>() // named cursors left off screen by the flock, reused for work
    let flock: Flock | null = null // cursors gathering to leave together

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
      pump()
    }

    function pump() {
      if (gated || ended) return
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
      let cursor = crewFromFlock.get(agent.name)
      crewFromFlock.delete(agent.name)
      if (!cursor) {
        cursor = new Cursor(root, agent.color, agent.name)
        const first = queue[0]?.getBoundingClientRect()
        const y0 = window.scrollY + (first ? first.top : window.innerHeight / 2) + (Math.random() - 0.5) * 200
        cursor.jump(Math.random() < 0.5 ? -40 : window.innerWidth + 40, y0)
        await sleep(30 + Math.random() * 200)
      }

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
        cursor.move(x, y, 480)
        await sleep(520)
        if (ended) break
        // Name tag only once it has landed upright, not while it is still flying in turned.
        cursor.label(true)
        const box = makeBox(x, y, r.width, r.height, label(el), agent.color)
        root.appendChild(box)
        // Drag out the selection: the cursor travels to the far corner as the box grows and the element wipes in.
        const c = cursor
        requestAnimationFrame(() => {
          box.style.clipPath = "inset(-6px -200px -32px -200px)"
          reveal(el, 460)
          c.move(x + r.width, y + r.height, 460)
        })
        await sleep(500)
        box.querySelector<HTMLElement>("[data-tag]")!.style.opacity = "1"
        finish(el)
        await sleep(320)
        box.style.opacity = "0.35"
        box.style.background = "transparent"
        setTimeout(() => box.remove(), 1400)
      }

      await leaveTogether(cursor)
      working.delete(agent.name)
      setBusy(working.size)
    }

    /*
      Exit: idle cursors regroup at the right of the screen, wait for the rest of the crew (or a moment),
      swirl once as a flock and stream off the top-right corner together.
    */
    async function leaveTogether(cursor: Cursor) {
      cursor.label(false)
      if (!flock) {
        let resolve!: () => void
        const f: Flock = {
          members: [],
          rally: { x: window.scrollX + window.innerWidth - 140, y: window.scrollY + window.innerHeight * 0.38 },
          released: new Promise<void>((r) => (resolve = r)),
          release: () => {
            if (flock === f) flock = null
            if (f.gone) return
            f.gone = true
            resolve()
            flyOff(f.members, f.rally)
          },
        }
        flock = f
        setTimeout(f.release, 1500)
      }
      const f = flock
      cursor.move(f.rally.x + (Math.random() - 0.5) * 60, f.rally.y + (Math.random() - 0.5) * 60, 520, true)
      f.members.push(cursor)
      if (f.members.length >= working.size) f.release()
      await f.released
      await sleep(1700)
    }

    async function flyOff(group: Cursor[], c: { x: number; y: number }) {
      await sleep(450)
      await swirl(group, c.x, c.y, 650, 26, 58)
      group.forEach((cur, i) => {
        setTimeout(() => {
          cur.move(window.scrollX + window.innerWidth + 120, window.scrollY - 140 + i * 22, 700, true, "cubic-bezier(0.5, 0, 0.9, 0.5)")
          setTimeout(() => cur.remove(), 900)
        }, i * 55)
      })
    }

    /*
      Entrance: a flock of cursors circles the CJ logo in the middle of the empty page, then bursts out to
      the edges. The named ones stay just off screen and come back in to start building.
    */
    async function openingFlock() {
      const root = layer.current
      if (!root) return
      gated = true
      setLogo(true)
      const cx = window.scrollX + window.innerWidth / 2
      const cy = window.scrollY + window.innerHeight / 2
      const named = AGENTS.map((a) => new Cursor(root, a.color, a.name))
      const extras = Array.from({ length: window.innerWidth < 640 ? 8 : 16 }, (_, i) => new Cursor(root, FLOCK_COLORS[i % FLOCK_COLORS.length]))
      const all = [...named, ...extras].sort(() => Math.random() - 0.5)
      await swirl(all, cx, cy, 1900, 54, 150, true)

      // Burst outwards along each cursor's heading.
      const far = Math.hypot(window.innerWidth, window.innerHeight) * 0.65
      all.forEach((cur, i) => {
        const a = Math.atan2(cur.y - cy, cur.x - cx) + 0.5
        setTimeout(() => cur.move(cx + Math.cos(a) * far, cy + Math.sin(a) * far, 650, true, "cubic-bezier(0.55, 0, 0.9, 0.45)"), i * 12)
      })
      setLogo(false)
      await sleep(750)
      extras.forEach((e) => e.remove())
      named.forEach((n, i) => crewFromFlock.set(AGENTS[i].name, n))
      gated = false
      pump()
      // Any named cursor not needed now just stays out of sight.
      await sleep(1500)
      crewFromFlock.forEach((c) => c.remove())
      crewFromFlock = new Map()
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
      openingFlock()
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
          className="absolute top-1/2 left-1/2 flex size-16 items-center justify-center rounded-2xl border bg-surface text-foreground shadow-lg transition-all duration-500"
          style={{ opacity: logo ? 1 : 0, transform: `translate(-50%, -50%) scale(${logo ? 1 : 0.6})` }}
        >
          <Monogram className="h-4 w-7" />
        </div>
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

type Flock = {
  members: Cursor[]
  rally: { x: number; y: number }
  released: Promise<void>
  release: () => void
  gone?: boolean
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

/**
  A multiplayer-style cursor, optionally with a name tag. Three faded copies follow it a beat behind,
  which reads as a motion trail when it moves fast. With `turn`, it points the way it travels, like a
  bird in the flock; otherwise it stays upright like a normal pointer.
*/
class Cursor {
  x = 0
  y = 0
  private parts: HTMLElement[]
  private tag?: HTMLElement

  constructor(root: HTMLElement, color: string, name?: string) {
    const size = name ? 18 : 14
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 18 18" style="display:block;filter:drop-shadow(0 1px 2px rgb(0 0 0 / .35))"><path d="M2 1.5 L16 7.6 L9.6 9.4 L7.2 16 Z" fill="${color}" stroke="white" stroke-width="1.4" stroke-linejoin="round"/></svg>`
    this.parts = [0, 1, 2, 3].map((k) => {
      const el = document.createElement("div")
      el.className = "absolute top-0 left-0 will-change-transform"
      el.style.transformOrigin = "2px 1.5px"
      el.style.opacity = String([1, 0.4, 0.22, 0.1][k])
      el.innerHTML = svg
      root.appendChild(el)
      return el
    })
    if (name) {
      this.tag = document.createElement("span")
      this.tag.className =
        "absolute top-4 left-3.5 rounded-full px-1.5 py-px font-sans text-[11px] font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-200"
      this.tag.style.background = color
      this.tag.style.opacity = "0"
      this.tag.textContent = name
      this.parts[0].appendChild(this.tag)
    }
    // The trail sits behind the cursor.
    this.parts.slice(1).forEach((p) => root.insertBefore(p, this.parts[0]))
  }

  label(on: boolean) {
    if (this.tag) this.tag.style.opacity = on ? "1" : "0"
  }

  /** Puts it somewhere at once. */
  jump(x: number, y: number, angle = 0) {
    this.x = x
    this.y = y
    for (const p of this.parts) {
      p.style.transition = "none"
      p.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`
    }
  }

  /** Glides somewhere, the trail following a little later. */
  move(x: number, y: number, ms: number, turn = false, curve = ease) {
    const angle = turn ? heading(x - this.x, y - this.y) : 0
    this.x = x
    this.y = y
    this.parts.forEach((p, k) => {
      p.style.transition = `transform ${ms}ms ${curve} ${k * 30}ms`
      p.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`
    })
  }

  /** Sets the cursor and each trail copy to its own point, for frame-by-frame motion. */
  frame(points: { x: number; y: number; angle: number }[]) {
    this.x = points[0].x
    this.y = points[0].y
    this.parts.forEach((p, k) => {
      const pt = points[k] ?? points[points.length - 1]
      p.style.transition = "none"
      p.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${pt.angle}deg)`
    })
  }

  remove() {
    this.parts.forEach((p) => p.remove())
  }
}

/** Rotation that makes the arrow (which points up and left at rest) face along (dx, dy). */
function heading(dx: number, dy: number) {
  if (Math.abs(dx) + Math.abs(dy) < 1) return 0
  return (Math.atan2(dy, dx) * 180) / Math.PI + 135
}

/**
  Flies cursors round a point together for `ms`, each on its own slightly wobbly ellipse, facing the way
  it moves. With `fadeIn` they spiral in from further out.
*/
function swirl(cursors: Cursor[], cx: number, cy: number, ms: number, rMin: number, rMax: number, fadeIn = false) {
  const birds = cursors.map(() => ({
    a0: Math.random() * Math.PI * 2,
    w: 2.6 + Math.random() * 1.6,
    r: rMin + Math.random() * (rMax - rMin),
    wob: Math.random() * Math.PI * 2,
  }))
  const pos = (b: (typeof birds)[number], t: number, enter: number) => {
    const a = b.a0 + b.w * t
    const r = (b.r + 10 * Math.sin(b.wob + t * 5)) * (1 + 2.5 * enter)
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.72, a }
  }
  const t0 = performance.now()
  return new Promise<void>((done) => {
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const enter = fadeIn ? Math.max(0, 1 - t / 0.7) ** 2 : 0
      cursors.forEach((c, i) => {
        const b = birds[i]
        c.frame(
          [0, 0.03, 0.06, 0.09].map((lag) => {
            const p = pos(b, Math.max(0, t - lag), fadeIn ? Math.max(0, 1 - Math.max(0, t - lag) / 0.7) ** 2 : 0)
            const q = pos(b, Math.max(0, t - lag) + 0.01, enter)
            return { x: p.x, y: p.y, angle: heading(q.x - p.x, q.y - p.y) }
          }),
        )
      })
      if (now - t0 < ms) requestAnimationFrame(tick)
      else done()
    }
    requestAnimationFrame(tick)
  })
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
