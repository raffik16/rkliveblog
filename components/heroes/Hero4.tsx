'use client'

import { CountUpAnimation, ScrollProgress } from '../animations'

export default function Hero4() {
  return (
    <>
      <ScrollProgress color="#FF5B04" height={4} position="top" />
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-950 via-teal-950 to-gray-950 lg:flex-row">
        {/* Content Section - 50% */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
          <div className="max-w-xl">
            <h1 className="mb-6 text-5xl font-bold text-white lg:text-7xl">
              Data Driven
              <span className="text-primary-500 mt-2 block">Design</span>
            </h1>
            <p className="mb-8 text-xl text-gray-300">
              Watch numbers come to life with smooth count-up animations and scroll progress
              indicators that track your journey.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary-500 hover:bg-primary-600 rounded-lg px-8 py-4 font-semibold text-white transition-colors">
                View Metrics
              </button>
              <button className="rounded-lg bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Animation Showcase - 50% */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
          <div className="grid w-full max-w-2xl grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
              <CountUpAnimation
                value={10000}
                duration={2.5}
                className="text-primary-500 mb-2 block text-6xl font-bold"
                suffix="+"
              />
              <p className="text-lg text-gray-300">Happy Clients</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
              <CountUpAnimation
                value={500}
                duration={2}
                className="mb-2 block text-6xl font-bold text-teal-400"
                suffix="+"
              />
              <p className="text-lg text-gray-300">Projects Done</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
              <CountUpAnimation
                value={98}
                duration={2.2}
                className="mb-2 block text-6xl font-bold text-purple-400"
                suffix="%"
              />
              <p className="text-lg text-gray-300">Success Rate</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
              <CountUpAnimation
                value={15}
                duration={1.8}
                className="mb-2 block text-6xl font-bold text-orange-400"
                suffix="+"
              />
              <p className="text-lg text-gray-300">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
