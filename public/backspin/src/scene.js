// The club in 3D, drawn with three.js: the pad gates you play into (eight, or Hybrid's six), the
// tunnel the notes fly down, the two turntables, the crossfader, the crowd and the lights.
//
// The camera looks straight down the tunnel from the DJ booth, level with the middle of the pad
// grid. Every note flies down its own lane towards the gate of its pad, so the grid on screen is
// the grid under your fingers (on the keyboard or a pad controller), and a note is due when it
// fills its gate. Looking along the lanes means two rows can never cover each other: notes for
// the top row climb as they come, notes for the bottom row drop. The scratch lane comes in to the
// record and the crossfader's lane runs under the pads. Where the decks and the fader sit, beside
// the pads or under them, depends on the shape of the screen (RIGS, fit()).
//
// Everything that moves is an InstancedMesh or a shader uniform, set from the game's state each
// frame: nothing is created while a song plays. The glow is a bloom pass over the whole frame.
//
// The glow spreads anything it's given across the frame, so a single pixel that comes out NaN
// turns the whole frame black for that frame: a flicker. The shaders here never take pow() of
// a number that could be negative or divide by something that could be zero, because on some
// GPUs (Apple's among them) those give NaN.

import * as THREE from '../vendor/three.js'
import { BEAT } from './music.js'
import { PADS, PAD_COUNT, PAD_INDEX, LAYOUTS, layoutFor } from './pads.js'

export const LOOKAHEAD = 2 // seconds a note takes to come down the tunnel
export const RPS = 33.333 / 60 // platter turns per second of record at normal speed

// The world, in units about one pad wide
const PAD = 1
const GAP = 0.16
const PITCH = PAD + GAP
const NOTE = 0.84 // a note tile, as a share of its pad
const HALF_H = PITCH // the grid's outer rails, above and below (its width depends on the layout)
const DECK_R = 0.86
const PLATE = DECK_R + 0.25 // half the width of a deck's plate
const FADER_HALF = 1
// Where the decks and the crossfader go round the pads. On a wide screen, side by side: a deck
// either side of the pads and the crossfader under them. On a tall one (a phone or a tablet held
// upright) that would leave the pads tiny, so the rig stacks: the crossfader under the pads and
// the two decks under it. The Scratch Deck is at (-deckX, deckY), the Beat Deck at (deckX, deckY).
// Stacked, the decks sit far enough under the fader for the scratch arrow to fit between them.
const RIGS = {
  side: { name: 'side', deckX: 3.6, deckY: 0, faderY: -1.82, reachOut: GAP, recordReach: 1.25 },
  stacked: {
    name: 'stacked',
    deckX: 1.3,
    deckY: -3.95,
    faderY: -1.82,
    reachOut: 0.3,
    recordReach: 1.35,
  },
}
// How far past its edges a pad answers a click or a tap: halfway across the gap to the next pad,
// so neighbours meet but never overlap, and further on the grid's outside (the rig's reachOut
// at the sides, more above, where only the HUD is), still clear of the record and (below the
// grid, only half a gap) of the crossfader
const REACH_IN = GAP / 2
const REACH_ABOVE = 0.36
const REACH_BELOW = GAP / 2
// What the HUD draws round the rig, in CSS pixels: a band along the top for the score, the hype
// meter and the combo (a share of the height, within limits; stacked, on a narrow screen, the
// score and the hype meter meet in the middle, so the combo and the calls need room under
// them), the fader's marks under it, and the deck labels and the loop buttons under the Beat
// Deck (with the sandbox's switch under those too when stacked; side by side it moves above the
// deck if it has to)
const HUD_TOP = { side: [0.16, 60, 160], stacked: [0.16, 116, 160] }
const HUD_FADER = 14
const HUD_DECK = { side: 62, stacked: 100 }
const EDGE = 10 // the least space at the sides of the screen
const BOTTOM = 6 // and at the bottom
// Side by side on a big screen, the club keeps its roomy framing (room for 4.96 units either
// side of the middle of the grid and 2.72 above and below, as it always had). It only fills the
// screen more tightly where the pads would otherwise come out smaller than this many pixels.
const ROOMY = { halfW: 4.96, halfH: 2.72, pad: 110 }
const Z_FAR = 64 // where notes appear
const SPEED = Z_FAR / LOOKAHEAD
const FOV = 46
const TAU = Math.PI * 2

const HEX = {
  bg: 0x07050c,
  fog: 0x12081e,
  magenta: 0xff2bd6,
  cyan: 0x22e4ff,
  violet: 0xa77bff,
  white: 0xf5f1ff,
  lime: 0xd8ff3c,
  red: 0xff4d6d,
}
const FADE_X = { L: -FADER_HALF, C: 0, R: FADER_HALF }
const FADE_FRAME = { L: 0, C: 1, R: 2 }

const MISS_RED = new THREE.Color(1.2, 0.05, 0.1)
const BOOST_TINT = new THREE.Color(0.7, 1, 0.1)
const LIME = new THREE.Color(HEX.lime)
const OFF_SCREEN = -1e4 // where a pad that isn't in the layout is, on screen

// Pools: the most of each thing on screen at once
const MAX_NOTES = 64
const MAX_SCRATCH = 10
const MAX_CHEVRONS = 96
const MAX_FADES = 8
const MAX_FRAMES = 8
const MAX_WAVES = 16
const MAX_LASERS = 27
const PARTICLES = 700

export class Scene {
  /** Throws if WebGL isn't available: the caller shows a message instead. */
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas
    this.reduced = reduced
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(HEX.bg, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    this.renderer = renderer
    this.maxPixelRatio = 2

    const scene = (this.scene = new THREE.Scene())
    scene.background = new THREE.Color(HEX.bg)
    scene.fog = new THREE.FogExp2(HEX.fog, 0.017)
    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 240)
    this.camZ = 7

    // Scratch objects, so a frame allocates nothing
    this.m = new THREE.Matrix4()
    this.q = new THREE.Quaternion()
    this.v = new THREE.Vector3()
    this.s = new THREE.Vector3()
    this.c = new THREE.Color()
    this.e = new THREE.Euler()

    this.padColor = PADS.map((p) => new THREE.Color(p.color))
    this.pressAt = new Float64Array(PAD_COUNT).fill(-1e9)
    this.pressVel = new Float32Array(PAD_COUNT)
    this.hitAt = new Float64Array(PAD_COUNT).fill(-1e9)
    this.missAt = new Float64Array(PAD_COUNT).fill(-1e9)
    this.songAt = new Float64Array(PAD_COUNT).fill(-1e9)
    this.approach = new Float32Array(PAD_COUNT)
    this.fx = { kick: 0, snare: 0, crash: 0, horn: 0, vox: 0, held: 0, shake: 0, boost: 0 }
    this.wall = 0 // seconds since the scene started, for things that sway on their own
    this.knob = 0.5
    this.keyLabels = true // the crossfader marks name the keys (not on touch or mouse play)
    this.padLayout = LAYOUTS.full // where the pads are (see pads.js)
    this.rig = RIGS.side // where the decks and the fader are (chosen to suit the screen)

    this.buildBackdrop()
    this.buildCrowd()
    this.buildLights()
    this.buildTunnel()
    this.buildPads()
    this.buildNotes()
    this.buildDecks()
    this.buildFader()
    this.buildEffects()
    this.buildComposer()
    this.layout = null
    this.usePads(LAYOUTS.full)
    this.useRig(RIGS.side)
    this.resize()
  }

  /** Where a pad's gate is in the world, in the current layout. */
  padX(i) {
    const slot = this.padLayout.slots[i]
    return slot ? (slot.col - (this.padLayout.cols - 1) / 2) * PITCH : 0
  }

  padY(i) {
    const slot = this.padLayout.slots[i]
    return slot ? (slot.row - 0.5) * PITCH : 0
  }

  /** Lay the pads out (LAYOUTS in pads.js): the gates, the rails and the beat frames to match. */
  usePads(layout) {
    this.padLayout = layout
    this.halfW = (layout.cols / 2) * PITCH
    for (const [cols, rails] of this.padRails) rails.visible = cols === layout.cols
    this.frameRect.geometry = this.frameRects.get(layout.cols)
    // The landing outlines don't move; the gates are placed every frame (drawPads)
    for (let i = 0; i < PAD_COUNT; i++) {
      if (layout.slots[i]) this.m.makeTranslation(this.padX(i), this.padY(i), 0)
      else this.m.makeScale(0, 0, 0)
      this.padTarget.setMatrixAt(i, this.m)
    }
    this.padTarget.instanceMatrix.needsUpdate = true
    if (this.layout) this.fit()
  }

  /** Put the decks, the fader and their lanes where a rig (RIGS) has them. */
  useRig(rig) {
    this.rig = rig
    const { deckX, deckY, faderY } = rig
    this.scratchDeck.group.position.set(-deckX, deckY, 0)
    this.beatDeck.group.position.set(deckX, deckY, 0)
    this.scratchArc.position.set(-deckX, deckY, 0.02)
    this.recordLane.position.set(-deckX, deckY, 0)
    this.faderLane.position.set(0, faderY, 0)
    this.faderGroup.position.set(0, faderY, 0)
  }

  // ---- Building -----------------------------------------------------------------------------

  buildBackdrop() {
    // The far wall: a stage glow on the horizon that brightens with the crowd, the crash and the
    // horns. Drawn without fog: it's the light the haze is lit by.
    this.wallMat = new THREE.ShaderMaterial({
      uniforms: {
        uGlow: { value: 0.2 },
        uFlash: { value: 0 },
        uHorn: { value: 0 },
        uA: { value: new THREE.Color(HEX.magenta) },
        uB: { value: new THREE.Color(HEX.cyan) },
        uHornColor: { value: new THREE.Color(HEX.red) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uGlow, uFlash, uHorn;
        uniform vec3 uA, uB, uHornColor;
        varying vec2 vUv;
        void main() {
          float h = vUv.y - 0.4;
          float x = vUv.x - 0.5;
          float hb = (h + 0.012) / 0.035;
          float band = exp(-hb * hb);
          float sky = exp(-max(h, 0.0) / 0.14) * smoothstep(-0.1, 0.0, h);
          // The middle stays darker: the notes come out of it
          float xs = x / 0.12;
          float side = 1.0 - 0.7 * exp(-xs * xs);
          vec3 col = mix(uA, uB, smoothstep(-0.25, 0.25, x));
          float glow = min(uGlow, 1.4);
          vec3 c = col * (band * (0.12 + 0.36 * glow) * side + sky * 0.1 * (0.4 + glow));
          c += uHornColor * band * side * uHorn * 0.4;
          c += vec3(1.0) * uFlash * (band * 0.16 + sky * 0.05) * side;
          gl_FragColor = vec4(c, 1.0);
        }`,
      fog: false,
      depthWrite: false,
    })
    // 140 tall, with the band (v = 0.4) on the horizon: the camera's height
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(320, 140), this.wallMat)
    wall.position.set(0, 0.1 * 140, -110)
    wall.renderOrder = -10
    this.scene.add(wall)

    // The dance floor: a grid that pulses with the kick, running away under the crowd
    this.floorMat = new THREE.ShaderMaterial({
      uniforms: {
        uPulse: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: new THREE.Color(HEX.violet) },
      },
      vertexShader: `
        varying vec3 vW;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `
        uniform float uPulse, uScroll;
        uniform vec3 uColor;
        varying vec3 vW;
        void main() {
          vec2 g = vec2(vW.x, vW.z + uScroll) / 2.6;
          vec2 f = abs(fract(g) - 0.5) / max(fwidth(g), vec2(1e-4));
          float line = 1.0 - clamp(min(f.x, f.y), 0.0, 1.0);
          float far = exp(-abs(vW.z) * 0.035);
          float a = line * far * (0.1 + 0.4 * uPulse);
          gl_FragColor = vec4(uColor * a, 1.0);
        }`,
      fog: false,
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(220, 130), this.floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, -4.4, -60)
    this.scene.add(floor)
  }

  buildCrowd() {
    // Rows of people below the booth, bouncing on the beat. Their arms go up as the crowd's
    // energy passes each one's threshold. All of it happens in the vertex shader.
    let seed = 20251119
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    const people = []
    for (let z = -13; z > -60; z -= 4 + rand() * 1.5) {
      const half = Math.min(42, (-z + 8) * 0.95)
      const step = 1.05 + (-z / 60) * 0.5
      for (let x = -half + rand() * step; x < half; x += step * (0.8 + rand() * 0.45)) {
        people.push({ x, z: z + (rand() - 0.5) * 1.6, s: 0.85 + rand() * 0.3 })
      }
    }
    const n = people.length
    const geo = new THREE.PlaneGeometry(1, 2)
    geo.translate(0, 1, 0)
    const phase = new Float32Array(n)
    const arms = new Float32Array(n)
    const body = new Float32Array(n)
    const mesh = new THREE.InstancedMesh(
      geo,
      (this.crowdMat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: crowdAtlas() },
          uBeat: { value: 0 },
          uEnergy: { value: 0.2 },
          uBounce: { value: 0.1 },
          uTint: { value: new THREE.Color(HEX.magenta) },
          uHaze: { value: new THREE.Color(0x2a1240) },
        },
        vertexShader: `
          attribute float aPhase, aArms, aBody;
          uniform float uBeat, uEnergy, uBounce;
          varying vec2 vUv;
          varying float vDepth;
          void main() {
            float up = step(aArms, uEnergy);
            vUv = vec2((uv.x + aBody * 2.0 + up) / 4.0, uv.y);
            float s = sin(3.14159 * fract(uBeat + aPhase));
            vec4 w = instanceMatrix * vec4(position, 1.0);
            w.y += s * s * uBounce * instanceMatrix[1][1];
            vec4 mv = modelViewMatrix * w;
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform sampler2D uMap;
          uniform vec3 uTint, uHaze;
          varying vec2 vUv;
          varying float vDepth;
          void main() {
            vec4 t = texture2D(uMap, vUv);
            if (t.a < 0.5) discard;
            vec3 col = vec3(0.01, 0.006, 0.016) + uTint * smoothstep(0.55, 1.0, vUv.y) * 0.12;
            col = mix(col, uHaze, clamp((vDepth - 14.0) / 70.0, 0.0, 1.0) * 0.5);
            gl_FragColor = vec4(col, 1.0);
          }`,
        fog: false,
      })),
      n
    )
    for (let i = 0; i < n; i++) {
      const p = people[i]
      this.m.makeScale(p.s, p.s * (0.92 + rand() * 0.16), p.s)
      this.m.setPosition(p.x, -4.4, p.z)
      mesh.setMatrixAt(i, this.m)
      phase[i] = rand() * 0.3
      arms[i] = 0.15 + rand() * 0.85
      body[i] = rand() < 0.5 ? 0 : 1
    }
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1))
    geo.setAttribute('aArms', new THREE.InstancedBufferAttribute(arms, 1))
    geo.setAttribute('aBody', new THREE.InstancedBufferAttribute(body, 1))
    mesh.frustumCulled = false
    this.scene.add(mesh)
  }

  buildLights() {
    // Moving heads on a truss above the crowd: soft cones of light that sway and pulse
    const geo = new THREE.CylinderGeometry(0.1, 2.8, 20, 28, 1, true)
    geo.translate(0, -10, 0) // the lamp at the origin, the beam reaching down
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        varying float vAlong;
        varying vec3 vN, vV, vC;
        void main() {
          vAlong = -position.y / 20.0;
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
          vV = normalize(cameraPosition - w.xyz);
          vC = instanceColor;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `
        varying float vAlong;
        varying vec3 vN, vV, vC;
        void main() {
          float facing = abs(dot(normalize(vN), normalize(vV)));
          // vAlong comes out a hair over 1 at the beam's far end now and then, and pow() of
          // the negative number that makes is NaN on some GPUs: clamp it
          float along = clamp(vAlong, 0.0, 1.0);
          float a = pow(facing, 2.5) * pow(1.0 - along, 1.8) * smoothstep(0.0, 0.06, along);
          gl_FragColor = vec4(vC * a, 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    })
    const spots = [
      [-5.5, 7, -12, HEX.magenta],
      [5.5, 7, -12, HEX.cyan],
      [-11, 8, -24, HEX.violet],
      [11, 8, -24, HEX.magenta],
      [-3.5, 8.5, -30, HEX.cyan],
      [3.5, 8.5, -30, HEX.violet],
      [-16, 9, -40, HEX.cyan],
      [16, 9, -40, HEX.magenta],
    ]
    this.spots = spots.map(([x, y, z, hex], i) => ({
      x,
      y,
      z,
      color: new THREE.Color(hex),
      phase: i * 1.7,
      lean: x < 0 ? 0.42 : -0.42,
    }))
    this.spotMesh = new THREE.InstancedMesh(geo, mat, spots.length)
    for (let i = 0; i < spots.length; i++) this.spotMesh.setColorAt(i, this.c.setRGB(0, 0, 0))
    this.spotMesh.frustumCulled = false
    this.scene.add(this.spotMesh)

    // Lasers: fans of beams from the stage, fired by the LASER pad and the hype boost
    const lgeo = new THREE.BoxGeometry(0.09, 0.09, 1)
    lgeo.translate(0, 0, 0.5)
    this.laserMesh = new THREE.InstancedMesh(
      lgeo,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
      MAX_LASERS
    )
    for (let i = 0; i < MAX_LASERS; i++) this.laserMesh.setColorAt(i, this.c.setRGB(0, 0, 0))
    this.laserMesh.count = 0
    this.laserMesh.frustumCulled = false
    this.lasers = []
    for (let i = 0; i < MAX_LASERS; i++) {
      this.lasers.push({ life: 0, max: 1, yaw: 0, pitch: 0, spin: 0, color: new THREE.Color() })
    }
    this.nextLaser = 0
    this.scene.add(this.laserMesh)
  }

  buildTunnel() {
    // Rails: lines from the gates down to the far end, with dashes running towards you at the
    // speed of the notes (two to a beat). A set for the pads (one for each layout's width), a
    // ring for the record's lane and two for the crossfader's.
    const lines = (draw) => {
      const pts = []
      const cols = []
      draw((x, y, color, k) => {
        pts.push(x, y, 0.4, x, y, -Z_FAR - 6)
        for (let j = 0; j < 2; j++) cols.push(color.r * k, color.g * k, color.b * k)
      })
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
      geo.setAttribute('aColor', new THREE.Float32BufferAttribute(cols, 3))
      const rails = new THREE.LineSegments(geo, this.railMat)
      rails.frustumCulled = false
      this.scene.add(rails)
      return rails
    }
    this.railMat = new THREE.ShaderMaterial({
      uniforms: { uScroll: { value: 0 }, uDash: { value: 10 }, uPulse: { value: 0 } },
      vertexShader: `
        attribute vec3 aColor;
        varying vec3 vC;
        varying float vZ;
        void main() {
          vC = aColor;
          vZ = position.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uScroll, uDash, uPulse;
        varying vec3 vC;
        varying float vZ;
        void main() {
          float d = fract((vZ - uScroll) / uDash);
          float dash = 0.3 + 0.7 * (1.0 - smoothstep(0.5, 0.62, abs(d - 0.5) * 2.0 + 0.1));
          float far = smoothstep(${glsl(-Z_FAR - 6)}, ${glsl(-Z_FAR * 0.45)}, vZ);
          gl_FragColor = vec4(vC * dash * far * (0.55 + 0.7 * uPulse), 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    const violet = new THREE.Color(HEX.violet)
    this.padRails = new Map()
    for (const { cols } of Object.values(LAYOUTS)) {
      const rails = lines((add) => {
        for (let i = 0; i <= cols; i++) {
          for (let j = -1; j <= 1; j++) {
            const edge = i === 0 || i === cols || j !== 0
            add((i - cols / 2) * PITCH, j * PITCH, violet, edge ? 0.9 : 0.45)
          }
        }
      })
      this.padRails.set(cols, rails)
    }
    // The record's lane and the fader's, built round the origin and moved to wherever the rig
    // puts the record and the fader (useRig)
    this.recordLane = lines((add) => {
      const magenta = new THREE.Color(HEX.magenta)
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * TAU
        add(Math.cos(a) * (DECK_R + 0.12), Math.sin(a) * (DECK_R + 0.12), magenta, 0.5)
      }
    })
    this.faderLane = lines((add) => {
      const white = new THREE.Color(HEX.white)
      add(-FADER_HALF - 0.18, 0, white, 0.35)
      add(FADER_HALF + 0.18, 0, white, 0.35)
    })

    // Beat frames: an outline round the pads (and a ring round the record) for every beat,
    // coming down the tunnel like the notes. The bar's first beat is brighter. The outline is as
    // wide as the layout's grid.
    this.frameRects = new Map()
    for (const { cols } of Object.values(LAYOUTS)) {
      this.frameRects.set(cols, frameGeometry(cols * PITCH + 0.12, HALF_H * 2 + 0.12, 0.16, 0.035))
    }
    this.frameRect = new THREE.InstancedMesh(this.frameRects.get(4), additive(), MAX_FRAMES)
    this.frameRing = new THREE.InstancedMesh(
      new THREE.RingGeometry(DECK_R + 0.1, DECK_R + 0.14, 64),
      additive(),
      MAX_FRAMES
    )
    for (const mesh of [this.frameRect, this.frameRing]) {
      for (let i = 0; i < MAX_FRAMES; i++) mesh.setColorAt(i, this.c.setRGB(0, 0, 0))
      mesh.count = 0
      mesh.frustumCulled = false
      this.scene.add(mesh)
    }
  }

  buildPads() {
    // The gates: a frame and a fill for each pad, lit by your hits, the song's own hits on that
    // pad, and a note about to land
    this.padFrame = new THREE.InstancedMesh(
      frameGeometry(PAD, PAD, 0.12, 0.05),
      additive(),
      PAD_COUNT
    )
    this.padFill = new THREE.InstancedMesh(
      roundedPlane(PAD - 0.06, PAD - 0.06, 0.09),
      additive(),
      PAD_COUNT
    )
    // A faint outline where the note lands
    this.padTarget = new THREE.InstancedMesh(
      frameGeometry(NOTE, NOTE, 0.08, 0.018),
      additive(),
      PAD_COUNT
    )
    for (const mesh of [this.padFrame, this.padFill, this.padTarget]) {
      for (let i = 0; i < PAD_COUNT; i++) {
        this.m.makeTranslation(this.padX(i), this.padY(i), 0)
        mesh.setMatrixAt(i, this.m)
        mesh.setColorAt(i, this.padColor[i])
      }
      mesh.frustumCulled = false
      this.scene.add(mesh)
    }
  }

  buildNotes() {
    // Pad notes: glowing tiles in their pad's colour
    this.noteMesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(NOTE * PAD, NOTE * PAD),
      new THREE.MeshBasicMaterial({ map: tileTexture(), alphaTest: 0.5, fog: true }),
      MAX_NOTES
    )
    // Scratch notes: a run of chevrons pointing the way to move the record (up is forward,
    // magenta; down is backward, cyan) inside a faint tube as long as the note
    this.chevMesh = new THREE.InstancedMesh(chevronGeometry(), solid(), MAX_CHEVRONS)
    const tube = new THREE.CylinderGeometry(DECK_R * 0.86, DECK_R * 0.86, 1, 40, 1, true)
    tube.rotateX(Math.PI / 2)
    tube.translate(0, 0, -0.5) // from z = 0 back to z = -1, scaled to the note's length
    this.tubeMesh = new THREE.InstancedMesh(tube, additive(THREE.DoubleSide), MAX_SCRATCH)
    // Crossfader notes: a bar across the fader's lane with a marker over the notch to land in
    this.fadeBar = new THREE.InstancedMesh(
      new THREE.BoxGeometry(FADER_HALF * 2 + 0.36, 0.04, 0.04),
      solid(),
      MAX_FADES
    )
    const markers = markerAtlas(this.keyLabels)
    this.fadeMarks = [0, 1, 2].map((k) => {
      const geo = new THREE.PlaneGeometry(0.62, 0.3)
      const uv = geo.attributes.uv
      for (let i = 0; i < uv.count; i++) uv.setX(i, (uv.getX(i) + k) / 3)
      return new THREE.InstancedMesh(
        geo,
        new THREE.MeshBasicMaterial({ map: markers, alphaTest: 0.5, fog: true }),
        MAX_FADES
      )
    })
    for (const mesh of [
      this.noteMesh,
      this.chevMesh,
      this.tubeMesh,
      this.fadeBar,
      ...this.fadeMarks,
    ]) {
      for (let i = 0; i < mesh.instanceMatrix.count; i++) mesh.setColorAt(i, this.c.setRGB(1, 1, 1))
      mesh.count = 0
      mesh.frustumCulled = false
      this.scene.add(mesh)
    }
  }

  buildDecks() {
    // Two turntables standing up to face you: the Scratch Deck on the left (its record turns
    // exactly as far as the playhead really moves) and the Beat Deck on the right
    const side = new THREE.MeshBasicMaterial({ color: 0x0b0810 })
    const make = (x, hex, word) => {
      const group = new THREE.Group()
      group.position.set(x, 0, 0)
      const spin = new THREE.Group()
      const face = new THREE.MeshBasicMaterial({ map: recordTexture(hex, word) })
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(DECK_R, DECK_R, 0.06, 72, 1), [
        side,
        face,
        side,
      ])
      disc.rotation.x = Math.PI / 2
      disc.position.z = -0.04
      spin.add(disc)
      group.add(spin)
      const rim = new THREE.Mesh(new THREE.TorusGeometry(DECK_R + 0.05, 0.022, 8, 96), additive())
      rim.material.color.set(hex)
      group.add(rim)
      const plate = new THREE.Mesh(roundedPlane(DECK_R * 2 + 0.5, DECK_R * 2 + 0.5, 0.18), panel())
      plate.position.z = -0.12
      group.add(plate)
      this.scene.add(group)
      return { group, spin, rim, face, hex, word, color: new THREE.Color(hex) }
    }
    this.scratchDeck = make(-RIGS.side.deckX, HEX.magenta, 'SCRATCH')
    this.beatDeck = make(RIGS.side.deckX, HEX.cyan, 'BEAT')
    // The progress of the scratch you're in: an arc round the record that fills as you get it
    this.arcMat = new THREE.ShaderMaterial({
      uniforms: { uAmount: { value: 0 }, uColor: { value: new THREE.Color(HEX.lime) } },
      vertexShader: `
        varying vec2 vP;
        void main() {
          vP = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uAmount;
        uniform vec3 uColor;
        varying vec2 vP;
        void main() {
          float a = atan(vP.x, vP.y);
          if (a < 0.0) a += 6.2831853;
          if (a > uAmount * 6.2831853) discard;
          gl_FragColor = vec4(uColor * 1.4, 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    })
    this.scratchArc = new THREE.Mesh(
      new THREE.RingGeometry(DECK_R + 0.16, DECK_R + 0.24, 96),
      this.arcMat
    )
    this.scratchArc.position.set(-RIGS.side.deckX, 0, 0.02)
    this.scratchArc.visible = false
    this.scene.add(this.scratchArc)
  }

  buildFader() {
    const group = new THREE.Group()
    group.position.set(0, RIGS.side.faderY, 0)
    this.faderGroup = group
    const plate = new THREE.Mesh(roundedPlane(FADER_HALF * 2 + 0.75, 0.5, 0.12), panel())
    plate.position.z = -0.08
    group.add(plate)
    const slot = new THREE.Mesh(new THREE.PlaneGeometry(FADER_HALF * 2, 0.05), solid())
    slot.material.color.setRGB(0.18, 0.14, 0.26)
    group.add(slot)
    for (const x of [-FADER_HALF, 0, FADER_HALF]) {
      const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.18), solid())
      tick.material.color.setRGB(0.5, 0.45, 0.65)
      tick.position.set(x, 0.17, 0)
      group.add(tick)
    }
    this.knobMesh = new THREE.Mesh(roundedPlane(0.2, 0.38, 0.05), solid())
    this.knobMesh.position.z = 0.03
    group.add(this.knobMesh)
    this.scene.add(group)
  }

  buildEffects() {
    // Sparks: one pool of points, recycled
    const geo = new THREE.BufferGeometry()
    this.pPos = new Float32Array(PARTICLES * 3)
    this.pCol = new Float32Array(PARTICLES * 3)
    this.pVel = new Float32Array(PARTICLES * 3)
    this.pBase = new Float32Array(PARTICLES * 3)
    this.pLife = new Float32Array(PARTICLES)
    this.pMax = new Float32Array(PARTICLES).fill(1)
    this.pNext = 0
    geo.setAttribute('position', new THREE.BufferAttribute(this.pPos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(this.pCol, 3))
    this.pGeo = geo
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.11,
        map: dotTexture(),
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      })
    )
    points.frustumCulled = false
    this.scene.add(points)

    // Shock waves: a square one that grows out of a pad on a hit, a round one off the record
    this.waveSquare = new THREE.InstancedMesh(
      frameGeometry(PAD, PAD, 0.12, 0.04),
      additive(),
      MAX_WAVES
    )
    this.waveRound = new THREE.InstancedMesh(
      new THREE.RingGeometry(DECK_R, DECK_R + 0.05, 64),
      additive(),
      6
    )
    this.waves = []
    for (const [mesh, round] of [
      [this.waveSquare, false],
      [this.waveRound, true],
    ]) {
      for (let i = 0; i < mesh.instanceMatrix.count; i++) {
        mesh.setColorAt(i, this.c.setRGB(0, 0, 0))
        this.waves.push({ mesh, index: i, round, life: 0, x: 0, y: 0, color: new THREE.Color() })
      }
      mesh.frustumCulled = false
      this.scene.add(mesh)
    }
  }

  buildComposer() {
    // The club renders into a HalfFloat target, so the neon can go brighter than white for the
    // glow and the dark gradients don't band. (A multisampled HalfFloat target renders black in
    // Chrome, so the edges are smoothed by FXAA instead, on screens with big pixels.)
    const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType })
    this.composer = new THREE.EffectComposer(this.renderer, target)
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera))
    this.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(4, 4), 0.55, 0.35, 0.72)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new THREE.OutputPass())
    this.fxaa = new THREE.FXAAPass()
    this.composer.addPass(this.fxaa)
  }

  get bloomOn() {
    return this.bloom.enabled
  }

  // ---- Size and where things are on screen --------------------------------------------------

  resize() {
    const w = Math.max(280, window.innerWidth)
    const h = Math.max(240, window.innerHeight)
    const pr = Math.min(window.devicePixelRatio || 1, this.maxPixelRatio)
    this.renderer.setPixelRatio(pr)
    this.renderer.setSize(w, h)
    this.composer.setPixelRatio(pr)
    this.composer.setSize(w, h)
    this.fxaa.enabled = pr < 1.5
    this.w = w
    this.h = h
    this.fit()
  }

  /**
   * How big the rig can be on this screen (in CSS pixels per world unit at the gates), and the
   * range of heights the middle of the grid can be at for it all to fit with the HUD round it.
   * Everything at the gates faces the camera, so on screen it's the world scaled and moved.
   */
  scaleFor(rig) {
    const { w, h } = this
    const [share, least, most] = HUD_TOP[rig.name]
    const top = Math.min(most, Math.max(least, h * share))
    const above = HALF_H + 0.14 // the grid's beat frames
    // What's under the grid's middle: the fader's marks, and the deck labels and loops
    const below = [
      [rig.faderY - 0.375, HUD_FADER],
      [rig.deckY - DECK_R * 1.32, HUD_DECK[rig.name]],
    ]
    const halfX = Math.max(this.halfW + 0.14, rig.deckX + PLATE) + 0.1
    let k = (w - EDGE * 2) / (halfX * 2)
    for (const [y, px] of below) k = Math.min(k, (h - top - BOTTOM - px) / (above - y))
    if (rig === RIGS.side) {
      const roomy = Math.min(w / (ROOMY.halfW * 2), h / (ROOMY.halfH * 2))
      k = Math.min(k, Math.max(roomy, ROOMY.pad))
    }
    k = Math.max(1, k)
    let hi = h
    for (const [y, px] of below) hi = Math.min(hi, h - BOTTOM - px + k * y)
    return { k, lo: top + k * above, hi }
  }

  /**
   * Fit the club to the screen: pick the rig that makes the pads biggest (side by side unless
   * stacking is clearly better), then set the camera so the rig fills the space the HUD leaves.
   * The camera always looks straight down the tunnel at the middle of the grid, so the lanes
   * still meet there and the two rows never cover each other. Where that middle lands on screen
   * is a shift of the lens: the middle of the screen when there's room, or as near as it fits.
   */
  fit() {
    const side = this.scaleFor(RIGS.side)
    const stacked = this.scaleFor(RIGS.stacked)
    const rig = stacked.k > side.k * 1.12 ? RIGS.stacked : RIGS.side
    if (rig !== this.rig) this.useRig(rig)
    const { k, lo, hi } = rig === RIGS.stacked ? stacked : side
    const { w, h } = this
    const middle = Math.min(Math.max(h / 2, lo), Math.max(lo, hi))
    const cam = this.camera
    cam.aspect = w / h
    const tan = Math.tan(((FOV / 2) * Math.PI) / 180)
    this.camZ = h / (2 * k * tan)
    cam.position.set(0, 0, this.camZ)
    cam.setViewOffset(w, h, 0, h / 2 - middle, w, h)
    cam.updateProjectionMatrix()
    cam.updateMatrixWorld()
    this.layout = this.measure()
  }

  /** A point in the world on screen, in CSS pixels. */
  project(x, y, z) {
    const v = this.v.set(x, y, z).project(this.camera)
    return { x: ((v.x + 1) / 2) * this.w, y: ((1 - v.y) / 2) * this.h }
  }

  /**
   * Where the gates, decks and fader are on screen: for the HUD, and for taps and clicks. A pad
   * that isn't in the layout is `hidden`, off the screen, with nowhere to click.
   */
  measure() {
    const pads = []
    const { cols, slots } = this.padLayout
    for (let i = 0; i < PAD_COUNT; i++) {
      const x = this.padX(i)
      const y = this.padY(i)
      const c = this.project(x, y, 0)
      const e = this.project(x + PAD / 2, y, 0)
      const half = e.x - c.x
      const slot = slots[i]
      if (!slot) {
        const off = { x0: OFF_SCREEN, y0: OFF_SCREEN, x1: OFF_SCREEN, y1: OFF_SCREEN }
        pads.push({ x: OFF_SCREEN, y: OFF_SCREEN, half, hit: off, hidden: true })
        continue
      }
      // The square a click or a tap has to land in (the grid faces the camera, so it stays one)
      const top = slot.row === 1
      const a = this.project(
        x - PAD / 2 - (slot.col > 0 ? REACH_IN : this.rig.reachOut),
        y + PAD / 2 + (top ? REACH_ABOVE : REACH_IN),
        0
      )
      const b = this.project(
        x + PAD / 2 + (slot.col < cols - 1 ? REACH_IN : this.rig.reachOut),
        y - PAD / 2 - (top ? REACH_IN : REACH_BELOW),
        0
      )
      pads.push({ x: c.x, y: c.y, half, hit: { x0: a.x, y0: a.y, x1: b.x, y1: b.y } })
    }
    const tl = this.project(-this.halfW, HALF_H, 0)
    const br = this.project(this.halfW, -HALF_H, 0)
    const { deckX, deckY, faderY } = this.rig
    const deck = (x) => {
      const c = this.project(x, deckY, 0)
      const e = this.project(x + DECK_R, deckY, 0)
      return { x: c.x, y: c.y, r: e.x - c.x }
    }
    const f0 = this.project(-FADER_HALF, faderY, 0)
    const f1 = this.project(FADER_HALF, faderY, 0)
    const fTop = this.project(0, faderY + 0.25, 0)
    return {
      w: this.w,
      h: this.h,
      pads,
      grid: { left: tl.x, top: tl.y, right: br.x, bottom: br.y },
      decks: [deck(-deckX), deck(deckX)],
      stacked: this.rig === RIGS.stacked,
      fader: { x0: f0.x, x1: f1.x, y: f0.y, half: f0.y - fTop.y },
      vp: this.project(0, 0, -1e4),
    }
  }

  /** What's under a finger or the cursor at (x, y) CSS pixels. */
  hitTest(x, y) {
    const L = this.layout
    for (let i = 0; i < PAD_COUNT; i++) {
      const h = L.pads[i].hit
      if (x >= h.x0 && x < h.x1 && y >= h.y0 && y < h.y1) return { kind: 'pad', index: i }
    }
    const d = L.decks[0]
    if (Math.hypot(x - d.x, y - d.y) <= d.r * this.rig.recordReach) return { kind: 'record' }
    const f = L.fader
    if (y > f.y - f.half * 2.2 && y < f.y + f.half * 2.2 && x > f.x0 - 40 && x < f.x1 + 40) {
      return { kind: 'fader', x: Math.max(0, Math.min(1, (x - f.x0) / (f.x1 - f.x0))) }
    }
    return null
  }

  /** How far along the crossfader (0..1) a screen x is, for sliding it with a finger. */
  faderAt(x) {
    const f = this.layout.fader
    return Math.max(0, Math.min(1, (x - f.x0) / (f.x1 - f.x0)))
  }

  /** Render at a lower resolution (and without the glow, at the last step) if frames are slow. */
  lowerQuality() {
    if (this.maxPixelRatio > 1) {
      this.maxPixelRatio = Math.max(1, Math.min(this.maxPixelRatio, window.devicePixelRatio) * 0.7)
      this.resize()
      return true
    }
    if (this.bloom.enabled) {
      this.bloom.enabled = false
      return true
    }
    return false
  }

  // ---- Moments ------------------------------------------------------------------------------

  /** Draw the records' labels and the fader marks again, once the display font has loaded. */
  redrawText() {
    for (const deck of [this.scratchDeck, this.beatDeck]) {
      const old = deck.face.map
      deck.face.map = recordTexture(deck.hex, deck.word)
      old.dispose()
    }
    this.redrawMarks()
  }

  redrawMarks() {
    const old = this.fadeMarks[0].material.map
    const markers = markerAtlas(this.keyLabels)
    for (const mesh of this.fadeMarks) mesh.material.map = markers
    old.dispose()
  }

  /**
   * 'keys', 'mouse', 'hybrid' or 'touch': the crossfader marks name the keys only when there
   * are keys, and Hybrid has its six pads.
   */
  setControls(controls) {
    const keys = controls === 'keys'
    if (keys !== this.keyLabels) {
      this.keyLabels = keys
      this.redrawMarks()
    }
    const pads = layoutFor(controls)
    if (pads !== this.padLayout) this.usePads(pads)
  }

  /** You hit a pad (vel 0..1). */
  press(index, vel = 0.85) {
    const now = performance.now()
    this.pressAt[index] = now
    this.pressVel[index] = vel
    this.padMoment(PADS[index].id, 0.6 + 0.4 * vel)
    if (PADS[index].id === 'laser') this.fireLasers(vel, false)
  }

  /** The song played one of its own pad hits. */
  songHit(index) {
    this.songAt[index] = performance.now()
    this.padMoment(PADS[index].id, 0.55)
  }

  padMoment(id, k) {
    const fx = this.fx
    if (id === 'kick') fx.kick = Math.max(fx.kick, k)
    else if (id === 'snare' || id === 'clap') fx.snare = Math.max(fx.snare, k)
    else if (id === 'crash') fx.crash = Math.max(fx.crash, k)
    else if (id === 'horn') fx.horn = Math.max(fx.horn, k)
    else if (id === 'vox') fx.vox = Math.max(fx.vox, k)
  }

  /** Something the game reported: a judgement, the boost. */
  event(e) {
    const now = performance.now()
    if (e.kind === 'judge') {
      const n = e.note
      if (e.grade === 'miss') {
        if (n.type === 'pad') this.missAt[n.pad] = now
        if (!this.reduced) this.fx.shake = Math.min(1, this.fx.shake + 0.22)
        return
      }
      const count = e.grade === 'perfect' ? 22 : e.grade === 'great' ? 14 : 8
      if (n.type === 'pad') {
        this.hitAt[n.pad] = now
        this.burst(this.padX(n.pad), this.padY(n.pad), 0.05, this.padColor[n.pad], count, 0.5)
        this.wave(this.padX(n.pad), this.padY(n.pad), this.padColor[n.pad], false)
      } else if (n.type === 'scratch') {
        const col = this.c.set(n.dir > 0 ? HEX.magenta : HEX.cyan)
        const { deckX, deckY } = this.rig
        this.burst(-deckX, deckY, 0.1, col, count + 6, DECK_R)
        this.wave(-deckX, deckY, col, true)
      } else if (n.type === 'fade') {
        this.burst(FADE_X[n.pos], this.rig.faderY, 0.1, this.c.set(HEX.white), count, 0.2)
      }
    } else if (e.kind === 'boost') {
      if (!this.reduced) this.fx.shake = 1
      this.fx.boost = 1
      this.fireLasers(1, true)
      this.burst(0, 0, 0.1, this.c.set(HEX.lime), 60, 1.6)
    }
  }

  burst(x, y, z, color, count, spread) {
    if (this.reduced) count = Math.ceil(count / 4)
    for (let k = 0; k < count; k++) {
      const i = this.pNext
      this.pNext = (this.pNext + 1) % PARTICLES
      const a = Math.random() * TAU
      const s = 1.5 + Math.random() * 4.5
      this.pPos[i * 3] = x + Math.cos(a) * spread * Math.random()
      this.pPos[i * 3 + 1] = y + Math.sin(a) * spread * Math.random()
      this.pPos[i * 3 + 2] = z
      this.pVel[i * 3] = Math.cos(a) * s
      this.pVel[i * 3 + 1] = Math.sin(a) * s + 1.5
      this.pVel[i * 3 + 2] = 1 + Math.random() * 4
      this.pLife[i] = this.pMax[i] = 0.35 + Math.random() * 0.45
      this.pBase[i * 3] = color.r * 2
      this.pBase[i * 3 + 1] = color.g * 2
      this.pBase[i * 3 + 2] = color.b * 2
    }
  }

  wave(x, y, color, round) {
    const list = this.waves
    for (let i = 0; i < list.length; i++) {
      const w = list[i]
      if (w.round !== round || w.life > 0) continue
      w.life = 1
      w.x = x
      w.y = y
      w.color.copy(color)
      return
    }
  }

  fireLasers(power, wide) {
    const n = wide ? 9 : 5
    const green = this.padColor[PAD_INDEX.laser]
    const lime = LIME
    for (let k = 0; k < n; k++) {
      const l = this.lasers[this.nextLaser]
      this.nextLaser = (this.nextLaser + 1) % MAX_LASERS
      const u = n === 1 ? 0 : k / (n - 1) - 0.5
      l.life = l.max = this.reduced ? 0.35 : 0.75
      l.yaw = u * (wide ? 2.1 : 1.3) + (Math.random() - 0.5) * 0.08
      l.pitch = 0.1 + Math.random() * 0.22
      l.spin = (Math.random() - 0.5) * (this.reduced ? 0 : 0.9)
      l.color.copy(wide && k % 2 ? lime : green).multiplyScalar(1.2 + power)
    }
  }

  // ---- The frame ----------------------------------------------------------------------------

  /**
   * v: { mode, t (song seconds), dt, energy 0..1, game, deckAngle, deckSpeed, deckHeld,
   *      beatAngle, crossfader 0..1 }
   */
  draw(v) {
    const dt = Math.min(0.05, v.dt || 0.016)
    const t = v.t
    const now = performance.now()
    this.wall += dt
    const beatPhase = (((t / BEAT) % 1) + 1) % 1
    const pulse = this.reduced ? 0 : Math.pow(1 - beatPhase, 3)
    const fx = this.fx
    const decay = (x, rate) => Math.max(0, x - dt * rate)
    fx.kick = decay(fx.kick, 5)
    fx.snare = decay(fx.snare, 5)
    fx.crash = decay(fx.crash, 2.2)
    fx.horn = decay(fx.horn, 2.5)
    fx.vox = decay(fx.vox, 2.5)
    fx.shake = decay(fx.shake, 3)
    fx.boost = decay(fx.boost, 1)
    const game = v.game
    const boosting = !!game && game.boosting

    this.drawNotes(v, t)
    this.drawPads(v, now, pulse, boosting)
    this.drawTunnel(t, pulse, beatPhase, boosting, v.mode)
    this.drawDecks(v, t, dt, pulse)
    this.drawFader(v, dt)
    this.drawClub(v, t, dt, beatPhase, pulse, boosting)
    this.drawEffects(dt)

    const cam = this.camera
    if (fx.shake > 0 && !this.reduced) {
      cam.position.set(
        (Math.random() - 0.5) * fx.shake * 0.08,
        (Math.random() - 0.5) * fx.shake * 0.08,
        this.camZ
      )
    } else {
      cam.position.set(0, 0, this.camZ)
    }
    this.composer.render(dt)
  }

  drawNotes(v, t) {
    const game = v.game
    const m = this.m
    const c = this.c
    let notes = 0
    let chev = 0
    let tubes = 0
    let fades = 0
    const marks = [0, 0, 0]
    this.approach.fill(0)
    let live = null
    const { deckX, deckY, faderY } = this.rig
    if (game) {
      const list = game.notes
      for (let i = Math.max(0, game.next - 16); i < list.length; i++) {
        const n = list[i]
        if (n.time > t + LOOKAHEAD) break
        const ahead = n.time - t
        if (n.type === 'pad') {
          if (n.judged && n.grade !== 'miss') continue
          const z = -ahead * SPEED
          if (z > 1.4) continue
          if (!n.judged && ahead < 0.4) {
            this.approach[n.pad] = Math.max(this.approach[n.pad], 1 - Math.max(0, ahead) / 0.4)
          }
          if (notes >= MAX_NOTES) continue
          m.makeTranslation(this.padX(n.pad), this.padY(n.pad), z)
          this.noteMesh.setMatrixAt(notes, m)
          if (n.judged) c.setRGB(0.35, 0.03, 0.06)
          else c.copy(this.padColor[n.pad]).multiplyScalar(1.6)
          this.noteMesh.setColorAt(notes++, c)
        } else if (n.type === 'scratch') {
          const zEnd = -(n.end - t) * SPEED
          if (zEnd > 0.2) continue
          const zStart = Math.min(0, -ahead * SPEED)
          if (!n.judged && t >= n.time - 0.02 && t <= n.end) live = n
          const missed = n.judged && n.grade === 'miss'
          const color = c.set(n.dir > 0 ? HEX.magenta : HEX.cyan)
          if (tubes < MAX_SCRATCH && zStart > zEnd) {
            m.makeScale(1, 1, zStart - zEnd)
            m.setPosition(-deckX, deckY, zStart)
            this.tubeMesh.setMatrixAt(tubes, m)
            this.tubeMesh.setColorAt(tubes++, color.multiplyScalar(missed ? 0.05 : 0.16))
          }
          // Chevrons every 0.16 s through the note, each one going into the record as its moment
          // passes
          const span = n.end - n.time
          const count = Math.max(2, Math.round(span / 0.16))
          color.set(n.dir > 0 ? HEX.magenta : HEX.cyan).multiplyScalar(missed ? 0.25 : 1.5)
          for (let k = 0; k < count && chev < MAX_CHEVRONS; k++) {
            const at = n.time + ((k + 0.5) / count) * span
            const z = -(at - t) * SPEED
            if (z > 0.05 || z < -Z_FAR) continue
            m.makeScale(1, n.dir, 1)
            m.setPosition(-deckX, deckY, z)
            this.chevMesh.setMatrixAt(chev, m)
            this.chevMesh.setColorAt(chev++, color)
          }
        } else if (n.type === 'fade') {
          if (n.judged && n.grade !== 'miss') continue
          const z = -ahead * SPEED
          if (z > 1 || fades >= MAX_FADES) continue
          m.makeTranslation(0, faderY, z)
          this.fadeBar.setMatrixAt(fades, m)
          this.fadeBar.setColorAt(
            fades++,
            n.judged ? c.setRGB(0.3, 0.03, 0.05) : c.setRGB(1.3, 1.25, 1.4)
          )
          const k = FADE_FRAME[n.pos]
          const mesh = this.fadeMarks[k]
          m.makeTranslation(FADE_X[n.pos], faderY + 0.27, z)
          mesh.setMatrixAt(marks[k], m)
          mesh.setColorAt(
            marks[k]++,
            n.judged ? c.setRGB(0.4, 0.05, 0.08) : c.setRGB(1.2, 1.2, 1.2)
          )
        }
      }
    }
    this.commit(this.noteMesh, notes)
    this.commit(this.chevMesh, chev)
    this.commit(this.tubeMesh, tubes)
    this.commit(this.fadeBar, fades)
    for (let k = 0; k < 3; k++) this.commit(this.fadeMarks[k], marks[k])

    // The arc round the record: how much of the scratch you're in you've got so far
    if (live) {
      const span = Math.max(0.05, live.end - live.time - 0.075)
      this.arcMat.uniforms.uAmount.value = Math.min(1, live.good / span)
    }
    this.scratchArc.visible = !!live
    this.liveScratch = live
  }

  commit(mesh, count) {
    mesh.count = count
    if (count) {
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }

  drawPads(v, now, pulse, boosting) {
    const m = this.m
    const c = this.c
    const playing = v.mode === 'play' || v.mode === 'sandbox'
    const slots = this.padLayout.slots
    for (let i = 0; i < PAD_COUNT; i++) {
      if (!slots[i]) {
        // Not in this layout: shrunk to nothing
        m.makeScale(0, 0, 0)
        this.padFrame.setMatrixAt(i, m)
        this.padFill.setMatrixAt(i, m)
        continue
      }
      const press = Math.max(0, 1 - (now - this.pressAt[i]) / 170)
      const hit = Math.max(0, 1 - (now - this.hitAt[i]) / 260)
      const miss = Math.max(0, 1 - (now - this.missAt[i]) / 300)
      const song = Math.max(0, 1 - (now - this.songAt[i]) / 150)
      const near = this.approach[i]
      const vel = 0.5 + 0.5 * this.pressVel[i]
      const sc = 1 - 0.06 * press * vel + 0.04 * hit
      m.makeScale(sc, sc, 1)
      m.setPosition(this.padX(i), this.padY(i), 0)
      this.padFrame.setMatrixAt(i, m)
      this.padFill.setMatrixAt(i, m)
      const base = playing ? 0.5 : 0.3
      const frame = base + 0.9 * near + 1.4 * press * vel + 0.9 * hit + 0.25 * song + 0.15 * pulse
      c.copy(this.padColor[i]).multiplyScalar(frame)
      if (miss > 0) c.lerp(MISS_RED, miss * 0.8)
      if (boosting) c.lerp(BOOST_TINT, 0.15)
      this.padFrame.setColorAt(i, c)
      const fill = 0.03 + 0.55 * press * vel + 0.35 * hit + 0.22 * song + 0.05 * near
      this.padFill.setColorAt(i, c.copy(this.padColor[i]).multiplyScalar(fill))
      this.padTarget.setColorAt(i, c.copy(this.padColor[i]).multiplyScalar(0.12 + 0.5 * near))
    }
    this.padFrame.instanceMatrix.needsUpdate = true
    this.padFill.instanceMatrix.needsUpdate = true
    this.padFrame.instanceColor.needsUpdate = true
    this.padFill.instanceColor.needsUpdate = true
    this.padTarget.instanceColor.needsUpdate = true
  }

  drawTunnel(t, pulse, beatPhase, boosting, mode) {
    const dash = (SPEED * BEAT) / 2
    this.railMat.uniforms.uDash.value = dash
    this.railMat.uniforms.uScroll.value = (((t * SPEED) % dash) + dash) % dash
    this.railMat.uniforms.uPulse.value = Math.min(
      1,
      this.fx.kick * 0.8 + pulse * 0.3 + (boosting ? 0.5 : 0)
    )

    // A frame for each beat between here and the far end
    const m = this.m
    const c = this.c
    let k = 0
    const b0 = Math.ceil((t - 0.05) / BEAT)
    const b1 = Math.floor((t + LOOKAHEAD) / BEAT)
    for (let b = b0; b <= b1 && k < MAX_FRAMES; b++) {
      const ahead = b * BEAT - t
      const z = -ahead * SPEED
      const far = Math.min(1, (Z_FAR + z) / (Z_FAR * 0.5))
      const near = Math.min(1, Math.max(0, -z / 3))
      const bar = ((b % 4) + 4) % 4 === 0
      let level = (bar ? 0.55 : 0.2) * far * (0.25 + 0.75 * near)
      if (mode === 'menu') level *= 0.6
      m.makeTranslation(0, 0, z)
      this.frameRect.setMatrixAt(k, m)
      c.set(boosting ? HEX.lime : HEX.violet).multiplyScalar(level * (1 + this.fx.snare * 0.8))
      this.frameRect.setColorAt(k, c)
      m.makeTranslation(-this.rig.deckX, this.rig.deckY, z)
      this.frameRing.setMatrixAt(k, m)
      c.set(HEX.magenta).multiplyScalar(level * 0.8)
      this.frameRing.setColorAt(k++, c)
    }
    this.commit(this.frameRect, k)
    this.commit(this.frameRing, k)
  }

  drawDecks(v, t, dt, pulse) {
    const fx = this.fx
    this.scratchDeck.spin.rotation.z = -v.deckAngle
    this.beatDeck.spin.rotation.z = -v.beatAngle
    fx.held += ((v.deckHeld ? 1 : 0) - fx.held) * Math.min(1, dt * 18)
    const live = this.liveScratch
    const sr = this.scratchDeck.rim.material.color
    if (live) sr.set(live.dir > 0 ? HEX.magenta : HEX.cyan).multiplyScalar(1.2 + 0.6 * pulse)
    else sr.set(HEX.magenta).multiplyScalar(0.35 + 1.1 * fx.held + 0.9 * fx.vox)
    if (fx.vox > 0) sr.lerp(this.c.set(PADS[PAD_INDEX.vox].color).multiplyScalar(1.6), fx.vox * 0.6)
    this.beatDeck.rim.material.color
      .set(HEX.cyan)
      .multiplyScalar(0.35 + 0.9 * fx.kick + 0.2 * pulse)
  }

  drawFader(v, dt) {
    this.knob += (v.crossfader - this.knob) * Math.min(1, dt * 30)
    this.knobMesh.position.x = (this.knob * 2 - 1) * FADER_HALF
    const col = this.knobMesh.material.color
    if (this.knob < 0.25) col.set(HEX.magenta)
    else if (this.knob > 0.75) col.set(HEX.cyan)
    else col.set(HEX.white).multiplyScalar(0.7)
  }

  drawClub(v, t, dt, beatPhase, pulse, boosting) {
    const fx = this.fx
    const energy = v.energy
    const reduced = this.reduced
    const crowd = this.crowdMat.uniforms
    crowd.uBeat.value = t / BEAT
    crowd.uEnergy.value = energy
    crowd.uBounce.value = reduced ? 0.02 : 0.05 + 0.3 * energy
    crowd.uTint.value.set(boosting ? HEX.lime : HEX.magenta)

    const wall = this.wallMat.uniforms
    wall.uGlow.value = 0.15 + 0.7 * energy + 0.35 * pulse * energy + (boosting ? 0.4 : 0)
    wall.uFlash.value = reduced ? fx.crash * 0.3 : fx.crash * 0.9
    wall.uHorn.value = fx.horn
    this.floorMat.uniforms.uPulse.value = Math.min(1, 0.15 + fx.kick * 0.9 + energy * 0.2)
    this.floorMat.uniforms.uScroll.value = 0

    // Moving heads
    const m = this.m
    const c = this.c
    const strength = 0.06 + 0.5 * energy + (boosting ? 0.35 : 0)
    for (let i = 0; i < this.spots.length; i++) {
      const s = this.spots[i]
      const sway = reduced ? 0 : Math.sin(this.wall * (0.45 + i * 0.06) + s.phase) * 0.38
      this.e.set(
        0.25 + (reduced ? 0 : Math.sin(this.wall * 0.3 + s.phase) * 0.15),
        0,
        s.lean + sway
      )
      this.q.setFromEuler(this.e)
      m.compose(this.v.set(s.x, s.y, s.z), this.q, this.s.set(1, 1, 1))
      this.spotMesh.setMatrixAt(i, m)
      const k = strength * (0.6 + 0.4 * pulse) * (i % 2 ? 0.85 : 1) + fx.crash * 0.25
      if (boosting && i % 3 === 0) c.set(HEX.lime)
      else c.copy(s.color)
      this.spotMesh.setColorAt(i, c.multiplyScalar(k * 0.5))
    }
    this.spotMesh.instanceMatrix.needsUpdate = true
    this.spotMesh.instanceColor.needsUpdate = true

    // Lasers sweep a little while they fade
    if (boosting && !reduced && Math.random() < dt * 1.5) this.fireLasers(0.6, true)
    let n = 0
    for (let i = 0; i < MAX_LASERS; i++) {
      const l = this.lasers[i]
      if (l.life <= 0) continue
      l.life -= dt
      l.yaw += l.spin * dt
      const k = Math.max(0, l.life / l.max)
      this.e.set(-l.pitch, l.yaw, 0, 'YXZ')
      this.q.setFromEuler(this.e)
      m.compose(this.v.set(0, -1.6, -96), this.q, this.s.set(1, 1, 110))
      this.laserMesh.setMatrixAt(n, m)
      this.laserMesh.setColorAt(n++, c.copy(l.color).multiplyScalar(k * k))
    }
    this.commit(this.laserMesh, n)
  }

  drawEffects(dt) {
    // Sparks
    const pos = this.pPos
    const col = this.pCol
    const vel = this.pVel
    let any = false
    for (let i = 0; i < PARTICLES; i++) {
      if (this.pLife[i] <= 0) continue
      any = true
      const life = (this.pLife[i] -= dt)
      const j = i * 3
      if (life <= 0) {
        col[j] = col[j + 1] = col[j + 2] = 0
        continue
      }
      vel[j + 1] -= 9 * dt
      pos[j] += vel[j] * dt
      pos[j + 1] += vel[j + 1] * dt
      pos[j + 2] += vel[j + 2] * dt
      const k = life / this.pMax[i]
      col[j] = this.pBase[j] * k
      col[j + 1] = this.pBase[j + 1] * k
      col[j + 2] = this.pBase[j + 2] * k
    }
    if (any || this.pAny) {
      this.pGeo.attributes.position.needsUpdate = true
      this.pGeo.attributes.color.needsUpdate = true
    }
    this.pAny = any

    // Shock waves
    const m = this.m
    const c = this.c
    let usedSquare = 0
    let usedRound = 0
    for (let i = 0; i < this.waves.length; i++) {
      const w = this.waves[i]
      if (w.life <= 0) {
        w.mesh.setColorAt(w.index, c.setRGB(0, 0, 0))
        continue
      }
      w.life -= dt * 3.2
      const k = Math.max(0, w.life)
      const s = 1 + (1 - k) * (w.round ? 0.35 : 0.45)
      m.makeScale(s, s, 1)
      m.setPosition(w.x, w.y, 0.02)
      w.mesh.setMatrixAt(w.index, m)
      w.mesh.setColorAt(w.index, c.copy(w.color).multiplyScalar(k * 1.6))
      if (w.round) usedRound++
      else usedSquare++
    }
    for (const [mesh, used] of [
      [this.waveSquare, usedSquare],
      [this.waveRound, usedRound],
    ]) {
      mesh.instanceMatrix.needsUpdate = true
      mesh.instanceColor.needsUpdate = true
      mesh.visible = used > 0
    }
  }
}

// ---- Materials and shapes ---------------------------------------------------------------------

function additive(side = THREE.FrontSide) {
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side,
    fog: false,
  })
}

/** A dark panel the club shows through a little: the decks' and the fader's plates. */
function panel(opacity = 0.84) {
  return new THREE.MeshBasicMaterial({
    color: 0x0a0712,
    transparent: true,
    opacity,
    depthWrite: false,
    fog: false,
  })
}

function solid() {
  return new THREE.MeshBasicMaterial({ color: 0xffffff, fog: true })
}

function roundedShape(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function roundedPlane(w, h, r) {
  return new THREE.ShapeGeometry(roundedShape(w, h, r), 6)
}

/** A rounded rectangle's outline, `t` thick. */
function frameGeometry(w, h, r, t) {
  const outer = roundedShape(w, h, r)
  const inner = roundedShape(w - t * 2, h - t * 2, Math.max(0.01, r - t))
  outer.holes.push(new THREE.Path(inner.getPoints(6).reverse()))
  return new THREE.ShapeGeometry(outer, 6)
}

function chevronGeometry() {
  const s = new THREE.Shape()
  const w = 0.3
  const h = 0.17
  const t = 0.085
  s.moveTo(-w, -h / 2)
  s.lineTo(0, h / 2)
  s.lineTo(w, -h / 2)
  s.lineTo(w, -h / 2 - t)
  s.lineTo(0, h / 2 - t)
  s.lineTo(-w, -h / 2 - t)
  s.closePath()
  const geo = new THREE.ShapeGeometry(s)
  geo.translate(0, t / 2, 0)
  return geo
}

// ---- Textures (drawn once on 2D canvases) -----------------------------------------------------

function canvas2d(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

/** A number written as a GLSL float literal. */
const glsl = (x) => (Number.isInteger(x) ? `${x}.0` : String(x))

function texture(c) {
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

/** A note tile, white so each note can tint it: a bright rim, a darker face and a sheen. */
function tileTexture() {
  const S = 128
  const [c, g] = canvas2d(S, S)
  roundRect(g, 3, 3, S - 6, S - 6, 16)
  g.fillStyle = '#ffffff'
  g.fill()
  roundRect(g, 14, 14, S - 28, S - 28, 9)
  const grad = g.createLinearGradient(0, 14, 0, S - 14)
  grad.addColorStop(0, '#d8d8d8')
  grad.addColorStop(0.5, '#8c8c8c')
  grad.addColorStop(1, '#a6a6a6')
  g.fillStyle = grad
  g.fill()
  g.fillStyle = 'rgba(255, 255, 255, 0.55)'
  roundRect(g, 22, 20, S - 44, 12, 6)
  g.fill()
  return texture(c)
}

/** A record seen from above: grooves, a coloured label with a wedge to see it turn, the cue mark. */
function recordTexture(hex, word) {
  const S = 512
  const [c, g] = canvas2d(S, S)
  const color = `#${hex.toString(16).padStart(6, '0')}`
  const r = S / 2
  g.translate(r, r)
  g.fillStyle = '#050407'
  g.beginPath()
  g.arc(0, 0, r, 0, TAU)
  g.fill()
  g.lineWidth = 1.2
  for (let rr = r * 0.4; rr < r * 0.97; rr += 4) {
    g.strokeStyle = `rgba(255, 255, 255, ${0.04 + 0.035 * Math.sin(rr * 0.9)})`
    g.beginPath()
    g.arc(0, 0, rr, 0, TAU)
    g.stroke()
  }
  // A sheen across the grooves
  g.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  g.lineWidth = r * 0.25
  g.beginPath()
  g.arc(0, 0, r * 0.68, -2.5, -1.7)
  g.stroke()
  g.fillStyle = color
  g.beginPath()
  g.arc(0, 0, r * 0.36, 0, TAU)
  g.fill()
  g.fillStyle = 'rgba(0, 0, 0, 0.35)'
  g.beginPath()
  g.moveTo(0, 0)
  g.arc(0, 0, r * 0.36, -0.25, 0.25)
  g.closePath()
  g.fill()
  g.fillStyle = '#0b0710'
  g.font = `800 ${Math.round(r * 0.085)}px "Unbounded", "Arial Black", sans-serif`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(word, 0, -r * 0.16)
  g.fillText('BACKSPIN', 0, r * 0.16)
  g.fillStyle = '#f5f1ff'
  g.beginPath()
  g.arc(0, 0, r * 0.035, 0, TAU)
  g.fill()
  roundRect(g, -6, -r * 0.95, 12, r * 0.17, 5)
  g.fill()
  return texture(c)
}

/** Four people: two builds, each with arms down and arms up. */
function crowdAtlas() {
  const [c, g] = canvas2d(256, 128)
  g.fillStyle = '#fff'
  g.strokeStyle = '#fff'
  g.lineCap = 'round'
  for (let k = 0; k < 4; k++) {
    const x = k * 64 + 32
    const wide = k >= 2
    const up = k % 2 === 1
    const bw = wide ? 21 : 17
    g.beginPath()
    g.arc(x, wide ? 30 : 26, wide ? 11 : 10, 0, TAU)
    g.fill()
    g.beginPath()
    g.moveTo(x - bw, 128)
    g.lineTo(x - bw, 56)
    g.quadraticCurveTo(x - bw, 42, x - bw + 12, 42)
    g.lineTo(x + bw - 12, 42)
    g.quadraticCurveTo(x + bw, 42, x + bw, 56)
    g.lineTo(x + bw, 128)
    g.closePath()
    g.fill()
    g.lineWidth = 8
    if (up) {
      g.beginPath()
      g.moveTo(x - bw + 4, 50)
      g.lineTo(x - bw - 6, 6)
      if (!wide) {
        g.moveTo(x + bw - 4, 50)
        g.lineTo(x + bw + 6, 6)
      }
      g.stroke()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  return tex
}

/** The crossfader marks: where to put it, and the key that does it (when there are keys). */
function markerAtlas(keys = true) {
  // Three cells the shape of the plane they're shown on (0.62 x 0.3)
  const [c, g] = canvas2d(768, 128)
  const labels = keys ? ['L · Z', 'C · X', 'R · C'] : ['L', 'C', 'R']
  for (let k = 0; k < 3; k++) {
    const x = k * 256
    roundRect(g, x + 8, 8, 240, 112, 30)
    g.fillStyle = '#ffffff'
    g.fill()
    g.fillStyle = '#0b0710'
    g.font = '800 50px "Unbounded", "Arial Black", sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(labels[k], x + 128, 68)
  }
  return texture(c)
}

function dotTexture() {
  const [c, g] = canvas2d(64, 64)
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.6)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}
