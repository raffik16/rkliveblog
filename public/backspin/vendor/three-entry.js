// The parts of three.js the game uses, bundled into vendor/three.js with esbuild:
//
//   npx esbuild public/backspin/vendor/three-entry.js --bundle --minify --format=esm \
//     --outfile=public/backspin/vendor/three.js
//
// three.js is MIT licensed (its notice is kept in vendor/three.js). Only this file imports from
// node_modules; the game itself has no build step and loads vendor/three.js. Naming the parts
// (rather than exporting everything) lets esbuild leave the rest of three.js out.
export {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  FogExp2,
  FrontSide,
  Group,
  HalfFloatType,
  InstancedBufferAttribute,
  InstancedMesh,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  RingGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'
export { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
export { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
export { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
export { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
export { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js'
