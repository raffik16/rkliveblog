'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/quiet-hands', label: 'Home', icon: HomeIcon },
  { href: '/quiet-hands/scan', label: 'Scan', icon: ScanIcon },
  { href: '/quiet-hands/resist', label: 'Resist', icon: ResistIcon },
  { href: '/quiet-hands/surf', label: 'Surf', icon: SurfIcon },
  { href: '/quiet-hands/breathe', label: 'Breathe', icon: BreatheIcon },
]

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-6 w-6 ${active ? 'text-amber-600' : 'text-stone-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  )
}

function ScanIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-6 w-6 ${active ? 'text-amber-600' : 'text-stone-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  )
}

function ResistIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-6 w-6 ${active ? 'text-amber-600' : 'text-stone-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function SurfIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-6 w-6 ${active ? 'text-amber-600' : 'text-stone-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function BreatheIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-6 w-6 ${active ? 'text-amber-600' : 'text-stone-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/95">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center p-2">
              <motion.div whileTap={{ scale: 0.95 }} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-2 rounded-xl bg-amber-100 dark:bg-amber-900/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative">
                  <Icon active={isActive} />
                </div>
              </motion.div>
              <span
                className={`mt-1 text-xs ${
                  isActive
                    ? 'font-medium text-amber-600 dark:text-amber-400'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
