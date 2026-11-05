/**
 * The Sweet Bee honey jar in three.js — imperative, framework-free, so every
 * GPU resource is created and disposed in one place.
 *
 *  - Glass: fresnel shader with camera-fixed specular streaks.
 *  - Honey: a shader-cut volume whose surface is a WORLD-space plane, so it
 *    stays level when the jar tilts and sloshes on a spring driven by the
 *    jar's motion (cursor, device tilt, drag, scroll spin).
 *  - Pour (hero): a vertex-displaced ribbon of honey falling into the open
 *    jar, bending toward the cursor, with ripples where it lands.
 *  - Label: a CanvasTexture drawn with the site's real fonts.
 *  - Specks: points just inside the glass (vanilla, cinnamon, pollen, salt,
 *    or rising bubbles), hidden above the honey line.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { SpeckKind } from "@/lib/catalog";
import { makeQrPath } from "@/components/jar/jar-art";

export interface JarLook {
  number: string;
  name: string;
  descriptor: string;
  labelColor: string;
  labelText: string;
  honey: string;
  honeyDark: string;
  specks: SpeckKind;
}

export interface SceneInput {
  /** -1..1 pointer position relative to the jar's box (or window). */
  pointer: { x: number; y: number; active: boolean };
  /** -1..1 device tilt (phones). */
  tilt: { x: number; y: number; active: boolean };
  /** Extra Y rotation in radians (scroll-linked spin or drag). */
  spin: number;
  /** Agitation impulse added by the host (e.g. a fast drag). */
  shake: number;
}

export interface JarScene {
  setLook(look: JarLook): void;
  setSize(w: number, h: number): void;
  start(): void;
  stop(): void;
  dispose(): void;
}

const R = 0.56;
const BODY_BOTTOM = -1.55;
const BODY_TOP = 1.5;
const HONEY_R = R - 0.035;
const FILL = 1.12;
const LABEL_H = 1.36;
const LABEL_Y = -0.02;

const glassVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const glassFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
    float s1 = smoothstep(0.09, 0.0, abs(vN.x + 0.62));
    float s2 = smoothstep(0.035, 0.0, abs(vN.x - 0.8));
    float a = (0.05 + f * 0.6 + s1 * 0.55 + s2 * 0.45) * uOpacity;
    gl_FragColor = vec4(vec3(1.0, 0.99, 0.96), a);
  }
`;

const honeyVert = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vN;
  varying vec3 vV;
  varying float vY;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vY = position.y;
    vec4 mv = viewMatrix * w;
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const SURFACE_GLSL = /* glsl */ `
  uniform vec3 uCenter;
  uniform float uLevel;
  uniform vec2 uSlosh;
  uniform float uAgit;
  uniform float uTime;
  uniform float uPour;
  float surfaceAt(vec3 p) {
    vec2 d = p.xz - uCenter.xz;
    float h = uCenter.y + uLevel + dot(d, uSlosh);
    h += sin(p.x * 7.0 + uTime * 2.3) * 0.018 * uAgit + sin(p.z * 8.0 - uTime * 1.9) * 0.014 * uAgit;
    float r = length(d);
    h += uPour * 0.012 * sin(r * 34.0 - uTime * 7.0) * smoothstep(0.5, 0.0, r);
    return h;
  }
`;
const honeyFrag = /* glsl */ `
  uniform vec3 uHoney;
  uniform vec3 uDark;
  uniform vec3 uLight;
  ${SURFACE_GLSL}
  varying vec3 vWorld;
  varying vec3 vN;
  varying vec3 vV;
  varying float vY;
  void main() {
    float s = surfaceAt(vWorld);
    if (vWorld.y > s) discard;
    if (!gl_FrontFacing) {
      // Seen through the cut: this back face reads as the liquid's top.
      vec2 d = vWorld.xz - uCenter.xz;
      float r = length(d);
      float ring = 0.5 + 0.5 * sin(r * 34.0 - uTime * 7.0);
      vec3 top = mix(uHoney, uLight, 0.45 + 0.25 * ring * uPour);
      top = mix(top, uDark, smoothstep(0.35, 0.56, r) * 0.55);
      gl_FragColor = linearToOutputTexel(vec4(top, 1.0));
      return;
    }
    vec3 n = normalize(vN);
    float facing = clamp(dot(n, normalize(vV)), 0.0, 1.0);
    float depth = smoothstep(${BODY_BOTTOM.toFixed(2)}, ${(BODY_BOTTOM + FILL + 1.6).toFixed(2)}, vY);
    vec3 col = mix(uDark, uHoney, 0.5 + 0.5 * pow(facing, 0.7));
    col = mix(col * 0.88, col, depth);
    // backlit glow in the middle, warm rim at grazing angles
    col += uLight * pow(facing, 3.0) * 0.38;
    col = mix(col, uDark, pow(1.0 - facing, 3.0) * 0.5);
    float streak = smoothstep(0.08, 0.0, abs(n.x + 0.55));
    col += vec3(1.0, 0.96, 0.85) * streak * 0.35;
    // a bright meniscus line just under the surface
    col += uLight * smoothstep(0.03, 0.0, s - vWorld.y) * 0.45;
    gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
  }
`;

const pourVert = /* glsl */ `
  uniform float uTime;
  uniform vec2 uSway;
  uniform float uLen;
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 p = position;
    float t = (p.y + uLen * 0.5) / uLen; // 0 bottom .. 1 top
    float thin = mix(0.5, 1.25, pow(t, 0.7));
    float bulge = 1.0 + 0.2 * sin(t * 26.0 + uTime * 9.0);
    p.xz *= thin * bulge;
    float bend = sin(3.14159 * t) * (1.0 - t * 0.3);
    p.x += uSway.x * bend + sin(t * 5.0 + uTime * 1.7) * 0.035 * (1.0 - t);
    p.z += uSway.y * bend;
    vT = t;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const pourFrag = /* glsl */ `
  uniform vec3 uHoney;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform float uTime;
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float facing = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
    float bands = 0.5 + 0.5 * sin(vT * 60.0 + uTime * 14.0);
    vec3 col = mix(uDark, uHoney, 0.45 + 0.55 * facing);
    col += uLight * (pow(facing, 5.0) * 0.4 + bands * 0.08);
    float edge = smoothstep(0.0, 0.25, facing);
    if (edge < 0.02) discard;
    gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
  }
`;

const speckVert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uRise;
  uniform float uPixel;
  uniform float uIn;
  varying vec3 vWorld;
  varying float vSeed;
  void main() {
    vec3 p = position;
    if (uRise > 0.5) {
      float span = ${(FILL + 1.4).toFixed(2)};
      p.y = ${(BODY_BOTTOM + 0.1).toFixed(2)} + mod(p.y - ${(BODY_BOTTOM + 0.1).toFixed(2)} + uTime * (0.05 + aSeed * 0.08), span);
    } else {
      p.y += sin(uTime * 0.4 + aSeed * 40.0) * 0.03;
    }
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    vSeed = aSeed;
    vec4 mv = viewMatrix * w;
    gl_PointSize = aSize * uPixel * uIn * (8.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const speckFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uRound;
  ${SURFACE_GLSL}
  varying vec3 vWorld;
  varying float vSeed;
  void main() {
    if (vWorld.y > surfaceAt(vWorld) - 0.015) discard;
    vec2 c = gl_PointCoord - 0.5;
    // round grains (pollen, bubbles) or elongated flecks (vanilla, cinnamon, salt)
    float ang = vSeed * 6.2831;
    vec2 r = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * c;
    if (uRound < 0.5) r.y *= 2.6;
    float d = length(r);
    if (d > 0.5) discard;
    vec3 col = mix(uColorA, uColorB, step(0.5, fract(vSeed * 7.31)));
    gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
  }
`;

const SPECKS: Record<SpeckKind, { n: number; a: string; b: string; size: [number, number]; round: boolean; rise: boolean }> = {
  none: { n: 46, a: "#fff4c8", b: "#ffe9a6", size: [1.2, 3.2], round: true, rise: true },
  vanilla: { n: 520, a: "#1c0e06", b: "#2d1608", size: [0.9, 1.9], round: false, rise: false },
  cinnamon: { n: 380, a: "#60280a", b: "#823c12", size: [1.3, 2.8], round: false, rise: false },
  pollen: { n: 170, a: "#ffb224", b: "#ec8012", size: [3.2, 5.6], round: true, rise: false },
  salt: { n: 200, a: "#ffffff", b: "#f3efe6", size: [1.2, 2.6], round: false, rise: false },
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

/** Draws the wrap-around label (front · "Feel the hum." · small batch). */
function drawLabel(canvas: HTMLCanvasElement, look: JarLook) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d")!;
  const serif = fontVar("--font-heading", "Georgia, serif");
  const mono = fontVar("--font-body", "Courier New, monospace");
  const ink = look.labelText;
  ctx.fillStyle = look.labelColor;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const pw = W / 3;
  const s = H / 840;

  // Panel 1 — front
  const cx = pw / 2;
  ctx.font = `italic 400 ${70 * s}px ${serif}`;
  ctx.fillText("Sweet Bee", cx, 112 * s);
  ctx.font = `italic 500 ${120 * s}px ${serif}`;
  ctx.fillText(`No. ${look.number}`, cx, 236 * s);
  ctx.font = `600 ${44 * s}px ${serif}`;
  const name = look.name.toUpperCase().split("").join(" ");
  ctx.fillText(name, cx, 312 * s, pw * 0.9);
  ctx.fillRect(cx - 70 * s, 344 * s, 140 * s, 3 * s);
  ctx.font = `400 ${30 * s}px ${mono}`;
  ctx.fillText(look.descriptor, cx, 398 * s, pw * 0.9);
  ctx.font = `700 ${22 * s}px ${mono}`;
  ctx.fillText("S A N   D I E G O   C O U N T Y", cx, 440 * s);
  const qr = 200 * s;
  const qx = cx - qr / 2;
  const qy = 480 * s;
  ctx.fillStyle = "#f6eddd";
  ctx.fillRect(qx - 12 * s, qy - 12 * s, qr + 24 * s, qr + 24 * s);
  ctx.fillStyle = "#262626";
  ctx.save();
  ctx.translate(qx, qy);
  ctx.scale(qr / 26, qr / 26);
  ctx.fill(new Path2D(makeQrPath(look.number, 0, 0, 26)));
  ctx.restore();
  ctx.fillStyle = ink;
  ctx.font = `700 ${20 * s}px ${mono}`;
  ctx.fillText("SCAN FOR BATCH", cx, 760 * s);

  // Panel 2 — Feel the hum.
  const c2 = pw * 1.5;
  ctx.font = `italic 500 ${150 * s}px ${serif}`;
  ctx.fillText("Feel", c2, 250 * s);
  ctx.fillText("the", c2, 400 * s);
  ctx.fillText("hum.", c2, 550 * s);
  ctx.font = `700 ${24 * s}px ${mono}`;
  ctx.fillText("RAW · LOCAL · TRACEABLE", c2, 660 * s);

  // Panel 3 — small batch
  const c3 = pw * 2.5;
  ctx.font = `700 ${24 * s}px ${mono}`;
  ctx.fillText("RAW HONEY", c3, 150 * s);
  ctx.lineWidth = 5 * s;
  for (const [hx, hy] of [
    [-70, 0], [0, 0], [70, 0], [-35, 60], [35, 60], [-70, 120], [0, 120], [70, 120],
  ] as const) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      const x = c3 + hx * s + 38 * s * Math.cos(a);
      const y = 230 * s + hy * s + 38 * s * Math.sin(a);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.font = `italic 500 ${92 * s}px ${serif}`;
  ctx.fillText("Small batch", c3, 520 * s, pw * 0.92);
  ctx.font = `400 ${28 * s}px ${mono}`;
  ctx.fillText("Traceable to the hive", c3, 580 * s);
  ctx.font = `500 ${60 * s}px ${serif}`;
  ctx.fillText(`No. ${look.number}`, c3, 700 * s);
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(38,38,38,0.55)");
  grad.addColorStop(0.5, "rgba(38,38,38,0.2)");
  grad.addColorStop(1, "rgba(38,38,38,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function ridgeTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 4;
  const g = c.getContext("2d")!;
  for (let x = 0; x < 256; x += 4) {
    g.fillStyle = x % 8 ? "#fff" : "#000";
    g.fillRect(x, 0, 4, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(10, 1);
  return t;
}

export function createJarScene(
  canvas: HTMLCanvasElement,
  opts: {
    mode: "hero" | "product";
    look: JarLook;
    input: SceneInput;
    onFirstFrame: () => void;
    onContextLost: () => void;
  },
): JarScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mode === "hero" ? 1.75 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04).texture;
  scene.environment = env;
  room.dispose?.();

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
  const isHero = opts.mode === "hero";
  camera.position.set(0, isHero ? 2.2 : 1.1, isHero ? 12.6 : 9.4);
  camera.lookAt(0, isHero ? 0.45 : 0.05, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xfff3e0, 1.9);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff7ab8, 0.9);
  rim.position.set(4, 1, -3);
  scene.add(rim);

  const disposables: { dispose(): void }[] = [env, pmrem];
  const track = <T extends { dispose(): void }>(x: T) => {
    disposables.push(x);
    return x;
  };

  const jar = new THREE.Group();
  scene.add(jar);

  // ---------- honey ----------
  const honeyUniforms = {
    uHoney: { value: new THREE.Color() },
    uDark: { value: new THREE.Color() },
    uLight: { value: new THREE.Color() },
    uCenter: { value: new THREE.Vector3() },
    uLevel: { value: BODY_BOTTOM + FILL + 1.6 },
    uSlosh: { value: new THREE.Vector2() },
    uAgit: { value: 0.3 },
    uTime: { value: 0 },
    uPour: { value: isHero ? 1 : 0 },
  };
  const honeyProfile = [
    new THREE.Vector2(0, BODY_BOTTOM + 0.06),
    new THREE.Vector2(HONEY_R - 0.07, BODY_BOTTOM + 0.06),
    new THREE.Vector2(HONEY_R - 0.01, BODY_BOTTOM + 0.1),
    new THREE.Vector2(HONEY_R, BODY_BOTTOM + 0.18),
    new THREE.Vector2(HONEY_R, BODY_TOP - 0.06),
  ];
  const honeyGeo = track(new THREE.LatheGeometry(honeyProfile, 72));
  const honeyMat = track(
    new THREE.ShaderMaterial({ uniforms: honeyUniforms, vertexShader: honeyVert, fragmentShader: honeyFrag, side: THREE.DoubleSide }),
  );
  const honey = new THREE.Mesh(honeyGeo, honeyMat);
  jar.add(honey);

  // ---------- specks ----------
  let specks: THREE.Points | null = null;
  const speckUniforms = {
    ...honeyUniforms,
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
    uRound: { value: 1 },
    uRise: { value: 0 },
    uPixel: { value: renderer.getPixelRatio() },
    uIn: { value: 0 },
  };
  const speckMat = track(
    new THREE.ShaderMaterial({ uniforms: speckUniforms, vertexShader: speckVert, fragmentShader: speckFrag }),
  );

  // ---------- label ----------
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 2048;
  labelCanvas.height = Math.round((2048 * LABEL_H) / (Math.PI * 2 * R));
  const labelTex = track(new THREE.CanvasTexture(labelCanvas));
  labelTex.colorSpace = THREE.SRGBColorSpace;
  labelTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const labelMat = track(new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.62, metalness: 0, envMapIntensity: 0.5 }));
  const labelGeo = track(new THREE.CylinderGeometry(R + 0.006, R + 0.006, LABEL_H, 128, 1, true));
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.y = LABEL_Y;
  label.rotation.y = -Math.PI / 3;
  jar.add(label);

  // ---------- glass ----------
  const glassProfile = [
    new THREE.Vector2(0.0001, BODY_BOTTOM),
    new THREE.Vector2(R - 0.08, BODY_BOTTOM),
    new THREE.Vector2(R - 0.015, BODY_BOTTOM + 0.025),
    new THREE.Vector2(R, BODY_BOTTOM + 0.1),
    new THREE.Vector2(R, BODY_TOP - 0.08),
    new THREE.Vector2(R - 0.02, BODY_TOP),
    new THREE.Vector2(R - 0.06, BODY_TOP + 0.04),
    new THREE.Vector2(R - 0.06, BODY_TOP + 0.13),
  ];
  const glassGeo = track(new THREE.LatheGeometry(glassProfile, 72));
  const glassUniforms = { uOpacity: { value: 1 } };
  const glassMat = track(
    new THREE.ShaderMaterial({
      uniforms: glassUniforms,
      vertexShader: glassVert,
      fragmentShader: glassFrag,
      transparent: true,
      depthWrite: false,
    }),
  );
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.renderOrder = 2;
  jar.add(glass);
  // thick glass base
  const baseGeo = track(new THREE.CylinderGeometry(R - 0.02, R - 0.04, 0.08, 64));
  const baseMat = track(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.35, clearcoat: 1 }));
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = BODY_BOTTOM + 0.04;
  jar.add(base);

  // ---------- lid ----------
  const lid = new THREE.Group();
  const ridges = track(ridgeTexture());
  const lidMat = track(new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.32, metalness: 0.35, bumpMap: ridges, bumpScale: 2.2 }));
  const lidGeo = track(new THREE.CylinderGeometry(R + 0.02, R + 0.02, 0.34, 72));
  const lidBody = new THREE.Mesh(lidGeo, lidMat);
  lid.add(lidBody);
  const lidTopGeo = track(new THREE.CylinderGeometry(R - 0.01, R + 0.02, 0.03, 72));
  const lidTopMat = track(new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.25, metalness: 0.4 }));
  const lidTop = new THREE.Mesh(lidTopGeo, lidTopMat);
  lidTop.position.y = 0.18;
  lid.add(lidTop);
  if (isHero) {
    scene.add(lid);
  } else {
    lid.position.y = BODY_TOP + 0.2;
    jar.add(lid);
  }

  // ---------- pour (hero) ----------
  const POUR_LEN = 7;
  const pourUniforms = {
    uTime: honeyUniforms.uTime,
    uSway: { value: new THREE.Vector2() },
    uLen: { value: POUR_LEN },
    uHoney: honeyUniforms.uHoney,
    uDark: honeyUniforms.uDark,
    uLight: honeyUniforms.uLight,
  };
  let pour: THREE.Mesh | null = null;
  if (isHero) {
    const pourGeo = track(new THREE.CylinderGeometry(0.07, 0.07, POUR_LEN, 16, 96, true));
    const pourMat = track(new THREE.ShaderMaterial({ uniforms: pourUniforms, vertexShader: pourVert, fragmentShader: pourFrag }));
    pour = new THREE.Mesh(pourGeo, pourMat);
    pour.renderOrder = 1;
    scene.add(pour);
  }

  // ---------- shadow ----------
  const shadowTex = track(shadowTexture());
  const shadowGeo = track(new THREE.PlaneGeometry(2.6, 2.6));
  const shadowMat = track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = BODY_BOTTOM - 0.02;
  scene.add(shadow);

  // ---------- look ----------
  function setLook(look: JarLook) {
    const h = new THREE.Color(look.honey);
    honeyUniforms.uHoney.value.copy(h);
    honeyUniforms.uDark.value.set(look.honeyDark);
    honeyUniforms.uLight.value.copy(h).lerp(new THREE.Color("#fff4c8"), 0.5);
    drawLabel(labelCanvas, look);
    labelTex.needsUpdate = true;

    if (specks) {
      jar.remove(specks);
      specks.geometry.dispose();
    }
    const k = SPECKS[look.specks];
    const rnd = seeded(7 + parseInt(look.number, 10) * 131);
    const pos = new Float32Array(k.n * 3);
    const size = new Float32Array(k.n);
    const seed = new Float32Array(k.n);
    for (let i = 0; i < k.n; i++) {
      const a = rnd() * Math.PI * 2;
      const r = k.rise ? rnd() * (HONEY_R - 0.06) : HONEY_R + 0.008 + rnd() * 0.012;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = BODY_BOTTOM + 0.12 + rnd() * (FILL + 1.4);
      pos[i * 3 + 2] = Math.sin(a) * r;
      size[i] = k.size[0] + rnd() * (k.size[1] - k.size[0]);
      seed[i] = rnd();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    speckUniforms.uColorA.value.set(k.a);
    speckUniforms.uColorB.value.set(k.b);
    speckUniforms.uRound.value = k.round ? 1 : 0;
    speckUniforms.uRise.value = k.rise ? 1 : 0;
    speckUniforms.uIn.value = 0;
    specks = new THREE.Points(g, speckMat);
    specks.renderOrder = 1;
    jar.add(specks);
  }
  let current = opts.look;
  let disposed = false;
  setLook(opts.look);
  // Fonts may still be streaming in: redraw once they're ready.
  void document.fonts?.ready.then(() => {
    if (!disposed) {
      drawLabel(labelCanvas, current);
      labelTex.needsUpdate = true;
    }
  });

  // ---------- simulation ----------
  const st = {
    rotY: isHero ? -Math.PI * 1.2 : -Math.PI * 2,
    rotX: 0,
    rotZ: 0,
    vY: 0,
    sloshX: 0,
    sloshZ: 0,
    sloshVX: 0,
    sloshVZ: 0,
    prevJarX: 0,
    prevRotZ: 0,
    prevRotX: 0,
    sway: new THREE.Vector2(),
    intro: 0,
  };
  const timer = new THREE.Timer();
  let raf = 0;
  let running = false;
  let firstFrame = true;
  const tmp = new THREE.Vector3();

  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 1 / 30);
    const t = timer.getElapsed();
    const { pointer, tilt, spin } = opts.input;
    honeyUniforms.uTime.value = t;

    st.intro = Math.min(1, st.intro + dt * 0.9);
    const ease = 1 - Math.pow(1 - st.intro, 3);
    speckUniforms.uIn.value = ease;

    const px = pointer.active ? pointer.x : Math.sin(t * 0.5) * 0.25;
    const py = pointer.active ? pointer.y : 0;
    const tx = tilt.active ? tilt.x : 0;
    const ty = tilt.active ? tilt.y : 0;

    // Rotation targets: idle spin + pointer lean + device tilt + host spin.
    // Hero spins idly; the product jar only sways so the turn slider stays true.
    const idle = isHero ? t * 0.35 : Math.sin(t * 0.6) * 0.1;
    const targetY = idle + spin + px * 0.55;
    const targetZ = -px * 0.12 - tx * 0.42;
    const targetX = py * 0.16 + ty * 0.3;
    const k = 1 - Math.pow(0.0015, dt);
    st.rotY += (targetY - st.rotY) * (1 - Math.pow(0.04, dt)) * (0.3 + 0.7 * ease);
    st.rotZ += (targetZ - st.rotZ) * k;
    st.rotX += (targetX - st.rotX) * k;

    jar.rotation.set(st.rotX, st.rotY, st.rotZ, "XZY");
    const jarX = isHero ? px * 0.12 : 0;
    jar.position.x = jarX;
    jar.position.y = isHero ? (1 - ease) * -0.6 : Math.sin(t * 1.1) * 0.03;

    // Slosh: a damped spring pushed by the jar's angular + lateral motion.
    const dRotZ = (st.rotZ - st.prevRotZ) / Math.max(dt, 1e-3);
    const dRotX = (st.rotX - st.prevRotX) / Math.max(dt, 1e-3);
    const dX = (jarX - st.prevJarX) / Math.max(dt, 1e-3);
    st.prevRotZ = st.rotZ;
    st.prevRotX = st.rotX;
    st.prevJarX = jarX;
    const stiff = 38;
    const damp = 3.2;
    st.sloshVX += (-st.sloshX * stiff - st.sloshVX * damp - (dRotZ * 0.9 - dX * 1.2) - opts.input.shake * 0.4) * dt;
    st.sloshVZ += (-st.sloshZ * stiff - st.sloshVZ * damp + dRotX * 0.9) * dt;
    st.sloshX += st.sloshVX * dt;
    st.sloshZ += st.sloshVZ * dt;
    st.sloshX = THREE.MathUtils.clamp(st.sloshX, -0.45, 0.45);
    st.sloshZ = THREE.MathUtils.clamp(st.sloshZ, -0.45, 0.45);
    opts.input.shake *= Math.pow(0.02, dt);
    honeyUniforms.uSlosh.value.set(st.sloshX, st.sloshZ);
    const agit = Math.min(1.4, 0.25 + Math.hypot(st.sloshVX, st.sloshVZ) * 0.6);
    honeyUniforms.uAgit.value += (agit - honeyUniforms.uAgit.value) * 0.1;

    jar.updateMatrixWorld();
    jar.getWorldPosition(tmp);
    honeyUniforms.uCenter.value.copy(tmp);
    // Surface level in world space: the jar's local fill line, tilt-corrected.
    honeyUniforms.uLevel.value = (BODY_BOTTOM + FILL + 1.6) * Math.cos(st.rotZ) * Math.cos(st.rotX);

    if (pour && isHero) {
      const surfaceY = tmp.y + honeyUniforms.uLevel.value;
      pour.position.set(tmp.x, surfaceY + POUR_LEN / 2 - 0.05, tmp.z);
      st.sway.x += ((pointer.active ? pointer.x * -0.5 : 0) + tx * -0.6 - st.sway.x) * 0.06;
      st.sway.y += ((pointer.active ? pointer.y * 0.3 : 0) - st.sway.y) * 0.06;
      pourUniforms.uSway.value.copy(st.sway);
      lid.position.set(1.15 + px * 0.2, 2.15 + Math.sin(t * 1.3) * 0.12, -0.3);
      lid.rotation.set(0.5 + Math.sin(t * 0.9) * 0.08, t * 0.6, -0.55);
    }
    shadow.position.x = jar.position.x;
    shadow.scale.setScalar(1 - Math.abs(st.rotZ) * 0.3);

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      opts.onFirstFrame();
    }
  }

  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    opts.onContextLost();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  function start() {
    if (running || disposed) return;
    running = true;
    timer.update(performance.now());
    timer.getDelta();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  return {
    setLook(look) {
      current = look;
      setLook(look);
    },
    setSize(w, h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      // Keep the whole jar (and the pour) in frame on tall, narrow screens.
      const fitV = isHero ? 26 : 24;
      camera.fov = camera.aspect < 0.62 ? fitV * (0.62 / camera.aspect) * 0.92 : fitV;
      camera.updateProjectionMatrix();
    },
    start,
    stop,
    dispose() {
      disposed = true;
      stop();
      canvas.removeEventListener("webglcontextlost", onLost);
      specks?.geometry.dispose();
      disposables.forEach((d) => d.dispose());
      timer.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
