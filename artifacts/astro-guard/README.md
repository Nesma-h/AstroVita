# Astro-Guard

A two-screen astronaut-health visualization for the NASA Space Apps Challenge “Create Health Monitoring Software for Astronauts on Space Missions.”

## Run

From the workspace root:

```bash
pnpm --filter @workspace/astro-guard run dev
```

The app is served through its managed Replit web workflow. For a static check, run:

```bash
pnpm --filter @workspace/astro-guard run typecheck
```

## Experience

- `/` — short Earth-from-space introduction
- `/dashboard` — interactive translucent 3D anatomy and selected-system panel
- Legacy research routes redirect to the two-screen experience.

## Data status

The official challenge page now links NASA HRP hazard, risk, and research information. No challenge-specific astronaut telemetry dataset or sensor feed was exposed in the reviewed resources. Per the user's direction, the dashboard uses clearly marked local demo values only. They are not NASA readings, connected sensor data, clinical thresholds, or diagnoses. See `NASA_DATA_ANALYSIS.md` and `resources/resource_inventory.md`.

## Anatomy asset

The view uses separately sourced BodyParts3D-derived skin/organ meshes and the Écorché skeleton. These are educational visual assets, not NASA data or clinical tools. Full attribution and license information are in `resources/resource_inventory.md`.
