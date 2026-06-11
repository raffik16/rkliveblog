'use client'

import { useEffect, useState } from 'react'

export type HeaderTarget = { x: number; y: number; w: number; h: number }

export function useHeaderTarget(): HeaderTarget | null {
  const [target, setTarget] = useState<HeaderTarget | null>(null)

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector<SVGElement>('header a[href="/"] svg')
      if (!el) return
      const r = el.getBoundingClientRect()
      setTarget({ x: r.left, y: r.top, w: r.width, h: r.height })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [])

  return target
}
