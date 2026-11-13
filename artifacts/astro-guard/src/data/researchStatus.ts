export const challengeSource = {
  title: 'Create Health Monitoring Software for Astronauts on Space Missions',
  url: 'https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/',
  resourcesUrl:
    'https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources',
  reviewedOn: 'November 13, 2026',
  resourceStatus:
    'The Resources tab currently displays “Resources will be available on Friday, November 13.” No downloadable challenge dataset or document is exposed in the page content available to this review.',
} as const;

export const challengeContext = {
  sourceUrl: 'https://www.spaceappschallenge.org/2026/find-a-team/1111/',
  sourceLabel: 'Challenge description reproduced on the Space Apps platform',
  caveat:
    'The host page labels surrounding content as user-generated. Treat this excerpt as qualitative challenge context, not as a dataset or medical guidance.',
  conditions: [
    'Space radiation',
    'Isolation and confinement',
    'Altered gravity',
    'Hostile closed environment',
  ],
  possibleEffects: [
    'Immune changes',
    'Bone loss',
    'Cardiovascular events',
    'Behavioral health problems',
  ],
} as const;

export const datasetStatus = {
  state: 'not-available',
  count: null,
  records: null,
  columns: null,
  message:
    'No official challenge dataset is currently exposed by the Resources tab. Measurements, units, missingness, and analysis are unavailable.',
} as const;

export const anatomyAsset = {
  name: 'Écorché',
  modelUrl:
    'https://raw.githubusercontent.com/Charleeh/ecorche/main/model/ecorche.meshopt.glb',
  repositoryUrl: 'https://github.com/Charleeh/ecorche',
  license: 'CC BY-SA 4.0',
  credit:
    'Écorché (github.com/Charleeh/ecorche), CC BY-SA 4.0. Based on BodyParts3D, © The Database Center for Life Science, CC BY 4.0, and Z-Anatomy by Gauthier Kervyn, CC BY-SA 4.0.',
  availableLayers: ['Skeleton', 'Deep muscles', 'Superficial muscles'],
  unavailableLayers: ['Skin', 'Internal organs'],
  limitation:
    'The source model depicts a single adult male and contains named skeleton and muscle meshes only. It does not include skin or internal organs and is not for clinical use.',
} as const;
