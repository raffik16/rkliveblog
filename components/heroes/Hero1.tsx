'use client'

import { FloatingElement, GradientFlow, StaggeredText } from '../animations'

export default function Hero1() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Content Section - 50% */}
      <div className="flex w-full items-center justify-center bg-gray-950 p-8 lg:w-1/2 lg:p-16">
        <div className="max-w-xl">
          <StaggeredText
            text="Floating Gradient Dreams"
            className="mb-6 text-5xl font-bold text-white lg:text-7xl"
          />
          <p className="mb-8 text-xl text-gray-300">
            Experience smooth floating animations combined with mesmerizing gradient flows that
            bring your designs to life.
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 rounded-lg px-8 py-4 font-semibold text-white transition-colors">
            Explore More
          </button>
        </div>
      </div>

      {/* Animation Showcase - 50% */}
      <GradientFlow
        className="flex w-full items-center justify-center p-8 lg:w-1/2"
        colors={['#FF5B04', '#FF8C42', '#075056', '#16232A']}
        duration={10}
      >
        <div className="grid grid-cols-2 gap-8">
          <FloatingElement duration={3} yOffset={30} delay={0}>
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-white">Float 1</span>
            </div>
          </FloatingElement>

          <FloatingElement duration={4} yOffset={25} delay={0.5}>
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-white">Float 2</span>
            </div>
          </FloatingElement>

          <FloatingElement duration={3.5} yOffset={20} delay={1}>
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-white">Float 3</span>
            </div>
          </FloatingElement>

          <FloatingElement duration={4.5} yOffset={35} delay={1.5}>
            <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white/20 shadow-2xl backdrop-blur-md">
              <span className="text-2xl font-bold text-white">Float 4</span>
            </div>
          </FloatingElement>
        </div>
      </GradientFlow>
    </div>
  )
}
