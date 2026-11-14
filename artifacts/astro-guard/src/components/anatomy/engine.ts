import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { bodyAssets } from '@/data/researchStatus';
import type { SystemId } from '@/data/demoHealth';

export type EngineStatus =
  | { kind: 'loading'; progress: number }
  | { kind: 'ready'; skeleton: boolean }
  | { kind: 'error'; message: string };

export interface EngineCallbacks {
  onStatus: (s: EngineStatus) => void;
  onPick: (id: SystemId) => void;
}

export interface AnatomyEngine {
  focus: (id: SystemId | null) => void;
  setRates: (bpm: number, breaths: number) => void;
  setPaused: (p: boolean) => void;
  zoom: (dir: 1 | -1) => void;
  bindMarker: (id: SystemId, el: HTMLElement | null) => void;
  dispose: () => void;
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const context = c.getContext('webgl2') || c.getContext('webgl');
    const supported = !!context;
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return supported;
  } catch {
    return false;
  }
}

const HEIGHT = 2;
const FULL_POS = new THREE.Vector3(0, 0.05, 4.1);
const FULL_TARGET = new THREE.Vector3(0, 0, 0);

function pivotize(obj: THREE.Object3D, parent: THREE.Object3D): THREE.Group {
  // Center geometry about its own center so scale animation doesn't shift position.
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const parentInv = new THREE.Matrix4().copy(parent.matrixWorld).invert();
  const centerWorld = box.getCenter(new THREE.Vector3());
  const centerLocal = centerWorld.clone().applyMatrix4(parentInv);
  const pivot = new THREE.Group();
  pivot.position.copy(centerLocal);
  parent.add(pivot);
  pivot.updateMatrixWorld(true);
  pivot.attach(obj);
  return pivot;
}

export function createAnatomyEngine(stage: HTMLElement, cb: EngineCallbacks): AnatomyEngine {
  let disposed = false;
  let renderingFailed = false;
  let frame = 0;
  let paused = false;
  let bpm = 64;
  let breaths = 13;
  let focused: SystemId | null = null;
  const markers: Partial<Record<SystemId, HTMLElement | null>> = {};
  const anchors: Partial<Record<SystemId, THREE.Vector3>> = {};
  const views: Partial<Record<SystemId, { pos: THREE.Vector3; target: THREE.Vector3 }>> = {};

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, stage.clientWidth / Math.max(stage.clientHeight, 1), 0.02, 60);
  camera.position.copy(FULL_POS);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Translucent 3D human body. Drag to orbit, scroll to zoom, and click a highlighted marker to inspect a body system.');
  renderer.domElement.dataset.testid = 'canvas-anatomy';
  stage.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xdfeeff, 0x1a2436, 1.6));
  const key = new THREE.DirectionalLight(0xfff4ea, 2.4);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fd4ff, 2.2);
  rim.position.set(-3, 1.5, -3);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.45;
  controls.maxDistance = 7;
  controls.enablePan = false;
  controls.target.copy(FULL_TARGET);

  // Root in BodyParts3D coordinates (Z up), normalized by body bounds.
  const { min, max } = bodyAssets.bodyBounds;
  const s = HEIGHT / (max[2] - min[2]);
  const cx = (min[0] + max[0]) / 2, cy = (min[1] + max[1]) / 2, cz = (min[2] + max[2]) / 2;
  const root = new THREE.Group();
  root.rotation.x = -Math.PI / 2;
  root.scale.setScalar(s);
  root.position.set(-cx * s, -cz * s, cy * s);
  scene.add(root);
  root.updateMatrixWorld(true);

  // Materials
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xbcd6ea, roughness: 0.25, metalness: 0, transparent: true, opacity: 0.26,
    depthWrite: false, side: THREE.FrontSide, clearcoat: 1, clearcoatRoughness: 0.2,
    emissive: 0x2b4a66, emissiveIntensity: 0.25,
  });
  const shellBackMat = new THREE.MeshBasicMaterial({ color: 0x7fb4d8, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.BackSide });
  const heartMat = new THREE.MeshPhysicalMaterial({ color: 0xd9564c, roughness: 0.38, clearcoat: 0.8, transparent: true, opacity: 0.94, emissive: 0x5a0d0d, emissiveIntensity: 0.3 });
  const lungMat = new THREE.MeshPhysicalMaterial({ color: 0xe79a92, roughness: 0.55, clearcoat: 0.4, transparent: true, opacity: 0.62, depthWrite: false, emissive: 0x3b1414, emissiveIntensity: 0.2 });
  const brainMat = new THREE.MeshPhysicalMaterial({ color: 0xe8bcb0, roughness: 0.5, clearcoat: 0.5, transparent: true, opacity: 0.9, emissive: 0x6b8cff, emissiveIntensity: 0.05 });
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xe9e1cc, roughness: 0.62, transparent: true, opacity: 0.72, depthWrite: false, emissive: 0xffd9a0, emissiveIntensity: 0 });
  const ownedMaterials: THREE.Material[] = [shellMat, shellBackMat, heartMat, lungMat, brainMat, boneMat];

  let heartPivot: THREE.Group | null = null;
  const lungPivots: THREE.Group[] = [];
  let brainPivot: THREE.Group | null = null;
  let skeletonRoot: THREE.Object3D | null = null;
  let immunePoints: THREE.Points | null = null;
  const pickables: THREE.Object3D[] = [];
  const disposeTargets: THREE.Object3D[] = [];

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const progress: Record<string, number> = {};
  const load = (key: string, url: string) =>
    new Promise<GLTF>((resolve, reject) => {
      loader.load(url, resolve, (e) => {
        if (e.total) {
          progress[key] = e.loaded / e.total;
          if (!disposed) {
            const vals = ['body', 'organs', 'heart', 'skeleton'].map((k) => progress[k] ?? 0);
            cb.onStatus({ kind: 'loading', progress: vals.reduce((a, b) => a + b, 0) / 4 });
          }
        }
      }, (err) => reject(err instanceof Error ? err : new Error('Model download failed')));
    });

  const setMat = (o: THREE.Object3D, m: THREE.Material, tag?: SystemId) => {
    o.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      const old = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      old.forEach((x) => x.dispose());
      mesh.material = m;
      if (!mesh.geometry.getAttribute('normal')) mesh.geometry.computeVertexNormals();
      if (mesh.geometry.getAttribute('color')) mesh.geometry.deleteAttribute('color');
      if (tag) { mesh.userData.system = tag; pickables.push(mesh); }
    });
  };

  const worldCenter = (o: THREE.Object3D) => new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());

  const setup = async () => {
    const [body, organs, heart] = await Promise.all([
      load('body', bodyAssets.body), load('organs', bodyAssets.organs), load('heart', bodyAssets.heart),
    ]);
    if (disposed) {
      [body, organs, heart].forEach((g) => disposeObject(g.scene));
      return;
    }
    // Body shell
    const shell = body.scene;
    setMat(shell, shellMat);
    root.add(shell);
    disposeTargets.push(shell);
    const back = shell.clone(true);
    back.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh) m.material = shellBackMat; });
    root.add(back);
    root.updateMatrixWorld(true);

    // Organs: keep brain and lungs only.
    root.add(organs.scene);
    disposeTargets.push(organs.scene);
    root.updateMatrixWorld(true);
    const nameOf = (o: THREE.Object3D) => `${o.name} ${o.parent?.name ?? ''}`.toLowerCase();
    const keep: { brain?: THREE.Object3D; lungs: THREE.Object3D[] } = { lungs: [] };
    const remove: THREE.Mesh[] = [];
    organs.scene.traverse((c) => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const n = nameOf(m);
      if (n.includes('brain')) keep.brain = m;
      else if (n.includes('lung')) keep.lungs.push(m);
      else remove.push(m);
    });
    remove.forEach((m) => {
      m.geometry.dispose();
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((material) => material.dispose());
      m.removeFromParent();
    });
    if (keep.brain) { setMat(keep.brain, brainMat, 'brain'); brainPivot = pivotize(keep.brain, root); }
    keep.lungs.forEach((l) => { setMat(l, lungMat, 'lungs'); l.renderOrder = 2; lungPivots.push(pivotize(l, root)); });

    // Heart, centered about its own center.
    root.add(heart.scene);
    disposeTargets.push(heart.scene);
    root.updateMatrixWorld(true);
    setMat(heart.scene, heartMat, 'heart');
    heartPivot = pivotize(heart.scene, root);
    heartPivot.traverse((o) => { o.renderOrder = 3; });

    // Systemic immune field sampled from the shell surface.
    const pts: number[] = [];
    shell.updateMatrixWorld(true);
    shell.traverse((c) => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const pos = m.geometry.getAttribute('position');
      const step = Math.max(1, Math.floor(pos.count / 900));
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i += step) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
        v.multiplyScalar(0.97).add(new THREE.Vector3(0, 0, 0).multiplyScalar(0));
        pts.push(v.x * 0.94, v.y, v.z * 0.85);
      }
    });
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const pm = new THREE.PointsMaterial({ color: 0x9fe6d2, size: 0.012, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending });
    ownedMaterials.push(pm);
    immunePoints = new THREE.Points(pg, pm);
    scene.add(immunePoints);

    // Anchors & camera views
    const heartC = worldCenter(heartPivot);
    anchors.heart = heartC;
    views.heart = { target: heartC.clone(), pos: heartC.clone().add(new THREE.Vector3(0.12, 0.05, 0.75)) };
    if (lungPivots.length) {
      const b = new THREE.Box3();
      lungPivots.forEach((p) => b.expandByObject(p));
      const c = b.getCenter(new THREE.Vector3());
      anchors.lungs = new THREE.Vector3(b.max.x - (b.max.x - b.min.x) * 0.18, c.y + 0.04, b.max.z);
      views.lungs = { target: c.clone(), pos: c.clone().add(new THREE.Vector3(0, 0.04, 1.15)) };
    }
    if (brainPivot) { brainPivot.traverse((o) => { o.renderOrder = 2; });
      const c = worldCenter(brainPivot);
      anchors.brain = c.clone().add(new THREE.Vector3(0, 0.03, 0));
      views.brain = { target: c.clone(), pos: c.clone().add(new THREE.Vector3(0.25, 0.08, 0.7)) };
    }
    anchors.immune = new THREE.Vector3(0.12, -0.12, 0.08);
    views.immune = { target: new THREE.Vector3(0, 0.05, 0), pos: new THREE.Vector3(1.4, 0.3, 3.4) };
    anchors.skeletal = new THREE.Vector3(-0.1, -0.5, 0.05);
    views.skeletal = { target: new THREE.Vector3(0, -0.2, 0), pos: new THREE.Vector3(-0.5, 0, 2.6) };
    cb.onStatus({ kind: 'loading', progress: 0.8 });

    // Skeleton (optional; failure is non-fatal).
    let skeletonOk = false;
    try {
      const eco = await load('skeleton', bodyAssets.skeleton);
      if (disposed) { disposeObject(eco.scene); return; }
      const drop: THREE.Mesh[] = [];
      eco.scene.traverse((c) => {
        const m = c as THREE.Mesh;
        if (!m.isMesh) return;
        const v = `${String(m.userData.layer ?? '')} ${m.name}`.toLowerCase();
        if (!(v.includes('skeleton') || v.includes('bone'))) drop.push(m);
      });
      drop.forEach((m) => {
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
        m.removeFromParent();
      });
      setMat(eco.scene, boneMat, 'skeletal');
      const b = new THREE.Box3().setFromObject(eco.scene);
      const size = b.getSize(new THREE.Vector3());
      const k = (HEIGHT * 0.98) / (size.y || 1);
      eco.scene.scale.setScalar(k);
      const c = b.getCenter(new THREE.Vector3()).multiplyScalar(k);
      eco.scene.position.set(-c.x, -c.y - HEIGHT * 0.005, -c.z);
      scene.add(eco.scene);
      skeletonRoot = eco.scene;
      disposeTargets.push(eco.scene);
      skeletonOk = true;
    } catch {
      skeletonOk = false;
    }
    if (!disposed) cb.onStatus({ kind: 'ready', skeleton: skeletonOk });
  };

  setup().catch((e: unknown) => {
    if (!disposed) cb.onStatus({ kind: 'error', message: e instanceof Error && e.message ? 'The anatomy models could not be downloaded. Check your connection and retry.' : 'The anatomy models could not be loaded.' });
  });

  // Camera tween
  let tween: { fromP: THREE.Vector3; toP: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3; t: number } | null = null;
  const flyTo = (pos: THREE.Vector3, target: THREE.Vector3) => {
    tween = { fromP: camera.position.clone(), toP: pos.clone(), fromT: controls.target.clone(), toT: target.clone(), t: 0 };
  };
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // Picking
  const raycaster = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let downAt = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => { downAt = { x: e.clientX, y: e.clientY }; };
  const onUp = (e: PointerEvent) => {
    if (disposed || renderingFailed) return;
    if (e.button !== 0 || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) return;
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ptr, camera);
    const hit = raycaster.intersectObjects(pickables.filter((p) => p.visible), false)[0];
    const id = hit?.object.userData.system as SystemId | undefined;
    if (id) cb.onPick(id);
  };
  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointerup', onUp);

  const failRendering = (message: string) => {
    if (disposed || renderingFailed) return;
    renderingFailed = true;
    cancelAnimationFrame(frame);
    Object.values(markers).forEach((el) => { if (el) el.style.opacity = '0'; });
    cb.onStatus({ kind: 'error', message });
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    failRendering('The browser lost its 3D graphics context. Retry to reload the model; demo readings and sources are still available.');
  };
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);

  // Loop
  const clock = new THREE.Clock();
  let heartPhase = 0, lungPhase = 0, slowPhase = 0;
  const proj = new THREE.Vector3();
  const loop = () => {
    if (disposed || renderingFailed) return;
    frame = requestAnimationFrame(loop);
    try {
    const dt = Math.min(clock.getDelta(), 0.1);
    if (!paused) {
      heartPhase = (heartPhase + dt * (bpm / 60)) % 1;
      lungPhase = (lungPhase + dt * (breaths / 60)) % 1;
      slowPhase += dt;
    }
    if (heartPivot) {
      // lub-dub: two quick contractions per beat
      const p = heartPhase;
      const beat = Math.exp(-Math.pow((p - 0.08) / 0.05, 2)) + 0.55 * Math.exp(-Math.pow((p - 0.28) / 0.06, 2));
      heartPivot.scale.setScalar(1 + 0.085 * beat);
      heartMat.emissiveIntensity = (focused === 'heart' ? 0.45 : 0.25) + 0.35 * beat;
    }
    const breath = (1 - Math.cos(lungPhase * Math.PI * 2)) / 2;
    lungPivots.forEach((l) => l.scale.set(1 + 0.04 * breath, 1 + 0.035 * breath, 1 + 0.06 * breath));
    lungMat.opacity = focused === 'lungs' ? 0.82 : 0.55;
    brainMat.emissiveIntensity = (focused === 'brain' ? 0.25 : 0.05) + (focused === 'brain' ? 0.25 : 0.05) * (0.5 + 0.5 * Math.sin(slowPhase * 1.1));
    if (skeletonRoot) {
      boneMat.opacity = focused && focused !== 'skeletal' ? 0.35 : 0.72;
      boneMat.emissiveIntensity = focused === 'skeletal' ? 0.12 + 0.12 * (0.5 + 0.5 * Math.sin(slowPhase * 2.2)) : 0;
    }
    if (immunePoints) {
      const pm = immunePoints.material as THREE.PointsMaterial;
      const base = focused === 'immune' ? 0.55 : 0.12;
      pm.opacity = base * (0.6 + 0.4 * Math.sin(slowPhase * 1.6));
      pm.size = focused === 'immune' ? 0.016 : 0.01;
    }
    shellMat.opacity = focused ? 0.16 : 0.26;
    if (tween) {
      tween.t = Math.min(1, tween.t + dt / 1.1);
      const k = ease(tween.t);
      camera.position.lerpVectors(tween.fromP, tween.toP, k);
      controls.target.lerpVectors(tween.fromT, tween.toT, k);
      if (tween.t >= 1) tween = null;
    }
    controls.update();
    renderer.render(scene, camera);
    // Markers
    const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
    (Object.keys(markers) as SystemId[]).forEach((id) => {
      const el = markers[id];
      const a = anchors[id];
      if (!el) return;
      if (!a) { el.style.opacity = '0'; el.tabIndex = -1; return; }
      proj.copy(a).project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      el.style.transform = `translate3d(${((proj.x + 1) / 2) * w}px, ${((1 - proj.y) / 2) * h}px, 0)`;
      el.style.opacity = vis ? '1' : '0';
      el.style.pointerEvents = vis ? 'auto' : 'none';
      el.tabIndex = vis ? 0 : -1;
      el.setAttribute('aria-hidden', vis ? 'false' : 'true');
    });
    } catch (error) {
      console.error('Anatomy rendering stopped safely', error);
      failRendering('The 3D view could not continue rendering. Retry to reload it; demo readings and sources are still available.');
    }
  };
  loop();

  const ro = new ResizeObserver(() => {
    if (disposed || renderingFailed) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(stage);

  function disposeObject(o: THREE.Object3D) {
    o.traverse((c) => {
      const m = c as THREE.Mesh;
      if (!m.isMesh && !(c as THREE.Points).isPoints) return;
      m.geometry?.dispose();
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x?.dispose());
    });
  }

  return {
    focus(id) {
      focused = id;
      if (!id) flyTo(FULL_POS, FULL_TARGET);
      else { const v = views[id]; if (v) flyTo(v.pos, v.target); }
    },
    setRates(b, r) { bpm = b; breaths = r; },
    setPaused(p) { paused = p; },
    zoom(dir) {
      const off = camera.position.clone().sub(controls.target);
      off.multiplyScalar(dir === 1 ? 0.8 : 1.25);
      const len = THREE.MathUtils.clamp(off.length(), controls.minDistance, controls.maxDistance);
      off.setLength(len);
      flyTo(controls.target.clone().add(off), controls.target.clone());
    },
    bindMarker(id, el) { markers[id] = el; },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      scene.traverse((c) => {
        const m = c as THREE.Mesh;
        if (m.isMesh || (c as THREE.Points).isPoints) m.geometry?.dispose();
      });
      disposeTargets.length = 0;
      ownedMaterials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
