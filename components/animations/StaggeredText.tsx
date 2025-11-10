'use client'

import { motion } from 'framer-motion'

interface StaggeredTextProps {
  text: string
  className?: string
  delay?: number
}

export default function StaggeredText({ text, className = '', delay = 0 }: StaggeredTextProps) {
  const letters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  return (
    <motion.div
      style={{ display: 'flex', overflow: 'hidden' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} style={{ display: 'inline-block' }}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
