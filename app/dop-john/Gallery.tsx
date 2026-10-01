'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'

const thumb = (id: string, w: number) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
const download = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`

export default function Gallery({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const touchX = useRef(0)

  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + ids.length) % ids.length))

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  })

  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {ids.map((id, i) => (
          <button key={id} onClick={() => setOpen(i)} className="aspect-square overflow-hidden">
            <img
              src={thumb(id, 400)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed top-0 left-0 z-50 flex h-dvh w-full flex-col bg-black text-white"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
          }}
        >
          <div className="flex items-center justify-between p-4 text-lg">
            <span>
              {open + 1} / {ids.length}
            </span>
            <button onClick={() => setOpen(null)} className="px-2 text-3xl" aria-label="Stäng">
              ×
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <img
              key={ids[open]}
              src={thumb(ids[open], 2000)}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={() => step(-1)}
              className="absolute top-0 left-0 h-full w-1/5 text-4xl"
              aria-label="Föregående"
            >
              ‹
            </button>
            <button
              onClick={() => step(1)}
              className="absolute top-0 right-0 h-full w-1/5 text-4xl"
              aria-label="Nästa"
            >
              ›
            </button>
          </div>
          <div className="p-4 text-center">
            <a
              href={download(ids[open])}
              className="bg-primary-500 inline-block rounded-md px-6 py-3 text-lg font-medium"
            >
              Ladda ner bilden
            </a>
          </div>
        </div>
      )}
    </>
  )
}
