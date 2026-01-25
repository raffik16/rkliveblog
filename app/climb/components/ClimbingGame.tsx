'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { Hold, Obstacle, Particle, Climber, GameState, WindGust } from '../types'

const GRAVITY = 0.35
const JUMP_FORCE = -9
const HOLD_SPACING = 120
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 700

export default function ClimbingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    score: 0,
    highScore:
      typeof window !== 'undefined' ? parseInt(localStorage.getItem('climbHighScore') || '0') : 0,
    altitude: 0,
    maxAltitude: 0,
    difficulty: 1,
    combo: 0,
    maxCombo: 0,
  })

  const climberRef = useRef<Climber>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 150,
    velocityY: 0,
    velocityX: 0,
    rotation: 0,
    state: 'climbing',
    stamina: 100,
    leftHand: { x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - 160 },
    rightHand: { x: CANVAS_WIDTH / 2 + 15, y: CANVAS_HEIGHT - 160 },
    activeHand: 'right',
  })

  const holdsRef = useRef<Hold[]>([])
  const obstaclesRef = useRef<Obstacle[]>([])
  const particlesRef = useRef<Particle[]>([])
  const windRef = useRef<WindGust>({
    active: false,
    direction: 'left',
    strength: 0,
    duration: 0,
    timer: 0,
  })

  const cameraYRef = useRef(0)
  const holdIdCounter = useRef(0)
  const obstacleIdCounter = useRef(0)
  const frameCountRef = useRef(0)
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 })
  const currentHoldRef = useRef<Hold | null>(null)

  // Initialize holds
  const initializeHolds = useCallback(() => {
    const holds: Hold[] = []
    const startY = CANVAS_HEIGHT - 100

    // Starting hold
    holds.push({
      id: holdIdCounter.current++,
      x: CANVAS_WIDTH / 2 - 25,
      y: startY,
      width: 50,
      height: 20,
      type: 'stable',
      grabbed: true,
    })

    // Generate initial holds
    for (let i = 1; i < 20; i++) {
      const prevHold = holds[holds.length - 1]
      const xOffset = (Math.random() - 0.5) * 150
      const newX = Math.max(50, Math.min(CANVAS_WIDTH - 80, prevHold.x + xOffset))

      holds.push({
        id: holdIdCounter.current++,
        x: newX,
        y: startY - i * HOLD_SPACING,
        width: 30 + Math.random() * 25,
        height: 15 + Math.random() * 10,
        type: getRandomHoldType(i),
        grabbed: false,
      })
    }

    holdsRef.current = holds
    currentHoldRef.current = holds[0]
  }, [])

  const getRandomHoldType = (altitude: number): Hold['type'] => {
    const rand = Math.random()
    const difficultyFactor = Math.min(altitude / 50, 0.6)

    if (rand < 0.1 + difficultyFactor * 0.2) return 'crumbling'
    if (rand < 0.15 + difficultyFactor * 0.15) return 'icy'
    if (rand < 0.2) return 'perfect'
    return 'stable'
  }

  // Generate new holds as player climbs
  const generateHolds = useCallback(() => {
    const topHold = holdsRef.current.reduce(
      (top, hold) => (hold.y < top.y ? hold : top),
      holdsRef.current[0]
    )

    while (topHold.y > cameraYRef.current - 500) {
      const xOffset = (Math.random() - 0.5) * 180
      const lastHold = holdsRef.current[holdsRef.current.length - 1]
      const newX = Math.max(40, Math.min(CANVAS_WIDTH - 70, lastHold.x + xOffset))
      const altitude = Math.abs(lastHold.y - CANVAS_HEIGHT + 100) / HOLD_SPACING

      holdsRef.current.push({
        id: holdIdCounter.current++,
        x: newX,
        y: lastHold.y - HOLD_SPACING,
        width: 25 + Math.random() * 30,
        height: 12 + Math.random() * 12,
        type: getRandomHoldType(altitude),
        grabbed: false,
      })
    }

    // Remove holds below camera
    holdsRef.current = holdsRef.current.filter(
      (hold) => hold.y < cameraYRef.current + CANVAS_HEIGHT + 100
    )
  }, [])

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    const altitude = Math.abs(cameraYRef.current) / 100
    const spawnChance = Math.min(0.02 + altitude * 0.001, 0.06)

    if (Math.random() < spawnChance) {
      const side = Math.random() < 0.5 ? 'left' : 'right'
      const type: Obstacle['type'] = Math.random() < 0.7 ? 'rock' : 'bird'

      obstaclesRef.current.push({
        id: obstacleIdCounter.current++,
        type,
        x: side === 'left' ? -30 : CANVAS_WIDTH + 30,
        y: cameraYRef.current + Math.random() * CANVAS_HEIGHT * 0.5,
        width: type === 'rock' ? 25 + Math.random() * 20 : 30,
        height: type === 'rock' ? 25 + Math.random() * 20 : 20,
        velocityX: side === 'left' ? 2 + Math.random() * 2 : -(2 + Math.random() * 2),
        velocityY: type === 'rock' ? 1 + Math.random() * 2 : 0,
        rotation: 0,
      })
    }
  }, [])

  // Spawn wind gusts
  const triggerWind = useCallback(() => {
    const altitude = Math.abs(cameraYRef.current) / 100
    const windChance = Math.min(0.005 + altitude * 0.0005, 0.02)

    if (!windRef.current.active && Math.random() < windChance) {
      windRef.current = {
        active: true,
        direction: Math.random() < 0.5 ? 'left' : 'right',
        strength: 2 + Math.random() * 3,
        duration: 60 + Math.random() * 90,
        timer: 0,
      }
    }
  }, [])

  // Create particles
  const createParticles = useCallback(
    (x: number, y: number, count: number, type: Particle['type'], color: string) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          velocityX: (Math.random() - 0.5) * 6,
          velocityY: (Math.random() - 0.5) * 6,
          life: 30 + Math.random() * 30,
          maxLife: 60,
          size: 2 + Math.random() * 4,
          color,
          type,
        })
      }
    },
    []
  )

  // Screen shake
  const triggerShake = useCallback((intensity: number) => {
    shakeRef.current.intensity = intensity
  }, [])

  // Jump/grab action
  const handleJump = useCallback(() => {
    if (gameState.status !== 'playing') return

    const climber = climberRef.current

    if (climber.state === 'climbing' || climber.state === 'grabbing') {
      // Find nearest hold above current position
      const targetHold = holdsRef.current
        .filter(
          (h) => h.y < climber.y - 30 && !h.grabbed && Math.abs(h.x + h.width / 2 - climber.x) < 100
        )
        .sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow(a.x + a.width / 2 - climber.x, 2) + Math.pow(a.y - climber.y, 2)
          )
          const distB = Math.sqrt(
            Math.pow(b.x + b.width / 2 - climber.x, 2) + Math.pow(b.y - climber.y, 2)
          )
          return distA - distB
        })[0]

      if (targetHold) {
        // Calculate jump direction
        const dx = targetHold.x + targetHold.width / 2 - climber.x
        const dy = targetHold.y - climber.y

        climber.state = 'jumping'
        climber.velocityY = JUMP_FORCE
        climber.velocityX = dx * 0.08

        // Release current hold
        if (currentHoldRef.current) {
          currentHoldRef.current.grabbed = false
        }

        // Chalk dust effect
        createParticles(climber.x, climber.y, 8, 'chalk', 'rgba(255, 255, 255, 0.8)')

        // Play jump sound effect (visual feedback)
        gsap.to(climberRef.current, {
          rotation: dx > 0 ? 15 : -15,
          duration: 0.1,
        })
      }
    }
  }, [gameState.status, createParticles])

  // Check hold collision
  const checkHoldCollision = useCallback(() => {
    const climber = climberRef.current

    if (climber.state !== 'jumping' || climber.velocityY < 0) return

    for (const hold of holdsRef.current) {
      if (hold.grabbed) continue

      const holdCenterX = hold.x + hold.width / 2
      const holdCenterY = hold.y + hold.height / 2

      const dx = Math.abs(climber.x - holdCenterX)
      const dy = Math.abs(climber.y - holdCenterY)

      if (dx < hold.width / 2 + 20 && dy < hold.height / 2 + 25) {
        // Grabbed the hold!
        climber.state = 'grabbing'
        climber.velocityY = 0
        climber.velocityX = 0
        climber.x = holdCenterX
        climber.y = hold.y + 20
        hold.grabbed = true
        currentHoldRef.current = hold

        // Update score
        const points = hold.type === 'perfect' ? 50 : hold.type === 'crumbling' ? 30 : 10

        setGameState((prev) => {
          const newCombo = prev.combo + 1
          const comboMultiplier = Math.min(newCombo, 10)
          const totalPoints = points * comboMultiplier
          const newScore = prev.score + totalPoints
          const newAltitude = Math.abs(hold.y - CANVAS_HEIGHT + 100)
          const newMaxAltitude = Math.max(prev.maxAltitude, newAltitude)

          return {
            ...prev,
            score: newScore,
            altitude: newAltitude,
            maxAltitude: newMaxAltitude,
            combo: newCombo,
            maxCombo: Math.max(prev.maxCombo, newCombo),
            difficulty: 1 + Math.floor(newMaxAltitude / 1000) * 0.1,
          }
        })

        // Effects based on hold type
        if (hold.type === 'perfect') {
          createParticles(climber.x, climber.y, 15, 'spark', '#FFD700')
          triggerShake(3)
        } else if (hold.type === 'crumbling') {
          hold.crumbleTimer = 90 // 1.5 seconds at 60fps
          createParticles(climber.x, climber.y, 10, 'dust', '#8B4513')
        } else if (hold.type === 'icy') {
          createParticles(climber.x, climber.y, 8, 'snow', '#ADD8E6')
        } else {
          createParticles(climber.x, climber.y, 5, 'chalk', 'rgba(255, 255, 255, 0.6)')
        }

        gsap.to(climberRef.current, {
          rotation: 0,
          duration: 0.2,
        })

        // Transition to climbing state
        setTimeout(() => {
          if (climberRef.current.state === 'grabbing') {
            climberRef.current.state = 'climbing'
          }
        }, 200)

        return
      }
    }
  }, [createParticles, triggerShake])

  // Check obstacle collision
  const checkObstacleCollision = useCallback(() => {
    const climber = climberRef.current

    for (const obstacle of obstaclesRef.current) {
      const dx = Math.abs(climber.x - obstacle.x)
      const dy = Math.abs(climber.y - obstacle.y)

      if (dx < obstacle.width / 2 + 15 && dy < obstacle.height / 2 + 20) {
        // Hit by obstacle!
        climber.state = 'falling'
        climber.velocityY = 5
        climber.velocityX = obstacle.velocityX * 0.5

        if (currentHoldRef.current) {
          currentHoldRef.current.grabbed = false
          currentHoldRef.current = null
        }

        setGameState((prev) => ({ ...prev, combo: 0 }))
        triggerShake(8)
        createParticles(climber.x, climber.y, 20, 'dust', '#FF4444')
        return
      }
    }
  }, [createParticles, triggerShake])

  // End game
  const endGame = useCallback(() => {
    setGameState((prev) => {
      const newHighScore = Math.max(prev.highScore, prev.score)
      if (typeof window !== 'undefined') {
        localStorage.setItem('climbHighScore', newHighScore.toString())
      }
      return {
        ...prev,
        status: 'gameover',
        highScore: newHighScore,
      }
    })
  }, [])

  // Update game state
  const updateGame = useCallback(() => {
    const climber = climberRef.current
    frameCountRef.current++

    // Update wind
    if (windRef.current.active) {
      windRef.current.timer++
      if (windRef.current.timer >= windRef.current.duration) {
        windRef.current.active = false
      }

      // Apply wind force
      if (climber.state === 'jumping' || climber.state === 'falling') {
        const windForce =
          windRef.current.direction === 'left'
            ? -windRef.current.strength
            : windRef.current.strength
        climber.velocityX += windForce * 0.1
      }

      // Wind particles
      if (frameCountRef.current % 3 === 0) {
        const startX = windRef.current.direction === 'left' ? CANVAS_WIDTH : 0
        createParticles(
          startX,
          cameraYRef.current + Math.random() * CANVAS_HEIGHT,
          1,
          'dust',
          'rgba(200, 200, 200, 0.3)'
        )
      }
    }

    // Update climber physics
    if (climber.state === 'jumping' || climber.state === 'falling') {
      climber.velocityY += GRAVITY
      climber.x += climber.velocityX
      climber.y += climber.velocityY

      // Boundary check
      climber.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, climber.x))

      // Check for grab
      checkHoldCollision()

      // Check if fell too far
      if (climber.y > cameraYRef.current + CANVAS_HEIGHT + 50) {
        endGame()
        return
      }
    }

    // Update crumbling holds
    holdsRef.current.forEach((hold) => {
      if (hold.type === 'crumbling' && hold.grabbed && hold.crumbleTimer !== undefined) {
        hold.crumbleTimer--
        if (frameCountRef.current % 5 === 0) {
          createParticles(hold.x + hold.width / 2, hold.y, 2, 'dust', '#8B4513')
        }
        if (hold.crumbleTimer <= 0) {
          // Hold crumbles!
          hold.grabbed = false
          if (currentHoldRef.current?.id === hold.id) {
            climber.state = 'falling'
            climber.velocityY = 2
            currentHoldRef.current = null
            setGameState((prev) => ({ ...prev, combo: 0 }))
            triggerShake(5)
            createParticles(hold.x + hold.width / 2, hold.y, 15, 'dust', '#8B4513')
          }
          // Remove the hold
          holdsRef.current = holdsRef.current.filter((h) => h.id !== hold.id)
        }
      }
    })

    // Update camera to follow climber
    const targetCameraY = climber.y - CANVAS_HEIGHT * 0.6
    cameraYRef.current += (targetCameraY - cameraYRef.current) * 0.08

    // Generate new holds
    generateHolds()

    // Spawn obstacles
    spawnObstacle()

    // Trigger wind
    triggerWind()

    // Update obstacles
    obstaclesRef.current.forEach((obstacle) => {
      obstacle.x += obstacle.velocityX
      obstacle.y += obstacle.velocityY
      obstacle.rotation += obstacle.type === 'rock' ? 3 : 0
    })

    // Remove off-screen obstacles
    obstaclesRef.current = obstaclesRef.current.filter(
      (o) => o.x > -50 && o.x < CANVAS_WIDTH + 50 && o.y < cameraYRef.current + CANVAS_HEIGHT + 100
    )

    // Check obstacle collision
    checkObstacleCollision()

    // Update particles
    particlesRef.current.forEach((p) => {
      p.x += p.velocityX
      p.y += p.velocityY
      p.velocityY += 0.1 // Particle gravity
      p.life--
    })

    // Remove dead particles
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0)

    // Update shake
    if (shakeRef.current.intensity > 0) {
      shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity * 2
      shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity * 2
      shakeRef.current.intensity *= 0.9
      if (shakeRef.current.intensity < 0.1) {
        shakeRef.current.intensity = 0
        shakeRef.current.x = 0
        shakeRef.current.y = 0
      }
    }
  }, [
    checkHoldCollision,
    checkObstacleCollision,
    createParticles,
    endGame,
    generateHolds,
    spawnObstacle,
    triggerShake,
    triggerWind,
  ])

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Apply shake
    ctx.save()
    ctx.translate(shakeRef.current.x, shakeRef.current.y)

    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw rock face background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, '#2d2d44')
    gradient.addColorStop(0.5, '#1a1a2e')
    gradient.addColorStop(1, '#0f0f1a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw rock texture
    ctx.fillStyle = 'rgba(100, 100, 120, 0.1)'
    for (let i = 0; i < 50; i++) {
      const x = (i * 47) % CANVAS_WIDTH
      const y =
        (((cameraYRef.current * 0.1 + i * 73) % CANVAS_HEIGHT) + CANVAS_HEIGHT) % CANVAS_HEIGHT
      ctx.beginPath()
      ctx.arc(x, y, 2 + Math.sin(i) * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw wind indicator
    if (windRef.current.active) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      const windArrow =
        windRef.current.direction === 'left'
          ? '← WIND →'.replace('→', '')
          : '← WIND →'.replace('←', '')
      ctx.fillText(windArrow, CANVAS_WIDTH / 2, 50)
    }

    // Draw holds
    holdsRef.current.forEach((hold) => {
      const screenY = hold.y - cameraYRef.current

      if (screenY < -50 || screenY > CANVAS_HEIGHT + 50) return

      ctx.save()

      // Hold colors based on type
      let holdColor = '#8B7355'
      let glowColor = 'rgba(139, 115, 85, 0.3)'

      switch (hold.type) {
        case 'perfect':
          holdColor = '#FFD700'
          glowColor = 'rgba(255, 215, 0, 0.5)'
          break
        case 'crumbling':
          holdColor = hold.crumbleTimer && hold.crumbleTimer < 30 ? '#FF4444' : '#A0522D'
          glowColor = 'rgba(160, 82, 45, 0.3)'
          break
        case 'icy':
          holdColor = '#87CEEB'
          glowColor = 'rgba(135, 206, 235, 0.5)'
          break
      }

      // Glow effect
      if (hold.grabbed || hold.type === 'perfect') {
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 15
      }

      // Draw hold
      ctx.fillStyle = holdColor
      ctx.beginPath()
      ctx.roundRect(hold.x, screenY, hold.width, hold.height, 5)
      ctx.fill()

      // Hold texture
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.beginPath()
      ctx.roundRect(hold.x + 2, screenY + hold.height - 5, hold.width - 4, 3, 2)
      ctx.fill()

      ctx.restore()
    })

    // Draw obstacles
    obstaclesRef.current.forEach((obstacle) => {
      const screenY = obstacle.y - cameraYRef.current

      if (screenY < -50 || screenY > CANVAS_HEIGHT + 50) return

      ctx.save()
      ctx.translate(obstacle.x, screenY)
      ctx.rotate((obstacle.rotation * Math.PI) / 180)

      if (obstacle.type === 'rock') {
        // Draw falling rock
        ctx.fillStyle = '#555'
        ctx.beginPath()
        ctx.moveTo(-obstacle.width / 2, 0)
        ctx.lineTo(0, -obstacle.height / 2)
        ctx.lineTo(obstacle.width / 2, 0)
        ctx.lineTo(obstacle.width / 4, obstacle.height / 2)
        ctx.lineTo(-obstacle.width / 4, obstacle.height / 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = '#444'
        ctx.beginPath()
        ctx.moveTo(-obstacle.width / 4, -obstacle.height / 4)
        ctx.lineTo(obstacle.width / 4, -obstacle.height / 4)
        ctx.lineTo(obstacle.width / 4, obstacle.height / 4)
        ctx.closePath()
        ctx.fill()
      } else if (obstacle.type === 'bird') {
        // Draw bird
        ctx.fillStyle = '#333'
        ctx.beginPath()
        ctx.ellipse(0, 0, obstacle.width / 2, obstacle.height / 3, 0, 0, Math.PI * 2)
        ctx.fill()

        // Wings
        const wingFlap = Math.sin(frameCountRef.current * 0.3) * 10
        ctx.beginPath()
        ctx.moveTo(-5, 0)
        ctx.lineTo(-obstacle.width / 2 - 10, -wingFlap)
        ctx.lineTo(-obstacle.width / 2, 5)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(5, 0)
        ctx.lineTo(obstacle.width / 2 + 10, -wingFlap)
        ctx.lineTo(obstacle.width / 2, 5)
        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()
    })

    // Draw climber
    const climber = climberRef.current
    const climberScreenY = climber.y - cameraYRef.current

    ctx.save()
    ctx.translate(climber.x, climberScreenY)
    ctx.rotate((climber.rotation * Math.PI) / 180)

    // Body
    ctx.fillStyle = climber.state === 'falling' ? '#FF6B6B' : '#FF5B04'
    ctx.beginPath()
    ctx.roundRect(-12, -20, 24, 35, 8)
    ctx.fill()

    // Head
    ctx.fillStyle = '#FFD5B8'
    ctx.beginPath()
    ctx.arc(0, -30, 12, 0, Math.PI * 2)
    ctx.fill()

    // Hair
    ctx.fillStyle = '#4A3728'
    ctx.beginPath()
    ctx.arc(0, -35, 10, Math.PI, Math.PI * 2)
    ctx.fill()

    // Arms
    ctx.strokeStyle = '#FFD5B8'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'

    // Left arm
    ctx.beginPath()
    ctx.moveTo(-10, -15)
    ctx.lineTo(-20, -35)
    ctx.stroke()

    // Right arm
    ctx.beginPath()
    ctx.moveTo(10, -15)
    ctx.lineTo(20, -35)
    ctx.stroke()

    // Legs
    ctx.strokeStyle = '#2D3748'
    ctx.lineWidth = 6

    // Left leg
    ctx.beginPath()
    ctx.moveTo(-5, 15)
    ctx.lineTo(-10, 35)
    ctx.stroke()

    // Right leg
    ctx.beginPath()
    ctx.moveTo(5, 15)
    ctx.lineTo(10, 35)
    ctx.stroke()

    // Shoes
    ctx.fillStyle = '#FF5B04'
    ctx.beginPath()
    ctx.ellipse(-10, 38, 8, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(10, 38, 8, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    // Draw particles
    particlesRef.current.forEach((particle) => {
      const screenY = particle.y - cameraYRef.current
      const alpha = particle.life / particle.maxLife

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = particle.color

      if (particle.type === 'spark') {
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 10
      }

      ctx.beginPath()
      ctx.arc(particle.x, screenY, particle.size, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    })

    // Draw UI
    ctx.restore() // Remove shake for UI

    // Score
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 28px "Space Grotesk", sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${gameState.score}`, 20, 40)

    // Altitude
    ctx.font = '16px "Space Grotesk", sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(`${Math.floor(gameState.altitude)}m`, 20, 65)

    // Combo
    if (gameState.combo > 1) {
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 20px "Space Grotesk", sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${gameState.combo}x COMBO`, CANVAS_WIDTH - 20, 40)
    }

    // High score indicator
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '14px "Space Grotesk", sans-serif'
    ctx.fillText(`BEST: ${gameState.highScore}`, CANVAS_WIDTH - 20, 65)
  }, [gameState.score, gameState.altitude, gameState.combo, gameState.highScore])

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameState.status !== 'playing') return

      const deltaTime = timestamp - lastTimeRef.current

      if (deltaTime >= 1000 / 60) {
        // 60 FPS
        lastTimeRef.current = timestamp
        updateGame()
        render()
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    },
    [gameState.status, updateGame, render]
  )

  // Start game
  const startGame = useCallback(() => {
    // Reset game state
    climberRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 150,
      velocityY: 0,
      velocityX: 0,
      rotation: 0,
      state: 'climbing',
      stamina: 100,
      leftHand: { x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - 160 },
      rightHand: { x: CANVAS_WIDTH / 2 + 15, y: CANVAS_HEIGHT - 160 },
      activeHand: 'right',
    }

    cameraYRef.current = 0
    holdsRef.current = []
    obstaclesRef.current = []
    particlesRef.current = []
    holdIdCounter.current = 0
    obstacleIdCounter.current = 0
    frameCountRef.current = 0
    windRef.current = {
      active: false,
      direction: 'left',
      strength: 0,
      duration: 0,
      timer: 0,
    }

    initializeHolds()

    setGameState((prev) => ({
      ...prev,
      status: 'playing',
      score: 0,
      altitude: 0,
      combo: 0,
      maxCombo: 0,
      difficulty: 1,
    }))
  }, [initializeHolds])

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (gameState.status === 'menu' || gameState.status === 'gameover') {
          startGame()
        } else {
          handleJump()
        }
      }
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      if (gameState.status === 'menu' || gameState.status === 'gameover') {
        startGame()
      } else {
        handleJump()
      }
    }

    const handleClick = () => {
      if (gameState.status === 'menu' || gameState.status === 'gameover') {
        startGame()
      } else {
        handleJump()
      }
    }

    const canvas = canvasRef.current
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouch, { passive: false })
    canvas?.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouch)
      canvas?.removeEventListener('click', handleClick)
    }
  }, [gameState.status, handleJump, startGame])

  // Start game loop when playing
  useEffect(() => {
    if (gameState.status === 'playing') {
      lastTimeRef.current = performance.now()
      animationRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.status, gameLoop])

  // Initial render
  useEffect(() => {
    if (gameState.status === 'menu') {
      initializeHolds()
      render()
    }
  }, [gameState.status, initializeHolds, render])

  const shareScore = () => {
    const text = `I just climbed ${Math.floor(gameState.maxAltitude)}m and scored ${gameState.score} points in Free Solo Climber! Can you beat my score? 🧗‍♂️🏔️`
    if (navigator.share) {
      navigator.share({
        title: 'Free Solo Climber',
        text,
        url: window.location.href,
      })
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

      {/* Menu Overlay */}
      {gameState.status === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/70">
          <h1 className="mb-2 text-4xl font-bold text-white">FREE SOLO</h1>
          <h2 className="text-primary-500 mb-8 text-2xl font-bold">CLIMBER</h2>

          <div className="mb-8 px-8 text-center text-white/80">
            <p className="mb-2">Tap or press SPACE to jump to the next hold</p>
            <p className="text-sm text-white/60">
              Avoid falling rocks and watch out for crumbling holds!
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startGame}
              className="bg-primary-500 hover:bg-primary-400 transform rounded-xl px-8 py-4 text-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            >
              START CLIMBING
            </button>

            {gameState.highScore > 0 && (
              <p className="text-white/60">Best Score: {gameState.highScore}</p>
            )}
          </div>

          <div className="absolute bottom-8 flex gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <div className="h-3 w-4 rounded bg-yellow-500" />
              <span>Perfect</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-4 rounded bg-amber-700" />
              <span>Crumbling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-4 rounded bg-sky-300" />
              <span>Icy</span>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState.status === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/80">
          <h2 className="mb-4 text-3xl font-bold text-red-500">FELL!</h2>

          <div className="mb-6 text-center">
            <p className="mb-2 text-5xl font-bold text-white">{gameState.score}</p>
            <p className="text-white/60">POINTS</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-primary-500 text-2xl font-bold">
                {Math.floor(gameState.maxAltitude)}m
              </p>
              <p className="text-sm text-white/60">MAX HEIGHT</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">{gameState.maxCombo}x</p>
              <p className="text-sm text-white/60">MAX COMBO</p>
            </div>
          </div>

          {gameState.score >= gameState.highScore && gameState.score > 0 && (
            <div className="mb-6 rounded-lg bg-yellow-500/20 px-4 py-2">
              <p className="font-bold text-yellow-500">NEW HIGH SCORE!</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={startGame}
              className="bg-primary-500 hover:bg-primary-400 transform rounded-xl px-8 py-4 text-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            >
              CLIMB AGAIN
            </button>

            <button
              onClick={shareScore}
              className="rounded-xl bg-white/10 px-8 py-3 font-bold text-white transition-all hover:bg-white/20"
            >
              SHARE SCORE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
