import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameState, GameItem, Station, Order, Level, GamePhase, Player } from '../types'
import { createGameItem, getRandomItemTemplate, advanceItemState } from '../data/items'
import { createStation, getStationTemplate, STATION_TEMPLATES } from '../data/stations'
import { generateOrder } from '../data/orders'
import { LEVELS } from '../data/levels'

const GRID_SIZE = 120 // pixels per grid cell

function initializeLevel(level: Level): { stations: Station[]; items: GameItem[] } {
  const stations: Station[] = []
  const items: GameItem[] = []

  // Create stations based on level configuration
  level.availableStations.forEach((stationType, index) => {
    const template = getStationTemplate(stationType)
    const row = Math.floor(index / 4)
    const col = index % 4
    const station = createStation(template, {
      x: col * GRID_SIZE + GRID_SIZE / 2,
      y: row * GRID_SIZE + GRID_SIZE / 2,
    })
    stations.push(station)

    // Add initial items to hamper
    if (stationType === 'hamper') {
      for (let i = 0; i < 5; i++) {
        const itemTemplate = getRandomItemTemplate()
        const item = createGameItem(itemTemplate)
        station.items.push(item)
        items.push(item)
      }
    }
  })

  return { stations, items }
}

export interface UseGameStateReturn {
  gameState: GameState
  startGame: (levelId: number) => void
  pauseGame: () => void
  resumeGame: () => void
  restartLevel: () => void
  pickUpItem: (stationId: string, itemIndex: number) => void
  dropItem: (stationId: string) => void
  processStation: (stationId: string) => void
  completeOrder: (orderId: string) => void
  heldItem: GameItem | null
  setHeldItem: (item: GameItem | null) => void
  spawnNewItems: () => void
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    currentLevel: null,
    players: [
      {
        id: 'player-1',
        name: 'Player 1',
        color: '#FF5B04',
        position: { x: 200, y: 200 },
        heldItem: null,
        score: 0,
        avatar: '🏃',
      },
    ],
    stations: [],
    items: [],
    activeOrders: [],
    completedOrders: [],
    failedOrders: [],
    score: 0,
    timeRemaining: 0,
    isPaused: false,
    comboMultiplier: 1,
    consecutiveCompletions: 0,
  })

  const [heldItem, setHeldItem] = useState<GameItem | null>(null)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const lastOrderTimeRef = useRef<number>(0)

  // Game loop
  useEffect(() => {
    if (gameState.phase === 'playing' && !gameState.isPaused) {
      gameLoopRef.current = setInterval(() => {
        setGameState((prev) => {
          const newTimeRemaining = prev.timeRemaining - 1

          // Update order timers
          const updatedOrders = prev.activeOrders.map((order) => ({
            ...order,
            timeRemaining: order.timeRemaining - 1,
          }))

          // Check for failed orders
          const failedOrders = updatedOrders.filter((o) => o.timeRemaining <= 0 && !o.isCompleted)
          const activeOrders = updatedOrders.filter((o) => o.timeRemaining > 0 && !o.isCompleted)

          // Update stations processing
          const updatedStations = prev.stations.map((station) => {
            if (station.isProcessing && station.items.length > 0) {
              const newProgress = station.processingProgress + 100 / station.processTime
              if (newProgress >= 100) {
                // Processing complete - advance items
                const processedItems = station.items.map((item) => advanceItemState(item))
                return {
                  ...station,
                  isProcessing: false,
                  processingProgress: 0,
                  items: processedItems,
                }
              }
              return { ...station, processingProgress: newProgress }
            }
            return station
          })

          // Check for game over
          if (newTimeRemaining <= 0) {
            return {
              ...prev,
              phase: 'gameOver',
              timeRemaining: 0,
              stations: updatedStations,
              activeOrders,
              failedOrders: [...prev.failedOrders, ...failedOrders],
            }
          }

          // Generate new orders periodically
          const level = prev.currentLevel
          if (level && activeOrders.length < level.maxActiveOrders) {
            const timeSinceLastOrder = Date.now() - lastOrderTimeRef.current
            if (timeSinceLastOrder > level.orderFrequency * 1000) {
              const newOrder = generateOrder(level.availableStations)
              lastOrderTimeRef.current = Date.now()
              return {
                ...prev,
                timeRemaining: newTimeRemaining,
                stations: updatedStations,
                activeOrders: [...activeOrders, newOrder],
                failedOrders: [...prev.failedOrders, ...failedOrders],
                consecutiveCompletions: failedOrders.length > 0 ? 0 : prev.consecutiveCompletions,
                comboMultiplier: failedOrders.length > 0 ? 1 : prev.comboMultiplier,
              }
            }
          }

          return {
            ...prev,
            timeRemaining: newTimeRemaining,
            stations: updatedStations,
            activeOrders,
            failedOrders: [...prev.failedOrders, ...failedOrders],
            consecutiveCompletions: failedOrders.length > 0 ? 0 : prev.consecutiveCompletions,
            comboMultiplier: failedOrders.length > 0 ? 1 : prev.comboMultiplier,
          }
        })
      }, 1000)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState.phase, gameState.isPaused])

  const startGame = useCallback((levelId: number) => {
    const level = LEVELS.find((l) => l.id === levelId)
    if (!level) return

    const { stations, items } = initializeLevel(level)
    lastOrderTimeRef.current = Date.now()

    // Generate initial orders
    const initialOrders: Order[] = []
    for (let i = 0; i < Math.min(2, level.maxActiveOrders); i++) {
      initialOrders.push(generateOrder(level.availableStations))
    }

    setHeldItem(null)
    setGameState({
      phase: 'playing',
      currentLevel: level,
      players: [
        {
          id: 'player-1',
          name: 'Player 1',
          color: '#FF5B04',
          position: { x: 200, y: 200 },
          heldItem: null,
          score: 0,
          avatar: '🏃',
        },
      ],
      stations,
      items,
      activeOrders: initialOrders,
      completedOrders: [],
      failedOrders: [],
      score: 0,
      timeRemaining: level.timeLimit,
      isPaused: false,
      comboMultiplier: 1,
      consecutiveCompletions: 0,
    })
  }, [])

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: true, phase: 'paused' }))
  }, [])

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: false, phase: 'playing' }))
  }, [])

  const restartLevel = useCallback(() => {
    if (gameState.currentLevel) {
      startGame(gameState.currentLevel.id)
    }
  }, [gameState.currentLevel, startGame])

  const pickUpItem = useCallback(
    (stationId: string, itemIndex: number) => {
      if (heldItem) return // Already holding something

      setGameState((prev) => {
        const stationIdx = prev.stations.findIndex((s) => s.id === stationId)
        if (stationIdx === -1) return prev

        const station = prev.stations[stationIdx]
        if (station.isProcessing || itemIndex >= station.items.length) return prev

        const item = station.items[itemIndex]
        const newItems = [...station.items]
        newItems.splice(itemIndex, 1)

        const newStations = [...prev.stations]
        newStations[stationIdx] = { ...station, items: newItems }

        setHeldItem(item)
        return { ...prev, stations: newStations }
      })
    },
    [heldItem]
  )

  const dropItem = useCallback(
    (stationId: string) => {
      if (!heldItem) return

      setGameState((prev) => {
        const stationIdx = prev.stations.findIndex((s) => s.id === stationId)
        if (stationIdx === -1) return prev

        const station = prev.stations[stationIdx]

        // Check if station accepts this item
        if (!station.acceptedCategories.includes(heldItem.category)) {
          return prev // Station doesn't accept this category
        }

        if (!station.inputStates.includes(heldItem.state)) {
          return prev // Wrong state for this station
        }

        if (station.items.length >= station.capacity) {
          return prev // Station is full
        }

        const newStations = [...prev.stations]
        newStations[stationIdx] = {
          ...station,
          items: [...station.items, heldItem],
        }

        setHeldItem(null)
        return { ...prev, stations: newStations }
      })
    },
    [heldItem]
  )

  const processStation = useCallback((stationId: string) => {
    setGameState((prev) => {
      const stationIdx = prev.stations.findIndex((s) => s.id === stationId)
      if (stationIdx === -1) return prev

      const station = prev.stations[stationIdx]
      if (station.isProcessing || station.items.length === 0 || station.processTime === 0) {
        return prev
      }

      const newStations = [...prev.stations]
      newStations[stationIdx] = {
        ...station,
        isProcessing: true,
        processingProgress: 0,
      }

      return { ...prev, stations: newStations }
    })
  }, [])

  const completeOrder = useCallback((orderId: string) => {
    setGameState((prev) => {
      const orderIdx = prev.activeOrders.findIndex((o) => o.id === orderId)
      if (orderIdx === -1) return prev

      const order = prev.activeOrders[orderIdx]
      const timeBonus = order.timeRemaining > order.timeLimit / 2 ? order.tipBonus : 0
      const comboBonus =
        prev.comboMultiplier > 1 ? Math.floor(order.points * (prev.comboMultiplier - 1)) : 0
      const totalPoints = order.points + timeBonus + comboBonus

      const newActiveOrders = prev.activeOrders.filter((o) => o.id !== orderId)
      const newConsecutive = prev.consecutiveCompletions + 1
      const newMultiplier = Math.min(1 + newConsecutive * 0.25, 3)

      return {
        ...prev,
        activeOrders: newActiveOrders,
        completedOrders: [...prev.completedOrders, { ...order, isCompleted: true }],
        score: prev.score + totalPoints,
        consecutiveCompletions: newConsecutive,
        comboMultiplier: newMultiplier,
      }
    })
  }, [])

  const spawnNewItems = useCallback(() => {
    setGameState((prev) => {
      // Find the hamper station
      const hamperIdx = prev.stations.findIndex((s) => s.type === 'hamper')
      if (hamperIdx === -1) return prev

      const hamper = prev.stations[hamperIdx]
      if (hamper.items.length >= hamper.capacity) return prev

      // Add new items
      const newItems: GameItem[] = []
      const numToAdd = Math.min(3, hamper.capacity - hamper.items.length)

      for (let i = 0; i < numToAdd; i++) {
        const template = getRandomItemTemplate()
        newItems.push(createGameItem(template))
      }

      const newStations = [...prev.stations]
      newStations[hamperIdx] = {
        ...hamper,
        items: [...hamper.items, ...newItems],
      }

      return {
        ...prev,
        stations: newStations,
        items: [...prev.items, ...newItems],
      }
    })
  }, [])

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    restartLevel,
    pickUpItem,
    dropItem,
    processStation,
    completeOrder,
    heldItem,
    setHeldItem,
    spawnNewItems,
  }
}
