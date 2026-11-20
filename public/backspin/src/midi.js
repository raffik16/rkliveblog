// MIDI pad controllers, through Web MIDI. It stays off until the player connects in Settings:
// asking for MIDI access shows a permission prompt, and nobody should get one just for opening
// the game. Once it has been allowed, the game reconnects by itself on later visits.
//
// Any pad controller works out of the box. Most send notes 36-43 (C1-G1) from their first eight
// pads, in the same order as the pads on screen; a 4x4 controller's top two rows (44-51) play
// the same eight again. Other notes wrap around the same way, and any pad can be taught a note
// of its own (MIDI learn). Velocity sets how loud a hit plays, and each message's timestamp is
// judged like a key press: the time it arrived, not the frame that handled it.

import { MIDI_BASE, PAD_COUNT } from './pads.js'

const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

/** A note's name as pad controllers print it (36 is C1). */
export function noteName(note) {
  return `${NAMES[note % 12]}${Math.floor(note / 12) - 2}`
}

export class Midi {
  /**
   * onPad(index, pageMs, velocity 0..1) for every pad hit; map: the learned notes ({ note: pad },
   * kept by the caller); onChange() when devices come and go or the state changes.
   */
  constructor({ onPad, map, onChange }) {
    this.onPad = onPad
    this.map = map
    this.onChange = onChange || (() => {})
    this.access = null
    this.state = Midi.supported ? 'off' : 'unsupported' // off | asking | on | denied | unsupported
    this.learning = -1 // the pad waiting to be taught a note
    this.onLearn = null
    this.last = null // { note, pad } of the last hit, for Settings
  }

  static get supported() {
    return typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function'
  }

  /** Reconnect without a prompt, if the browser says MIDI was allowed before. */
  async resume() {
    if (!Midi.supported || this.access) return false
    try {
      const status = await navigator.permissions.query({ name: 'midi' })
      if (status.state !== 'granted') return false
    } catch {
      return false // this browser can't say: wait for the player to ask
    }
    return this.connect()
  }

  /** Ask for MIDI access (shows the browser's prompt the first time). Call from a click. */
  async connect() {
    if (!Midi.supported) return false
    if (this.access) return true
    this.state = 'asking'
    this.onChange()
    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false })
    } catch {
      this.state = 'denied'
      this.onChange()
      return false
    }
    this.state = 'on'
    this.access.onstatechange = () => {
      this.listen()
      this.onChange()
    }
    this.listen()
    this.onChange()
    return true
  }

  /** Listen to every input, including ones plugged in since last time. */
  listen() {
    for (const input of this.access.inputs.values()) {
      if (!input.onmidimessage) input.onmidimessage = (e) => this.message(e)
    }
  }

  /** Names of the connected inputs. */
  devices() {
    if (!this.access) return []
    const out = []
    for (const input of this.access.inputs.values()) {
      if (input.state === 'connected') out.push(input.name || 'MIDI device')
    }
    return out
  }

  padFor(note) {
    const learned = this.map[note]
    if (learned !== undefined) return learned
    return (((note - MIDI_BASE) % PAD_COUNT) + PAD_COUNT) % PAD_COUNT
  }

  /** The note that plays a pad: a learned one, or the first of its usual notes not taken. */
  noteFor(pad) {
    for (const [note, p] of Object.entries(this.map)) if (p === pad) return Number(note)
    for (let note = MIDI_BASE + pad; note < 128; note += PAD_COUNT) {
      if (!(note in this.map)) return note
    }
    return null
  }

  /** Teach `pad` the next note that arrives; `done(note)` when it has. -1 stops. */
  learn(pad, done) {
    this.learning = pad
    this.onLearn = done
  }

  message(e) {
    const [status, note, velocity] = e.data
    // Note on (any channel). A note on with velocity 0 is a note off.
    if ((status & 0xf0) !== 0x90 || !velocity) return
    if (this.learning >= 0) {
      const pad = this.learning
      const done = this.onLearn
      this.learning = -1
      this.onLearn = null
      if (done) done(note, pad)
    }
    const pad = this.padFor(note)
    this.last = { note, pad }
    this.onPad(pad, e.timeStamp, velocity / 127)
  }
}
