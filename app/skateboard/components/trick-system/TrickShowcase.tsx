'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TRICKS, getTrickById, TRICK_CATEGORIES } from '../../data/tricks'
import { TrickDefinition, TrickKeyframe } from '../../types'

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

  // Interpolate current keyframe values
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
      rotateX: prevKeyframe.rotation.x + (nextKeyframe.rotation.x - prevKeyframe.rotation.x) * easeT,
      rotateY: prevKeyframe.rotation.y + (nextKeyframe.rotation.y - prevKeyframe.rotation.y) * easeT,
      rotateZ: prevKeyframe.rotation.z + (nextKeyframe.rotation.z - prevKeyframe.rotation.z) * easeT,
      scaleX: prevKeyframe.scale.x + (nextKeyframe.scale.x - prevKeyframe.scale.x) * easeT,
      scaleY: prevKeyframe.scale.y + (nextKeyframe.scale.y - prevKeyframe.scale.y) * easeT,
      translateY: prevKeyframe.translateY + (nextKeyframe.translateY - prevKeyframe.translateY) * easeT,
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trick List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Trick Library</h3>

        {Object.entries(TRICK_CATEGORIES).map(([category, trickIds]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {category}
            </h4>
            {trickIds.map((trickId) => {
              const trick = getTrickById(trickId)
              if (!trick) return null

              return (
                <motion.button
                  key={trick.id}
                  onClick={() => handleTrickSelect(trick)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTrick.id === trick.id
                      ? 'bg-orange-500/20 border-orange-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{trick.displayName}</span>
                    <span className="text-sm">{getDifficultyStars(trick.difficulty)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {trick.baseScore} pts • {(trick.duration * 1000).toFixed(0)}ms
                  </div>
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Trick Visualization */}
      <div className="lg:col-span-2 space-y-4">
        {/* 3D Skateboard Preview */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{selectedTrick.displayName}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Difficulty:</span>
              <span>{getDifficultyStars(selectedTrick.difficulty)}</span>
            </div>
          </div>

          {/* 3D Preview Area */}
          <div
            className="relative h-64 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden"
            style={{ perspective: '1000px' }}
          >
            {/* Ground reference */}
            <div className="absolute bottom-8 left-0 right-0 h-px bg-gray-600" />

            {/* Skateboard */}
            <motion.div
              className="absolute left-1/2 bottom-8"
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
              {/* Deck */}
              <div className="relative w-32 h-6 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-lg shadow-lg">
                {/* Grip tape */}
                <div className="absolute inset-1 bg-gray-800 rounded opacity-30" />

                {/* Trucks */}
                <div className="absolute -bottom-2 left-4 w-6 h-2 bg-gray-400 rounded-sm" />
                <div className="absolute -bottom-2 right-4 w-6 h-2 bg-gray-400 rounded-sm" />

                {/* Wheels */}
                <div className="absolute -bottom-4 left-3 w-3 h-3 bg-gray-700 rounded-full border-2 border-gray-600" />
                <div className="absolute -bottom-4 left-8 w-3 h-3 bg-gray-700 rounded-full border-2 border-gray-600" />
                <div className="absolute -bottom-4 right-3 w-3 h-3 bg-gray-700 rounded-full border-2 border-gray-600" />
                <div className="absolute -bottom-4 right-8 w-3 h-3 bg-gray-700 rounded-full border-2 border-gray-600" />
              </div>
            </motion.div>

            {/* Progress indicator */}
            <div className="absolute top-4 left-4 right-4">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            {/* Rotation display */}
            <div className="absolute top-8 right-4 text-xs font-mono text-gray-400 space-y-1">
              <div>X: {currentValues.rotateX.toFixed(1)}°</div>
              <div>Y: {currentValues.rotateY.toFixed(1)}°</div>
              <div>Z: {currentValues.rotateZ.toFixed(1)}°</div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={togglePlayback}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              {isPlaying ? 'Stop' : 'Play Animation'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
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

        {/* Trick Details */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h4 className="font-semibold text-white mb-3">Trick Details</h4>
          <p className="text-gray-400 mb-4">{selectedTrick.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase">Base Score</div>
              <div className="text-xl font-bold text-orange-400">{selectedTrick.baseScore}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase">Duration</div>
              <div className="text-xl font-bold text-cyan-400">{(selectedTrick.duration * 1000).toFixed(0)}ms</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase">Rotation</div>
              <div className="text-xl font-bold text-purple-400">{selectedTrick.rotationAmount}°</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-gray-500 text-xs uppercase">Flips</div>
              <div className="text-xl font-bold text-green-400">{selectedTrick.flipCount}</div>
            </div>
          </div>
        </div>

        {/* Keyframe Timeline */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h4 className="font-semibold text-white mb-4">Keyframe Timeline</h4>

          <div className="relative">
            {/* Timeline track */}
            <div className="h-2 bg-gray-700 rounded-full relative">
              {/* Progress */}
              <div
                className="absolute h-full bg-orange-500 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />

              {/* Keyframe markers */}
              {selectedTrick.keyframes.map((kf, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-orange-500 cursor-pointer hover:scale-125 transition-transform"
                  style={{ left: `${kf.time * 100}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => {
                    setProgress(kf.time)
                    setIsPlaying(false)
                  }}
                />
              ))}
            </div>

            {/* Keyframe values */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {selectedTrick.keyframes.map((kf, i) => (
                <div
                  key={i}
                  className={`p-2 rounded border ${
                    Math.abs(progress - kf.time) < 0.05
                      ? 'bg-orange-500/20 border-orange-500'
                      : 'bg-gray-900/50 border-gray-700'
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
