'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import type { Team } from '../types'
import { worldCupTeams, simulateMatch } from '../data/mockData'

export default function WorldCup2026() {
  const [teams, setTeams] = useState<Team[]>(worldCupTeams)
  const [selectedTeams, setSelectedTeams] = useState<[Team | null, Team | null]>([null, null])
  const [matchResult, setMatchResult] = useState<{
    winner: Team | null
    scoreA: number
    scoreB: number
  } | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [tournamentWinner, setTournamentWinner] = useState<Team | null>(null)
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  const strengthRef = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const sortedTeams = [...teams].sort((a, b) => b.strength - a.strength)

  const selectTeam = (team: Team) => {
    if (selectedTeams[0]?.code === team.code) {
      setSelectedTeams([null, selectedTeams[1]])
    } else if (selectedTeams[1]?.code === team.code) {
      setSelectedTeams([selectedTeams[0], null])
    } else if (!selectedTeams[0]) {
      setSelectedTeams([team, selectedTeams[1]])
    } else if (!selectedTeams[1]) {
      setSelectedTeams([selectedTeams[0], team])
    } else {
      setSelectedTeams([team, selectedTeams[1]])
    }
    setMatchResult(null)
  }

  const runMatch = () => {
    if (!selectedTeams[0] || !selectedTeams[1]) return

    setIsSimulating(true)
    setMatchResult(null)

    // Animate the simulation
    setTimeout(() => {
      const result = simulateMatch(selectedTeams[0]!, selectedTeams[1]!)
      setMatchResult(result)
      setIsSimulating(false)
    }, 1500)
  }

  const runTournament = () => {
    setIsSimulating(true)
    setSimulationLog([])
    setTournamentWinner(null)

    const remainingTeams = [...teams]
    const log: string[] = []

    const simulateRound = (round: string, teamsInRound: Team[]): Team[] => {
      const winners: Team[] = []
      log.push(`--- ${round} ---`)

      for (let i = 0; i < teamsInRound.length; i += 2) {
        if (i + 1 < teamsInRound.length) {
          const result = simulateMatch(teamsInRound[i], teamsInRound[i + 1])
          const winner = result.winner || teamsInRound[i] // Handle draw with penalties
          log.push(
            `${teamsInRound[i].flag} ${teamsInRound[i].name} ${result.scoreA} - ${result.scoreB} ${teamsInRound[i + 1].name} ${teamsInRound[i + 1].flag}`
          )
          winners.push(winner)
        } else {
          winners.push(teamsInRound[i])
        }
      }

      setSimulationLog([...log])
      return winners
    }

    // Simulate tournament with delays
    let currentTeams = remainingTeams.slice(0, 16) // Top 16 for demo
    const rounds = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final']
    let roundIndex = 0

    const runNextRound = () => {
      if (currentTeams.length === 1) {
        setTournamentWinner(currentTeams[0])
        setIsSimulating(false)
        return
      }

      currentTeams = simulateRound(rounds[roundIndex], currentTeams)
      roundIndex++

      setTimeout(runNextRound, 1000)
    }

    setTimeout(runNextRound, 500)
  }

  const getOddsColor = (odds: number) => {
    if (odds <= 6) return 'text-green-400'
    if (odds <= 15) return 'text-yellow-400'
    if (odds <= 30) return 'text-orange-400'
    return 'text-red-400'
  }

  const getStrengthGradient = (strength: number) => {
    if (strength >= 90) return 'from-green-500 to-emerald-500'
    if (strength >= 80) return 'from-yellow-500 to-orange-500'
    return 'from-orange-500 to-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">FIFA World Cup 2026</h2>
          <p className="text-slate-400">
            48-team format predictions for USA/Mexico/Canada
          </p>
        </div>
        <motion.button
          onClick={runTournament}
          disabled={isSimulating}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-medium text-white transition-opacity disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSimulating ? (
            <>
              <motion.div
                className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Simulating...
            </>
          ) : (
            <>
              <span>🏆</span>
              Simulate Tournament
            </>
          )}
        </motion.button>
      </div>

      {/* Tournament Winner Banner */}
      <AnimatePresence>
        {tournamentWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-xl border border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 p-6 text-center"
          >
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🏆
            </motion.div>
            <h3 className="mt-4 text-2xl font-bold text-yellow-400">Tournament Champion</h3>
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="text-5xl">{tournamentWinner.flag}</span>
              <span className="text-3xl font-bold text-white">{tournamentWinner.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Selection */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">Select Teams to Compare</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTeams.map((team, index) => {
              const isSelected =
                selectedTeams[0]?.code === team.code || selectedTeams[1]?.code === team.code
              const selectionIndex = selectedTeams[0]?.code === team.code ? 0 : 1

              return (
                <motion.button
                  key={team.code}
                  onClick={() => selectTeam(team)}
                  className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-green-500/50 bg-green-500/10 ring-2 ring-green-500/30'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      {selectionIndex + 1}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{team.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{team.name}</div>
                      <div className="text-xs text-slate-500">
                        FIFA Rank: #{team.fifaRanking}
                      </div>
                    </div>
                  </div>

                  {/* Strength Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Team Strength</span>
                      <span className="font-mono text-green-400">{team.strength}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-700">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getStrengthGradient(team.strength)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${team.strength}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                      />
                    </div>
                  </div>

                  {/* Odds */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Win Odds</span>
                    <span className={`font-mono text-sm font-bold ${getOddsColor(team.odds)}`}>
                      {team.odds.toFixed(1)}x
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Match Simulator */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Match Simulator</h3>

          {/* Selected Teams */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="flex items-center justify-between">
              {/* Team A */}
              <div className="flex-1 text-center">
                {selectedTeams[0] ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="space-y-2"
                  >
                    <span className="text-5xl">{selectedTeams[0].flag}</span>
                    <div className="font-medium text-white">{selectedTeams[0].name}</div>
                    <div className="text-xs text-slate-500">
                      Strength: {selectedTeams[0].strength}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-2 text-slate-500">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-600">
                      ?
                    </div>
                    <div className="text-sm">Select Team 1</div>
                  </div>
                )}
              </div>

              {/* VS */}
              <div className="px-4">
                <motion.div
                  className="rounded-full bg-slate-700 px-4 py-2 font-bold text-white"
                  animate={isSimulating ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isSimulating ? Infinity : 0 }}
                >
                  VS
                </motion.div>
              </div>

              {/* Team B */}
              <div className="flex-1 text-center">
                {selectedTeams[1] ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="space-y-2"
                  >
                    <span className="text-5xl">{selectedTeams[1].flag}</span>
                    <div className="font-medium text-white">{selectedTeams[1].name}</div>
                    <div className="text-xs text-slate-500">
                      Strength: {selectedTeams[1].strength}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-2 text-slate-500">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-600">
                      ?
                    </div>
                    <div className="text-sm">Select Team 2</div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulate Button */}
            <motion.button
              onClick={runMatch}
              disabled={!selectedTeams[0] || !selectedTeams[1] || isSimulating}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSimulating ? 'Simulating...' : 'Simulate Match'}
            </motion.button>
          </div>

          {/* Match Result */}
          <AnimatePresence>
            {matchResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-xl border border-green-500/30 bg-green-500/10 p-6"
              >
                <h4 className="mb-4 text-center text-lg font-semibold text-white">
                  Match Result
                </h4>

                <div className="flex items-center justify-center gap-6 text-center">
                  <div
                    className={`${
                      matchResult.scoreA > matchResult.scoreB ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <span className="text-4xl">{selectedTeams[0]?.flag}</span>
                    <div className="mt-1 text-sm text-white">{selectedTeams[0]?.name}</div>
                  </div>

                  <div className="text-center">
                    <div className="font-mono text-4xl font-bold text-white">
                      {matchResult.scoreA} - {matchResult.scoreB}
                    </div>
                    {matchResult.winner && (
                      <motion.div
                        className="mt-2 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {matchResult.winner.name} wins!
                      </motion.div>
                    )}
                    {!matchResult.winner && (
                      <div className="mt-2 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                        Draw - Goes to penalties!
                      </div>
                    )}
                  </div>

                  <div
                    className={`${
                      matchResult.scoreB > matchResult.scoreA ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <span className="text-4xl">{selectedTeams[1]?.flag}</span>
                    <div className="mt-1 text-sm text-white">{selectedTeams[1]?.name}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simulation Log */}
          {simulationLog.length > 0 && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-400">Tournament Log</h4>
              <div className="max-h-64 space-y-1 overflow-y-auto font-mono text-xs">
                {simulationLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${
                      log.startsWith('---')
                        ? 'mt-2 font-bold text-green-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Players Section */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Star Players to Watch</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teams.slice(0, 4).map((team) => (
            <div key={team.code} className="rounded-lg bg-slate-900/50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{team.flag}</span>
                <span className="font-medium text-white">{team.name}</span>
              </div>
              <div className="mt-3 space-y-1">
                {team.starPlayers.map((player) => (
                  <div
                    key={player}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <span className="text-yellow-400">⭐</span>
                    {player}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Note */}
      <motion.div
        className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/20">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h4 className="font-semibold text-white">Expanded Format Insight</h4>
            <p className="mt-1 text-sm text-slate-300">
              The 48-team format introduces 16 additional matches in the group stage alone.
              Historical data suggests underdogs perform 23% better in expanded tournaments due to
              reduced knockout pressure. Consider weighting recent form over historical rankings
              for more accurate predictions.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
