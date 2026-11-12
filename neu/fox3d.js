// Raluca in 3D (three.js, built from code – no model file). Same idea as fox.js (2D):
//   mountFox3d(container) → { trick(name), setMood(m), dress(wearing), tricks, el, dispose() }
// The fox is made of smooth shapes with a cartoon (toon) look and a thin dark outline, like the 2D Raluca.
// Every moving part is a Group with its pivot at the joint; a "pose" (plain numbers) is set every frame from
// the idle motion plus the running trick, so tricks can never leave her in a strange position.
// Facing: she looks to the left of the screen (−x), the camera sees her from the front-left.

import * as THREE from './vendor/three.module.min.js';

// ------------------------------------------------------------------ colours (same as the 2D fox)
const C = {
  fur: 0xf48a37, furLight: 0xffb26a, cream: 0xfff3e4, sock: 0x6e3a1d, earIn: 0x5a2e17,
  eye: 0x2a160a, nose: 0x2a1508, line: 0x6b3417, blush: 0xff9c9c, sky1: '#bfe3f6', sky2: '#eef8fc',
  grass: 0x9fd37f, bowl: 0x3f78d6, food: 0xa5612c,
};

// ------------------------------------------------------------------ materials
function toonRamp() {
  const data = new Uint8Array([150, 205, 255]); // three soft steps
  const t = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
}
const RAMP = toonRamp();
const mats = new Map();
function toon(color) {
  if (!mats.has(color)) mats.set(color, new THREE.MeshToonMaterial({ color, gradientMap: RAMP }));
  return mats.get(color);
}
const shiny = (color) => new THREE.MeshPhongMaterial({ color, shininess: 90, specular: 0x666666 });

// outline: the back faces of the same shape, pushed out along the normals, drawn in dark brown
const OUTLINE = new THREE.ShaderMaterial({
  uniforms: { color: { value: new THREE.Color(C.line) }, width: { value: 0.012 } },
  vertexShader: `uniform float width;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vec3 n = normalize(normalMatrix * normal);
      mv.xyz += n * width * (-mv.z) * 0.32;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: 'uniform vec3 color; void main() { gl_FragColor = vec4(color, 1.0); }',
  side: THREE.BackSide,
});

/** A mesh with toon colour and (optional) outline, placed in its parent. */
function part(geo, color, parent, { pos, rot, scale, dir, outline = true, material } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, material || toon(color));
  g.add(m);
  if (outline) g.add(new THREE.Mesh(geo, OUTLINE));
  if (pos) g.position.set(...pos);
  if (rot) g.rotation.set(...rot);
  if (dir) g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir).normalize());
  if (scale) g.scale.set(...scale);
  parent.add(g);
  return g;
}
const sphere = (r = 1, w = 40, h = 28) => new THREE.SphereGeometry(r, w, h);
/** Smooth body of revolution from a profile [radius, height] (around Y). */
function lathe(profile, seg = 40) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0001), y));
  return new THREE.LatheGeometry(new THREE.SplineCurve(pts).getPoints(48), seg);
}
const pivot = (parent, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };

// ------------------------------------------------------------------ the fox
function buildFox() {
  const fox = {};
  const root = new THREE.Group(); fox.root = root;          // stands on the ground (y = 0)
  const hip = pivot(root, 0.32, 0.56, 0); fox.hip = hip;    // body pivot: the hips (sit turns around here)

  // torso: one smooth shape along x (front = −x)
  const torsoGeo = lathe([[0, -0.40], [0.17, -0.37], [0.25, -0.26], [0.27, -0.08], [0.25, 0.10], [0.23, 0.26], [0.17, 0.38], [0, 0.43]]);
  const torso = part(torsoGeo, C.fur, hip, { pos: [-0.36, 0.02, 0], rot: [0, 0, Math.PI / 2], scale: [1, 1, 0.92] });
  fox.torso = torso;
  // cream chest and belly
  part(sphere(1), C.cream, hip, { pos: [-0.68, -0.02, 0], scale: [0.15, 0.2, 0.17], outline: false });
  part(sphere(1), C.cream, hip, { pos: [-0.42, -0.14, 0], scale: [0.26, 0.11, 0.17], outline: false });

  // legs (pivot at the top). Each: orange upper part, dark "sock" with a round paw.
  const legGeo = lathe([[0, 0.04], [0.075, 0.0], [0.078, -0.12], [0.068, -0.24], [0.062, -0.32], [0, -0.34]], 24);
  const sockGeo = lathe([[0, -0.27], [0.063, -0.27], [0.066, -0.34], [0.074, -0.42], [0.06, -0.47], [0, -0.48]], 24);
  const leg = (x, z, far) => {
    const g = pivot(hip, x, -0.06, z);
    part(legGeo, far ? 0xdc7a30 : C.fur, g, { scale: [1, 1.0, 1] });
    part(sockGeo, far ? 0x5a2e17 : C.sock, g, { outline: true });
    return g;
  };
  // the camera is at +z, so the legs with z < 0 are on the far side (a bit darker)
  fox.legFL = leg(-0.62, 0.12, false); fox.legFR = leg(-0.62, -0.12, true);
  fox.legBL = leg(-0.02, 0.13, false); fox.legBR = leg(-0.02, -0.13, true);

  // tail: bushy shape with a white tip, pivot at the base
  const tail = pivot(hip, 0.08, 0.1, 0); fox.tail = tail;
  const tailInner = new THREE.Group(); tailInner.rotation.z = -0.75; tail.add(tailInner);
  part(lathe([[0, 0], [0.07, 0.03], [0.16, 0.18], [0.21, 0.34], [0.18, 0.5], [0, 0.57]]), C.fur, tailInner, {});
  part(lathe([[0, 0.43], [0.13, 0.45], [0.12, 0.52], [0.06, 0.58], [0, 0.6]]), C.cream, tailInner, {});

  // head (pivot at the neck)
  const neck = pivot(hip, -0.66, 0.2, 0); fox.neck = neck;
  const head = pivot(neck, -0.04, 0.22, 0); head.scale.setScalar(1.15); fox.head = head;
  part(sphere(1), C.fur, head, { scale: [0.29, 0.27, 0.3] });
  // white lower face reaching up to the nose
  part(sphere(1), C.cream, head, { pos: [-0.08, -0.08, 0], scale: [0.25, 0.18, 0.27], outline: false });
  // snout
  part(sphere(1), C.cream, head, { pos: [-0.26, -0.06, 0], scale: [0.12, 0.085, 0.1] });
  part(sphere(1), C.nose, head, { pos: [-0.375, -0.03, 0], scale: [0.04, 0.032, 0.045], material: shiny(C.nose), outline: false });
  // cheek tufts
  for (const s of [1, -1]) {
    const tuft = new THREE.ConeGeometry(0.065, 0.16, 20);
    part(tuft, C.cream, head, { pos: [-0.02, -0.1, 0.25 * s], dir: [0.35, -0.45, 0.85 * s], outline: true });
  }
  // eyes: big and glossy, with a lid for blinking
  fox.eyes = [];
  for (const s of [1, -1]) {
    const e = pivot(head, -0.22, 0.05, 0.13 * s);
    part(sphere(1), C.eye, e, { scale: [0.05, 0.085, 0.07], material: shiny(C.eye), outline: false });
    part(sphere(1), 0xffffff, e, { pos: [-0.045, 0.035, 0.012 * s + 0.01], scale: [0.012, 0.022, 0.02], outline: false });
    part(sphere(1), 0xffffff, e, { pos: [-0.048, -0.025, -0.01 * s], scale: [0.006, 0.01, 0.01], outline: false });
    e.rotation.y = -0.35 * s;
    fox.eyes.push(e);
  }
  // brows
  fox.brows = [];
  for (const s of [1, -1]) {
    const b = part(new THREE.CapsuleGeometry(0.007, 0.05, 4, 8), 0x9a4a1f, head, { pos: [-0.235, 0.175, 0.13 * s], rot: [0, 0.35 * s, Math.PI / 2], outline: false });
    fox.brows.push(b);
  }
  // blush
  for (const s of [1, -1]) part(sphere(1), C.blush, head, { pos: [-0.2, -0.06, 0.2 * s], scale: [0.04, 0.025, 0.03], outline: false, material: new THREE.MeshBasicMaterial({ color: C.blush, transparent: true, opacity: 0.55 }) });
  // ears (pivot at the base)
  fox.ears = [];
  for (const s of [1, -1]) {
    const ear = pivot(head, 0.02, 0.2, 0.15 * s);
    ear.rotation.x = 0.32 * s;
    part(new THREE.ConeGeometry(0.11, 0.3, 24), C.fur, ear, { pos: [0, 0.13, 0], scale: [0.8, 1, 1] });
    part(new THREE.ConeGeometry(0.075, 0.22, 24), C.earIn, ear, { pos: [-0.045, 0.11, 0], scale: [0.5, 1, 1], outline: false });
    fox.ears.push(ear);
  }
  // anchors for clothes and the ball
  fox.anchor = {
    mouth: pivot(head, -0.32, -0.12, 0),
    eyes: pivot(head, -0.3, 0.05, 0),
    top: pivot(head, 0.0, 0.25, 0),
    earL: pivot(fox.ears[0], 0, 0.06, 0.03),
    neck: pivot(neck, 0.0, -0.02, 0),
  };
  return fox;
}

// ------------------------------------------------------------------ clothes and items (3D versions of the shop)
function heartShape(s) {
  const h = new THREE.Shape();
  h.moveTo(0, -0.9 * s);
  h.bezierCurveTo(-1.2 * s, -0.1 * s, -0.9 * s, 0.9 * s, 0, 0.35 * s);
  h.bezierCurveTo(0.9 * s, 0.9 * s, 1.2 * s, -0.1 * s, 0, -0.9 * s);
  return h;
}
function neckRing(a, color) {
  const g = pivot(a.neck, 0, 0, 0); g.rotation.z = 0.55;
  part(new THREE.TorusGeometry(0.21, 0.034, 12, 48), color, g, { rot: [Math.PI / 2, 0, 0] });
  return g;
}
const ITEMS = {
  bow: (a) => { const g = pivot(a.earL, -0.05, 0.02, 0); g.rotation.set(0.2, 0, -0.3); g.scale.setScalar(1.5);
    for (const s of [1, -1]) part(new THREE.ConeGeometry(0.05, 0.11, 16), 0xd8262c, g, { pos: [0, 0, 0.055 * s], rot: [s * Math.PI / 2, 0, 0], scale: [1, 1, 0.55] });
    part(sphere(0.03), 0xb81d22, g, {}); return g; },
  flower: (a) => { const g = pivot(a.earL, -0.05, 0.02, 0.02); g.scale.setScalar(1.4);
    for (let i = 0; i < 5; i++) { const t = (i / 5) * Math.PI * 2; part(sphere(0.032), 0xf7a6c8, g, { pos: [0, Math.sin(t) * 0.04, Math.cos(t) * 0.04], scale: [0.6, 1, 1] }); }
    part(sphere(0.025), 0xf5c84a, g, { pos: [-0.01, 0, 0] }); return g; },
  // neck items: a ring around the neck (lying flat, front a bit lower), the tag / knot / bell at the front
  collar: (a) => { const g = neckRing(a, 0xd8262c);
    part(new THREE.CylinderGeometry(0.045, 0.045, 0.014, 24), 0, g, { pos: [-0.235, -0.05, 0], rot: [0, 0, Math.PI / 2], material: shiny(0xf5c84a) }); return g; },
  bandana: (a) => { const g = neckRing(a, 0x3f78d6);
    part(new THREE.ConeGeometry(0.15, 0.26, 3), 0x3f78d6, g, { pos: [-0.2, -0.13, 0], rot: [0, Math.PI / 6, Math.PI - 0.15], scale: [1, 1, 0.45] }); return g; },
  bell: (a) => { const g = neckRing(a, 0x3fa65a);
    part(new THREE.SphereGeometry(0.055, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), 0, g, { pos: [-0.235, -0.06, 0], material: shiny(0xf5c84a) });
    part(sphere(0.016), 0xc99a1a, g, { pos: [-0.235, -0.12, 0] }); return g; },
  leash: (a, fox) => { const g = pivot(fox.root, 0, 0, 0); g.userData.leash = true;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]), 2, 0.012, 6), toon(0x8a4b22));
    g.add(tube); g.userData.tube = tube; return g; },
  bone: (a) => { const g = pivot(a.mouth, 0, 0, 0); g.rotation.y = Math.PI / 2;
    part(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 16), 0xf8f1df, g, { rot: [0, 0, Math.PI / 2] });
    for (const x of [-0.15, 0.15]) for (const y of [-0.025, 0.025]) part(sphere(0.032), 0xf8f1df, g, { pos: [x, y, 0] }); return g; },
  glasses: (a) => { const g = pivot(a.eyes, 0, 0, 0); g.rotation.y = Math.PI / 2;
    for (const z of [-0.13, 0.13]) part(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 32), 0x1d2430, g, { pos: [z, 0, -0.01], rot: [Math.PI / 2, 0, 0], scale: [1.1, 1, 0.85], material: shiny(0x1d2430) });
    part(new THREE.CapsuleGeometry(0.01, 0.08, 4, 8), 0x111111, g, { pos: [0, 0.03, -0.01], rot: [0, 0, Math.PI / 2] }); return g; },
  hearts: (a) => { const g = pivot(a.eyes, 0, 0, 0); g.rotation.y = Math.PI / 2;
    const geo = new THREE.ExtrudeGeometry(heartShape(0.08), { depth: 0.02, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 3 });
    for (const z of [-0.13, 0.13]) part(geo, 0xff5c93, g, { pos: [z, 0.02, -0.03] });
    part(new THREE.CapsuleGeometry(0.01, 0.07, 4, 8), 0xc0255d, g, { pos: [0, 0.04, 0.03], rot: [0, 0, Math.PI / 2] }); return g; },
  hat: (a) => { const g = pivot(a.top, 0.02, -0.02, 0); g.rotation.z = 0.12;
    part(new THREE.CylinderGeometry(0.34, 0.34, 0.025, 48), 0xf3d27a, g, {});
    part(new THREE.SphereGeometry(0.17, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), 0xf3d27a, g, { scale: [1, 0.75, 1] });
    part(new THREE.CylinderGeometry(0.172, 0.172, 0.04, 40, 1, true), 0xd8262c, g, { pos: [0, 0.03, 0], outline: false }); return g; },
  party: (a) => { const g = pivot(a.top, 0, 0, 0); g.rotation.z = 0.25;
    const c = document.createElement('canvas'); c.width = 64; c.height = 64; const x = c.getContext('2d');
    for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#7b4fd6' : '#f5c84a'; x.fillRect(0, i * 8, 64, 8); }
    const tex = new THREE.CanvasTexture(c);
    part(new THREE.ConeGeometry(0.11, 0.3, 32), 0, g, { pos: [0, 0.14, 0], material: new THREE.MeshToonMaterial({ map: tex, gradientMap: RAMP }) });
    part(sphere(0.035), 0xff5c93, g, { pos: [0, 0.3, 0] }); return g; },
  crown: (a) => { const g = pivot(a.top, 0, -0.01, 0); g.rotation.z = 0.1; g.scale.setScalar(1.3); const gold = shiny(0xf5c84a);
    part(new THREE.CylinderGeometry(0.15, 0.14, 0.08, 40, 1, true), 0, g, { material: gold });
    for (let i = 0; i < 6; i++) { const t = (i / 6) * Math.PI * 2; part(new THREE.ConeGeometry(0.03, 0.08, 12), 0, g, { pos: [Math.cos(t) * 0.14, 0.07, Math.sin(t) * 0.14], material: gold }); }
    part(sphere(0.028), 0xd8262c, g, { pos: [-0.15, 0, 0] }); return g; },
};

// ------------------------------------------------------------------ poses
const REST = {
  x: 0, y: 0, z: 0, turn: 0, squash: 0,          // whole fox
  pitch: 0, bodyY: 0,                            // body: pitch > 0 lifts the front (sit)
  headTurn: 0, headTilt: 0, headNod: 0,          // head
  fl: 0, fr: 0, bl: 0, br: 0,                    // leg swing (radians, − = paw goes forward)
  flS: 1, frS: 1, blS: 1, brS: 1,                // leg length
  tail: 0, tailUp: 0, earL: 0, earR: 0, blink: 0, brow: 0,
};
const BASE_TURN = 0.2; // turn her face a bit towards the camera
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
/** keyframes: [[time 0..1, {pose values}], ...] → pose at time t (smooth). */
function track(keys, t) {
  const out = {};
  const names = new Set(keys.flatMap(([, p]) => Object.keys(p)));
  for (const n of names) {
    const ks = keys.filter(([, p]) => n in p);
    let v = ks[0][1][n];
    for (let i = 0; i < ks.length - 1; i++) {
      const [t0, p0] = ks[i], [t1, p1] = ks[i + 1];
      if (t >= t0 && t <= t1) { v = lerp(p0[n], p1[n], ease((t - t0) / (t1 - t0 || 1))); break; }
      if (t > t1) v = p1[n];
    }
    out[n] = v;
  }
  return out;
}
const SIT = { pitch: 0.55, bodyY: -0.25, bl: -0.5, br: -0.5, blS: 0.55, brS: 0.55, fl: 0.55, fr: 0.55, flS: 1.2, frS: 1.2, headNod: -0.15, headTilt: 0.12, tailUp: -0.5 };
const DOWN = { bodyY: -0.34, fl: -1.45, fr: -1.45, bl: 1.45, br: 1.45, flS: 0.9, frS: 0.9, blS: 0.7, brS: 0.7, headNod: 0.15, earL: 0.25, earR: 0.25 };
const Z = { pitch: 0, fl: 0, fr: 0, bl: 0, br: 0, flS: 1, frS: 1, blS: 1, brS: 1, headNod: 0, headTilt: 0, bodyY: 0 };

// Every trick: duration (s) + pose(t). ball(t, fox) → where the ball is (world), or null.
const TRICKS = {
  happy: { d: 1.2, pose: (t) => ({ y: Math.abs(Math.sin(t * Math.PI * 2)) * 0.08, tail: Math.sin(t * Math.PI * 8) * 0.7, headTilt: Math.sin(t * Math.PI * 2) * 0.18, earL: Math.sin(t * Math.PI * 4) * 0.15, earR: -Math.sin(t * Math.PI * 4) * 0.15 }) },
  jump: { d: 1.15, pose: (t) => track([
    [0, { y: 0, squash: 0, fl: 0, fr: 0, bl: 0, br: 0, pitch: 0 }],
    [0.2, { y: 0, squash: 0.12, fl: 0.2, fr: 0.2, bl: -0.2, br: -0.2, pitch: -0.05 }],
    [0.5, { y: 0.32, squash: -0.06, fl: -0.9, fr: -0.9, bl: 0.9, br: 0.9, pitch: 0.1 }],
    [0.8, { y: 0, squash: 0.1, fl: 0.1, fr: 0.1, bl: -0.1, br: -0.1, pitch: 0 }],
    [1, { y: 0, squash: 0, fl: 0, fr: 0, bl: 0, br: 0, pitch: 0 }]], t) },
  spin: { d: 1.4, pose: (t) => ({ turn: ease(t) * Math.PI * 2, y: Math.sin(t * Math.PI) * 0.1, tail: Math.sin(t * Math.PI * 4) * 0.5 }) },
  // sit: the front comes up around the hips, the hips go down, the back legs fold forward, front legs stay straight
  sit: { d: 2.6, pose: (t) => track([[0, { ...Z, tailUp: 0 }], [0.28, SIT], [0.78, { ...SIT, headTilt: -0.12 }], [1, { ...Z, tailUp: 0 }]], t) },
  down: { d: 2.6, pose: (t) => track([[0, { ...Z, earL: 0, earR: 0 }], [0.3, DOWN], [0.78, DOWN], [1, { ...Z, earL: 0, earR: 0 }]], t) },
  paw: { d: 1.9, pose: (t) => track([
    [0, { fr: 0, headTilt: 0, pitch: 0 }], [0.3, { fr: -1.35, headTilt: 0.2, pitch: 0.06 }], [0.45, { fr: -1.1 }], [0.6, { fr: -1.35 }],
    [0.72, { fr: -1.2, headTilt: 0.2, pitch: 0.06 }], [1, { fr: 0, headTilt: 0, pitch: 0 }]], t) },
};
// running legs for fetch
const runLegs = (t, k = 1) => { const a = Math.sin(t * Math.PI * 2 * 7) * 0.7 * k; return { fl: a, br: a, fr: -a, bl: -a }; };
// fetch: the ball rolls away to the back left, she turns, runs, picks it up, runs back and drops it in front of her
const FETCH_TURN = -2.16, FETCH_TO = [0.36, -0.88], FETCH_BALL = new THREE.Vector3(0.65, 0.09, -1.57);
TRICKS.fetch = {
  d: 4.8, ball: true,
  pose: (t) => {
    const p = track([[0, { x: 0, z: 0, turn: 0 }], [0.1, { x: 0, z: 0, turn: FETCH_TURN }], [0.4, { x: FETCH_TO[0], z: FETCH_TO[1], turn: FETCH_TURN }],
      [0.52, { x: FETCH_TO[0], z: FETCH_TO[1], turn: FETCH_TURN + Math.PI }], [0.86, { x: 0, z: 0, turn: FETCH_TURN + Math.PI }], [1, { x: 0, z: 0, turn: 0 }]], t);
    const moving = (t > 0.1 && t < 0.4) || (t > 0.52 && t < 0.86);
    Object.assign(p, moving ? runLegs(t) : {}, { y: moving ? Math.abs(Math.sin(t * Math.PI * 14)) * 0.04 : 0, tail: Math.sin(t * Math.PI * 12) * 0.5 });
    if (t > 0.4 && t < 0.5) p.headNod = Math.sin(((t - 0.4) / 0.1) * Math.PI) * 0.6; // pick it up
    return p;
  },
  ballAt: (t, mouth) => {
    const start = new THREE.Vector3(-0.95, 0.09, 0.25);
    if (t < 0.32) return start.clone().lerp(FETCH_BALL, ease(t / 0.32));
    if (t < 0.43) return FETCH_BALL.clone();
    if (t < 0.47) return FETCH_BALL.clone().lerp(mouth, (t - 0.43) / 0.04);
    if (t < 0.9) return mouth;
    return mouth.clone().lerp(start, (t - 0.9) / 0.1);
  },
};
TRICKS.catch = {
  d: 2.4, ball: true,
  pose: (t) => track([
    [0, { y: 0, squash: 0, fl: 0, fr: 0, bl: 0, br: 0, headNod: 0 }], [0.3, { y: 0, squash: 0.12, fl: 0.2, fr: 0.2, bl: -0.2, br: -0.2, headNod: -0.3 }],
    [0.5, { y: 0.36, squash: -0.05, fl: -0.9, fr: -0.9, bl: 0.9, br: 0.9, headNod: -0.2 }], [0.7, { y: 0, squash: 0.1, fl: 0, fr: 0, bl: 0, br: 0, headNod: 0 }],
    [1, { y: 0, squash: 0, fl: 0, fr: 0, bl: 0, br: 0, headNod: 0 }]], t),
  ballAt: (t, mouth) => {
    if (t < 0.5) { const k = t / 0.5; return new THREE.Vector3(lerp(-2.2, mouth.x, k), lerp(1.2, mouth.y, k) + Math.sin(k * Math.PI) * 0.6, lerp(0.6, mouth.z, k)); }
    if (t < 0.86) return mouth;
    const k = (t - 0.86) / 0.14; return new THREE.Vector3(lerp(mouth.x, -0.95, k), lerp(mouth.y, 0.09, k), lerp(mouth.z, 0.25, k));
  },
};
TRICKS.balance = {
  d: 3.8, ball: true,
  pose: (t) => {
    const p = track([[0, { headNod: 0, earL: 0, earR: 0 }], [0.22, { headNod: -0.15, earL: 0.2, earR: 0.2 }], [0.8, { headNod: -0.15, earL: 0.2, earR: 0.2 }], [0.88, { headNod: 0.2 }], [1, { headNod: 0, earL: 0, earR: 0 }]], t);
    if (t > 0.25 && t < 0.8) p.headTilt = Math.sin((t - 0.25) * Math.PI * 7) * 0.12;
    p.tail = Math.sin(t * Math.PI * 6) * 0.4;
    return p;
  },
  ballAt: (t, mouth, top) => {
    const ground = new THREE.Vector3(-0.95, 0.09, 0.25);
    if (t < 0.22) { const k = t / 0.22; return new THREE.Vector3(lerp(ground.x, top.x, k), lerp(ground.y, top.y, k) + Math.sin(k * Math.PI) * 0.5, lerp(ground.z, top.z, k)); }
    if (t < 0.84) return top;
    const k = (t - 0.84) / 0.16; return new THREE.Vector3(lerp(top.x, ground.x, k), lerp(top.y, ground.y, k) + Math.sin(k * Math.PI) * 0.4, lerp(top.z, ground.z, k));
  },
};
const MOODS = {
  happy: { tailSpeed: 2.2, tailAmp: 0.45, earDroop: 0, headNod: 0, brow: 0 },
  ok: { tailSpeed: 1.2, tailAmp: 0.25, earDroop: 0, headNod: 0, brow: 0 },
  hungry: { tailSpeed: 0.6, tailAmp: 0.12, earDroop: 0.35, headNod: 0.12, brow: 1 },
  sad: { tailSpeed: 0.3, tailAmp: 0.06, earDroop: 0.6, headNod: 0.25, brow: 1 },
};

// ------------------------------------------------------------------ scene
function skyTexture() {
  const c = document.createElement('canvas'); c.width = 2; c.height = 256;
  const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, C.sky1); g.addColorStop(1, C.sky2); x.fillStyle = g; x.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function blobShadow() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,.28)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; return m;
}

export function webglOk() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export function mountFox3d(container, { background = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !background });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:manipulation';

  const scene = new THREE.Scene();
  if (background) scene.background = skyTexture();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(-3.0, 1.4, 2.7);
  camera.lookAt(-0.2, 0.5, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8fbf6f, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.9); sun.position.set(-2, 4, 3); scene.add(sun);

  if (background) {
    const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 64), toon(C.grass)); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    const bowl = new THREE.Group(); bowl.position.set(0.45, 0, 1.0); scene.add(bowl);
    part(new THREE.CylinderGeometry(0.2, 0.15, 0.1, 40), C.bowl, bowl, { pos: [0, 0.05, 0] });
    part(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 40), C.food, bowl, { pos: [0, 0.095, 0], outline: false });
  }
  const shadow = blobShadow(); shadow.scale.set(1.5, 0.8, 1); shadow.position.y = 0.005; scene.add(shadow);

  const fox = buildFox();
  scene.add(fox.root);
  const ball = new THREE.Group(); scene.add(ball);
  part(sphere(0.09), 0xe8483a, ball, {});
  part(new THREE.TorusGeometry(0.09, 0.012, 8, 32), 0xffffff, ball, { rot: [Math.PI / 2.4, 0, 0], outline: false });
  ball.visible = false;

  // ---------------- clothes
  const worn = {};
  let groundToy = null;
  function dress(wearing = {}) {
    for (const k of Object.keys(worn)) { worn[k].parent.remove(worn[k]); delete worn[k]; }
    if (groundToy) { scene.remove(groundToy); groundToy = null; }
    for (const [slot, id] of Object.entries(wearing)) {
      if (id === 'ball') { groundToy = ball.clone(); groundToy.visible = true; groundToy.position.set(-0.95, 0.09, 0.25); scene.add(groundToy); continue; }
      if (ITEMS[id]) worn[slot] = ITEMS[id](fox.anchor, fox);
    }
    fox.mouthOpen = wearing.mouth === 'bone';
  }

  // ---------------- size
  function resize() {
    const w = container.clientWidth || 300, h = container.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(container); resize();

  // ---------------- animation loop
  let mood = MOODS.ok, current = null, nextBlink = 2, blinkT = -1, alive = true;
  const clock = new THREE.Clock();
  let time = 0;
  const v = new THREE.Vector3(), mouthW = new THREE.Vector3(), topW = new THREE.Vector3();
  function apply(p) {
    const r = fox.root;
    r.position.set(p.x, p.y, p.z);
    r.rotation.y = BASE_TURN + p.turn;
    r.scale.set(1 + p.squash * 0.5, 1 - p.squash, 1 + p.squash * 0.5);
    fox.hip.position.y = 0.56 + p.bodyY;
    fox.hip.rotation.z = -p.pitch;
    fox.neck.rotation.z = p.headNod + p.pitch * 0.85; // keep the head level when she sits
    fox.neck.rotation.x = p.headTilt;
    fox.head.rotation.y = p.headTurn;
    const legs = [[fox.legFL, p.fl, p.flS], [fox.legFR, p.fr, p.frS], [fox.legBL, p.bl, p.blS], [fox.legBR, p.br, p.brS]];
    for (const [g, a, s] of legs) { g.rotation.z = a + (g === fox.legFL || g === fox.legFR ? p.pitch : 0) * 0; g.scale.y = s; }
    fox.tail.rotation.y = p.tail;
    fox.tail.rotation.z = p.tailUp;
    fox.ears[0].rotation.z = p.earL * 0.6; fox.ears[1].rotation.z = p.earR * 0.6;
    fox.ears[0].rotation.x = 0.32 + p.earL * 0.8; fox.ears[1].rotation.x = -0.32 - p.earR * 0.8;
    for (const e of fox.eyes) e.scale.y = Math.max(0.08, 1 - p.blink);
    fox.brows[0].rotation.x = p.brow * 0.35; fox.brows[1].rotation.x = -p.brow * 0.35;
    shadow.position.x = p.x - 0.35; shadow.position.z = p.z;
    const s = 1 / (1 + p.y * 1.2); shadow.scale.set(1.5 * s, 0.8 * s, 1);
  }
  function frame() {
    if (!alive) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;
    const p = { ...REST };
    // idle: breathing, tail, ears, blinking, mood
    p.squash = Math.sin(time * 2.2) * 0.012;
    p.tail = Math.sin(time * Math.PI * mood.tailSpeed) * mood.tailAmp;
    p.tailUp = 0.05 - mood.earDroop * 0.4;
    p.earL = mood.earDroop + Math.max(0, Math.sin(time * 0.7) - 0.97) * 4;
    p.earR = mood.earDroop;
    p.headNod = mood.headNod;
    p.headTurn = Math.sin(time * 0.4) * 0.12;
    p.brow = mood.brow;
    nextBlink -= dt;
    if (nextBlink < 0) { blinkT = 0; nextBlink = 2.5 + Math.random() * 3; }
    if (blinkT >= 0) { blinkT += dt; p.blink = Math.sin(Math.min(1, blinkT / 0.16) * Math.PI); if (blinkT > 0.16) blinkT = -1; }
    if (current) {
      const t = current.fixedT ?? Math.min(1, (performance.now() - current.start) / (current.def.d * 1000));
      Object.assign(p, current.def.pose(t));
      apply(p);
      if (current.def.ball) {
        fox.root.updateMatrixWorld(true);
        fox.anchor.mouth.getWorldPosition(mouthW);
        fox.anchor.top.getWorldPosition(topW); topW.y += 0.15;
        ball.position.copy(current.def.ballAt(t, mouthW.clone(), topW.clone()));
        ball.rotation.z -= dt * 6;
      }
      if (t >= 1 && current.fixedT == null) { const done = current.done; current = null; ball.visible = false; if (groundToy) groundToy.visible = true; done(); }
    } else apply(p);
    // leash: from the collar to the top left, out of the picture
    for (const w of Object.values(worn)) if (w.userData.leash) {
      fox.root.updateMatrixWorld(true);
      fox.anchor.neck.getWorldPosition(v);
      const pts = [v.clone().add(new THREE.Vector3(-0.05, -0.2, 0.1)), new THREE.Vector3(-1.4, 1.0, -0.5), new THREE.Vector3(-2.6, 2.6, -1.8)].map((q) => fox.root.worldToLocal(q.clone()));
      w.userData.tube.geometry.dispose();
      w.userData.tube.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.014, 6);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function trick(name) {
    if (current || !TRICKS[name]) return Promise.resolve();
    return new Promise((done) => {
      current = { def: TRICKS[name], start: performance.now(), done };
      if (TRICKS[name].ball) { ball.visible = true; if (groundToy) groundToy.visible = false; }
    });
  }
  function setMood(m) { mood = MOODS[m] || MOODS.ok; }
  function dispose() { alive = false; ro.disconnect(); renderer.dispose(); }
  /** for tests: freeze a trick at time t (0..1); hold(null) ends it. */
  function hold(name, t) {
    if (!name) { current = null; ball.visible = false; return; }
    current = { def: TRICKS[name], fixedT: t, done() {} };
    ball.visible = !!TRICKS[name].ball;
  }
  return { trick, setMood, dress, hold, tricks: Object.keys(TRICKS), el: renderer.domElement, dispose };
}
