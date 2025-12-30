export interface HeroIntro {
  id: string
  name: string
  era: string
  year: string
  description: string
  inspiration: string
  component: React.ComponentType<HeroIntroProps>
}

export interface HeroIntroProps {
  isFullscreen?: boolean
  onComplete?: () => void
  isPlaying?: boolean
}

export type AnimationPhase = 'idle' | 'entering' | 'complete'
