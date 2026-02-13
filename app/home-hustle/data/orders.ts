import type {
  Order,
  OrderRequirement,
  OrderPriority,
  ItemCategory,
  ItemState,
  StationType,
} from '../types'
import { ALL_ITEM_TEMPLATES, ITEM_COLORS, type ItemTemplate } from './items'

export interface OrderTemplate {
  name: string
  description: string
  requirements: Partial<OrderRequirement>[]
  basePoints: number
  baseTime: number
  category: ItemCategory
}

// Order templates for different types of requests
export const ORDER_TEMPLATES: OrderTemplate[] = [
  // Laundry orders
  {
    name: 'Folded Shirts',
    description: 'Need some freshly folded shirts!',
    requirements: [{ category: 'clothing', type: 'shirt', state: 'folded', quantity: 2 }],
    basePoints: 50,
    baseTime: 45,
    category: 'clothing',
  },
  {
    name: 'Hung Pants',
    description: 'Pants need to be hung in the closet.',
    requirements: [{ category: 'clothing', type: 'pants', state: 'hung', quantity: 2 }],
    basePoints: 50,
    baseTime: 50,
    category: 'clothing',
  },
  {
    name: 'Clean Socks',
    description: 'Fresh socks, please!',
    requirements: [{ category: 'clothing', type: 'socks', state: 'folded', quantity: 3 }],
    basePoints: 40,
    baseTime: 40,
    category: 'clothing',
  },
  {
    name: 'Full Outfit',
    description: 'Complete outfit needed!',
    requirements: [
      { category: 'clothing', type: 'shirt', state: 'folded', quantity: 1 },
      { category: 'clothing', type: 'pants', state: 'hung', quantity: 1 },
      { category: 'clothing', type: 'socks', state: 'folded', quantity: 1 },
    ],
    basePoints: 100,
    baseTime: 90,
    category: 'clothing',
  },
  // Linen orders
  {
    name: 'Fresh Towels',
    description: 'Clean towels for the bathroom!',
    requirements: [{ category: 'linen', type: 'towel', state: 'folded', quantity: 2 }],
    basePoints: 45,
    baseTime: 50,
    category: 'linen',
  },
  {
    name: 'Bed Set',
    description: 'Fresh sheets and pillowcases!',
    requirements: [
      { category: 'linen', type: 'bedsheet', state: 'folded', quantity: 1 },
      { category: 'linen', type: 'pillowcase', state: 'folded', quantity: 2 },
    ],
    basePoints: 80,
    baseTime: 75,
    category: 'linen',
  },
  // Kitchen orders
  {
    name: 'Clean Dishes',
    description: 'Store the clean plates and bowls!',
    requirements: [
      { category: 'dish', type: 'plate', state: 'stored', quantity: 2 },
      { category: 'dish', type: 'bowl', state: 'stored', quantity: 2 },
    ],
    basePoints: 60,
    baseTime: 40,
    category: 'dish',
  },
  {
    name: 'Stock Pantry',
    description: 'Fill up the pantry shelves!',
    requirements: [
      { category: 'pantry', type: 'cereal', state: 'stored', quantity: 1 },
      { category: 'pantry', type: 'canned-goods', state: 'stored', quantity: 2 },
    ],
    basePoints: 50,
    baseTime: 30,
    category: 'pantry',
  },
  // Bathroom orders
  {
    name: 'Bathroom Restock',
    description: 'Essentials for the bathroom cabinet!',
    requirements: [
      { category: 'bathroom', type: 'soap', state: 'stored', quantity: 1 },
      { category: 'bathroom', type: 'toilet-paper', state: 'stored', quantity: 2 },
    ],
    basePoints: 45,
    baseTime: 25,
    category: 'bathroom',
  },
  // Toy orders
  {
    name: 'Toy Cleanup',
    description: 'Get those toys back in the bin!',
    requirements: [{ category: 'toy', state: 'stored', quantity: 4 }],
    basePoints: 55,
    baseTime: 35,
    category: 'toy',
  },
  // Mixed orders
  {
    name: 'Room Ready',
    description: 'Complete room setup!',
    requirements: [
      { category: 'linen', type: 'bedsheet', state: 'folded', quantity: 1 },
      { category: 'linen', type: 'towel', state: 'folded', quantity: 1 },
      { category: 'clothing', type: 'shirt', state: 'hung', quantity: 1 },
    ],
    basePoints: 120,
    baseTime: 120,
    category: 'linen',
  },
]

let orderIdCounter = 0

export function generateOrder(
  availableStations: StationType[],
  difficulty: 'easy' | 'normal' | 'hard' = 'normal'
): Order {
  // Determine what categories are available based on stations
  const availableCategories = getAvailableCategoriesFromStations(availableStations)

  // Filter templates to only those we can fulfill
  const validTemplates = ORDER_TEMPLATES.filter((template) =>
    availableCategories.includes(template.category)
  )

  if (validTemplates.length === 0) {
    // Fallback to a simple order
    return generateSimpleOrder(availableCategories[0] || 'clothing', difficulty)
  }

  const template = validTemplates[Math.floor(Math.random() * validTemplates.length)]

  // Apply difficulty modifiers
  const timeMultiplier = difficulty === 'easy' ? 1.3 : difficulty === 'hard' ? 0.7 : 1
  const pointMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.5 : 1

  // Randomly assign priority
  const priorityRoll = Math.random()
  const priority: OrderPriority =
    priorityRoll < 0.6 ? 'normal' : priorityRoll < 0.9 ? 'rush' : 'urgent'

  const priorityTimeMultiplier = priority === 'urgent' ? 0.6 : priority === 'rush' ? 0.8 : 1
  const priorityPointMultiplier = priority === 'urgent' ? 2 : priority === 'rush' ? 1.5 : 1

  const timeLimit = Math.round(template.baseTime * timeMultiplier * priorityTimeMultiplier)
  const points = Math.round(template.basePoints * pointMultiplier * priorityPointMultiplier)

  // Add random colors to requirements
  const requirements: OrderRequirement[] = template.requirements.map((req) => ({
    category: req.category || 'clothing',
    type: req.type,
    state: req.state || 'clean',
    color:
      Math.random() > 0.5 ? ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)] : undefined,
    quantity: req.quantity || 1,
  }))

  return {
    id: `order-${++orderIdCounter}`,
    requirements,
    timeLimit,
    timeRemaining: timeLimit,
    priority,
    points,
    tipBonus: Math.round(points * 0.5),
    isCompleted: false,
    isFailed: false,
  }
}

function generateSimpleOrder(category: ItemCategory, difficulty: string): Order {
  const templates = ALL_ITEM_TEMPLATES.filter((t) => t.category === category)
  const template = templates[Math.floor(Math.random() * templates.length)]

  const targetState = template.requiredSteps[template.requiredSteps.length - 1]

  return {
    id: `order-${++orderIdCounter}`,
    requirements: [
      {
        category,
        type: template.type,
        state: targetState,
        quantity: 1,
      },
    ],
    timeLimit: 30,
    timeRemaining: 30,
    priority: 'normal',
    points: 25,
    tipBonus: 10,
    isCompleted: false,
    isFailed: false,
  }
}

function getAvailableCategoriesFromStations(stations: StationType[]): ItemCategory[] {
  const categoryMap: Record<StationType, ItemCategory[]> = {
    hamper: ['clothing', 'linen'],
    washer: ['clothing', 'linen'],
    dryer: ['clothing', 'linen'],
    'folding-table': ['clothing', 'linen'],
    closet: ['clothing', 'accessory'],
    dresser: ['clothing', 'linen'],
    cabinet: ['dish'],
    pantry: ['pantry'],
    'toy-bin': ['toy'],
    'bathroom-cabinet': ['bathroom'],
    'linen-closet': ['linen'],
  }

  const categories = new Set<ItemCategory>()
  stations.forEach((station) => {
    const stationCategories = categoryMap[station]
    if (stationCategories) {
      stationCategories.forEach((cat) => categories.add(cat))
    }
  })

  return Array.from(categories)
}

export function checkOrderCompletion(
  order: Order,
  completedItems: { category: ItemCategory; type?: string; state: ItemState; color?: string }[]
): boolean {
  return order.requirements.every((req) => {
    const matchingItems = completedItems.filter((item) => {
      if (item.category !== req.category) return false
      if (item.state !== req.state) return false
      if (req.type && item.type !== req.type) return false
      if (req.color && item.color !== req.color) return false
      return true
    })
    return matchingItems.length >= req.quantity
  })
}

export const PRIORITY_COLORS = {
  normal: { bg: 'bg-slate-700', border: 'border-slate-500', text: 'text-slate-200' },
  rush: { bg: 'bg-amber-700', border: 'border-amber-400', text: 'text-amber-100' },
  urgent: { bg: 'bg-red-700', border: 'border-red-400', text: 'text-red-100 animate-pulse' },
}

export const PRIORITY_LABELS = {
  normal: 'Normal',
  rush: 'Rush!',
  urgent: 'URGENT!',
}
