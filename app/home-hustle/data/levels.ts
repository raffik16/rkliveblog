import type { Level, StationType } from '../types'

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Laundry Day',
    description: 'Welcome to Home Hustle! Start by mastering the basics of laundry.',
    timeLimit: 120,
    targetScore: 100,
    threeStarScore: 200,
    availableStations: ['hamper', 'washer', 'dryer', 'folding-table', 'dresser'],
    orderFrequency: 15,
    maxActiveOrders: 2,
    unlocked: true,
  },
  {
    id: 2,
    name: 'Closet Chaos',
    description: 'Time to organize the closet! Hang those clothes properly.',
    timeLimit: 150,
    targetScore: 150,
    threeStarScore: 300,
    availableStations: ['hamper', 'washer', 'dryer', 'folding-table', 'closet', 'dresser'],
    orderFrequency: 12,
    maxActiveOrders: 3,
    unlocked: false,
  },
  {
    id: 3,
    name: 'Linen Service',
    description: 'Towels, sheets, and more! Keep the linen closet stocked.',
    timeLimit: 180,
    targetScore: 200,
    threeStarScore: 400,
    availableStations: ['hamper', 'washer', 'dryer', 'folding-table', 'linen-closet', 'dresser'],
    orderFrequency: 10,
    maxActiveOrders: 3,
    unlocked: false,
  },
  {
    id: 4,
    name: 'Kitchen Duty',
    description: 'Stock those cabinets and organize the pantry!',
    timeLimit: 120,
    targetScore: 150,
    threeStarScore: 300,
    availableStations: ['cabinet', 'pantry'],
    orderFrequency: 8,
    maxActiveOrders: 4,
    unlocked: false,
  },
  {
    id: 5,
    name: 'Bathroom Break',
    description: 'Keep the bathroom essentials organized and accessible.',
    timeLimit: 120,
    targetScore: 150,
    threeStarScore: 300,
    availableStations: ['bathroom-cabinet'],
    orderFrequency: 6,
    maxActiveOrders: 4,
    unlocked: false,
  },
  {
    id: 6,
    name: 'Toy Story',
    description: 'Clean up the playroom! Get those toys back in their bins.',
    timeLimit: 90,
    targetScore: 200,
    threeStarScore: 400,
    availableStations: ['toy-bin'],
    orderFrequency: 5,
    maxActiveOrders: 5,
    unlocked: false,
  },
  {
    id: 7,
    name: 'Full House',
    description: 'The ultimate challenge! Manage the entire home.',
    timeLimit: 240,
    targetScore: 500,
    threeStarScore: 1000,
    availableStations: [
      'hamper',
      'washer',
      'dryer',
      'folding-table',
      'closet',
      'dresser',
      'linen-closet',
      'cabinet',
      'pantry',
      'toy-bin',
      'bathroom-cabinet',
    ],
    orderFrequency: 8,
    maxActiveOrders: 5,
    unlocked: false,
  },
  {
    id: 8,
    name: 'Speed Clean',
    description: 'Rush hour! Complete orders as fast as possible.',
    timeLimit: 60,
    targetScore: 300,
    threeStarScore: 600,
    availableStations: ['hamper', 'washer', 'dryer', 'folding-table', 'dresser', 'closet'],
    orderFrequency: 5,
    maxActiveOrders: 6,
    unlocked: false,
  },
  {
    id: 9,
    name: 'Spring Cleaning',
    description: 'Deep clean the entire house! Time is of the essence.',
    timeLimit: 300,
    targetScore: 800,
    threeStarScore: 1500,
    availableStations: [
      'hamper',
      'washer',
      'dryer',
      'folding-table',
      'closet',
      'dresser',
      'linen-closet',
      'cabinet',
      'pantry',
      'toy-bin',
      'bathroom-cabinet',
    ],
    orderFrequency: 6,
    maxActiveOrders: 6,
    unlocked: false,
  },
  {
    id: 10,
    name: 'Home Hustle Master',
    description: "You've made it! Prove you're the ultimate home organizer.",
    timeLimit: 360,
    targetScore: 1200,
    threeStarScore: 2000,
    availableStations: [
      'hamper',
      'washer',
      'dryer',
      'folding-table',
      'closet',
      'dresser',
      'linen-closet',
      'cabinet',
      'pantry',
      'toy-bin',
      'bathroom-cabinet',
    ],
    orderFrequency: 4,
    maxActiveOrders: 8,
    unlocked: false,
  },
]

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((level) => level.id === id)
}

export function unlockNextLevel(currentLevelId: number): Level[] {
  return LEVELS.map((level) => {
    if (level.id === currentLevelId + 1) {
      return { ...level, unlocked: true }
    }
    return level
  })
}

export function calculateStars(score: number, level: Level): number {
  if (score >= level.threeStarScore) return 3
  if (score >= level.targetScore) return 2
  if (score >= level.targetScore * 0.5) return 1
  return 0
}

export const DIFFICULTY_SETTINGS = {
  easy: {
    orderFrequencyMultiplier: 1.5,
    processTimeMultiplier: 0.75,
    timeLimitMultiplier: 1.25,
  },
  normal: {
    orderFrequencyMultiplier: 1,
    processTimeMultiplier: 1,
    timeLimitMultiplier: 1,
  },
  hard: {
    orderFrequencyMultiplier: 0.75,
    processTimeMultiplier: 1.25,
    timeLimitMultiplier: 0.8,
  },
}
