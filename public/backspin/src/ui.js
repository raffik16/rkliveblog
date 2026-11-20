// The menus: plain DOM laid over the club. index.html holds the markup for every screen; this
// file shows one at a time and fills in the numbers. main.js decides what happens on each button
// (every button has a data-action, handled in one place).

import { PADS } from './pads.js'
import { noteName } from './midi.js'

const $ = (selector) => document.querySelector(selector)

// The pads in the order they sit on screen: the top row, then the bottom row
const GRID_ORDER = [4, 5, 6, 7, 0, 1, 2, 3]

const MIDI_STATE = {
  off: 'Off',
  asking: 'Waiting…',
  on: 'On',
  denied: 'Blocked',
  unsupported: 'Not here',
}

export class UI {
  constructor(root, actions) {
    this.root = root
    this.screens = new Map()
    for (const el of root.querySelectorAll('[data-screen]')) this.screens.set(el.dataset.screen, el)
    this.current = null

    root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]')
      if (!el || el.disabled || !root.contains(el)) return
      const fn = actions[el.dataset.action]
      if (fn) fn(el, e)
    })

    this.sens = $('#sensitivity')
    this.sens.addEventListener('input', () => actions.sensitivity(Number(this.sens.value)))
    this.lock = $('#lock-hint')
    this.count = $('#countdown')
    this.prep = $('#preparing')
    this.slots = [...document.querySelectorAll('#cal-slots span')]
    this.pad = $('#cal-pad')

    // The MIDI learn buttons and the results' timing strip, both laid out like the pads
    this.learnButtons = []
    this.timingCells = []
    for (const i of GRID_ORDER) {
      const b = document.createElement('button')
      b.type = 'button'
      b.dataset.action = 'midiLearn'
      b.dataset.pad = String(i)
      b.style.setProperty('--pad', PADS[i].color)
      b.append(document.createElement('strong'), document.createElement('span'))
      b.firstChild.textContent = PADS[i].name
      $('#midi-learn').append(b)
      this.learnButtons[i] = b

      const cell = document.createElement('div')
      cell.style.setProperty('--pad', PADS[i].color)
      cell.append(document.createElement('span'), document.createElement('strong'))
      cell.firstChild.textContent = PADS[i].name
      $('#res-pads').append(cell)
      this.timingCells[i] = cell
    }
  }

  /** Show one screen (or none, during play) and put the keyboard focus on its main button. */
  show(name) {
    for (const [key, el] of this.screens) el.hidden = key !== name
    this.current = name
    const el = this.screens.get(name)
    if (!el) return
    el.scrollTop = 0
    const first =
      el.querySelector('button.primary:not([hidden])') || el.querySelector('button:not([hidden])')
    if (first) first.focus({ preventScroll: true })
  }

  hide() {
    this.show(null)
  }

  // ---- Loading ------------------------------------------------------------------------------

  progress(fraction) {
    $('#load-bar').style.transform = `scaleX(${Math.max(0.02, fraction)})`
    $('#load-pct').textContent = `${Math.round(fraction * 100)}%`
  }

  fail(message) {
    $('#load-status').textContent = message
    $('#load-status').classList.add('error')
    $('#load-pct').textContent = ''
    this.show('loading')
  }

  touchNotice(show) {
    $('#touch-note').hidden = !show
  }

  /** While the band is rendered at a practice tempo: a fraction, or null when it's done. */
  preparing(fraction) {
    if (fraction === null || fraction === undefined) {
      this.prep.hidden = true
      return
    }
    this.prep.hidden = false
    this.prep.textContent = `Tuning the band to your speed · ${Math.round(fraction * 100)}%`
  }

  // ---- Settings, levels and practice --------------------------------------------------------

  settings({ sensitivity, offsetMs }) {
    this.sens.value = String(sensitivity)
    $('#sens-value').textContent = `${sensitivity.toFixed(2)}×`
    $('#offset-value').textContent = formatMs(offsetMs)
  }

  levels(info) {
    for (const { level, notes, best } of info) {
      const card = document.querySelector(`[data-level="${level}"]`)
      card.querySelector('.count').textContent = `${notes} notes`
      card.querySelector('.best').textContent = best
        ? `Best ${best.score.toLocaleString('en-US')} · ${best.grade}`
        : 'No score yet'
    }
  }

  /**
   * How to play (keyboard, mouse, Hybrid, touch): the choice wherever it's made, with only the
   * ones this device has (`offered`), and whether it's shown at all.
   */
  controls(value, show, offered) {
    for (const el of document.querySelectorAll('[data-action="controls"]')) {
      el.setAttribute('aria-pressed', String(el.dataset.value === value))
      el.hidden = !offered.includes(el.dataset.value)
    }
    for (const el of document.querySelectorAll('[data-controls]')) el.hidden = !show
    for (const el of document.querySelectorAll('[data-note-for]')) {
      el.hidden = el.dataset.noteFor !== value
    }
  }

  calibrated(yes, offsetMs) {
    $('#cal-hint').hidden = yes
    $('#offset-line').textContent = yes ? `Audio offset ${formatMs(offsetMs)}` : ''
  }

  practice(p) {
    for (const el of document.querySelectorAll('[data-action="practiceSet"]')) {
      el.setAttribute('aria-pressed', String(String(p[el.dataset.key]) === el.dataset.value))
    }
    $('#practice-guide').checked = p.guide
    // A run through the whole song plays it once
    $('#practice-times').hidden = p.section === 'song'
  }

  pauseFor(sandbox, practice) {
    $('#pause [data-action="restart"]').hidden = sandbox
    $('#pause-title').textContent = sandbox
      ? 'Sandbox paused'
      : practice
        ? 'Practice paused'
        : 'Paused'
  }

  // ---- MIDI ---------------------------------------------------------------------------------

  /** { state, devices: [names], learning: pad or -1, notes: [note per pad], last: text } */
  midi({ state, devices, learning, notes, last }) {
    const on = state === 'on'
    $('#midi-state').textContent = MIDI_STATE[state] || state
    $('#midi-state').dataset.state = state
    const connect = $('#midi-connect')
    connect.hidden = on || state === 'unsupported'
    connect.disabled = state === 'asking'
    connect.textContent = state === 'denied' ? 'Try again' : 'Connect a pad controller'
    $('#midi-none').hidden = state !== 'unsupported'
    $('#midi-denied').hidden = state !== 'denied'
    $('#midi-on').hidden = !on
    $('#midi-devices').textContent = devices.length
      ? devices.join(' · ')
      : 'No controller found yet. Plug one in: it shows up here.'
    for (let i = 0; i < this.learnButtons.length; i++) {
      const b = this.learnButtons[i]
      const waiting = learning === i
      b.classList.toggle('learning', waiting)
      b.setAttribute('aria-pressed', String(waiting))
      const note = notes[i]
      b.lastChild.textContent = waiting
        ? 'Hit a pad…'
        : note === null
          ? '—'
          : `${noteName(note)} · ${note}`
    }
    $('#midi-last').textContent = last
  }

  // ---- During play --------------------------------------------------------------------------

  lockHint(show) {
    if (this.lock.hidden === !show) return
    this.lock.hidden = !show
  }

  countdown(text) {
    this.count.textContent = text || ''
    this.count.hidden = !text
  }

  // ---- Calibration --------------------------------------------------------------------------

  calReset() {
    for (const s of this.slots) {
      s.textContent = ''
      s.className = ''
    }
    $('#cal-status').textContent =
      'Press Start, then tap Space or the circle on each of the eight clicks.'
    $('#cal-save').hidden = true
    $('#cal-start').hidden = false
    $('#cal-start').textContent = 'Start'
    this.pad.textContent = ''
    this.pad.style.setProperty('--pulse', '0')
  }

  calRunning() {
    $('#cal-start').hidden = true
    $('#cal-save').hidden = true
    $('#cal-status').textContent = 'Listen for the count-in…'
  }

  calPulse(label, amount, slot) {
    if (this.pad.textContent !== label) this.pad.textContent = label
    this.pad.style.setProperty('--pulse', amount.toFixed(3))
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].classList.toggle('now', i === slot)
    }
  }

  calTap(slot, errorMs) {
    const s = this.slots[slot]
    s.textContent = formatMs(errorMs)
    s.className = Math.abs(errorMs) <= 45 ? 'tight' : 'loose'
  }

  calDone(result, taps) {
    this.pad.textContent = ''
    this.pad.style.setProperty('--pulse', '0')
    for (const s of this.slots) s.classList.remove('now')
    $('#cal-start').hidden = false
    $('#cal-start').textContent = 'Try again'
    if (!result) {
      $('#cal-status').textContent = `Only ${taps} of 8 taps landed near a click. Try again?`
      return
    }
    const late = result.offsetMs >= 0 ? 'after' : 'before'
    $('#cal-status').textContent =
      `Your taps land ${Math.abs(result.offsetMs)} ms ${late} the click (give or take ` +
      `${Math.max(1, Math.round(result.spreadMs / 2))} ms). Save it and every hit is judged ` +
      `with that taken into account.`
    $('#cal-save').hidden = false
    $('#cal-save').focus({ preventScroll: true })
  }

  // ---- Results ------------------------------------------------------------------------------

  /**
   * `what` names a practice run ("Practice · Verse · 75%"), null for the song; `controls` says the
   * run was played on a chart for the mouse ('mouse' or 'hybrid': its own chart, its own best).
   */
  results(r, isBest, song, what, controls) {
    const level = r.level[0].toUpperCase() + r.level.slice(1)
    const how = controls ? ` · ${controls[0].toUpperCase()}${controls.slice(1)}` : ''
    $('#res-song').textContent = `${what || song} · ${level}${how}`
    const grade = $('#res-grade')
    grade.textContent = r.grade
    grade.dataset.grade = r.grade
    $('#res-best').hidden = !isBest
    $('#res-score').textContent = r.score.toLocaleString('en-US')
    $('#res-acc').textContent = `${r.accuracy.toFixed(1)}%`
    $('#res-combo').textContent = String(r.maxCombo)
    $('#res-free').textContent = r.freestyle.toLocaleString('en-US')
    $('#res-free').parentElement.hidden = !r.hasFreestyle
    const c = r.counts
    $('#res-counts').textContent =
      `Perfect ${c.perfect} · Great ${c.great} · Good ${c.good} · Miss ${c.miss}` +
      (r.overhits ? ` · Extra ${r.overhits}` : '')
    $('#res-crowd').textContent = r.crowd

    // Timing: on average early or late, and by how much the hits wander
    const t = r.timing
    const timing = $('#res-timing')
    if (t.hits >= 4) {
      const lean =
        Math.abs(t.meanMs) < 4
          ? 'right on the beat'
          : `${Math.abs(t.meanMs)} ms ${t.meanMs < 0 ? 'early' : 'late'}`
      timing.textContent = `On average ${lean}, give or take ${t.spreadMs} ms.`
    } else {
      timing.textContent = ''
    }
    $('#res-pads').hidden = t.hits < 4
    for (const p of t.pads) {
      const cell = this.timingCells[p.pad]
      const ms = p.meanMs
      cell.lastChild.textContent = ms === null ? '—' : formatMs(ms)
      cell.dataset.lean = ms === null ? '' : ms <= -12 ? 'early' : ms >= 12 ? 'late' : 'tight'
    }

    // From a practice run, go again or change the practice; from the song, pick a level
    $('#res-retry').textContent = r.practice ? 'Practice again' : 'Play again'
    $('#res-level').hidden = r.practice
    $('#res-practice').hidden = !r.practice
  }
}

export function formatMs(ms) {
  const n = Math.round(ms)
  return `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)} ms`
}
