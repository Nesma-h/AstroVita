---
name: Graphics lifecycle
description: Resource-lifecycle rule for the continuously updating Three.js dashboard
---

Treat WebGL support detection as one-time initialization, not as an expression evaluated during React rendering. Release temporary test contexts and clean up renderer resources on teardown.

**Why:** Demo readings re-render continuously. A resource-creating expression passed to a ref is still evaluated on each render and can exhaust the browser's limited graphics contexts.

**How to apply:** Keep graphics acquisition in lazy initialization or lifecycle effects, pair every acquisition with disposal, and handle a lost graphics context with an explicit retry state instead of an uncaught render-loop failure.
