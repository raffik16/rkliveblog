'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const GRAVITY = 0.5
const JUMP_FORCE = -11
const INITIAL_SPEED = 4
const SPEED_INCREMENT = 0.002
const GAP_SIZE = 180

interface Hold {
  x: number
  y: number
  width: number
  passed: boolean
}

interface GameState {
  status: 'menu' | 'playing' | 'gameover'
  score: number
  highScore: number
}

export default function ClimbingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    score: 0,
    highScore:
      typeof window !== 'undefined' ? parseInt(localStorage.getItem('climbHighScore') || '0') : 0,
  })

  // Game refs for real-time updates
  const climberRef = useRef({ y: CANVAS_HEIGHT / 2, velocity: 0 })
  const holdsRef = useRef<Hold[]>([])
  const speedRef = useRef(INITIAL_SPEED)
  const scoreRef = useRef(0)

  const generateHold = useCallback((startX: number): Hold => {
    const minY = 80
    const maxY = CANVAS_HEIGHT - 80 - GAP_SIZE
    const y = minY + Math.random() * (maxY - minY)

    return {
      x: startX,
      y: y + GAP_SIZE / 2,
      width: 60,
      passed: false,
    }
  }, [])

  const initGame = useCallback(() => {
    climberRef.current = { y: CANVAS_HEIGHT / 2, velocity: 0 }
    speedRef.current = INITIAL_SPEED
    scoreRef.current = 0

    // Generate initial holds
    const holds: Hold[] = []
    for (let i = 0; i < 5; i++) {
      holds.push(generateHold(CANVAS_WIDTH + i * 200))
    }
    holdsRef.current = holds
  }, [generateHold])

  const jump = useCallback(() => {
    if (gameState.status === 'playing') {
      climberRef.current.velocity = JUMP_FORCE
    }
  }, [gameState.status])

  const endGame = useCallback(() => {
    const finalScore = scoreRef.current
    setGameState((prev) => {
      const newHighScore = Math.max(prev.highScore, finalScore)
      if (typeof window !== 'undefined') {
        localStorage.setItem('climbHighScore', newHighScore.toString())
      }
      return {
        status: 'gameover',
        score: finalScore,
        highScore: newHighScore,
      }
    })
  }, [])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const climber = climberRef.current
    const holds = holdsRef.current

    // Update physics
    climber.velocity += GRAVITY
    climber.y += climber.velocity

    // Increase speed over time
    speedRef.current += SPEED_INCREMENT

    // Update holds
    holds.forEach((hold) => {
      hold.x -= speedRef.current
    })

    // Remove off-screen holds and add new ones
    if (holds.length > 0 && holds[0].x < -80) {
      holds.shift()
      const lastHold = holds[holds.length - 1]
      holds.push(generateHold(lastHold.x + 200))
    }

    // Check collisions
    const climberX = 100
    const climberSize = 20

    for (const hold of holds) {
      // Check if climber is in the hold's x range
      if (climberX + climberSize > hold.x && climberX - climberSize < hold.x + hold.width) {
        // Check if climber is outside the gap
        if (
          climber.y - climberSize < hold.y - GAP_SIZE / 2 ||
          climber.y + climberSize > hold.y + GAP_SIZE / 2
        ) {
          endGame()
          return
        }
      }

      // Score when passing a hold
      if (!hold.passed && hold.x + hold.width < climberX) {
        hold.passed = true
        scoreRef.current++
        setGameState((prev) => ({ ...prev, score: scoreRef.current }))
      }
    }

    // Check boundaries
    if (climber.y < 0 || climber.y > CANVAS_HEIGHT) {
      endGame()
      return
    }

    // Render
    // Background gradient (rock face)
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Rock texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < 30; i++) {
      const x = (i * 67 + speedRef.current * 10) % CANVAS_WIDTH
      const y = (i * 43) % CANVAS_HEIGHT
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw holds (rock formations with gap)
    holds.forEach((hold) => {
      // Top rock
      ctx.fillStyle = '#4a3728'
      ctx.fillRect(hold.x, 0, hold.width, hold.y - GAP_SIZE / 2)

      // Top rock edge
      ctx.fillStyle = '#5d4a3a'
      ctx.fillRect(hold.x, hold.y - GAP_SIZE / 2 - 15, hold.width, 15)

      // Bottom rock
      ctx.fillStyle = '#4a3728'
      ctx.fillRect(hold.x, hold.y + GAP_SIZE / 2, hold.width, CANVAS_HEIGHT - hold.y - GAP_SIZE / 2)

      // Bottom rock edge
      ctx.fillStyle = '#5d4a3a'
      ctx.fillRect(hold.x, hold.y + GAP_SIZE / 2, hold.width, 15)

      // Handhold markers
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.ellipse(hold.x + hold.width / 2, hold.y - GAP_SIZE / 2 + 5, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.ellipse(hold.x + hold.width / 2, hold.y + GAP_SIZE / 2 - 5, 12, 6, 0, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw climber
    const climberDrawX = climberX

    // Body
    ctx.fillStyle = '#FF5B04'
    ctx.beginPath()
    ctx.ellipse(climberDrawX, climber.y, 18, 22, 0, 0, Math.PI * 2)
    ctx.fill()

    // Head
    ctx.fillStyle = '#FFD5B8'
    ctx.beginPath()
    ctx.arc(climberDrawX, climber.y - 18, 10, 0, Math.PI * 2)
    ctx.fill()

    // Arms (reaching based on velocity)
    const armAngle = climber.velocity < 0 ? -0.5 : 0.3
    ctx.strokeStyle = '#FFD5B8'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'

    // Left arm
    ctx.beginPath()
    ctx.moveTo(climberDrawX - 12, climber.y - 8)
    ctx.lineTo(climberDrawX - 25, climber.y - 20 + armAngle * 20)
    ctx.stroke()

    // Right arm
    ctx.beginPath()
    ctx.moveTo(climberDrawX + 12, climber.y - 8)
    ctx.lineTo(climberDrawX + 25, climber.y - 20 + armAngle * 20)
    ctx.stroke()

    // Legs
    ctx.strokeStyle = '#2D3748'
    ctx.lineWidth = 5

    ctx.beginPath()
    ctx.moveTo(climberDrawX - 5, climber.y + 15)
    ctx.lineTo(climberDrawX - 10, climber.y + 32)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(climberDrawX + 5, climber.y + 15)
    ctx.lineTo(climberDrawX + 10, climber.y + 32)
    ctx.stroke()

    // UI - Score
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(scoreRef.current.toString(), CANVAS_WIDTH / 2, 60)

    // Speed indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '14px Arial'
    ctx.fillText(`Speed: ${speedRef.current.toFixed(1)}x`, CANVAS_WIDTH / 2, 85)

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [endGame, generateHold])

  const startGame = useCallback(() => {
    initGame()
    setGameState((prev) => ({ ...prev, status: 'playing', score: 0 }))
  }, [initGame])

  // Start game loop when playing
  useEffect(() => {
    if (gameState.status === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.status, gameLoop])

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (gameState.status === 'menu' || gameState.status === 'gameover') {
          startGame()
        } else {
          jump()
        }
      }
    }

    const handleInteraction = (e: Event) => {
      e.preventDefault()
      if (gameState.status === 'menu' || gameState.status === 'gameover') {
        startGame()
      } else {
        jump()
      }
    }

    const canvas = canvasRef.current
    window.addEventListener('keydown', handleKeyDown)
    canvas?.addEventListener('click', handleInteraction)
    canvas?.addEventListener('touchstart', handleInteraction, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      canvas?.removeEventListener('click', handleInteraction)
      canvas?.removeEventListener('touchstart', handleInteraction)
    }
  }, [gameState.status, jump, startGame])

  // Draw menu/gameover states
  useEffect(() => {
    if (gameState.status !== 'playing') {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.textAlign = 'center'

      if (gameState.status === 'menu') {
        // Title
        ctx.fillStyle = '#FFF'
        ctx.font = 'bold 42px Arial'
        ctx.fillText('FREE SOLO', CANVAS_WIDTH / 2, 180)

        ctx.fillStyle = '#FF5B04'
        ctx.font = 'bold 36px Arial'
        ctx.fillText('CLIMBER', CANVAS_WIDTH / 2, 225)

        // Instructions
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '18px Arial'
        ctx.fillText('Press SPACE or Tap to jump', CANVAS_WIDTH / 2, 320)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '14px Arial'
        ctx.fillText('Navigate through the gaps', CANVAS_WIDTH / 2, 350)
        ctx.fillText('Speed increases over time!', CANVAS_WIDTH / 2, 375)

        // Start prompt
        ctx.fillStyle = '#FF5B04'
        ctx.font = 'bold 24px Arial'
        ctx.fillText('TAP TO START', CANVAS_WIDTH / 2, 450)

        if (gameState.highScore > 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.font = '16px Arial'
          ctx.fillText(`Best: ${gameState.highScore}`, CANVAS_WIDTH / 2, 500)
        }
      } else if (gameState.status === 'gameover') {
        // Game Over
        ctx.fillStyle = '#FF4444'
        ctx.font = 'bold 36px Arial'
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 150)

        // Score
        ctx.fillStyle = '#FFF'
        ctx.font = 'bold 72px Arial'
        ctx.fillText(gameState.score.toString(), CANVAS_WIDTH / 2, 260)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '18px Arial'
        ctx.fillText('SCORE', CANVAS_WIDTH / 2, 295)

        // High score
        if (gameState.score >= gameState.highScore && gameState.score > 0) {
          ctx.fillStyle = '#FFD700'
          ctx.font = 'bold 20px Arial'
          ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, 350)
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
          ctx.font = '16px Arial'
          ctx.fillText(`Best: ${gameState.highScore}`, CANVAS_WIDTH / 2, 350)
        }

        // Restart prompt
        ctx.fillStyle = '#FF5B04'
        ctx.font = 'bold 24px Arial'
        ctx.fillText('TAP TO RETRY', CANVAS_WIDTH / 2, 450)
      }
    }
  }, [gameState])

  const shareScore = () => {
    const text = `I scored ${gameState.score} in Free Solo Climber! Can you beat me? 🧗‍♂️`
    if (navigator.share) {
      navigator.share({ title: 'Free Solo Climber', text, url: window.location.href })
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="cursor-pointer rounded-2xl shadow-2xl shadow-black/50"
        style={{ touchAction: 'none' }}
      />

      {gameState.status === 'gameover' && (
        <button
          onClick={shareScore}
          className="mt-4 rounded-xl bg-white/10 px-6 py-2 font-bold text-white transition-all hover:bg-white/20"
        >
          SHARE SCORE
        </button>
      )}
    </div>
  )
}
