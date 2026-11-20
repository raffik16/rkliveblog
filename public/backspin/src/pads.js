// The eight performance pads, in the order a pad controller numbers them: the bottom row left to
// right (pads 1-4), then the top row (pads 5-8). On the keyboard they are the left hand's
// A S D F with Q W E R above, laid out like the pads on screen (or J K L ; and U I O P), and on a
// MIDI pad controller they are its first eight pads.
//
// The bottom row is the drum kit you finger-drum the beat on. The top row is for the bigger
// moments: a laser, a crash, the scratch record's "ahh" (VOX restarts the record from its cue,
// like a hot cue) and the horn section, which plays whatever stab the song has at that moment.

export const PADS = [
  { id: 'kick', name: 'KICK', key: 'KeyA', label: 'A', color: '#ff2bd6' },
  { id: 'snare', name: 'SNARE', key: 'KeyS', label: 'S', color: '#22e4ff' },
  { id: 'hat', name: 'OPEN HAT', key: 'KeyD', label: 'D', color: '#ffd84a' },
  { id: 'clap', name: 'CLAP', key: 'KeyF', label: 'F', color: '#ff8a3d' },
  { id: 'laser', name: 'LASER', key: 'KeyQ', label: 'Q', color: '#5dff9b' },
  { id: 'crash', name: 'CRASH', key: 'KeyW', label: 'W', color: '#cfe0ff' },
  { id: 'vox', name: 'VOX', key: 'KeyE', label: 'E', color: '#b07bff' },
  { id: 'horn', name: 'HORN', key: 'KeyR', label: 'R', color: '#ff4d6d' },
]

// The same eight pads under the right hand, for playing the pads with both hands (when the mouse
// isn't needed for the record)
export const ALT_KEYS = ['KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'KeyU', 'KeyI', 'KeyO', 'KeyP']

export const PAD_COUNT = PADS.length
export const PAD_INDEX = Object.fromEntries(PADS.map((p, i) => [p.id, i]))
export const PAD_OF_KEY = Object.fromEntries([
  ...PADS.map((p, i) => [p.key, i]),
  ...ALT_KEYS.map((k, i) => [k, i]),
])

// Hybrid, on a computer, has six pads. The drums go on A S D under the left hand: the kick and
// the snare on their own keys, and the clap on D, where the keyboard has the open hat (the hat has
// two notes in the whole song, the clap four on every level). The mouse plays the row above them:
// the crash, the vox and the horn, the pads with the most notes in the charts after the drums.
// The hat and the laser sit Hybrid out (the song plays its hats itself).
export const HYBRID_PADS = [
  { pad: 0, key: 'KeyA', label: 'A' },
  { pad: 1, key: 'KeyS', label: 'S' },
  { pad: 3, key: 'KeyD', label: 'D' },
]
export const HYBRID_PAD_OF_KEY = Object.fromEntries(HYBRID_PADS.map((h) => [h.key, h.pad]))

// Where each pad sits on screen: its column and its row (0 the bottom one), or null if it isn't
// there. All eight are four columns wide; Hybrid's six are three.
export const LAYOUTS = {
  full: { cols: 4, slots: PADS.map((_, i) => ({ col: i % 4, row: i < 4 ? 0 : 1 })) },
  hybrid: {
    cols: 3,
    slots: [
      { col: 0, row: 0 }, // kick
      { col: 1, row: 0 }, // snare
      null, // hat
      { col: 2, row: 0 }, // clap
      null, // laser
      { col: 0, row: 1 }, // crash
      { col: 1, row: 1 }, // vox
      { col: 2, row: 1 }, // horn
    ],
  },
}

/** The pad layout for a way to play: Hybrid's six, or all eight. */
export const layoutFor = (controls) => (controls === 'hybrid' ? LAYOUTS.hybrid : LAYOUTS.full)

// Sounds that belong to the song's beat: a hit the chart doesn't give you is played for you.
// The others (laser, crash, vox) only sound when someone plays them.
export const SONG_PADS = new Set(['kick', 'snare', 'hat', 'clap', 'horn'])

// For the freestyle's variety bonus: the drum pads count as one kind of move
export const MOVE_KIND = {
  kick: 'drums',
  snare: 'drums',
  hat: 'drums',
  clap: 'drums',
  crash: 'drums',
  laser: 'laser',
  vox: 'vox',
  horn: 'horn',
}

// MIDI notes: a pad controller's first eight pads send notes 36-43 (C1-G1) out of the box, in
// this same order. A 4x4 controller's top two rows (44-51) play the same eight pads again.
export const MIDI_BASE = 36
