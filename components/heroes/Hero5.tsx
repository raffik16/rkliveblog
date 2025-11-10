'use client'

import { FloatingElement, ParallaxScroll, TiltCard } from '../animations'

export default function Hero5() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Content Section - 50% */}
        <div className="relative z-10 flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
          <div className="max-w-xl">
            <h1 className="mb-6 text-5xl font-bold text-white lg:text-7xl">
              Parallax
              <span className="from-primary-500 mt-2 block bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                Universe
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300">
              Dive into a multidimensional experience where elements move at different speeds,
              creating stunning depth and immersion.
            </p>
            <div className="flex gap-4">
              <button className="from-primary-500 hover:from-primary-600 shadow-primary-500/50 rounded-lg bg-gradient-to-r to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:to-purple-700">
                Start Journey
              </button>
            </div>
          </div>
        </div>

        {/* Animation Showcase - 50% */}
        <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Background Parallax Layers */}
            <ParallaxScroll offset={100} className="absolute">
              <div className="h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>
            </ParallaxScroll>

            <ParallaxScroll offset={-80} className="absolute">
              <div className="bg-primary-500/10 h-72 w-72 rounded-full blur-3xl"></div>
            </ParallaxScroll>

            {/* Floating Cards */}
            <div className="relative grid grid-cols-2 gap-6">
              <FloatingElement duration={4} yOffset={40}>
                <ParallaxScroll offset={30}>
                  <TiltCard>
                    <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-purple-600 to-indigo-700 shadow-2xl backdrop-blur-sm">
                      <span className="text-lg font-bold text-white">Layer 1</span>
                    </div>
                  </TiltCard>
                </ParallaxScroll>
              </FloatingElement>

              <FloatingElement duration={3.5} yOffset={30} delay={0.5}>
                <ParallaxScroll offset={-20}>
                  <TiltCard>
                    <div className="from-primary-600 flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br to-orange-700 shadow-2xl backdrop-blur-sm">
                      <span className="text-lg font-bold text-white">Layer 2</span>
                    </div>
                  </TiltCard>
                </ParallaxScroll>
              </FloatingElement>

              <FloatingElement duration={4.5} yOffset={35} delay={1}>
                <ParallaxScroll offset={50}>
                  <TiltCard>
                    <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-teal-600 to-cyan-700 shadow-2xl backdrop-blur-sm">
                      <span className="text-lg font-bold text-white">Layer 3</span>
                    </div>
                  </TiltCard>
                </ParallaxScroll>
              </FloatingElement>

              <FloatingElement duration={3.8} yOffset={25} delay={1.5}>
                <ParallaxScroll offset={-40}>
                  <TiltCard>
                    <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-pink-600 to-rose-700 shadow-2xl backdrop-blur-sm">
                      <span className="text-lg font-bold text-white">Layer 4</span>
                    </div>
                  </TiltCard>
                </ParallaxScroll>
              </FloatingElement>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
