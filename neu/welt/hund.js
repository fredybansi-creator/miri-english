// Raluca as the real dog: a 3D model made in Blender from her photo (`raluca.glb`, built by `tools/make_raluca.py`).
//   makeDogActor(fallback) → { root, rest(), pose(p), ready }   – same shape as makeFoxActor() in ../fox3d.js
// The model has a skeleton; pose(p) takes the same numbers as the fox (leg swing, pitch, tail …) and turns the bones.
// She faces −x like the fox. Until the file has loaded nothing is shown; if loading fails, the code-built fox appears.

import * as THREE from '../vendor/three.module.min.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';

const REST = {
  x: 0, y: 0, z: 0, turn: 0, squash: 0, pitch: 0, bodyY: 0, headTurn: 0, headTilt: 0, headNod: 0,
  fl: 0, fr: 0, bl: 0, br: 0, flS: 1, frS: 1, blS: 1, brS: 1, tail: 0, tailUp: 0, earL: 0, earR: 0, blink: 0, brow: 0,
};
const SCALE = 1.12; // the model is in metres (about 0.62 to the shoulder); this makes her as big as the fox was

function toonRamp() {
  const t = new THREE.DataTexture(new Uint8Array([165, 215, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
}

export function makeDogActor(fallback) {
  const root = new THREE.Group();
  const inner = new THREE.Group(); inner.rotation.y = -Math.PI / 2; inner.scale.setScalar(SCALE); root.add(inner);
  let bones = null, fox = null;
  const q = new THREE.Quaternion(), e = new THREE.Euler();

  // turn a bone by angles given in the dog's own space (x = pitch, + swings a leg back / lowers the head;
  // y = turn left-right; z = roll), whatever direction the bone itself points in
  function turn(name, rx = 0, ry = 0, rz = 0) {
    const b = bones[name]; if (!b) return;
    q.setFromEuler(e.set(rx, ry, rz, 'XYZ'));
    b.bone.quaternion.copy(b.rest).multiply(b.inv).multiply(q).multiply(b.world);
  }

  const ready = new GLTFLoader().loadAsync(new URL('./raluca.glb', import.meta.url).href).then((gltf) => {
    const model = gltf.scene; model.updateMatrixWorld(true);
    const ramp = toonRamp();
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.frustumCulled = false; // the bones move her outside the box three.js would test
      const gloss = /Gloss/.test(o.material.name);
      o.material = gloss ? new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 90, specular: 0x555555 })
        : new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp });
    });
    bones = {};
    model.traverse((o) => {
      if (!o.isBone) return;
      const world = o.getWorldQuaternion(new THREE.Quaternion());
      bones[o.name] = { bone: o, rest: o.quaternion.clone(), world, inv: world.clone().invert(), pos: o.position.clone() };
    });
    const hips = bones.hips; // "up" for the hips, seen from their parent bone
    hips.up = new THREE.Vector3(0, 1, 0).applyQuaternion(hips.bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert());
    inner.add(model);
    return true;
  }).catch((err) => {
    console.warn('raluca.glb did not load, using the fox', err);
    if (fallback) { fox = fallback(); root.add(fox.root); }
    return false;
  });

  function leg(front, sfx, a, s) {
    const lift = Math.max(0, -a), fold = Math.max(0, 1 - s);
    if (front) {
      turn('frontUpper' + sfx, a - fold * 1.0);
      turn('frontLower' + sfx, lift * 0.55 + fold * 2.0);
      turn('frontPaw' + sfx, lift * 0.35 - fold * 0.6);
    } else { // a shorter back leg folds up under her (sit)
      turn('hindUpper' + sfx, a - fold * 0.93, 0, 0);
      turn('hindLower' + sfx, lift * 0.5 + fold * 3.04);
      turn('hindFoot' + sfx, -lift * 0.4 - fold * 2.37);
      turn('hindPaw' + sfx, lift * 0.3 + fold * 1.55);
    }
  }

  return {
    root, ready,
    rest: () => ({ ...REST }),
    pose(p) {
      if (fox) return fox.pose(p);
      if (!bones) return;
      root.scale.set(1 + p.squash * 0.5, 1 - p.squash, 1 + p.squash * 0.5);
      const h = bones.hips;
      h.bone.position.copy(h.pos).addScaledVector(h.up, (p.bodyY * 1.2) / SCALE);
      turn('hips', -p.pitch * 1.14);
      turn('neck', p.headNod + p.pitch * 0.7, 0, p.headTilt * 0.5);
      turn('head', p.pitch * 0.42, p.headTurn, p.headTilt * 0.5);
      leg(true, 'L', p.fl, p.flS); leg(true, 'R', p.fr, p.frS);
      leg(false, 'L', p.bl, p.blS); leg(false, 'R', p.br, p.brS);
      const up = p.tailUp - 0.25 - Math.max(0, p.pitch) * 0.8; // the model's tail is already carried high
      turn('tail1', up, p.tail * 0.6); turn('tail2', up * 0.3, p.tail * 0.7); turn('tail3', up * 0.2, p.tail * 0.8);
      turn('earL', -p.earL * 0.6, 0, -p.earL * 0.2); turn('earR', -p.earR * 0.6, 0, p.earR * 0.2);
    },
  };
}
