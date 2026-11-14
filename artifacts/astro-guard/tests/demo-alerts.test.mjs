import assert from 'node:assert/strict';
import test from 'node:test';
import { getDemoAlerts } from '../src/data/demoAlerts.ts';
import { SCENARIOS, SCENARIO_ORDER, SYSTEM_ORDER, demoReadings } from '../src/data/demoHealth.ts';

test('all five systems have an explicitly fictional alert in Alert drill', () => {
  const alerts = getDemoAlerts(SCENARIOS['alert-drill'], false);
  assert.deepEqual(alerts.map(a => a.systemId), SYSTEM_ORDER);
  for (const alert of alerts) {
    assert.equal(alert.severity, 'alert');
    assert.equal(alert.scenarioId, 'alert-drill');
    assert.match(alert.title, /Fictional/);
    assert.ok(alert.explanation.length > 40);
  }
});

test('check-in mode suppresses every alert in every scenario', () => {
  for (const scenario of Object.values(SCENARIOS)) {
    assert.deepEqual(getDemoAlerts(scenario, true), []);
  }
});

test('Nominal and Recovery do not claim clinical safety or emit alerts', () => {
  assert.deepEqual(getDemoAlerts(SCENARIOS.nominal, false), []);
  assert.deepEqual(getDemoAlerts(SCENARIOS.recovery, false), []);
});

test('Elevated workload retains four watch events, not medical emergencies', () => {
  const alerts = getDemoAlerts(SCENARIOS.workload, false);
  assert.equal(alerts.length, 4);
  assert.ok(alerts.every(a => a.severity === 'watch'));
  assert.ok(!alerts.some(a => a.systemId === 'immune'));
});

test('numeric changes alone cannot create, escalate, or clear a scripted alert', () => {
  for (const scenario of Object.values(SCENARIOS)) {
    const extreme = { ...scenario, bpm: 999, breaths: 0, sleepHours: 0, exerciseMin: 0 };
    assert.deepEqual(getDemoAlerts(extreme, false), getDemoAlerts(scenario, false));
    for (const tick of [0, 1, 50, 500]) {
      demoReadings(scenario, tick);
      assert.deepEqual(getDemoAlerts(scenario, false), getDemoAlerts(extreme, false));
    }
  }
});

test('all scenarios are selectable and do not mutate their scripted events', () => {
  assert.deepEqual(new Set(SCENARIO_ORDER), new Set(Object.keys(SCENARIOS)));
  const before = JSON.stringify(SCENARIOS);
  for (const scenario of Object.values(SCENARIOS)) getDemoAlerts(scenario, false);
  assert.equal(JSON.stringify(SCENARIOS), before);
});
