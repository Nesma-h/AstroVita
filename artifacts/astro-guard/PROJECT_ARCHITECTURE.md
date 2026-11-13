# Astro-Guard project architecture

## Product scope

Astro-Guard is a research-first web application for the NASA Space Apps Challenge “Create Health Monitoring Software for Astronauts on Space Missions.” It presents challenge context, an interactive anatomy visualization, and dedicated research/data pages. It does not claim to receive live NASA telemetry or provide medical advice.

## Pages

| Route | Responsibility |
| --- | --- |
| `/overview` | Project purpose, source status, and navigation to the anatomy and data sections. |
| `/3d-explorer` | Interactive anatomy layers and structure selection, with clear asset attribution and scope limits. |
| `/monitoring` | Qualitative challenge conditions and documented limits; no invented measurements or thresholds. |
| `/data-explorer` | Dataset availability, source inventory, and an honest empty state until challenge files are published. |
| `/analysis` | Explains that quantitative analyses are unavailable until verified observations and methods exist. |
| `/methodology` | Provenance, asset licensing, data policy, processing decisions, and known limitations. |

## Technical approach

- React, TypeScript, Vite, Tailwind CSS, and Wouter for client-side page navigation.
- Keep the initial implementation frontend-only: the currently available content is static research documentation, and there is no user data or dataset requiring a backend or database.
- Keep the research catalog and scientific context separate from presentation components.
- Use the Écorché GLB as a third-party anatomy visualization asset. Its meshes support skeleton and muscle layer interaction. It does not contain skin or organs, so those layers are reported as unavailable instead of approximated.
- Keep NASA challenge data, third-party anatomical geometry, and software-generated display behavior clearly separated.

## Data integrity rules

1. Do not fabricate measurements, thresholds, risk classifications, recommendations, or telemetry.
2. Do not assert a relationship between a challenge condition and an anatomical region without a cited source.
3. Keep original challenge resources unchanged and record their provenance.
4. Reassess the architecture when official datasets become available; only add processing and charts that the real fields and documentation support.
