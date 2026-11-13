// Ralucas Welt – step 2, the world: meadow with the den, forest, hill, river and pond; animals walk around.
// Digging (🐾 Graben, hold it / key F): she digs away the earth block in front of her, like in a block game –
// holes, tunnels through hills, ponds when she digs below the water. Mounds of earth hide a bone, coin, carrot,
// worm, potato or – on the hill – a treasure.
// Step 7: building. 🧱 Bauen (key G) puts an earth block in front of her (uses dug earth 🟫: walls, steps, bridges);
// at the den the 🏠 menu builds things (leaf bed, lamp, fence …) from earth and found things (English names, sound).
// Step 6: animal friends (Olli the owl at the den, Rosie the rabbit, Hugo the hedgehog, Luna the owl on the hill)
// talk easy English (friends.js); Miri answers by voice (server checks it) or typing, or brings them things → hearts.
// Mice: they nibble and dash about; if they hear her they freeze, then zig-zag to their hole. Fox hunting like a real
// fox: sneak close, listen, then a high jump and a dive nose-first; caught mice are carried, then eaten.
// Step 4/5: fishing at the water; hidden things (feather, shell, crystal …) to find; the book (📖, key B) lists
// every English word she has found, caught or eaten, with sound.
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
import friendData from './friends.js';
import { startRecording, canRecord } from '../rec.js';
import travel from '../content/travel.js';
import friends from '../content/friends.js';
import doctor from '../content/doctor.js';
import holiday from '../content/holiday.js';
import cafe from '../content/cafe.js';
import shopping from '../content/shopping.js';

// the "build the sentence" exercises of all lessons: { en, de, extra? }
const TOPICS = [travel, friends, doctor, holiday, cafe, shopping];
const SENTENCES = TOPICS.flatMap((t) => t.lessons.flatMap((l) => l.build || []));
// more exercises at the question marks: say it in English (someone talks to her); repeat-after-me is kept but not used
const SAYS = TOPICS.flatMap((t) => t.lessons.flatMap((l) => l.say || []));
const REPEATS = TOPICS.flatMap((t) => t.lessons.flatMap((l) => l.repeat || []));
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
const BOX = new THREE.BoxGeometry(1, 1, 1), UPV = new THREE.Vector3(0, 1, 0);
function boxMesh(boxes, mat) {
  const mesh = new THREE.InstancedMesh(BOX, mat, boxes.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
  boxes.forEach((b, i) => { p.set(b[0], b[1], b[2]); s.set(b[3], b[4], b[5]); q.setFromAxisAngle(UPV, b[7] || 0); m.compose(p, q, s); mesh.setMatrixAt(i, m); mesh.setColorAt(i, c.setHex(b[6])); });
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
const DECO = new Map();   // cell → [map piece, first box, last box] of flowers, grass, mushrooms on that block
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
    if (wet) { if (k < 0.3) { const ci = Math.floor(z / CHUNK) * (SIZE / CHUNK) + Math.floor(x / CHUNK), from = lists[ci].length; place(lists, 'reeds', cx, y, cz, turn); DECO.set(z * SIZE + x, [ci, from, lists[ci].length]); } else if (k < 0.34) place(lists, 'rock', cx, y, cz, turn, 0.7); continue; }
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
    else {
      const ci = Math.floor(z / CHUNK) * (SIZE / CHUNK) + Math.floor(x / CHUNK), from = lists[ci].length;
      if (k > 0.4 && k < (forest ? 0.412 : 0.401)) place(lists, 'mushroom', cx, y, cz, turn, 0.45 + r() * 0.4);
      else if (k > 0.5 && k < (forest ? 0.505 : 0.522)) place(lists, 'flowers', cx, y, cz, turn, 0.8 + r() * 0.5);
      else if (k > 0.7 && k < 0.74) for (let i = 0; i < 3; i++) { const gh = 0.18 + r() * 0.22; lists[ci].push([x + 0.15 + r() * 0.7, h + gh / 2, z + 0.15 + r() * 0.7, 0.08, gh, 0.08, 0x4d9a40]); }
      if (lists[ci].length > from) DECO.set(z * SIZE + x, [ci, from, lists[ci].length]);
    }
  }
  return lists;
}


// ------------------------------------------------------------------ things to find (step 5): small models + where they lie
// boxes like in models.js: [x, y, z, sx, sy, sz, colour], about 0.4 big
const FIND_KINDS = {
  feather: { en: 'feather', de: 'Feder', icon: '🪶', boxes: [[0, 0.03, 0, 0.5, 0.03, 0.04, 0xf3efe6], [0.02, 0.04, 0.05, 0.36, 0.02, 0.07, 0xd8473a], [0.02, 0.04, -0.05, 0.36, 0.02, 0.07, 0xd8473a], [-0.2, 0.04, 0, 0.12, 0.02, 0.06, 0x3a3a3a]] },
  pinecone: { en: 'pine cone', de: 'Tannenzapfen', icon: '🌲', boxes: [[0, 0.06, 0, 0.16, 0.12, 0.16, 0x7a4d2a], [0, 0.15, 0, 0.13, 0.08, 0.13, 0x8f5d33], [0, 0.22, 0, 0.09, 0.07, 0.09, 0x7a4d2a], [0, 0.28, 0, 0.04, 0.05, 0.04, 0x5c3a1f]] },
  acorn: { en: 'acorn', de: 'Eichel', icon: '🌰', boxes: [[0, 0.07, 0, 0.12, 0.13, 0.12, 0xc58b45], [0, 0.16, 0, 0.15, 0.06, 0.15, 0x6e4a2b], [0, 0.21, 0, 0.03, 0.05, 0.03, 0x4f3420]] },
  shell: { en: 'shell', de: 'Muschel', icon: '🐚', boxes: [[0, 0.04, 0, 0.26, 0.06, 0.18, 0xf6d9c9], [0, 0.07, 0, 0.2, 0.04, 0.14, 0xf3b9a8], [0, 0.09, 0, 0.12, 0.03, 0.1, 0xf6d9c9], [0.13, 0.04, 0, 0.06, 0.05, 0.07, 0xe0a690]] },
  crystal: { en: 'crystal', de: 'Kristall', icon: '💎', boxes: [[0, 0.16, 0, 0.1, 0.32, 0.1, 0x9b7bff], [0.09, 0.1, 0.03, 0.08, 0.2, 0.08, 0x7fe0ff], [-0.08, 0.08, -0.03, 0.07, 0.16, 0.07, 0xc3a8ff], [0, 0.34, 0, 0.05, 0.05, 0.05, 0xe8ddff]] },
  key: { en: 'key', de: 'Schlüssel', icon: '🗝️', boxes: [[-0.12, 0.03, 0, 0.14, 0.04, 0.14, 0xe5b93a], [-0.12, 0.035, 0, 0.06, 0.05, 0.06, 0x8a6a20], [0.06, 0.03, 0, 0.24, 0.035, 0.04, 0xe5b93a], [0.15, 0.03, 0.04, 0.04, 0.035, 0.06, 0xe5b93a], [0.1, 0.03, 0.04, 0.03, 0.035, 0.05, 0xe5b93a]] },
  apple: { en: 'apple', de: 'Apfel', icon: '🍎', boxes: [[0, 0.11, 0, 0.2, 0.2, 0.2, 0xd8322c], [0, 0.11, 0, 0.16, 0.22, 0.16, 0xc22a25], [0, 0.24, 0, 0.03, 0.07, 0.03, 0x5c3a1f], [0.05, 0.26, 0, 0.08, 0.02, 0.05, 0x4caa40]] },
  snail: { en: 'snail', de: 'Schnecke', icon: '🐌', boxes: [[0, 0.03, 0, 0.32, 0.05, 0.08, 0xd9c79a], [-0.17, 0.08, 0, 0.06, 0.08, 0.05, 0xd9c79a], [0.04, 0.13, 0, 0.18, 0.18, 0.1, 0xa86a35], [0.04, 0.13, 0, 0.1, 0.1, 0.11, 0xd6a35f], [0.04, 0.13, 0, 0.04, 0.04, 0.12, 0x7a4a22]] },
  leaf: { en: 'leaf', de: 'Blatt', icon: '🍂', boxes: [[0, 0.02, 0, 0.3, 0.02, 0.18, 0xe58a2c], [0, 0.03, 0, 0.32, 0.015, 0.03, 0xb85d1a], [0.17, 0.02, 0, 0.08, 0.02, 0.03, 0x8a5a2a]] },
};
// things for the den (step 7): boxes [x, y, z, sx, sy, sz, colour] around the den's middle; `glow` boxes shine at night
function fencePosts() {
  const b = [];
  for (let k = 0; k < 28; k++) {
    const t = (k / 28) * Math.PI * 2; if (Math.abs(Math.atan2(Math.sin(t - Math.PI), Math.cos(t - Math.PI))) < 0.5) continue;   // a gap at the door
    const x = Math.cos(t) * 4.6, z = Math.sin(t) * 4.6;
    b.push([x, 0.35, z, 0.14, 0.7, 0.14, 0x8a5a2e]);
    const t2 = ((k + 1) / 28) * Math.PI * 2;
    if (Math.abs(Math.atan2(Math.sin(t2 - Math.PI), Math.cos(t2 - Math.PI))) >= 0.5) { const x2 = Math.cos(t2) * 4.6, z2 = Math.sin(t2) * 4.6, l = Math.hypot(x2 - x, z2 - z);
      for (const y of [0.28, 0.55]) b.push([(x + x2) / 2, y, (z + z2) / 2, l, 0.07, 0.07, 0xa8743e, Math.atan2(-(z2 - z), x2 - x)]); }
  }
  return b;
}
const DECOR = [
  { id: 'bed', en: 'leaf bed', de: 'Blätterbett', icon: '🍂', cost: { earth: 3, leaf: 2 }, at: [-2.9, 2.5],
    boxes: [[0, 0.06, 0, 1.2, 0.12, 0.85, 0x7a5533], [0, 0.15, 0, 1.05, 0.07, 0.7, 0xe58a2c], [0.25, 0.2, 0.12, 0.35, 0.04, 0.28, 0xd8473a], [-0.28, 0.2, -0.1, 0.4, 0.04, 0.22, 0xf0b13a], [0.05, 0.21, -0.2, 0.3, 0.04, 0.2, 0xb85d1a]] },
  { id: 'lamp', en: 'mushroom lamp', de: 'Pilzlampe', icon: '🍄', cost: { earth: 2, crystal: 1 }, at: [-3.1, -2.5],
    boxes: [[0, 0.3, 0, 0.18, 0.6, 0.18, 0xf3ead8], [0, 0.66, 0, 0.7, 0.16, 0.7, 0xd8322c], [0, 0.78, 0, 0.45, 0.1, 0.45, 0xd8322c], [0.2, 0.75, 0.2, 0.1, 0.05, 0.1, 0xffffff], [-0.22, 0.72, -0.05, 0.1, 0.05, 0.1, 0xffffff]],
    glow: [[0, 0.52, 0, 0.32, 0.12, 0.32, 0xfff1a0]] },
  { id: 'garden', en: 'flower garden', de: 'Blumengarten', icon: '🌷', cost: { earth: 4 }, at: [0.3, 3.2],
    boxes: [[0, 0.08, 0, 2.2, 0.16, 0.9, 0x6e4a2b], ...[[-0.8, 0xff7f9e], [-0.4, 0xffd84a], [0, 0xb48cff], [0.4, 0xffffff], [0.8, 0xff9a3c]].flatMap(([x, c], i) => [[x, 0.32, (i % 2 ? 0.15 : -0.15), 0.06, 0.32, 0.06, 0x3f8f3a], [x, 0.5, (i % 2 ? 0.15 : -0.15), 0.2, 0.12, 0.2, c]])] },
  { id: 'path', en: 'shell path', de: 'Muschelweg', icon: '🐚', cost: { earth: 5, shell: 2 }, at: [-3.4, 0],
    boxes: [0, 1, 2, 3].flatMap((k) => [[-k * 0.75, 0.03, (k % 2 ? 0.1 : -0.1), 0.6, 0.06, 0.6, 0xe9dcc8], [-k * 0.75 + 0.1, 0.07, 0.15, 0.14, 0.04, 0.1, 0xf3b9a8]]) },
  { id: 'chime', en: 'feather chime', de: 'Federspiel', icon: '🪶', cost: { earth: 1, feather: 2 }, at: [-2.3, 1.4],
    boxes: [[0, 0.7, 0, 0.08, 1.4, 0.08, 0x8a5a2e], [-0.25, 1.38, 0, 0.6, 0.06, 0.06, 0x8a5a2e], [-0.45, 1.15, 0, 0.02, 0.4, 0.02, 0xf3efe6], [-0.45, 0.88, 0, 0.06, 0.24, 0.1, 0xd8473a], [-0.25, 1.15, 0, 0.02, 0.4, 0.02, 0xf3efe6], [-0.25, 0.9, 0, 0.06, 0.22, 0.1, 0xf3efe6]] },
  { id: 'basket', en: 'apple basket', de: 'Apfelkorb', icon: '🍎', cost: { earth: 2, apple: 2 }, at: [1.6, -3],
    boxes: [[0, 0.17, 0, 0.6, 0.34, 0.45, 0xb98a4e], [0, 0.3, 0, 0.62, 0.05, 0.47, 0x8a6236], [-0.12, 0.38, 0, 0.18, 0.18, 0.18, 0xd8322c], [0.13, 0.38, 0.06, 0.18, 0.18, 0.18, 0xc22a25], [0.02, 0.46, -0.08, 0.17, 0.17, 0.17, 0xd8322c]] },
  { id: 'chest', en: 'treasure chest', de: 'Schatztruhe', icon: '💰', cost: { earth: 3, treasure: 1 }, at: [2.9, 0.4],
    boxes: [[0, 0.22, 0, 0.8, 0.44, 0.55, 0x7a4d2a], [0, 0.5, 0, 0.82, 0.14, 0.57, 0x8f5d33], [0, 0.3, 0, 0.84, 0.06, 0.59, 0xe5b93a], [-0.42, 0.35, 0, 0.04, 0.14, 0.12, 0xe5b93a]],
    glow: [[0.05, 0.6, 0, 0.5, 0.05, 0.3, 0xffe27a]] },
  { id: 'fence', en: 'fence', de: 'Zaun', icon: '🪵', cost: { earth: 8, pinecone: 1 }, at: [0, 0], boxes: fencePosts() },
];
// things Raluca can dig up at a mound of earth
const DIG_KINDS = {
  bone: { en: 'bone', de: 'Knochen', icon: '🦴' }, coin: { en: 'coin', de: 'Münze', icon: '🪙' },
  carrot: { en: 'carrot', de: 'Karotte', icon: '🥕' }, worm: { en: 'worm', de: 'Wurm', icon: '🪱' },
  potato: { en: 'potato', de: 'Kartoffel', icon: '🥔' }, treasure: { en: 'treasure', de: 'Schatz', icon: '💰' },
};
const DIG_ORDER = ['bone', 'worm', 'carrot', 'coin', 'potato', 'bone', 'worm', 'coin', 'carrot', 'potato', 'worm', 'bone', 'coin', 'treasure'];
function placeDigs() {
  const r = rng(777), list = [];
  for (let tries = 0; tries < 8000 && list.length < DIG_ORDER.length; tries++) {
    const x = 8 + Math.floor(r() * (SIZE - 16)), z = 8 + Math.floor(r() * (SIZE - 16)), h = at(x, z), d = Math.hypot(x - mid, z - mid);
    if (h <= WATER + 1 || h >= STONE || solid[z * SIZE + x] || d < (list.length < 2 ? 5 : 9) || d > (list.length < 2 ? 14 : mid - 12)) continue;
    if (list.some((g) => Math.hypot(g.x - x, g.z - z) < 11)) continue;
    if (Math.abs(x - DEN[0]) <= 3 && Math.abs(z - DEN[1]) <= 3) continue;
    // the treasure lies far away, on the hill
    const kind = DIG_ORDER[list.length];
    if (kind === 'treasure' && Math.hypot(x - HILL[0], z - HILL[1]) > 20) continue;
    list.push({ kind, x: x + 0.5, z: z + 0.5, y: h, dug: false });
  }
  return list;
}
const MOUND = [[0, 0.06, 0, 0.9, 0.12, 0.7, 0x8a623c], [0.05, 0.15, -0.02, 0.6, 0.1, 0.45, 0x7a5533], [-0.05, 0.22, 0.03, 0.3, 0.07, 0.25, 0x8a623c],
  [0.3, 0.13, 0.22, 0.12, 0.06, 0.1, 0x6e4a2b], [-0.35, 0.1, -0.2, 0.14, 0.06, 0.12, 0x6e4a2b], [0.15, 0.28, 0.0, 0.05, 0.12, 0.05, 0x4d9a40]];
// things the book also counts, though they are not lying around
const BOOK_EXTRA = {
  mouse: { en: 'mouse', de: 'Maus', icon: '🐭' }, fish: { en: 'fish', de: 'Fisch', icon: '🐟' },
  berries: { en: 'berries', de: 'Beeren', icon: '🫐' }, water: { en: 'water', de: 'Wasser', icon: '💧' },
};
function placeFinds() {
  const r = rng(4242), list = [];
  const want = { feather: 4, pinecone: 3, acorn: 3, shell: 4, crystal: 3, key: 2, apple: 3, snail: 3, leaf: 3 };
  const ok = {
    shell: (x, z, h) => h === WATER + 1 && nearWater(x, z, 1),
    crystal: (x, z, h) => h >= STONE - 3,
    pinecone: (x, z, h) => z < mid - 25 && h < STONE,
    snail: (x, z, h) => nearWater(x, z, 3) && h > WATER,
    acorn: (x, z, h) => noise(x / 18 + 7, z / 18 + 3) > 0.52 && h < STONE,
    leaf: (x, z, h) => noise(x / 18 + 7, z / 18 + 3) > 0.52 && h < STONE,
    apple: (x, z, h) => noise(x / 18 + 7, z / 18 + 3) <= 0.52 && h < STONE,
  };
  for (const [kind, n] of Object.entries(want)) {
    let got = 0;
    for (let tries = 0; tries < 6000 && got < n; tries++) {
      const x = 8 + Math.floor(r() * (SIZE - 16)), z = 8 + Math.floor(r() * (SIZE - 16)), h = at(x, z), d = Math.hypot(x - mid, z - mid);
      if (h <= WATER || solid[z * SIZE + x] || d < 6 || d > mid - 12) continue;
      if (ok[kind] && !ok[kind](x, z, h)) continue;
      if (list.some((f) => Math.hypot(f.x - x, f.z - z) < 10)) continue;
      list.push({ kind, x: x + 0.3 + r() * 0.4, z: z + 0.3 + r() * 0.4, y: h, spin: r() * 6, got: false }); got++;
    }
  }
  return list;
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
  const HOLE = [[0, 0.015, 0, 0.3, 0.03, 0.3, 0x24170c], [0.2, 0.04, 0, 0.1, 0.08, 0.36, 0x7a5533], [-0.2, 0.04, 0, 0.1, 0.08, 0.36, 0x7a5533], [0, 0.04, 0.2, 0.3, 0.07, 0.1, 0x8a623c], [0, 0.04, -0.2, 0.3, 0.06, 0.1, 0x8a623c]];
  for (const a of list) if (a.kind === 'mouse') { const h = boxMesh(HOLE, mat); h.position.set(a.hx, at(Math.floor(a.hx), Math.floor(a.hz)), a.hz); scene.add(h); a.hole = h; }
  for (let i = 0; i < 3; i++) add('hedgehog', mid + (r() * 2 - 1) * 40, mid + (r() * 2 - 1) * 40, 12, { speed: 0.6, roam: 6 });
  add('owl', DEN[0] - 1, DEN[1] + 5, 3, { speed: 0, sit: true });
  add('owl', HILL[0] + 22, HILL[1] + 22, 8, { speed: 0, sit: true });
  // fish in every pond and along the rivers
  const deep = (x, z) => at(x, z) <= 1;
  PONDS.forEach(([px, pz, pr], i) => { for (let k = 0; k < (i === 0 ? 7 : i === 3 ? 2 : 4); k++) add('fish', px, pz, pr * 0.6, { speed: 1.3, swim: true, roam: pr * 0.5, jump: 4 + r() * 10 }, deep); });
  for (const RV of RIVERS) for (let i = 0; i < RV.length - 1; i++) for (let k = 0; k < 2; k++) { const t = r(); add('fish', RV[i][0] + (RV[i + 1][0] - RV[i][0]) * t, RV[i][1] + (RV[i + 1][1] - RV[i][1]) * t, 3, { speed: 1.5, swim: true, roam: 5, jump: 4 + r() * 10 }, deep); }
  return list;
}
/** a mouse: nibbles and dashes about near its hole; if it hears the fox it freezes, then zig-zags home and hides */
function mouseStep(a, dt, P, far) {
  const hear = P.sneak ? 1.4 : P.speed > 4.2 ? 7 : P.speed > 0.4 ? 4.6 : 2.2;   // sneaking is quiet, running is loud
  if (a.state !== 'flee' && a.state !== 'freeze' && (a.scare || (far < hear && !a.calm))) { a.state = a.scare ? 'flee' : 'freeze'; a.st = 0.3 + Math.random() * 0.5; }
  a.scare = false; if (a.calm > 0) a.calm -= dt;
  if (a.state === 'freeze') { a.st -= dt; if (a.st <= 0) a.state = 'flee'; return false; }
  let tx, tz, speed;
  if (a.state === 'flee') {
    const bx = a.hx - a.x, bz = a.hz - a.z, bd = Math.hypot(bx, bz);
    if (bd < 0.35) { a.gone = 5 + Math.random() * 6; a.state = ''; return false; }        // into the hole
    const side = Math.sin(a.t * 11) * 0.9;                                                  // zig-zag
    tx = bx / bd - (bz / bd) * side; tz = bz / bd + (bx / bd) * side; speed = 4.4;
  } else {
    const ox = a.tx - a.x, oz = a.tz - a.z, od = Math.hypot(ox, oz);
    if (a.wait > 0) { a.wait -= dt; return false; }
    if (od < 0.2) { a.wait = 0.4 + Math.random() * 2.2; a.tx = a.hx + (Math.random() * 2 - 1) * a.roam; a.tz = a.hz + (Math.random() * 2 - 1) * a.roam; return false; }
    tx = ox; tz = oz; speed = 1.5;
  }
  const n = Math.hypot(tx, tz) || 1, nx = a.x + (tx / n) * speed * dt, nz = a.z + (tz / n) * speed * dt;
  if (walkable(nx, nz, at(Math.floor(a.x), Math.floor(a.z)))) { a.x = nx; a.z = nz; }
  else if (a.state === 'flee') { a.x += (a.hx - a.x) * Math.min(1, dt * 3); a.z += (a.hz - a.z) * Math.min(1, dt * 3); }   // squeezes through the grass
  else { a.tx = a.x; a.tz = a.z; return false; }
  let diff = Math.atan2(tz, -tx) - a.face; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); a.face += diff * Math.min(1, dt * 12);
  return true;
}
function moveAnimals(list, dt, P, time) {
  for (const a of list) {
    if (a.held) { a.g.visible = false; continue; }   // in Raluca's mouth
    if (a.gone > 0 && a.kind === 'mouse') { a.gone -= dt; a.g.visible = false; if (a.gone <= 0) { a.x = a.tx = a.hx; a.z = a.tz = a.hz; a.wait = 1 + Math.random() * 2; a.state = ''; a.calm = 1.5; } continue; }
    if (a.gone > 0) { a.gone -= dt; a.g.visible = false; if (a.gone <= 0) { a.x = a.hx + (Math.random() * 2 - 1) * a.roam; a.z = a.hz + (Math.random() * 2 - 1) * a.roam; if (!walkable(a.x, a.z, at(Math.floor(a.x), Math.floor(a.z)))) { a.x = a.hx; a.z = a.hz; } a.tx = a.x; a.tz = a.z; } continue; }
    const dx = a.x - P.x, dz = a.z - P.z, far = Math.hypot(dx, dz);
    a.g.visible = far < SEE; if (!a.g.visible) continue;
    a.t += dt;
    let moving = false, speed = a.speed;
    if (a.friend && !a.sit && far < 3.5) { a.wait = Math.max(a.wait, 0.5); let df = Math.atan2(-dz, dx) - a.face; df = Math.atan2(Math.sin(df), Math.cos(df)); a.face += df * Math.min(1, dt * 4); }
    if (a.kind === 'mouse') moving = mouseStep(a, dt, P, far);
    else if (a.sit) { let diff = Math.atan2(-dz, dx) - a.face; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); if (far < 12) a.face += diff * Math.min(1, dt * 3); }
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
    const g = new THREE.Group(), land = buildLand(landMat, cx * CHUNK, cz * CHUNK); g.add(land);
    const boxes = lists[cz * (SIZE / CHUNK) + cx], bm = boxes.length ? boxMesh(boxes, boxMat) : null; if (bm) g.add(bm);
    scene.add(g); pieces.push({ g, land, bm, cx, cz, x: (cx + 0.5) * CHUNK, z: (cz + 0.5) * CHUNK });
  }
  const animals = makeAnimals(scene, boxMat);
  // the four animal friends: the owl at the den, the owl on the hill, the rabbit by the meadow, a hedgehog
  const owls = animals.filter((a) => a.kind === 'owl'), rabbits = animals.filter((a) => a.kind === 'rabbit'), hogs = animals.filter((a) => a.kind === 'hedgehog');
  const pick = { olli: owls[0], luna: owls[1], rosie: rabbits[rabbits.length - 1], hugo: hogs[0] };
  const pals = friendData.friends.filter((f) => pick[f.id]).map((f) => {
    const a = pick[f.id]; a.friend = f.id; a.shy = 0; if (!a.sit) { a.speed = Math.min(a.speed, 1.1); a.roam = 4; }
    return { ...f, a, step: 0, acc: false, has: false };
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), new THREE.MeshLambertMaterial({ color: 0x4fa8e0, transparent: true, opacity: 0.72 }));
  water.rotation.x = -Math.PI / 2; water.position.set(mid, WATER + 0.72, mid); scene.add(water);

  // Raluca: `who` is moved and turned, the fox inside is shifted so that her middle is over the spot
  const who = new THREE.Group(); scene.add(who);
  // Raluca is the dog model from Blender; `?raluca=fuchs` shows the old code-built fox
  const actor = /raluca=fuchs/.test(location.search) ? makeFoxActor() : makeDogActor(makeFoxActor);
  actor.root.position.x = 0.1; actor.root.scale.setScalar(0.9);
  const body = new THREE.Group(); body.add(actor.root); who.add(body);
  const mouthMouse = boxMesh(MODELS.mouse.boxes, boxMat); mouthMouse.visible = false; who.add(mouthMouse);
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
  $('hintText').textContent = touch ? 'Links: laufen · Wischen: umsehen' : 'W A S D: laufen · Leertaste: springen · E: Aktion · F: graben · G: bauen · Maus: umsehen';
  if (!touch) $('jump').style.display = 'none';
  setTimeout(() => { $('hint').style.opacity = 0; }, 7000);
  window.addEventListener('keydown', (e) => { keys.add(e.code); if (e.code === 'Space') { input.jump = true; e.preventDefault(); }
    if (e.code === 'KeyE' && !e.repeat) doAction();
    if (e.code === 'KeyF' && !e.repeat) startDig();
    if (e.code === 'KeyG' && !e.repeat) startBuild();
    if (e.code === 'KeyH' && !e.repeat) { if (busy && $('closeHome')) $('closeHome').click(); else if (Math.hypot(DEN[0] + 0.5 - P.x, DEN[1] + 0.5 - P.z) < 6) openHome(); }
    if (e.code === 'KeyB' && !e.repeat) { if (busy && $('closeBook')) $('closeBook').click(); else openBook(); } });
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
    if (act && act.kind === 'pounce' && act.leapt && P.air) {   // the pounce carries her forward
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
    if (P.air && act && act.kind === 'pounce') {
      const t = Math.max(-1, Math.min(1, P.vy / 8.6));
      p.pitch = t > 0 ? t * 0.55 : t * 1.05; p.headNod = t > 0 ? -0.1 : -t * 0.35;
      p.fl = p.fr = t > 0 ? 0.5 : -1.2; p.bl = p.br = 0.9; p.tail = 0; p.tailUp = 0.45; p.earL = p.earR = -0.3;
    } else if (P.air) { const t = Math.max(-1, Math.min(1, P.vy / 7.4)); p.fl = p.fr = -0.7 * (0.4 + Math.abs(t)); p.bl = p.br = 0.8 * (0.4 + Math.abs(t)); p.pitch = t * 0.22; p.tailUp = 0.35; }
    blink -= dt; if (blink < 0) { blinkT = 0; blink = 2.5 + Math.random() * 3; }
    if (blinkT >= 0) { blinkT += dt; p.blink = Math.sin(Math.min(1, blinkT / 0.16) * Math.PI); if (blinkT > 0.16) blinkT = -1; }
    if (act && act.kind === 'sleep') p.blink = 1;
    actor.pose(p);
    const bob = P.air ? 0 : Math.abs(Math.sin(P.phase)) * 0.05 * k;
    const sink = inWater ? -0.22 : 0;
    who.position.set(P.x, P.y + bob + sink, P.z);
    who.rotation.y = P.face;
    if (act && act.kind === 'catch') {   // the mouse hangs from her mouth, then gets smaller while she eats
      mouthMouse.visible = true; const eat = Math.max(0, act.t - 1.6) / 1.4;
      mouthMouse.position.set(-0.5 - eat * 0.05, act.t < 1.6 ? 0.8 : 0.3 - eat * 0.1, 0); mouthMouse.rotation.set(0, Math.PI / 2, act.t < 1.6 ? 0.9 + Math.sin(time * 9) * 0.1 : 0);
      mouthMouse.scale.setScalar(0.6 * (1 - eat * 0.85));
    } else mouthMouse.visible = false;
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
    const o2 = rng(1900 + round), sIdx = SAYS.map((_, i) => i).sort(() => o2() - 0.5), rIdx = REPEATS.map((_, i) => i).sort(() => o2() - 0.5);
    // build the sentence and say it in English take turns (no repeat-after-me: Freddy left it out)
    marks.forEach((m, i) => {
      m.type = ['build', 'say'][i % 2];
      if (m.type === 'say' && !SAYS.length) m.type = 'build';
      if (m.type === 'repeat' && !REPEATS.length) m.type = 'build';
      m.item = m.type === 'say' ? SAYS[sIdx[i % sIdx.length]] : m.type === 'repeat' ? REPEATS[rIdx[i % rIdx.length]] : SENTENCES[idx[i % idx.length]];
    });
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
  function markDone(m) { m.done = true; found++; showCount(); cheer = 1.2; earn(3); save(); if (found === marks.length) { round++; setTimeout(() => { toast('Alle gefunden! Neue Fragezeichen sind da.'); placeMarks(); save(); }, 1500); } }
  /** answer by voice (checked on the server) or by typing; onResult(level, said, corrected, praise) */
  function micInto(box, { check, hint, answers, onResult }) {
    box.innerHTML = `<p class="small" id="mStatus"></p><div class="row">${canRecord() ? '<button class="btn primary" id="mMic">🎤 Sprechen</button>' : ''}<button class="btn" id="mType">⌨️ Tippen</button></div>
      <form class="typed" id="mTyped" hidden><input id="mIn" autocomplete="off" autocapitalize="sentences" placeholder="Auf Englisch schreiben …"><button class="btn primary">OK</button></form>`;
    let rec = null;
    const status = (t) => { $('mStatus').textContent = t; };
    if ($('mMic')) $('mMic').onclick = async () => {
      const mic = $('mMic');
      if (rec) {
        const r0 = rec; rec = null; mic.disabled = true; mic.textContent = '⏳ Moment …'; status('Ich höre mir das an …');
        const r = await r0.stop(); if (!$('mMic')) return; mic.disabled = false; mic.textContent = '🎤 Sprechen';
        if (r.error === 'cancelled') return;
        if (r.error) { status(r.error); return; }
        status('');
        if (r.check) onResult(r.check.level, r.text, r.check.corrected, r.check.praise); else onResult(typedLevel(r.text, answers), r.text, '', '');
        return;
      }
      mic.disabled = true; mic.textContent = '⏳ Mikro startet …';
      try { rec = await startRecording((sec) => status(`Jetzt sprechen! ${sec} s`), () => mic.click(), check, hint); }
      catch (e) { status(e.message); mic.disabled = false; mic.textContent = '🎤 Sprechen'; return; }
      mic.disabled = false; mic.textContent = '■ Fertig'; status('Jetzt sprechen! Dann auf „Fertig“ tippen.');
    };
    $('mType').onclick = () => { $('mTyped').hidden = !$('mTyped').hidden; if (!$('mTyped').hidden) $('mIn').focus(); };
    $('mTyped').onsubmit = (ev) => { ev.preventDefault(); const t = $('mIn').value.trim(); if (t) onResult(typedLevel(t, answers), t, '', ''); };
    return { cancel() { if (rec) { rec.cancel(); rec = null; } } };
  }
  // say it in English / repeat after me (at a question mark)
  function openSpeak(m) {
    busy = true; keys.clear(); input.x = input.y = 0; stickId = null; stick.style.display = 'none';
    const it = m.item, card = $('card'), say = m.type === 'say';
    const answers = say ? it.answers : [it.en];
    card.innerHTML = say
      ? `<p class="small">Jemand spricht mit dir. Antworte auf Englisch.</p><p class="en say">🗣️ ${esc(it.they)} <span class="spk">🔊</span></p><p class="task">Sag auf Englisch: <b>${esc(it.de)}</b></p><div id="mBox"></div><div id="result"></div>`
      : `<p class="small">Hör zu und sprich nach.</p><p class="en say" style="font-size:20px">${esc(it.en)} <span class="spk">🔊</span></p><p class="small">${esc(it.de)}</p><div class="row"><button class="btn" id="slow">🐢 Langsam</button></div><div id="mBox"></div><div id="result"></div>`;
    card.innerHTML += '<div class="row"><button class="btn" id="later">Später</button></div>';
    $('sheet').classList.add('open');
    const line = say ? it.they : it.en;
    play(line, { role: say ? 'friend' : 'main' });
    card.onclick = (ev) => { if (ev.target.closest('.say')) play(line, { role: say ? 'friend' : 'main' }); const s2 = ev.target.closest('.say2'); if (s2) play(s2.dataset.t); };
    if ($('slow')) $('slow').onclick = () => play(it.en, { slow: true });
    let mic = null;
    const close = () => { if (mic) mic.cancel(); $('sheet').classList.remove('open'); card.onclick = null; busy = false; };
    $('later').onclick = close;
    mic = micInto($('mBox'), {
      check: { they: say ? it.they : 'Repeat after me: ' + it.en, de: it.de, answers }, hint: say ? `She answers: "${it.they}"` : `She repeats: "${it.en}"`, answers,
      onResult(level, said, corrected, praise) {
        const ok = level === 'great' || level === 'good', best = corrected || answers[0];
        if (ok) {
          $('mBox').innerHTML = '';
          $('result').innerHTML = `<p class="ok">${level === 'great' ? 'Super! 🎉' : 'Gut gemacht! 👍'} 🟫 +3</p>${said ? `<p class="small">Du: „${esc(said)}“</p>` : ''}<p class="en say2" data-t="${esc(best)}">${esc(best)} 🔊</p>`;
          card.querySelector('#later').outerHTML = '<button class="btn primary" id="next">Weiter</button>';
          $('next').onclick = () => { close(); markDone(m); };
          play(best);
        } else {
          $('result').innerHTML = `<p class="no">Noch nicht ganz – versuch es noch einmal.</p>${said ? `<p class="small">Du: „${esc(said)}“</p>` : ''}${praise ? `<p class="small">${esc(praise)}</p>` : ''}<p class="small">Zum Beispiel:</p><p class="en say2" data-t="${esc(best)}">${esc(best)} 🔊</p>`;
        }
      },
    });
  }
  // spelling: put the letters of an English word in the right order (to build things, and in the word practice)
  function spellInto(box, wordEn, onRight) {
    const target = wordEn.toLowerCase();
    const letters = [...target].map((c, id) => ({ c, id })).filter((t) => t.c !== ' ');
    let pool = [...letters].sort(() => Math.random() - 0.5), chosen = [], wrong = 0;
    if (pool.map((t) => t.c).join('') === letters.map((t) => t.c).join('') && pool.length > 1) pool.reverse();
    const shown = () => { let k = 0; return [...target].map((c) => (c === ' ' ? '<span class="gap"></span>' : chosen[k] ? `<button class="tile ltr" data-id="${chosen[k++].id}">${chosen[k - 1].c}</button>` : (k++, '<span class="slot"></span>'))).join(''); };
    const draw = () => {
      box.innerHTML = `<div class="answer spell" id="sAns">${shown()}</div><div class="tiles">${pool.map((t) => `<button class="tile ltr ${chosen.includes(t) ? 'used' : ''}" data-id="${t.id}" ${chosen.includes(t) ? 'disabled' : ''}>${t.c}</button>`).join('')}</div><div id="sRes"></div>`;
    };
    box.onclick = (ev) => {
      const b = ev.target.closest('.tile'); if (!b) return;
      const t = letters.find((x) => x.id === Number(b.dataset.id));
      if (b.parentElement.id === 'sAns') chosen = chosen.filter((x) => x !== t); else if (!chosen.includes(t)) chosen.push(t);
      draw();
      if (chosen.length === letters.length) {
        const got = chosen.map((x) => x.c).join(''), want = letters.map((x) => x.c).join('');
        if (got === want) { $('sAns').className = 'answer spell right'; box.onclick = null; play(wordEn); setTimeout(onRight, 700); }
        else { wrong++; $('sAns').className = 'answer spell wrong'; $('sRes').innerHTML = wrong >= 2 ? `<p class="no">Richtig ist: <b>${esc(wordEn)}</b></p>` : '<p class="no">Fast! Nochmal.</p>'; setTimeout(() => { chosen = []; draw(); if (wrong >= 2) $('sRes').innerHTML = `<p class="small">Richtig ist: <b>${esc(wordEn)}</b></p>`; }, 900); }
      }
    };
    draw();
  }
  function openExercise(m) {
    if (m.type === 'say' || m.type === 'repeat') { openSpeak(m); return; }
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
        $('result').innerHTML = `<p class="ok">Richtig! 🎉 🟫 +3</p><p class="en">${esc(item.en)}</p>`;
        card.querySelector('.row').innerHTML = '<button class="btn" id="hear">🔊 Anhören</button><button class="btn primary" id="next">Weiter</button>';
        play(item.en);
        $('hear').onclick = () => play(item.en);
        $('next').onclick = () => { close(); markDone(m); };
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
  const fishNear = () => { let best = null, bd = 3.2; for (const a of animals) if (a.kind === 'fish' && !(a.gone > 0)) { const d = Math.hypot(a.x - P.x, a.z - P.z); if (d < bd) { bd = d; best = a; } } return best; };
  const mouseNear = () => { let best = null, bd = 4.5; for (const a of animals) if (a.kind === 'mouse' && !(a.gone > 0)) { const d = Math.hypot(a.x - P.x, a.z - P.z); if (d < bd) { bd = d; best = a; } } return best; };
  let caught = 0;
  const palNear = () => { let best = null, bd = 2.7; for (const f of pals) { const d = Math.hypot(f.a.x - P.x, f.a.z - P.z); if (d < bd) { bd = d; best = f; } } return best; };
  function whatCanIDo() {
    if (nearDen()) return ['sleep', '😴 Schlafen'];
    const pal = palNear(); if (pal) return ['talk', `💬 ${pal.name}`];
    if (mouseNear()) return ['pounce', '🐾 Fangen'];
    if (fishNear() && nearWater()) return ['fish', '🐟 Fischen'];
    if (nearBush()) return ['eat', '🫐 Fressen'];
    if (nearWater()) return ['drink', '💧 Trinken'];
    return ['sniff', '👃 Schnüffeln'];
  }
  function doAction() {
    if (act || busy || P.air) return;
    const [kind] = whatCanIDo();
    if (kind === 'sleep') { goSleep(); return; }
    if (kind === 'talk') { openTalk(palNear()); return; }
    if (kind === 'sniff') sniff();
    if (kind === 'dig') { startDig(); return; }
    if (kind === 'fish') {   // she watches the water and snaps when a fish swims past (the closer, the better)
      const f = fishNear(); P.face = Math.atan2(f.z - P.z, -(f.x - P.x));
      act = { kind, t: 0, d: 1.9, target: f, keep: f.speed }; f.speed = 0; f.tx = f.x; f.tz = f.z;
      return;
    }
    if (kind === 'pounce') {   // like a real fox: stand still and listen, then a high jump and down nose-first
      const m = mouseNear(); P.face = Math.atan2(m.z - P.z, -(m.x - P.x));
      act = { kind, t: 0, d: 9, target: m, sneaked: P.sneak || P.speed < 0.3 };
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
    } else if (act.kind === 'build') {   // she pushes the block into place with her nose and paws
      const k2 = Math.sin(Math.min(1, t / act.d) * Math.PI);
      p.headNod = 0.4 * k2; p.fl = -0.6 * k2; p.pitch = -0.08 * k2; p.tailUp = 0.3;
    } else if (act.kind === 'dig') {
      // nose down, front paws scrape fast, tail up
      const down = Math.min(1, act.t / 0.25), w = Math.sin(act.t * 26);
      p.pitch = -0.2 * down; p.bodyY = -0.06 * down; p.headNod = 0.55 * down; p.fl = (-0.5 + w * 0.6) * down; p.fr = (-0.5 - w * 0.6) * down;
      p.bl = p.br = 0.15 * down; p.tail = Math.sin(act.t * 12) * 0.5; p.tailUp = 0.45;
    } else if (act.kind === 'fish') {
      // watch the water, then a quick snap down at the end
      const k = act.t / act.d, snap = k > 0.8 ? Math.sin(((k - 0.8) / 0.2) * Math.PI) : 0;
      p.pitch = -0.1 - snap * 0.25; p.headNod = 0.45 + snap * 0.6 + Math.sin(act.t * 3) * 0.05 * (1 - snap); p.fl = p.fr = -0.2 - snap * 0.4; p.tail = Math.sin(act.t * 5) * 0.25; p.tailUp = 0.3; p.earL = p.earR = -0.25;
    } else if (act.kind === 'pounce') {
      if (!act.leapt) {   // crouch, ears forward, head tilts – she listens for the mouse in the grass
        const down = Math.min(1, t / 0.2);
        p.bodyY = -0.12 * down; p.headNod = 0.3 * down; p.headTurn = Math.sin(t * 7) * 0.18; p.earL = p.earR = -0.4 * down; p.tail = 0; p.tailUp = 0.1;
        p.bl = p.br = 0.25 * down; p.fl = p.fr = -0.1 * down;
      }
    } else if (act.kind === 'catch') {   // the mouse in her mouth, head up and proud, then eat it
      if (t < 1.6) { p.headNod = -0.25; p.tail = Math.sin(t * 12) * 0.7; p.tailUp = 0.5; p.earL = p.earR = -0.2; }
      else { const k2 = t - 1.6; p.pitch = -0.12; p.headNod = 0.8 + Math.sin(k2 * 16) * 0.07; p.fl = p.fr = -0.15; p.tail = Math.sin(t * 7) * 0.5; p.tailUp = 0.25; }
    } else if (act.kind === 'miss') {   // nose in the snow… er, grass: a short moment stuck, then shake
      const k2 = Math.min(1, t / 0.15) * Math.min(1, (act.d - t) / 0.3);
      p.pitch = -0.45 * k2; p.headNod = 0.6 * k2; p.fl = p.fr = -0.6 * k2; p.bl = p.br = 0.3 * k2; p.tailUp = 0.55 * k2; p.headTurn = t > 0.5 ? Math.sin(t * 30) * 0.3 : 0;
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
      if (act.kind === 'pounce') {
        const m = act.target;
        if (!act.leapt) {
          const dx = m.x - P.x, dz = m.z - P.z, d = Math.hypot(dx, dz) || 1;
          P.face += Math.atan2(Math.sin(Math.atan2(dz, -dx) - P.face), Math.cos(Math.atan2(dz, -dx) - P.face)) * Math.min(1, dt * 10);
          if (act.t >= 0.65) {   // jump! the mouse may hear it – less often when she sneaked up and is close
            const air = (2 * 8.6) / 21, err = (Math.random() - 0.5) * 0.25 * d / 3, reach = Math.min(d + err, 4.2) / air;
            act.leapt = act.t; act.vx = (dx / d) * reach; act.vz = (dz / d) * reach; P.vy = 8.6; P.air = true;
            const hearIt = (act.sneaked ? 0.12 : 0.45) + (d > 3.2 ? 0.25 : 0) + (m.state === 'flee' ? 1 : 0);
            if (Math.random() < hearIt) m.scare = true; else { m.wait = Math.max(m.wait || 0, 1.5); m.tx = m.x; m.tz = m.z; }
          }
        } else if (act.t - act.leapt > 0.25 && !P.air) {   // landed, nose in the grass
          const d = Math.hypot(m.x - P.x, m.z - P.z);
          if (d < 1.05 && !(m.gone > 0)) {
            m.held = true; m.state = ''; caught++; book('mouse'); cheer = 0;
            act = { kind: 'catch', t: 0, d: 3, target: m };
            toast(caught === 1 ? 'Gefangen! 🐭  a mouse – Raluca is a good hunter!' : 'Gefangen! 🐭  a mouse');
          } else {
            act = { kind: 'miss', t: 0, d: 0.9 };
            toast(d < 2.5 ? 'Knapp daneben! Die Maus hat dich gehört.' : 'Die Maus ist weg! Langsam anschleichen, dann springen.');
          }
          return;
        }
      }
      if (act.kind === 'catch' && act.t >= act.d) {
        const m = act.target; m.held = false; m.gone = 25; mouthMouse.visible = false;
        needs.food = Math.min(100, needs.food + 30); act = null; cheer = 0.6; save(); return;
      }
      if (act.kind === 'miss' && act.t >= act.d) { act = null; return; }
      if (act.kind === 'build' && act.t >= act.d) { const a0 = act; act = null; buildDone(a0); return; }
      if (act.kind === 'dig') {
        if (act.t > 0.15 && Math.random() < dt * 30) dirt(act.x + 0.5, H[act.z * SIZE + act.x] + 0.1, act.z + 0.5);
        if (act.t >= act.d) { const a0 = act; act = null; digDone(a0); return; }
      }
      if (act.kind === 'fish' && act.t >= act.d) {
        const f = act.target, d = Math.hypot(f.x - P.x, f.z - P.z); f.speed = act.keep || 1.3;
        if (d < 3.3 && Math.random() < (d < 2 ? 0.9 : 0.7)) { f.gone = 30; book('fish'); needs.food = Math.min(100, needs.food + 35); cheer = 0.8; toast('Ein Fisch! 🐟  a fish'); }
        else toast('Platsch! Der Fisch ist weggeschwommen. Nochmal!');
        act = null; save(); return;
      }
      if (act.t >= act.d && act.kind !== 'sleep') {
        if (act.kind === 'eat') { book('berries'); needs.food = Math.min(100, needs.food + 40); toast('Mmm, Beeren! 🫐  berries'); }
        if (act.kind === 'drink') { book('water'); needs.water = 100; toast('Ahh, frisches Wasser! 💧  water'); }
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
      setTimeout(() => { act = null; toast((night ? 'Guten Morgen! ☀️  Good morning, Raluca!' : 'Ein kleines Nickerchen. 😴  a nap') + (built.has('bed') ? ' 🍂 Im Blätterbett schläft sie super.' : '')); save(); }, 900);
    }, 1800);
  }

  // sniff: a trail of glowing dots shows the way to the nearest question mark
  const TRAIL = 16;
  const trailMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), new THREE.MeshBasicMaterial({ color: 0xfff09a }), TRAIL);
  trailMesh.frustumCulled = false; trailMesh.visible = false; scene.add(trailMesh);
  let trail = null;
  // ---------------- things to find + the collection book
  const finds = placeFinds();
  const bookCount = {};   // kind → how many found / caught / eaten
  for (const f of finds) {
    const g = new THREE.Group(); g.add(boxMesh(FIND_KINDS[f.kind].boxes, boxMat));
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xfff3a0, transparent: true, opacity: 0.35, depthWrite: false }));
    glow.position.y = 0.03; g.add(glow);
    g.position.set(f.x, f.y, f.z); g.scale.setScalar(1.3); scene.add(g); f.g = g;
  }
  function drawFinds() {
    for (const f of finds) {
      if (f.got) { f.g.visible = false; continue; }
      const d = Math.hypot(f.x - P.x, f.z - P.z); f.g.visible = d < SEE * 0.75;
      if (!f.g.visible) continue;
      f.g.children[0].rotation.y = f.spin + time * 0.8; f.g.children[0].position.y = 0.06 + Math.sin(time * 2.4 + f.spin) * 0.05;
      f.g.children[1].material.opacity = 0.25 + Math.sin(time * 3 + f.spin) * 0.12;
      if (d < 1.3 && !busy && !act) pickUp(f);
    }
  }
  function book(kind) {
    bookCount[kind] = (bookCount[kind] || 0) + 1;
    for (const f of pals) { const st = f.steps[f.step]; if (st && st.want === kind && f.acc && !f.has) { f.has = true; setTimeout(() => toast(`Bring es zu ${f.name}! ${f.icon}`), 2600); } }
  }
  const word = (k) => FIND_KINDS[k] || DIG_KINDS[k] || BOOK_EXTRA[k];
  let foundTimer = 0;
  function pickUp(f) {
    f.got = true; book(f.kind); cheer = 0.6;
    const w = FIND_KINDS[f.kind], first = bookCount[f.kind] === 1;
    $('found').innerHTML = `<span class="ic">${w.icon}</span><span><b>${w.en}</b><small>${w.de}${first ? ' · neu im Buch!' : ''}</small></span><span class="say">🔊</span>`;
    $('found').classList.add('show'); clearTimeout(foundTimer); foundTimer = setTimeout(() => $('found').classList.remove('show'), 4200);
    $('found').onclick = () => play(w.en);
    play(w.en);
    save();
  }
  function openBook() {
    if (busy) return;
    busy = true; keys.clear(); input.x = input.y = 0;
    const all = [...Object.keys(FIND_KINDS), ...Object.keys(DIG_KINDS), ...Object.keys(BOOK_EXTRA)];
    const known = all.filter((k) => bookCount[k]).length;
    const left = finds.filter((f) => !f.got).length + digs.filter((g) => !g.dug).length;
    $('card').innerHTML = `<div class="pals">${pals.map((f) => `<div><span>${f.icon}</span><b>${f.name}</b><small>${hearts(f)}</small></div>`).join('')}</div>
      <p class="small">Ralucas Buch · ${known} von ${all.length} Wörtern · noch ${left} Dinge versteckt</p>
      <div class="book">${all.map((k) => { const w = word(k), n = bookCount[k] || 0;
        return n ? `<button class="entry" data-k="${k}"><span class="ic">${w.icon}</span><b>${w.en}</b><small>${w.de}</small><i>× ${n}</i></button>`
          : '<div class="entry unknown"><span class="ic">?</span><b>???</b><small>noch nicht gefunden</small></div>'; }).join('')}</div>
      <p class="small">Tippe auf ein Wort, um es zu hören.</p>
      <div class="row">${known ? '<button class="btn" id="practice">🃏 Wörter üben (🟫 +1)</button>' : ''}<button class="btn primary" id="closeBook">Weiter spielen</button></div>`;
    $('sheet').classList.add('open');
    $('card').onclick = (ev) => { const b = ev.target.closest('.entry[data-k]'); if (b) play(word(b.dataset.k).en); };
    $('closeBook').onclick = () => { $('sheet').classList.remove('open'); $('card').onclick = null; busy = false; };
    if ($('practice')) $('practice').onclick = (e2) => { e2.stopPropagation(); practice(all.filter((k) => bookCount[k]), 0, 0); };
  }
  // word practice: the German word and the picture → spell the English word; 5 words, each right one = 1 earth
  function practice(keysKnown, n, right) {
    const card = $('card');
    if (n >= 5) {
      card.onclick = null;
      card.innerHTML = `<p class="ok">Fertig! ${right} von 5 richtig. 🟫 +${right}</p><div class="row"><button class="btn primary" id="closeBook">Weiter spielen</button></div>`;
      $('closeBook').onclick = () => { $('sheet').classList.remove('open'); busy = false; save(); };
      return;
    }
    const k = keysKnown[Math.floor(Math.random() * keysKnown.length)], w = word(k);
    card.innerHTML = `<p class="small">Wort ${n + 1} von 5 · Wie heißt das auf Englisch?</p><p class="de" style="font-size:24px">${w.icon} ${esc(w.de)}</p>
      <div id="spell"></div><div class="row"><button class="btn" id="hint">🔊 Tipp: anhören</button><button class="btn" id="skip">Weiter</button></div>`;
    let heard = false;
    $('hint').onclick = () => { heard = true; play(w.en); };
    $('skip').onclick = () => practice(keysKnown, n + 1, right);
    spellInto($('spell'), w.en, () => { const ok = !heard; if (ok) earn(1); practice(keysKnown, n + 1, right + (ok ? 1 : 0)); });
  }
  $('bookBtn').addEventListener('click', openBook);

  // ---------------- animal friends: talking, tasks, hearts
  function wantDug() { for (const f of pals) { const st = f.steps[f.step]; if (st && f.acc && !f.has && ['worm', 'carrot', 'potato', 'bone'].includes(st.want)) return st.want; } return null; }
  const hearts = (f) => '❤️'.repeat(f.step) + '🤍'.repeat(f.steps.length - f.step);
  const nWords = (t) => t.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
  function typedLevel(text, answers) {   // typing has no server check: compare the words with the example answers
    const said = new Set(nWords(text)); let best = 0;
    for (const a of answers) { const w = nWords(a); best = Math.max(best, w.filter((x) => said.has(x)).length / w.length); }
    return best >= 0.85 ? 'great' : best >= 0.55 ? 'good' : 'try';
  }
  function stillThere(kind) {   // can she still get one of these?
    if (FIND_KINDS[kind]) return finds.some((f) => f.kind === kind && !f.got);
    if (kind === 'treasure') return digs.some((g) => g.kind === kind && !g.dug);
    return true;
  }
  let talkRec = null;
  function openTalk(f) {
    if (!f || busy) return;
    busy = true; keys.clear(); input.x = input.y = 0; stickId = null; stick.style.display = 'none';
    const card = $('card'), st = f.steps[f.step];
    const head = (line) => `<div class="talk"><span class="who">${f.icon}</span><div><b>${f.name}</b> <span class="hearts">${hearts(f)}</span>
      <p class="en say">${esc(line.en)} <span class="spk">🔊</span></p><p class="small">${esc(line.de)}</p></div></div>`;
    const close = () => { if (talkRec) { talkRec.cancel(); talkRec = null; } $('sheet').classList.remove('open'); card.onclick = null; busy = false; save(); };
    const gotHeart = () => { f.step++; f.acc = false; f.has = false; cheer = 1.2; save(); };
    let line;
    if (!st) {   // all tasks done: just a friendly word
      line = f.chat[Math.floor(Math.random() * f.chat.length)];
      card.innerHTML = head(line) + `<p class="small">${f.name} ist deine Freundin / dein Freund! ❤️</p><div class="row"><button class="btn primary" id="bye">Tschüss!</button></div>`;
    } else if (st.want) {
      const w = word(st.want);
      if (f.acc && f.has) {
        line = st.thanks;
        card.innerHTML = head(line) + `<p class="ok">${w.icon} ${w.en} gebracht! +1 ❤️</p><div class="row"><button class="btn primary" id="next">Weiter</button></div>`;
        gotHeart();
      } else {
        line = st.say;
        card.innerHTML = head(line) + `<p class="task">Aufgabe: ${w.icon} <b>${w.en}</b> <span class="small">(${w.de})</span> ${f.acc ? '– du hast noch keins.' : ''}</p>
          <div class="row"><button class="btn" id="bye">Später</button><button class="btn primary" id="ok">${f.acc ? 'Okay' : 'Okay, mach ich!'}</button></div>`;
      }
    } else {
      line = st.say;
      card.innerHTML = head(line) + `<p class="task">Antworte auf Englisch: <b>${esc(st.task)}</b></p>
        <div id="talkRes"></div><p class="small" id="talkStatus"></p>
        <div class="row talkbtns">${canRecord() ? '<button class="btn primary" id="mic">🎤 Sprechen</button>' : ''}<button class="btn" id="typeBtn">⌨️ Tippen</button></div>
        <form class="typed" id="typed" hidden><input id="typedIn" autocomplete="off" autocapitalize="sentences" placeholder="Auf Englisch schreiben …"><button class="btn primary">OK</button></form>
        <div class="row"><button class="btn" id="bye">Später</button></div>`;
      const status = (t) => { $('talkStatus').textContent = t; };
      const result = (level, said, corrected, praise) => {
        const ok = level === 'great' || level === 'good';
        $('talkRes').innerHTML = ok
          ? `<p class="ok">${level === 'great' ? 'Super! 🎉' : 'Gut gemacht! 👍'} +1 ❤️</p>${said ? `<p class="small">Du: „${esc(said)}“</p>` : ''}${corrected && corrected !== said ? `<p class="en">${esc(corrected)}</p>` : ''}`
          : `<p class="no">Noch nicht ganz.</p>${said ? `<p class="small">Du: „${esc(said)}“</p>` : ''}${praise ? `<p class="small">${esc(praise)}</p>` : ''}<p class="small">Zum Beispiel:</p><p class="en say2">${esc(corrected || st.answers[0])} <span class="spk">🔊</span></p>`;
        if (ok) { card.querySelector('.talkbtns').remove(); $('typed').hidden = true; card.querySelector('#bye').outerHTML = '<button class="btn primary" id="next">Weiter</button>'; $('next').onclick = () => { close(); setTimeout(() => openTalk(f), 300); }; gotHeart(); play(corrected || said || st.answers[0]); }
        else status('Versuch es noch einmal.');
      };
      const check = { they: st.say.en, de: st.task, answers: st.answers };
      const hint = `Raluca the fox answers ${f.name} the ${f.kind}, who asked: "${st.say.en}"`;
      if ($('mic')) $('mic').onclick = async () => {
        const mic = $('mic');
        if (talkRec) {   // second tap: stop and check
          const r0 = talkRec; talkRec = null; mic.disabled = true; mic.textContent = '⏳ Moment …'; status('Ich höre mir das an …');
          const r = await r0.stop(); mic.disabled = false; mic.textContent = '🎤 Sprechen';
          if (r.error === 'cancelled') return;
          if (r.error) { status(r.error); return; }
          if (r.check) result(r.check.level, r.text, r.check.corrected, r.check.praise);
          else result(typedLevel(r.text, st.answers), r.text, '', '');
          return;
        }
        mic.disabled = true; mic.textContent = '⏳ Mikro startet …';
        try { talkRec = await startRecording((sec) => status(`Jetzt sprechen! ${sec} s`), () => mic.click(), check, hint); }
        catch (e) { status(e.message); mic.disabled = false; mic.textContent = '🎤 Sprechen'; return; }
        mic.disabled = false; mic.textContent = '■ Fertig'; status('Jetzt sprechen! Dann auf „Fertig“ tippen.');
      };
      $('typeBtn').onclick = () => { $('typed').hidden = !$('typed').hidden; if (!$('typed').hidden) $('typedIn').focus(); };
      $('typed').onsubmit = (ev) => { ev.preventDefault(); const t = $('typedIn').value.trim(); if (t) result(typedLevel(t, st.answers), t, '', ''); };
    }
    $('sheet').classList.add('open');
    card.onclick = (ev) => { if (ev.target.closest('.say')) play(line.en); const s2 = ev.target.closest('.say2'); if (s2) play(s2.textContent.replace('🔊', '').trim()); };
    if ($('bye')) $('bye').onclick = close;
    if ($('next')) $('next').onclick = () => { close(); if (f.step < f.steps.length) setTimeout(() => openTalk(f), 300); };
    if ($('ok')) $('ok').onclick = () => {
      if (!f.acc) { f.acc = true; if (!stillThere(st.want) && bookCount[st.want]) f.has = true; }
      const w = word(st.want); close(); toast(f.has ? `Du hast schon ${w.icon} ${w.en}! Gib es ${f.name}.` : `Finde: ${w.icon} ${w.en} (${w.de})`);
    };
    play(line.en);
  }
  // name signs over the friends' heads
  const labels = pals.map((f) => { const d = document.createElement('div'); d.className = 'lab'; $('labels').appendChild(d); return d; });
  const lv = new THREE.Vector3();
  function drawLabels() {
    pals.forEach((f, i) => {
      const el = labels[i], a = f.a, d = Math.hypot(a.x - P.x, a.z - P.z);
      lv.set(a.x, a.y + (a.kind === 'owl' ? 1.15 : 0.8), a.z).project(camera);
      if (busy || d > 30 || lv.z > 1 || Math.abs(lv.x) > 1.1 || Math.abs(lv.y) > 1.1) { el.style.display = 'none'; return; }
      const st = f.steps[f.step];
      const badge = !st ? '❤️' : st.want && f.acc ? (f.has ? '✅' : word(st.want).icon) : '💬';
      const html = `${f.name} <span>${badge}</span>`; if (el.dataset.h !== html) { el.innerHTML = html; el.dataset.h = html; }
      el.style.display = 'block'; el.style.transform = `translate(${((lv.x + 1) / 2) * window.innerWidth}px, ${((1 - lv.y) / 2) * window.innerHeight}px) translate(-50%, -100%)`;
    });
  }

  // ---------------- digging: mounds of earth with something buried
  const digs = placeDigs();
  for (const g of digs) {
    const grp = new THREE.Group(); grp.add(boxMesh(MOUND, boxMat));
    grp.position.set(g.x, g.y, g.z); grp.rotation.y = g.x * 1.7; scene.add(grp); g.g = grp;
  }
  const showDig = (g) => { g.g.visible = !g.dug; };
  function digNear() { for (const g of digs) if (!g.dug && Math.hypot(g.x - P.x, g.z - P.z) < 1.7) return g; return null; }
  // flying bits of earth while she digs
  const DIRT = 14, dirtMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), new THREE.MeshLambertMaterial({ color: 0x7a5533 }), DIRT);
  dirtMesh.frustumCulled = false; scene.add(dirtMesh);
  const bits = Array.from({ length: DIRT }, () => ({ t: 9 }));
  function dirt(x, y, z) {
    const b = bits.find((q) => q.t > 0.8) || bits[0];
    const back = P.face; // throw the earth backwards, behind her
    Object.assign(b, { t: 0, x, y: y + 0.2, z, vx: Math.cos(back) * 2 + (Math.random() - 0.5), vy: 2.5 + Math.random() * 1.5, vz: -Math.sin(back) * 2 + (Math.random() - 0.5) });
  }
  const dm = new THREE.Matrix4(), dq = new THREE.Quaternion(), dp = new THREE.Vector3(), dsc = new THREE.Vector3();
  function drawDirt(dt) {
    bits.forEach((b, i) => {
      b.t += dt;
      if (b.t < 0.8) { b.vy -= 12 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt; }
      dp.set(b.x || 0, b.y || -50, b.z || 0); dsc.setScalar(b.t < 0.8 ? 1 : 0); dm.compose(dp, dq, dsc); dirtMesh.setMatrixAt(i, dm);
    });
    dirtMesh.instanceMatrix.needsUpdate = true;
  }
  // ---------------- digging blocks: the earth block in front of her goes away (or the one she stands on)
  const changed = new Map();   // cell → new height (saved)
  let earth = 0, digHold = false, digTold = 0;
  function frontCell() {
    const g = digNear(); if (g) return [Math.floor(g.x), Math.floor(g.z), g];
    const fx = -Math.cos(P.face), fz = Math.sin(P.face), px = Math.floor(P.x), pz = Math.floor(P.z);
    for (const k of [0.75, 1.1, 1.5]) { const x = Math.floor(P.x + fx * k), z = Math.floor(P.z + fz * k); if (x !== px || z !== pz) return [x, z, null]; }
    return [px, pz, null];
  }
  function whyNot(x, z) {
    const i = z * SIZE + x, h = H[i];
    if (x < 3 || z < 3 || x > SIZE - 4 || z > SIZE - 4) return 'Hier geht es nicht weiter.';
    if (Math.abs(x - DEN[0]) <= 2 && Math.abs(z - DEN[1]) <= 2) return 'Nicht am eigenen Bau graben! 🏠';
    if (solid[i]) return 'Da steht etwas im Weg.';
    if (h >= STONE) return 'Stein ist zu hart zum Graben. 🪨';
    if (h <= 1) return 'Tiefer geht es nicht.';
    if (h <= WATER && P.y < WATER + 0.5) return null;   // she may dig under water too: the pond gets deeper
    return null;
  }
  function startDig() {
    if (act || busy || P.air) return;
    const [x, z, g] = frontCell(), no = whyNot(x, z);
    if (no) { if (performance.now() - digTold > 2500) { toast(no); digTold = performance.now(); } return; }
    P.face = Math.atan2(z + 0.5 - P.z, -(x + 0.5 - P.x));
    act = { kind: 'dig', t: 0, d: g ? 1.6 : 0.85, x, z, mound: g };
  }
  function setHeight(x, z, h) {
    const i = z * SIZE + x; H[i] = h; changed.set(i, h);
    const dc = DECO.get(i);   // flowers / grass on that block are gone
    if (dc) { const pc = pieces[dc[0]], zero = new THREE.Matrix4().makeScale(0, 0, 0); for (let k = dc[1]; k < dc[2]; k++) pc.bm.setMatrixAt(k, zero); pc.bm.instanceMatrix.needsUpdate = true; DECO.delete(i); }
    for (const f of finds) if (Math.floor(f.x) === x && Math.floor(f.z) === z) { f.y = h; f.g.position.y = h; }
    for (const m of marks) if (Math.floor(m.x) === x && Math.floor(m.z) === z) m.y = h;
    for (const a of animals) if (a.hole && Math.floor(a.hx) === x && Math.floor(a.hz) === z) a.hole.position.y = h;
  }
  function reland(cells) {
    const todo = new Set();
    for (const [x, z] of cells) for (const [a, b] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const cx = Math.floor((x + a) / CHUNK), cz = Math.floor((z + b) / CHUNK);
      if (cx >= 0 && cz >= 0 && cx < SIZE / CHUNK && cz < SIZE / CHUNK) todo.add(cz * (SIZE / CHUNK) + cx);
    }
    for (const ci of todo) {
      const pc = pieces[ci], land = buildLand(landMat, pc.cx * CHUNK, pc.cz * CHUNK);
      pc.g.remove(pc.land); pc.land.geometry.dispose(); pc.g.add(land); pc.land = land;
    }
  }
  function digDone(a0) {
    const { x, z } = a0, h = H[z * SIZE + x];
    if (whyNot(x, z)) return;
    setHeight(x, z, h - 1); reland([[x, z]]);
    for (let k = 0; k < 6; k++) dirt(x + 0.5, h - 0.6, z + 0.5);
    earth++;
    if (a0.mound) digUp(a0.mound);
    else if (wantDug() && Math.random() < 0.3) digUp({ kind: wantDug(), g: new THREE.Group(), x: x + 0.5, z: z + 0.5 });   // a friend wants it: easier to find
    else if (Math.random() < 0.08) {   // sometimes there is something in the earth
      const r = Math.random(), kind = r < 0.55 ? 'worm' : r < 0.75 ? 'bone' : r < 0.9 ? 'carrot' : 'potato';
      digUp({ kind, g: new THREE.Group(), x: x + 0.5, z: z + 0.5 });
    }
    if (H[Math.floor(P.z) * SIZE + Math.floor(P.x)] < P.y - 0.6) { P.air = true; P.vy = 0; }   // the block under her: she drops in
    showEarth(); save();
  }
  function earn(n) { earth += n; showEarth(); }
  const showEarth = () => { $('earth').textContent = `🟫 ${earth}`; $('earth').style.display = earth ? 'block' : 'none'; $('build').style.display = earth ? 'block' : 'none'; };
  // building: one earth block onto the block in front of her (a wall, steps up a hill, a bridge over water)
  let buildHold = false;
  function startBuild() {
    if (act || busy || P.air) return;
    if (earth <= 0) { if (performance.now() - digTold > 2500) { toast('Keine Erde mehr. Grab zuerst! 🐾'); digTold = performance.now(); } return; }
    const fx = -Math.cos(P.face), fz = Math.sin(P.face), px = Math.floor(P.x), pz = Math.floor(P.z);
    let x = px, z = pz; for (const k of [0.75, 1.1, 1.5]) { x = Math.floor(P.x + fx * k); z = Math.floor(P.z + fz * k); if (x !== px || z !== pz) break; }
    const i = z * SIZE + x, h = H[i];
    let no = null;
    if (x < 3 || z < 3 || x > SIZE - 4 || z > SIZE - 4) no = 'Hier geht es nicht.';
    else if (Math.abs(x - DEN[0]) <= 2 && Math.abs(z - DEN[1]) <= 2) no = 'Nicht auf den Bau! 🏠';
    else if (solid[i]) no = 'Da steht etwas im Weg.';
    else if (h >= Math.floor(P.y) + 2 || h >= 18) no = 'Zu hoch – stell dich höher hin.';
    if (no) { if (performance.now() - digTold > 2500) { toast(no); digTold = performance.now(); } return; }
    act = { kind: 'build', t: 0, d: 0.45, x, z };
  }
  function buildDone(a0) {
    const { x, z } = a0, h = H[z * SIZE + x];
    setHeight(x, z, Math.max(h, WATER - 1) + 1); reland([[x, z]]);
    earth--; for (let k = 0; k < 3; k++) dirt(x + 0.5, h + 0.6, z + 0.5);
    showEarth(); save();
  }
  $('build').addEventListener('pointerdown', (e) => { e.preventDefault(); buildHold = true; startBuild(); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) $('build').addEventListener(ev, () => { buildHold = false; });

  // ---------------- the den: build nice things from earth and found things
  const spent = {}, built = new Set(), decorMeshes = {};
  const glowMat = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff });
  const DC = [DEN[0] + 0.5, DEN[1] + 0.5];
  function showDecor(d) {
    if (decorMeshes[d.id]) return;
    const g = new THREE.Group(); g.add(boxMesh(d.boxes, boxMat)); if (d.glow) g.add(boxMesh(d.glow, glowMat));
    const x = DC[0] + d.at[0], z = DC[1] + d.at[1];
    g.position.set(x, d.id === 'fence' ? 0 : at(Math.floor(x), Math.floor(z)), z); if (d.id === 'fence') g.position.y = at(DEN[0], DEN[1]);
    scene.add(g); decorMeshes[d.id] = g;
    if (d.id !== 'fence' && d.id !== 'path') solid[Math.floor(z) * SIZE + Math.floor(x)] = 1;   // she walks around it
  }
  const have = (k) => (k === 'earth' ? earth : (bookCount[k] || 0) - (spent[k] || 0));
  const costText = (c) => Object.entries(c).map(([k, n]) => `${k === 'earth' ? '🟫' : word(k).icon} ${have(k) >= n ? '' : '<span class="no">'}${Math.max(0, have(k))}/${n}${have(k) >= n ? '' : '</span>'}`).join(' · ');
  function openHome() {
    if (busy) return;
    busy = true; keys.clear(); input.x = input.y = 0; stickId = null; stick.style.display = 'none';
    const card = $('card');
    const draw = () => {
      card.innerHTML = `<p class="small">Ralucas Bau · 🟫 ${earth} Erde · ${built.size} von ${DECOR.length} gebaut</p>
        <div class="decor">${DECOR.map((d) => { const ok = Object.entries(d.cost).every(([k, n]) => have(k) >= n);
          return `<div class="item ${built.has(d.id) ? 'done' : ''}"><span class="ic">${d.icon}</span><span class="nm"><b data-say="${d.en}">${d.en} 🔊</b><small>${d.de}</small><small>${built.has(d.id) ? '✓ gebaut' : costText(d.cost)}</small></span>
          ${built.has(d.id) ? '' : `<button class="btn ${ok ? 'primary' : ''}" data-id="${d.id}" ${ok ? '' : 'disabled'}>Bauen</button>`}</div>`; }).join('')}</div>
        <p class="small">Erde 🟫 bekommst du beim Graben, die anderen Dinge findest du in der Welt.</p>
        <div class="row"><button class="btn primary" id="closeHome">Fertig</button></div>`;
    };
    draw();
    $('sheet').classList.add('open');
    card.onclick = (ev) => {
      const sayIt = ev.target.closest('[data-say]'); if (sayIt) { play(sayIt.dataset.say); return; }
      const b = ev.target.closest('.item button[data-id]');
      if (b) {
        const d = DECOR.find((x) => x.id === b.dataset.id);
        if (!d || built.has(d.id) || !Object.entries(d.cost).every(([k, n]) => have(k) >= n)) return;
        // first spell its English name, then it is built
        card.innerHTML = `<p class="small">Bevor Raluca baut: Schreib das Wort auf Englisch!</p><p class="de">${d.icon} ${esc(d.de)}</p>
          <div class="row"><button class="btn" id="hearW">🔊 Anhören</button></div><div id="spell"></div><div class="row"><button class="btn" id="backHome">Zurück</button></div>`;
        $('hearW').onclick = (e2) => { e2.stopPropagation(); play(d.en); };
        $('backHome').onclick = (e2) => { e2.stopPropagation(); draw(); };
        spellInto($('spell'), d.en, () => {
          for (const [k, n] of Object.entries(d.cost)) { if (k === 'earth') earth -= n; else spent[k] = (spent[k] || 0) + n; }
          built.add(d.id); showDecor(d); showEarth(); cheer = 1; save(); draw(); toast(`Gebaut: ${d.icon} ${d.en}!`);
        });
        return;
      }
      if (ev.target.id === 'closeHome') { $('sheet').classList.remove('open'); card.onclick = null; busy = false; }
    };
  }
  $('homeBtn').addEventListener('click', openHome);
  $('dig').addEventListener('pointerdown', (e) => { e.preventDefault(); digHold = true; startDig(); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) $('dig').addEventListener(ev, () => { digHold = false; });
  function digUp(g) {
    g.dug = true; if (g.g.parent) showDig(g); book(g.kind); cheer = 0.8;
    const w = DIG_KINDS[g.kind], first = bookCount[g.kind] === 1;
    if (g.kind === 'carrot' || g.kind === 'potato') needs.food = Math.min(100, needs.food + 20);
    $('found').innerHTML = `<span class="ic">${w.icon}</span><span><b>${g.kind === 'treasure' ? 'a treasure!' : w.en}</b><small>${w.de}${first ? ' · neu im Buch!' : ''}</small></span><span class="say">🔊</span>`;
    $('found').classList.add('show'); clearTimeout(foundTimer); foundTimer = setTimeout(() => $('found').classList.remove('show'), 4200);
    $('found').onclick = () => play(w.en);
    play(w.en);
  }

  function sniff() {
    // the nearest open question mark, hidden thing or mound of earth
    let n = nearest();
    for (const g of digs) { if (g.dug) continue; const d = Math.hypot(g.x - P.x, g.z - P.z); if (!n || d < n.d) n = { m: g, d }; }
    for (const f of finds) { if (f.got) continue; const d = Math.hypot(f.x - P.x, f.z - P.z); if (!n || d < n.d) n = { m: f, d }; }
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
      localStorage.setItem(KEY, JSON.stringify({ v: 1, x: P.x, z: P.z, face: P.face, tday, ...needs, caught, book: bookCount, got: finds.map((f, i) => (f.got ? i : -1)).filter((i) => i >= 0), dug: digs.map((g, i) => (g.dug ? i : -1)).filter((i) => i >= 0), holes: [...changed], earth, built: [...built], spent, pals: Object.fromEntries(pals.map((f) => [f.id, [f.step, f.acc ? 1 : 0, f.has ? 1 : 0]])), round, done: marks.map((m, i) => (m.done ? i : -1)).filter((i) => i >= 0), at: Date.now() }));
    } catch { /* private mode: no saving */ }
  }
  function load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { d = null; }
    if (!d || d.v !== 1) return;
    if (Array.isArray(d.holes)) {
      const cells = [];
      for (const [i, h] of d.holes) if (Number.isInteger(i) && i >= 0 && i < H.length && Number.isInteger(h) && h >= 1 && h <= 19) { setHeight(i % SIZE, Math.floor(i / SIZE), h); cells.push([i % SIZE, Math.floor(i / SIZE)]); }
      if (cells.length) reland(cells);
    }
    if (Number.isFinite(d.earth)) earth = d.earth;
    if (d.spent && typeof d.spent === 'object') for (const [k, n] of Object.entries(d.spent)) if (word(k) && Number.isFinite(n)) spent[k] = n;
    for (const id of d.built || []) { const dd = DECOR.find((x) => x.id === id); if (dd) { built.add(id); showDecor(dd); } }
    if (d.pals) for (const f of pals) { const v = d.pals[f.id]; if (Array.isArray(v) && Number.isInteger(v[0])) { f.step = Math.max(0, Math.min(f.steps.length, v[0])); f.acc = !!v[1]; f.has = !!v[2]; } }
    showEarth();
    if (Number.isFinite(d.x) && Number.isFinite(d.z) && !blocked(d.x, d.z, groundAt(d.x, d.z))) { P.x = d.x; P.z = d.z; P.y = groundAt(P.x, P.z); P.face = d.face || 0; }
    if (Number.isFinite(d.tday)) tday = d.tday;
    if (Number.isFinite(d.caught)) caught = d.caught;
    if (d.book && typeof d.book === 'object') for (const [k, n] of Object.entries(d.book)) if (word(k) && Number.isFinite(n)) bookCount[k] = n;
    for (const i of d.got || []) if (finds[i]) finds[i].got = true;
    for (const i of d.dug || []) if (digs[i]) { digs[i].dug = true; showDig(digs[i]); }
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
  window.WELT = { actor, P, stats, input, setYaw: (v) => { yaw = v; }, marks: () => marks, groundAt, animals, at, spots: { HILL, POND, DEN, RIVER, PONDS, RIVERS }, needs, life: () => ({ tday, act, trail: !!trail }), setTime: (t) => { tday = t; }, doAction, save, BUSHES, finds, digs, bookCount, pals, openTalk, startBuild, openHome, built, addEarth: (n) => { earth += n; showEarth(); }, startDig, frontCell, H, earth: () => earth, openBook, caught: () => caught };
  camera.position.set(P.x + 4, P.y + 4, P.z + 4);
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    step(dt);
    moveAnimals(animals, dt, P, time);
    drawTrail(dt);
    drawFinds();
    drawLabels();
    drawDirt(dt);
    if ((digHold || keys.has('KeyF')) && !act && !busy) startDig();
    if ((buildHold || keys.has('KeyG')) && !act && !busy) startBuild();
    $('homeBtn').style.display = !busy && Math.hypot(DC[0] - P.x, DC[1] - P.z) < 6 ? 'block' : 'none';
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

if (webglOk()) start(); else { $('err').style.display = 'flex'; $('hud').style.display = 'none'; $('jump').style.display = 'none'; $('dig').style.display = 'none'; $('act').style.display = 'none'; $('build').style.display = 'none'; }
