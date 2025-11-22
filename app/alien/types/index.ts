export interface SpeedMetrics {
  velocity: number // km/s
  acceleration: number // g-force
  maxSpeed: number // km/s
  currentMedium: 'air' | 'water' | 'space' | 'vacuum'
  warpFactor?: number
}

export interface TransMediumData {
  medium: 'air' | 'water' | 'space'
  depth?: number // meters
  altitude?: number // meters
  pressure: number // atmospheres
  temperature: number // celsius
  performanceLoss: number // percentage
}

export interface AntiGravityMetrics {
  gravityReduction: number // percentage
  fieldStrength: number // teslas
  windSpeed: number // km/h
  windDirection: number // degrees
  stabilityIndex: number // 0-100
}

export interface BiologicalEffect {
  id: string
  type: 'bleeding' | 'scarring' | 'radiation' | 'neurological'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  distance: number // meters from craft
  electricalFieldStrength: number // volts/meter
  duration: number // seconds
  symptoms: string[]
}

export interface ObservabilityData {
  radarSignature: number // RCS in m²
  infraredSignature: number // temperature in K
  visualDetection: boolean
  electromagneticEmissions: number // watts
  acousticSignature: number // decibels
  timestamp: number
}

export interface WarpMetrics {
  engaged: boolean
  warpFactor: number // 1-10
  distortionField: number // percentage
  energyConsumption: number // gigawatts
  spacetimeCurvature: number
}
