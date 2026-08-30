// Skateboard Motion Example Types

export interface Vector2D {
  x: number
  y: number
}

export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface PhysicsState {
  position: Vector2D
  velocity: Vector2D
  acceleration: Vector2D
  rotation: Vector3D
  angularVelocity: Vector3D
  isGrounded: boolean
  isGrinding: boolean
}

export interface SkateboardMetrics {
  speed: number
  maxSpeed: number
  airTime: number
  totalAirTime: number
  currentTrick: string | null
  trickCombo: number
  score: number
  height: number
  maxHeight: number
  rotationDegrees: number
  flipCount: number
}

export interface TrickDefinition {
  id: string
  name: string
  displayName: string
  difficulty: 1 | 2 | 3 | 4 | 5
  baseScore: number
  rotationAxis: 'x' | 'y' | 'z' | 'xy' | 'xz' | 'yz' | 'xyz'
  rotationAmount: number
  flipCount: number
  duration: number
  description: string
  keyframes: TrickKeyframe[]
}

export interface TrickKeyframe {
  time: number // 0-1 normalized
  rotation: Vector3D
  scale: Vector3D
  translateY: number
}

export interface ParticleConfig {
  type: 'spark' | 'dust' | 'trail' | 'impact'
  count: number
  lifetime: number
  speed: number
  size: number
  color: string
  gravity: number
  spread: number
  fadeOut: boolean
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
  type: ParticleConfig['type']
}

export interface GroundSegment {
  id: string
  type: 'flat' | 'ramp' | 'rail' | 'quarter-pipe' | 'half-pipe' | 'gap'
  startX: number
  endX: number
  height: number
  angle: number
  color: string
}

export interface GameState {
  isPlaying: boolean
  isPaused: boolean
  time: number
  level: number
}

export interface ControlState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  jump: boolean
  trick1: boolean
  trick2: boolean
  trick3: boolean
  trick4: boolean
}

export type TabType = 'physics' | 'tricks' | 'particles' | 'metrics'

export interface PhysicsConfig {
  gravity: number
  friction: number
  airResistance: number
  groundBounce: number
  maxVelocity: number
  jumpForce: number
  pushForce: number
  rotationSpeed: number
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: 980, // pixels per second squared
  friction: 0.98,
  airResistance: 0.995,
  groundBounce: 0.3,
  maxVelocity: 800,
  jumpForce: 450,
  pushForce: 200,
  rotationSpeed: 360,
}
