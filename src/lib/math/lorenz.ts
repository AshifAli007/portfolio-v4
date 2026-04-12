/** Classic Lorenz parameters that produce the “butterfly” attractor. */
export const DEFAULT_LORENZ_PARAMS = {
  sigma: 10,
  rho: 28,
  beta: 8 / 3,
} as const;

export type LorenzParams = {
  sigma: number;
  rho: number;
  beta: number;
};

type Vec3 = readonly [number, number, number];

function lorenzDerivative([x, y, z]: Vec3, p: LorenzParams): [number, number, number] {
  return [p.sigma * (y - x), x * (p.rho - z) - y, x * y - p.beta * z];
}

function add(a: Vec3, b: Vec3): [number, number, number] {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: Vec3, s: number): [number, number, number] {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function rk4Step(state: Vec3, dt: number, p: LorenzParams): [number, number, number] {
  const f = (s: Vec3) => lorenzDerivative(s, p);
  const k1 = f(state);
  const k2 = f(add(state, scale(k1, dt / 2)));
  const k3 = f(add(state, scale(k2, dt / 2)));
  const k4 = f(add(state, scale(k3, dt)));
  return add(
    state,
    scale(add(add(add(k1, scale(k2, 2)), scale(k3, 2)), k4), dt / 6)
  );
}

/**
 * Integrates forward in time; returns `steps` samples as xyz triples (length `steps * 3`).
 * Optional warmup discards transient before recording.
 */
export function integrateLorenz(
  initial: Vec3,
  steps: number,
  dt: number,
  params: LorenzParams = DEFAULT_LORENZ_PARAMS,
  warmupSteps = 2500
): Float32Array {
  let x: number = initial[0];
  let y: number = initial[1];
  let z: number = initial[2];

  for (let i = 0; i < warmupSteps; i++) {
    [x, y, z] = rk4Step([x, y, z], dt, params);
  }

  const out = new Float32Array(steps * 3);
  for (let i = 0; i < steps; i++) {
    [x, y, z] = rk4Step([x, y, z], dt, params);
    const o = i * 3;
    out[o] = x;
    out[o + 1] = y;
    out[o + 2] = z;
  }
  return out;
}
