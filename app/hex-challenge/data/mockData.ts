import type {
  PredictionMarket,
  SlangTerm,
  Team,
  DatasetCard,
  SlangTimelinePoint,
} from '../types'

export const predictionMarkets: PredictionMarket[] = [
  {
    id: 'pm-1',
    title: 'Will AI surpass human-level reasoning by 2026?',
    category: 'technology',
    probability: 0.34,
    previousProbability: 0.31,
    volume: 2450000,
    endDate: '2026-12-31',
    trending: 'up',
    lastUpdate: new Date(),
  },
  {
    id: 'pm-2',
    title: 'Will Bitcoin reach $150K before 2026?',
    category: 'economy',
    probability: 0.42,
    previousProbability: 0.45,
    volume: 8920000,
    endDate: '2025-12-31',
    trending: 'down',
    lastUpdate: new Date(),
  },
  {
    id: 'pm-3',
    title: 'Will there be a major UFO disclosure event?',
    category: 'politics',
    probability: 0.18,
    previousProbability: 0.15,
    volume: 1230000,
    endDate: '2025-06-30',
    trending: 'up',
    lastUpdate: new Date(),
  },
  {
    id: 'pm-4',
    title: 'Will Taylor Swift announce pregnancy in 2025?',
    category: 'entertainment',
    probability: 0.28,
    previousProbability: 0.28,
    volume: 4560000,
    endDate: '2025-12-31',
    trending: 'stable',
    lastUpdate: new Date(),
  },
  {
    id: 'pm-5',
    title: 'Will US enter recession in 2025?',
    category: 'economy',
    probability: 0.31,
    previousProbability: 0.35,
    volume: 12400000,
    endDate: '2025-12-31',
    trending: 'down',
    lastUpdate: new Date(),
  },
  {
    id: 'pm-6',
    title: 'Will SpaceX land humans on Mars by 2028?',
    category: 'technology',
    probability: 0.12,
    previousProbability: 0.1,
    volume: 3200000,
    endDate: '2028-12-31',
    trending: 'up',
    lastUpdate: new Date(),
  },
]

export const slangTerms: SlangTerm[] = [
  {
    term: 'Rizz',
    definition: 'Charisma or the ability to attract romantic partners',
    origin: 'Twitch/Gaming community',
    peakYear: 2023,
    currentPopularity: 65,
    generations: ['gen-z'],
    category: 'descriptor',
    shelfLife: 24,
    status: 'declining',
  },
  {
    term: 'Slay',
    definition: 'To do something exceptionally well',
    origin: 'Ballroom/Drag culture',
    peakYear: 2022,
    currentPopularity: 70,
    generations: ['gen-z', 'millennial'],
    category: 'approval',
    shelfLife: 48,
    status: 'peak',
  },
  {
    term: 'Mid',
    definition: 'Average, mediocre, not impressive',
    origin: 'Gaming/Esports',
    peakYear: 2022,
    currentPopularity: 55,
    generations: ['gen-z'],
    category: 'disapproval',
    shelfLife: 18,
    status: 'declining',
  },
  {
    term: 'No Cap',
    definition: 'No lie, for real, being truthful',
    origin: 'Hip-hop culture',
    peakYear: 2020,
    currentPopularity: 40,
    generations: ['gen-z', 'millennial'],
    category: 'expression',
    shelfLife: 36,
    status: 'declining',
  },
  {
    term: 'Brainrot',
    definition: 'Content that is mindless or overly consumed',
    origin: 'TikTok/Internet culture',
    peakYear: 2024,
    currentPopularity: 90,
    generations: ['gen-z'],
    category: 'descriptor',
    shelfLife: 12,
    status: 'rising',
  },
  {
    term: 'Skibidi',
    definition: 'Absurdist expression from viral video series',
    origin: 'YouTube animation',
    peakYear: 2024,
    currentPopularity: 85,
    generations: ['gen-z'],
    category: 'expression',
    shelfLife: 8,
    status: 'peak',
  },
  {
    term: 'Bussin',
    definition: 'Extremely good, especially for food',
    origin: 'African American Vernacular English',
    peakYear: 2021,
    currentPopularity: 35,
    generations: ['gen-z', 'millennial'],
    category: 'approval',
    shelfLife: 24,
    status: 'declining',
  },
  {
    term: 'Era',
    definition: 'A phase or period in one\'s life',
    origin: 'Taylor Swift fandom',
    peakYear: 2023,
    currentPopularity: 75,
    generations: ['gen-z', 'millennial'],
    category: 'descriptor',
    shelfLife: 36,
    status: 'peak',
  },
  {
    term: 'Ate',
    definition: 'Did something perfectly or impressively',
    origin: 'Ballroom/Drag culture',
    peakYear: 2023,
    currentPopularity: 60,
    generations: ['gen-z'],
    category: 'approval',
    shelfLife: 18,
    status: 'declining',
  },
  {
    term: 'Delulu',
    definition: 'Delusional, especially about romantic prospects',
    origin: 'K-pop fandom',
    peakYear: 2023,
    currentPopularity: 70,
    generations: ['gen-z'],
    category: 'descriptor',
    shelfLife: 20,
    status: 'peak',
  },
]

export const slangTimeline: SlangTimelinePoint[] = [
  { year: 2018, terms: ['Yeet', 'Tea', 'Big Yikes'], dominantGeneration: 'Gen Z' },
  { year: 2019, terms: ['Simp', 'OK Boomer', 'Vibe Check'], dominantGeneration: 'Gen Z' },
  { year: 2020, terms: ['No Cap', 'Hits Different', 'Rent Free'], dominantGeneration: 'Gen Z' },
  { year: 2021, terms: ['Bussin', 'Cheugy', 'Caught in 4K'], dominantGeneration: 'Gen Z' },
  { year: 2022, terms: ['Mid', 'Slay', 'Understood the Assignment'], dominantGeneration: 'Gen Z' },
  { year: 2023, terms: ['Rizz', 'Era', 'Delulu'], dominantGeneration: 'Gen Z' },
  { year: 2024, terms: ['Brainrot', 'Skibidi', 'Mewing'], dominantGeneration: 'Gen Z' },
  { year: 2025, terms: ['???', '???', '???'], dominantGeneration: 'Gen Alpha?' },
]

export const worldCupTeams: Team[] = [
  {
    name: 'Argentina',
    code: 'ARG',
    flag: '🇦🇷',
    fifaRanking: 1,
    group: 'A',
    strength: 95,
    form: 92,
    starPlayers: ['Messi', 'Álvarez', 'Mac Allister'],
    odds: 4.5,
  },
  {
    name: 'France',
    code: 'FRA',
    flag: '🇫🇷',
    fifaRanking: 2,
    group: 'B',
    strength: 94,
    form: 88,
    starPlayers: ['Mbappé', 'Griezmann', 'Tchouaméni'],
    odds: 5.0,
  },
  {
    name: 'England',
    code: 'ENG',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    fifaRanking: 4,
    group: 'C',
    strength: 91,
    form: 85,
    starPlayers: ['Bellingham', 'Saka', 'Rice'],
    odds: 6.5,
  },
  {
    name: 'Brazil',
    code: 'BRA',
    flag: '🇧🇷',
    fifaRanking: 5,
    group: 'D',
    strength: 92,
    form: 78,
    starPlayers: ['Vinícius Jr', 'Rodrygo', 'Endrick'],
    odds: 7.0,
  },
  {
    name: 'Spain',
    code: 'ESP',
    flag: '🇪🇸',
    fifaRanking: 3,
    group: 'E',
    strength: 93,
    form: 90,
    starPlayers: ['Yamal', 'Pedri', 'Rodri'],
    odds: 5.5,
  },
  {
    name: 'Germany',
    code: 'GER',
    flag: '🇩🇪',
    fifaRanking: 6,
    group: 'F',
    strength: 89,
    form: 82,
    starPlayers: ['Musiala', 'Wirtz', 'Havertz'],
    odds: 9.0,
  },
  {
    name: 'Portugal',
    code: 'POR',
    flag: '🇵🇹',
    fifaRanking: 7,
    group: 'G',
    strength: 88,
    form: 84,
    starPlayers: ['Ronaldo', 'B. Fernandes', 'R. Dias'],
    odds: 10.0,
  },
  {
    name: 'Netherlands',
    code: 'NED',
    flag: '🇳🇱',
    fifaRanking: 8,
    group: 'H',
    strength: 87,
    form: 80,
    starPlayers: ['Van Dijk', 'Gakpo', 'Simons'],
    odds: 12.0,
  },
  {
    name: 'USA',
    code: 'USA',
    flag: '🇺🇸',
    fifaRanking: 11,
    group: 'A',
    strength: 82,
    form: 86,
    starPlayers: ['Pulisic', 'McKennie', 'Reyna'],
    odds: 25.0,
  },
  {
    name: 'Mexico',
    code: 'MEX',
    flag: '🇲🇽',
    fifaRanking: 15,
    group: 'A',
    strength: 80,
    form: 75,
    starPlayers: ['Lozano', 'Jiménez', 'Edson Álvarez'],
    odds: 40.0,
  },
  {
    name: 'Canada',
    code: 'CAN',
    flag: '🇨🇦',
    fifaRanking: 40,
    group: 'A',
    strength: 72,
    form: 70,
    starPlayers: ['Davies', 'David', 'Buchanan'],
    odds: 100.0,
  },
  {
    name: 'Japan',
    code: 'JPN',
    flag: '🇯🇵',
    fifaRanking: 18,
    group: 'I',
    strength: 79,
    form: 85,
    starPlayers: ['Kubo', 'Mitoma', 'Doan'],
    odds: 50.0,
  },
]

export const wildcardDatasets: DatasetCard[] = [
  {
    id: 'wc-1',
    title: 'Housing Market Anomalies',
    description: 'Explore neighborhoods where prices defy economic logic',
    icon: '🏠',
    color: 'emerald',
    sampleInsight: 'Zillow listings with pool + mountain view = 47% premium',
    dataPoints: 2400000,
    source: 'Zillow API',
  },
  {
    id: 'wc-2',
    title: 'Dating App Dynamics',
    description: 'Analyze swipe patterns and match probability factors',
    icon: '💕',
    color: 'pink',
    sampleInsight: 'Bio with dogs = 23% higher match rate',
    dataPoints: 890000,
    source: 'OKCupid Dataset',
  },
  {
    id: 'wc-3',
    title: 'Viral Recipe Anatomy',
    description: 'What makes TikTok food content explode?',
    icon: '🍳',
    color: 'orange',
    sampleInsight: 'Cheese pull shot = 340% more shares',
    dataPoints: 1200000,
    source: 'TikTok Analytics',
  },
  {
    id: 'wc-4',
    title: 'Spotify Algorithm Secrets',
    description: 'Reverse-engineer the Discover Weekly magic',
    icon: '🎵',
    color: 'green',
    sampleInsight: 'Songs at 120 BPM = 2x playlist adds',
    dataPoints: 45000000,
    source: 'Spotify API',
  },
  {
    id: 'wc-5',
    title: 'Climate Migration Patterns',
    description: 'Where are people moving as weather changes?',
    icon: '🌍',
    color: 'blue',
    sampleInsight: 'Coastal exodus: 15% YoY population shift inland',
    dataPoints: 3200000,
    source: 'Census + NOAA',
  },
  {
    id: 'wc-6',
    title: 'Startup Failure Signals',
    description: 'Predict which startups will fail within 2 years',
    icon: '📈',
    color: 'purple',
    sampleInsight: '3+ pivots in year 1 = 78% failure rate',
    dataPoints: 180000,
    source: 'Crunchbase',
  },
]

// Generate simulated price history for markets
export function generateMarketHistory(
  market: PredictionMarket,
  points: number = 30
): { timestamp: Date; probability: number }[] {
  const history = []
  const now = new Date()
  let prob = market.probability

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * 0.05
    prob = Math.max(0.01, Math.min(0.99, prob + change))
    history.push({ timestamp, probability: prob })
  }

  // Make sure last point matches current probability
  history[history.length - 1].probability = market.probability

  return history
}

// Simulate match outcome
export function simulateMatch(
  teamA: Team,
  teamB: Team
): { winner: Team | null; scoreA: number; scoreB: number } {
  const totalStrength = teamA.strength + teamB.strength
  const teamAAdvantage = (teamA.strength * teamA.form) / 100
  const teamBAdvantage = (teamB.strength * teamB.form) / 100

  const teamAProb = teamAAdvantage / (teamAAdvantage + teamBAdvantage)

  // Generate score based on Poisson-like distribution
  const avgGoals = 2.5
  const scoreA = Math.floor(Math.random() * 4 * teamAProb + Math.random())
  const scoreB = Math.floor(Math.random() * 4 * (1 - teamAProb) + Math.random())

  let winner: Team | null = null
  if (scoreA > scoreB) winner = teamA
  else if (scoreB > scoreA) winner = teamB

  return { winner, scoreA, scoreB }
}
