'use client'

import {
  CountUpAnimation,
  FloatingElement,
  GradientFlow,
  ScrollProgress,
  StaggeredText,
} from '../animations'

export default function Hero6() {
  return (
    <>
      <ScrollProgress color="#FF5B04" height={4} position="top" />
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Content Section - 50% */}
        <div className="flex w-full items-center justify-center bg-gray-950 p-8 lg:w-1/2 lg:p-16">
          <div className="max-w-xl">
            <StaggeredText
              text="Floating Data"
              className="mb-4 text-5xl font-bold text-white lg:text-7xl"
            />
            <StaggeredText
              text="In Motion"
              className="text-primary-500 mb-8 text-5xl font-bold lg:text-7xl"
              delay={0.3}
            />
            <p className="mb-8 text-xl text-gray-300">
              Experience the perfect fusion of elegant floating animations and dynamic data
              visualization. Watch your metrics come alive with smooth count-ups on flowing gradient
              backgrounds.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary-500 hover:bg-primary-600 shadow-primary-500/50 rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-colors">
                View Dashboard
              </button>
              <button className="rounded-lg bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Animation Showcase - 50% */}
        <GradientFlow
          className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16"
          colors={['#FF5B04', '#FF8C42', '#075056', '#16232A', '#FF5B04']}
          duration={12}
        >
          <div className="grid w-full max-w-2xl grid-cols-2 gap-6">
            <FloatingElement duration={3.5} yOffset={25} delay={0}>
              <div className="h-full rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <CountUpAnimation
                  value={10000}
                  duration={2.5}
                  className="mb-2 block text-5xl font-bold text-white"
                  suffix="+"
                />
                <p className="text-base text-white/80">Happy Clients</p>
              </div>
            </FloatingElement>

            <FloatingElement duration={4} yOffset={30} delay={0.5}>
              <div className="h-full rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <CountUpAnimation
                  value={500}
                  duration={2}
                  className="mb-2 block text-5xl font-bold text-white"
                  suffix="+"
                />
                <p className="text-base text-white/80">Projects Done</p>
              </div>
            </FloatingElement>

            <FloatingElement duration={3.8} yOffset={28} delay={1}>
              <div className="h-full rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <CountUpAnimation
                  value={98}
                  duration={2.2}
                  className="mb-2 block text-5xl font-bold text-white"
                  suffix="%"
                />
                <p className="text-base text-white/80">Success Rate</p>
              </div>
            </FloatingElement>

            <FloatingElement duration={4.2} yOffset={32} delay={1.5}>
              <div className="h-full rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <CountUpAnimation
                  value={15}
                  duration={1.8}
                  className="mb-2 block text-5xl font-bold text-white"
                  suffix="+"
                />
                <p className="text-base text-white/80">Years Experience</p>
              </div>
            </FloatingElement>
          </div>
        </GradientFlow>
      </div>
    </>
  )
}
