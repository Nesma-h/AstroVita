# Astro-Guard

A research-first web application for the NASA Space Apps Challenge “Create Health Monitoring Software for Astronauts on Space Missions.”

## Run

From the workspace root:

```bash
pnpm --filter @workspace/astro-guard run dev
```

The app is served through its managed Replit web workflow. For a static check, run:

```bash
pnpm --filter @workspace/astro-guard run typecheck
```

## Pages

- `/overview` — project purpose and source availability
- `/3d-explorer` — interactive, attributed anatomy visualization
- `/monitoring` — qualitative challenge context and evidence limits
- `/data-explorer` — dataset availability and inventory
- `/analysis` — analysis readiness and methodological limits
- `/methodology` — sources, provenance, licensing, and constraints

## Data status

The official challenge Resources tab currently shows a notice that resources will be available on November 13, 2026, but no downloadable datasets or documents were exposed in the reviewed page content. The app does not display fabricated measurements, charts, thresholds, risk classes, or telemetry. See `NASA_DATA_ANALYSIS.md` and `resources/resource_inventory.md`.

## Anatomy asset

The Écorché model is a third-party educational visual asset, not NASA data. It is licensed CC BY-SA 4.0 and contains named skeleton and muscle meshes. It does not include skin or internal organs and is not for clinical use. Full attribution is in `resources/resource_inventory.md`.
