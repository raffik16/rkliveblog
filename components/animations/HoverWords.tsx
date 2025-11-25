'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface HoverWordsProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  className?: string
  wordClassName?: string
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'color' | 'bounce'
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

export default function HoverWords({
  text,
  as: Component = 'span',
  className = '',
  wordClassName = '',
  hoverEffect = 'lift',
}: HoverWordsProps) {
  const words = text.split(' ')
  const variants = hoverVariants[hoverEffect]

  return (
    <Component className={`${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={`inline-block cursor-default ${wordClassName}`}
          initial="initial"
          whileHover="hover"
          variants={variants}
        >
          {word}
          {index < words.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </Component>
  )
}
