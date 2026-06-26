"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Character {
  char: string
  x: number
  y: number
  speed: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: any[]
  frame: number
  frameRequest: number
  resolve: (value?: void) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = 'SYNCXYZ01'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => (this.resolve = resolve))
    this.queue = []

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 20)
      const end = start + Math.floor(Math.random() * 20)
      this.queue.push({ from, to, start, end })
    }

    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i]

      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.2) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }

    this.el.innerHTML = output

    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

const ScrambledText = () => {
  const ref = useRef<HTMLHeadingElement>(null)
  const scrambler = useRef<TextScramble | null>(null)

  useEffect(() => {
    if (ref.current && !scrambler.current) {
      scrambler.current = new TextScramble(ref.current)

      const phrases = [
        "SYNCTY",
        "MADE BY MACHINE, DESIGNED BY MIND",
        "POST-PHOTOGRAPHY CLUB",
        "CURATED CHAOS",
        "SYNTHETIC APPAREL CORP",
        "VISUALLY DRIVEN, AI POWERED",
        "NOT HUMAN. NOT RANDOM.",
        "IMAGE IS THE NEW REALITY",
        "WE DON'T SHOOT. WE GENERATE.",
        "DESIGNED FOR NO ONE. WORN BY FEW.",
      ]

      let i = 0
      const next = () => {
        scrambler.current?.setText(phrases[i]).then(() => {
          setTimeout(next, 1800)
        })
        i = (i + 1) % phrases.length
      }

      next()
    }
  }, [])

  return (
    <h1
      ref={ref}
      className="text-black text-xl tracking-widest text-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      SYNCTY
    </h1>
  )
}

export default function SynctyHero() {
  const [characters, setCharacters] = useState<Character[]>([])

  const createCharacters = useCallback(() => {
    const allChars = "SYNCXYZ01"
    const charCount = 80
    const newChars: Character[] = []

    for (let i = 0; i < charCount; i++) {
      newChars.push({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.03 + Math.random() * 0.07,
      })
    }

    return newChars
  }, [])

  useEffect(() => {
    setCharacters(createCharacters())
  }, [createCharacters])

  useEffect(() => {
    let frame: number

    const animate = () => {
      setCharacters((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y + c.speed,
          ...(c.y >= 100 && {
            y: -5,
            x: Math.random() * 100,
          }),
        }))
      )
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      
      {/* CENTER LOGO */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="text-black text-[120px] font-bold">Y</div>
        <div className="w-2 h-2 bg-black rounded-full my-2"></div>
        <div className="text-black tracking-[0.6em] text-xs">XYZ</div>

        <div className="mt-6">
          <ScrambledText />
        </div>
      </div>

      {/* BACKGROUND SIGNAL */}
      {characters.map((c, i) => (
        <span
          key={i}
          className="absolute text-black/20 text-sm"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {c.char}
        </span>
      ))}

      {/* FOOTER */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center text-center text-xs text-black tracking-wide">
        <p>
          Contact:{" "}
          <a
            href="mailto:hello@syncty.xyz"
            className="text-black underline-offset-2 hover:underline"
          >
            hello@syncty.xyz
          </a>
        </p>
        <p className="mt-2">© 2026 SYNCTY. Powered by StefnaXYZ.</p>
      </div>

      <style jsx global>{`
        .dud {
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}
