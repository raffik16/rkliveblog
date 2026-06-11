'use client'

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import LogoSvg from '@/data/logo.svg'
import { useHeaderTarget } from './useHeaderTarget'

const TITLE = 'rkRanched'
const INTRO_LOGO_HEIGHT = 96
const INTRO_LOGO_WIDTH = (INTRO_LOGO_HEIGHT * 53.87) / 43.61
const INTRO_TITLE_PX = 48
const INTRO_GAP = 16

type Props = { playId: number; onDone: () => void }

export default function Example1({ playId, onDone }: Props) {
  const target = useHeaderTarget()
  const wrap = useAnimationControls()
  const logo = useAnimationControls()
  const title = useAnimationControls()

  useEffect(() => {
    if (!target) return
    let cancelled = false

    const titleApprox = TITLE.length * INTRO_TITLE_PX * 0.55
    const totalWidth = INTRO_LOGO_WIDTH + INTRO_GAP + titleApprox
    const center = {
      x: window.innerWidth / 2 - totalWidth / 2,
      y: window.innerHeight / 2 - INTRO_LOGO_HEIGHT / 2,
    }

    const run = async () => {
      document.body.classList.add('logo-intro-playing')

      await Promise.all([
        wrap.set({ x: center.x, y: center.y, opacity: 1 }),
        logo.set({ scale: 0, opacity: 0, width: INTRO_LOGO_WIDTH, height: INTRO_LOGO_HEIGHT }),
        title.set({ opacity: 0, y: 16, fontSize: INTRO_TITLE_PX, marginLeft: INTRO_GAP }),
      ])

      if (cancelled) return
      await logo.start({
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 220, damping: 18 },
      })
      if (cancelled) return
      await title.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      })

      if (cancelled) return
      await new Promise((r) => setTimeout(r, 350))
      if (cancelled) return

      await Promise.all([
        wrap.start({
          x: target.x,
          y: target.y,
          transition: { duration: 0.85, ease: [0.7, 0, 0.3, 1] },
        }),
        logo.start({
          width: target.w,
          height: target.h,
          transition: { duration: 0.85, ease: [0.7, 0, 0.3, 1] },
        }),
        title.start({
          fontSize: 24,
          marginLeft: 12,
          transition: { duration: 0.85, ease: [0.7, 0, 0.3, 1] },
        }),
      ])

      if (cancelled) return
      await wrap.start({ opacity: 0, transition: { duration: 0.25, delay: 0.1 } })
      document.body.classList.remove('logo-intro-playing')
      onDone()
    }

    run()
    return () => {
      cancelled = true
      document.body.classList.remove('logo-intro-playing')
    }
  }, [playId, target, wrap, logo, title, onDone])

  return (
    <motion.div
      animate={wrap}
      initial={{ opacity: 0 }}
      className="pointer-events-none fixed top-0 left-0 z-[60] flex items-center"
    >
      <motion.div animate={logo} className="shrink-0">
        <LogoSvg style={{ width: '100%', height: '100%' }} />
      </motion.div>
      <motion.span
        animate={title}
        className="font-semibold whitespace-nowrap text-gray-900 dark:text-white"
      >
        {TITLE}
      </motion.span>
    </motion.div>
  )
}
