'use client'

import { CountUpAnimation, FloatingElement, GradientFlow, StaggeredText } from '../animations'

export default function Hero6() {
  return (
    <GradientFlow
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      colors={['#FF5B04', '#FF8C42', '#075056', '#16232A', '#FF5B04']}
      duration={12}
    >
      {/* Content Container with Apple Liquid Glass Effect */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        {/* Main Hero Card - Ultra Frosted Glass */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-3xl sm:p-12 lg:p-16">
          {/* Vibrant Gradient Border Glow */}
          <div className="from-primary-500/20 pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-r via-purple-500/20 to-cyan-500/20 opacity-50 blur-xl" />

          {/* Inner Content */}
          <div className="relative">
            {/* Title Section */}
            <div className="mb-12 text-center sm:mb-16">
              <StaggeredText
                text="Floating Data"
                className="mb-4 text-5xl font-bold text-white drop-shadow-lg sm:text-6xl lg:text-8xl"
              />
              <StaggeredText
                text="In Motion"
                className="from-primary-400 to-primary-500 bg-gradient-to-r via-orange-300 bg-clip-text text-5xl font-bold text-transparent drop-shadow-lg sm:text-6xl lg:text-8xl"
                delay={0.3}
              />
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl lg:text-2xl">
                Experience the perfect fusion of elegant floating animations and dynamic data
                visualization. Watch your metrics come alive with smooth count-ups on flowing
                gradient backgrounds.
              </p>
            </div>

            {/* Stats Grid - Apple Liquid Glass Cards */}
            <div className="mb-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              <FloatingElement duration={3.5} yOffset={15} delay={0}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:border-white/60 sm:rounded-[2rem] sm:p-8">
                  {/* Card Glow on Hover */}
                  <div className="from-primary-500/0 pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br to-orange-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={10000}
                      duration={2.5}
                      className="mb-2 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-sm font-medium text-white/90 sm:text-base lg:text-lg">
                      Happy Clients
                    </p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement duration={4} yOffset={18} delay={0.3}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:border-white/60 sm:rounded-[2rem] sm:p-8">
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={500}
                      duration={2}
                      className="mb-2 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-sm font-medium text-white/90 sm:text-base lg:text-lg">
                      Projects Done
                    </p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement duration={3.8} yOffset={16} delay={0.6}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:border-white/60 sm:rounded-[2rem] sm:p-8">
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={98}
                      duration={2.2}
                      className="mb-2 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-6xl"
                      suffix="%"
                    />
                    <p className="text-sm font-medium text-white/90 sm:text-base lg:text-lg">
                      Success Rate
                    </p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement duration={4.2} yOffset={20} delay={0.9}>
                <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/20 to-white/5 p-6 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:border-white/60 sm:rounded-[2rem] sm:p-8">
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={15}
                      duration={1.8}
                      className="mb-2 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-4xl font-black text-transparent sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-sm font-medium text-white/90 sm:text-base lg:text-lg">
                      Years Experience
                    </p>
                  </div>
                </div>
              </FloatingElement>
            </div>

            {/* CTA Buttons - Liquid Glass Style */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
              <button className="group from-primary-500 shadow-primary-500/50 hover:shadow-primary-500/70 relative overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-r to-orange-500 px-8 py-4 font-bold text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/50 sm:px-10 sm:py-5">
                <span className="relative z-10 text-base sm:text-lg">View Dashboard</span>
                <div className="from-primary-600 absolute inset-0 bg-gradient-to-r to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>

              <button className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/10 px-8 py-4 font-bold text-white shadow-xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-white/20 sm:px-10 sm:py-5">
                <span className="relative z-10 text-base sm:text-lg">Learn More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Accent Elements */}
        <FloatingElement duration={5} yOffset={30} delay={0}>
          <div className="from-primary-500/30 pointer-events-none absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br to-orange-500/30 blur-3xl sm:h-48 sm:w-48 lg:h-64 lg:w-64" />
        </FloatingElement>

        <FloatingElement duration={6} yOffset={40} delay={1}>
          <div className="pointer-events-none absolute right-10 bottom-20 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl sm:h-48 sm:w-48 lg:h-64 lg:w-64" />
        </FloatingElement>
      </div>
    </GradientFlow>
  )
}
