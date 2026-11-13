import type { SystemId } from '@/data/demoHealth';

/**
 * Source-backed educational notes, not advice generated from an individual reading.
 * Each note is linked to that system's NASA HRP risk page in SYSTEMS.
 */
export const HEALTH_GUIDANCE: Record<SystemId, string> = {
  heart: 'NASA reports that regular exercise and healthy diets help crews maintain cardiovascular fitness. Follow the exercise and nutrition plan issued for the mission; this app does not tailor or change it.',
  lungs: 'NASA describes mission-specific protocols for oxygen concentration and pressure. A breathing-rate entry does not measure oxygen status; use the mission-approved monitoring method and onboard medical procedure.',
  brain: 'NASA describes light-dark cycle support and scheduled relaxation and self-care as ways to support sleep and help prevent burnout on the ISS. Follow the routine issued for the mission; this app does not adjust it.',
  skeletal: 'NASA describes exercise as essential to preventing declines in bone tissue. Follow the mission exercise prescription; minutes logged here do not show bone density.',
  immune: 'NASA researchers monitor immune changes with biological samples such as blood, saliva, and urine. This check-in cannot assess immune status; follow mission-scheduled tests and medical procedures.',
};
