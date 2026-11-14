import type { Scenario, ScenarioId, SystemId } from './demoHealth';

export interface DemoAlert {
  systemId: SystemId;
  severity: 'watch' | 'alert';
  title: string;
  explanation: string;
  scenarioId: ScenarioId;
  scenarioLabel: string;
}

const EVENTS: Record<SystemId, { title: string; explanation: string }> = {
  heart: {
    title: 'Fictional cardiovascular event',
    explanation: 'This scenario simulates a heart-rate observation. Its alert level is prewritten, not calculated from the displayed bpm or a NASA medical threshold.',
  },
  lungs: {
    title: 'Fictional breathing event',
    explanation: 'This scenario simulates a breathing observation. The marker does not establish hypoxia; breathing rate alone does not measure oxygen levels.',
  },
  brain: {
    title: 'Fictional sleep and fatigue event',
    explanation: 'This scenario simulates a sleep-related review. Sleep hours are not a brain measurement, and this event is not a diagnosis or a medical sleep cutoff.',
  },
  skeletal: {
    title: 'Fictional bone-health review',
    explanation: 'This review event is scripted. No bone-density measurement is available, and no bone loss is inferred from exercise minutes.',
  },
  immune: {
    title: 'Fictional immune-system review',
    explanation: 'This review event is scripted, not inferred from sample collection status. No actual immune test result is available or assessed.',
  },
};

/** Only explicit fictional scenario events can produce a demo alert.
 * User measurements intentionally are not an input to this function.
 */
export function getDemoAlerts(scenario: Scenario, checkInMode: boolean): DemoAlert[] {
  if (checkInMode) return [];
  return Object.entries(scenario.flags).flatMap(([id, flag]) => {
    if (flag !== 'watch' && flag !== 'alert') return [];
    const systemId = id as SystemId;
    return [{
      systemId,
      severity: flag,
      ...EVENTS[systemId],
      scenarioId: scenario.id,
      scenarioLabel: scenario.label,
    }];
  });
}
