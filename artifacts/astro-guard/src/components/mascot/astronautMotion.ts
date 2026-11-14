import type { AstronautRig } from './astronautModel';

export type MotionMode = 'wave' | 'dance' | 'flip' | 'pushups';
export const MOTION_MODES: { id: MotionMode; label: string; hint: string }[] = [
  { id: 'wave', label: 'Float & wave', hint: 'Drifts in zero-g and waves hello' },
  { id: 'dance', label: 'Dance', hint: 'Hip sway, knee bounce, arm pumps' },
  { id: 'flip', label: 'Somersault', hint: 'Tucks and rolls a full forward flip' },
  { id: 'pushups', label: 'Push-ups', hint: 'Plank, lower, press — countermeasure training' },
];

export function nextMotionMode(current: MotionMode): MotionMode {
  const index = MOTION_MODES.findIndex(m => m.id === current);
  return MOTION_MODES[(index + 1) % MOTION_MODES.length].id;
}

const KEYS = ['y', 'z', 'rx', 'ry', 'rz', 'torsoX', 'torsoZ', 'headX', 'headY', 'headZ',
  'lShX', 'lShZ', 'lElX', 'rShX', 'rShZ', 'rElX', 'lHipX', 'lHipZ', 'lKnX', 'rHipX', 'rHipZ', 'rKnX'] as const;
type Key = (typeof KEYS)[number];
export type Pose = Record<Key, number>;

const NEUTRAL: Pose = {
  y: 0, z: 0, rx: 0, ry: 0, rz: 0, torsoX: 0, torsoZ: 0, headX: 0, headY: 0, headZ: 0,
  lShX: 0, lShZ: 0.22, lElX: -0.25, rShX: 0, rShZ: -0.22, rElX: -0.25,
  lHipX: 0, lHipZ: 0.05, lKnX: 0.05, rHipX: 0, rHipZ: -0.05, rKnX: 0.05,
};
const S = Math.sin, C = Math.cos, TAU = Math.PI * 2;
const ease = (x: number) => x * x * (3 - 2 * x);

function wave(t: number): Pose {
  const w = S(t * 7);
  return { ...NEUTRAL,
    y: S(t * 1.1) * 0.12, rz: S(t * 0.7) * 0.06, ry: S(t * 0.45) * 0.25, rx: S(t * 0.9) * 0.04,
    headZ: -0.1 + w * 0.05, headX: -0.05,
    rShZ: -2.45 + w * 0.08, rShX: -0.15, rElX: -0.55 + w * 0.45,
    lShZ: 0.35 + S(t * 1.3) * 0.08, lShX: S(t * 1.1) * 0.15, lElX: -0.45,
    lHipX: -0.2 + S(t * 1.2) * 0.12, rHipX: 0.1 - S(t * 1.2) * 0.12, lKnX: 0.35 + S(t * 1.2) * 0.1, rKnX: 0.25,
  };
}
function dance(t: number): Pose {
  const b = t * 2 * Math.PI * 1.15; // ~138 bpm
  const bounce = Math.abs(S(b));
  const side = S(b / 2);
  return { ...NEUTRAL,
    y: -0.08 + bounce * 0.12, ry: side * 0.35, rz: side * 0.07,
    torsoZ: -side * 0.14, torsoX: 0.05, headZ: side * 0.18, headX: -bounce * 0.08,
    lShZ: 0.5 + Math.max(0, side) * 1.9, lShX: -0.3, lElX: -1.2 - Math.max(0, side) * 0.3,
    rShZ: -0.5 - Math.max(0, -side) * 1.9, rShX: -0.3, rElX: -1.2 - Math.max(0, -side) * 0.3,
    lHipX: -0.25 * (1 - bounce) - Math.max(0, side) * 0.4, lKnX: 0.5 * (1 - bounce) + Math.max(0, side) * 0.7, lHipZ: 0.12,
    rHipX: -0.25 * (1 - bounce) - Math.max(0, -side) * 0.4, rKnX: 0.5 * (1 - bounce) + Math.max(0, -side) * 0.7, rHipZ: -0.12,
  };
}
function flip(t: number): Pose {
  const cycle = 2.6;
  const p = (t % cycle) / cycle;
  // 0-.18 crouch, .18-.78 tucked rotation, .78-1 open and settle
  const tuck = p < 0.18 ? ease(p / 0.18) * 0.5 : p < 0.3 ? 0.5 + ease((p - 0.18) / 0.12) * 0.5 : p < 0.7 ? 1 : p < 0.85 ? 1 - ease((p - 0.7) / 0.15) : 0;
  const spin = p < 0.18 ? 0 : p < 0.82 ? ease((p - 0.18) / 0.64) : 1;
  const lift = p < 0.18 ? -0.12 * ease(p / 0.18) : S(Math.min(1, (p - 0.18) / 0.72) * Math.PI) * 0.55;
  const armsUp = p > 0.8 ? ease(Math.min(1, (p - 0.8) / 0.12)) * (1 - ease(Math.max(0, (p - 0.92) / 0.08))) : 0;
  return { ...NEUTRAL,
    y: lift, rx: spin * TAU,
    torsoX: tuck * 0.45, headX: tuck * 0.35,
    lShX: -1.3 * tuck - armsUp * 0.2, lShZ: 0.22 + armsUp * 2.2, lElX: -1.6 * tuck - 0.25,
    rShX: -1.3 * tuck - armsUp * 0.2, rShZ: -0.22 - armsUp * 2.2, rElX: -1.6 * tuck - 0.25,
    lHipX: -1.8 * tuck, rHipX: -1.8 * tuck, lKnX: 2.2 * tuck + 0.05, rKnX: 2.2 * tuck + 0.05,
  };
}
function pushups(t: number): Pose {
  const d = ease(0.5 - 0.5 * C(t * TAU / 1.8)); // 0 = arms locked, 1 = chest low
  return { ...NEUTRAL,
    rx: Math.PI / 2 - 0.12 + d * 0.06, ry: Math.PI / 2 - 0.45, y: -0.25 - d * 0.32, z: 0,
    headX: -0.45, torsoX: 0,
    lShX: -1.45 + d * 0.95, lShZ: 0.18 + d * 0.45, lElX: -d * 1.7,
    rShX: -1.45 + d * 0.95, rShZ: -0.18 - d * 0.45, rElX: -d * 1.7,
    lHipX: 0.02, rHipX: 0.02, lKnX: 0.03, rKnX: 0.03, lHipZ: 0.07, rHipZ: -0.07,
  };
}
const MODES: Record<MotionMode, (t: number) => Pose> = { wave, dance, flip, pushups };

const wrap = (a: number) => Math.atan2(S(a), C(a));

/** Cross-fading pose driver: each mode change blends from the current pose. */
export class MotionDriver {
  mode: MotionMode = 'wave';
  private t = 0;
  private blend = 1;
  private from: Pose = { ...NEUTRAL };
  current: Pose = { ...NEUTRAL };

  setMode(m: MotionMode) {
    if (m === this.mode) return;
    this.from = { ...this.current, rx: wrap(this.current.rx), ry: wrap(this.current.ry) };
    this.mode = m; this.t = 0; this.blend = 0;
  }
  step(dt: number) {
    this.t += dt;
    this.blend = Math.min(1, this.blend + dt / 0.75);
    const target = MODES[this.mode](this.t);
    const w = ease(this.blend);
    for (const k of KEYS) this.current[k] = this.from[k] + (target[k] - this.from[k]) * w;
  }
  apply(r: AstronautRig, time: number) {
    const p = this.current;
    r.root.position.set(0, p.y, p.z);
    r.root.rotation.set(p.rx, p.ry, p.rz);
    r.torso.rotation.set(p.torsoX, 0, p.torsoZ);
    r.head.rotation.set(p.headX, p.headY, p.headZ);
    r.lShoulder.rotation.set(p.lShX, 0, p.lShZ); r.lElbow.rotation.x = p.lElX;
    r.rShoulder.rotation.set(p.rShX, 0, p.rShZ); r.rElbow.rotation.x = p.rElX;
    r.lHip.rotation.set(p.lHipX, 0, p.lHipZ); r.lKnee.rotation.x = p.lKnX;
    r.rHip.rotation.set(p.rHipX, 0, p.rHipZ); r.rKnee.rotation.x = p.rKnX;
    (r.visorGlint.material as { opacity: number }).opacity = 0.28 + S(time * 0.8) * 0.08;
  }
}
