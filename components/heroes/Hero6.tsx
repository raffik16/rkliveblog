'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import siteMetadata from '@/data/siteMetadata'
import { CountUpAnimation, FloatingElement, GradientFlow, TextType } from '../animations'

export interface HeroStats {
  /** Published posts */
  posts: number
  /** Distinct tags in app/tag-data.json */
  topics: number
  /** Entries in data/demosData.ts */
  demos: number
  /** Year of the earliest published post */
  since: number
}

interface Hero6Props {
  stats: HeroStats
}

const HERO_COLORS = ['#FF5B04', '#FF8C42', '#075056', '#16232A', '#FF5B04']

// Decorative only (aria-hidden): the h1 and paragraph carry the real message.
const ROTATING_PHRASES = [
  'AI-assisted development',
  'Creative coding',
  'Web platform deep dives',
  'Honest tool takes',
]

const valueClass =
  'mb-1 block bg-gradient-to-br from-white to-white/80 bg-clip-text text-3xl font-black text-transparent tabular-nums sm:mb-2 sm:text-5xl xl:text-6xl'

export default function Hero6({ stats }: Hero6Props) {
  const reduceMotion = useReducedMotion()
  // useReducedMotion() is null on the server but a boolean on the client's first render, so
  // anything that changes markup waits until after mount to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const allowMotion = mounted && reduceMotion === false
  const staticTagline = mounted && reduceMotion === true

  const statTiles = [
    { label: 'Published posts', value: stats.posts, border: 'glass-border-primary' },
    { label: 'Topics', value: stats.topics, border: 'glass-border-cyan' },
    { label: 'Interactive demos', value: stats.demos, border: 'glass-border-purple' },
    { label: 'Writing since', value: stats.since, border: 'glass-border-emerald', year: true },
  ]

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative flex w-full items-center justify-center overflow-hidden"
    >
      {/* Brand gradient background. Static first frame on the server and for reduced motion. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {allowMotion ? (
          <GradientFlow className="h-full w-full" colors={HERO_COLORS} duration={12}>
            {null}
          </GradientFlow>
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(45deg, ${HERO_COLORS.join(', ')})`,
              backgroundSize: '300% 300%',
              backgroundPosition: '0% 50%',
            }}
          />
        )}
      </div>

      {/* Content Container with Apple Liquid Glass Effect */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        {/* Floating Accent Elements: behind the glass card, and only drifting when motion is allowed */}
        <AccentBlob
          animate={allowMotion}
          duration={5}
          yOffset={30}
          delay={0}
          position="top-10 left-4 sm:top-20 sm:left-10"
          colors="from-primary-500/30 to-orange-500/30"
        />
        <AccentBlob
          animate={allowMotion}
          duration={6}
          yOffset={40}
          delay={1}
          position="right-4 bottom-10 sm:right-10 sm:bottom-20"
          colors="from-cyan-500/30 to-blue-500/30"
        />
        {/* Main Hero Card - Ultra Frosted Glass */}
        <div className="glass-frost-hero glass-border-hero relative overflow-hidden rounded-[2rem] p-6 shadow-2xl sm:rounded-[2.5rem] sm:p-12 lg:p-16">
          {/* Vibrant Gradient Border Glow */}
          <div className="from-primary-500/20 pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-r via-purple-500/20 to-cyan-500/20 opacity-50 blur-xl sm:rounded-[2.5rem]" />

          {/* Inner Content */}
          <div className="relative">
            {/* Title Section */}
            <div className="mb-8 text-center sm:mb-12 lg:mb-16">
              <h1
                id="home-hero-title"
                className="text-4xl leading-tight font-bold tracking-tight text-balance text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
              >
                Engineering, AI &amp; creative code
              </h1>

              {/* Rotating tagline: reserves two lines on phones and one from sm, so it never shifts layout */}
              <div
                aria-hidden="true"
                className="mt-3 flex min-h-[2.75em] items-center justify-center text-lg leading-[1.375] font-semibold text-white/85 sm:mt-4 sm:min-h-[1.375em] sm:text-2xl lg:text-3xl"
              >
                {staticTagline ? (
                  <span>{ROTATING_PHRASES[0]}</span>
                ) : (
                  <TextType
                    text={ROTATING_PHRASES}
                    as="span"
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseDuration={1800}
                    showCursor={false}
                  />
                )}
              </div>

              <p className="mx-auto mt-4 max-w-3xl px-2 text-base leading-relaxed text-white/90 sm:mt-6 sm:text-xl lg:text-2xl">
                {siteMetadata.description}
              </p>
            </div>

            {/* Stats Grid - Apple Liquid Glass Cards */}
            <dl className="mb-8 grid grid-cols-2 gap-3 sm:mb-12 sm:gap-6 lg:grid-cols-4">
              {statTiles.map((tile) => (
                <div
                  key={tile.label}
                  className={`glass-frost ${tile.border} flex flex-col-reverse rounded-2xl p-4 shadow-xl transition-transform duration-500 motion-safe:hover:scale-105 sm:rounded-3xl sm:p-6 lg:rounded-[2rem]`}
                >
                  <dt className="text-xs font-medium text-white/90 sm:text-base lg:text-lg">
                    {tile.label}
                  </dt>
                  <dd>
                    {tile.year ? (
                      // A year is shown as-is: no count-up from 0 and no digit grouping (2025, not 2,025)
                      <span className={valueClass}>{tile.value}</span>
                    ) : (
                      <CountUpAnimation
                        value={tile.value}
                        duration={1.6}
                        locale={siteMetadata.locale}
                        className={valueClass}
                      />
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTA Links - Liquid Glass Style */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-6">
              <Link
                href="/blog"
                className="group from-primary-500 shadow-primary-500/50 hover:shadow-primary-500/70 relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-r to-orange-500 px-6 py-3 font-bold text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-safe:hover:scale-105 sm:w-auto sm:px-10 sm:py-5"
              >
                <span className="relative z-10 text-sm sm:text-lg">Read the latest</span>
                <span
                  aria-hidden="true"
                  className="from-primary-600 absolute inset-0 bg-gradient-to-r to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </Link>

              <Link
                href="/lab"
                className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white/10 px-6 py-3 font-bold text-white shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-white/60 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-safe:hover:scale-105 sm:w-auto sm:px-10 sm:py-5"
              >
                <span className="relative z-10 text-sm sm:text-lg">Explore the lab</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AccentBlob({
  animate,
  position,
  colors,
  ...float
}: {
  animate: boolean
  position: string
  colors: string
  duration: number
  yOffset: number
  delay: number
}) {
  // The absolutely positioned wrapper stays the same whether or not it floats, so the blob
  // does not jump when motion switches on after hydration.
  const blob = (
    <div
      className={`h-24 w-24 rounded-full bg-gradient-to-br blur-3xl sm:h-48 sm:w-48 lg:h-64 lg:w-64 ${colors}`}
    />
  )
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${position}`}>
      {animate ? <FloatingElement {...float}>{blob}</FloatingElement> : blob}
    </div>
  )
}
