# Lorenz system - product & implementation context

## References

- Overview: [Lorenz system (Wikiwand)](https://www.wikiwand.com/en/Lorenz_system) - mirrors Wikipedia content with a nicer reader.
- Canonical equations and history: [Wikipedia - Lorenz system](https://en.wikipedia.org/wiki/Lorenz_system).

---

## What it is (short)

The **Lorenz system** is three coupled ordinary differential equations in variables \((x, y, z)\), introduced by Edward Lorenz (1963) as a drastically simplified model of **atmospheric convection**. Despite being deterministic (no randomness in the equations), it can exhibit **chaos**: trajectories stay on a bounded **strange attractor** (the famous “butterfly”) and **diverge exponentially** when initial conditions differ slightly.

Standard form:

\[
\frac{dx}{dt} = \sigma (y - x),\quad
\frac{dy}{dt} = x(\rho - z) - y,\quad
\frac{dz}{dt} = xy - \beta z
\]

Common parameter set (classic chaotic behavior): \(\sigma = 10\), \(\rho = 28\), \(\beta = 8/3\).

---

## Why it’s interesting (“benefits” for learning)

| Idea | What you get |
|------|----------------|
| **Deterministic chaos** | Same equations, same parameters - yet long-term behavior looks unpredictable because of **sensitive dependence on initial conditions**. |
| **Visual attractor** | The trajectory in 3D space traces a **surface-like** structure (the Lorenz attractor), ideal for a **3D animation**. |
| **Sensitivity demo** | Two runs with \((x_0,y_0,z_0)\) and \((x_0+\varepsilon,y_0,z_0)\) start together then **separate** - perfect for “small change in input → large change in output” with **color** (e.g. two hues or a time-based gradient). |
| **Pedagogy** | Bridges differential equations, numerical integration, and visualization - good fit for a math “journal” site. |

---

## Site architecture (math subdomain)

**Entry:** `math.ashifdesigns.com` (or `/math` on the main domain) - same Next.js app, middleware rewrites subdomain to `/math/*`.

| Layer | Purpose |
|-------|---------|
| **Index - “posters”** | `/math` lists **cards / posters** (title, blurb, optional thumbnail) linking to each topic. |
| **Topic page** | e.g. `/math/lorenz` - intro copy, external links, equations, then the **hero: 3D interactive demo** at the top or just below a short lead. |

Future topics can follow the same pattern (`/math/…`).

---

## Demo - requirements (most important)

1. **3D** - The attractor lives in \(\mathbb{R}^3\); use a real 3D scene with orbit / trackball controls (rotate, zoom).
2. **Numerical integration** - e.g. **RK4** with fixed \(\Delta t\), enough steps to fill a long trajectory.
3. **Sensitivity** - **Two** trajectories from nearby initial conditions; show **divergence** (distinct colors).
4. **Color** - Use color deliberately: e.g. time along a single path (gradient), or **two solid colors** for the two sensitive runs; optional third color for axes / grid.
5. **Performance** - Prefer precomputing points or integrating in a tight loop; cap point count if needed for mobile.

---

## Libraries (recommendation)

| Option | Notes |
|--------|--------|
| **`three`** (already in this repo) | Core 3D: `BufferGeometry` + `Line` / `LineSegments`, `PerspectiveCamera`, `WebGLRenderer`. You integrate Lorenz in plain TS and push positions. |
| **`@react-three/fiber` + `@react-three/drei`** (optional add) | React-friendly `<Canvas>`, `OrbitControls`, declarative scene graph - good if you want the demo as composable React components. |

**Practical default:** implement with **`three`** first to avoid new deps; add R3F later if the scene grows.

---

## Implementation checklist (for this repo)

- [ ] Add route **`/math/lorenz`** (`src/app/math/lorenz/page.tsx`) using existing **`math/layout.tsx`** (journal theme).
- [ ] Move Lorenz-specific UI into something like `src/components/Math/Lorenz/` (consider renaming folder **`Lorenz system` → `lorenz`** to avoid spaces in paths).
- [ ] `lorenzIntegrator.ts`: RK4 + Lorenz RHS; output `Float32Array` positions for one or two runs.
- [ ] `LorenzAttractorCanvas.tsx` (client): Three.js canvas, lines, axes helper, `OrbitControls` (from `three/examples`).
- [ ] `/math` index: add a **poster card** linking to Lorenz.
- [ ] Optional: slider for \(\varepsilon\) (initial separation) or \(\rho\) (watch bifurcation behavior - scope carefully).

---

## Copy / content to include on the Lorenz page

- One paragraph: what the system models and that it’s a **chaos** textbook example.
- The three equations (rendered with KaTeX or static MathML later if desired).
- Link to Wikiwand/Wikipedia.
- Short “how to use” for the 3D view (drag to rotate, scroll to zoom).

---

## Open decisions

- **Poster grid layout** on `/math`: single column vs. grid on large screens.
- **Mobile:** simplify controls or reduce point count for WebGL performance.
