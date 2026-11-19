// The whole dream is one fragment shader over the window. There are no models and no textures:
// the sky, the hills, the sea, the house, the grass and everything in the air are worked out per
// pixel from a few dozen numbers (see world.ts), so a chapter can change any of them and the
// picture follows smoothly.
//
// Screen space runs from -1 (bottom) to 1 (top), and as far left and right as the window's
// shape allows. The people of a life are lights in the same space (lights.ts).

export const MAX_LIGHTS = 24

export const VERTEX = /* glsl */ `#version 300 es
void main() {
  // one triangle that covers the screen, with no vertex buffer
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;    // real seconds
uniform float uFlow;    // dream seconds: slows down while you hold on
uniform vec2 uGaze;     // where you are looking, -1..1
uniform float uTravel;  // how far the dream has drifted past

uniform vec3 uSkyTop;
uniform vec3 uSkyHor;
uniform vec3 uSunCol;
uniform vec3 uFog;
uniform vec3 uLandFar;
uniform vec3 uLandNear;
uniform vec3 uSeaCol;
uniform vec3 uCloudCol;
uniform vec4 uSun;      // x, y, disc size, glow
uniform float uHorizon;

uniform float uMoon;
uniform float uStars;
uniform float uClouds;
uniform float uHills;
uniform float uCity;
uniform float uCityNear;
uniform float uWindows;
uniform float uWater;
uniform float uHouse;
uniform float uGrass;
uniform float uSeeds;
uniform float uFlies;
uniform float uRain;
uniform float uSnow;
uniform float uLeaves;

uniform float uWarp;
uniform float uVig;
uniform float uExpo;
uniform float uGrain;

uniform float uScene;   // how much of the dream covers the page under it
uniform float uWhite;   // waking: everything goes white
uniform float uDark;
uniform float uPhos;    // eyes shut: the colours you see in the dark
uniform float uLid;     // eyelids, 0 open .. 1 shut
uniform float uShake;
uniform vec2 uYou;

uniform int uNL;
uniform vec4 uL[${MAX_LIGHTS}];   // x, y, radius, brightness
uniform vec3 uLC[${MAX_LIGHTS}];

out vec4 outColor;

float px;               // one pixel in screen units

// smoothstep that also runs backwards (GLSL leaves edge0 > edge1 undefined)
float sstep(float a, float b, float x) {
  float t = clamp((x - a) / (b - a), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise1(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(hash11(i), hash11(i + 1.0), f * f * (3.0 - 2.0 * f));
}

float fbm1(float x) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise1(x);
    x = x * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm2(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise2(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// ------------------------------------------------------------------------------------ the sky

vec3 skyColour(vec2 p, float h) {
  float t = clamp((p.y - h) / (1.3 - h), 0.0, 1.0);
  vec3 c = mix(uSkyHor, uSkyTop, sstep(0.0, 1.0, pow(t, 0.8)));
  // a band of haze along the horizon
  return mix(c, uFog, 0.45 * exp(-max(p.y - h, 0.0) * 7.0));
}

vec3 sunLight(vec2 p) {
  vec2 sp = uSun.xy - uGaze * vec2(0.05, 0.03);
  float d = length(p - sp);
  vec3 c = uSunCol * uSun.w * (0.22 * exp(-d * 1.6) + 0.5 * exp(-d * 6.0) + 0.35 * exp(-d * 18.0));
  if (uSun.z > 0.0) c += (uSunCol * 1.2 + 0.25) * (1.0 - sstep(uSun.z * 0.9, uSun.z, d));
  return c;
}

float stars(vec2 p) {
  float s = 0.0;
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float sc = 34.0 + fi * 30.0;
    vec2 g = (p + uGaze * (0.01 + fi * 0.01)) * sc;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float r = hash12(id + fi * 31.0);
    if (r > 0.86) {
      vec2 o = (hash22(id + 7.0) - 0.5) * 0.6;
      float d = length(f - o);
      float twinkle = 0.6 + 0.4 * sin(uTime * (0.7 + r * 2.5) + r * 60.0);
      s += (1.0 - sstep(0.0, 0.16, d)) * twinkle * (0.35 + 0.65 * hash11(r * 97.0)) * (1.0 - fi * 0.35);
    }
  }
  return s;
}

vec3 moon(vec2 p) {
  vec2 mp = vec2(-0.55 * min(uRes.x / uRes.y, 1.8), 0.6) - uGaze * vec2(0.04, 0.03);
  float d = length(p - mp);
  float disc = 1.0 - sstep(0.068, 0.068 + 2.0 * px, d);
  float cut = 1.0 - sstep(0.064, 0.072, length(p - mp - vec2(0.032, 0.016)));
  return vec3(1.0, 0.96, 0.86) * disc * (1.0 - cut) * 0.95
    + vec3(0.55, 0.6, 0.95) * 0.12 * exp(-d * 5.0);
}

float clouds(vec2 p, bool cheap) {
  vec2 q = vec2(p.x * 0.5 + uTravel * 0.05 + uFlow * 0.008, p.y * 1.7 - 0.3);
  if (!cheap) {
    // pushed around by noise of its own, which is what makes them drift like breath
    vec2 w = vec2(fbm2(q * 1.4 + vec2(0.0, uFlow * 0.015)), fbm2(q * 1.4 + vec2(5.2, 1.3)));
    q += (w - 0.5) * 0.9;
  }
  return sstep(0.5, 0.8, fbm2(q * 1.5));
}

vec3 farCity(vec2 p, float h, vec3 col) {
  float x = p.x + (uTravel + uGaze.x * 0.3) * 0.18;
  float sc = 16.0;
  float id = floor(x * sc);
  float r = hash11(id * 1.37 + 3.0);
  float tall = step(0.88, hash11(id * 2.11 + 9.0));
  float top = h + (0.012 + 0.06 * r * r + 0.05 * tall) * uCity;
  float inside = 1.0 - sstep(top - px, top + px, p.y);
  if (inside > 0.0 && p.y > h - 0.01) {
    vec3 b = mix(uFog, uLandFar, 0.55) * 0.8;
    vec2 wc = vec2(x * sc * 4.0, (p.y - h) * 160.0);
    vec2 wid = floor(wc);
    float lit = step(1.0 - uWindows * 0.55, hash12(wid + id * 3.1));
    float shape = step(0.35, fract(wc.x)) * step(0.45, fract(wc.y));
    b += vec3(1.0, 0.78, 0.48) * lit * shape * 0.9;
    col = mix(col, b, inside);
  }
  // the glow a city throws up into the night
  col += vec3(1.0, 0.62, 0.42) * 0.1 * uCity * uWindows * exp(-max(p.y - h, 0.0) * 9.0);
  return col;
}

vec3 hills(vec2 p, float h, vec3 col) {
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float x = p.x + (uTravel + uGaze.x * 0.35) * (0.1 + fi * 0.2);
    float amp = (0.06 + fi * 0.05) * uHills;
    float ridge = h - 0.012 + amp * (fbm1(x * (0.9 + fi * 0.6) + fi * 31.7) * 1.6 - 0.35);
    float a = 1.0 - sstep(ridge - px, ridge + px, p.y);
    if (a > 0.0) {
      vec3 c = mix(uLandFar, uLandNear, fi * 0.28);
      c = mix(uFog, c, 0.3 + fi * 0.22);
      // the sun catches the top edge
      c += uSunCol * uSun.w * 0.12 * exp(-(ridge - p.y) * 45.0) * (1.0 - fi * 0.3);
      col = mix(col, c, a);
    }
  }
  return col;
}

// Everything above the horizon. The sea draws it again, upside down, as its reflection
// (cheap: without stars and with plainer clouds).
vec3 upper(vec2 p, float h, bool cheap) {
  vec3 col = skyColour(p, h);
  if (uStars > 0.001 && !cheap) {
    col += vec3(0.9, 0.92, 1.0) * stars(p) * uStars * sstep(h, h + 0.35, p.y);
  }
  if (uMoon > 0.001) col += moon(p) * uMoon;
  col += sunLight(p);
  if (uClouds > 0.001) {
    float c = clouds(p, cheap) * uClouds * sstep(h - 0.02, h + 0.25, p.y);
    vec3 cc = uCloudCol * (0.78 + 0.45 * exp(-length(p - uSun.xy) * 1.4) * uSun.w);
    col = mix(col, cc, c * 0.85);
  }
  if (uCity > 0.001) col = farCity(p, h, col);
  if (uHills > 0.001) col = hills(p, h, col);
  return col;
}

// ---------------------------------------------------------------------------------- the ground

vec3 nearCity(vec2 p, float h, vec3 col) {
  float x = p.x + (uTravel + uGaze.x * 0.3) * 0.6;
  float sc = 3.2;
  float id = floor(x * sc);
  float fx = fract(x * sc);
  float r = hash11(id * 4.7 + 1.0);
  float top = h + (0.1 + 0.55 * r * r) * uCityNear;
  float gap = step(0.06, fx) * step(fx, 0.94);
  float inside = (1.0 - sstep(top - px, top + px, p.y)) * gap * step(h - 0.04, p.y);
  if (inside > 0.0) {
    vec3 b = mix(uLandNear, uFog, 0.18);
    vec2 wc = vec2(fx * 7.0, (p.y - h) * 34.0);
    vec2 wid = floor(wc);
    float lit = step(1.0 - uWindows * 0.7, hash12(wid + id * 13.0));
    float shape = step(0.3, fract(wc.x)) * step(fract(wc.x), 0.8)
      * step(0.35, fract(wc.y)) * step(fract(wc.y), 0.85);
    vec3 wcol = mix(vec3(1.0, 0.8, 0.5), vec3(0.6, 0.85, 1.0), step(0.7, hash12(wid + 3.0)));
    b += wcol * lit * shape * 0.85;
    col = mix(col, b, inside);
  }
  return col;
}

vec3 meadow(vec2 p, float h) {
  float gz = h - p.y;
  float z = 0.4 / (gz + 0.03);
  vec2 gp = vec2(p.x * z + uTravel * 3.0, z);
  float n = fbm2(gp * vec2(1.2, 0.5));
  vec3 g = mix(uLandFar, uLandNear, sstep(0.0, 0.6, gz));
  g *= 0.82 + 0.36 * n;
  g += uSunCol * uSun.w * 0.06 * exp(-gz * 5.0);
  return mix(uFog, g, sstep(0.0, 0.22, gz));
}

vec3 sea(vec2 p, float h) {
  float gz = max(h - p.y, 0.0005);
  float z = 0.35 / (gz + 0.02);
  vec2 wp = vec2(p.x * z * 1.4, z * 2.0 + uFlow * 0.4);
  float waves = fbm2(wp + vec2(uFlow * 0.1, 0.0)) * 0.7 + noise2(wp * 3.0 - vec2(0.0, uFlow * 0.8)) * 0.3;
  // the sky, upside down and broken up by the waves
  vec2 rp = vec2(p.x + (waves - 0.5) * 0.06 * sstep(0.0, 0.6, gz), 2.0 * h - p.y + (waves - 0.5) * 0.02);
  vec3 refl = upper(rp, h, true);
  if (uCityNear > 0.001) refl = nearCity(rp, h, refl);
  float fresnel = mix(0.92, 0.35, sstep(0.0, 0.7, gz));
  vec3 c = mix(uSeaCol * (0.75 + 0.5 * waves), refl, fresnel);
  // the path of light the sun lays on the water
  float sx = uSun.x - uGaze.x * 0.05;
  float above = sstep(h - 0.12, h + 0.05, uSun.y);
  float path = exp(-abs(p.x - sx) * (3.0 + 2.0 / (gz + 0.05)) * 0.6);
  float glint = step(0.8, hash12(floor(vec2(p.x * 140.0, z * 9.0 + uFlow * 3.0))));
  c += uSunCol * uSun.w * above * path * (0.25 + glint * 1.4) * sstep(0.0, 0.02, gz);
  return mix(uFog, c, 0.3 + 0.7 * sstep(0.0, 0.05, gz));
}

vec3 ground(vec2 p, float h) {
  vec3 g = vec3(0.0);
  if (uWater < 0.999) g = meadow(p, h);
  if (uWater > 0.001) g = mix(g, sea(p, h), uWater);
  return g;
}

float box(vec2 q, vec2 b) {
  vec2 d = abs(q) - b;
  float sd = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  return 1.0 - sstep(-px, px, sd);
}

// A house on a bank above the water, with one window lit
vec3 house(vec2 p, float h, vec3 col) {
  float aspect = uRes.x / uRes.y;
  float hx = min(aspect * 0.5, aspect - 0.3) - uGaze.x * 0.16;
  float base = h + 0.026;
  // the bank: level under the house, falling away to the left down to the bottom of the screen
  float bank = base - 2.2 * pow(max(hx - 0.16 - p.x, 0.0), 2.0) + 0.006 * sin(p.x * 23.0);
  float onBank = (1.0 - sstep(bank - px, bank + px, p.y)) * uHouse;
  vec3 land = mix(uLandNear, uFog, 0.12) * (0.82 + 0.18 * noise2(p * 18.0));
  // (clamped: far above the bank this would overflow, and infinity times nothing is NaN, which
  // draws black)
  land += uSunCol * uSun.w * 0.1 * exp(-max(bank - p.y, 0.0) * 60.0);
  col = mix(col, land, onBank);

  vec2 q = p - vec2(hx, base);
  float body = box(q - vec2(0.0, 0.032), vec2(0.05, 0.032));
  float apex = 0.108;
  float slope = abs(q.x) - 0.062 * (apex - q.y) / (apex - 0.064);
  float roof = (1.0 - sstep(-px, px, slope)) * step(0.062, q.y) * (1.0 - sstep(apex - px, apex + px, q.y));
  float chimney = box(q - vec2(0.03, 0.092), vec2(0.007, 0.016));
  float shape = max(max(body, roof), chimney) * uHouse;
  vec3 wall = mix(uLandNear, uFog, 0.06) * 0.5;
  col = mix(col, wall, shape);
  float win = box(q - vec2(-0.02, 0.036), vec2(0.011, 0.012));
  float door = box(q - vec2(0.022, 0.018), vec2(0.009, 0.018));
  vec3 warm = vec3(1.0, 0.76, 0.42);
  col = mix(col, warm * (0.35 + uWindows), max(win, door * 0.6) * uHouse * (0.25 + 0.75 * uWindows));
  // the glow of the window out into the evening
  col += warm * 0.18 * uWindows * uHouse * exp(-length(q - vec2(-0.02, 0.036)) * 22.0);
  return col;
}

// ------------------------------------------------------------------------------- the foreground

float blades(vec2 p, float sc, float hmax, float offset, float seed) {
  float x = p.x * sc + offset;
  float id = floor(x);
  float f = fract(x) - 0.5;
  float r = hash11(id * 3.71 + seed);
  float tall = hmax * (0.35 + 0.65 * r);
  float y = (p.y + 1.0) / tall;
  if (y > 1.0) return 0.0;
  // blades near your light lean away from it
  float bx = (id + 0.5 - offset) / sc;
  float lean = clamp((bx - uYou.x) * 4.0, -1.0, 1.0) * exp(-abs(bx - uYou.x) * 5.0)
    * exp(-max(uYou.y + 1.0 - tall, 0.0) * 3.0) * 0.3;
  float sway = clamp((sin(uFlow * (0.9 + r * 0.6) + id * 0.7) * 0.16 + lean) * y * y, -0.32, 0.32);
  float width = 0.22 * (1.0 - y) + 0.02;
  return 1.0 - sstep(-0.05, 0.05, abs(f - sway) - width);
}

vec3 grass(vec2 p, vec3 col) {
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float sc = 34.0 - fi * 14.0;
    float a = blades(p, sc, (0.32 + fi * 0.24) * uGrass, uTravel * (0.9 + fi * 0.7) * sc, fi * 17.0);
    if (a > 0.0) {
      vec3 g = mix(uLandNear * 0.6, uLandNear * 0.32, fi) + uSunCol * uSun.w * 0.05 * (1.0 - fi);
      col = mix(col, g, a);
    }
  }
  return col;
}

vec3 seeds(vec2 p, vec3 col) {
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float sc = 4.0 + fi * 3.0;
    vec2 drift = vec2(uFlow * (0.05 + fi * 0.03) + uTravel * (0.3 + fi * 0.3), -uFlow * (0.03 + fi * 0.02));
    vec2 q = (p + drift) * sc;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float r = hash12(id + fi * 19.0);
    if (r < 0.55) continue;
    vec2 o = (hash22(id + 3.0) - 0.5) * 0.4
      + 0.1 * vec2(sin(uFlow * 0.8 + r * 20.0), cos(uFlow * 0.6 + r * 13.0));
    // blown away from your light
    vec2 away = (id + 0.5 + o) / sc - drift - uYou;
    o += normalize(away + 1e-4) * min(0.28, 0.02 / (length(away) + 0.04));
    float d = length(f - o);
    float size = 0.05 + 0.03 * fi;
    float s = (1.0 - sstep(size * 0.3, size, d)) * 0.7 + exp(-d / size * 1.5) * 0.18;
    col += vec3(1.0, 0.97, 0.9) * s * uSeeds * (0.55 + 0.45 * fi);
  }
  return col;
}

vec3 fireflies(vec2 p, vec3 col) {
  vec2 q = (p + vec2(uTravel * 0.5, 0.0)) * 3.0;
  vec2 id = floor(q);
  vec2 f = fract(q) - 0.5;
  float r = hash12(id + 5.0);
  if (r > 0.3) {
    vec2 o = 0.28 * vec2(sin(uFlow * (0.3 + r) + r * 40.0), cos(uFlow * (0.25 + r * 0.7) + r * 17.0));
    float d = length(f - o);
    float blink = pow(max(0.0, sin(uTime * (0.8 + r * 1.2) + r * 50.0)), 4.0);
    float low = 1.0 - sstep(-0.2, 0.45, p.y);
    col += vec3(0.85, 1.0, 0.45) * (exp(-d * d * 900.0) * 1.3 + exp(-d * 9.0) * 0.12) * blink * uFlies * low;
  }
  return col;
}

vec3 rain(vec2 p, vec3 col) {
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float sc = 26.0 + fi * 22.0;
    vec2 q = vec2(p.x * sc + p.y * sc * 0.18, p.y * (1.5 + fi) + uFlow * (5.0 + fi * 2.5));
    float id = floor(q.x);
    float r = hash11(id * 1.7 + fi * 13.0);
    if (r < 0.45) continue;
    float y = fract(q.y + r * 7.31);
    float streak = sstep(0.0, 0.02, y) * (1.0 - sstep(0.02, 0.16 + 0.1 * r, y));
    float line = 1.0 - sstep(0.04, 0.14, abs(fract(q.x) - 0.5));
    col += vec3(0.72, 0.82, 1.0) * streak * line * uRain * (0.22 + 0.12 * fi);
  }
  return col;
}

vec3 snow(vec2 p, vec3 col) {
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sc = 9.0 - fi * 2.5;
    vec2 q = (p + vec2(sin(uFlow * 0.3 + fi) * 0.05 + uTravel * (0.2 + fi * 0.3), uFlow * (0.06 + fi * 0.05))) * sc;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float r = hash12(id + fi * 7.0);
    if (r < 0.35) continue;
    vec2 o = (hash22(id) - 0.5) * 0.6 + vec2(sin(uFlow * 0.7 + r * 30.0) * 0.12, 0.0);
    float size = 0.04 + fi * 0.025;
    col += vec3(1.0) * (1.0 - sstep(size * 0.4, size, length(f - o))) * uSnow * (0.4 + fi * 0.25);
  }
  return col;
}

vec3 leaves(vec2 p, vec3 col) {
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    float sc = 4.5 + fi * 2.5;
    vec2 q = (p + vec2(-uFlow * (0.12 + fi * 0.06), uFlow * (0.09 + fi * 0.05))) * sc;
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float r = hash12(id + fi * 23.0);
    if (r < 0.6) continue;
    vec2 o = (hash22(id + 11.0) - 0.5) * 0.4 + vec2(sin(uFlow * 1.3 + r * 40.0) * 0.12, 0.0);
    float ang = uFlow * (1.5 + r * 2.0) + r * 6.28;
    vec2 d = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * (f - o);
    d.x *= 0.45 + 0.4 * abs(sin(ang * 0.7));
    float a = 1.0 - sstep(0.05, 0.075, length(d * vec2(1.0, 2.2)));
    vec3 lc = mix(vec3(0.95, 0.45, 0.15), vec3(0.85, 0.2, 0.12), hash11(r * 31.0));
    col = mix(col, lc * (0.7 + 0.3 * fi), a * uLeaves);
  }
  return col;
}

// ---------------------------------------------------------------------------------- the people

vec3 people(vec2 p, float h) {
  vec3 acc = vec3(0.0);
  bool water = uWater > 0.001 && p.y < h;
  for (int i = 0; i < ${MAX_LIGHTS}; i++) {
    if (i >= uNL) break;
    vec4 L = uL[i];
    vec2 d = p - L.xy;
    float d2 = dot(d, d);
    float r2 = L.z * L.z;
    float glow = exp(-d2 / (r2 * 0.12)) * 1.6 + r2 / (d2 + r2 * 0.6) * 0.5 + exp(-sqrt(d2) / (L.z * 5.0)) * 0.1;
    acc += uLC[i] * L.w * glow;
    if (water) {
      // each light hangs a little above the water and shivers in it
      vec2 rd = (p - vec2(L.x + sin(p.y * 110.0 + uTime * 2.3) * 0.006, L.y - 0.16)) * vec2(1.0, 0.32);
      acc += uLC[i] * L.w * uWater * 0.22 * r2 / (dot(rd, rd) + r2 * 0.8);
    }
  }
  return acc;
}

// What you see with your eyes shut: slow, dim colours drifting in the dark
vec3 phosphenes(vec2 p) {
  float t = uTime * 0.06;
  vec3 c = vec3(0.01, 0.006, 0.016);
  c += vec3(0.09, 0.02, 0.11) * sstep(0.5, 0.85, fbm2(p * 1.1 + vec2(t, -t * 0.6)));
  c += vec3(0.015, 0.075, 0.07) * sstep(0.55, 0.9, fbm2(p * 1.7 + vec2(-t * 0.5, t * 0.4) + 7.3));
  c += vec3(0.05, 0.03, 0.006) * sstep(0.6, 0.9, fbm2(p * 0.8 + vec2(t * 0.3, t * 0.2) + 3.1));
  return c;
}

void main() {
  px = 2.0 / uRes.y;
  vec2 frag = gl_FragCoord.xy;
  vec2 p0 = (2.0 * frag - uRes) / uRes.y;
  vec2 p = p0;
  if (uShake > 0.0) p += uShake * 0.012 * vec2(sin(uTime * 41.0), cos(uTime * 33.0));
  if (uWarp > 0.0) p += uWarp * 0.018 * vec2(sin(p.y * 3.1 + uTime * 0.7), sin(p.x * 2.3 + uTime * 0.55));
  float h = uHorizon - uGaze.y * 0.06;

  vec3 col = vec3(0.0);
  if (uPhos < 0.999) {
    col = p.y >= h ? upper(p, h, false) : ground(p, h);
    if (uCityNear > 0.001) col = nearCity(p, h, col);
    if (uHouse > 0.001) col = house(p, h, col);
    if (uGrass > 0.001) col = grass(p, col);
    if (uSeeds > 0.001) col = seeds(p, col);
    if (uLeaves > 0.001) col = leaves(p, col);
    if (uSnow > 0.001) col = snow(p, col);
    if (uRain > 0.001) col = rain(p, col);
    if (uFlies > 0.001) col = fireflies(p, col);
  }
  col += people(p, h);
  if (uPhos > 0.001) col = mix(col, phosphenes(p0), uPhos);

  // soft highlights, a dark edge, a little grain
  col = 1.0 - exp(-max(col, 0.0) * 1.6 * uExpo);
  col *= 1.0 - uVig * 0.8 * sstep(0.6, 1.5, length(p0 * vec2(0.6, 0.92)));
  col += (hash12(frag + fract(uTime * 13.7) * 371.0) - 0.5) * uGrain;
  col = mix(col, vec3(1.0, 0.985, 0.955), uWhite);
  col = clamp(col * (1.0 - uDark), 0.0, 1.0);

  // The dream over the page under it (premultiplied), then the eyelids over both
  vec4 o = vec4(col * uScene, uScene);
  if (uLid > 0.0) {
    float open = 1.0 - uLid;
    // shut, the two lids overlap a little so no line of light shows between them
    float yTop = open * 1.18 + open * 0.22 * p0.x * p0.x - uLid * 0.05;
    float yBot = -open * 1.12 - open * 0.1 * p0.x * p0.x + uLid * 0.05;
    float soft = 0.025 + 0.04 * open;
    float lid = max(sstep(yTop - soft, yTop + soft, p0.y), 1.0 - sstep(yBot - soft, yBot + soft, p0.y));
    float shade = max(exp(-max(yTop - p0.y, 0.0) * 10.0), exp(-max(p0.y - yBot, 0.0) * 10.0))
      * 0.55 * sstep(0.0, 0.3, uLid);
    o = vec4(o.rgb * (1.0 - shade), o.a + (1.0 - o.a) * shade);
    o = mix(o, vec4(vec3(0.018, 0.006, 0.01) + vec3(0.06, 0.012, 0.016) * uLid, 1.0), lid);
  }
  outColor = o;
}
`
