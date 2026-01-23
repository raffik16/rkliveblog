export type LogType = 'urge' | 'caught'

export type Feeling =
  | 'anxious'
  | 'bored'
  | 'stressed'
  | 'tired'
  | 'restless'
  | 'overwhelmed'
  | 'frustrated'
  | 'sad'
  | 'other'

export type Location =
  | 'home'
  | 'work'
  | 'commute'
  | 'public'
  | 'bed'
  | 'bathroom'
  | 'outside'
  | 'other'

export interface LogEntry {
  id: string
  timestamp: string // ISO string
  dateKey: string // YYYY-MM-DD
  type: LogType
  feeling: Feeling
  location: Location
  note?: string
}

export interface PatternInsight {
  feeling: Feeling
  location: Location
  count: number
}

export const FEELINGS: { value: Feeling; label: string }[] = [
  { value: 'anxious', label: 'Anxious' },
  { value: 'bored', label: 'Bored' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'tired', label: 'Tired' },
  { value: 'restless', label: 'Restless' },
  { value: 'overwhelmed', label: 'Overwhelmed' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'sad', label: 'Sad' },
  { value: 'other', label: 'Something else' },
]

export const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'home', label: 'At home' },
  { value: 'work', label: 'At work' },
  { value: 'commute', label: 'Commuting' },
  { value: 'public', label: 'In public' },
  { value: 'bed', label: 'In bed' },
  { value: 'bathroom', label: 'In the bathroom' },
  { value: 'outside', label: 'Outside' },
  { value: 'other', label: 'Somewhere else' },
]
