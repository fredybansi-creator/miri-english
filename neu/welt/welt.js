// Ralucas Welt – step 2, the world: meadow with the den, forest, hill, river and pond; animals walk around.
// Hunting: sneak up on a mouse (stick only a little / Shift), then "Fangen" = pounce.
// Step 3: hunger, thirst, energy; eat berries, drink, sleep in the den, sniff the way; day and night; saving.
// The camera turns behind her by itself while she walks.
// Question marks stand in the world; when she walks into one, an English exercise opens (build the sentence).
// Phone: thumb stick (left half of the screen), drag elsewhere to look around, button to jump.
// Laptop: W A S D or arrow keys, space to jump, drag with the mouse to look around.
// Everything is drawn in very few draw calls (one mesh for the ground, one for all tree/rock/flower blocks),
// and the picture gets less sharp by itself when the device is slow.

import * as THREE from '../vendor/three.module.min.js';
import { makeFoxActor, webglOk } from '../fox3d.js';
import { makeDogActor } from './hund.js';
import { play } from '../audio.js';
import { MODELS } from './models.js';
import travel from '../content/travel.js';
import friends from '../content/friends.js';
import doctor from '../content/doctor.js';
import holiday from '../content/holiday.js';
import cafe from '../content/cafe.js';
import shopping from '../content/shopping.js';

// the "build the sentence" exercises of all lessons: { en, de, extra? }
const SENTENCES = [travel, friends, doctor, holiday, cafe, shopping].flatMap((t) => t.lessons.flatMap((l) => l.build || []));
const MARKS = 10;            // question marks in the world

const SIZE = 192;            // blocks per side
const CHUNK = 16;            // the world is cut into pieces of 16 × 16 blocks; far pieces are not drawn
const WATER = 2;             // blocks at or below this height are under water
const SEE = 54;              // how far she can see (fog)
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

// ------------------------------------------------------------------ the map: meadow (middle, with the den), forest,
// a hill in the north-west, a pond in the east and a river from the hill to the pond
const mid = SIZE / 2;
const HILL = [mid - 46, mid - 44], POND = [mid + 36, mid + 8], DEN = [mid + 6, mid - 1];
// ponds: [x, z, radius] – the big one in the east, one in the south-west, one in the north-east, a small one by the meadow
const PONDS = [[POND[0], POND[1], 15], [mid - 40, mid + 38, 11], [mid + 30, mid - 50, 9], [mid - 14, mid + 16, 5.5]];
const RIVER = [[mid - 30, mid - 22], [mid - 14, mid - 16], [mid + 2, mid - 13], [mid + 16, mid - 4], [mid + 30, mid + 6]];
// rivers: from the hill to the big pond, from the north pond down to it, and from the south-west pond across to it
const RIVERS = [RIVER, [[mid + 30, mid - 46], [mid + 42, mid - 30], [mid + 34, mid - 14], [mid + 37, mid]],
  [[mid - 36, mid + 40], [mid - 18, mid + 47], [mid + 4, mid + 41], [mid + 22, mid + 28], [mid + 32, mid + 16]]];
function riverDist(x, z) {
  let best = 1e9;
  for (const RV of RIVERS) for (let i = 0; i < RV.length - 1; i++) {
    const [ax, az] = RV[i], [bx, bz] = RV[i + 1], dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return best + Math.sin(x * 0.35) * 0.9 + Math.sin(z * 0.27) * 0.7;   // a wobbly bank
}
const H = new Int8Array(SIZE * SIZE);
const solid = new Uint8Array(SIZE * SIZE); // tree trunks, rocks, the den: Raluca cannot walk through
const at = (x, z) => (x < 0 || z < 0 || x >= SIZE || z >= SIZE ? 20 : H[z * SIZE + x]);
for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) {
  let n = 3.2 + noise(x / 30, z / 30) * 3 + noise(x / 12 + 40, z / 12 + 40) * 1.3;
  const d = Math.hypot(x - mid, z - mid);
  const hill = Math.max(0, 1 - Math.hypot(x - HILL[0], z - HILL[1]) / 34); n += hill * hill * 13 + (hill > 0.2 ? noise(x / 4, z / 4) * 1.5 : 0);
  const flat = Math.min(1, Math.max(0, 1.5 - Math.hypot(x - mid - 2, z - mid) / 9)); n += (4 - n) * flat;           // the meadow around the den
  for (const [px, pz, pr] of PONDS) n -= Math.max(0, 1 - Math.hypot(x - px, z - pz) / pr) * 6;                    // the ponds
  const rv = riverDist(x, z); if (rv < 5) n = Math.min(n, 1.4 + Math.max(0, rv - 2.2) * 1.3);                    // the river bed and its banks
  n += Math.max(0, (d - (mid - 10)) / 2.5);                                                                      // hills at the edge keep her inside
  H[z * SIZE + x] = Math.max(0, Math.min(19, Math.round(n)));
}
const STONE = 11;   // from this height up the ground is stone
const BUSHES = [];
const LEAF = new Int8Array(SIZE * SIZE);   // where tree crowns are: the height of the crown's bottom (0 = none), so the camera does not go into them  // [x, z] of every berry bush (Raluca eats there)

// ------------------------------------------------------------------ small pixel texture for block detail
function pixelTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 16;
  const g = c.getContext('2d'); const r = rng(7);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const v = 205 + Math.floor(r() * 50); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, y, 1, 1); }
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** the ground of one piece of the map (x0..x0+CHUNK, z0..z0+CHUNK) as one mesh */
function buildLand(mat, x0, z0) {
  const pos = [], col = [], uv = [], nor = [], idx = [];
  const c = new THREE.Color();
  const quad = (p, n, color, vTop) => {
    const i = pos.length / 3;
    for (let k = 0; k < 4; k++) { pos.push(p[k][0], p[k][1], p[k][2]); nor.push(n[0], n[1], n[2]); col.push(color.r, color.g, color.b); }
    uv.push(0, 0, 1, 0, 1, vTop, 0, vTop);
    idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  };
  for (let z = z0; z < z0 + CHUNK; z++) for (let x = x0; x < x0 + CHUNK; x++) {
    const h = at(x, z), r = hash(x + 500, z + 500);
    const wet = h === WATER + 1 && (at(x + 1, z) <= WATER || at(x - 1, z) <= WATER || at(x, z + 1) <= WATER || at(x, z - 1) <= WATER);
    if (h <= WATER || (wet && r < 0.6)) c.setRGB(0.86 + r * 0.06, 0.78 + r * 0.06, 0.55 + r * 0.05, THREE.SRGBColorSpace);      // sand
    else if (h >= STONE) c.setRGB(0.62 + r * 0.06, 0.63 + r * 0.06, 0.64 + r * 0.06, THREE.SRGBColorSpace);      // stone
    else { const f = noise(x / 18 + 7, z / 18 + 3) > 0.52 ? 0.9 : 1; c.setRGB((0.42 + r * 0.1 + (h - 3) * 0.012) * f, (0.72 + r * 0.1) * f, (0.33 + r * 0.06) * f, THREE.SRGBColorSpace); }   // grass (darker in the forest)
    quad([[x, h, z + 1], [x + 1, h, z + 1], [x + 1, h, z], [x, h, z]], [0, 1, 0], c, 1);
    const side = (nh, p, n) => {
      if (nh >= h) return;
      if (h >= STONE) c.setRGB(0.5, 0.51, 0.53, THREE.SRGBColorSpace); else c.setRGB(0.55 + r * 0.05, 0.4 + r * 0.04, 0.27, THREE.SRGBColorSpace);
      c.multiplyScalar(n[2] !== 0 ? 0.82 : 0.68);
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
  g.computeBoundingSphere(); return new THREE.Mesh(g, mat);
}

// ------------------------------------------------------------------ trees, bushes, rocks … : the models of models.js,
// all boxes of one map piece in ONE instanced mesh
const BOX = new THREE.BoxGeometry(1, 1, 1);
function boxMesh(boxes, mat) {
  const mesh = new THREE.InstancedMesh(BOX, mat, boxes.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
  boxes.forEach((b, i) => { p.set(b[0], b[1], b[2]); s.set(b[3], b[4], b[5]); m.compose(p, q, s); mesh.setMatrixAt(i, m); mesh.setColorAt(i, c.setHex(b[6])); });
  mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();   // so pieces behind the camera are not drawn
  return mesh;
}
/** put a model at (x, y, z), turned by `turn` quarter turns; the boxes go into the list of their map piece */
function place(lists, name, x, y, z, turn = 0, scale = 1) {
  const list = lists[Math.floor(z / CHUNK) * (SIZE / CHUNK) + Math.floor(x / CHUNK)];
  if (!list) return;
  for (const b of MODELS[name].boxes) {
    let bx = b[0], bz = b[2], sx = b[3], sz = b[5];
    for (let k = 0; k < (turn & 3); k++) { [bx, bz] = [-bz, bx]; [sx, sz] = [sz, sx]; }
    list.push([x + bx * scale, y + b[1] * scale, z + bz * scale, sx * scale, b[4] * scale, sz * scale, b[6]]);
  }
}
const nearWater = (x, z, n) => { for (let a = -n; a <= n; a += n) for (let b = -n; b <= n; b += n) if (at(x + a, z + b) <= WATER) return true; return false; };
function plant() {
  const lists = Array.from({ length: (SIZE / CHUNK) ** 2 }, () => []);
  const r = rng(2026);
  const free = (x, z, n) => { for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) if (solid[(z + b) * SIZE + x + a]) return false; return true; };
  // the den: on the meadow, the door looks to the start
  place(lists, 'den', DEN[0] + 0.5, at(DEN[0], DEN[1]), DEN[1] + 0.5);
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) solid[(DEN[1] + b) * SIZE + DEN[0] + a] = 1;
  place(lists, 'flowers', DEN[0] - 1.6, at(DEN[0] - 2, DEN[1] + 2), DEN[1] + 2.4); place(lists, 'mushroom', DEN[0] - 1.5, at(DEN[0] - 2, DEN[1] - 2), DEN[1] - 1.8);
  for (let z = 4; z < SIZE - 4; z++) for (let x = 4; x < SIZE - 4; x++) {
    const h = at(x, z), d = Math.hypot(x - mid, z - mid), k = r(), turn = Math.floor(r() * 4);
    if (h <= WATER) continue;
    if (solid[z * SIZE + x] || d > mid - 6) continue;
    const forest = noise(x / 18 + 7, z / 18 + 3) > 0.52, meadow = Math.hypot(x - mid - 2, z - mid) < 11, wet = nearWater(x, z, 1), y = h;
    const cx = x + 0.5, cz = z + 0.5;
    if (h >= STONE) { if (k < 0.03) { place(lists, 'rock', cx, y, cz, turn, 1 + r() * 1.2); solid[z * SIZE + x] = 1; } continue; }
    if (wet) { if (k < 0.3) place(lists, 'reeds', cx, y, cz, turn); else if (k < 0.34) place(lists, 'rock', cx, y, cz, turn, 0.7); continue; }
    if (!meadow && k < (forest ? 0.05 : 0.005) && free(x, z, 2) && Math.abs(at(x + 1, z) - h) < 2 && Math.abs(at(x, z + 1) - h) < 2) {
      const kind = h >= 8 || z < mid - 38 ? 'pine' : nearWater(x, z, 7) || r() < 0.18 ? 'birch' : r() < 0.2 ? 'pine' : 'oak';
      const sc = 0.9 + r() * 0.35, rad = kind === 'birch' ? 1 : 2, low = Math.round(y + (kind === 'pine' ? 1.2 : 2.4) * sc);
      place(lists, kind, cx, y, cz, turn, sc); solid[z * SIZE + x] = 1;
      for (let a = -rad; a <= rad; a++) for (let b = -rad; b <= rad; b++) { const i = (z + b) * SIZE + x + a; if (!LEAF[i] || LEAF[i] > low) LEAF[i] = low; }
      continue;
    }
    if (k > 0.1 && k < 0.112 && !meadow) { place(lists, 'bush', cx, y, cz, turn, 0.9 + r() * 0.4); solid[z * SIZE + x] = 1; BUSHES.push([cx, cz]); }
    else if (k > 0.2 && k < 0.206) { place(lists, 'rock', cx, y, cz, turn, 0.8 + r() * 0.8); solid[z * SIZE + x] = 1; }
    else if (k > 0.3 && k < (forest ? 0.306 : 0.3015) && free(x, z, 1)) { place(lists, 'log', cx, y, cz, turn); solid[z * SIZE + x] = 1; }
    else if (k > 0.4 && k < (forest ? 0.412 : 0.401)) place(lists, 'mushroom', cx, y, cz, turn, 0.45 + r() * 0.4);
    else if (k > 0.5 && k < (forest ? 0.505 : 0.522)) place(lists, 'flowers', cx, y, cz, turn, 0.8 + r() * 0.5);
    else if (k > 0.7 && k < 0.74) for (let i = 0; i < 3; i++) { const gh = 0.18 + r() * 0.22; lists[Math.floor(z / CHUNK) * (SIZE / CHUNK) + Math.floor(x / CHUNK)].push([x + 0.15 + r() * 0.7, h + gh / 2, z + 0.15 + r() * 0.7, 0.08, gh, 0.08, 0x4d9a40]); }
  }
  return lists;
}

// ------------------------------------------------------------------ animals: each one is a small instanced mesh that moves
const walkable = (x, z, fromH) => { const xi = Math.floor(x), zi = Math.floor(z), h = at(xi, zi); return h > WATER && h < STONE + 3 && !solid[zi * SIZE + xi] && Math.abs(h - fromH) <= 1; };
function makeAnimals(scene, mat) {
  const list = [], r = rng(99);
  const spot = (cx, cz, rad, ok) => { for (let i = 0; i < 300; i++) { const x = cx + (r() * 2 - 1) * rad, z = cz + (r() * 2 - 1) * rad; if (x > 6 && z > 6 && x < SIZE - 6 && z < SIZE - 6 && ok(Math.floor(x), Math.floor(z))) return [x, z]; } return null; };
  const land = (x, z) => at(x, z) > WATER && at(x, z) < STONE && !solid[z * SIZE + x];
  const add = (kind, cx, cz, rad, opt, ok = land) => {
    const s = spot(cx, cz, rad, ok); if (!s) return;
    const mesh = boxMesh(MODELS[kind].boxes, mat); const g = new THREE.Group(); g.add(mesh); scene.add(g);
    list.push({ kind, g, x: s[0], z: s[1], hx: s[0], hz: s[1], y: at(Math.floor(s[0]), Math.floor(s[1])), face: r() * 6, tx: s[0], tz: s[1], wait: r() * 3, t: r() * 10, speed: 1, roam: 7, hop: 0, shy: 0, ...opt });
  };
  for (let i = 0; i < 7; i++) add('rabbit', mid + (r() * 2 - 1) * 60, mid + (r() * 2 - 1) * 60, 12, { speed: 2.6, hop: 0.28, shy: 4.5, roam: 9 });
  add('rabbit', mid - 4, mid + 6, 4, { speed: 2.6, hop: 0.28, shy: 4.5, roam: 6 });
  for (let i = 0; i < 9; i++) add('mouse', mid + (r() * 2 - 1) * 55, mid + (r() * 2 - 1) * 55, 12, { speed: 2.2, shy: 3.5, roam: 5 });
  add('mouse', mid + 3, mid + 7, 4, { speed: 2.2, shy: 3.5, roam: 5 });
  for (let i = 0; i < 3; i++) add('hedgehog', mid + (r() * 2 - 1) * 40, mid + (r() * 2 - 1) * 40, 12, { speed: 0.6, roam: 6 });
  add('owl', DEN[0] - 1, DEN[1] + 5, 3, { speed: 0, sit: true });
  add('owl', HILL[0] + 22, HILL[1] + 22, 8, { speed: 0, sit: true });
  // fish in every pond and along the rivers
  const deep = (x, z) => at(x, z) <= 1;
  PONDS.forEach(([px, pz, pr], i) => { for (let k = 0; k < (i === 0 ? 7 : i === 3 ? 2 : 4); k++) add('fish', px, pz, pr * 0.6, { speed: 1.3, swim: true, roam: pr * 0.5, jump: 4 + r() * 10 }, deep); });
  for (const RV of RIVERS) for (let i = 0; i < RV.length - 1; i++) for (let k = 0; k < 2; k++) { const t = r(); add('fish', RV[i][0] + (RV[i + 1][0] - RV[i][0]) * t, RV[i][1] + (RV[i + 1][1] - RV[i][1]) * t, 3, { speed: 1.5, swim: true, roam: 5, jump: 4 + r() * 10 }, deep); }
  return list;
}
function moveAnimals(list, dt, P, time) {
  for (const a of list) {
    if (a.gone > 0) { a.gone -= dt; a.g.visible = false; if (a.gone <= 0) { a.x = a.hx + (Math.random() * 2 - 1) * a.roam; a.z = a.hz + (Math.random() * 2 - 1) * a.roam; if (!walkable(a.x, a.z, at(Math.floor(a.x), Math.floor(a.z)))) { a.x = a.hx; a.z = a.hz; } a.tx = a.x; a.tz = a.z; } continue; }
    const dx = a.x - P.x, dz = a.z - P.z, far = Math.hypot(dx, dz);
    a.g.visible = far < SEE; if (!a.g.visible) continue;
    a.t += dt;
    let moving = false, speed = a.speed;
    if (a.sit) { let diff = Math.atan2(-dz, dx) - a.face; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); if (far < 12) a.face += diff * Math.min(1, dt * 3); }
    else {
      if (a.shy && far < a.shy * (P.sneak ? 0.4 : 1)) { a.tx = a.x + (dx / (far || 1)) * 6; a.tz = a.z + (dz / (far || 1)) * 6; a.wait = 0; speed = a.speed * 2.2; }
      const tx = a.tx - a.x, tz = a.tz - a.z, td = Math.hypot(tx, tz);
      if (a.wait > 0) a.wait -= dt;
      else if (td < 0.25) { a.wait = 0.6 + Math.random() * 3.5; a.tx = a.hx + (Math.random() * 2 - 1) * a.roam; a.tz = a.hz + (Math.random() * 2 - 1) * a.roam; }
      else {
        const nx = a.x + (tx / td) * speed * dt, nz = a.z + (tz / td) * speed * dt;
        const ok = a.swim ? at(Math.floor(nx), Math.floor(nz)) <= 1 : walkable(nx, nz, at(Math.floor(a.x), Math.floor(a.z)));
        if (ok) { a.x = nx; a.z = nz; moving = true; let diff = Math.atan2(tz, -tx) - a.face; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); a.face += diff * Math.min(1, dt * 8); }
        else { a.tx = a.x; a.tz = a.z; a.wait = 0.3; }
      }
    }
    let ground = a.swim ? WATER + 0.25 + Math.sin(a.t * 1.3) * 0.12 : at(Math.floor(a.x), Math.floor(a.z));
    let leap = 0;
    if (a.swim) { a.jump -= dt; if (a.jump < 0) { leap = Math.sin((-a.jump / 0.9) * Math.PI) * 1.1; if (a.jump < -0.9) a.jump = 6 + Math.random() * 14; } }   // now and then a fish jumps
    ground += leap;
    a.y += (ground - a.y) * Math.min(1, dt * 10);
    const hop = moving && a.hop ? Math.abs(Math.sin(a.t * 9)) * a.hop : 0;
    a.g.position.set(a.x, a.y + hop, a.z);
    a.g.rotation.y = a.face + (a.swim ? Math.sin(a.t * 6) * 0.15 : 0);
    a.g.rotation.z = a.swim && a.jump < 0 ? Math.cos((-a.jump / 0.9) * Math.PI) * -0.9 : moving && !a.swim && !a.hop ? Math.sin(a.t * 18) * 0.05 : 0;
  }
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
  scene.fog = new THREE.Fog(SKY, 36, SEE);
  const camera = new THREE.PerspectiveCamera(52, 1, 0.2, 70);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9ab07f, 1.7); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.9); sun.position.set(-3, 6, 4); scene.add(sun);

  const tex = pixelTexture();
  // the map in pieces: ground + things per piece; pieces that are too far away are switched off
  const landMat = new THREE.MeshLambertMaterial({ vertexColors: true, map: tex }), boxMat = new THREE.MeshLambertMaterial({ map: tex });
  const lists = plant(), pieces = [];
  for (let cz = 0; cz < SIZE / CHUNK; cz++) for (let cx = 0; cx < SIZE / CHUNK; cx++) {
    const g = new THREE.Group(); g.add(buildLand(landMat, cx * CHUNK, cz * CHUNK));
    const boxes = lists[cz * (SIZE / CHUNK) + cx]; if (boxes.length) g.add(boxMesh(boxes, boxMat));
    scene.add(g); pieces.push({ g, x: (cx + 0.5) * CHUNK, z: (cz + 0.5) * CHUNK });
  }
  const animals = makeAnimals(scene, boxMat);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), new THREE.MeshLambertMaterial({ color: 0x4fa8e0, transparent: true, opacity: 0.72 }));
  water.rotation.x = -Math.PI / 2; water.position.set(mid, WATER + 0.72, mid); scene.add(water);

  // Raluca: `who` is moved and turned, the fox inside is shifted so that her middle is over the spot
  const who = new THREE.Group(); scene.add(who);
  // Raluca is the dog model from Blender; `?raluca=fuchs` shows the old code-built fox
  const actor = /raluca=fuchs/.test(location.search) ? makeFoxActor() : makeDogActor(makeFoxActor);
  actor.root.position.x = 0.1; actor.root.scale.setScalar(0.9);
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
  $('hintText').textContent = touch ? 'Links: laufen · Wischen: umsehen' : 'W A S D: laufen · Leertaste: springen · E: Aktion · Maus: umsehen';
  if (!touch) $('jump').style.display = 'none';
  setTimeout(() => { $('hint').style.opacity = 0; }, 7000);
  window.addEventListener('keydown', (e) => { keys.add(e.code); if (e.code === 'Space') { input.jump = true; e.preventDefault(); } if (e.code === 'KeyE' && !e.repeat) doAction(); });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());
  let yaw = -1.25, lookedAt = 0, pitch = 0.42, stickId = null, lookId = null, sx = 0, sy = 0, lx = 0, ly = 0;
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
      yaw -= (e.clientX - lx) * 0.006; lookedAt = performance.now(); pitch = Math.max(0.12, Math.min(1.1, pitch + (e.clientY - ly) * 0.004));
      lx = e.clientX; ly = e.clientY;
    }
  });
  const up = (e) => {
    if (e.pointerId === stickId) { stickId = null; input.x = input.y = 0; stick.style.display = 'none'; }
    if (e.pointerId === lookId) lookId = null;
  };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  $('jump').addEventListener('pointerdown', (e) => { input.jump = true; e.preventDefault(); });
  $('act').addEventListener('pointerdown', (e) => { e.preventDefault(); doAction(); });
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------------- Raluca's state
  const groundAt = (x, z) => Math.max(at(Math.floor(x), Math.floor(z)), WATER + 0.35); // she wades / swims in water
  const blocked = (x, z, fromY) => {
    const xi = Math.floor(x), zi = Math.floor(z);
    if (xi < 1 || zi < 1 || xi >= SIZE - 1 || zi >= SIZE - 1) return true;
    if (solid[zi * SIZE + xi]) return true;
    return groundAt(x, z) - fromY > 1.05;                       // one block up is fine, more needs a jump
  };
  const P = { x: mid - 1.5, z: mid + 0.5, y: 0, vy: 0, face: 0, speed: 0, phase: 0, air: false };
  P.y = groundAt(P.x, P.z);
  const cam = new THREE.Vector3(), look = new THREE.Vector3();
  let time = 0, blink = 3, blinkT = -1;

  function step(dt) {
    time += dt;
    let mx = input.x, my = input.y;
    if (busy || act) { mx = my = 0; input.jump = false; }
    if (busy) keys.clear();
    if (cheer > 0 && !busy) { cheer -= dt; if (!P.air) input.jump = true; }
    if (!busy && cheer <= 0) checkMarks();
    drawMarks();
    if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
    if (keys.has('KeyW') || keys.has('ArrowUp')) my += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) my -= 1;
    const len = Math.hypot(mx, my); if (len > 1) { mx /= len; my /= len; }
    let power = Math.min(1, len);
    if (keys.has('ShiftLeft') || keys.has('ShiftRight')) power = Math.min(power, 0.4);
    P.sneak = power > 0.05 && power < 0.55;
    const inWater = P.y < WATER + 0.5 && !P.air;
    const weak = needs.food < 15 || needs.water < 15 || needs.energy < 15;
    const target = power * (inWater ? 2.6 : 5.6) * (weak ? 0.6 : 1);
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
      // the camera slowly turns to stay behind her (not while walking towards the camera, not right after looking around)
      if (my > -0.35 && performance.now() - lookedAt > 1500 && !busy) {
        let d = Math.atan2(Math.cos(P.face), -Math.sin(P.face)) - yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
        yaw += d * Math.min(1, dt * 1.7 * power);
      }
    }
    lifeStep(dt, P.speed);
    const g = groundAt(P.x, P.z);
    if (input.jump && !P.air) { P.vy = 7.4; P.air = true; }
    input.jump = false;
    if (act && act.kind === 'pounce' && P.air) {   // the pounce carries her forward
      const vx = act.vx * dt, vz = act.vz * dt;
      if (!blocked(P.x + vx + Math.sign(vx) * 0.3, P.z, P.y + 1)) P.x += vx;
      if (!blocked(P.x, P.z + vz + Math.sign(vz) * 0.3, P.y + 1)) P.z += vz;
    }
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
    if (P.sneak && !P.air && !act) { p.bodyY = -0.08; p.headNod += 0.12; p.earL -= 0.15; p.earR -= 0.15; p.tailUp -= 0.15; }
    if (weak && !P.air) { p.earL += 0.4; p.earR += 0.4; p.tailUp -= 0.2; p.headNod += 0.1; }
    if (act) actPose(p);
    if (P.air) { const t = Math.max(-1, Math.min(1, P.vy / 7.4)); p.fl = p.fr = -0.7 * (0.4 + Math.abs(t)); p.bl = p.br = 0.8 * (0.4 + Math.abs(t)); p.pitch = t * 0.22; p.tailUp = 0.35; }
    blink -= dt; if (blink < 0) { blinkT = 0; blink = 2.5 + Math.random() * 3; }
    if (blinkT >= 0) { blinkT += dt; p.blink = Math.sin(Math.min(1, blinkT / 0.16) * Math.PI); if (blinkT > 0.16) blinkT = -1; }
    if (act && act.kind === 'sleep') p.blink = 1;
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
    // a tree crown between her and the camera: come closer
    let near = false;
    for (let k = 0.25; k <= 1.001; k += 0.08) {
      const x = P.x + (cam.x - P.x) * k, z = P.z + (cam.z - P.z) * k, y = P.y + 1 + (cam.y - P.y - 1) * k, L = LEAF[Math.floor(z) * SIZE + Math.floor(x)];
      if (L && y > L - 0.4) { const kk = Math.max(0.22, k - 0.1); cam.set(P.x + (cam.x - P.x) * kk, P.y + 1 + (cam.y - P.y - 1) * kk, P.z + (cam.z - P.z) * kk); near = true; break; }
    }
    camera.position.lerp(cam, Math.min(1, dt * (near ? 14 : 8)));
    look.set(P.x, P.y + 0.9, P.z); camera.lookAt(look);
  }

  // ---------------- question marks: walk to one → an English exercise
  // All marks are ONE instanced mesh (a "?" made of small cubes), so they cost one draw call.
  const QM = ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'];
  const cells = []; QM.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === '#') cells.push([(c - 2) * 0.2, (6 - r) * 0.2]); }));
  const markMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xffc928 }), MARKS * cells.length);
  markMesh.frustumCulled = false; scene.add(markMesh);
  const ringMesh = new THREE.InstancedMesh(new THREE.RingGeometry(0.75, 0.95, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.8, depthWrite: false }), MARKS);
  ringMesh.frustumCulled = false; scene.add(ringMesh);
  let marks = [], round = 0, found = 0;
  function placeMarks() {
    const r = rng(77 + round * 13); marks = [];
    for (let tries = 0; tries < 4000 && marks.length < MARKS; tries++) {
      const x = 6 + Math.floor(r() * (SIZE - 12)), z = 6 + Math.floor(r() * (SIZE - 12)), h = at(x, z), d = Math.hypot(x - mid, z - mid);
      if (h <= WATER || h >= STONE + 4 || solid[z * SIZE + x] || d < 8 || d > mid - 14) continue;
      if (marks.length < 3 && d > 22) continue;                                   // the first three are close to the start
      if (marks.some((m) => Math.hypot(m.x - x, m.z - z) < 14)) continue;
      marks.push({ x: x + 0.5, z: z + 0.5, y: h, done: false, away: true, item: null });
    }
    const o = rng(900 + round), idx = SENTENCES.map((_, i) => i).sort(() => o() - 0.5);
    marks.forEach((m, i) => { m.item = SENTENCES[idx[i % idx.length]]; });
    found = 0; showCount();
  }
  const showCount = () => { $('count').textContent = `${found} / ${marks.length}`; };
  const mm = new THREE.Matrix4(), mq = new THREE.Quaternion(), mp = new THREE.Vector3(), ms = new THREE.Vector3(), mo = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
  function drawMarks() {
    marks.forEach((m, i) => {
      const spin = time * 1.6 + i, bob = Math.sin(time * 2 + i) * 0.12, show = m.done ? 0 : 1;
      mq.setFromAxisAngle(UP, spin); ms.setScalar(show);
      cells.forEach(([cx, cy], k) => {
        mo.set(cx, cy, 0).applyQuaternion(mq); mp.set(m.x + mo.x, m.y + 1.5 + bob + mo.y, m.z + mo.z);
        mm.compose(mp, mq, ms); markMesh.setMatrixAt(i * cells.length + k, mm);
      });
      mq.identity(); ms.setScalar(show * (1 + Math.sin(time * 3 + i) * 0.08)); mp.set(m.x, m.y + 0.04, m.z);
      mm.compose(mp, mq, ms); ringMesh.setMatrixAt(i, mm);
    });
    markMesh.instanceMatrix.needsUpdate = true; ringMesh.instanceMatrix.needsUpdate = true;
  }
  // arrow at the top: where the nearest open question mark is (as seen from the camera)
  function nearest() {
    let best = null, bd = 1e9;
    for (const m of marks) { if (m.done) continue; const d = Math.hypot(m.x - P.x, m.z - P.z); if (d < bd) { bd = d; best = m; } }
    return best && { m: best, d: bd };
  }
  function checkMarks() {
    const n = nearest();
    if (!n) { $('arrow').style.visibility = 'hidden'; $('dist').textContent = ''; return; }
    const dx = n.m.x - P.x, dz = n.m.z - P.z;
    // screen angle: "up" on the screen is away from the camera
    const fwd = -Math.sin(yaw) * dx - Math.cos(yaw) * dz, right = Math.cos(yaw) * dx - Math.sin(yaw) * dz;
    $('arrow').style.visibility = 'visible';
    $('arrow').style.transform = `rotate(${Math.atan2(right, fwd)}rad)`;
    $('dist').textContent = `${Math.round(n.d)} m`;
    for (const m of marks) {
      if (m.done) continue;
      const d = Math.hypot(m.x - P.x, m.z - P.z);
      if (d > 2.6) m.away = true;                                 // after "Später" she must walk away first
      else if (d < 1.3 && m.away && !P.air) { m.away = false; openExercise(m); }
    }
  }

  // ---------------- the exercise card (build the sentence, like in the lessons)
  let busy = false, cheer = 0;
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const same = (a, b) => { const n = (t) => t.toLowerCase().replace(/[.?!,]/g, '').replace(/\s+/g, ' ').trim(); return n(a) === n(b); };
  function openExercise(m) {
    busy = true; keys.clear(); input.x = input.y = 0; stickId = null; stick.style.display = 'none';
    const item = m.item, card = $('card');
    const words = item.en.replace(/[.?!]+$/, '').split(/\s+/);
    const pool = [...words, ...(item.extra || [])].map((w, id) => ({ w, id })).sort(() => Math.random() - 0.5);
    let chosen = [], locked = false, wrong = 0;
    card.innerHTML = `<p class="small">Bau den Satz auf Englisch.</p><p class="de">${esc(item.de)}</p>
      <div class="answer" id="answer"></div><div class="tiles" id="pool"></div><div id="result"></div>
      <div class="row"><button class="btn" id="later">Später</button><button class="btn primary" id="check" disabled>Prüfen</button></div>`;
    $('sheet').classList.add('open');
    const draw = () => {
      $('answer').innerHTML = chosen.map((t) => `<button class="tile" data-id="${t.id}">${esc(t.w)}</button>`).join('') || '<span class="ph">Tippe die Wörter in der richtigen Reihenfolge an.</span>';
      $('pool').innerHTML = pool.map((t) => `<button class="tile ${chosen.includes(t) ? 'used' : ''}" data-id="${t.id}" ${chosen.includes(t) ? 'disabled' : ''}>${esc(t.w)}</button>`).join('');
      if ($('check')) $('check').disabled = !chosen.length;
    };
    card.onclick = (ev) => {
      const b = ev.target.closest('.tile'); if (!b || locked) return;
      const t = pool.find((x) => x.id === Number(b.dataset.id));
      if (b.parentElement.id === 'pool') chosen.push(t); else chosen = chosen.filter((x) => x !== t);
      $('answer').className = 'answer'; $('result').innerHTML = ''; draw();
    };
    const close = () => { $('sheet').classList.remove('open'); card.onclick = null; busy = false; };
    $('later').onclick = close;
    $('check').onclick = () => {
      if (same(chosen.map((t) => t.w).join(' '), item.en)) {
        locked = true; $('answer').className = 'answer right';
        $('result').innerHTML = `<p class="ok">Richtig! 🎉</p><p class="en">${esc(item.en)}</p>`;
        card.querySelector('.row').innerHTML = '<button class="btn" id="hear">🔊 Anhören</button><button class="btn primary" id="next">Weiter</button>';
        play(item.en);
        $('hear').onclick = () => play(item.en);
        $('next').onclick = () => { m.done = true; found++; showCount(); cheer = 1.2; close(); save(); if (found === marks.length) { round++; setTimeout(() => { toast('Alle gefunden! Neue Fragezeichen sind da.'); placeMarks(); save(); }, 1500); } };
      } else {
        wrong++; $('answer').className = 'answer wrong';
        $('result').innerHTML = wrong >= 2 ? `<p class="no">Fast! Richtig ist:</p><p class="en">${esc(item.en)}</p>` : '<p class="no">Fast! Versuch es noch mal.</p>';
        chosen = []; setTimeout(() => { if (!locked) { $('answer').className = 'answer'; draw(); } }, 700);
      }
    };
    draw();
  }
  function toast(text) { $('hintText').textContent = text; $('hint').style.opacity = 1; setTimeout(() => { $('hint').style.opacity = 0; }, 4000); }
  placeMarks();

  // ---------------- fox life: hunger, thirst, energy · eat, drink, sleep, sniff · day and night · saving
  const needs = { food: 100, water: 100, energy: 100 };
  const DAY = 480;                 // one day = 8 minutes
  let tday = 0.3;                  // 0 = midnight, 0.25 = sunrise, 0.5 = noon, 0.75 = sunset
  let act = null;                  // { kind, t, d } while she eats, drinks, sleeps or sniffs
  const warned = {};
  const WARN = { food: 'Raluca hat Hunger. Friss Beeren an einem Busch!', water: 'Raluca hat Durst. Trink am Wasser!', energy: 'Raluca ist müde. Schlaf in deinem Bau!' };
  const nearBush = () => BUSHES.some(([x, z]) => Math.hypot(x - P.x, z - P.z) < 1.9);
  const nearWater = () => { if (P.y < WATER + 0.5) return true; for (let a = 0; a < 8; a++) { const t = (a / 8) * Math.PI * 2; if (at(Math.floor(P.x + Math.cos(t) * 1.3), Math.floor(P.z + Math.sin(t) * 1.3)) <= WATER) return true; } return false; };
  const nearDen = () => Math.hypot(DEN[0] + 0.5 - P.x, DEN[1] + 0.5 - P.z) < 3.4;
  const mouseNear = () => { let best = null, bd = 4.5; for (const a of animals) if (a.kind === 'mouse' && !(a.gone > 0)) { const d = Math.hypot(a.x - P.x, a.z - P.z); if (d < bd) { bd = d; best = a; } } return best; };
  let caught = 0;
  function whatCanIDo() {
    if (nearDen()) return ['sleep', '😴 Schlafen'];
    if (mouseNear()) return ['pounce', '🐾 Fangen'];
    if (nearBush()) return ['eat', '🫐 Fressen'];
    if (nearWater()) return ['drink', '💧 Trinken'];
    return ['sniff', '👃 Schnüffeln'];
  }
  function doAction() {
    if (act || busy || P.air) return;
    const [kind] = whatCanIDo();
    if (kind === 'sleep') { goSleep(); return; }
    if (kind === 'sniff') sniff();
    if (kind === 'pounce') {   // jump at the mouse: a little short or long, so a good spot (close, sneaked up) matters
      const m = mouseNear(), dx = m.x - P.x, dz = m.z - P.z, d = Math.hypot(dx, dz);
      P.face = Math.atan2(dz, -dx); P.vy = 6.2; P.air = true;
      const reach = Math.min(d, 3.6) / 0.6;   // the jump lasts about 0.6 s
      act = { kind, t: 0, d: 2, target: m, vx: (dx / d) * reach, vz: (dz / d) * reach };
      return;
    }
    act = { kind, t: 0, d: kind === 'eat' ? 1.8 : kind === 'drink' ? 2.2 : 1.6 };
    if (kind === 'drink') { // turn to the water
      for (let a = 0; a < 16; a++) { const t = (a / 16) * Math.PI * 2; if (at(Math.floor(P.x + Math.cos(t) * 1.3), Math.floor(P.z + Math.sin(t) * 1.3)) <= WATER) { act.face = Math.atan2(Math.sin(t), -Math.cos(t)); break; } }
    }
  }
  function actPose(p) {
    const t = act.t;
    if (act.kind === 'eat' || act.kind === 'drink') {
      const down = Math.min(1, t / 0.3, (act.d - t) / 0.3);
      p.pitch = -0.12 * down; p.headNod = 0.85 * down + Math.sin(t * (act.kind === 'eat' ? 16 : 10)) * 0.07 * down;
      p.fl = p.fr = -0.15 * down; p.tail = Math.sin(t * 7) * 0.5; p.tailUp = 0.25;
    } else if (act.kind === 'sniff') {
      const down = Math.min(1, t / 0.25, (act.d - t) / 0.25);
      p.headNod = 0.5 * down + Math.sin(t * 28) * 0.05 * down; p.headTurn = Math.sin(t * 4) * 0.35 * down; p.earL = p.earR = -0.2 * down; p.tailUp = 0.3;
    } else if (act.kind === 'pounce') {
      // the jump pose comes from the air pose below
    } else if (act.kind === 'sleep') {
      Object.assign(p, { bodyY: -0.34, fl: -1.45, fr: -1.45, bl: 1.45, br: 1.45, flS: 0.9, frS: 0.9, blS: 0.7, brS: 0.7, headNod: 0.25, earL: 0.4, earR: 0.4, tail: 0, tailUp: -0.3 });
    }
  }
  function lifeStep(dt, speed) {
    tday = (tday + dt / DAY) % 1;
    const run = 1 + Math.min(1, speed / 5.6) * 0.6;
    needs.food = Math.max(0, needs.food - (dt * 100 / 420) * run);
    needs.water = Math.max(0, needs.water - (dt * 100 / 300) * run);
    needs.energy = Math.max(0, needs.energy - (dt * 100 / 600) * run);
    if (act) {
      act.t += dt;
      if (act.face != null) { let d = act.face - P.face; d = Math.atan2(Math.sin(d), Math.cos(d)); P.face += d * Math.min(1, dt * 8); }
      if (act.kind === 'pounce' && act.t > 0.2 && !P.air) {
        const m = act.target, d = Math.hypot(m.x - P.x, m.z - P.z);
        if (d < 1.3 && !(m.gone > 0)) { m.gone = 25; caught++; needs.food = Math.min(100, needs.food + 30); cheer = 0.8; toast(caught === 1 ? 'Gefangen! 🐭  a mouse – Raluca is a good hunter!' : 'Gefangen! 🐭  a mouse'); }
        else toast(d < 3 ? 'Knapp daneben! Schleich dich näher an.' : 'Die Maus ist weg! Langsam anschleichen hilft.');
        act = null; save(); return;
      }
      if (act.t >= act.d && act.kind !== 'sleep') {
        if (act.kind === 'eat') { needs.food = Math.min(100, needs.food + 40); toast('Mmm, Beeren! 🫐  berries'); }
        if (act.kind === 'drink') { needs.water = 100; toast('Ahh, frisches Wasser! 💧  water'); }
        act = null; save();
      }
    }
    for (const k of ['food', 'water', 'energy']) {
      if (needs[k] < 25 && !warned[k]) { warned[k] = true; toast(WARN[k]); }
      if (needs[k] > 40) warned[k] = false;
    }
  }
  function goSleep() {
    act = { kind: 'sleep', t: 0, d: 99 };
    // walk into the door: stand in front of the den, looking at it
    P.x = DEN[0] - 1.6; P.z = DEN[1] + 0.5; P.y = groundAt(P.x, P.z); P.face = Math.PI;
    $('fade').style.opacity = 1;
    const night = tday > 0.7 || tday < 0.22;
    setTimeout(() => {
      if (night) tday = 0.27; else tday = (tday + 0.08) % 1;
      needs.energy = 100; warned.energy = false;
      $('fade').style.opacity = 0;
      setTimeout(() => { act = null; toast(night ? 'Guten Morgen! ☀️  Good morning, Raluca!' : 'Ein kleines Nickerchen. 😴  a nap'); save(); }, 900);
    }, 1800);
  }

  // sniff: a trail of glowing dots shows the way to the nearest question mark
  const TRAIL = 16;
  const trailMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), new THREE.MeshBasicMaterial({ color: 0xfff09a }), TRAIL);
  trailMesh.frustumCulled = false; trailMesh.visible = false; scene.add(trailMesh);
  let trail = null;
  function sniff() {
    const n = nearest();
    if (!n) { toast('Hier riecht nichts Neues.'); return; }
    const pts = [], len = Math.min(n.d, 14), dx = (n.m.x - P.x) / n.d, dz = (n.m.z - P.z) / n.d;
    for (let i = 0; i < TRAIL; i++) { const k = 1 + (i / (TRAIL - 1)) * (len - 1), x = P.x + dx * k, z = P.z + dz * k; pts.push([x, z, groundAt(x, z)]); }
    trail = { t: 0, pts, side: [-dz, dx] };
    if (n.d > 14) toast(`Die Spur führt weiter … noch ${Math.round(n.d)} m`);
  }
  const tm = new THREE.Matrix4(), tq = new THREE.Quaternion(), tp = new THREE.Vector3(), ts = new THREE.Vector3();
  function drawTrail(dt) {
    if (!trail) { trailMesh.visible = false; return; }
    trail.t += dt; trailMesh.visible = true;
    const fade = Math.min(1, trail.t / 0.3, (5 - trail.t) / 0.8);
    trail.pts.forEach(([x, z, y], i) => {
      const w = Math.sin(i * 0.9 + trail.t * 3) * 0.35, pulse = 0.6 + 0.4 * Math.sin(trail.t * 7 - i * 0.7);
      const shown = trail.t * 9 > i ? 1 : 0;
      tp.set(x + trail.side[0] * w, y + 0.35 + Math.sin(trail.t * 4 + i) * 0.08, z + trail.side[1] * w); ts.setScalar(Math.max(0, fade * pulse * shown));
      tm.compose(tp, tq, ts); trailMesh.setMatrixAt(i, tm);
    });
    trailMesh.instanceMatrix.needsUpdate = true;
    if (trail.t > 5) trail = null;
  }

  // day and night: sky, fog and light follow the time of day
  const C_DAY = new THREE.Color(0xbfe3f6), C_DUSK = new THREE.Color(0xf4b183), C_NIGHT = new THREE.Color(0x1c2a4a), skyC = new THREE.Color(), tmpC = new THREE.Color();
  const SUN_DAY = new THREE.Color(0xfff2d8), SUN_DUSK = new THREE.Color(0xffb070), SUN_NIGHT = new THREE.Color(0x8ea8ff);
  function sky() {
    const e = Math.sin((tday - 0.25) * Math.PI * 2);             // −1 midnight … 1 noon
    const day = THREE.MathUtils.smoothstep(e, -0.25, 0.3), dusk = Math.max(0, 1 - Math.abs(e) / 0.28) * 0.85;
    skyC.copy(C_NIGHT).lerp(C_DAY, day).lerp(C_DUSK, dusk * (0.4 + 0.6 * day));
    scene.background.copy(skyC); scene.fog.color.copy(skyC);
    hemi.intensity = 0.55 + 1.15 * day; hemi.color.copy(tmpC.set(0xffffff).lerp(SUN_NIGHT, 1 - day));
    sun.intensity = 0.25 + 1.65 * day; sun.color.copy(tmpC.copy(SUN_NIGHT).lerp(SUN_DAY, day).lerp(SUN_DUSK, dusk));
    const a = (tday - 0.25) * Math.PI * 2; sun.position.set(-Math.cos(a) * 4, Math.max(1.5, Math.sin(a) * 7), 3);
    return e;
  }

  // the panel at the top left
  function showNeeds(e) {
    const bar = (id, v) => { const b = $(id); b.style.width = v + '%'; b.style.background = v < 25 ? '#e0603a' : v < 50 ? '#e8b23a' : '#5bb04a'; };
    bar('bFood', needs.food); bar('bWater', needs.water); bar('bEnergy', needs.energy);
    $('clock').textContent = e > 0.05 ? '☀️' : e > -0.2 ? '🌅' : '🌙';
    const [, label] = whatCanIDo(); if ($('act').textContent !== label) $('act').textContent = label;
  }

  // saving: everything that matters, in this browser (not in Miri's app data)
  const KEY = 'miri-welt';
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 1, x: P.x, z: P.z, face: P.face, tday, ...needs, caught, round, done: marks.map((m, i) => (m.done ? i : -1)).filter((i) => i >= 0), at: Date.now() }));
    } catch { /* private mode: no saving */ }
  }
  function load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { d = null; }
    if (!d || d.v !== 1) return;
    if (Number.isFinite(d.x) && Number.isFinite(d.z) && !blocked(d.x, d.z, groundAt(d.x, d.z))) { P.x = d.x; P.z = d.z; P.y = groundAt(P.x, P.z); P.face = d.face || 0; }
    if (Number.isFinite(d.tday)) tday = d.tday;
    if (Number.isFinite(d.caught)) caught = d.caught;
    for (const k of ['food', 'water', 'energy']) if (Number.isFinite(d[k])) needs[k] = Math.max(30, d[k]);   // after a break she is never starving
    if (d.round > 0) { round = d.round; placeMarks(); }
    for (const i of d.done || []) if (marks[i] && !marks[i].done) { marks[i].done = true; found++; }
    showCount();
    yaw = Math.atan2(Math.cos(P.face), -Math.sin(P.face));
  }
  load();
  setInterval(save, 4000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('pagehide', save);

  // ---------------- loop + speed measurement
  let last = performance.now(), frames = 0, since = last, slow = 0;
  const stats = { fps: 0, ratio, calls: 0, tris: 0 };
  window.WELT = { actor, P, stats, input, setYaw: (v) => { yaw = v; }, marks: () => marks, groundAt, animals, at, spots: { HILL, POND, DEN, RIVER, PONDS, RIVERS }, needs, life: () => ({ tday, act, trail: !!trail }), setTime: (t) => { tday = t; }, doAction, save, BUSHES, caught: () => caught };
  camera.position.set(P.x + 4, P.y + 4, P.z + 4);
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    step(dt);
    moveAnimals(animals, dt, P, time);
    drawTrail(dt);
    const e = sky();
    if ((frames & 7) === 0) showNeeds(e);
    for (const pc of pieces) pc.g.visible = Math.hypot(pc.x - camera.position.x, pc.z - camera.position.z) < SEE + CHUNK * 0.72;
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
