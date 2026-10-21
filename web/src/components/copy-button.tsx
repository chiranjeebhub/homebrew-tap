"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard refused (insecure context or permissions): the command is still selectable.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
      aria-label={copied ? "Copied" : "Copy command"}
    >
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
    </button>
  )
}

/** A one-line shell command with a copy button. */
export function Command({ value, className }: { value: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-lg border bg-surface py-1 pr-1 pl-3 font-mono text-sm",
        className,
      )}
    >
      <span className="text-muted-foreground select-none" aria-hidden>
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">{value}</code>
      <CopyButton value={value} />
    </div>
  )
}
