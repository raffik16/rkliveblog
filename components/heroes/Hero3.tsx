'use client'

import { MorphShape, StaggeredText } from '../animations'
import { useState } from 'react'

export default function Hero3() {
  const [shapeKey, setShapeKey] = useState(0)

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row dark:bg-gray-950">
      {/* Content Section - 50% */}
      <div className="from-primary-50 flex w-full items-center justify-center bg-gradient-to-br to-orange-50 p-8 lg:w-1/2 lg:p-16 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-xl">
          <StaggeredText
            text="Typography"
            className="mb-4 text-6xl font-bold text-gray-900 lg:text-8xl dark:text-white"
          />
          <StaggeredText
            text="& Morphing"
            className="text-primary-500 mb-8 text-6xl font-bold lg:text-8xl"
            delay={0.5}
          />
          <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
            Watch text come alive letter by letter, while shapes morph seamlessly between forms.
          </p>
          <button
            onClick={() => setShapeKey((prev) => prev + 1)}
            className="rounded-lg bg-gray-900 px-8 py-4 font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Animate Text
          </button>
        </div>
      </div>

      {/* Animation Showcase - 50% */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2 lg:p-16 dark:bg-gray-900">
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center justify-center">
            <MorphShape
              size={180}
              colors={['#FF5B04', '#075056', '#16232A', '#FF8C42']}
              className="mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Click to morph</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <MorphShape
              size={180}
              colors={['#075056', '#FF5B04', '#FF8C42', '#16232A']}
              className="mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">Click to transform</p>
          </div>

          <div className="col-span-2 text-center">
            <StaggeredText
              key={shapeKey}
              text="Beautiful Animations"
              className="text-4xl font-bold text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
