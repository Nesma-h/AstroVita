export type SystemId = 'heart' | 'lungs' | 'brain' | 'skeletal' | 'immune';
export type ScenarioId = 'nominal' | 'workload' | 'recovery' | 'alert-drill';

export interface SystemInfo {
  id: SystemId;
  label: string;
  short: string;
  sourceUrl: string;
  sourceTitle: string;
  context: string;
  measurementLimit: string;
  visualAnimation: string;
}

export const SYSTEM_ORDER: SystemId[] = ['heart', 'lungs', 'brain', 'skeletal', 'immune'];

export const SYSTEMS: Record<SystemId, SystemInfo> = {
  heart: {
    id: 'heart',
    label: 'Heart',
    short: 'Circulation',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/',
    sourceTitle: 'NASA HRP: Risk of Cardiovascular Adaptations',
    context: 'NASA lists cardiovascular adaptations as a spaceflight risk: weightlessness changes how blood moves through the body and how the heart works.',
    measurementLimit: 'Heart rate and blood pressure are individual readings; neither tells you how the heart has adapted to space.',
    visualAnimation: 'The real heart mesh beats at the demo bpm shown here. Faster scenario, faster beat.',
  },
  lungs: {
    id: 'lungs',
    label: 'Lungs',
    short: 'Breathing',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-hypoxia/',
    sourceTitle: 'NASA HRP: Risk of Hypoxia',
    context: 'NASA lists hypoxia, not getting enough oxygen, as a risk to manage in spacecraft and suit environments.',
    measurementLimit: 'Breathing rate alone does not measure oxygen levels in the blood or cabin.',
    visualAnimation: 'Both lung meshes expand and relax at the demo breaths per minute.',
  },
  brain: {
    id: 'brain',
    label: 'Brain',
    short: 'Sleep',
    sourceUrl: 'https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/',
    sourceTitle: 'NASA HRP: Risk from Inadequate Sleep and Irregular Schedules',
    context: 'NASA lists inadequate sleep and irregular schedules as a risk. Crews work in shifts, with light and noise that differ from Earth.',
    measurementLimit: 'Sleep hours and mood are self-reported. Neither scans the brain or measures sleep quality.',
    visualAnimation: 'A slow glow drifts across the brain mesh. It is a highlight, not brain activity.',
  },
  skeletal: {
    id: 'skeletal',
    label: 'Skeleton',
    short: 'Bone & load',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/',
    sourceTitle: 'NASA HRP: Risk of Spaceflight-Induced Bone Changes',
    context: 'NASA lists bone changes as a risk: without gravity loading the skeleton, bones can lose density over a mission.',
    measurementLimit: 'Exercise minutes do not measure bone density. This app does not infer bone changes from activity.',
    visualAnimation: 'A light band travels along the skeleton to show where load matters. It is not a bone scan.',
  },
  immune: {
    id: 'immune',
    label: 'Immune system',
    short: 'Whole body',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/',
    sourceTitle: 'NASA HRP: Risk of Altered Immune System Responses',
    context: 'NASA lists altered immune responses as a risk. The immune system is spread through the whole body, so it is shown as a body-wide field, not one organ.',
    measurementLimit: 'Immune status requires an appropriate lab sample; this check-in does not include an immune test result.',
    visualAnimation: 'Soft points pulse across the whole body to stand for a system-wide network. No organ is singled out.',
  },
};

export type Flag = 'steady' | 'watch' | 'alert';

export interface Scenario {
  id: ScenarioId;
  label: string;
  blurb: string;
  bpm: number;
  breaths: number;
  sleepHours: number;
  exerciseMin: number;
  immuneSample: string;
  flags: Partial<Record<SystemId, Flag>>;
}

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  nominal: {
    id: 'nominal', label: 'Nominal', blurb: 'A quiet day on orbit.',
    bpm: 64, breaths: 13, sleepHours: 7.2, exerciseMin: 128, immuneSample: 'Sample logged, awaiting lab',
    flags: {},
  },
  workload: {
    id: 'workload', label: 'Elevated workload', blurb: 'A long task block with short sleep.',
    bpm: 104, breaths: 21, sleepHours: 5.3, exerciseMin: 41, immuneSample: 'Sample not yet collected',
    flags: { heart: 'watch', lungs: 'watch', brain: 'watch', skeletal: 'watch' },
  },
  recovery: {
    id: 'recovery', label: 'Recovery', blurb: 'Rest after the busy shift.',
    bpm: 71, breaths: 15, sleepHours: 8.1, exerciseMin: 86, immuneSample: 'Sample logged, awaiting lab',
    flags: { brain: 'steady' },
  },
  'alert-drill': {
    id: 'alert-drill', label: 'Alert drill',
    blurb: 'A fictional all-system alert drill. Events are scripted, not triggered by clinical thresholds.',
    bpm: 118, breaths: 24, sleepHours: 4.2, exerciseMin: 20,
    immuneSample: 'Fictional sample review requested',
    flags: { heart: 'alert', lungs: 'alert', brain: 'alert', skeletal: 'alert', immune: 'alert' },
  },
};
export const SCENARIO_ORDER: ScenarioId[] = ['nominal', 'workload', 'recovery', 'alert-drill'];

export interface Readings { bpm: number; breaths: number; sleepHours: number; exerciseMin: number; immuneSample: string; }

/** Small deterministic drift so values visibly tick while the demo runs. */
export function demoReadings(s: Scenario, tick: number): Readings {
  return {
    bpm: Math.round(s.bpm + Math.sin(tick * 0.9) * 2 + Math.sin(tick * 0.37) * 1.4),
    breaths: Math.round(s.breaths + Math.sin(tick * 0.53) * 0.9),
    sleepHours: s.sleepHours,
    exerciseMin: s.exerciseMin,
    immuneSample: s.immuneSample,
  };
}

export const DEMO_DISCLAIMER = 'Local demo. Synthetic values, not NASA readings, not connected sensors, not a diagnosis or clinical risk assessment.';

export const NASA_INDEX = [
  { title: 'NASA Human Research Program: Risks', url: 'https://www.nasa.gov/hrp/risks/' },
  { title: 'NASA Human Research Program: Hazards', url: 'https://www.nasa.gov/hrp/hazards/' },
];

export const MODEL_CREDITS = [
  {
    title: 'Body shell, heart, brain, lungs',
    detail: 'BodyParts3D, (c) The Database Center for Life Science, CC Attribution-Share Alike 2.1 Japan. Derivative GLB meshes via shear-stress-3d-viz.',
    url: 'https://github.com/Harsh9005/shear-stress-3d-viz',
  },
  {
    title: 'Skeleton',
    detail: 'Ecorche (Charleeh/ecorche), CC BY-SA 4.0. Based on BodyParts3D (DBCLS) and Z-Anatomy by Gauthier Kervyn, CC BY-SA 4.0.',
    url: 'https://github.com/Charleeh/ecorche',
  },
  {
    title: 'Earth photograph',
    detail: 'NASA Johnson Space Center, Apollo 17, AS17-148-22727 "The Blue Marble".',
    url: 'https://science.nasa.gov/resource/the-blue-marble/',
  },
];
