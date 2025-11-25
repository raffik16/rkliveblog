'use client'

import { motion, Variants, Variant, useInView } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface HoverWordsProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  className?: string
  wordClassName?: string
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'color' | 'bounce'
  animateOnView?: boolean
  entranceEffect?: 'fadeUp' | 'fadeIn' | 'slideIn' | 'blur' | 'wave'
  staggerDelay?: number
  children?: ReactNode
}

const hoverVariants: Record<string, Variants> = {
  lift: {
    initial: { y: 0 },
    hover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' as const } },
  },
  scale: {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2, ease: 'easeOut' as const } },
  },
  glow: {
    initial: { textShadow: '0 0 0px transparent' },
    hover: {
      textShadow: '0 0 20px currentColor',
      transition: { duration: 0.2, ease: 'easeOut' as const },
    },
  },
  color: {
    initial: { color: 'inherit' },
    hover: { color: '#FF5B04', transition: { duration: 0.2, ease: 'easeOut' as const } },
  },
  bounce: {
    initial: { y: 0 },
    hover: {
      y: [0, -6, 0],
      transition: { duration: 0.4, ease: 'easeInOut' as const },
    },
  },
}

const entranceVariants: Record<string, { hidden: Variant; visible: Variant }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  wave: {
    hidden: { opacity: 0, y: 20, rotateX: 90 },
    visible: { opacity: 1, y: 0, rotateX: 0 },
  },
}

export default function HoverWords({
  text,
  as: Component = 'span',
  className = '',
  wordClassName = '',
  hoverEffect = 'lift',
  animateOnView = false,
  entranceEffect = 'fadeUp',
  staggerDelay = 0.05,
}: HoverWordsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')
  const hoverVar = hoverVariants[hoverEffect]
  const entranceVar = entranceVariants[entranceEffect]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: entranceVar.hidden,
    visible: {
      ...entranceVar.visible,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    hover: hoverVar.hover,
  }

  if (!animateOnView) {
    return (
      <Component className={`${className}`}>
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className={`inline-block cursor-default ${wordClassName}`}
            initial="initial"
            whileHover="hover"
            variants={hoverVar}
          >
            {word}
            {index < words.length - 1 && <span>&nbsp;</span>}
          </motion.span>
        ))}
      </Component>
    )
  }

  return (
    <motion.span
      ref={ref}
      className={`${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={`inline-block cursor-default ${wordClassName}`}
          variants={wordVariants}
          whileHover="hover"
          style={{ perspective: entranceEffect === 'wave' ? '1000px' : undefined }}
        >
          {word}
          {index < words.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </motion.span>
  )
}
