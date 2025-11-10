'use client'

import { Hero1, Hero2, Hero3, Hero4, Hero5 } from '@/components/heroes'
import { useState } from 'react'

export default function HeroesShowcase() {
  const [activeHero, setActiveHero] = useState(1)

  const heroes = [
    { id: 1, name: 'Floating Gradient Dreams', component: <Hero1 /> },
    { id: 2, name: 'Interactive Experiences', component: <Hero2 /> },
    { id: 3, name: 'Typography & Morphing', component: <Hero3 /> },
    { id: 4, name: 'Data Driven Design', component: <Hero4 /> },
    { id: 5, name: 'Parallax Universe', component: <Hero5 /> },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation Bar */}
      <div className="fixed top-0 right-0 left-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Hero Sections Showcase</h1>
            <div className="flex gap-2">
              {heroes.map((hero) => (
                <button
                  key={hero.id}
                  onClick={() => setActiveHero(hero.id)}
                  className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                    activeHero === hero.id
                      ? 'bg-primary-500 shadow-primary-500/50 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Hero {hero.id}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Current: {heroes.find((h) => h.id === activeHero)?.name}
          </p>
        </div>
      </div>

      {/* Hero Display */}
      <div className="pt-24">{heroes.find((h) => h.id === activeHero)?.component}</div>

      {/* Info Panel */}
      <div className="fixed right-4 bottom-4 max-w-md rounded-xl border border-gray-800 bg-gray-900/95 p-6 shadow-2xl backdrop-blur-md">
        <h3 className="mb-3 text-lg font-bold text-white">Animation Components Used:</h3>
        <div className="space-y-2 text-sm">
          {activeHero === 1 && (
            <ul className="space-y-1 text-gray-300">
              <li>✓ FloatingElement</li>
              <li>✓ GradientFlow</li>
              <li>✓ StaggeredText</li>
            </ul>
          )}
          {activeHero === 2 && (
            <ul className="space-y-1 text-gray-300">
              <li>✓ MagneticButton</li>
              <li>✓ RippleEffect</li>
              <li>✓ TiltCard</li>
            </ul>
          )}
          {activeHero === 3 && (
            <ul className="space-y-1 text-gray-300">
              <li>✓ StaggeredText</li>
              <li>✓ MorphShape</li>
            </ul>
          )}
          {activeHero === 4 && (
            <ul className="space-y-1 text-gray-300">
              <li>✓ CountUpAnimation</li>
              <li>✓ ScrollProgress</li>
            </ul>
          )}
          {activeHero === 5 && (
            <ul className="space-y-1 text-gray-300">
              <li>✓ ParallaxScroll</li>
              <li>✓ FloatingElement</li>
              <li>✓ TiltCard</li>
            </ul>
          )}
        </div>
        <div className="mt-4 border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-500">Total: 10 unique animation components created</p>
        </div>
      </div>
    </div>
  )
}
