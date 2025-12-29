'use client'

import { useState, useCallback } from 'react'
import { useGameState } from './hooks/useGameState'
import MainMenu from './components/game-board/MainMenu'
import GameBoard from './components/game-board/GameBoard'
import GameOver from './components/game-board/GameOver'
import PauseMenu from './components/game-board/PauseMenu'
import { LEVELS } from './data/levels'

export default function HomeHustlePage() {
  const {
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
    spawnNewItems,
  } = useGameState()

  const [highScores, setHighScores] = useState<Record<number, number>>({})

  const handleStartGame = useCallback(
    (levelId: number) => {
      startGame(levelId)
    },
    [startGame]
  )

  const handleGoToMenu = useCallback(() => {
    // Save high score if applicable
    if (gameState.currentLevel && gameState.score > (highScores[gameState.currentLevel.id] || 0)) {
      setHighScores((prev) => ({
        ...prev,
        [gameState.currentLevel!.id]: gameState.score,
      }))
    }
    // Reset to menu state
    window.location.reload()
  }, [gameState.currentLevel, gameState.score, highScores])

  const handleNextLevel = useCallback(() => {
    if (gameState.currentLevel) {
      const nextLevelId = gameState.currentLevel.id + 1
      if (LEVELS.find((l) => l.id === nextLevelId)) {
        startGame(nextLevelId)
      }
    }
  }, [gameState.currentLevel, startGame])

  // Drag handlers - pick up item when drag starts
  const handleDragStart = useCallback(
    (_item: unknown, stationId: string, itemIndex: number) => {
      pickUpItem(stationId, itemIndex)
    },
    [pickUpItem]
  )

  const handleDragEnd = useCallback(() => {
    // Item is dropped back if not placed in valid station
    // The heldItem state handles this already
  }, [])

  // Render based on game phase
  if (gameState.phase === 'menu') {
    return <MainMenu onStartGame={handleStartGame} highScores={highScores} />
  }

  if (gameState.phase === 'paused') {
    return (
      <>
        <GameBoard
          stations={gameState.stations}
          orders={gameState.activeOrders}
          level={gameState.currentLevel!}
          score={gameState.score}
          timeRemaining={gameState.timeRemaining}
          comboMultiplier={gameState.comboMultiplier}
          consecutiveCompletions={gameState.consecutiveCompletions}
          heldItem={heldItem}
          onPickUpItem={pickUpItem}
          onDropItem={dropItem}
          onProcessStation={processStation}
          onCompleteOrder={completeOrder}
          onPause={pauseGame}
          onSpawnItems={spawnNewItems}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <PauseMenu onResume={resumeGame} onRestart={restartLevel} onMenu={handleGoToMenu} />
      </>
    )
  }

  if (gameState.phase === 'gameOver') {
    return (
      <GameOver
        level={gameState.currentLevel!}
        score={gameState.score}
        completedOrders={gameState.completedOrders.length}
        failedOrders={gameState.failedOrders.length}
        onRestart={restartLevel}
        onMenu={handleGoToMenu}
        onNextLevel={
          gameState.score >= gameState.currentLevel!.targetScore ? handleNextLevel : undefined
        }
      />
    )
  }

  if (gameState.phase === 'playing' && gameState.currentLevel) {
    return (
      <GameBoard
        stations={gameState.stations}
        orders={gameState.activeOrders}
        level={gameState.currentLevel}
        score={gameState.score}
        timeRemaining={gameState.timeRemaining}
        comboMultiplier={gameState.comboMultiplier}
        consecutiveCompletions={gameState.consecutiveCompletions}
        heldItem={heldItem}
        onPickUpItem={pickUpItem}
        onDropItem={dropItem}
        onProcessStation={processStation}
        onCompleteOrder={completeOrder}
        onPause={pauseGame}
        onSpawnItems={spawnNewItems}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    )
  }

  // Fallback
  return <MainMenu onStartGame={handleStartGame} highScores={highScores} />
}
