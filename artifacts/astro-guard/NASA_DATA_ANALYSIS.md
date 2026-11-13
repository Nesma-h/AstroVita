# NASA data analysis

**Review date:** November 13, 2026

## Findings

The official [challenge Resources tab](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources) now links to NASA Human Research Program (HRP) pages about the [five hazards](https://www.nasa.gov/hrp/hazards/), [human spaceflight risks](https://www.nasa.gov/hrp/risks/), and [ongoing research](https://www.nasa.gov/hrp/ongoing-hrp-research/), as well as two Canadian Space Agency partner pages.

These resources provide qualitative descriptions and research context. The page content reviewed does **not** expose a challenge-specific telemetry dataset, per-astronaut observations, sensor schema, units table, or documented thresholds. There are therefore no NASA readings to profile, analyze, or connect to a live sensor display in this build.

## Source-supported context

NASA's five broad hazard categories are space radiation, isolation and confinement, distance from Earth, gravity fields, and hostile/closed environments. The HRP risks page discusses, among other topics:

| HRP risk topic | Source-supported summary | Astro-Guard display scope |
| --- | --- | --- |
| Cardiovascular adaptations | Weightlessness can alter circulation and heart and blood-vessel function. | Heart region is a navigation aid to this topic; no diagnosis or individual risk is inferred. |
| Reduced cardiorespiratory and musculoskeletal fitness | NASA discusses bone density, muscle strength, and heart/blood-vessel performance. | Heart and skeletal regions are illustrative only; there are no astronaut measurements here. |
| Spaceflight-induced bone changes | NASA describes changes in bone density/strength in microgravity. | Skeleton region points to the NASA context, not to a measured density value. |
| Altered immune system responses | NASA describes research into immune-system changes during spaceflight. | Immune is shown as a system-wide topic, not as a single organ or a sensor-derived condition. |
| Hypoxia | NASA describes reduced oxygen levels in body tissues as a risk in some mission contexts. | Lung/respiratory region is illustrative; the app does not measure oxygenation. |
| SANS and behavioral/sleep risks | NASA discusses eye/brain structural changes, behavioral health, sleep loss, and schedule disruption. | Brain region links to context; it does not display neurological or psychological findings. |

The visible anatomical markers are a small, explicitly selected subset of HRP topics, not a complete map of every hazard or risk. Their placement is for exploration and must not be read as proof that a risk is localized to the marked structure.

## Dataset inventory and schema

| Dataset | Format | Records / columns | Variables, types, units | Missingness |
| --- | --- | --- | --- | --- |
| Challenge-specific telemetry dataset | Not exposed in reviewed resources | Not available | No schema or measurement units available | Not assessable |

No actual observations are available. Record counts, field names, data types, units, missing-value rates, distributions, and relationships between variables cannot be reported.

## Demonstration data policy

At the user's direction, the interface may show **synthetic demo readings** to demonstrate interaction and animation. These are application-authored scenarios, visibly labeled **DEMO / SIMULATED** and never presented as NASA or astronaut sensor data. A scripted scenario state is not a medical risk classification; no invented clinical thresholds, diagnosis, treatment, or NASA recommendation is shown. Example activity/sleep values are demonstrations only. Immune and bone status must not be portrayed as inferred from a wearable sensor.

## Application use and limitations

- The NASA pages support concise qualitative source notes and links; they do not supply a live feed or a challenge telemetry dataset.
- The 3D model is a separately sourced educational asset, not NASA science data or a clinical visualization.
- Region markers are an interaction aid to relevant NASA context, not a claim of a proven one-to-one medical mapping.
- No real-time sensor integration or clinical interpretation is implemented.

If the team later receives a real data file or sensor contract, preserve the source unchanged, inspect its documentation and schema, verify units and relationships, and replace demo fields only where the evidence supports them.
