import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_MOTION, MotionDriver, MOTION_MODES, nextMotionMode } from '../src/components/mascot/astronautMotion.ts';

const advance = (driver, seconds) => {
  for (let i = 0; i < Math.round(seconds * 60); i++) driver.step(1 / 60);
  return { ...driver.current };
};

test('the landing starts dancing and its pose changes without a click', () => {
  assert.equal(DEFAULT_MOTION, 'dance');
  const driver = new MotionDriver();
  driver.setMode(DEFAULT_MOTION);
  const first = advance(driver, 1);
  const later = advance(driver, 0.3);
  assert.notDeepEqual(first, later);
  assert.equal(driver.mode, 'dance');
  assert.equal(nextMotionMode(DEFAULT_MOTION), 'flip');
});

test('each click advances exactly one move and wraps to the first', () => {
  let mode = 'wave';
  const observed = [];
  for (let clicks = 0; clicks < 8; clicks++) {
    mode = nextMotionMode(mode);
    observed.push(mode);
  }
  assert.deepEqual(observed, ['dance', 'flip', 'pushups', 'wave', 'dance', 'flip', 'pushups', 'wave']);
});

test('a move keeps repeating until another click changes it', () => {
  for (const { id } of MOTION_MODES) {
    const driver = new MotionDriver();
    driver.setMode(id);
    advance(driver, 30);
    assert.equal(driver.mode, id);
  }
});

test('every advertised movement produces finite poses and moving limbs', () => {
  assert.deepEqual(MOTION_MODES.map(m => m.id), ['wave', 'dance', 'flip', 'pushups']);
  for (const { id } of MOTION_MODES) {
    const driver = new MotionDriver();
    driver.setMode(id);
    advance(driver, 0.8);
    const samples = Array.from({ length: 30 }, () => advance(driver, 0.1));
    for (const pose of samples) {
      assert.ok(Object.values(pose).every(Number.isFinite), `${id} has invalid joint values`);
    }
    const joints = ['lShX', 'lShZ', 'rShZ', 'rElX', 'lHipX', 'lKnX'];
    assert.ok(joints.some(k => Math.max(...samples.map(p => p[k])) - Math.min(...samples.map(p => p[k])) > 0.01),
      `${id} must articulate limbs, not just move the whole image`);
  }
});

test('changing movement starts at the current visible pose', () => {
  const driver = new MotionDriver();
  advance(driver, 1.7);
  const before = { ...driver.current };
  driver.setMode('pushups');
  driver.step(0);
  assert.deepEqual(driver.current, before);
  advance(driver, 0.8);
  assert.ok(driver.current.rx > 1.3, 'Push-ups should settle into a horizontal plank');
});

test('somersault completes a full turn and tucks knees', () => {
  const driver = new MotionDriver();
  driver.setMode('flip');
  let rotation = 0, tuck = 0;
  for (let i = 0; i < 156; i++) {
    driver.step(1 / 60);
    rotation = Math.max(rotation, driver.current.rx);
    tuck = Math.max(tuck, driver.current.lKnX);
  }
  assert.ok(rotation > 6.2, 'Must rotate a full somersault');
  assert.ok(tuck > 2, 'Must fold the knees during the somersault');
});

test('repeated mode changes stay stable without a graphics context', () => {
  const driver = new MotionDriver();
  for (let i = 0; i < 100; i++) {
    driver.setMode(MOTION_MODES[i % MOTION_MODES.length].id);
    const pose = advance(driver, 0.3);
    assert.ok(Object.values(pose).every(Number.isFinite));
  }
});
