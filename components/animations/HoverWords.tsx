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
  entranceEffect?: 'fadeUp' | 'fadeIn' | 'slideIn' | 'blur' | 'wave' | 'elegant'
  staggerDelay?: number
  initialDelay?: number
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

// Elegant spring-like easing for smooth animations
const elegantEase = [0.25, 0.1, 0.25, 1] as const // cubic-bezier for smooth feel
const smoothEase = [0.4, 0, 0.2, 1] as const // Material Design standard easing

const entranceVariants: Record<string, { hidden: Variant; visible: Variant }> = {
  fadeUp: {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  fadeIn: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },
  slideIn: {
    hidden: { opacity: 0, x: -24, scale: 0.96 },
    visible: { opacity: 1, x: 0, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(12px)', scale: 0.95 },
    visible: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  },
  wave: {
    hidden: { opacity: 0, y: 24, rotateX: 90 },
    visible: { opacity: 1, y: 0, rotateX: 0 },
  },
  elegant: {
    hidden: { opacity: 0, y: 32, scale: 0.9, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
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
  initialDelay = 0,
}: HoverWordsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const words = text.split(' ')
  const hoverVar = hoverVariants[hoverEffect]
  const entranceVar = entranceVariants[entranceEffect]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay,
      },
    },
  }

  const wordVariants: Variants = {
    hidden: entranceVar.hidden,
    visible: {
      ...entranceVar.visible,
      transition: {
        duration: entranceEffect === 'elegant' ? 0.7 : 0.5,
        ease: entranceEffect === 'elegant' ? elegantEase : smoothEase,
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
          style={{
            perspective: entranceEffect === 'wave' ? '1000px' : undefined,
            transformStyle: entranceEffect === 'wave' ? 'preserve-3d' : undefined,
          }}
        >
          {word}
          {index < words.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </motion.span>
  )
}
