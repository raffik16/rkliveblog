// Home Hustle - An Overcooked-style home organization game

// ============ ITEM TYPES ============

export type ItemCategory =
  | 'clothing'
  | 'linen'
  | 'dish'
  | 'pantry'
  | 'bathroom'
  | 'toy'
  | 'accessory'

export type ClothingType =
  | 'shirt'
  | 'pants'
  | 'socks'
  | 'underwear'
  | 'dress'
  | 'jacket'
  | 'sweater'

export type LinenType = 'towel' | 'bedsheet' | 'pillowcase' | 'blanket' | 'washcloth'

export type DishType = 'plate' | 'bowl' | 'cup' | 'glass' | 'utensil' | 'pot' | 'pan'

export type PantryType = 'cereal' | 'canned-goods' | 'pasta' | 'spices' | 'snacks' | 'baking'

export type BathroomType = 'soap' | 'shampoo' | 'toothpaste' | 'toilet-paper' | 'medicine'

export type ToyType = 'stuffed-animal' | 'blocks' | 'puzzle' | 'doll' | 'car' | 'ball'

export type AccessoryType = 'hat' | 'belt' | 'scarf' | 'gloves' | 'bag'

export type ItemType =
  | ClothingType
  | LinenType
  | DishType
  | PantryType
  | BathroomType
  | ToyType
  | AccessoryType

export type ItemState =
  | 'dirty'
  | 'washing'
  | 'wet'
  | 'drying'
  | 'clean'
  | 'folded'
  | 'hung'
  | 'stored'

export type ItemColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'white'
  | 'black'
  | 'pink'
  | 'purple'
  | 'orange'
  | 'gray'

export interface GameItem {
  id: string
  category: ItemCategory
  type: ItemType
  state: ItemState
  color: ItemColor
  emoji: string
  name: string
  requiredSteps: ItemState[]
  currentStepIndex: number
}

// ============ STATION TYPES ============

export type StationType =
  | 'hamper'
  | 'washer'
  | 'dryer'
  | 'folding-table'
  | 'closet'
  | 'dresser'
  | 'cabinet'
  | 'pantry'
  | 'toy-bin'
  | 'bathroom-cabinet'
  | 'linen-closet'

export interface Station {
  id: string
  type: StationType
  name: string
  emoji: string
  position: { x: number; y: number }
  capacity: number
  items: GameItem[]
  processTime: number // in seconds
  isProcessing: boolean
  processingProgress: number // 0-100
  acceptedCategories: ItemCategory[]
  outputState: ItemState
  inputStates: ItemState[]
}

// ============ ORDER TYPES ============

export type OrderPriority = 'normal' | 'rush' | 'urgent'

export interface OrderRequirement {
  category: ItemCategory
  type?: ItemType
  state: ItemState
  color?: ItemColor
  quantity: number
}

export interface Order {
  id: string
  requirements: OrderRequirement[]
  timeLimit: number // in seconds
  timeRemaining: number
  priority: OrderPriority
  points: number
  tipBonus: number // extra points for fast completion
  isCompleted: boolean
  isFailed: boolean
}

// ============ PLAYER TYPES ============

export interface Player {
  id: string
  name: string
  color: string
  position: { x: number; y: number }
  heldItem: GameItem | null
  score: number
  avatar: string
}

// ============ GAME STATE ============

export type GamePhase = 'menu' | 'tutorial' | 'playing' | 'paused' | 'levelComplete' | 'gameOver'

export interface Level {
  id: number
  name: string
  description: string
  timeLimit: number
  targetScore: number
  threeStarScore: number
  availableStations: StationType[]
  orderFrequency: number // seconds between new orders
  maxActiveOrders: number
  unlocked: boolean
}

export interface GameState {
  phase: GamePhase
  currentLevel: Level | null
  players: Player[]
  stations: Station[]
  items: GameItem[]
  activeOrders: Order[]
  completedOrders: Order[]
  failedOrders: Order[]
  score: number
  timeRemaining: number
  isPaused: boolean
  comboMultiplier: number
  consecutiveCompletions: number
}

// ============ GAME ACTIONS ============

export type GameAction =
  | { type: 'START_GAME'; level: Level }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'PICK_UP_ITEM'; playerId: string; itemId: string }
  | { type: 'DROP_ITEM'; playerId: string; stationId: string }
  | { type: 'PROCESS_STATION'; stationId: string }
  | { type: 'COMPLETE_ORDER'; orderId: string }
  | { type: 'FAIL_ORDER'; orderId: string }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'TICK'; deltaTime: number }
  | { type: 'GAME_OVER' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESTART_LEVEL' }

// ============ UI TYPES ============

export interface Notification {
  id: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  duration: number
}

export interface Tutorial {
  step: number
  title: string
  description: string
  highlightElement?: string
}
