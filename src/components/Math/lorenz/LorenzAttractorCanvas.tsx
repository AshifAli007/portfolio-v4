"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { LorenzParams } from "@/lib/math/lorenz";
import { DEFAULT_LORENZ_PARAMS, integrateLorenz } from "@/lib/math/lorenz";

const BG = 0xfaf8f4;
const COLOR_A = 0xb45309;
const COLOR_B = 0x1e40af;
const DT = 0.008;
const STEPS = 12000;

/** Axis colors: standard X / Y / Z (red / green / blue) for recognition. */
const AXIS_X = 0xb91c1c;
const AXIS_Y = 0x15803d;
const AXIS_Z = 0x1d4ed8;

const T_MAX = STEPS * DT;

/** Initial scrub position (simulation time). */
const INITIAL_T = 25;

/** Defaults for this demo: same on every load and when using "Reset defaults". */
const LORENZ_PAGE_DEFAULTS = {
  sigma: 5.5,
  rho: 46.5,
  beta: 3.56,
  epsilon: 0.00112,
} as const;

/**
 * Random parameters for "Random inputs". Kept in a mostly well-behaved band so
 * trajectories usually stay bounded (full slider range often blows up numerically).
 */
function randomLorenzInputs() {
  const sigma = 5 + Math.floor(Math.random() * 101) * 0.1;
  const rho = 15 + Math.floor(Math.random() * 71) * 0.5;
  const beta = Math.round((2 + Math.random() * 2) * 100) / 100;
  const epsilon =
    Math.round(
      (0.00005 + Math.random() * (0.002 - 0.00005)) * 100_000,
    ) / 100_000;
  return { sigma, rho, beta, epsilon };
}

const MAX_COORD = 5e6;

function isReasonableTrajectory(pos: Float32Array): boolean {
  for (let i = 0; i < pos.length; i++) {
    const v = pos[i];
    if (!Number.isFinite(v) || Math.abs(v) > MAX_COORD) return false;
  }
  return true;
}

function expandBox(box: THREE.Box3, positions: Float32Array) {
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.length; i += 3) {
    v.set(positions[i], positions[i + 1], positions[i + 2]);
    box.expandByPoint(v);
  }
}

function createAxisLabelSprite(
  text: string,
  colorHex: number,
  worldScale: number,
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const s = 256;
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, s, s);
  const col = new THREE.Color(colorHex);
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = `#${col.getHexString()}`;
  ctx.font = "italic 118px Georgia, 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, s / 2, s / 2);
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    depthTest: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(worldScale, worldScale, 1);
  return sprite;
}

function disposeArrowHelper(arrow: THREE.ArrowHelper) {
  arrow.line.geometry.dispose();
  (arrow.line.material as THREE.Material).dispose();
  arrow.cone.geometry.dispose();
  (arrow.cone.material as THREE.Material).dispose();
}

function disposeSprite(sprite: THREE.Sprite) {
  const m = sprite.material as THREE.SpriteMaterial;
  m.map?.dispose();
  m.dispose();
}

export default function LorenzAttractorCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const geomARef = useRef<THREE.BufferGeometry | null>(null);
  const geomBRef = useRef<THREE.BufferGeometry | null>(null);

  const [progress, setProgress] = useState(() =>
    Math.min(1, Math.max(0, INITIAL_T / T_MAX)),
  );
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const [sigma, setSigma] = useState<number>(LORENZ_PAGE_DEFAULTS.sigma);
  const [rho, setRho] = useState<number>(LORENZ_PAGE_DEFAULTS.rho);
  const [beta, setBeta] = useState<number>(LORENZ_PAGE_DEFAULTS.beta);
  /** Tiny offset in initial x between the two trajectories (sensitivity demo). */
  const [epsilon, setEpsilon] = useState<number>(LORENZ_PAGE_DEFAULTS.epsilon);

  const params: LorenzParams = useMemo(
    () => ({ sigma, rho, beta }),
    [sigma, rho, beta],
  );

  const { posA, posB } = useMemo(() => {
    const base: [number, number, number] = [0.1, 0, 0];
    let a = integrateLorenz(base, STEPS, DT, params);
    let b = integrateLorenz(
      [base[0] + epsilon, base[1], base[2]],
      STEPS,
      DT,
      params,
    );
    if (!isReasonableTrajectory(a) || !isReasonableTrajectory(b)) {
      const p = DEFAULT_LORENZ_PARAMS;
      const eps = 0.0005;
      a = integrateLorenz(base, STEPS, DT, p);
      b = integrateLorenz([base[0] + eps, base[1], base[2]], STEPS, DT, p);
    }
    return { posA: a, posB: b };
  }, [params, epsilon]);

  const tShown = progress * T_MAX;

  const resetParams = () => {
    setSigma(LORENZ_PAGE_DEFAULTS.sigma);
    setRho(LORENZ_PAGE_DEFAULTS.rho);
    setBeta(LORENZ_PAGE_DEFAULTS.beta);
    setEpsilon(LORENZ_PAGE_DEFAULTS.epsilon);
  };

  const randomizeParams = () => {
    const r = randomLorenzInputs();
    setSigma(r.sigma);
    setRho(r.rho);
    setBeta(r.beta);
    setEpsilon(r.epsilon);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1e6);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const geomA = new THREE.BufferGeometry();
    geomA.setAttribute("position", new THREE.BufferAttribute(posA, 3));

    const lineA = new THREE.Line(
      geomA,
      new THREE.LineBasicMaterial({ color: COLOR_A, linewidth: 1 }),
    );
    scene.add(lineA);

    const geomB = new THREE.BufferGeometry();
    geomB.setAttribute("position", new THREE.BufferAttribute(posB, 3));

    const lineB = new THREE.Line(
      geomB,
      new THREE.LineBasicMaterial({ color: COLOR_B, linewidth: 1 }),
    );
    scene.add(lineB);

    geomARef.current = geomA;
    geomBRef.current = geomB;

    const n0 = Math.max(2, Math.floor(progressRef.current * STEPS));
    geomA.setDrawRange(0, n0);
    geomB.setDrawRange(0, n0);

    const box = new THREE.Box3();
    expandBox(box, posA);
    expandBox(box, posB);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    let maxDim = Math.max(size.x, size.y, size.z, 1);
    if (!Number.isFinite(maxDim) || maxDim <= 0 || box.isEmpty()) {
      center.set(0, 0, 0);
      maxDim = 50;
    }

    /** Camera distance (smaller = more zoom). */
    const dist = maxDim * 0.95;

    controls.target.copy(center);
    camera.position.set(
      center.x + dist,
      center.y + dist * 0.88,
      center.z + dist,
    );
    camera.near = maxDim / 1000;
    camera.far = maxDim * 100;
    camera.updateProjectionMatrix();

    const axisLen = maxDim * 0.52;
    /** Smaller head = slimmer arrows (was 0.22 / 0.55, looked heavy). */
    const headLen = axisLen * 0.13;
    const headWidth = headLen * 0.38;
    const labelScale = maxDim * 0.12;

    const xDir = new THREE.Vector3(1, 0, 0);
    const yDir = new THREE.Vector3(0, 1, 0);
    const zDir = new THREE.Vector3(0, 0, 1);

    const arrowX = new THREE.ArrowHelper(
      xDir,
      center,
      axisLen,
      AXIS_X,
      headLen,
      headWidth,
    );
    const arrowY = new THREE.ArrowHelper(
      yDir,
      center,
      axisLen,
      AXIS_Y,
      headLen,
      headWidth,
    );
    const arrowZ = new THREE.ArrowHelper(
      zDir,
      center,
      axisLen,
      AXIS_Z,
      headLen,
      headWidth,
    );
    scene.add(arrowX, arrowY, arrowZ);

    const sx = createAxisLabelSprite("x", AXIS_X, labelScale);
    sx.position.copy(
      center.clone().add(xDir.clone().multiplyScalar(axisLen * 1.12)),
    );
    const sy = createAxisLabelSprite("y", AXIS_Y, labelScale);
    sy.position.copy(
      center.clone().add(yDir.clone().multiplyScalar(axisLen * 1.12)),
    );
    const sz = createAxisLabelSprite("z", AXIS_Z, labelScale);
    sz.position.copy(
      center.clone().add(zDir.clone().multiplyScalar(axisLen * 1.12)),
    );
    scene.add(sx, sy, sz);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const disposeLineObject = (obj: THREE.Line) => {
      obj.geometry.dispose();
      (obj.material as THREE.Material).dispose();
    };

    return () => {
      geomARef.current = null;
      geomBRef.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      disposeLineObject(lineA);
      disposeLineObject(lineB);
      disposeArrowHelper(arrowX);
      disposeArrowHelper(arrowY);
      disposeArrowHelper(arrowZ);
      disposeSprite(sx);
      disposeSprite(sy);
      disposeSprite(sz);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [posA, posB]);

  useEffect(() => {
    const ga = geomARef.current;
    const gb = geomBRef.current;
    if (!ga || !gb) return;
    const n = Math.max(2, Math.floor(progress * STEPS));
    ga.setDrawRange(0, n);
    gb.setDrawRange(0, n);
  }, [progress]);

  return (
    <div className="space-y-5">
      <div className="flex flex-row items-stretch gap-2 sm:gap-3">
        <div
          ref={containerRef}
          className="min-h-[min(72vh,560px)] min-w-0 flex-1 overflow-hidden rounded-lg border border-stone-200/90 bg-[#faf8f4] shadow-sm"
        />
        {/* Vertical slider: bottom = t ≈ 0, top = t = T_max (via -rotate-90) */}
        <div className="flex h-[min(72vh,560px)] w-7 shrink-0 flex-col items-center justify-center sm:w-8">
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="h-8 origin-center -rotate-90 cursor-pointer touch-manipulation accent-[color:var(--math-terracotta,#b45309)]"
            style={{ width: "min(72vh, 560px)" }}
            aria-label="Simulation time: drag up to increase time along the trajectory"
          />
        </div>
      </div>

      <div className="space-y-3 px-0.5">
        <div>
          <div className="text-sm font-medium text-stone-700">
            Simulation time
          </div>
          <p className="mt-1 tabular-nums font-mono text-xs leading-snug text-stone-500">
            t = {tShown.toFixed(2)} / {T_MAX.toFixed(2)}{" "}
            <span className="text-[0.7rem] font-sans font-normal text-stone-400">
              (simulation units)
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-stone-200/80 bg-white/50 px-4 py-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-stone-800">
              Parameters (inputs)
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={randomizeParams}
                className="rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
              >
                Random inputs
              </button>
              <button
                type="button"
                onClick={resetParams}
                className="rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
              >
                Reset defaults
              </button>
            </div>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-stone-500">
            The equations use{" "}
            <span className="font-mono text-stone-700">&sigma;</span>,{" "}
            <span className="font-mono text-stone-700">&rho;</span>,{" "}
            <span className="font-mono text-stone-700">&beta;</span>. Changing them
            changes the whole motion.{" "}
            <span className="font-mono text-stone-700">&epsilon;</span> is the gap in
            starting <span className="font-mono text-stone-700">x</span> between the orange
            and blue paths (sensitivity).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs text-stone-600">
                &sigma; (sigma) ={" "}
                <span className="font-mono tabular-nums text-stone-800">
                  {sigma.toFixed(1)}
                </span>
              </span>
              <input
                type="range"
                min={0.5}
                max={30}
                step={0.1}
                value={sigma}
                onChange={(e) => setSigma(Number(e.target.value))}
                className="w-full accent-[color:var(--math-terracotta,#b45309)]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-stone-600">
                &rho; (rho) ={" "}
                <span className="font-mono tabular-nums text-stone-800">
                  {rho.toFixed(1)}
                </span>
              </span>
              <input
                type="range"
                min={0.5}
                max={50}
                step={0.5}
                value={rho}
                onChange={(e) => setRho(Number(e.target.value))}
                className="w-full accent-[color:var(--math-terracotta,#b45309)]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-stone-600">
                &beta; (beta) ={" "}
                <span className="font-mono tabular-nums text-stone-800">
                  {beta.toFixed(2)}
                </span>
              </span>
              <input
                type="range"
                min={0.5}
                max={12}
                step={0.01}
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                className="w-full accent-[color:var(--math-terracotta,#b45309)]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-stone-600">
                &epsilon; (initial x gap) ={" "}
                <span className="font-mono tabular-nums text-stone-800">
                  {epsilon.toExponential(2)}
                </span>
              </span>
              <input
                type="range"
                min={0.00001}
                max={0.01}
                step={0.00001}
                value={epsilon}
                onChange={(e) => setEpsilon(Number(e.target.value))}
                className="w-full accent-[color:var(--math-terracotta,#b45309)]"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
