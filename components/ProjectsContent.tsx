'use client'

import projectsData from '@/data/projectsData'
import ProjectCard from '@/components/ProjectCard'
import { motion } from 'framer-motion'

export default function ProjectsContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section - Full Width */}
      <div className="from-primary-500/10 to-primary-500/10 dark:from-primary-500/20 dark:to-primary-500/20 relative w-full overflow-hidden bg-gradient-to-br via-orange-500/5 py-16 sm:py-24 lg:py-32 dark:via-orange-500/10">
        {/* Animated Background Elements */}
        <div className="from-primary-500/20 pointer-events-none absolute top-20 left-10 h-64 w-64 rounded-full bg-gradient-to-br to-orange-500/20 blur-3xl" />
        <div className="to-primary-500/20 pointer-events-none absolute right-10 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-primary-500/30 bg-primary-500/10 mb-6 inline-block rounded-full border px-6 py-2 backdrop-blur-sm"
            >
              <span className="from-primary-500 bg-gradient-to-r to-orange-500 bg-clip-text text-sm font-semibold tracking-wide text-transparent sm:text-base">
                PORTFOLIO
              </span>
            </motion.div>

            <h1 className="mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl dark:from-white dark:via-gray-100 dark:to-white">
              Featured Work
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl dark:text-gray-400">
              A curated collection of innovative projects spanning creative production, technology,
              and digital experiences. Each project represents a unique story of collaboration,
              design excellence, and technical craftsmanship.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid - Full Width Container */}
      <div className="relative w-full bg-white/50 py-12 sm:py-16 lg:py-24 dark:bg-gray-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10 xl:grid-cols-3"
          >
            {projectsData.map((project, index) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                imgSrc={project.imgSrc}
                href={project.href}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer CTA Section */}
      <div className="from-primary-500 relative w-full overflow-hidden bg-gradient-to-br to-orange-600 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[url('/static/images/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Have a project in mind?
            </h2>
            <p className="mb-8 text-base text-white/90 sm:text-lg lg:text-xl">
              Let's collaborate and create something amazing together.
            </p>
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-600 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 text-base font-bold shadow-xl transition-all hover:bg-white/90 sm:text-lg"
            >
              <span>Get in Touch</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
