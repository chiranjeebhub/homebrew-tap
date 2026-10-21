"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function FlipSentences({ sentences, className }: { sentences: string[]; className?: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (sentences.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % sentences.length), 3000)
    return () => clearInterval(id)
  }, [sentences.length])

  return (
    <div className={cn("overflow-hidden", className)}>
      <p key={index} className="animate-flip-in font-mono text-sm text-balance text-muted-foreground">
        {sentences[index]}
      </p>
    </div>
  )
}
