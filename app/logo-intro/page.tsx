import { Metadata } from 'next'
import LogoIntroShowcase from './LogoIntroShowcase'

export const metadata: Metadata = {
  title: 'Logo Intro Animations',
  description: 'A small playground of logo reveal animations that dock into the header.',
}

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Logo Intro Animations
      </h1>
      <p className="mb-8 max-w-2xl text-gray-600 dark:text-gray-400">
        Pick a variant and replay. The first two dock into the real header logo when they finish.
      </p>
      <LogoIntroShowcase />
    </div>
  )
}
