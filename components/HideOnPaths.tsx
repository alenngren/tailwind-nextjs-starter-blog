'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

// Unlisted pages that shouldn't show site nav/footer
const HIDDEN_PATHS = ['/dop-john']

export default function HideOnPaths({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (HIDDEN_PATHS.includes(pathname)) return null
  return <>{children}</>
}
