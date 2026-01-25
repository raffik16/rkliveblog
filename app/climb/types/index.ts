// Game types for Free Solo Climber

export interface Position {
  x: number
  y: number
}

export interface Hold {
  id: number
  x: number
  y: number
  width: number
  height: number
  type: 'stable' | 'crumbling' | 'icy' | 'perfect'
  crumbleTimer?: number
  grabbed: boolean
}

export interface Obstacle {
  id: number
  type: 'rock' | 'bird' | 'wind'
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  rotation: number
}

export interface Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  life: number
  maxLife: number
  size: number
  color: string
  type: 'dust' | 'spark' | 'snow' | 'chalk'
}

export interface Climber {
  x: number
  y: number
  velocityY: number
  velocityX: number
  rotation: number
  state: 'climbing' | 'jumping' | 'falling' | 'grabbing'
  stamina: number
  leftHand: Position
  rightHand: Position
  activeHand: 'left' | 'right'
}

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameover'
  score: number
  highScore: number
  altitude: number
  maxAltitude: number
  difficulty: number
  combo: number
  maxCombo: number
}

export interface WindGust {
  active: boolean
  direction: 'left' | 'right'
  strength: number
  duration: number
  timer: number
}

export interface GameConfig {
  gravity: number
  jumpForce: number
  holdSpacing: number
  obstacleFrequency: number
  windFrequency: number
}
