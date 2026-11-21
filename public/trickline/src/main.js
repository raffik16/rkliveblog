// Trickline's player: fits the 1600 x 900 film into the window, plays it on the clock, and lets you pause, scrub
// and jump to a station.
//
//   ?capture       exposes window.SIM = {DUR, render(t)} for frame-by-frame capture, at 1600 x 900
//   ?still=12.3    renders that one film time and sets <body data-ready> (for stills and the social card)
import { createFilm } from './film.js'

const q = new URLSearchParams(location.search)
const still = q.has('still') ? parseFloat(q.get('still')) || 0 : null
const capture = q.has('capture') || still != null
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const app = document.getElementById('app')
const canvas = document.getElementById('gl')
const frame = document.getElementById('frame')
const bar = document.getElementById('bar')
const status = document.getElementById('status')
if (capture) document.body.classList.add('capture')

const fit = () => {
  const barH = capture ? 0 : bar.offsetHeight + 12
  const k = capture ? 1 : Math.min(window.innerWidth / 1600, (window.innerHeight - barH) / 900)
  app.style.transform = `scale(${k})`
  frame.style.width = `${Math.round(1600 * k)}px`
  frame.style.height = `${Math.round(900 * k)}px`
  bar.style.width = frame.style.width
  return k
}
fit()

let film
try {
  film = await createFilm({ app, canvas, capture })
} catch (e) {
  status.textContent = 'This film needs WebGL, which this browser could not start.'
  throw e
}
status.remove()

if (capture) {
  window.SIM = { DUR: film.DUR, render: (t) => film.render(t) }
  if (still != null) {
    film.render(still)
    // one more frame, so the canvas holds this frame when the screenshot is taken
    requestAnimationFrame(() => {
      film.render(still)
      document.body.dataset.ready = '1'
    })
  }
} else {
  const playBtn = document.getElementById('play')
  const scrub = document.getElementById('scrub')
  const time = document.getElementById('time')
  const chapters = document.getElementById('chapters')
  scrub.max = film.DUR.toFixed(2)
  for (const c of film.CHAPTERS) {
    const b = document.createElement('button')
    b.type = 'button'
    b.textContent = c.key
    b.title = `Jump to ${c.label}`
    b.setAttribute('aria-label', `Jump to ${c.label}`)
    b.addEventListener('click', () => seek(c.t, true))
    chapters.appendChild(b)
  }

  let t = reduce ? film.CHAPTERS[0].t + 2.2 : 0
  let playing = !reduce
  let last = performance.now()
  let endHold = 0
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`
  const show = () => {
    playBtn.textContent = playing ? 'Pause' : 'Play'
    playBtn.setAttribute('aria-pressed', String(playing))
    scrub.value = t.toFixed(2)
    time.textContent = `${fmt(t)} / ${fmt(film.DUR)}`
  }
  const seek = (to, play) => {
    t = Math.min(film.DUR, Math.max(0, to))
    endHold = 0
    if (play != null) playing = play
    draw()
  }
  const draw = () => {
    film.render(t)
    show()
  }
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    if (playing) {
      if (t >= film.DUR) {
        // hold the last frame a moment, then go round again
        endHold += dt
        if (endHold > 1.6) seek(0)
      } else {
        t = Math.min(film.DUR, t + dt)
        draw()
      }
    }
    requestAnimationFrame(loop)
  }
  playBtn.addEventListener('click', () => {
    if (t >= film.DUR) seek(0)
    playing = !playing
    show()
  })
  scrub.addEventListener('input', () => seek(parseFloat(scrub.value)))
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement && e.key !== ' ') return
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault()
      playBtn.click()
    } else if (e.key === 'ArrowRight') seek(t + 2)
    else if (e.key === 'ArrowLeft') seek(t - 2)
    else if (e.key === 'r') seek(0, true)
    else if (/^[1-3]$/.test(e.key)) seek(film.CHAPTERS[+e.key - 1].t, true)
  })
  document.addEventListener('visibilitychange', () => {
    last = performance.now()
  })
  window.addEventListener('resize', () => {
    fit()
    film.resize()
    draw()
  })
  draw()
  requestAnimationFrame(loop)
}
