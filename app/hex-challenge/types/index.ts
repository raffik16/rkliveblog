// Prediction Markets Types
export interface PredictionMarket {
  id: string
  title: string
  category: 'politics' | 'sports' | 'entertainment' | 'technology' | 'economy'
  probability: number
  previousProbability: number
  volume: number
  endDate: string
  trending: 'up' | 'down' | 'stable'
  lastUpdate: Date
}

export interface MarketHistory {
  timestamp: Date
  probability: number
}

// Slang Evolution Types
export interface SlangTerm {
  term: string
  definition: string
  origin: string
  peakYear: number
  currentPopularity: number
  generations: ('gen-z' | 'millennial' | 'gen-x' | 'boomer')[]
  category: 'approval' | 'disapproval' | 'greeting' | 'expression' | 'descriptor'
  shelfLife: number // months
  status: 'rising' | 'peak' | 'declining' | 'dead'
}

export interface SlangTimelinePoint {
  year: number
  terms: string[]
  dominantGeneration: string
}

// FIFA World Cup Types
export interface Team {
  name: string
  code: string
  flag: string
  fifaRanking: number
  group: string
  strength: number
  form: number
  starPlayers: string[]
  odds: number
}

export interface MatchPrediction {
  teamA: Team
  teamB: Team
  teamAWinProbability: number
  drawProbability: number
  teamBWinProbability: number
  predictedScore: [number, number]
}

export interface TournamentBracket {
  round: 'group' | 'round-of-32' | 'round-of-16' | 'quarter' | 'semi' | 'final'
  matches: MatchPrediction[]
}

// Wildcard Types
export interface DatasetCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  sampleInsight: string
  dataPoints: number
  source: string
}

export interface InsightMetric {
  label: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
}

// Dashboard Types
export type TabType = 'predictions' | 'slang' | 'worldcup' | 'wildcard'

export interface DashboardMetrics {
  totalDataPoints: number
  insightsGenerated: number
  activeMarkets: number
  trendsTracked: number
}
