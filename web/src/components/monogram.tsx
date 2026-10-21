import { cn } from "@/lib/utils"

// "CJ" drawn on a 9×5 pixel grid: "#" is a filled square.
const ROWS = [
  ".###..###", //
  "#.......#",
  "#.......#",
  "#....#..#",
  ".###..##.",
]

/** Pixel-art "CJ" monogram. Uses the current text colour. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 5" className={cn("h-5 w-9 fill-current", className)} shapeRendering="crispEdges" aria-hidden>
      {ROWS.flatMap((row, y) =>
        [...row].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  )
}
