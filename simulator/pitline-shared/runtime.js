// Pitline's page runtime. The simulator skill's films run on sims/kit/runtime.js, which loops in real time and takes
// keys; this does the same for a page on the web: it fits the 1600 x 900 frame to any window (letterboxed, centred),
// adds a play/pause button and a scrub bar with the film's chapters for touch screens, and keeps the kit's capture
// contract (window.SIM.render(t) on ?capture or window.__CAPTURE) so capture.mjs records it frame by frame.
//
// setup({frame, canvas, capture}) returns {render(t), resize(pixelRatio)}; render must be a pure function of t.

const W = 1600;
const H = 900;

const CSS = `
html,body{margin:0;height:100%;background:#dfe6fa;overflow:hidden;-webkit-tap-highlight-color:transparent}
#app{position:fixed;inset:0;font-family:Inter,system-ui,sans-serif}
#frame{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;overflow:hidden}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
.tp{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(760px,calc(100% - 24px));display:flex;align-items:center;gap:12px;padding:8px 14px 8px 8px;border-radius:16px;background:rgba(15,23,48,.86);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font:600 13px Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(20,30,70,.25);z-index:20;transition:opacity .4s}
.tp.idle{opacity:0}
.tp button{flex:none;width:40px;height:40px;border:0;border-radius:11px;background:#3166ea;color:#fff;display:grid;place-items:center;cursor:pointer}
.tp button:focus-visible,.tp input:focus-visible{outline:2px solid #8fb0f7;outline-offset:2px}
.tp .tl{flex:1;position:relative;height:40px;display:flex;align-items:center}
.tp input{width:100%;margin:0;appearance:none;-webkit-appearance:none;background:transparent;height:40px;cursor:pointer;position:relative;z-index:2}
.tp input::-webkit-slider-runnable-track{height:5px;border-radius:3px;background:rgba(255,255,255,.22)}
.tp input::-moz-range-track{height:5px;border-radius:3px;background:rgba(255,255,255,.22)}
.tp input::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;margin-top:-5.5px;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.tp input::-moz-range-thumb{width:16px;height:16px;border:0;border-radius:50%;background:#fff}
.tp .fill{position:absolute;left:0;top:50%;height:5px;margin-top:-2.5px;border-radius:3px;background:#8fb0f7;pointer-events:none;z-index:1}
.tp .ch{position:absolute;top:2px;font-size:10.5px;font-weight:700;color:rgba(255,255,255,.62);white-space:nowrap;transform:translateX(-50%);pointer-events:none}
.tp .tk{position:absolute;top:50%;width:2px;height:11px;margin-top:-5.5px;background:rgba(255,255,255,.55);border-radius:1px;pointer-events:none;z-index:1}
.tp .tm{flex:none;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.8);min-width:86px;text-align:right}
.tp a{flex:none;color:#cfdcfd;text-decoration:none;font-weight:700;white-space:nowrap}
.tp a:hover{color:#fff}
@media (max-width:560px){.tp .ch{display:none}.tp a{display:none}.tp .tm{min-width:0}}
.rot{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translateX(-50%);padding:8px 14px;border-radius:12px;background:rgba(15,23,48,.86);color:#fff;font:600 13px Inter,system-ui,sans-serif;white-space:nowrap;z-index:20;display:none}
@media (orientation:portrait) and (max-width:700px){.rot{display:block}}
`;

const PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M7 4.5v15l12.5-7.5z"/></svg>';
const PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>';

export async function runFilm({duration, fps = 60, chapters = [], post = null, title = 'Pitline'}, setup) {
  const q = new URLSearchParams(location.search);
  const capture = !!window.__CAPTURE || q.has('capture');
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  document.title = title;
  const app = document.getElementById('app');
  const frame = document.createElement('div');
  frame.id = 'frame';
  app.appendChild(frame);
  const canvas = document.createElement('canvas');
  canvas.id = 'gl';
  frame.appendChild(canvas);
  await Promise.all([document.fonts.load('800 20px "Inter"'), document.fonts.load('600 20px "Inter"')]).catch(() => {});

  const sim = await setup({frame, canvas, capture});

  // fit: capture renders the frame at 1:1; a page scales it to the window, letterboxed
  const fit = () => {
    if (capture) {
      frame.style.transform = '';
      sim.resize(devicePixelRatio || 1);
      return;
    }
    const k = Math.min(innerWidth / W, innerHeight / H);
    const x = (innerWidth - W * k) / 2;
    const y = (innerHeight - H * k) / 2;
    frame.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${k.toFixed(4)})`;
    // render at the size it is shown, within 0.6x and 2x of the frame
    sim.resize(Math.min(2, Math.max(0.6, k * (devicePixelRatio || 1))));
  };

  let cur = 0;
  const draw = (t) => {
    cur = t;
    sim.render(t);
  };
  window.SIM = {duration, fps, ready: true, render: draw};
  fit();
  addEventListener('resize', () => {
    fit();
    draw(cur);
  });
  if (capture) {
    draw(0);
    return;
  }

  // the transport
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing = !reduce;
  const tp = document.createElement('div');
  tp.className = 'tp';
  tp.innerHTML = `<button type="button" aria-label="Pause">${PAUSE}</button><div class="tl"><div class="fill"></div>${chapters
    .map(([t, name]) => `<span class="tk" style="left:${((100 * t) / duration).toFixed(2)}%"></span><span class="ch" style="left:${((100 * t) / duration).toFixed(2)}%">${name}</span>`)
    .join('')}<input type="range" min="0" max="${duration}" step="0.01" value="0" aria-label="Film position"></div><span class="tm"></span>${post ? `<a href="${post}">How it was built</a>` : ''}`;
  app.appendChild(tp);
  // a phone held upright shows the 16:9 frame small: say so once, above the frame
  const rot = document.createElement('div');
  rot.className = 'rot';
  rot.textContent = 'Turn your phone sideways for a bigger view';
  app.appendChild(rot);
  const btn = tp.querySelector('button');
  const range = tp.querySelector('input');
  const fill = tp.querySelector('.fill');
  const tm = tp.querySelector('.tm');
  const setPlaying = (p) => {
    playing = p;
    btn.innerHTML = p ? PAUSE : PLAY;
    btn.setAttribute('aria-label', p ? 'Pause' : 'Play');
  };
  setPlaying(playing);
  btn.addEventListener('click', () => setPlaying(!playing));
  let scrubbing = false;
  range.addEventListener('input', () => {
    scrubbing = true;
    draw(Number(range.value));
  });
  range.addEventListener('change', () => (scrubbing = false));
  range.addEventListener('pointerup', () => (scrubbing = false));
  // the bar fades after 3 s without a pointer or a key, and comes back on any movement
  let idleAt = performance.now();
  const wake = () => {
    idleAt = performance.now();
    tp.classList.remove('idle');
  };
  for (const ev of ['pointermove', 'pointerdown', 'keydown', 'touchstart']) addEventListener(ev, wake, {passive: true});
  const seek = (t) => draw(((t % duration) + duration) % duration);
  addEventListener('keydown', (e) => {
    if (e.target === range && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
    if (e.key === ' ' && e.target === btn) return;
    if (e.key === ' ' || e.key === 'k') setPlaying(!playing);
    else if (e.key === 'ArrowRight') seek(cur + 2);
    else if (e.key === 'ArrowLeft') seek(cur - 2);
    else if (e.key === 'r') seek(0);
    else if (e.key === 'f') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    } else if (/^[1-9]$/.test(e.key) && chapters[+e.key - 1]) seek(chapters[+e.key - 1][0]);
    else return;
    e.preventDefault();
  });
  const fmt = (t) => `${Math.floor(Math.max(0, t) / 60)}:${String(Math.floor(Math.max(0, t) % 60)).padStart(2, '0')}`;
  if (reduce) cur = chapters[1]?.[0] ?? 0;
  let last = performance.now();
  const loop = () => {
    // the clock is read here rather than taken from requestAnimationFrame, whose timestamp can be earlier than a
    // reading taken before the first frame; a hidden tab or a slow frame never jumps the film more than 0.1 s
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
    last = now;
    if (playing && !scrubbing) cur = (cur + dt) % duration;
    draw(cur);
    if (!scrubbing) range.value = cur.toFixed(2);
    fill.style.width = `${((100 * cur) / duration).toFixed(2)}%`;
    tm.textContent = `${fmt(cur)} / ${fmt(duration)}`;
    if (now - idleAt > 3000 && playing) tp.classList.add('idle');
    if (!window.SIM_SHOWN) {
      window.SIM_SHOWN = true;
      dispatchEvent(new Event('simframe'));
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
