import type { GameItem, ItemCategory, ItemType, ItemColor, ItemState } from '../types'

// Item templates for generating game items
export interface ItemTemplate {
  category: ItemCategory
  type: ItemType
  emoji: string
  name: string
  requiredSteps: ItemState[]
}

export const CLOTHING_ITEMS: ItemTemplate[] = [
  {
    category: 'clothing',
    type: 'shirt',
    emoji: '👕',
    name: 'Shirt',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
  {
    category: 'clothing',
    type: 'pants',
    emoji: '👖',
    name: 'Pants',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'hung'],
  },
  {
    category: 'clothing',
    type: 'socks',
    emoji: '🧦',
    name: 'Socks',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
  {
    category: 'clothing',
    type: 'dress',
    emoji: '👗',
    name: 'Dress',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'hung'],
  },
  {
    category: 'clothing',
    type: 'jacket',
    emoji: '🧥',
    name: 'Jacket',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'hung'],
  },
  {
    category: 'clothing',
    type: 'sweater',
    emoji: '🧶',
    name: 'Sweater',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
]

export const LINEN_ITEMS: ItemTemplate[] = [
  {
    category: 'linen',
    type: 'towel',
    emoji: '🛁',
    name: 'Towel',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
  {
    category: 'linen',
    type: 'bedsheet',
    emoji: '🛏️',
    name: 'Bedsheet',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
  {
    category: 'linen',
    type: 'pillowcase',
    emoji: '🛋️',
    name: 'Pillowcase',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
  {
    category: 'linen',
    type: 'blanket',
    emoji: '🧣',
    name: 'Blanket',
    requiredSteps: ['dirty', 'washing', 'wet', 'drying', 'clean', 'folded'],
  },
]

export const DISH_ITEMS: ItemTemplate[] = [
  {
    category: 'dish',
    type: 'plate',
    emoji: '🍽️',
    name: 'Plate',
    requiredSteps: ['dirty', 'washing', 'clean', 'stored'],
  },
  {
    category: 'dish',
    type: 'bowl',
    emoji: '🥣',
    name: 'Bowl',
    requiredSteps: ['dirty', 'washing', 'clean', 'stored'],
  },
  {
    category: 'dish',
    type: 'cup',
    emoji: '☕',
    name: 'Cup',
    requiredSteps: ['dirty', 'washing', 'clean', 'stored'],
  },
  {
    category: 'dish',
    type: 'glass',
    emoji: '🥛',
    name: 'Glass',
    requiredSteps: ['dirty', 'washing', 'clean', 'stored'],
  },
  {
    category: 'dish',
    type: 'pot',
    emoji: '🍲',
    name: 'Pot',
    requiredSteps: ['dirty', 'washing', 'clean', 'stored'],
  },
  {
    category: 'dish',
    type: 'pan',
    emoji: '🍳',
    name: 'Pan',
    requiredSteps: ['dirty', 'washing', 'clean', 'stored'],
  },
]

export const PANTRY_ITEMS: ItemTemplate[] = [
  {
    category: 'pantry',
    type: 'cereal',
    emoji: '🥣',
    name: 'Cereal',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'pantry',
    type: 'canned-goods',
    emoji: '🥫',
    name: 'Canned Goods',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'pantry',
    type: 'pasta',
    emoji: '🍝',
    name: 'Pasta',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'pantry',
    type: 'spices',
    emoji: '🧂',
    name: 'Spices',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'pantry',
    type: 'snacks',
    emoji: '🍪',
    name: 'Snacks',
    requiredSteps: ['clean', 'stored'],
  },
]

export const BATHROOM_ITEMS: ItemTemplate[] = [
  {
    category: 'bathroom',
    type: 'soap',
    emoji: '🧼',
    name: 'Soap',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'bathroom',
    type: 'shampoo',
    emoji: '🧴',
    name: 'Shampoo',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'bathroom',
    type: 'toothpaste',
    emoji: '🪥',
    name: 'Toothpaste',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'bathroom',
    type: 'toilet-paper',
    emoji: '🧻',
    name: 'Toilet Paper',
    requiredSteps: ['clean', 'stored'],
  },
]

export const TOY_ITEMS: ItemTemplate[] = [
  {
    category: 'toy',
    type: 'stuffed-animal',
    emoji: '🧸',
    name: 'Teddy Bear',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'toy',
    type: 'blocks',
    emoji: '🧱',
    name: 'Blocks',
    requiredSteps: ['clean', 'stored'],
  },
  {
    category: 'toy',
    type: 'puzzle',
    emoji: '🧩',
    name: 'Puzzle',
    requiredSteps: ['clean', 'stored'],
  },
  { category: 'toy', type: 'ball', emoji: '⚽', name: 'Ball', requiredSteps: ['clean', 'stored'] },
]

export const ACCESSORY_ITEMS: ItemTemplate[] = [
  {
    category: 'accessory',
    type: 'hat',
    emoji: '🧢',
    name: 'Hat',
    requiredSteps: ['clean', 'hung'],
  },
  {
    category: 'accessory',
    type: 'belt',
    emoji: '👔',
    name: 'Belt',
    requiredSteps: ['clean', 'hung'],
  },
  {
    category: 'accessory',
    type: 'scarf',
    emoji: '🧣',
    name: 'Scarf',
    requiredSteps: ['clean', 'hung'],
  },
  {
    category: 'accessory',
    type: 'bag',
    emoji: '👜',
    name: 'Bag',
    requiredSteps: ['clean', 'stored'],
  },
]

export const ALL_ITEM_TEMPLATES: ItemTemplate[] = [
  ...CLOTHING_ITEMS,
  ...LINEN_ITEMS,
  ...DISH_ITEMS,
  ...PANTRY_ITEMS,
  ...BATHROOM_ITEMS,
  ...TOY_ITEMS,
  ...ACCESSORY_ITEMS,
]

export const ITEM_COLORS: ItemColor[] = [
  'red',
  'blue',
  'green',
  'yellow',
  'white',
  'black',
  'pink',
  'purple',
  'orange',
  'gray',
]

export const COLOR_CLASSES: Record<ItemColor, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  white: 'bg-white',
  black: 'bg-gray-800',
  pink: 'bg-pink-400',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  gray: 'bg-gray-400',
}

export const COLOR_BORDER_CLASSES: Record<ItemColor, string> = {
  red: 'border-red-400',
  blue: 'border-blue-400',
  green: 'border-green-400',
  yellow: 'border-yellow-300',
  white: 'border-gray-200',
  black: 'border-gray-600',
  pink: 'border-pink-300',
  purple: 'border-purple-400',
  orange: 'border-orange-400',
  gray: 'border-gray-300',
}

let itemIdCounter = 0

export function createGameItem(template: ItemTemplate, color?: ItemColor): GameItem {
  const selectedColor = color || ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)]
  return {
    id: `item-${++itemIdCounter}`,
    category: template.category,
    type: template.type,
    state: template.requiredSteps[0],
    color: selectedColor,
    emoji: template.emoji,
    name: template.name,
    requiredSteps: template.requiredSteps,
    currentStepIndex: 0,
  }
}

export function getRandomItemTemplate(category?: ItemCategory): ItemTemplate {
  let templates = ALL_ITEM_TEMPLATES
  if (category) {
    templates = ALL_ITEM_TEMPLATES.filter((t) => t.category === category)
  }
  return templates[Math.floor(Math.random() * templates.length)]
}

export function advanceItemState(item: GameItem): GameItem {
  if (item.currentStepIndex < item.requiredSteps.length - 1) {
    return {
      ...item,
      currentStepIndex: item.currentStepIndex + 1,
      state: item.requiredSteps[item.currentStepIndex + 1],
    }
  }
  return item
}

export const STATE_LABELS: Record<ItemState, string> = {
  dirty: 'Dirty',
  washing: 'Washing...',
  wet: 'Wet',
  drying: 'Drying...',
  clean: 'Clean',
  folded: 'Folded',
  hung: 'Hung',
  stored: 'Stored',
}

export const STATE_COLORS: Record<ItemState, string> = {
  dirty: 'text-amber-600',
  washing: 'text-blue-400 animate-pulse',
  wet: 'text-blue-500',
  drying: 'text-orange-400 animate-pulse',
  clean: 'text-emerald-400',
  folded: 'text-green-500',
  hung: 'text-green-500',
  stored: 'text-purple-400',
}
