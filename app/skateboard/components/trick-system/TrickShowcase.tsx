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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <h3 className="mb-4 text-lg font-semibold text-white">Trick Library</h3>

        {Object.entries(TRICK_CATEGORIES).map(([category, trickIds]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium tracking-wider text-gray-400 uppercase">
              {category}
            </h4>
            {trickIds.map((trickId) => {
              const trick = getTrickById(trickId)
              if (!trick) return null

              return (
                <motion.button
                  key={trick.id}
                  onClick={() => handleTrickSelect(trick)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selectedTrick.id === trick.id
                      ? 'border-orange-500 bg-orange-500/20 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{trick.displayName}</span>
                    <span className="text-sm">{getDifficultyStars(trick.difficulty)}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {trick.baseScore} pts • {(trick.duration * 1000).toFixed(0)}ms
                  </div>
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{selectedTrick.displayName}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Difficulty:</span>
              <span>{getDifficultyStars(selectedTrick.difficulty)}</span>
            </div>
          </div>

          <div
            className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-gray-800"
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
                <div className="absolute left-4 -bottom-2 h-2 w-6 rounded-sm bg-gray-400" />
                <div className="absolute right-4 -bottom-2 h-2 w-6 rounded-sm bg-gray-400" />
                <div className="absolute left-3 -bottom-4 h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-700" />
                <div className="absolute left-8 -bottom-4 h-3 w-3 rounded-full border-2 border-gray-600 bg-gray-700" />
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

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={togglePlayback}
              className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-600"
            >
              {isPlaying ? 'Stop' : 'Play Animation'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="rounded border border-gray-600 bg-gray-700 px-3 py-1 text-white"
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
              className="flex-1 accent-orange-500"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h4 className="mb-3 font-semibold text-white">Trick Details</h4>
          <p className="mb-4 text-gray-400">{selectedTrick.description}</p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-900/50 p-3">
              <div className="text-xs text-gray-500 uppercase">Base Score</div>
              <div className="text-xl font-bold text-orange-400">{selectedTrick.baseScore}</div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3">
              <div className="text-xs text-gray-500 uppercase">Duration</div>
              <div className="text-xl font-bold text-cyan-400">
                {(selectedTrick.duration * 1000).toFixed(0)}ms
              </div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3">
              <div className="text-xs text-gray-500 uppercase">Rotation</div>
              <div className="text-xl font-bold text-purple-400">
                {selectedTrick.rotationAmount}°
              </div>
            </div>
            <div className="rounded-lg bg-gray-900/50 p-3">
              <div className="text-xs text-gray-500 uppercase">Flips</div>
              <div className="text-xl font-bold text-green-400">{selectedTrick.flipCount}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <h4 className="mb-4 font-semibold text-white">Keyframe Timeline</h4>

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
                  className="absolute top-1/2 h-3 w-3 -translate-y-1/2 cursor-pointer rounded-full border-2 border-orange-500 bg-white transition-transform hover:scale-125"
                  style={{ left: `${kf.time * 100}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => {
                    setProgress(kf.time)
                    setIsPlaying(false)
                  }}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
              {selectedTrick.keyframes.map((kf, i) => (
                <div
                  key={i}
                  className={`rounded border p-2 ${
                    Math.abs(progress - kf.time) < 0.05
                      ? 'border-orange-500 bg-orange-500/20'
                      : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <div className="text-gray-500">@{(kf.time * 100).toFixed(0)}%</div>
                  <div className="text-gray-300">
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
