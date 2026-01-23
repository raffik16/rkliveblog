import type { LogEntry, Feeling, Location, PatternInsight } from './types'

const STORAGE_KEY = 'quiet-hands-logs'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function getLogs(): LogEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addLog(entry: Omit<LogEntry, 'id' | 'timestamp' | 'dateKey'>): LogEntry {
  const logs = getLogs()
  const now = new Date()
  const newEntry: LogEntry = {
    ...entry,
    id: generateId(),
    timestamp: now.toISOString(),
    dateKey: getDateKey(now),
  }
  logs.push(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  return newEntry
}

export function getTodayCount(): number {
  const logs = getLogs()
  const today = getDateKey()
  return logs.filter((log) => log.dateKey === today).length
}

export function getPatternInsight(): PatternInsight | null {
  const logs = getLogs()
  if (logs.length < 2) return null

  // Count feeling + location pairs
  const pairCounts: Record<string, { feeling: Feeling; location: Location; count: number }> = {}

  for (const log of logs) {
    const key = `${log.feeling}:${log.location}`
    if (!pairCounts[key]) {
      pairCounts[key] = { feeling: log.feeling, location: log.location, count: 0 }
    }
    pairCounts[key].count++
  }

  // Find the most common pair with count >= 2
  let maxPair: PatternInsight | null = null
  for (const pair of Object.values(pairCounts)) {
    if (pair.count >= 2 && (!maxPair || pair.count > maxPair.count)) {
      maxPair = pair
    }
  }

  return maxPair
}

export function formatFeelingLabel(feeling: Feeling): string {
  const labels: Record<Feeling, string> = {
    anxious: 'anxious',
    bored: 'bored',
    stressed: 'stressed',
    tired: 'tired',
    restless: 'restless',
    overwhelmed: 'overwhelmed',
    frustrated: 'frustrated',
    sad: 'sad',
    other: 'something',
  }
  return labels[feeling] || feeling
}

export function formatLocationLabel(location: Location): string {
  const labels: Record<Location, string> = {
    home: 'at home',
    work: 'at work',
    commute: 'commuting',
    public: 'in public',
    bed: 'in bed',
    bathroom: 'in the bathroom',
    outside: 'outside',
    other: 'somewhere',
  }
  return labels[location] || location
}

export function clearAllLogs(): void {
  localStorage.removeItem(STORAGE_KEY)
}
