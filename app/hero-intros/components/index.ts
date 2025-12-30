import dynamic from 'next/dynamic'
import type { HeroIntro } from '../types'

const CurtainRise = dynamic(() => import('./CurtainRise'), { ssr: false })
const BookOpening = dynamic(() => import('./BookOpening'), { ssr: false })
const GrandDoor = dynamic(() => import('./GrandDoor'), { ssr: false })
const VenetianBlinds = dynamic(() => import('./VenetianBlinds'), { ssr: false })
const EnvelopeUnsealing = dynamic(() => import('./EnvelopeUnsealing'), { ssr: false })
const RetroTV = dynamic(() => import('./RetroTV'), { ssr: false })
const CameraAperture = dynamic(() => import('./CameraAperture'), { ssr: false })
const SunriseDawn = dynamic(() => import('./SunriseDawn'), { ssr: false })
const OrigamiUnfold = dynamic(() => import('./OrigamiUnfold'), { ssr: false })
const FilmReel = dynamic(() => import('./FilmReel'), { ssr: false })
const ElevatorDoors = dynamic(() => import('./ElevatorDoors'), { ssr: false })
const VaultDoor = dynamic(() => import('./VaultDoor'), { ssr: false })

export const heroIntros: HeroIntro[] = [
  {
    id: 'curtain-rise',
    name: 'The Curtain Rise',
    era: 'Ancient Greece',
    year: '500 BCE',
    description: 'Inspired by the theatrical traditions of ancient amphitheaters, where velvet curtains would rise to reveal the dramatic world within.',
    inspiration: 'Greek theater and Broadway stages',
    component: CurtainRise,
  },
  {
    id: 'book-opening',
    name: 'The Book Opening',
    era: 'Medieval',
    year: '1450 CE',
    description: 'Echoing the moment a leather-bound tome is opened, revealing stories and wisdom preserved for centuries.',
    inspiration: 'Gutenberg printing press and illuminated manuscripts',
    component: BookOpening,
  },
  {
    id: 'grand-door',
    name: 'The Grand Door',
    era: 'Renaissance',
    year: '1500 CE',
    description: 'Great wooden doors of cathedrals and palaces swinging open to welcome visitors into magnificent spaces.',
    inspiration: 'Gothic cathedrals and Renaissance architecture',
    component: GrandDoor,
  },
  {
    id: 'venetian-blinds',
    name: 'The Venetian Blinds',
    era: 'Industrial',
    year: '1769 CE',
    description: 'The gentle rotation of slats revealing morning light, a daily ritual transformed into digital poetry.',
    inspiration: 'Victorian window treatments and film noir cinematography',
    component: VenetianBlinds,
  },
  {
    id: 'envelope-unsealing',
    name: 'The Envelope Unsealing',
    era: 'Victorian',
    year: '1840 CE',
    description: 'The anticipation of breaking a wax seal and unfolding a personal letter, intimate and expectant.',
    inspiration: 'Penny Post and love letter traditions',
    component: EnvelopeUnsealing,
  },
  {
    id: 'retro-tv',
    name: 'The Retro TV',
    era: 'Mid-Century',
    year: '1950 CE',
    description: 'The warm glow of vacuum tubes, static clearing to reveal the magic of broadcast entertainment.',
    inspiration: 'Golden age of television and family living rooms',
    component: RetroTV,
  },
  {
    id: 'camera-aperture',
    name: 'The Camera Aperture',
    era: 'Photography Era',
    year: '1900 CE',
    description: 'The mechanical iris of a camera lens opening to capture a perfect moment in time.',
    inspiration: 'Classic photography and James Bond title sequences',
    component: CameraAperture,
  },
  {
    id: 'sunrise-dawn',
    name: 'The Sunrise Dawn',
    era: 'Timeless',
    year: 'Eternal',
    description: 'Nature\'s own reveal - the sun cresting the horizon, painting the world in golden light.',
    inspiration: 'Every morning since the beginning of time',
    component: SunriseDawn,
  },
  {
    id: 'origami-unfold',
    name: 'The Origami Unfold',
    era: 'Edo Period',
    year: '1680 CE',
    description: 'The delicate art of Japanese paper folding reversed, complexity becoming elegant simplicity.',
    inspiration: 'Japanese origami traditions and minimalist design',
    component: OrigamiUnfold,
  },
  {
    id: 'film-reel',
    name: 'The Film Reel',
    era: 'Cinema Age',
    year: '1920 CE',
    description: 'The countdown, the projector\'s whir, and the silver screen coming alive with moving pictures.',
    inspiration: 'Silent films and classic Hollywood',
    component: FilmReel,
  },
  {
    id: 'elevator-doors',
    name: 'The Elevator Doors',
    era: 'Art Deco',
    year: '1930 CE',
    description: 'The ding of arrival, polished brass doors parting to reveal the grandeur of a new floor.',
    inspiration: 'Empire State Building and grand hotel lobbies',
    component: ElevatorDoors,
  },
  {
    id: 'vault-door',
    name: 'The Vault Door',
    era: 'Modern Security',
    year: '1960 CE',
    description: 'The satisfying click of tumblers, the turn of the wheel, and the swing of impenetrable steel.',
    inspiration: 'Bank heist films and Fort Knox',
    component: VaultDoor,
  },
]

export {
  CurtainRise,
  BookOpening,
  GrandDoor,
  VenetianBlinds,
  EnvelopeUnsealing,
  RetroTV,
  CameraAperture,
  SunriseDawn,
  OrigamiUnfold,
  FilmReel,
  ElevatorDoors,
  VaultDoor,
}
