'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import {
  PhysicsState,
  PhysicsConfig,
  DEFAULT_PHYSICS_CONFIG,
  SkateboardMetrics,
  ControlState,
  Particle,
} from '../../types'
import { TRICKS, getTrickById } from '../../data/tricks'

interface SkatePhysicsProps {
  showDebug?: boolean
  onMetricsUpdate?: (metrics: SkateboardMetrics) => void
}

const GROUND_Y = 280
const BOARD_WIDTH = 120
const BOARD_HEIGHT = 20

export default function SkatePhysics({ showDebug = false, onMetricsUpdate }: SkatePhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const particleIdRef = useRef<number>(0)

  const [physicsConfig, setPhysicsConfig] = useState<PhysicsConfig>(DEFAULT_PHYSICS_CONFIG)
  const [isPlaying, setIsPlaying] = useState(true)

  const physicsState = useRef<PhysicsState>({
    position: { x: 200, y: GROUND_Y },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    angularVelocity: { x: 0, y: 0, z: 0 },
    isGrounded: true,
    isGrinding: false,
  })

  const controls = useRef<ControlState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    trick1: false,
    trick2: false,
    trick3: false,
    trick4: false,
  })

  const [metrics, setMetrics] = useState<SkateboardMetrics>({
    speed: 0,
    maxSpeed: 0,
    airTime: 0,
    totalAirTime: 0,
    currentTrick: null,
    trickCombo: 0,
    score: 0,
    height: 0,
    maxHeight: 0,
    rotationDegrees: 0,
    flipCount: 0,
  })

  const [currentTrick, setCurrentTrick] = useState<string | null>(null)
  const trickProgressRef = useRef<number>(0)
  const airTimeRef = useRef<number>(0)

  // Motion values for smooth board animation
  const boardRotateX = useMotionValue(0)
  const boardRotateY = useMotionValue(0)
  const boardRotateZ = useMotionValue(0)
  const boardY = useMotionValue(0)

  const springRotateX = useSpring(boardRotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(boardRotateY, { stiffness: 300, damping: 30 })
  const springRotateZ = useSpring(boardRotateZ, { stiffness: 300, damping: 30 })

  const createParticle = useCallback(
    (
      x: number,
      y: number,
      type: 'spark' | 'dust' | 'trail' | 'impact',
      vx: number = 0,
      vy: number = 0
    ) => {
      const particle: Particle = {
        id: particleIdRef.current++,
        x,
        y,
        vx: vx + (Math.random() - 0.5) * 100,
        vy: vy + (Math.random() - 0.5) * 50 - 50,
        life: 1,
        maxLife: type === 'spark' ? 0.3 : type === 'dust' ? 0.8 : 0.5,
        size: type === 'spark' ? 3 : type === 'dust' ? 6 : 4,
        color: type === 'spark' ? '#ffa500' : type === 'dust' ? '#8b7355' : '#ffffff',
        alpha: 1,
        type,
      }
      particlesRef.current.push(particle)
    },
    []
  )

  const updateParticles = useCallback((deltaTime: number) => {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.life -= deltaTime / p.maxLife
      p.alpha = p.life
      p.x += p.vx * deltaTime
      p.y += p.vy * deltaTime
      p.vy += 200 * deltaTime // gravity
      return p.life > 0
    })
  }, [])

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach((p) => {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color

      if (p.type === 'spark') {
        // Draw spark as a small bright circle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
      } else if (p.type === 'dust') {
        // Draw dust as fading circle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.5 + p.life * 0.5), 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    })
  }, [])

  const updatePhysics = useCallback(
    (deltaTime: number) => {
      const state = physicsState.current
      const config = physicsConfig

      // Apply horizontal movement
      if (controls.current.left) {
        state.velocity.x -= config.pushForce * deltaTime * 3
      }
      if (controls.current.right) {
        state.velocity.x += config.pushForce * deltaTime * 3
      }

      // Apply gravity
      if (!state.isGrounded) {
        state.velocity.y += config.gravity * deltaTime
        airTimeRef.current += deltaTime
      }

      // Apply friction and air resistance
      if (state.isGrounded) {
        state.velocity.x *= Math.pow(config.friction, deltaTime * 60)

        // Generate dust particles when moving fast on ground
        if (Math.abs(state.velocity.x) > 200 && Math.random() < 0.3) {
          createParticle(
            state.position.x + (Math.random() - 0.5) * BOARD_WIDTH,
            GROUND_Y + 5,
            'dust',
            -state.velocity.x * 0.1,
            -20
          )
        }
      } else {
        state.velocity.x *= Math.pow(config.airResistance, deltaTime * 60)
      }

      // Clamp velocity
      state.velocity.x = Math.max(
        -config.maxVelocity,
        Math.min(config.maxVelocity, state.velocity.x)
      )

      // Update position
      state.position.x += state.velocity.x * deltaTime
      state.position.y += state.velocity.y * deltaTime

      // Ground collision
      if (state.position.y >= GROUND_Y) {
        state.position.y = GROUND_Y
        if (!state.isGrounded && state.velocity.y > 50) {
          // Landing impact
          for (let i = 0; i < 5; i++) {
            createParticle(
              state.position.x + (Math.random() - 0.5) * BOARD_WIDTH,
              GROUND_Y,
              'impact',
              (Math.random() - 0.5) * 100,
              -Math.random() * 100
            )
          }

          // Generate sparks if landing while moving fast
          if (Math.abs(state.velocity.x) > 150) {
            for (let i = 0; i < 3; i++) {
              createParticle(
                state.position.x + (state.velocity.x > 0 ? -BOARD_WIDTH / 2 : BOARD_WIDTH / 2),
                GROUND_Y,
                'spark',
                state.velocity.x * 0.5,
                -50
              )
            }
          }
        }

        state.velocity.y = 0
        state.isGrounded = true

        // Record air time
        if (airTimeRef.current > 0) {
          setMetrics((prev) => ({
            ...prev,
            totalAirTime: prev.totalAirTime + airTimeRef.current,
            airTime: 0,
          }))
          airTimeRef.current = 0
        }

        // Reset rotations on landing
        if (currentTrick) {
          // Complete trick and add score
          const trick = getTrickById(currentTrick)
          if (trick) {
            setMetrics((prev) => ({
              ...prev,
              score: prev.score + trick.baseScore * (prev.trickCombo + 1),
              trickCombo: prev.trickCombo + 1,
              currentTrick: null,
            }))
          }
          setCurrentTrick(null)
          trickProgressRef.current = 0
        }

        state.rotation = { x: 0, y: 0, z: 0 }
        boardRotateX.set(0)
        boardRotateY.set(0)
        boardRotateZ.set(0)
      } else {
        state.isGrounded = false
      }

      // Wrap around screen
      const canvas = canvasRef.current
      if (canvas) {
        if (state.position.x < -BOARD_WIDTH) state.position.x = canvas.width + BOARD_WIDTH
        if (state.position.x > canvas.width + BOARD_WIDTH) state.position.x = -BOARD_WIDTH
      }

      // Update trick animation
      if (currentTrick && !state.isGrounded) {
        const trick = getTrickById(currentTrick)
        if (trick) {
          trickProgressRef.current += deltaTime / trick.duration

          if (trickProgressRef.current >= 1) {
            trickProgressRef.current = 1
          }

          // Interpolate keyframes
          const progress = trickProgressRef.current
          let prevKeyframe = trick.keyframes[0]
          let nextKeyframe = trick.keyframes[trick.keyframes.length - 1]

          for (let i = 0; i < trick.keyframes.length - 1; i++) {
            if (progress >= trick.keyframes[i].time && progress <= trick.keyframes[i + 1].time) {
              prevKeyframe = trick.keyframes[i]
              nextKeyframe = trick.keyframes[i + 1]
              break
            }
          }

          const t =
            (progress - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time) || 0
          const easeT = t * t * (3 - 2 * t) // smoothstep

          state.rotation.x =
            prevKeyframe.rotation.x + (nextKeyframe.rotation.x - prevKeyframe.rotation.x) * easeT
          state.rotation.y =
            prevKeyframe.rotation.y + (nextKeyframe.rotation.y - prevKeyframe.rotation.y) * easeT
          state.rotation.z =
            prevKeyframe.rotation.z + (nextKeyframe.rotation.z - prevKeyframe.rotation.z) * easeT

          boardRotateX.set(state.rotation.x)
          boardRotateY.set(state.rotation.y)
          boardRotateZ.set(state.rotation.z)
        }
      }

      // Update metrics
      const speed = Math.abs(state.velocity.x)
      const height = Math.max(0, GROUND_Y - state.position.y)

      setMetrics((prev) => ({
        ...prev,
        speed,
        maxSpeed: Math.max(prev.maxSpeed, speed),
        airTime: airTimeRef.current,
        height,
        maxHeight: Math.max(prev.maxHeight, height),
        rotationDegrees: Math.abs(state.rotation.x) + Math.abs(state.rotation.y),
        currentTrick,
      }))

      if (onMetricsUpdate) {
        onMetricsUpdate(metrics)
      }
    },
    [physicsConfig, currentTrick, createParticle, boardRotateX, boardRotateY, boardRotateZ, metrics, onMetricsUpdate]
  )

  const drawSkateboard = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const state = physicsState.current
      const { x, y } = state.position

      ctx.save()
      ctx.translate(x, y)

      // Apply 3D-like rotation transforms
      const rotX = state.rotation.x * (Math.PI / 180)
      const rotY = state.rotation.y * (Math.PI / 180)
      const rotZ = state.rotation.z * (Math.PI / 180)

      // Simulate 3D by scaling based on rotation
      const scaleY = Math.cos(rotX)
      const scaleX = Math.cos(rotY)

      ctx.rotate(rotZ)
      ctx.scale(scaleX || 0.1, scaleY || 0.1)

      // Draw skateboard deck
      const gradient = ctx.createLinearGradient(-BOARD_WIDTH / 2, 0, BOARD_WIDTH / 2, 0)
      gradient.addColorStop(0, '#2d1f1f')
      gradient.addColorStop(0.5, '#4a3535')
      gradient.addColorStop(1, '#2d1f1f')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(-BOARD_WIDTH / 2, -BOARD_HEIGHT / 2, BOARD_WIDTH, BOARD_HEIGHT, 8)
      ctx.fill()

      // Deck design
      ctx.fillStyle = '#ff6b35'
      ctx.beginPath()
      ctx.roundRect(-BOARD_WIDTH / 2 + 10, -BOARD_HEIGHT / 2 + 3, BOARD_WIDTH - 20, BOARD_HEIGHT - 6, 4)
      ctx.fill()

      // Grip tape texture
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      for (let i = 0; i < 20; i++) {
        const gx = -BOARD_WIDTH / 2 + 15 + (i * (BOARD_WIDTH - 30)) / 20
        const gy = -BOARD_HEIGHT / 2 + 5 + (Math.random() * (BOARD_HEIGHT - 10))
        ctx.fillRect(gx, gy, 2, 2)
      }

      // Draw trucks
      ctx.fillStyle = '#888'
      // Front truck
      ctx.fillRect(-BOARD_WIDTH / 2 + 15, BOARD_HEIGHT / 2, 20, 8)
      // Back truck
      ctx.fillRect(BOARD_WIDTH / 2 - 35, BOARD_HEIGHT / 2, 20, 8)

      // Draw wheels
      ctx.fillStyle = '#333'
      const wheelPositions = [
        { x: -BOARD_WIDTH / 2 + 18, y: BOARD_HEIGHT / 2 + 8 },
        { x: -BOARD_WIDTH / 2 + 32, y: BOARD_HEIGHT / 2 + 8 },
        { x: BOARD_WIDTH / 2 - 32, y: BOARD_HEIGHT / 2 + 8 },
        { x: BOARD_WIDTH / 2 - 18, y: BOARD_HEIGHT / 2 + 8 },
      ]

      wheelPositions.forEach((pos) => {
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Wheel highlight
        ctx.fillStyle = '#555'
        ctx.beginPath()
        ctx.arc(pos.x - 2, pos.y - 2, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#333'
      })

      ctx.restore()

      // Draw shadow
      ctx.save()
      ctx.fillStyle = `rgba(0,0,0,${0.3 * (1 - (GROUND_Y - state.position.y) / 200)})`
      ctx.beginPath()
      ctx.ellipse(
        x,
        GROUND_Y + 15,
        BOARD_WIDTH / 2 * (1 - (GROUND_Y - state.position.y) / 400),
        8 * (1 - (GROUND_Y - state.position.y) / 400),
        0,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.restore()
    },
    []
  )

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y)
    skyGradient.addColorStop(0, '#1a1a2e')
    skyGradient.addColorStop(1, '#16213e')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvas.width, GROUND_Y)

    // Ground
    const groundGradient = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height)
    groundGradient.addColorStop(0, '#2c3e50')
    groundGradient.addColorStop(1, '#1a252f')
    ctx.fillStyle = groundGradient
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y)

    // Ground line
    ctx.strokeStyle = '#4a5568'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(canvas.width, GROUND_Y)
    ctx.stroke()

    // Grid lines on ground
    ctx.strokeStyle = 'rgba(74, 85, 104, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, GROUND_Y)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
  }, [])

  const animate = useCallback(
    (timestamp: number) => {
      if (!isPlaying) return

      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      // Clear and draw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground(ctx, canvas)
      updatePhysics(deltaTime)
      updateParticles(deltaTime)
      drawParticles(ctx)
      drawSkateboard(ctx)

      // Debug info
      if (showDebug) {
        ctx.fillStyle = '#00ff00'
        ctx.font = '12px monospace'
        ctx.fillText(`Pos: ${physicsState.current.position.x.toFixed(0)}, ${physicsState.current.position.y.toFixed(0)}`, 10, 20)
        ctx.fillText(`Vel: ${physicsState.current.velocity.x.toFixed(0)}, ${physicsState.current.velocity.y.toFixed(0)}`, 10, 35)
        ctx.fillText(`Grounded: ${physicsState.current.isGrounded}`, 10, 50)
        ctx.fillText(`Particles: ${particlesRef.current.length}`, 10, 65)
      }

      animationRef.current = requestAnimationFrame(animate)
    },
    [isPlaying, showDebug, drawBackground, updatePhysics, updateParticles, drawParticles, drawSkateboard]
  )

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          controls.current.left = true
          break
        case 'd':
        case 'arrowright':
          controls.current.right = true
          break
        case ' ':
        case 'w':
        case 'arrowup':
          if (physicsState.current.isGrounded && !currentTrick) {
            physicsState.current.velocity.y = -physicsConfig.jumpForce
            physicsState.current.isGrounded = false
          }
          break
        case '1':
          if (!physicsState.current.isGrounded && !currentTrick) {
            setCurrentTrick('ollie')
          }
          break
        case '2':
          if (!physicsState.current.isGrounded && !currentTrick) {
            setCurrentTrick('kickflip')
          }
          break
        case '3':
          if (!physicsState.current.isGrounded && !currentTrick) {
            setCurrentTrick('heelflip')
          }
          break
        case '4':
          if (!physicsState.current.isGrounded && !currentTrick) {
            setCurrentTrick('360-flip')
          }
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          controls.current.left = false
          break
        case 'd':
        case 'arrowright':
          controls.current.right = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [physicsConfig.jumpForce, currentTrick])

  // Initialize and start animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div className="flex flex-col gap-4">
      {/* Main Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-gray-700">
        <canvas
          ref={canvasRef}
          className="w-full h-[350px] bg-gray-900"
        />

        {/* Current trick display */}
        {currentTrick && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-orange-500/80 rounded-lg"
          >
            <span className="text-white font-bold text-lg">
              {getTrickById(currentTrick)?.displayName}
            </span>
          </motion.div>
        )}

        {/* Score display */}
        <div className="absolute top-4 right-4 text-right">
          <div className="text-2xl font-bold text-white">{metrics.score.toLocaleString()}</div>
          {metrics.trickCombo > 0 && (
            <div className="text-orange-400 text-sm">x{metrics.trickCombo} combo</div>
          )}
        </div>
      </div>

      {/* Controls info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-gray-400 mb-1">Move</div>
          <div className="flex gap-2">
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">A/D</kbd>
            <span className="text-gray-500">or</span>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←/→</kbd>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-gray-400 mb-1">Jump</div>
          <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Space</kbd>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-gray-400 mb-1">Tricks (in air)</div>
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">1</kbd>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">2</kbd>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">3</kbd>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">4</kbd>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-gray-400 mb-1">Speed</div>
          <div className="text-xl font-mono text-cyan-400">{metrics.speed.toFixed(0)} px/s</div>
        </div>
      </div>

      {/* Physics Controls */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Physics Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Gravity: {physicsConfig.gravity}
            </label>
            <input
              type="range"
              min="200"
              max="2000"
              value={physicsConfig.gravity}
              onChange={(e) =>
                setPhysicsConfig((prev) => ({ ...prev, gravity: Number(e.target.value) }))
              }
              className="w-full accent-orange-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Jump Force: {physicsConfig.jumpForce}
            </label>
            <input
              type="range"
              min="200"
              max="800"
              value={physicsConfig.jumpForce}
              onChange={(e) =>
                setPhysicsConfig((prev) => ({ ...prev, jumpForce: Number(e.target.value) }))
              }
              className="w-full accent-orange-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Friction: {physicsConfig.friction.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.9"
              max="1"
              step="0.01"
              value={physicsConfig.friction}
              onChange={(e) =>
                setPhysicsConfig((prev) => ({ ...prev, friction: Number(e.target.value) }))
              }
              className="w-full accent-orange-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">
              Push Force: {physicsConfig.pushForce}
            </label>
            <input
              type="range"
              min="100"
              max="500"
              value={physicsConfig.pushForce}
              onChange={(e) =>
                setPhysicsConfig((prev) => ({ ...prev, pushForce: Number(e.target.value) }))
              }
              className="w-full accent-orange-500"
            />
          </div>
        </div>
        <button
          onClick={() => setPhysicsConfig(DEFAULT_PHYSICS_CONFIG)}
          className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
