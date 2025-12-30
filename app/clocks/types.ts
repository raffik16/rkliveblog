export interface ClockProps {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export interface ClockInfo {
  id: string
  name: string
  era: string
  year: string
  description: string
  color: string
  bgGradient: string
}

export const clockData: ClockInfo[] = [
  {
    id: 'egyptian',
    name: 'Egyptian Sundial',
    era: 'Ancient Egypt',
    year: '1500 BCE',
    description: 'Shadows dance across sacred stone',
    color: '#D4A574',
    bgGradient: 'linear-gradient(135deg, #2C1810 0%, #4A3728 50%, #8B7355 100%)',
  },
  {
    id: 'medieval',
    name: 'Medieval Cathedral',
    era: 'Medieval Europe',
    year: '1300 CE',
    description: 'Iron bells call the faithful',
    color: '#8B4513',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 'rococo',
    name: 'French Rococo',
    era: 'Versailles',
    year: '1750',
    description: 'Gilded elegance in motion',
    color: '#FFD700',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d132c 50%, #4a1942 100%)',
  },
  {
    id: 'victorian',
    name: 'Victorian Railway',
    era: 'British Empire',
    year: '1840',
    description: 'The authority of empire',
    color: '#1C1C1C',
    bgGradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a5568 100%)',
  },
  {
    id: 'artdeco',
    name: 'Art Deco',
    era: 'Roaring Twenties',
    year: '1925',
    description: 'Machine age precision',
    color: '#C9A227',
    bgGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
  },
  {
    id: 'swiss',
    name: 'Swiss Luxury',
    era: 'Swiss Craftsmanship',
    year: '1950',
    description: 'Mechanical poetry',
    color: '#C0C0C0',
    bgGradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #232350 100%)',
  },
  {
    id: 'soviet',
    name: 'Soviet Constructivist',
    era: 'USSR',
    year: '1960',
    description: 'Revolutionary minimalism',
    color: '#CC0000',
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
  },
  {
    id: 'japanese',
    name: 'Japanese Minimalist',
    era: 'Zen Philosophy',
    year: '1970',
    description: 'Empty space as virtue',
    color: '#2C2C2C',
    bgGradient: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 50%, #e8e8e8 100%)',
  },
  {
    id: 'atomic',
    name: 'Atomic Starburst',
    era: 'Mid-Century Modern',
    year: '1955',
    description: 'Space age optimism',
    color: '#FF6B35',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a3a4a 100%)',
  },
  {
    id: 'digital',
    name: 'Digital LED',
    era: 'Digital Revolution',
    year: '1975',
    description: 'The dawn of data',
    color: '#FF0000',
    bgGradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
  },
  {
    id: 'smartwatch',
    name: 'Smart Watch',
    era: 'Connected Age',
    year: '2015',
    description: 'Personal time quantified',
    color: '#00D4AA',
    bgGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f1f2e 100%)',
  },
  {
    id: 'holographic',
    name: 'Holographic Future',
    era: 'Tomorrow',
    year: '2030',
    description: 'Time transcends matter',
    color: '#00FFFF',
    bgGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)',
  },
]
