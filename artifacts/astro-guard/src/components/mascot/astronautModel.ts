import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/** Joint hierarchy of the procedural mascot. Every group pivots at its anatomical joint. */
export interface AstronautRig {
  root: THREE.Group;      // centre of mass, drives float / flips
  pelvis: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  lShoulder: THREE.Group; lElbow: THREE.Group;
  rShoulder: THREE.Group; rElbow: THREE.Group;
  lHip: THREE.Group; lKnee: THREE.Group;
  rHip: THREE.Group; rKnee: THREE.Group;
  visorGlint: THREE.Mesh;
}

export function createMaterials() {
  return {
    suit: new THREE.MeshPhysicalMaterial({ color: 0xd9dde3, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color(0x9fb4cf) }),
    suitShade: new THREE.MeshPhysicalMaterial({ color: 0xaab2bd, roughness: 0.6, clearcoat: 0.2 }),
    helmet: new THREE.MeshPhysicalMaterial({ color: 0xe6e9ee, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 }),
    visor: new THREE.MeshPhysicalMaterial({ color: 0x05070d, roughness: 0.04, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.02, reflectivity: 1 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd99a4e, roughness: 0.3, metalness: 0.9 }),
    red: new THREE.MeshPhysicalMaterial({ color: 0xc8352f, roughness: 0.42, clearcoat: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x2a3140, roughness: 0.5, metalness: 0.3 }),
    btnRed: new THREE.MeshStandardMaterial({ color: 0xff4a3a, emissive: 0xc8261c, emissiveIntensity: 0.9, roughness: 0.3 }),
    btnAmber: new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0xe08a1a, emissiveIntensity: 0.9, roughness: 0.3 }),
    btnMint: new THREE.MeshStandardMaterial({ color: 0x9fe6d2, emissive: 0x4fbfa5, emissiveIntensity: 0.8, roughness: 0.3 }),
    btnBlue: new THREE.MeshStandardMaterial({ color: 0x5c8fe0, emissive: 0x2a5bb0, emissiveIntensity: 0.7, roughness: 0.3 }),
    glint: new THREE.MeshBasicMaterial({ color: 0x9fc4ff, transparent: true, opacity: 0.35, depthWrite: false }),
  };
}
export type AstroMaterials = ReturnType<typeof createMaterials>;

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, pos: [number, number, number] = [0, 0, 0], scale?: [number, number, number]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  parent.add(m);
  return m;
}
function joint(parent: THREE.Object3D, pos: [number, number, number]) {
  const g = new THREE.Group();
  g.position.set(...pos);
  parent.add(g);
  return g;
}
const ring = (r: number, t: number) => new THREE.TorusGeometry(r, t, 12, 40);

/** Puffy segmented limb: capsule with a pair of quilt rings. */
function limb(parent: THREE.Object3D, M: AstroMaterials, radius: number, length: number, trim: boolean) {
  mesh(new THREE.CapsuleGeometry(radius, length, 8, 18), M.suit, parent, [0, -length / 2 - radius * 0.2, 0]);
  for (let i = 1; i <= 2; i++) {
    const r = mesh(ring(radius * 1.0, radius * 0.16), i === 2 && trim ? M.red : M.suitShade, parent, [0, -length * (i / 3) - radius * 0.2, 0]);
    r.rotation.x = Math.PI / 2;
  }
}

export function buildAstronaut(M: AstroMaterials): AstronautRig {
  const root = new THREE.Group();
  root.rotation.order = 'YXZ';
  const pelvis = joint(root, [0, -0.15, 0]);

  // Hips + torso
  mesh(new THREE.SphereGeometry(0.42, 28, 20), M.suit, pelvis, [0, -0.02, 0], [1.05, 0.62, 0.86]);
  const belt = mesh(ring(0.41, 0.05), M.red, pelvis, [0, 0.08, 0], [1.03, 1, 0.84]); belt.rotation.x = Math.PI / 2;
  const torso = joint(pelvis, [0, 0.12, 0]);
  mesh(new RoundedBoxGeometry(0.86, 0.72, 0.6, 5, 0.26), M.suit, torso, [0, 0.36, 0]);
  const collar = mesh(ring(0.33, 0.07), M.suitShade, torso, [0, 0.74, 0]); collar.rotation.x = Math.PI / 2;
  // Chest control pack with glowing buttons
  mesh(new RoundedBoxGeometry(0.42, 0.32, 0.1, 3, 0.04), M.suitShade, torso, [0, 0.38, 0.3]);
  const btnGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 20);
  ([[-0.1, 0.46, M.btnBlue], [0.1, 0.46, M.btnMint], [-0.1, 0.3, M.btnRed], [0.1, 0.3, M.btnAmber]] as const).forEach(([x, y, mat]) => {
    const b = mesh(btnGeo, mat, torso, [x, y, 0.36]); b.rotation.x = Math.PI / 2;
  });
  // Shoulder trim stripes
  // Backpack (life support)
  mesh(new RoundedBoxGeometry(0.74, 0.8, 0.32, 4, 0.12), M.suitShade, torso, [0, 0.4, -0.42]);
  mesh(new RoundedBoxGeometry(0.5, 0.12, 0.06, 2, 0.03), M.red, torso, [0, 0.62, -0.6]);
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 14), M.dark, torso, [0.28, 0.4, -0.6]);

  // Oversized helmet
  const head = joint(torso, [0, 0.8, 0.02]);
  mesh(new THREE.SphereGeometry(0.66, 48, 36), M.helmet, head, [0, 0.52, 0]);
  const neck = mesh(ring(0.4, 0.08), M.suitShade, head, [0, 0.02, 0]); neck.rotation.x = Math.PI / 2;
  // Visor: flattened glossy dome on the face side
  mesh(new THREE.SphereGeometry(0.56, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), M.visor, head, [0, 0.54, 0.5], [1.0, 0.82, 0.78]).rotation.x = Math.PI / 2;
  const rim = mesh(ring(0.56, 0.035), M.gold, head, [0, 0.54, 0.5], [1, 0.82, 1]);
  rim.rotation.y = 0;
  const visorGlint = mesh(new THREE.CircleGeometry(0.11, 24), M.glint, head, [-0.2, 0.74, 0.92], [1.6, 0.6, 1]);
  visorGlint.rotation.set(-0.3, -0.35, 0.5);
  visorGlint.castShadow = false;
  // Ear pods
  for (const s of [-1, 1]) {
    const pod = mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.12, 28), M.suitShade, head, [s * 0.66, 0.52, -0.02]);
    pod.rotation.z = Math.PI / 2;
    const podRing = mesh(ring(0.1, 0.025), M.helmet, head, [s * 0.73, 0.52, -0.02]); podRing.rotation.y = Math.PI / 2;
  }
  mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), M.dark, head, [0.34, 1.18, -0.18]).rotation.z = -0.3;
  mesh(new THREE.SphereGeometry(0.035, 12, 10), M.btnRed, head, [0.39, 1.32, -0.18]);

  // Arms
  const arm = (side: 1 | -1) => {
    const sh = joint(torso, [side * 0.5, 0.6, 0]);
    mesh(new THREE.SphereGeometry(0.2, 20, 16), M.suit, sh);
    const stripe = mesh(ring(0.19, 0.04), M.red, sh, [side * 0.05, -0.05, 0]); stripe.rotation.z = Math.PI / 2;
    limb(sh, M, 0.15, 0.28, false);
    const el = joint(sh, [0, -0.44, 0]);
    mesh(new THREE.SphereGeometry(0.15, 16, 12), M.suitShade, el);
    limb(el, M, 0.14, 0.24, true);
    // Mitten glove
    const hand = joint(el, [0, -0.42, 0]);
    mesh(new THREE.SphereGeometry(0.15, 20, 16), M.helmet, hand, [0, -0.06, 0], [1, 1.15, 0.85]);
    mesh(new THREE.CapsuleGeometry(0.05, 0.08, 4, 10), M.helmet, hand, [-side * -0.12, -0.02, 0.05]).rotation.z = side * 0.7;
    const cuff = mesh(ring(0.14, 0.04), M.red, hand, [0, 0.06, 0]); cuff.rotation.x = Math.PI / 2;
    return [sh, el] as const;
  };
  const [lShoulder, lElbow] = arm(1);
  const [rShoulder, rElbow] = arm(-1);

  // Legs
  const leg = (side: 1 | -1) => {
    const hip = joint(pelvis, [side * 0.22, -0.12, 0]);
    limb(hip, M, 0.19, 0.3, false);
    const kn = joint(hip, [0, -0.5, 0]);
    mesh(new THREE.SphereGeometry(0.19, 16, 12), M.suitShade, kn);
    limb(kn, M, 0.18, 0.26, true);
    const boot = joint(kn, [0, -0.5, 0]);
    mesh(new RoundedBoxGeometry(0.34, 0.2, 0.5, 4, 0.09), M.helmet, boot, [0, -0.04, 0.08]);
    mesh(new RoundedBoxGeometry(0.36, 0.06, 0.52, 2, 0.03), M.red, boot, [0, -0.13, 0.08]);
    return [hip, kn] as const;
  };
  const [lHip, lKnee] = leg(1);
  const [rHip, rKnee] = leg(-1);

  return { root, pelvis, torso, head, lShoulder, lElbow, rShoulder, rElbow, lHip, lKnee, rHip, rKnee, visorGlint };
}

export function disposeObject(obj: THREE.Object3D) {
  const geos = new Set<THREE.BufferGeometry>();
  const mats = new Set<THREE.Material>();
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      geos.add(m.geometry);
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => mats.add(x));
    }
  });
  geos.forEach((g) => g.dispose());
  mats.forEach((m) => m.dispose());
}
