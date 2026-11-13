export const challengeSource = {
  title: 'Create Health Monitoring Software for Astronauts on Space Missions',
  url: 'https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/',
  resourcesUrl:
    'https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources',
  reviewedOn: 'November 13, 2026',
  resourceStatus:
    'The Resources tab links NASA HRP hazards, human-spaceflight risks, and ongoing research pages, plus Canadian Space Agency references. No challenge-specific telemetry dataset or astronaut sensor feed is exposed in the reviewed content.',
} as const;

export const challengeContext = {
  sourceUrl: 'https://www.nasa.gov/hrp/risks/',
  sourceLabel: 'NASA Human Research Program risk context',
  caveat:
    'These NASA pages provide qualitative research context, not per-astronaut telemetry, sensor readings, or individualized medical guidance.',
  conditions: [
    'Space radiation',
    'Isolation and confinement',
    'Distance from Earth',
    'Gravity fields',
    'Hostile or closed environments',
  ],
  possibleEffects: [
    'Cardiovascular adaptations',
    'Spaceflight-induced bone changes',
    'Altered immune responses',
    'Hypoxia',
    'Sleep and schedule disruption',
    'Behavioral health risks',
    'Spaceflight-associated neuro-ocular syndrome',
  ],
} as const;

export const datasetStatus = {
  state: 'not-available',
  count: null,
  records: null,
  columns: null,
  message:
    'The official Resources tab links NASA research pages, but no challenge-specific astronaut telemetry dataset or sensor readings are exposed. Measurements, units, and record-level analysis are unavailable.',
} as const;

export const anatomyAsset = {
  name: 'Écorché',
  modelUrl:
    'https://raw.githubusercontent.com/Charleeh/ecorche/320805e06aee51e2e6f6b22533eb2a59d43f2d4d/model/ecorche.meshopt.glb',
  repositoryUrl: 'https://github.com/Charleeh/ecorche',
  license: 'CC BY-SA 4.0',
  credit:
    'Écorché (github.com/Charleeh/ecorche), CC BY-SA 4.0. Based on BodyParts3D, © The Database Center for Life Science, CC BY 4.0, and Z-Anatomy by Gauthier Kervyn, CC BY-SA 4.0.',
  availableLayers: ['Translucent body shell', 'Skeleton', 'Heart', 'Brain', 'Lungs', 'Immune system context'],
  unavailableLayers: ['Connected astronaut sensors'],
  limitation:
    'The visualization combines separately sourced educational anatomy meshes. It is not NASA data, does not represent an astronaut scan, and is not for clinical use.',
} as const;

const BP3D_BASE =
  'https://raw.githubusercontent.com/Harsh9005/shear-stress-3d-viz/ac802d8aab35645694b2dacef0240006d25247c3/docs/assets/anatomy/';

export const bodyAssets = {
  body: `${BP3D_BASE}body.glb`,
  organs: `${BP3D_BASE}organs.glb`,
  heart: `${BP3D_BASE}heart.glb`,
  skeleton: anatomyAsset.modelUrl,
  bodyBounds: { min: [-56.1176, -24.3363, -177.4029], max: [57.8655, 25.2159, 109.0057] },
} as const;
