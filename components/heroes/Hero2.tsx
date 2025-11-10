'use client'

import { MagneticButton, RippleEffect, TiltCard } from '../animations'

export default function Hero2() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-black lg:flex-row">
      {/* Content Section - 50% */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
        <div className="max-w-xl">
          <h1 className="mb-6 text-5xl font-bold text-white lg:text-7xl">
            Interactive
            <span className="text-primary-500 mt-2 block">Experiences</span>
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Engage with magnetic buttons, ripple effects, and 3D tilt cards that respond to your
            every move.
          </p>
          <div className="flex gap-4">
            <MagneticButton
              strength={0.4}
              className="bg-primary-500 hover:bg-primary-600 rounded-lg px-8 py-4 font-semibold text-white transition-colors"
            >
              Try Magnetic
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Animation Showcase - 50% */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
        <div className="grid grid-cols-2 gap-8">
          <TiltCard className="w-full">
            <div className="from-primary-500 to-primary-700 rounded-2xl bg-gradient-to-br p-8 shadow-2xl">
              <h3 className="mb-2 text-2xl font-bold text-white">3D Tilt</h3>
              <p className="text-white/80">Hover to tilt</p>
            </div>
          </TiltCard>

          <RippleEffect className="h-full w-full rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-8 shadow-2xl">
            <h3 className="mb-2 text-2xl font-bold text-white">Ripple</h3>
            <p className="text-white/80">Click anywhere</p>
          </RippleEffect>

          <RippleEffect
            className="h-full w-full rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-8 shadow-2xl"
            rippleColor="rgba(255, 255, 255, 0.3)"
          >
            <h3 className="mb-2 text-2xl font-bold text-white">Wave</h3>
            <p className="text-white/80">Make waves</p>
          </RippleEffect>

          <TiltCard className="w-full">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-8 shadow-2xl">
              <h3 className="mb-2 text-2xl font-bold text-white">Dynamic</h3>
              <p className="text-white/80">Move mouse</p>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  )
}
