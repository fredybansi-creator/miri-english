// Ralucas Welt – the models (step 1). Every model is a list of small coloured boxes, so the whole world can be
// drawn as ONE instanced mesh (fast on a phone) and everything has the same block look.
//   MODELS.<name> = { en, de, boxes: [[x, y, z, sx, sy, sz, colour], ...], size }   (x/y/z = middle of the box)
// Units: 1 = one ground block. y = 0 is the ground. Animals look to −x (like Raluca).

/** m(u): returns add(x0, x1, y0, y1, z0, z1, colour) that takes corner numbers in "pixels" of size u. */
function maker(u) {
  const boxes = [];
  const add = (x0, x1, y0, y1, z0, z1, c) => { boxes.push([((x0 + x1) / 2) * u, ((y0 + y1) / 2) * u, ((z0 + z1) / 2) * u, (x1 - x0) * u, (y1 - y0) * u, (z1 - z0) * u, c]); };
  /** the same box on both sides (z and −z) */
  const both = (x0, x1, y0, y1, z0, z1, c) => { add(x0, x1, y0, y1, z0, z1, c); add(x0, x1, y0, y1, -z1, -z0, c); };
  return { boxes, add, both };
}
// small fixed random numbers, so a model looks the same every time
function rnd(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s & 0xffff) / 0x10000; }; }
const shade = (c, k) => { const r = Math.min(255, ((c >> 16) & 255) * k), g = Math.min(255, ((c >> 8) & 255) * k), b = Math.min(255, (c & 255) * k); return (r << 16) | (g << 8) | b; };

/** a crown of leaf blocks: layers = [[radius, y], ...] in half blocks */
function crown(M, layers, colours, seed, cut = 0.55) {
  const r = rnd(seed);
  for (const [rad, y] of layers) for (let a = -rad; a <= rad; a++) for (let b = -rad; b <= rad; b++) {
    const edge = Math.abs(a) === rad && Math.abs(b) === rad;
    if (edge && (rad > 1 || r() < cut)) continue;
    if (Math.abs(a) === rad && Math.abs(b) === rad - 1 && r() < 0.25) continue;
    M.add(a - 0.5, a + 0.5, y, y + 1, b - 0.5, b + 0.5, shade(colours[Math.floor(r() * colours.length)], 0.94 + r() * 0.12));
  }
}

function oak() {
  const M = maker(0.5), bark = 0x6e4a2b;
  M.add(-0.7, 0.7, 0, 6, -0.7, 0.7, bark);
  M.add(-1.1, -0.7, 0, 1.2, -0.4, 0.4, shade(bark, 0.9)); M.add(0.7, 1.1, 0, 0.9, -0.4, 0.4, shade(bark, 0.9));   // roots
  M.add(-0.4, 0.4, 0, 1, 0.7, 1.1, shade(bark, 0.9)); M.add(-0.4, 0.4, 0, 0.7, -1.1, -0.7, shade(bark, 0.9));
  M.add(0.7, 2, 4.2, 4.9, -0.3, 0.3, bark);                                                                     // a branch
  crown(M, [[2, 5], [3, 6], [3, 7], [2, 8], [1, 9]], [0x3f9a3a, 0x4cab42, 0x358a35], 11);
  for (const [x, y, z] of [[-3.2, 6.3, 1], [2, 5.4, -2.2], [1, 6, 3.2]]) M.add(x, x + 0.5, y, y + 0.5, z, z + 0.5, 0xd8322c);   // apples
  return M.boxes;
}
function pine() {
  const M = maker(0.5), bark = 0x5a3b24;
  M.add(-0.5, 0.5, 0, 9, -0.5, 0.5, bark);
  crown(M, [[3, 3], [2, 4], [3, 5.2], [2, 6.2], [2, 7.4], [1, 8.4], [1, 9.6], [0, 10.6], [0, 11.4]], [0x1f6b45, 0x257a4d, 0x1b5e3e], 5, 1);
  return M.boxes;
}
function birch() {
  const M = maker(0.5), bark = 0xe9e6dc;
  M.add(-0.5, 0.5, 0, 8, -0.5, 0.5, bark);
  for (const [y, s] of [[1, 1], [2.6, -1], [4, 1], [5.5, -1], [6.6, 1]]) { M.add(s > 0 ? -0.52 : 0.1, s > 0 ? -0.1 : 0.52, y, y + 0.35, -0.52, 0.52, 0x3a3a36); }
  crown(M, [[1, 6], [2, 7], [2, 8], [1, 9], [1, 10]], [0x8fcf55, 0x7fc24a, 0xa4d966], 23);
  return M.boxes;
}
function bush() {
  const M = maker(0.25);
  crown(M, [[2, 0], [2, 1], [1, 2]], [0x3c8f3a, 0x48a043, 0x317d33], 31, 0.3);
  for (const [x, y, z] of [[-2.6, 1.2, 0.5], [1.2, 2.1, -1.6], [0.4, 1.4, 2.5], [2.5, 0.8, 0.2], [-1.3, 2.2, 1.4]]) M.add(x, x + 0.45, y, y + 0.45, z, z + 0.45, 0xc62f4a);
  return M.boxes;
}
function rock() {
  const M = maker(0.125), g = 0x8c8f93;
  M.add(-4, 4, 0, 4, -3, 3, g); M.add(-3, 3, 4, 6, -2, 2.5, shade(g, 1.08)); M.add(2, 6, 0, 2.5, -1, 3.5, shade(g, 0.88));
  M.add(-6, -4, 0, 2, -2, 1, shade(g, 0.92)); M.add(-2, 1, 6, 6.8, -1, 2, 0x6ea24a); M.add(-4, -2, 4, 4.7, -3, -1, 0x6ea24a);   // moss
  M.add(1, 2.5, 4.5, 4.6, -3.02, -1, shade(g, 0.7));
  return M.boxes;
}
function log() {
  const M = maker(0.125), bark = 0x6b4729, wood = 0xd9b77e;
  M.add(-7, 7, 0, 4, -2, 2, bark); M.add(-7.2, -7, 0.4, 3.6, -1.6, 1.6, wood); M.add(7, 7.2, 0.4, 3.6, -1.6, 1.6, wood);
  M.add(-7.25, -7.2, 1.4, 2.6, -0.6, 0.6, shade(wood, 0.8)); M.add(7.2, 7.25, 1.4, 2.6, -0.6, 0.6, shade(wood, 0.8));
  M.add(-3, 2, 4, 4.5, -1.5, 1, 0x6ea24a);                                                                       // moss
  M.add(3, 4, 4, 5.5, 0, 1, 0xf2ead8); M.add(2.3, 4.7, 5.5, 6.5, -0.7, 1.7, 0xc9853a);                         // a small mushroom
  M.add(-2, 0, 2, 3, 2, 3.5, bark);                                                                              // a stub
  return M.boxes;
}
function mushroom() {
  const M = maker(0.0625), red = 0xd63a2f, w = 0xf7f1e3;
  M.add(-1.5, 1.5, 0, 5, -1.5, 1.5, w); M.add(-2, 2, 2.6, 3.2, -2, 2, shade(w, 0.9));
  M.add(-5, 5, 5, 7, -5, 5, red); M.add(-4, 4, 7, 9, -4, 4, red); M.add(-2.5, 2.5, 9, 10, -2.5, 2.5, red);
  for (const [x, y, z] of [[-5.1, 5.5, -2], [-5.1, 5.6, 2], [1, 7, 3.1], [-2, 9, -0.5], [2, 10, 0.5], [3.1, 7.2, -2], [-1, 7, -4.1], [4.1, 5.4, 2]]) M.add(x, x + 1.4, y, y + 1.1, z, z + 1.4, w);
  // a small second one
  M.add(5, 6.6, 0, 3, 3, 4.6, w); M.add(3.8, 7.8, 3, 4.6, 1.8, 5.8, red); M.add(4.8, 6.8, 4.6, 5.4, 2.8, 4.8, red);
  return M.boxes;
}
function flowers() {
  const M = maker(0.0625), stem = 0x3f8f3a;
  const one = (x, z, h, c, mid) => {
    M.add(x - 0.4, x + 0.4, 0, h, z - 0.4, z + 0.4, stem); M.add(x + 0.4, x + 1.8, h * 0.4, h * 0.4 + 0.6, z - 0.5, z + 0.5, 0x4da043);
    M.add(x - 1.6, x + 1.6, h, h + 1, z - 0.6, z + 0.6, c); M.add(x - 0.6, x + 0.6, h, h + 1, z - 1.6, z + 1.6, c); M.add(x - 0.6, x + 0.6, h + 0.2, h + 1.3, z - 0.6, z + 0.6, mid);
  };
  one(-4, -2, 6, 0xffffff, 0xffd84a); one(1, 3, 8, 0xff7f9e, 0xffe27a); one(4, -3, 5, 0xb48cff, 0xffd84a); one(-2, 4, 4.5, 0xffb03d, 0x8a4b12);
  return M.boxes;
}
function reeds() {
  const M = maker(0.0625), r = rnd(9);
  for (let i = 0; i < 9; i++) { const x = -5 + r() * 10, z = -4 + r() * 8, h = 10 + r() * 9; M.add(x, x + 0.8, 0, h, z, z + 0.8, shade(0x5d9c45, 0.9 + r() * 0.2)); if (i % 3 === 0) M.add(x - 0.3, x + 1.1, h, h + 3.5, z - 0.3, z + 1.1, 0x6b4526); }
  return M.boxes;
}
function den() {
  const M = maker(0.25), dirt = 0x8a623c, grass = 0x58a94a, wood = 0x9a6b3d, r = rnd(4);
  // a mound of earth with grass on top, the entrance looks to −x
  for (const [x0, x1, y0, y1, z0, z1] of [[-6, 6, 0, 3, -6, 6], [-5, 6, 3, 5, -5, 5], [-3, 5, 5, 6.5, -4, 4], [-1, 4, 6.5, 7.5, -2.5, 2.5]]) {
    M.add(x0, x1, y0, y1 - 0.6, z0, z1, shade(dirt, 0.95 + r() * 0.1)); M.add(x0, x1, y1 - 0.6, y1, z0, z1, shade(grass, 0.95 + r() * 0.1));
  }
  M.add(-6.3, -5.4, 0, 4.2, -2.4, 2.4, 0x1c130c);                                                               // the dark hole
  M.add(-6.6, -5.8, 0, 4.6, -3, -2.2, wood); M.add(-6.6, -5.8, 0, 4.6, 2.2, 3, wood); M.add(-6.7, -5.7, 4.2, 5.1, -3.3, 3.3, shade(wood, 1.1));   // door frame
  M.add(-8.5, -6.3, 0, 0.25, -2, 2, 0xcdb58a);                                                                   // a mat of straw
  M.add(-7.4, -6.9, 0, 2.6, 3.6, 4.1, wood); M.add(-7.7, -6.6, 2.6, 3.7, 3.3, 4.4, 0xffd45a);                  // a little lantern
  for (const [x, z, c] of [[2, 1, 0xffffff], [-1, -3, 0xff7f9e], [4, -2, 0xffd84a], [0, 2, 0xb48cff]]) { M.add(x, x + 0.2, 6.5 + (x > -1 && x < 4 && Math.abs(z) < 2.5 ? 1 : -1.5), 7.4 + (x > -1 && x < 4 && Math.abs(z) < 2.5 ? 1 : -1.5), z, z + 0.2, 0x3f8f3a); M.add(x - 0.2, x + 0.4, 7.4 + (x > -1 && x < 4 && Math.abs(z) < 2.5 ? 1 : -1.5), 7.9 + (x > -1 && x < 4 && Math.abs(z) < 2.5 ? 1 : -1.5), z - 0.2, z + 0.4, c); }
  return M.boxes;
}

// ------------------------------------------------------------------ animals
function mouse() {
  const M = maker(0.045), f = 0xa48a6f, pink = 0xf0a6a6;
  M.add(0, 7, 1, 5.5, -2.2, 2.2, f); M.add(1, 6, 5.5, 6.2, -1.6, 1.6, shade(f, 1.05)); M.add(0.5, 6.5, 0.8, 1.6, -1.8, 1.8, 0xe9dcc8);
  M.add(-3, 0.4, 1.2, 4.8, -1.7, 1.7, f); M.add(-4.2, -3, 1.4, 3.4, -1, 1, shade(f, 1.08)); M.add(-4.8, -4.2, 2, 3, -0.5, 0.5, pink);
  M.both(-1.4, -0.6, 4.4, 6.8, 0.6, 2.6, f); M.both(-1.5, -1.4, 4.8, 6.4, 1, 2.2, pink);
  M.both(-3.3, -2.7, 3, 3.8, 1.2, 1.8, 0x1b1410);
  M.both(0.5, 1.7, 0, 1, 1.2, 2.2, pink); M.both(5, 6.4, 0, 1, 1.4, 2.4, pink);
  M.add(7, 10, 1.6, 2.3, -0.35, 0.35, pink); M.add(10, 12.5, 2.2, 2.9, -0.35, 0.35, pink); M.add(12.5, 14, 3, 3.6, -0.3, 0.3, pink);
  return M.boxes;
}
function rabbit() {
  const M = maker(0.06), f = 0xc8b396, light = 0xefe5d3, pink = 0xf0a6a6;
  M.add(0, 8, 2, 8, -2.6, 2.6, f); M.add(0.5, 7, 1.6, 2.6, -2, 2, light); M.add(6.5, 8.6, 3, 7, -2.2, 2.2, shade(f, 0.96));
  M.add(-4, 0.6, 5, 10, -2.2, 2.2, f); M.add(-4.6, -4, 5.4, 7.6, -1.4, 1.4, light); M.add(-5, -4.6, 6.6, 7.4, -0.5, 0.5, pink);
  M.both(-2.6, -1.4, 10, 15.5, 0.5, 1.9, f); M.both(-2.7, -2.6, 10.6, 14.8, 0.8, 1.6, pink);
  M.both(-3.6, -2.9, 7.6, 8.8, 2.2, 2.35, 0x1b1410); M.both(-3.6, -3.3, 8.3, 8.8, 2.35, 2.4, 0xffffff);
  M.both(0.4, 2, 0, 2.4, 1, 2.3, f); M.both(4.6, 8.4, 0, 3.4, 1.6, 3.2, f); M.both(3.6, 5.2, 0, 1.2, 1.8, 3.2, light);
  M.add(8.4, 10, 4, 6.2, -1.1, 1.1, 0xffffff);
  return M.boxes;
}
function owl() {
  const M = maker(0.06), f = 0x8a6642, dark = 0x6b4c30, cream = 0xeadcc0, org = 0xf0a030;
  M.add(-3, 3, 2, 11, -3.5, 3.5, f); M.add(-3.5, -3, 3, 9, -2.6, 2.6, cream);
  for (const [y, z] of [[4, -1.5], [4, 1], [5.6, -0.3], [5.6, 1.9], [7.2, -1.6], [7.2, 0.8]]) M.add(-3.62, -3.5, y, y + 0.8, z, z + 0.9, dark);   // chest spots
  M.add(-3.2, 3.2, 11, 16, -3.8, 3.8, f); M.both(-1.5, 1.5, 16, 17.6, 2.4, 3.8, dark);                           // head, ear tufts
  M.both(-3.7, -3.2, 12, 15.4, 0.4, 3.2, cream); M.both(-3.95, -3.7, 12.8, 14.8, 1, 2.6, 0xf5c542); M.both(-4.1, -3.95, 13.3, 14.4, 1.4, 2.2, 0x15100c);
  M.both(-4.15, -4.1, 14, 14.4, 1.4, 1.75, 0xffffff);
  M.add(-4.5, -3.2, 11.4, 12.6, -0.55, 0.55, org); M.add(-4.2, -3.6, 10.8, 11.4, -0.3, 0.3, shade(org, 0.85));
  M.both(-2.2, 2.4, 3, 10.4, 3.5, 4.4, dark); M.both(-1.4, 1.8, 2.2, 3, 3.5, 4.2, shade(dark, 0.85));
  M.add(1, 3.6, 2.4, 6, -2, 2, dark);                                                                            // tail
  M.both(-3.2, -0.6, 0.6, 2, 0.6, 2.2, org); M.both(-4, -3.2, 0.6, 1.1, 0.6, 1, org); M.both(-4, -3.2, 0.6, 1.1, 1.7, 2.2, org);
  return M.boxes;
}
function hedgehog() {
  const M = maker(0.05), sp = 0x5b4332, face = 0xe8cfa6, r = rnd(17);
  M.add(-1, 8, 1, 6.6, -3.6, 3.6, sp); M.add(0, 7, 6.6, 7.6, -2.8, 2.8, sp); M.add(8, 8.8, 1.4, 5.6, -2.8, 2.8, sp);
  for (let x = -0.5; x < 8; x += 1.5) for (let z = -3.2; z < 3.4; z += 1.4) { const top = Math.abs(z) < 2.6 && x > 0 && x < 6.6; M.add(x, x + 0.7, top ? 7.6 : 6.6, (top ? 7.6 : 6.6) + 0.7 + r() * 0.5, z, z + 0.7, shade(0xcbb593, 0.9 + r() * 0.2)); }
  for (let x = 0; x < 8; x += 1.6) for (let y = 2.4; y < 6; y += 1.6) M.both(x, x + 0.7, y, y + 0.7, 3.6, 4.1 + r() * 0.4, 0xcbb593);
  M.add(-4.2, -1, 1, 5.2, -2.6, 2.6, face); M.add(-6.2, -4.2, 1.4, 3.6, -1.2, 1.2, face); M.add(-6.9, -6.2, 2.2, 3.4, -0.6, 0.6, 0x1b1410);
  M.both(-3.9, -3.2, 3.6, 4.5, 1.9, 2.65, 0x1b1410); M.both(-2.2, -1.2, 4.8, 6, 1.6, 2.8, shade(face, 0.85));
  M.add(-1, 7.6, 0.6, 1.2, -2.8, 2.8, face); M.both(-0.6, 0.8, 0, 1, 1.4, 2.6, shade(face, 0.8)); M.both(5.4, 6.8, 0, 1, 1.4, 2.6, shade(face, 0.8));
  return M.boxes;
}
function fish() {
  const M = maker(0.05), b = 0x5f9fc4, belly = 0xdfeef3, fin = 0xf08a3c;
  M.add(-5, 4, 2, 7, -1.1, 1.1, b); M.add(-6.4, -5, 2.8, 6.2, -0.9, 0.9, b); M.add(-5, 4, 1.4, 2.6, -0.9, 0.9, belly); M.add(4, 5.6, 3, 6, -0.7, 0.7, b);
  for (const x of [-2.6, -0.4, 1.8]) M.both(x, x + 0.9, 3.4, 6.4, 1.1, 1.18, shade(b, 0.8));                     // stripes
  M.add(5.6, 7, 2, 7, -0.35, 0.35, fin); M.add(7, 8.2, 1, 8, -0.35, 0.35, fin);
  M.add(-2.6, 2, 7, 8.6, -0.3, 0.3, fin); M.add(-1.4, 1, 8.6, 9.4, -0.3, 0.3, fin); M.add(-1.5, 0.5, 0.4, 1.4, -0.3, 0.3, fin);
  M.both(-3, -1.4, 2.8, 3.6, 1.1, 2.2, fin);
  M.both(-5.2, -4.2, 4.6, 5.6, 0.9, 1.16, 0xffffff); M.both(-5, -4.5, 4.8, 5.3, 1.16, 1.22, 0x15100c);
  return M.boxes;
}

const def = (en, de, boxes, extra = {}) => ({ en, de, boxes, ...extra });
export const MODELS = {
  oak: def('oak tree', 'Eiche', oak()),
  pine: def('pine tree', 'Tanne', pine()),
  birch: def('birch tree', 'Birke', birch()),
  bush: def('berry bush', 'Beerenbusch', bush()),
  rock: def('rock', 'Stein', rock()),
  log: def('log', 'Baumstamm', log()),
  mushroom: def('mushroom', 'Pilz', mushroom()),
  flowers: def('flowers', 'Blumen', flowers()),
  reeds: def('reeds', 'Schilf', reeds()),
  den: def('den', 'Fuchsbau', den()),
  mouse: def('mouse', 'Maus', mouse(), { animal: true }),
  rabbit: def('rabbit', 'Hase', rabbit(), { animal: true }),
  owl: def('owl', 'Eule', owl(), { animal: true }),
  hedgehog: def('hedgehog', 'Igel', hedgehog(), { animal: true }),
  fish: def('fish', 'Fisch', fish(), { animal: true }),
};
