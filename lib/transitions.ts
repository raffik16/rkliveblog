import { Variants, Transition } from 'framer-motion'

/**
 * Magnetic Page Transition
 * Spring physics slide with rotation - playful and dynamic
 */

export const pageTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
}

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -100,
    scale: 0.8,
    rotate: -5,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
    transition: pageTransition,
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    rotate: 5,
    transition: {
      ...pageTransition,
      duration: 0.4,
    },
  },
}
