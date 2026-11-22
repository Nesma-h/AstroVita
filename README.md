# AstroVita

AstroVita (app name: Astro-Guard) is a NASA Space Apps Challenge team project: an astronaut-health visualization demo with a short intro and an interactive 3D anatomy dashboard. It uses demo/simulated readings, not live NASA telemetry, and it is not a medical tool.

## About the project

The app was built for the NASA Space Apps Challenge 2026 challenge ["Create Health Monitoring Software for Astronauts on Space Missions"](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/). It is a two-screen web experience:

- **Landing page (`/`)** - a short space-themed introduction with an animated astronaut mascot and a Start action.
- **Dashboard (`/dashboard`)** - an interactive, translucent 3D human anatomy view built with Three.js. Selecting a body system opens a panel with NASA Human Research Program (HRP) risk context, clearly labeled demo readings, and an animated 3D layer for that system.

## Features

- **Interactive 3D anatomy explorer** - a translucent body shell with selectable heart, brain, lungs, and skeleton layers. The heart mesh beats at the displayed demo bpm, the lungs expand and relax at the demo breathing rate, and the brain and skeleton get highlight effects. Each animation is labeled as a visualization, not a real measurement.
- **Five body systems with NASA context** - Heart (circulation), Lungs (breathing), Brain (sleep), Skeleton (bone and load), and Immune system. Each panel cites the relevant NASA HRP risk page and explains what the shown value can and cannot tell you.
- **Demo scenarios** - Nominal, Elevated workload, Recovery, and Alert drill. All readings and alerts are pre-scripted and marked DEMO / SIMULATED; they are never presented as NASA data or live sensor data.
- **Manual health check-in** - an optional drawer where you can enter heart rate, blood pressure, breathing rate, blood glucose, body temperature, sleep hours, exercise minutes, and mood. Entries stay in page memory only: they are never sent or saved, and demo alerts never classify them.
- **Data-integrity rules** - the project keeps NASA HRP context, third-party anatomy assets, and synthetic demo values strictly separated, with no invented clinical thresholds, diagnoses, or risk scores. See `artifacts/astro-guard/PROJECT_ARCHITECTURE.md`.

## Tech stack

- React, TypeScript, Vite, Tailwind CSS, Wouter, and Three.js
- pnpm workspaces, Node.js 24
- The workspace also includes an Express 5 API server with PostgreSQL + Drizzle ORM and Orval API codegen, though the app itself is frontend-only.

## Run locally

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/astro-guard run dev
```

Then open `http://localhost:5173`. An internet connection is needed to download the anatomy models on first load. For a static check, run:

```bash
pnpm --filter @workspace/astro-guard run typecheck
```

## Anatomy assets

The 3D view uses separately sourced educational anatomy meshes: a BodyParts3D-derived body shell and organ meshes, and the Écorché skeleton (CC BY-SA 4.0). These are educational visual assets, not NASA data, astronaut scans, or clinical tools. Full attribution and license information are in `artifacts/astro-guard/resources/resource_inventory.md`.

## Team

This project was built for the NASA Space Apps Challenge by a team:

- Mohanad Mostafa
- Malak Ahmed
- Hemat Hamdy
- Mohamed El-Sefty
- Mohamed Emad El-Sefty
- Nesma Hesham

## Credits

This repository is a standalone copy of the original team repository at https://github.com/Mohanad06/AstroVita, kept so each team member can showcase the project. The full commit history and original authorship are preserved. Credit for the work belongs to the whole team above.

## Documentation

Setup, screens, and data-status notes live in the app README: [artifacts/astro-guard/README.md](artifacts/astro-guard/README.md). See also `artifacts/astro-guard/NASA_DATA_ANALYSIS.md` for dataset availability and `artifacts/astro-guard/PROJECT_ARCHITECTURE.md` for routes and data-integrity rules.
