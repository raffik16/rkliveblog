import type { Station, StationType, ItemCategory, ItemState } from '../types'

export interface StationTemplate {
  type: StationType
  name: string
  emoji: string
  capacity: number
  processTime: number
  acceptedCategories: ItemCategory[]
  inputStates: ItemState[]
  outputState: ItemState
  description: string
}

export const STATION_TEMPLATES: Record<StationType, StationTemplate> = {
  hamper: {
    type: 'hamper',
    name: 'Laundry Hamper',
    emoji: '🧺',
    capacity: 10,
    processTime: 0,
    acceptedCategories: ['clothing', 'linen'],
    inputStates: ['dirty'],
    outputState: 'dirty',
    description: 'Dirty laundry starts here',
  },
  washer: {
    type: 'washer',
    name: 'Washing Machine',
    emoji: '🌀',
    capacity: 4,
    processTime: 5,
    acceptedCategories: ['clothing', 'linen'],
    inputStates: ['dirty'],
    outputState: 'wet',
    description: 'Cleans dirty clothes',
  },
  dryer: {
    type: 'dryer',
    name: 'Dryer',
    emoji: '♨️',
    capacity: 4,
    processTime: 4,
    acceptedCategories: ['clothing', 'linen'],
    inputStates: ['wet'],
    outputState: 'clean',
    description: 'Dries wet clothes',
  },
  'folding-table': {
    type: 'folding-table',
    name: 'Folding Table',
    emoji: '📋',
    capacity: 6,
    processTime: 2,
    acceptedCategories: ['clothing', 'linen'],
    inputStates: ['clean'],
    outputState: 'folded',
    description: 'Fold clean clothes',
  },
  closet: {
    type: 'closet',
    name: 'Closet',
    emoji: '🚪',
    capacity: 12,
    processTime: 1,
    acceptedCategories: ['clothing', 'accessory'],
    inputStates: ['clean', 'folded'],
    outputState: 'hung',
    description: 'Hang clothes and accessories',
  },
  dresser: {
    type: 'dresser',
    name: 'Dresser',
    emoji: '🗄️',
    capacity: 8,
    processTime: 1,
    acceptedCategories: ['clothing', 'linen'],
    inputStates: ['folded'],
    outputState: 'stored',
    description: 'Store folded items',
  },
  cabinet: {
    type: 'cabinet',
    name: 'Kitchen Cabinet',
    emoji: '🗃️',
    capacity: 10,
    processTime: 1,
    acceptedCategories: ['dish'],
    inputStates: ['clean'],
    outputState: 'stored',
    description: 'Store clean dishes',
  },
  pantry: {
    type: 'pantry',
    name: 'Pantry',
    emoji: '🏪',
    capacity: 15,
    processTime: 1,
    acceptedCategories: ['pantry'],
    inputStates: ['clean'],
    outputState: 'stored',
    description: 'Store food items',
  },
  'toy-bin': {
    type: 'toy-bin',
    name: 'Toy Bin',
    emoji: '📦',
    capacity: 10,
    processTime: 1,
    acceptedCategories: ['toy'],
    inputStates: ['clean'],
    outputState: 'stored',
    description: 'Store toys neatly',
  },
  'bathroom-cabinet': {
    type: 'bathroom-cabinet',
    name: 'Bathroom Cabinet',
    emoji: '🪞',
    capacity: 8,
    processTime: 1,
    acceptedCategories: ['bathroom'],
    inputStates: ['clean'],
    outputState: 'stored',
    description: 'Store bathroom essentials',
  },
  'linen-closet': {
    type: 'linen-closet',
    name: 'Linen Closet',
    emoji: '🧺',
    capacity: 12,
    processTime: 1,
    acceptedCategories: ['linen'],
    inputStates: ['folded'],
    outputState: 'stored',
    description: 'Store linens and towels',
  },
}

let stationIdCounter = 0

export function createStation(
  template: StationTemplate,
  position: { x: number; y: number }
): Station {
  return {
    id: `station-${++stationIdCounter}`,
    type: template.type,
    name: template.name,
    emoji: template.emoji,
    position,
    capacity: template.capacity,
    items: [],
    processTime: template.processTime,
    isProcessing: false,
    processingProgress: 0,
    acceptedCategories: template.acceptedCategories,
    outputState: template.outputState,
    inputStates: template.inputStates,
  }
}

export function getStationTemplate(type: StationType): StationTemplate {
  return STATION_TEMPLATES[type]
}

// Station layout configurations for different level designs
export interface StationLayout {
  type: StationType
  gridX: number
  gridY: number
}

export const LAUNDRY_ROOM_LAYOUT: StationLayout[] = [
  { type: 'hamper', gridX: 0, gridY: 0 },
  { type: 'washer', gridX: 1, gridY: 0 },
  { type: 'dryer', gridX: 2, gridY: 0 },
  { type: 'folding-table', gridX: 3, gridY: 0 },
  { type: 'dresser', gridX: 0, gridY: 1 },
  { type: 'closet', gridX: 1, gridY: 1 },
  { type: 'linen-closet', gridX: 2, gridY: 1 },
]

export const KITCHEN_LAYOUT: StationLayout[] = [
  { type: 'cabinet', gridX: 0, gridY: 0 },
  { type: 'cabinet', gridX: 1, gridY: 0 },
  { type: 'pantry', gridX: 2, gridY: 0 },
  { type: 'pantry', gridX: 3, gridY: 0 },
]

export const FULL_HOUSE_LAYOUT: StationLayout[] = [
  // Laundry area
  { type: 'hamper', gridX: 0, gridY: 0 },
  { type: 'washer', gridX: 1, gridY: 0 },
  { type: 'dryer', gridX: 2, gridY: 0 },
  { type: 'folding-table', gridX: 3, gridY: 0 },
  // Storage area
  { type: 'closet', gridX: 0, gridY: 1 },
  { type: 'dresser', gridX: 1, gridY: 1 },
  { type: 'linen-closet', gridX: 2, gridY: 1 },
  { type: 'cabinet', gridX: 3, gridY: 1 },
  // More storage
  { type: 'pantry', gridX: 0, gridY: 2 },
  { type: 'toy-bin', gridX: 1, gridY: 2 },
  { type: 'bathroom-cabinet', gridX: 2, gridY: 2 },
]

export const STATION_COLORS: Record<StationType, { bg: string; border: string; text: string }> = {
  hamper: { bg: 'bg-amber-900/60', border: 'border-amber-600', text: 'text-amber-200' },
  washer: { bg: 'bg-blue-900/60', border: 'border-blue-500', text: 'text-blue-200' },
  dryer: { bg: 'bg-orange-900/60', border: 'border-orange-500', text: 'text-orange-200' },
  'folding-table': { bg: 'bg-slate-800/60', border: 'border-slate-500', text: 'text-slate-200' },
  closet: { bg: 'bg-purple-900/60', border: 'border-purple-500', text: 'text-purple-200' },
  dresser: { bg: 'bg-indigo-900/60', border: 'border-indigo-500', text: 'text-indigo-200' },
  cabinet: { bg: 'bg-cyan-900/60', border: 'border-cyan-500', text: 'text-cyan-200' },
  pantry: { bg: 'bg-green-900/60', border: 'border-green-500', text: 'text-green-200' },
  'toy-bin': { bg: 'bg-pink-900/60', border: 'border-pink-500', text: 'text-pink-200' },
  'bathroom-cabinet': { bg: 'bg-teal-900/60', border: 'border-teal-500', text: 'text-teal-200' },
  'linen-closet': { bg: 'bg-violet-900/60', border: 'border-violet-500', text: 'text-violet-200' },
}
