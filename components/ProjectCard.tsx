'use client'

import Image from './Image'
import Link from './Link'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface ProjectCardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  index: number
}

const ProjectCard = ({ title, description, imgSrc, href, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hover:shadow-primary-500/20 relative h-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-lg backdrop-blur-md transition-all duration-500 hover:shadow-2xl sm:rounded-3xl dark:border-gray-700/50 dark:bg-gray-900/80">
        {/* Gradient Glow on Hover */}
        <div
          className={`from-primary-500/0 to-primary-500/0 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br via-orange-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 sm:rounded-3xl`}
        />

        {/* Image Section */}
        {imgSrc && (
          <div className="relative aspect-video w-full overflow-hidden">
            {href ? (
              <Link
                href={href}
                aria-label={`Link to ${title}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full"
                >
                  <Image
                    alt={title}
                    src={imgSrc}
                    className="h-full w-full object-cover object-center"
                    width={800}
                    height={450}
                  />
                </motion.div>
              </Link>
            ) : (
              <Image
                alt={title}
                src={imgSrc}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                width={800}
                height={450}
              />
            )}

            {/* Overlay Gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}

        {/* Content Section */}
        <div className="relative p-6 sm:p-8">
          <h2 className="mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl dark:from-white dark:to-gray-300">
            {href ? (
              <Link
                href={href}
                aria-label={`Link to ${title}`}
                target="_blank"
                rel="noopener"
                className="hover:text-primary-500 transition-colors"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>

          <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
            {description}
          </p>

          {href && (
            <Link
              href={href}
              target="_blank"
              rel="noopener"
              className="group/link text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-2 text-base font-semibold transition-all hover:gap-3"
              aria-label={`Visit ${title}`}
            >
              <span>Visit Project</span>
              <motion.svg
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
