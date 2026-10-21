"use client"

import { useRef, useState } from "react"

/** Shows a cell's `data-tip` text in a bubble above it on hover or tap. */
export function GraphTooltip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)

  function show(e: React.PointerEvent) {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]")
    const box = ref.current?.getBoundingClientRect()
    if (!cell || !box) return setTip(null)
    const r = cell.getBoundingClientRect()
    setTip({ text: cell.dataset.tip!, x: r.left + r.width / 2 - box.left, y: r.top - box.top })
  }

  return (
    <div ref={ref} className="relative" onPointerOver={show} onPointerLeave={() => setTip(null)}>
      {children}
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full pb-2"
          style={{ left: tip.x, top: tip.y }}
        >
          <div className="relative rounded-xl bg-foreground px-3.5 py-2 text-sm whitespace-nowrap text-background shadow-lg">
            {tip.text}
            <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
