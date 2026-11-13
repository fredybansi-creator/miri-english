// Ralucas Welt – step 0, the speed test: Raluca walks over a small block world.
// Phone: thumb stick (left half of the screen), drag elsewhere to look around, button to jump.
// Laptop: W A S D or arrow keys, space to jump, drag with the mouse to look around.
// Everything is drawn in very few draw calls (one mesh for the ground, one for all tree/rock/flower blocks),
// and the picture gets less sharp by itself when the device is slow.

import * as THREE from '../vendor/three.module.min.js';
import { makeFoxActor, webglOk } from '../fox3d.js';

const SIZE = 112;            // blocks per side
const WATER = 2;             // blocks at or below this height are under water
const $ = (id) => document.getElementById(id);

// ------------------------------------------------------------------ random numbers that are the same every time
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (x, z) => { let h = Math.imul(x, 374761393) ^ Math.imul(z, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), fx = smooth(x - xi), fz = smooth(z - zi);
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
}

// ------------------------------------------------------------------ the land: one height per block
const H = new Int8Array(SIZE * SIZE);
const solid = new Uint8Array(SIZE * SIZE); // tree trunks and rocks: Raluca cannot walk through
const at = (x, z) => (x < 0 || z < 0 || x >= SIZE || z >= SIZE ? 9 : H[z * SIZE + x]);
const mid = SIZE / 2;
for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) {
  let n = noise(x / 26, z / 26) * 0.62 + noise(x / 11 + 40, z / 11 + 40) * 0.28 + noise(x / 5 + 90, z / 5 + 90) * 0.1;
  const d = Math.hypot(x - mid, z - mid);
  n = n * 8 + 0.9;
  n += Math.max(0, 1 - d / 7) * (4 - n) * 0.9;                 // a flat meadow in the middle (start)
  const pond = Math.hypot(x - mid - 13, z - mid + 4); n -= Math.max(0, 1 - pond / 9) * 4;   // a pond next to it
  n += Math.max(0, (d - (mid - 9)) / 3);                        // hills at the edge keep her inside
  H[z * SIZE + x] = Math.max(0, Math.min(12, Math.round(n)));
}

// ------------------------------------------------------------------ small pixel texture for block detail
function pixelTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 16;
  const g = c.getContext('2d'); const r = rng(7);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const v = 205 + Math.floor(r() * 50); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, y, 1, 1); }
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}

function buildLand(tex) {
  const pos = [], col = [], uv = [], nor = [], idx = [];
  const c = new THREE.Color();
  const quad = (p, n, color, vTop) => {
    const i = pos.length / 3;
    for (let k = 0; k < 4; k++) { pos.push(p[k][0], p[k][1], p[k][2]); nor.push(n[0], n[1], n[2]); col.push(color.r, color.g, color.b); }
    uv.push(0, 0, 1, 0, 1, vTop, 0, vTop);
    idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  };
  for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) {
    const h = at(x, z), r = hash(x + 500, z + 500);
    if (h <= WATER) c.setRGB(0.86 + r * 0.06, 0.78 + r * 0.06, 0.55 + r * 0.05, THREE.SRGBColorSpace);           // sand
    else if (h >= 9) c.setRGB(0.62 + r * 0.06, 0.63 + r * 0.06, 0.64 + r * 0.06, THREE.SRGBColorSpace);          // stone
    else c.setRGB(0.42 + r * 0.1 + (h - 3) * 0.012, 0.72 + r * 0.1, 0.33 + r * 0.06, THREE.SRGBColorSpace);      // grass
    quad([[x, h, z + 1], [x + 1, h, z + 1], [x + 1, h, z], [x, h, z]], [0, 1, 0], c, 1);
    // sides, only where the neighbour is lower
    const side = (nh, p, n) => {
      if (nh >= h) return;
      if (h >= 9) c.setRGB(0.5, 0.51, 0.53, THREE.SRGBColorSpace); else c.setRGB(0.55 + r * 0.05, 0.4 + r * 0.04, 0.27, THREE.SRGBColorSpace);
      const s = n[1] === 0 && n[2] !== 0 ? 0.82 : 0.68; c.multiplyScalar(s);
      quad(p(nh), n, c, h - nh);
    };
    side(at(x, z + 1), (b) => [[x, b, z + 1], [x + 1, b, z + 1], [x + 1, h, z + 1], [x, h, z + 1]], [0, 0, 1]);
    side(at(x, z - 1), (b) => [[x + 1, b, z], [x, b, z], [x, h, z], [x + 1, h, z]], [0, 0, -1]);
    side(at(x + 1, z), (b) => [[x + 1, b, z + 1], [x + 1, b, z], [x + 1, h, z], [x + 1, h, z + 1]], [1, 0, 0]);
    side(at(x - 1, z), (b) => [[x, b, z], [x, b, z + 1], [x, h, z + 1], [x, h, z]], [-1, 0, 0]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, map: tex }));
}

// ------------------------------------------------------------------ trees, rocks and flowers: all blocks in ONE mesh
function buildThings(tex) {
  const boxes = []; // [x, y, z, sx, sy, sz, color]
  const r = rng(2026);
  const c = new THREE.Color();
  for (let i = 0; i < 1500; i++) {
    const x = 3 + Math.floor(r() * (SIZE - 6)), z = 3 + Math.floor(r() * (SIZE - 6));
    const h = at(x, z), d = Math.hypot(x - mid, z - mid), kind = r();
    if (h <= WATER || h >= 9 || solid[z * SIZE + x] || d < 4) continue;
    const forest = noise(x / 14 + 7, z / 14 + 3);
    if (kind < 0.16 * (forest > 0.5 ? 2.2 : 0.35) && d > 6) {
      // tree: trunk + a rounded crown of leaf blocks
      if ([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].some(([a, b]) => solid[(z + b) * SIZE + x + a])) continue;
      const th = 3 + Math.floor(r() * 3), pine = r() < 0.3;
      solid[z * SIZE + x] = 1;
      boxes.push([x + 0.5, h + th / 2, z + 0.5, 0.7, th, 0.7, c.setRGB(0.43, 0.29, 0.17, THREE.SRGBColorSpace).getHex()]);
      const layers = pine ? [[2, 0], [2, 1], [1, 2], [1, 3], [0, 4]] : [[1, 0], [2, 1], [2, 2], [1, 3]];
      for (const [rad, dy] of layers) for (let a = -rad; a <= rad; a++) for (let b = -rad; b <= rad; b++) {
        if (rad > 0 && Math.abs(a) === rad && Math.abs(b) === rad && (rad > 1 || r() < 0.5)) continue; // cut the corners
        if (a === 0 && b === 0 && dy === 0) continue;
        const v = r() * 0.08;
        if (pine) c.setRGB(0.16 + v, 0.42 + v, 0.27 + v, THREE.SRGBColorSpace); else c.setRGB(0.25 + v, 0.58 + v * 1.6, 0.22 + v, THREE.SRGBColorSpace);
        boxes.push([x + 0.5 + a, h + th - 0.5 + dy, z + 0.5 + b, 1, 1, 1, c.getHex()]);
      }
    } else if (kind < 0.24) {
      // rock
      const s = 0.6 + r() * 0.7; solid[z * SIZE + x] = s > 0.9 ? 1 : 0;
      const v = 0.52 + r() * 0.12;
      boxes.push([x + 0.5, h + s * 0.35, z + 0.5, s, s * 0.7, s * 0.9, c.setRGB(v, v, v + 0.02, THREE.SRGBColorSpace).getHex()]);
      boxes.push([x + 0.5 + s * 0.3, h + s * 0.2, z + 0.5 - s * 0.25, s * 0.55, s * 0.4, s * 0.55, c.setRGB(v - 0.06, v - 0.06, v - 0.04, THREE.SRGBColorSpace).getHex()]);
    } else if (kind < 0.62) {
      // flower: stem + head
      const fx = x + 0.2 + r() * 0.6, fz = z + 0.2 + r() * 0.6, fh = 0.25 + r() * 0.2;
      boxes.push([fx, h + fh / 2, fz, 0.06, fh, 0.06, 0x3f8f3a]);
      boxes.push([fx, h + fh + 0.07, fz, 0.2, 0.14, 0.2, [0xffffff, 0xffd84a, 0xff7f9e, 0xb48cff, 0xff9a3d][Math.floor(r() * 5)]]);
    } else {
      // tuft of grass
      for (let k = 0; k < 3; k++) { const gh = 0.18 + r() * 0.22; boxes.push([x + 0.15 + r() * 0.7, h + gh / 2, z + 0.15 + r() * 0.7, 0.08, gh, 0.08, c.setRGB(0.3, 0.6 + r() * 0.1, 0.25, THREE.SRGBColorSpace).getHex()]); }
    }
  }
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ map: tex }), boxes.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();
  boxes.forEach((b, i) => { p.set(b[0], b[1], b[2]); s.set(b[3], b[4], b[5]); m.compose(p, q, s); mesh.setMatrixAt(i, m); mesh.setColorAt(i, c.setHex(b[6])); });
  mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}

// ------------------------------------------------------------------ start
function start() {
  const stage = $('stage');
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);
  let ratio = Math.min(window.devicePixelRatio || 1, 2);
  const scene = new THREE.Scene();
  const SKY = 0xbfe3f6;
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 34, 62);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.2, 70);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9ab07f, 1.7));
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.9); sun.position.set(-3, 6, 4); scene.add(sun);

  const tex = pixelTexture();
  scene.add(buildLand(tex));
  scene.add(buildThings(tex));
  const water = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), new THREE.MeshLambertMaterial({ color: 0x4fa8e0, transparent: true, opacity: 0.72 }));
  water.rotation.x = -Math.PI / 2; water.position.set(mid, WATER + 0.72, mid); scene.add(water);

  // Raluca: `who` is moved and turned, the fox inside is shifted so that her middle is over the spot
  const who = new THREE.Group(); scene.add(who);
  const actor = makeFoxActor(); actor.root.position.x = 0.1; actor.root.scale.setScalar(0.9);
  const body = new THREE.Group(); body.add(actor.root); who.add(body);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.5, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(ratio); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = w < h ? 62 : 50; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  // ---------------- input
  const keys = new Set();
  const input = { x: 0, y: 0, jump: false };
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  $('hintText').textContent = touch ? 'Links: laufen · Wischen: umsehen' : 'W A S D: laufen · Leertaste: springen · Maus ziehen: umsehen';
  if (!touch) $('jump').style.display = 'none';
  setTimeout(() => { $('hint').style.opacity = 0; }, 7000);
  window.addEventListener('keydown', (e) => { keys.add(e.code); if (e.code === 'Space') { input.jump = true; e.preventDefault(); } });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());
  let yaw = 0.6, pitch = 0.42, stickId = null, lookId = null, sx = 0, sy = 0, lx = 0, ly = 0;
  const stick = $('stick'), knob = $('knob');
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' && e.clientX < window.innerWidth * 0.5 && stickId === null) {
      stickId = e.pointerId; sx = e.clientX; sy = e.clientY;
      stick.style.display = 'block'; stick.style.left = sx + 'px'; stick.style.top = sy + 'px'; knob.style.transform = '';
    } else if (lookId === null) { lookId = e.pointerId; lx = e.clientX; ly = e.clientY; }
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (e.pointerId === stickId) {
      let dx = e.clientX - sx, dy = e.clientY - sy; const d = Math.hypot(dx, dy), max = 46;
      if (d > max) { dx *= max / d; dy *= max / d; }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      input.x = dx / max; input.y = -dy / max;
    } else if (e.pointerId === lookId) {
      yaw -= (e.clientX - lx) * 0.006; pitch = Math.max(0.12, Math.min(1.1, pitch + (e.clientY - ly) * 0.004));
      lx = e.clientX; ly = e.clientY;
    }
  });
  const up = (e) => {
    if (e.pointerId === stickId) { stickId = null; input.x = input.y = 0; stick.style.display = 'none'; }
    if (e.pointerId === lookId) lookId = null;
  };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  $('jump').addEventListener('pointerdown', (e) => { input.jump = true; e.preventDefault(); });
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------------- Raluca's state
  const groundAt = (x, z) => Math.max(at(Math.floor(x), Math.floor(z)), WATER + 0.35); // she wades / swims in water
  const blocked = (x, z, fromY) => {
    const xi = Math.floor(x), zi = Math.floor(z);
    if (xi < 1 || zi < 1 || xi >= SIZE - 1 || zi >= SIZE - 1) return true;
    if (solid[zi * SIZE + xi]) return true;
    return groundAt(x, z) - fromY > 1.05;                       // one block up is fine, more needs a jump
  };
  const P = { x: mid + 0.5, z: mid + 0.5, y: 0, vy: 0, face: 0, speed: 0, phase: 0, air: false };
  P.y = groundAt(P.x, P.z);
  const cam = new THREE.Vector3(), look = new THREE.Vector3();
  let time = 0, blink = 3, blinkT = -1;

  function step(dt) {
    time += dt;
    let mx = input.x, my = input.y;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
    if (keys.has('KeyW') || keys.has('ArrowUp')) my += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) my -= 1;
    const len = Math.hypot(mx, my); if (len > 1) { mx /= len; my /= len; }
    const power = Math.min(1, len);
    const inWater = P.y < WATER + 0.5 && !P.air;
    const target = power * (inWater ? 2.6 : 5.6);
    P.speed += (target - P.speed) * Math.min(1, dt * 9);
    if (power > 0.05) {
      // "up" on the stick = away from the camera
      const dx = -Math.sin(yaw) * my + Math.cos(yaw) * mx, dz = -Math.cos(yaw) * my - Math.sin(yaw) * mx;
      const want = Math.atan2(dz, -dx);
      let diff = want - P.face; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      P.face += diff * Math.min(1, dt * 11);
      const n = Math.hypot(dx, dz) || 1, vx = (dx / n) * P.speed * dt, vz = (dz / n) * P.speed * dt;
      const pad = 0.3;
      if (!blocked(P.x + vx + Math.sign(vx) * pad, P.z, P.y)) P.x += vx;
      if (!blocked(P.x, P.z + vz + Math.sign(vz) * pad, P.y)) P.z += vz;
    }
    const g = groundAt(P.x, P.z);
    if (input.jump && !P.air) { P.vy = 7.4; P.air = true; }
    input.jump = false;
    if (P.air) {
      P.vy -= 21 * dt; P.y += P.vy * dt;
      if (P.y <= g && P.vy <= 0) { P.y = g; P.air = false; P.vy = 0; }
    } else if (P.y < g) P.y = Math.min(g, P.y + dt * 9);         // step up smoothly
    else if (P.y - g > 0.6) { P.air = true; P.vy = 0; }           // walked off an edge: fall
    else P.y = Math.max(g, P.y - dt * 9);

    // ---- pose
    const p = actor.rest();
    const k = Math.min(1, P.speed / 5.6);
    P.phase += dt * (5 + k * 9);
    const a = Math.sin(P.phase) * 0.75 * k;
    p.fl = a; p.br = a; p.fr = -a; p.bl = -a;
    p.squash = Math.sin(time * 2.2) * 0.012;
    p.tail = Math.sin(time * (3 + k * 6)) * (0.3 + k * 0.2);
    p.tailUp = 0.05 + k * 0.25;
    p.headTurn = k < 0.1 ? Math.sin(time * 0.5) * 0.25 : 0;
    p.headNod = -k * 0.08;
    p.earL = Math.max(0, Math.sin(time * 0.7) - 0.97) * 4;
    if (P.air) { const t = Math.max(-1, Math.min(1, P.vy / 7.4)); p.fl = p.fr = -0.7 * (0.4 + Math.abs(t)); p.bl = p.br = 0.8 * (0.4 + Math.abs(t)); p.pitch = t * 0.22; p.tailUp = 0.35; }
    blink -= dt; if (blink < 0) { blinkT = 0; blink = 2.5 + Math.random() * 3; }
    if (blinkT >= 0) { blinkT += dt; p.blink = Math.sin(Math.min(1, blinkT / 0.16) * Math.PI); if (blinkT > 0.16) blinkT = -1; }
    actor.pose(p);
    const bob = P.air ? 0 : Math.abs(Math.sin(P.phase)) * 0.05 * k;
    const sink = inWater ? -0.22 : 0;
    who.position.set(P.x, P.y + bob + sink, P.z);
    who.rotation.y = P.face;
    shadow.position.set(P.x, g + 0.02, P.z); shadow.visible = !inWater;
    const sh = 1 / (1 + Math.max(0, P.y - g) * 0.5); shadow.scale.setScalar(sh);

    // ---- camera: behind and above, never under the ground
    const dist = 6.2;
    cam.set(P.x + Math.sin(yaw) * Math.cos(pitch) * dist, P.y + 1 + Math.sin(pitch) * dist, P.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    cam.y = Math.max(cam.y, groundAt(cam.x, cam.z) + 0.8);
    camera.position.lerp(cam, Math.min(1, dt * 8));
    look.set(P.x, P.y + 0.9, P.z); camera.lookAt(look);
  }

  // ---------------- loop + speed measurement
  let last = performance.now(), frames = 0, since = last, slow = 0;
  const stats = { fps: 0, ratio, calls: 0, tris: 0 };
  window.WELT = { P, stats, input, setYaw: (v) => { yaw = v; } };
  camera.position.set(P.x + 4, P.y + 4, P.z + 4);
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    step(dt);
    renderer.render(scene, camera);
    frames++;
    if (now - since >= 1000) {
      const fps = Math.round((frames * 1000) / (now - since)); frames = 0; since = now;
      stats.fps = fps; stats.calls = renderer.info.render.calls; stats.tris = renderer.info.render.triangles;
      $('fps').textContent = fps;
      // too slow for 2 seconds in a row → draw fewer pixels (the picture gets a little softer)
      slow = fps < 40 ? slow + 1 : 0;
      if (slow >= 2 && ratio > 0.75) { ratio = Math.max(0.75, ratio - 0.25); stats.ratio = ratio; slow = 0; resize(); }
      $('note').textContent = fps >= 50 ? 'läuft flüssig ✓' : fps >= 30 ? 'läuft gut' : 'zu langsam';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (webglOk()) start(); else { $('err').style.display = 'flex'; $('hud').style.display = 'none'; $('jump').style.display = 'none'; }
