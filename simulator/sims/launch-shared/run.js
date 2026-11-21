// The page's runtime: a drop-in for the kit's runSim(defaults, setup) for a film made at 1600 x 900. It letterboxes
// the frame into any window, renders the 3D at the pixel density the frame really has on screen, and puts a player
// under it: play / pause, restart, a scrubber marked at the film's clicks, a switch that hides the product panels,
// full screen. render(t) stays a pure function of t, so scrubbing is just rendering another second.
//
// Capture contract (the kit's capture.mjs): with window.__CAPTURE or ?capture the page draws t = 0 and exposes
// window.SIM = {duration, fps, ready, render(t)}, and nothing runs on its own.
//
// Keys: space play / pause, R restart, left / right 2 s, H the panels, F full screen.
const W0 = 1600
const H0 = 900

const CSS = `
html,body{margin:0;height:100%;overflow:hidden;background:var(--page,#dfe6fa);transition:background .6s}
.stage{position:fixed;inset:0;overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
#app{position:absolute;left:0;top:0;width:${W0}px;height:${H0}px;transform-origin:0 0;overflow:hidden;contain:strict}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
#poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:20;transition:opacity .5s}
#app.hide-ui .wt>*:not(.tags){opacity:0!important;transition:opacity .3s}
.pl{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:30;display:flex;align-items:center;gap:6px;
  background:rgba(15,23,48,.86);color:#fff;border-radius:14px;padding:6px 10px;box-shadow:0 8px 28px rgba(15,23,48,.28);
  font-size:13px;font-weight:600;font-feature-settings:"tnum";width:min(720px,calc(100vw - 24px));backdrop-filter:blur(8px);
  transition:opacity .4s}
.pl.idle{opacity:.0}
.pl button{all:unset;cursor:pointer;width:34px;height:34px;border-radius:9px;display:grid;place-items:center;flex:none}
.pl button:hover{background:rgba(255,255,255,.12)}
.pl button:focus-visible{outline:2px solid #b4f000;outline-offset:1px}
.pl button[aria-pressed="true"]{background:rgba(255,255,255,.16)}
.pl .tm{min-width:84px;text-align:center;opacity:.85;flex:none}
.pl .sc{position:relative;flex:1;height:34px;display:flex;align-items:center}
.pl input{all:unset;width:100%;height:34px;cursor:pointer}
.pl input::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:linear-gradient(90deg,#8fb0f7 var(--p,0%),rgba(255,255,255,.22) var(--p,0%))}
.pl input::-moz-range-track{height:4px;border-radius:2px;background:linear-gradient(90deg,#8fb0f7 var(--p,0%),rgba(255,255,255,.22) var(--p,0%))}
.pl input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;margin-top:-5px;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.pl input::-moz-range-thumb{width:14px;height:14px;border:0;border-radius:50%;background:#fff}
.pl input:focus-visible{outline:2px solid #b4f000;outline-offset:2px;border-radius:4px}
.pl .tick{position:absolute;top:50%;width:2px;height:8px;margin:-4px 0 0 -1px;border-radius:1px;background:rgba(255,255,255,.55);pointer-events:none}
.pl .lab{display:none}
.pl-link{color:#fff;text-decoration:none;font-size:12.5px;font-weight:700;padding:0 8px;height:34px;display:grid;place-items:center;border-radius:9px;white-space:nowrap;flex:none}
body>.pl-link{position:fixed;left:-999px}
.pl-link:hover{background:rgba(255,255,255,.12)}
.pl-link:focus-visible{outline:2px solid #b4f000;outline-offset:1px}
@media (max-width:560px){.pl .tm{min-width:64px;font-size:12px}.pl{gap:2px;padding:4px 6px}.pl-link{display:none}}
.rot{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:30;background:rgba(15,23,48,.86);color:#fff;font-size:12.5px;
  font-weight:600;padding:7px 12px;border-radius:10px;display:none;white-space:nowrap}
@media (orientation:portrait) and (max-width:700px){.rot{display:block}}
`
const ico = (d) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
const I = {
  play: ico('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),
  pause: ico('<path d="M8 5v14M16 5v14"/>'),
  restart: ico('<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4.5h4.5"/>'),
  panels: ico('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M14 9v11"/>'),
  full: ico('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
}
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

export async function runSim(defaults, setup) {
  const cfg = { ...defaults, ...(window.__SIM_CONFIG ?? {}) }
  const q = new URLSearchParams(location.search)
  const capture = !!window.__CAPTURE || q.has('capture')
  const style = document.createElement('style')
  style.textContent = CSS
  document.head.appendChild(style)
  const app = document.getElementById('app')
  // the frame is 1600 px wide before its transform: inside a fixed, clipped, viewport-sized box it can't widen the
  // page, which would make a phone zoom the whole page out to fit it
  if (!capture) {
    const stage = document.createElement('div')
    stage.className = 'stage'
    app.before(stage)
    stage.appendChild(app)
  }
  const canvas = document.createElement('canvas')
  canvas.id = 'gl'
  app.prepend(canvas)
  const poster = document.getElementById('poster')

  await document.fonts.load('800 20px "Inter"').catch(() => {})

  // fit the 1600 x 900 frame into the window, centred, and the 3D's pixel ratio to what the screen really shows
  // quality drops in steps if the frames come too slowly (see the loop)
  let scale = 1
  let quality = 1
  const pixelRatio = () =>
    capture
      ? devicePixelRatio || 1
      : Math.min(1.75, Math.max(0.5, (devicePixelRatio || 1) * scale * quality))
  const fit = () => {
    if (capture) return
    scale = Math.min(innerWidth / W0, innerHeight / H0)
    const x = (innerWidth - W0 * scale) / 2
    const y = (innerHeight - H0 * scale) / 2
    app.style.transform = `translate(${x}px,${y}px) scale(${scale})`
  }
  fit()

  const sim = await setup({ cfg, canvas, capture, pixelRatio })
  const dur = cfg.duration
  let cur = Number(q.get('t')) || 0
  let lastBg = ''
  const draw = (t) => {
    const info = sim.render(t) || {}
    if (info.bg && info.bg !== lastBg) {
      lastBg = info.bg
      document.documentElement.style.setProperty('--page', info.bg)
    }
  }
  window.SIM = {
    cfg,
    duration: dur,
    fps: cfg.fps,
    ready: true,
    render: (t) => {
      cur = t
      draw(t)
    },
  }
  if (capture) {
    draw(cur)
    return
  }

  // ---- the player
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let playing = !reduce
  const bar = document.createElement('div')
  bar.className = 'pl'
  bar.setAttribute('role', 'group')
  bar.setAttribute('aria-label', 'Film controls')
  bar.innerHTML = `
    <button data-k="play" aria-label="Pause">${I.pause}</button>
    <button data-k="restart" aria-label="Restart">${I.restart}</button>
    <span class="tm" data-k="tm">0:00 / ${mmss(dur)}</span>
    <label class="sc"><span class="lab">Scrub through the film</span><input data-k="scrub" type="range" min="0" max="${dur}" step="0.01" value="0" aria-label="Position in the film">${(cfg.marks ?? []).map((m) => `<i class="tick" style="left:${((100 * m) / dur).toFixed(2)}%"></i>`).join('')}</label>
    <button data-k="panels" aria-label="Hide the panels" aria-pressed="false">${I.panels}</button>
    <button data-k="full" aria-label="Full screen">${I.full}</button>`
  document.body.appendChild(bar)
  // a link the page offers (to the write-up) rides at the end of the bar
  const link = document.querySelector('.pl-link')
  if (link) bar.appendChild(link)
  const rot = document.createElement('div')
  rot.className = 'rot'
  rot.textContent = 'Turn your phone sideways for a bigger view'
  document.body.appendChild(rot)
  const $ = (k) => bar.querySelector(`[data-k="${k}"]`)
  const playBtn = $('play')
  const scrub = $('scrub')
  const tm = $('tm')
  const setPlaying = (p) => {
    playing = p
    playBtn.innerHTML = p ? I.pause : I.play
    playBtn.setAttribute('aria-label', p ? 'Pause' : 'Play')
  }
  setPlaying(playing)
  // paused, nothing is drawn unless something changes (a seek, a resize, the panels)
  let dirty = true
  const seek = (t) => {
    cur = ((t % dur) + dur) % dur
    dirty = true
  }
  const togglePanels = () => {
    const on = app.classList.toggle('hide-ui')
    $('panels').setAttribute('aria-pressed', String(on))
    $('panels').setAttribute('aria-label', on ? 'Show the panels' : 'Hide the panels')
  }
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }
  playBtn.onclick = () => setPlaying(!playing)
  $('restart').onclick = () => {
    seek(0)
    setPlaying(true)
  }
  $('panels').onclick = togglePanels
  $('full').onclick = toggleFull
  if (!document.documentElement.requestFullscreen) $('full').style.display = 'none'
  let wasPlaying = false
  scrub.addEventListener('pointerdown', () => {
    wasPlaying = playing
    setPlaying(false)
  })
  scrub.addEventListener('input', () => seek(Number(scrub.value)))
  scrub.addEventListener('change', () => wasPlaying && setPlaying(true))
  addEventListener('keydown', (e) => {
    if (e.target === scrub && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return
    if (e.key === ' ' && e.target.tagName !== 'BUTTON') setPlaying(!playing)
    else if (e.key === 'r' || e.key === 'R') seek(0)
    else if (e.key === 'ArrowRight') seek(cur + 2)
    else if (e.key === 'ArrowLeft') seek(cur - 2)
    else if (e.key === 'h' || e.key === 'H') togglePanels()
    else if (e.key === 'f' || e.key === 'F') toggleFull()
    else return
    e.preventDefault()
  })
  // the bar fades while the film plays untouched
  let idle
  const wake = () => {
    bar.classList.remove('idle')
    clearTimeout(idle)
    idle = setTimeout(
      () => playing && !bar.matches(':hover, :focus-within') && bar.classList.add('idle'),
      2600
    )
  }
  ;['pointermove', 'pointerdown', 'keydown'].forEach((ev) =>
    addEventListener(ev, wake, { passive: true })
  )
  wake()

  // draw a few seconds from each part of the film while the poster still covers it, so every shader is compiled
  // before the first frame shows (liftoff and the station would otherwise stutter the first time they appear)
  for (const w of cfg.warm ?? []) draw(w)

  const resize = () => {
    fit()
    sim.resize?.()
    dirty = true
  }
  addEventListener('resize', resize)
  resize()

  let last = performance.now()
  let shown = false
  let lastUi = -1
  let frames = 0
  let slow = 0
  const loop = (now) => {
    const raw = (now - last) / 1000
    const dt = Math.min(0.1, raw)
    last = now
    // a device that can't keep up gets fewer pixels: past the first second, every 60 frames that average under
    // 36 fps cost 15% of the resolution, down to half
    if (playing && document.visibilityState === 'visible' && ++frames > 60) {
      slow += raw
      if (frames % 60 === 0) {
        if (slow / 60 > 1 / 36 && quality > 0.55) {
          quality *= 0.85
          sim.resize?.()
        }
        slow = 0
      }
    }
    if (playing) cur = (cur + dt) % dur
    if (playing || dirty) {
      dirty = false
      draw(cur)
    }
    if (Math.abs(cur - lastUi) > 0.05) {
      lastUi = cur
      scrub.value = cur.toFixed(2)
      scrub.style.setProperty('--p', `${((100 * cur) / dur).toFixed(2)}%`)
      tm.textContent = `${mmss(cur)} / ${mmss(dur)}`
    }
    if (!shown) {
      shown = true
      if (poster) {
        poster.style.opacity = '0'
        setTimeout(() => poster.remove(), 600)
      }
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
