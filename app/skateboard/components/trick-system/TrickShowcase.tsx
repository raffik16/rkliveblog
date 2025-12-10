'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TRICKS, getTrickById, TRICK_CATEGORIES } from '../../data/tricks'
import { TrickDefinition } from '../../types'

interface TrickShowcaseProps {
  onTrickSelect?: (trickId: string) => void
}

export default function TrickShowcase({ onTrickSelect }: TrickShowcaseProps) {
  const [selectedTrick, setSelectedTrick] = useState<TrickDefinition>(TRICKS[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const animationRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)

  const handleTrickSelect = (trick: TrickDefinition) => {
    setSelectedTrick(trick)
    setProgress(0)
    setIsPlaying(false)
    onTrickSelect?.(trick.id)
  }

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      setProgress(0)
      setIsPlaying(true)
      lastTimeRef.current = performance.now()
    }
  }

  useEffect(() => {
    if (!isPlaying) return

    const animate = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setProgress((prev) => {
        const newProgress = prev + (deltaTime * playbackSpeed) / selectedTrick.duration
        if (newProgress >= 1) {
          setIsPlaying(false)
          return 1
        }
        return newProgress
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, selectedTrick.duration])

  const getCurrentKeyframeValues = () => {
    const keyframes = selectedTrick.keyframes
    let prevKeyframe = keyframes[0]
    let nextKeyframe = keyframes[keyframes.length - 1]

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].time && progress <= keyframes[i + 1].time) {
        prevKeyframe = keyframes[i]
        nextKeyframe = keyframes[i + 1]
        break
      }
    }

    const t = (progress - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time) || 0
    const easeT = t * t * (3 - 2 * t)

    return {
      rotateX:
        prevKeyframe.rotation.x + (nextKeyframe.rotation.x - prevKeyframe.rotation.x) * easeT,
      rotateY:
        prevKeyframe.rotation.y + (nextKeyframe.rotation.y - prevKeyframe.rotation.y) * easeT,
      rotateZ:
        prevKeyframe.rotation.z + (nextKeyframe.rotation.z - prevKeyframe.rotation.z) * easeT,
      scaleX: prevKeyframe.scale.x + (nextKeyframe.scale.x - prevKeyframe.scale.x) * easeT,
      scaleY: prevKeyframe.scale.y + (nextKeyframe.scale.y - prevKeyframe.scale.y) * easeT,
      translateY:
        prevKeyframe.translateY + (nextKeyframe.translateY - prevKeyframe.translateY) * easeT,
    }
  }

  const currentValues = getCurrentKeyframeValues()

  const getDifficultyStars = (difficulty: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={i < difficulty ? 'text-yellow-400' : 'text-gray-600'}>
          ★
        </span>
      ))
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
      <div className="order-2 space-y-3 md:space-y-4 lg:order-1 lg:col-span-1">
        <h3 className="text-base font-semibold text-white md:mb-4 md:text-lg">Trick Library</h3>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0 lg:space-y-4">
          {Object.entries(TRICK_CATEGORIES).map(([category, trickIds]) => (
            <div key={category} className="contents lg:block lg:space-y-2">
              <h4 className="col-span-2 text-xs font-medium tracking-wider text-gray-400 uppercase sm:col-span-3 lg:text-sm">
                {category}
              </h4>
              {trickIds.map((trickId) => {
                const trick = getTrickById(trickId)
                if (!trick) return null

                return (
                  <motion.button
                    key={trick.id}
                    onClick={() => handleTrickSelect(trick)}
                    className={`w-full rounded-lg border p-2 text-left transition-all md:p-3 ${
                      selectedTrick.id === trick.id
                        ? 'border-orange-500 bg-orange-500/20 text-white'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-sm font-medium md:text-base">
                        {trick.displayName}
                      </span>
                      <span className="shrink-0 text-xs md:text-sm">
                        {getDifficultyStars(trick.difficulty)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500 md:mt-1">
                      {trick.baseScore} pts • {(trick.duration * 1000).toFixed(0)}ms
                    </div>
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="order-1 space-y-3 md:space-y-4 lg:order-2 lg:col-span-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3 md:p-6">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h3 className="text-lg font-bold text-white md:text-xl">{selectedTrick.displayName}</h3>
            <div className="flex items-center gap-1 md:gap-2">
              <span className="hidden text-sm text-gray-400 sm:inline">Difficulty:</span>
              <span className="text-sm md:text-base">
                {getDifficultyStars(selectedTrick.difficulty)}
              </span>
            </div>
          </div>

          <div
            className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-gray-800 md:h-64"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute right-0 bottom-8 left-0 h-px bg-gray-600" />

            <motion.div
              className="absolute bottom-8 left-1/2"
              style={{
                translateX: '-50%',
                translateY: currentValues.translateY,
                rotateX: currentValues.rotateX,
                rotateY: currentValues.rotateY,
                rotateZ: currentValues.rotateZ,
                scaleX: currentValues.scaleX,
                scaleY: currentValues.scaleY,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative h-6 w-32 rounded-lg bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 shadow-lg">
                <div className="absolute inset-1 rounded bg-gray-800 opacity-30" />
                <div className="absolute -bottom-2 left-4 h-2 w-6 rounded-sm bg-gray-400" />
                <div className="absolute right-4 -bottom-2 h-2 w-6 rounded-sm bg-gray-400" />
                <div className="absolute -bottom-4 left-3 h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-700" />
                <div className="absolute -bottom-4 left-8 h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-700" />
                <div className="absolute right-3 -bottom-4 h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-700" />
                <div className="absolute right-8 -bottom-4 h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-700" />
              </div>
            </motion.div>

            <div className="absolute top-4 right-4 left-4">
              <div className="h-1 overflow-hidden rounded-full bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div className="absolute top-8 right-4 space-y-1 font-mono text-xs text-gray-400">
              <div>X: {currentValues.rotateX.toFixed(1)}°</div>
              <div>Y: {currentValues.rotateY.toFixed(1)}°</div>
              <div>Z: {currentValues.rotateZ.toFixed(1)}°</div>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:mt-4 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayback}
                className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 md:flex-none md:px-6 md:text-base"
              >
                {isPlaying ? 'Stop' : 'Play'}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="rounded border border-gray-600 bg-gray-700 px-2 py-2 text-sm text-white md:px-3"
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={(e) => {
                setProgress(Number(e.target.value))
                setIsPlaying(false)
              }}
              className="w-full flex-1 accent-orange-500"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3 md:p-6">
          <h4 className="mb-2 text-sm font-semibold text-white md:mb-3 md:text-base">
            Trick Details
          </h4>
          <p className="mb-3 text-sm text-gray-400 md:mb-4 md:text-base">
            {selectedTrick.description}
          </p>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            <div className="rounded-lg bg-gray-900/50 p-2 md:p-3">
              <div className="text-xs text-gray-500 uppercase">Score</div>
              <div className="text-lg font-bold text-orange-400 md:text-xl">
                {selectedTrick.baseScore}
              </div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-2 md:p-3">
              <div className="text-xs text-gray-500 uppercase">Duration</div>
              <div className="text-lg font-bold text-cyan-400 md:text-xl">
                {(selectedTrick.duration * 1000).toFixed(0)}ms
              </div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-2 md:p-3">
              <div className="text-xs text-gray-500 uppercase">Rotation</div>
              <div className="text-lg font-bold text-purple-400 md:text-xl">
                {selectedTrick.rotationAmount}°
              </div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-2 md:p-3">
              <div className="text-xs text-gray-500 uppercase">Flips</div>
              <div className="text-lg font-bold text-green-400 md:text-xl">
                {selectedTrick.flipCount}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3 md:p-6">
          <h4 className="mb-3 text-sm font-semibold text-white md:mb-4 md:text-base">
            Keyframe Timeline
          </h4>

          <div className="relative">
            <div className="relative h-2 rounded-full bg-gray-700">
              <div
                className="absolute h-full rounded-full bg-orange-500"
                style={{ width: `${progress * 100}%` }}
              />

              {selectedTrick.keyframes.map((kf, i) => (
                <button
                  key={i}
                  type="button"
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full border-2 border-orange-500 bg-white transition-transform hover:scale-125 md:h-3 md:w-3"
                  style={{ left: `${kf.time * 100}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => {
                    setProgress(kf.time)
                    setIsPlaying(false)
                  }}
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3 md:mt-6 md:grid-cols-4 md:gap-2">
              {selectedTrick.keyframes.map((kf, i) => (
                <div
                  key={i}
                  className={`rounded border p-1.5 md:p-2 ${
                    Math.abs(progress - kf.time) < 0.05
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <div className="text-gray-500">@{(kf.time * 100).toFixed(0)}%</div>
                  <div className="truncate text-gray-300">
                    R: ({kf.rotation.x}°, {kf.rotation.y}°, {kf.rotation.z}°)
                  </div>
                  <div className="text-gray-400">Y: {kf.translateY}px</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
