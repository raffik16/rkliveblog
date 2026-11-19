// GLSL for the harmony machine (WebGL 2). Everything is drawn in plate units: the plate runs
// from -1 to 1 on both axes, and the simulation textures cover a little more than that
// (u_extent) so light that strays past the edge isn't cut off.

const HASH = /* glsl */ `
uint hash(uint x) {
  x ^= x >> 16;
  x *= 0x7feb352du;
  x ^= x >> 15;
  x *= 0x846ca68bu;
  x ^= x >> 16;
  return x;
}
float unit(inout uint s) {
  s = hash(s);
  return float(s >> 8) * (1.0 / 16777216.0);
}
`

// The plate's vibration in one of its modes. For a square plate with free edges, Chladni's
// figures are well described by adding (or subtracting) the two standing waves with n half-waves
// one way and m the other. Scaled so the largest swing anywhere on the plate is 1.
const MODE = /* glsl */ `
const float PI = 3.14159265359;
float shape(vec2 p, vec3 m) {
  vec2 s = (p + 1.0) * (0.5 * PI);
  return 0.5 * (cos(m.x * s.x) * cos(m.y * s.y) + m.z * cos(m.y * s.x) * cos(m.x * s.y));
}
vec2 shapeGrad(vec2 p, vec3 m) {
  vec2 s = (p + 1.0) * (0.5 * PI);
  float gx = -m.x * sin(m.x * s.x) * cos(m.y * s.y) - m.z * m.y * sin(m.y * s.x) * cos(m.x * s.y);
  float gy = -m.y * cos(m.x * s.x) * sin(m.y * s.y) - m.z * m.x * cos(m.y * s.x) * sin(m.x * s.y);
  return (0.25 * PI) * vec2(gx, gy);
}
`

/** One triangle that covers the screen; v_uv runs 0..1 across it */
export const FULLSCREEN_VS = /* glsl */ `#version 300 es
out vec2 v_uv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

// ---------------------------------------------------------------------------------- the sand

/**
 * One step of every grain on the plate, run with transform feedback (no pixels drawn).
 *
 * Where the plate swings hard enough to throw a grain off it, the grain hops: a small random
 * distance that grows with the swing, plus a slide towards the nearest still line. Close to a
 * line the plate can't lift it any more and it stops. Grains differ (size, shape, how they sit),
 * so each has its own threshold: the stickiest stop at the edge of the quiet band round a line,
 * the least sticky go almost onto it, and the band fills with a dense core and soft edges:
 * Chladni's figure. A gentle tone leaves wide quiet zones where the drawing survives and only
 * breaks it up on the loud patches; a loud one leaves nothing but lines. The new mode is mixed in
 * over a moment, as the plate rings up.
 */
export const SAND_UPDATE_VS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec4 a_grain; // x, y, liveliness, alive
out vec4 v_grain;
uniform float u_dt;
uniform float u_drive;
uniform vec3 u_mode;
uniform vec3 u_modeOld;
uniform float u_modeMix;
uniform uint u_seed;
uniform float u_jitter;
uniform float u_drift;
uniform float u_threshold;
${HASH}
${MODE}
void main() {
  vec4 g = a_grain;
  if (g.w < 0.5) {
    v_grain = g;
    return;
  }
  vec2 p = g.xy;
  float u = mix(shape(p, u_modeOld), shape(p, u_mode), u_modeMix);
  vec2 du = mix(shapeGrad(p, u_modeOld), shapeGrad(p, u_mode), u_modeMix);
  float shake = abs(u) * u_drive;
  // This grain's own threshold: most are fairly loose, a few cling on
  uint id = hash(uint(gl_VertexID) ^ 0x2545f491u);
  float grip = unit(id);
  float threshold = u_threshold * 2.0 * grip * grip;
  float lively = 0.0;
  if (shake > threshold) {
    float slope = length(du);
    vec2 toLine = slope > 1e-5 ? du * (-sign(u) / slope) : vec2(0.0);
    uint s = hash(uint(gl_VertexID) * 747796405u ^ u_seed);
    float r1 = max(unit(s), 1e-7);
    float r2 = unit(s);
    vec2 n = sqrt(-2.0 * log(r1)) * vec2(cos(2.0 * PI * r2), sin(2.0 * PI * r2));
    vec2 hop = n * (u_jitter * shake * sqrt(u_dt)) + toLine * (u_drift * shake * u_dt);
    p += hop;
    lively = min(length(hop) / max(u_dt, 1e-4), 4.0);
  }
  g.z = mix(g.z, lively, 0.35);
  // Off the edge of the plate: gone
  if (abs(p.x) > 1.0 || abs(p.y) > 1.0) {
    g.w = 0.0;
    p = vec2(9.0);
  }
  v_grain = vec4(p, g.z, g.w);
}
`

export const DISCARD_FS = /* glsl */ `#version 300 es
precision mediump float;
out vec4 o;
void main() { o = vec4(0.0); }
`

/** Every grain as one point into the sand texture: colour-weighted sum in rgb, count in a */
export const SAND_DRAW_VS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec4 a_grain;
uniform float u_extent;
uniform float u_pointSize;
uniform float u_unit;
out vec4 v_sand;
${HASH}
void main() {
  if (a_grain.w < 0.5) {
    gl_Position = vec4(-9.0, -9.0, 0.0, 1.0);
    gl_PointSize = 1.0;
    v_sand = vec4(0.0);
    return;
  }
  gl_Position = vec4(a_grain.xy / u_extent, 0.0, 1.0);
  gl_PointSize = u_pointSize;
  uint h = hash(uint(gl_VertexID) + 0x9e3779b9u);
  float t = float(h & 1023u) / 1023.0;
  float rare = float((h >> 10) & 255u) / 255.0;
  // Quartz sand: mostly pale and warm, some grains darker, the odd one nearly black
  vec3 albedo = mix(vec3(0.62, 0.50, 0.34), vec3(0.88, 0.80, 0.66), t);
  if (rare > 0.96) albedo *= 0.28;
  // A grain that is bouncing is a blur, so it leaves less of itself in any one place
  float w = 1.0 / (1.0 + a_grain.z * 1.2);
  v_sand = vec4(albedo * w, w) * u_unit;
}
`

export const SAND_DRAW_FS = /* glsl */ `#version 300 es
precision highp float;
in vec4 v_sand;
out vec4 o;
void main() { o = v_sand; }
`

// ---------------------------------------------------------------------------------- the light

/**
 * The LED's path for this frame, one segment per instance, added to the exposure.
 *
 * A camera with its shutter open records a moving point of light as the integral of a small
 * blur spot along its path. Over a straight segment that integral has a closed form: a
 * Gaussian across the line, times the difference of two normal CDFs along it. Summing those
 * per segment gives an unbroken line with no bright beads at the joins, and because each
 * segment carries the time it took, slow parts of the swing (the turns) come out brighter,
 * exactly as they do on film.
 */
export const LIGHT_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec4 a_seg; // ax, ay, bx, by
layout(location = 1) in vec4 a_col; // colour × power, seconds
uniform float u_sigma;
uniform float u_extent;
out vec2 v_local;
out float v_len;
out vec4 v_col;
void main() {
  vec2 a = a_seg.xy;
  vec2 d = a_seg.zw - a;
  float len = length(d);
  vec2 t = len > 1e-7 ? d / len : vec2(1.0, 0.0);
  vec2 n = vec2(-t.y, t.x);
  float r = 3.4 * u_sigma;
  float sx = (gl_VertexID & 1) == 0 ? -r : len + r;
  float sy = (gl_VertexID & 2) == 0 ? -r : r;
  v_local = vec2(sx, sy);
  v_len = len;
  v_col = a_col;
  gl_Position = vec4((a + t * sx + n * sy) / u_extent, 0.0, 1.0);
}
`

export const LIGHT_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_local;
in float v_len;
in vec4 v_col;
uniform float u_sigma;
out vec4 o;
float Phi(float x) { return 0.5 + 0.5 * tanh(0.7978845608 * (x + 0.044715 * x * x * x)); }
void main() {
  float s = u_sigma;
  float x = v_local.x;
  float y = v_local.y;
  float norm = 1.0 / (s * 2.5066282746);
  float across = exp(-0.5 * y * y / (s * s)) * norm;
  float along = v_len > 0.02 * s
    ? (Phi((v_len - x) / s) - Phi(-x / s)) / v_len
    : exp(-0.5 * x * x / (s * s)) * norm;
  o = vec4(v_col.rgb * (across * along * v_col.w), 1.0);
}
`

// ---------------------------------------------------------------------------------- bloom

/** Half the size, smoothing as it goes (dual filtering, after Marius Bjørge) */
export const DOWN_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_src;
uniform vec2 u_texel;
out vec4 o;
void main() {
  vec2 h = u_texel;
  vec3 c = texture(u_src, v_uv).rgb * 4.0;
  c += texture(u_src, v_uv - h).rgb;
  c += texture(u_src, v_uv + h).rgb;
  c += texture(u_src, v_uv + vec2(h.x, -h.y)).rgb;
  c += texture(u_src, v_uv - vec2(h.x, -h.y)).rgb;
  o = vec4(c * 0.125, 1.0);
}
`

/** Twice the size through a 3×3 tent, added on to the level below */
export const UP_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_src;
uniform vec2 u_texel;
uniform float u_weight;
out vec4 o;
void main() {
  vec2 d = u_texel;
  vec3 c = texture(u_src, v_uv).rgb * 4.0;
  c += (texture(u_src, v_uv + vec2(d.x, 0.0)).rgb + texture(u_src, v_uv - vec2(d.x, 0.0)).rgb) * 2.0;
  c += (texture(u_src, v_uv + vec2(0.0, d.y)).rgb + texture(u_src, v_uv - vec2(0.0, d.y)).rgb) * 2.0;
  c += texture(u_src, v_uv + d).rgb + texture(u_src, v_uv - d).rgb;
  c += texture(u_src, v_uv + vec2(d.x, -d.y)).rgb + texture(u_src, v_uv - vec2(d.x, -d.y)).rgb;
  o = vec4(c * (u_weight / 16.0), 1.0);
}
`

// ---------------------------------------------------------------------------------- the picture

/**
 * Everything the overhead camera sees: the table, the steel plate and its bolt, the sand lit by
 * the room and by the LED, the exposure so far (screen-blended, as light adds on film), and the
 * funnel itself while it swings.
 */
export const COMPOSITE_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o;
uniform sampler2D u_light;
uniform sampler2D u_bloom;
uniform sampler2D u_sand;
uniform vec2 u_simTexel;
uniform float u_pixel;      // one output pixel, in plate units
uniform float u_extent;
uniform float u_exposure;
uniform float u_bloomGain;
uniform vec4 u_layers;      // light, sand, plate pattern, funnel
uniform vec2 u_funnel;
uniform vec3 u_led;         // the LED's colour × brightness right now
uniform vec3 u_mode;
uniform vec3 u_modeOld;
uniform float u_modeMix;
uniform float u_drive;
uniform float u_room;       // room light, 0..1
uniform float u_sandUnit;   // what one grain adds to the sand texture
uniform float u_grain;
uniform float u_time;
${MODE}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float sandHeight(vec2 uv) {
  return log(1.0 + texture(u_sand, uv).a / u_sandUnit * 0.8);
}

void main() {
  vec2 uv = v_uv;
  vec2 p = (uv * 2.0 - 1.0) * u_extent;
  float px = u_pixel;
  vec3 keyDir = normalize(vec3(-0.55, 0.62, 0.56));
  vec3 room = vec3(0.44, 0.42, 0.39) * u_room;

  // The LED, a hand's width above the plate, lights a pool around the funnel
  const float LED_H = 0.16;
  vec2 toLed2 = u_funnel - p;
  float ledR2 = dot(toLed2, toLed2);
  float pool = (LED_H * LED_H) / (ledR2 + LED_H * LED_H);
  vec3 ledDir = normalize(vec3(toLed2, LED_H));
  vec3 ledLight = u_led * pool * u_layers.w;

  // ---- the table: near black, a faint grain in the wood
  vec3 col = vec3(0.0032, 0.0034, 0.0042) * (0.8 + 0.4 * vnoise(p * vec2(6.0, 90.0)));
  col += ledLight * 0.006;

  // ---- the plate
  float d = sdRoundBox(p, vec2(1.0), 0.02);
  float shadow = sdRoundBox(p - vec2(0.018, -0.026), vec2(1.0), 0.06);
  col *= mix(1.0, 0.3, 1.0 - smoothstep(-0.03, 0.07, shadow));
  float inside = 1.0 - smoothstep(-px, px, d);

  float streak = vnoise(vec2(p.x * 2.5, p.y * 700.0)) * 0.55 + vnoise(vec2(p.x * 9.0, p.y * 2100.0)) * 0.45;
  vec2 sheenAt = p - vec2(-0.42, 0.5);
  float sheen = exp(-dot(sheenAt, sheenAt) * 0.75);
  vec3 steel = vec3(0.016, 0.017, 0.020) * (0.7 + 0.6 * streak) + vec3(0.034, 0.036, 0.041) * sheen;
  // Brushed steel throws the LED back as a soft streak along the brushing
  vec2 glare = (p - u_funnel) * vec2(0.55, 2.4);
  steel += u_led * u_layers.w * 0.05 * exp(-dot(glare, glare) * 22.0) * (0.6 + 0.8 * streak);
  steel += ledLight * 0.03;

  // The bevel catches the light on the top and left edges and falls away on the others
  vec2 ap = abs(p);
  vec2 edgeN = ap.x > ap.y ? vec2(sign(p.x), 0.0) : vec2(0.0, sign(p.y));
  float bevel = 1.0 - smoothstep(0.0, 0.014, -d);
  steel += vec3(0.11, 0.115, 0.12) * bevel * max(dot(edgeN, normalize(vec2(-1.0, 1.0))), 0.0) * u_room;
  steel *= 1.0 - 0.5 * bevel * max(dot(edgeN, normalize(vec2(1.0, -1.0))), 0.0);

  // The bolt that holds the plate to the driver, at the centre (always on a still line)
  float rb = length(p);
  float bolt = 1.0 - smoothstep(0.034 - px, 0.034 + px, rb);
  vec3 boltCol = vec3(0.025) + vec3(0.09) * smoothstep(0.022, 0.034, rb) * max(dot(normalize(p + 1e-5), vec2(-0.7, 0.7)), 0.0);
  boltCol += vec3(0.05) * (1.0 - smoothstep(0.0, 0.012, abs(rb - 0.016))) * u_room;
  steel = mix(steel, boltCol, bolt);

  col = mix(col, steel, inside);

  // ---- the plate's pattern, if asked for: where it is still, and how hard it shakes elsewhere
  if (u_layers.z > 0.0) {
    float u = mix(shape(p, u_modeOld), shape(p, u_mode), u_modeMix);
    float w = max(fwidth(u), 1e-5);
    float line = 1.0 - smoothstep(0.4 * w, 1.6 * w, abs(u));
    vec3 tint = mix(vec3(0.18, 0.36, 1.0), vec3(0.85, 0.25, 0.75), step(0.0, u));
    col += inside * u_layers.z * (tint * abs(u) * (0.02 + 0.05 * u_drive) + vec3(0.55, 0.85, 1.0) * line * 0.22);
  }

  // ---- the sand
  vec4 s = texture(u_sand, uv);
  if (s.a > 0.001 && u_layers.y > 0.0) {
    vec2 e = u_simTexel * 1.25;
    float hL = sandHeight(uv - vec2(e.x, 0.0));
    float hR = sandHeight(uv + vec2(e.x, 0.0));
    float hD = sandHeight(uv - vec2(0.0, e.y));
    float hU = sandHeight(uv + vec2(0.0, e.y));
    vec3 n = normalize(vec3((hL - hR) * 1.6, (hD - hU) * 1.6, 1.0));
    vec3 albedo = s.rgb / s.a;
    float grains = s.a / u_sandUnit;
    float cover = 1.0 - exp(-grains * 1.4);
    vec3 lit = vec3(0.02) + room * max(dot(n, keyDir), 0.0) + u_led * u_layers.w * pool * max(dot(n, ledDir), 0.0) * 1.15;
    vec3 sandCol = albedo * lit;
    // A few grains catch the light just so and sparkle
    float glint = step(0.986, hash12(floor(uv / u_simTexel))) * smoothstep(0.4, 1.4, grains);
    sandCol += glint * (room * 0.9 + u_led * u_layers.w * pool * 1.6) * max(n.z, 0.0);
    col = mix(col, sandCol, cover * u_layers.y * inside);
  }

  // ---- the exposure: light adds on film, so it is screen-blended over everything
  if (u_layers.x > 0.0) {
    vec3 L = texture(u_light, uv).rgb + texture(u_bloom, uv).rgb * u_bloomGain;
    vec3 film = 1.0 - exp(-L * u_exposure);
    col = 1.0 - (1.0 - col) * (1.0 - film * u_layers.x);
  }

  // ---- the funnel, seen from above, and the LED on its hanger
  if (u_layers.w > 0.0) {
    vec2 q = p - u_funnel;
    float r = length(q);
    const float RIM = 0.05;
    float sh2 = length(q - vec2(0.02, -0.028));
    col *= 1.0 - 0.45 * (1.0 - smoothstep(RIM * 0.7, RIM * 1.5, sh2)) * u_layers.w;
    float disc = 1.0 - smoothstep(RIM - px, RIM + px, r);
    float lip = smoothstep(RIM - 0.012, RIM - 0.002, r);
    vec2 qn = q / max(r, 1e-5);
    vec3 funnel = vec3(0.010) + vec3(0.08, 0.082, 0.09) * lip * (0.35 + 0.65 * max(dot(qn, vec2(-0.7, 0.7)), 0.0)) * u_room;
    // Sand inside the funnel's mouth, lit by the LED from just above
    float mouth = 1.0 - smoothstep(0.026, 0.034, r);
    funnel = mix(funnel, vec3(0.30, 0.26, 0.20) * (0.08 * u_room + u_led * 0.05), mouth * 0.8);
    col = mix(col, funnel, disc * u_layers.w);
    float core = exp(-r * r / (2.0 * 0.0042 * 0.0042));
    float halo = exp(-r / 0.03);
    col += u_layers.w * (u_led * (halo * 0.22 + core * 2.4) + vec3(core * 0.9));
  }

  // ---- lens: a soft vignette, then a little grain
  float vig = 1.0 - smoothstep(0.75, 1.75, length(p * vec2(1.0, 1.04)));
  col *= mix(0.62, 1.0, vig);
  vec3 outc = pow(max(col, 0.0), vec3(1.0 / 2.2));
  outc += (hash12(gl_FragCoord.xy + fract(u_time) * 517.0) - 0.5) * u_grain;
  o = vec4(outc, 1.0);
}
`
