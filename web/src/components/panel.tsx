import { cn } from "@/lib/utils"

/** A section of the column. `screenLines` sets which of its edge lines run the full width of the screen;
 *  the others stay inside the column. */
export function Panel({
  className,
  screenLines = "both",
  ...props
}: React.ComponentProps<"section"> & { screenLines?: "both" | "top" | "none" }) {
  return (
    <section
      className={cn(
        "border-x border-dashed border-line",
        screenLines !== "none" && "screen-line-top",
        screenLines === "both" && "screen-line-bottom",
        className,
      )}
      {...props}
    />
  )
}

export function PanelHeader({ className, children, ...props }: React.ComponentProps<"header">) {
  return (
    <header className={cn("screen-line-bottom relative border-y border-line bg-background px-4 py-3", className)} {...props}>
      {/* Stripes in the gutters on either side of the title row. The header's own background hides them in the column. */}
      <div className="diagonal-stripes absolute inset-y-0 left-[-100vw] -z-1 w-[200vw]" aria-hidden />
      {children}
    </header>
  )
}

export function PanelTitle({
  className,
  id,
  count,
  children,
}: {
  className?: string
  id?: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <h2 className={cn("text-3xl font-medium tracking-tight text-balance", className)}>
      {id ? <a href={`#${id}`}>{children}</a> : children}
      {count !== undefined && (
        <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">({count})</sup>
      )}
    </h2>
  )
}

export function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />
}

/** Small framed square for a leading icon. */
export function IconTile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md select-none",
        "border border-muted-foreground/15 bg-muted text-muted-foreground",
        "ring-1 ring-border/50 ring-offset-1 ring-offset-background dark:ring-line",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

export function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground dark:bg-zinc-900",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  )
}

/** Outline button used across the site, as a link. */
export function ButtonLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-accent",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      target="_blank"
      rel="noopener"
      {...props}
    />
  )
}
