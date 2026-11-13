# Astro-Guard project architecture

## Product scope

Astro-Guard is a two-screen web experience for the NASA Space Apps Challenge “Create Health Monitoring Software for Astronauts on Space Missions.” It starts with a short Earth-from-space introduction, then opens a single interactive anatomy dashboard. The experience distinguishes official NASA HRP context, separately licensed anatomical assets, and local synthetic demonstration readings.

## Routes

| Route | Responsibility |
| --- | --- |
| `/` | Brief welcome, Earth image, and direct Start action. |
| `/dashboard` | Interactive translucent anatomy view, system markers, demo scenarios, optional manual check-in, and selected-region detail. |
| Legacy research routes | Redirect to `/` or `/dashboard`; no longer exposed as six separate pages. |

## Technical approach

- React, TypeScript, Vite, Tailwind CSS, Wouter, and Three.js.
- Frontend-only; no challenge dataset, sensor service, or persistent user data store is connected. Optional manual check-in values remain in page memory only.
- Use a separately sourced BodyParts3D-derived skin shell, selected organ meshes, and Écorché skeleton. Load only the regions relevant to selected NASA HRP risk contexts, and preserve each source's attribution/license.
- Keep HRP citations and risk-context notes separate from application-authored demo values.
- Pin external model asset URLs to source revisions and provide a graceful load/WebGL fallback.

## Data integrity rules

1. Mark every synthetic reading and scripted scenario **DEMO / SIMULATED**; label manual check-ins as user-entered, not NASA, astronaut telemetry, or live sensor data.
2. Do not create clinical thresholds, risk scores, diagnoses, treatment recommendations, or emergency actions. Generic process guidance may direct users to mission-approved limits and procedures only.
3. Use region markers as navigation to cited HRP context, not as proof of a direct medical mapping or an individual astronaut's condition.
4. Do not infer immune status or bone density from wearable-style values.
5. Keep check-in values in page memory only; do not send or persist them.
6. Preserve source files and their attribution. Replace demo fields only after a real schema and measurement contract are documented.
