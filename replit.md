# Astro-Guard

Astro-Guard is a NASA Space Apps Challenge research and anatomy visualization web app that keeps challenge data, visual assets, and software-generated displays clearly separated.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/astro-guard/` — Astro-Guard React/Vite web app
- `artifacts/astro-guard/src/data/researchStatus.ts` — source status, qualitative challenge context, and anatomy model provenance used by the UI
- `artifacts/astro-guard/resources/resource_inventory.md` — official resource inventory and visual asset attribution
- `artifacts/astro-guard/NASA_DATA_ANALYSIS.md` — dataset availability and scientific data limitations
- `artifacts/astro-guard/PROJECT_ARCHITECTURE.md` — routes, implementation approach, and data-integrity rules

## Architecture decisions

- The application is frontend-only until official challenge data or a real server-side requirement exists.
- No telemetry, medical thresholds, risk scores, or recommendations are fabricated when challenge datasets are unavailable.
- The anatomy model is a third-party educational visual asset, not NASA data or a clinical tool.

## Product

The app presents NASA Space Apps challenge context, an interactive anatomy explorer, source availability, and methodology. Data Explorer and Analysis explicitly report when official measurements are not available.

## User preferences

- Follow the attached Astro-Guard master prompt: research official resources first; keep NASA science distinct from third-party visuals; do not invent scientific data or unsupported medical claims; build a working multi-page web application.

## Gotchas

- The challenge Resources tab showed only a “Resources will be available on Friday, November 13” notice when reviewed on November 13, 2026. Recheck it before adding datasets.
- The selected Écorché GLB is meshopt-compressed and only includes skeleton and muscle meshes; skin and internal organs are not in the asset.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
