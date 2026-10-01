'use client'

/* eslint-disable @next/next/no-img-element */
import { ReactNode, useEffect, useRef, useState } from 'react'

const thumb = (id: string, w: number) => `https://lh3.googleusercontent.com/d/${id}=w${w}`
const download = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`

type Label = { id: string; name: string }

async function api(body?: object): Promise<Label[]> {
  const res = await fetch('/api/dop-labels', body && { method: 'POST', body: JSON.stringify(body) })
  return res.ok ? res.json() : []
}

// Fires `fn` after holding a pointer down for 600ms
function longPress(fn: () => void) {
  let t: ReturnType<typeof setTimeout>
  return {
    onPointerDown: () => (t = setTimeout(fn, 600)),
    onPointerUp: () => clearTimeout(t),
    onPointerLeave: () => clearTimeout(t),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  }
}

export default function Gallery({ ids, children }: { ids: string[]; children: ReactNode }) {
  const [labels, setLabels] = useState<Label[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [newName, setNewName] = useState('')
  const [removing, setRemoving] = useState(false)
  const touchX = useRef(0)

  useEffect(() => {
    api().then(setLabels)
  }, [])

  const counts = new Map<string, number>()
  // Skip labels on photos since removed from the Drive folder
  labels
    .filter((l) => ids.includes(l.id))
    .forEach((l) => counts.set(l.name, (counts.get(l.name) ?? 0) + 1))
  const names = [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!)

  const shown = filter
    ? ids.filter((id) => labels.some((l) => l.id === id && l.name === filter))
    : ids
  const cur = open === null ? undefined : shown[open]
  const curNames = labels.filter((l) => l.id === cur).map((l) => l.name)

  const step = (d: number) =>
    setOpen((i) => (i === null ? i : (i + d + shown.length) % shown.length))

  useEffect(() => {
    if (!cur) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
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

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-sm ${
      active
        ? 'bg-primary-500 text-white'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }`

  return (
    <>
      {names.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => setFilter(null)} className={chip(filter === null)}>
            Alla ({ids.length})
          </button>
          {names.map((n) => (
            <button key={n} onClick={() => setFilter(n)} className={chip(filter === n)}>
              {n} ({counts.get(n)})
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {shown.map((id, i) => (
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

      {children}

      {names.length > 0 && (
        <div className="pt-8 text-sm text-gray-500 dark:text-gray-400">
          {!removing ? (
            <button onClick={() => setRemoving(true)} className="underline">
              Jag vill ta bort ett namn
            </button>
          ) : (
            <div className="space-y-3">
              <p>Välj namnet som ska tas bort från alla bilder:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {names.map((n) => (
                  <button
                    key={n}
                    className={chip(false)}
                    onClick={async () => {
                      if (!confirm(`Är du säker? "${n}" tas bort från alla bilder, för alla.`))
                        return
                      setLabels(await api({ action: 'removeAll', name: n }))
                      if (filter === n) setFilter(null)
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button onClick={() => setRemoving(false)} className="underline">
                Avbryt
              </button>
            </div>
          )}
        </div>
      )}

      {cur && open !== null && (
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
              {open + 1} / {shown.length}
            </span>
            <button onClick={() => setOpen(null)} className="px-2 text-3xl" aria-label="Stäng">
              ×
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <img
              key={cur}
              src={thumb(cur, 2000)}
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
          <div className="space-y-3 p-4 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {curNames.map((n) => (
                <span
                  key={n}
                  className="rounded-full bg-white/20 px-3 py-1 text-sm select-none [-webkit-touch-callout:none]"
                  {...longPress(async () => {
                    if (!confirm(`Vill du ta bort "${n}" från den här bilden?`)) return
                    setLabels(await api({ action: 'remove', id: cur, name: n }))
                  })}
                >
                  {n}
                </span>
              ))}
            </div>
            {curNames.length > 0 && (
              <p className="text-xs text-white/60">Håll inne på ett namn för att ta bort det</p>
            )}
            <form
              className="flex justify-center gap-2"
              onSubmit={async (e) => {
                e.preventDefault()
                if (!newName.trim()) return
                setLabels(await api({ action: 'add', id: cur, name: newName }))
                setNewName('')
              }}
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                list="dop-names"
                placeholder="Vem är med?"
                maxLength={40}
                className="w-48 rounded-md px-3 py-2 text-base text-black"
              />
              <datalist id="dop-names">
                {names.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
              <button className="rounded-md bg-white/20 px-3 py-2">Lägg till</button>
            </form>
            <a
              href={download(cur)}
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
