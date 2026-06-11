'use client'

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import LogoSvg from '@/data/logo.svg'
import { useHeaderTarget } from './useHeaderTarget'

const TITLE = 'rkRanched'
const LETTERS = TITLE.split('')
const INTRO_LOGO_HEIGHT = 112
const INTRO_LOGO_WIDTH = (INTRO_LOGO_HEIGHT * 53.87) / 43.61
const INTRO_TITLE_PX = 56
const INTRO_GAP = 18

const SLANT_HIDDEN = 'polygon(-20% 100%, -20% 100%, 0% 100%, 0% 100%)'
const SLANT_VISIBLE = 'polygon(-20% 100%, 20% 0%, 120% 0%, 80% 100%)'

type Props = { playId: number; onDone: () => void }

export default function Example2({ playId, onDone }: Props) {
  const target = useHeaderTarget()
  const wrap = useAnimationControls()
  const logoBox = useAnimationControls()
  const logoClip = useAnimationControls()
  const letters = useAnimationControls()
  const titleBox = useAnimationControls()

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
        logoBox.set({ width: INTRO_LOGO_WIDTH, height: INTRO_LOGO_HEIGHT }),
        logoClip.set({ clipPath: SLANT_HIDDEN }),
        titleBox.set({ fontSize: INTRO_TITLE_PX, marginLeft: INTRO_GAP }),
        letters.set('hidden'),
      ])

      if (cancelled) return
      await logoClip.start({
        clipPath: SLANT_VISIBLE,
        transition: { duration: 0.65, ease: [0.65, 0, 0.35, 1] },
      })

      if (cancelled) return
      await letters.start('visible')

      if (cancelled) return
      await new Promise((r) => setTimeout(r, 250))
      if (cancelled) return

      await Promise.all([
        wrap.start({
          x: target.x,
          y: target.y,
          transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] },
        }),
        logoBox.start({
          width: target.w,
          height: target.h,
          transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] },
        }),
        titleBox.start({
          fontSize: 24,
          marginLeft: 12,
          transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] },
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
  }, [playId, target, wrap, logoBox, logoClip, titleBox, letters, onDone])

  return (
    <motion.div
      animate={wrap}
      initial={{ opacity: 0 }}
      className="pointer-events-none fixed top-0 left-0 z-[60] flex items-center"
    >
      <motion.div
        animate={logoBox}
        className="relative shrink-0"
        style={{ width: INTRO_LOGO_WIDTH, height: INTRO_LOGO_HEIGHT }}
      >
        <motion.div animate={logoClip} className="absolute inset-0">
          <LogoSvg style={{ width: '100%', height: '100%' }} />
        </motion.div>
      </motion.div>
      <motion.div
        animate={titleBox}
        initial="hidden"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="font-semibold whitespace-nowrap text-gray-900 dark:text-white"
      >
        <motion.span
          animate={letters}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="inline-flex"
        >
          {LETTERS.map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { clipPath: SLANT_HIDDEN },
                visible: {
                  clipPath: SLANT_VISIBLE,
                  transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] },
                },
              }}
              className="inline-block"
              style={{ willChange: 'clip-path' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
