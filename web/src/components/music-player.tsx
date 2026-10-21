"use client"

import { useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type Track = { title: string; artist: string; src: string[] }

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const track = tracks[index]

  // A new track keeps playing if the previous one was.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (playing) audio.play().catch(() => setPlaying(false))
  }, [index])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().then(() => setPlaying(true), () => setPlaying(false))
    else {
      audio.pause()
      setPlaying(false)
    }
  }

  function skip(step: number) {
    setTime(0)
    setIndex((i) => (i + step + tracks.length) % tracks.length)
  }

  const progress = duration ? (time / duration) * 100 : 0

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
      <div className="relative size-36 shrink-0 sm:size-40" aria-hidden>
        <div
          className="vinyl size-full rounded-full shadow-[0_10px_30px_-8px_rgb(0_0_0/0.6)] ring-1 ring-white/5"
          style={{ animationPlayState: playing ? "running" : "paused" }}
        >
          <div className="absolute inset-[37%] rounded-full bg-[#232326]" />
          <div className="absolute inset-[47%] rounded-full bg-zinc-200" />
        </div>
        {/* Tonearm, pivoting from the top right; it swings onto the record while playing. */}
        <div
          className={cn(
            "absolute -top-1 right-0 h-[62%] w-1 origin-top transition-transform duration-500",
            playing ? "rotate-[30deg]" : "rotate-[18deg]"
          )}
        >
          <span className="absolute -top-1.5 -left-1.5 size-4 rounded-full border-2 border-zinc-400 bg-zinc-600" />
          <span className="block h-full w-full rounded-full bg-gradient-to-b from-zinc-300 to-zinc-500" />
          <span className="absolute -bottom-1 -left-0.5 h-2.5 w-2 rounded-sm bg-zinc-300" />
        </div>
      </div>

      <div className="min-w-0 flex-1 basis-72 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {playing ? "Now playing" : "Paused"}
            </p>
            <p className="truncate text-xl font-medium">{track.title}</p>
            <p className="truncate font-mono text-sm text-muted-foreground">{track.artist}</p>
          </div>

          <div className="flex items-center gap-3">
            {tracks.length > 1 && (
              <button
                type="button"
                onClick={() => skip(-1)}
                className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Previous track"
              >
                <SkipBackIcon className="size-5 fill-current" />
              </button>
            )}
            <button
              type="button"
              onClick={toggle}
              className="flex size-14 items-center justify-center rounded-full border border-foreground/30 transition-colors hover:border-foreground hover:bg-accent"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <PauseIcon className="size-5 fill-current" /> : <PlayIcon className="ml-0.5 size-5 fill-current" />}
            </button>
            {tracks.length > 1 && (
              <button
                type="button"
                onClick={() => skip(1)}
                className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Next track"
              >
                <SkipForwardIcon className="size-5 fill-current" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative h-1 rounded-full bg-muted">
            <div className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: `${progress}%` }} />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={time}
              onChange={(e) => {
                const audio = audioRef.current
                if (audio) audio.currentTime = Number(e.target.value)
              }}
              className="absolute inset-x-0 -top-2 h-5 w-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-muted-foreground tabular-nums">
            <span>{formatTime(time)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => (tracks.length > 1 ? skip(1) : setPlaying(false))}
      >
        {track.src.map((src) => (
          <source key={src} src={src} />
        ))}
      </audio>
    </div>
  )
}
