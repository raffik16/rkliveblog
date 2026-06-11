'use client'

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

const TITLE = 'rkRanched'
const LETTERS = TITLE.split('')
const LOGO_W = 168
const LOGO_H = 136

type Props = { playId: number; onDone: () => void }

export default function Example3({ playId, onDone }: Props) {
  const overlay = useAnimationControls()
  const ripple = useAnimationControls()
  const shapes = useAnimationControls()
  const letters = useAnimationControls()

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      document.body.classList.add('logo-intro-playing')
      await Promise.all([
        overlay.set({ opacity: 1 }),
        ripple.set({ scale: 0, opacity: 0.35 }),
        shapes.set('hidden'),
        letters.set('hidden'),
      ])

      if (cancelled) return
      await shapes.start('visible')

      if (cancelled) return
      ripple.start({
        scale: 6,
        opacity: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
      })

      if (cancelled) return
      await letters.start('visible')

      if (cancelled) return
      await new Promise((r) => setTimeout(r, 700))
      if (cancelled) return

      await overlay.start({ opacity: 0, transition: { duration: 0.45 } })
      document.body.classList.remove('logo-intro-playing')
      onDone()
    }

    run()
    return () => {
      cancelled = true
      document.body.classList.remove('logo-intro-playing')
    }
  }, [playId, overlay, ripple, shapes, letters, onDone])

  return (
    <motion.div
      animate={overlay}
      initial={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-white"
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: LOGO_W, height: LOGO_H }}
      >
        <motion.div
          animate={ripple}
          className="absolute h-16 w-16 rounded-full border-2 border-black"
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.svg
          viewBox="344.5639097744361 330.27819548872174 111.73684210526318 91.21804511278197"
          width={LOGO_W}
          height={LOGO_H}
          animate={shapes}
          initial="hidden"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
          }}
        >
          {[
            '453.3,331.28 453.3,359.85 388.64,418.5 388.64,388.42',
            '410.23,331.28 410.23,359.85 345.56,418.5 345.56,388.42',
          ].map((points, i) => (
            <motion.polygon
              key={i}
              points={points}
              fill="#000"
              variants={{
                hidden: { scale: 1.5, opacity: 0, rotate: i === 0 ? 10 : -10 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  transition: { type: 'spring', stiffness: 260, damping: 16 },
                },
              }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}
        </motion.svg>
      </div>

      <motion.div
        animate={letters}
        initial="hidden"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="flex font-mono text-4xl font-bold tracking-tight text-black"
      >
        {LETTERS.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { y: -60, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { type: 'spring', stiffness: 420, damping: 18 },
              },
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}
