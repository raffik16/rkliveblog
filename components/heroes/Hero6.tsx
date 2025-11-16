'use client'

import Link from 'next/link'
import { CountUpAnimation, FloatingElement, GradientFlow, TextType } from '../animations'

export default function Hero6() {
  return (
    <GradientFlow
      className="relative flex w-full items-center justify-center overflow-hidden"
      colors={['#FF5B04', '#FF8C42', '#075056', '#16232A', '#FF5B04']}
      duration={12}
    >
      {/* Content Container with Apple Liquid Glass Effect */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        {/* Main Hero Card - Ultra Frosted Glass */}
        <div className="glass-frost-hero glass-border-hero relative overflow-hidden rounded-[2rem] p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-12 lg:p-16">
          {/* Vibrant Gradient Border Glow */}
          <div className="from-primary-500/20 pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-r via-purple-500/20 to-cyan-500/20 opacity-50 blur-xl sm:rounded-[2.5rem]" />

          {/* Inner Content */}
          <div className="relative">
            {/* Title Section */}
            <div className="mb-8 text-center sm:mb-12 lg:mb-16">
              <TextType
                text={['Daily Moments', 'Personal Insights', 'Life Updates', 'Authentic Stories']}
                as="h1"
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="mb-2 text-[clamp(2rem,8vw,5rem)] leading-tight font-bold text-white drop-shadow-lg sm:mb-4 sm:text-6xl lg:text-8xl"
              />
              <p className="mx-auto mt-4 max-w-3xl px-2 text-base leading-relaxed text-white/90 sm:mt-8 sm:text-xl lg:text-2xl">
                Welcome to my corner of the internet. Here I share authentic thoughts, everyday
                experiences, and personal insights as they unfold. Join me on this journey of
                continuous discovery and genuine storytelling.
              </p>
            </div>

            {/* Stats Grid - Apple Liquid Glass Cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-12 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              <FloatingElement duration={3.5} yOffset={15} delay={0}>
                <div className="glass-frost glass-border-primary group relative overflow-hidden rounded-2xl p-4 shadow-xl transition-all duration-500 hover:scale-105 sm:rounded-3xl sm:p-6 lg:rounded-[2rem] lg:p-8">
                  {/* Card Glow on Hover */}
                  <div className="from-primary-500/0 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br to-orange-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-3xl lg:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={147}
                      duration={2.5}
                      className="mb-1 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-3xl font-black text-transparent sm:mb-2 sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-xs font-medium text-white/90 sm:text-base lg:text-lg">
                      Posts Written
                    </p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement duration={4} yOffset={18} delay={0.3}>
                <div className="glass-frost glass-border-cyan group relative overflow-hidden rounded-2xl p-4 shadow-xl transition-all duration-500 hover:scale-105 sm:rounded-3xl sm:p-6 lg:rounded-[2rem] lg:p-8">
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-3xl lg:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={365}
                      duration={2}
                      className="mb-1 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-3xl font-black text-transparent sm:mb-2 sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-xs font-medium text-white/90 sm:text-base lg:text-lg">
                      Days Blogging
                    </p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement duration={3.8} yOffset={16} delay={0.6}>
                <div className="glass-frost glass-border-purple group relative overflow-hidden rounded-2xl p-4 shadow-xl transition-all duration-500 hover:scale-105 sm:rounded-3xl sm:p-6 lg:rounded-[2rem] lg:p-8">
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-3xl lg:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={1247}
                      duration={2.2}
                      className="mb-1 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-3xl font-black text-transparent sm:mb-2 sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-xs font-medium text-white/90 sm:text-base lg:text-lg">
                      Coffees Consumed
                    </p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement duration={4.2} yOffset={20} delay={0.9}>
                <div className="glass-frost glass-border-emerald group relative overflow-hidden rounded-2xl p-4 shadow-xl transition-all duration-500 hover:scale-105 sm:rounded-3xl sm:p-6 lg:rounded-[2rem] lg:p-8">
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30 sm:rounded-3xl lg:rounded-[2rem]" />

                  <div className="relative">
                    <CountUpAnimation
                      value={23}
                      duration={1.8}
                      className="mb-1 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-3xl font-black text-transparent sm:mb-2 sm:text-5xl lg:text-6xl"
                      suffix="+"
                    />
                    <p className="text-xs font-medium text-white/90 sm:text-base lg:text-lg">
                      Topics Explored
                    </p>
                  </div>
                </div>
              </FloatingElement>
            </div>

            {/* CTA Buttons - Liquid Glass Style */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-6">
              <Link href="/blog" className="w-full sm:w-auto">
                <button className="group from-primary-500 shadow-primary-500/50 hover:shadow-primary-500/70 relative w-full overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-r to-orange-500 px-6 py-3 font-bold text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/50 sm:px-10 sm:py-5">
                  <span className="relative z-10 text-sm sm:text-lg">Read Latest Posts</span>
                  <div className="from-primary-600 absolute inset-0 bg-gradient-to-r to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </Link>

              <Link href="/about" className="w-full sm:w-auto">
                <button className="group relative w-full overflow-hidden rounded-2xl border border-white/40 bg-white/10 px-6 py-3 font-bold text-white shadow-xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-white/20 sm:px-10 sm:py-5">
                  <span className="relative z-10 text-sm sm:text-lg">Join the Journey</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Accent Elements */}
        <FloatingElement duration={5} yOffset={30} delay={0}>
          <div className="from-primary-500/30 pointer-events-none absolute top-10 left-4 h-24 w-24 rounded-full bg-gradient-to-br to-orange-500/30 blur-3xl sm:top-20 sm:left-10 sm:h-48 sm:w-48 lg:h-64 lg:w-64" />
        </FloatingElement>

        <FloatingElement duration={6} yOffset={40} delay={1}>
          <div className="pointer-events-none absolute right-4 bottom-10 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl sm:right-10 sm:bottom-20 sm:h-48 sm:w-48 lg:h-64 lg:w-64" />
        </FloatingElement>
      </div>
    </GradientFlow>
  )
}
