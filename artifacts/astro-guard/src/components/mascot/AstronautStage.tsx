import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import { buildAstronaut, createMaterials, disposeObject } from './astronautModel';
import { DEFAULT_MOTION, MOTION_MODES, MotionDriver, nextMotionMode, type MotionMode } from './astronautMotion';

let webglProbe: boolean | null = null;
function hasWebGL(): boolean {
  if (webglProbe !== null) return webglProbe;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    webglProbe = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { webglProbe = false; }
  return webglProbe;
}

type Status = 'ready' | 'unsupported' | 'lost' | 'error';

export default function AstronautStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const driverRef = useRef<MotionDriver | null>(null);
  const [mode, setMode] = useState<MotionMode>(DEFAULT_MOTION);
  const [status, setStatus] = useState<Status>(() => (hasWebGL() ? 'ready' : 'unsupported'));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => { driverRef.current?.setMode(mode); }, [mode]);

  useEffect(() => {
    if (status !== 'ready' || !hostRef.current) return;
    const host = hostRef.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch { setStatus('error'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    const envTex = envTarget.texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.35;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0.4, 0.75, 7.2);
    camera.lookAt(0, 0.35, 0);

    // Warm key / cool rim — sunlit on one side, earthshine on the other
    scene.add(new THREE.HemisphereLight(0x8fb6ff, 0x1a1020, 0.55));
    const key = new THREE.DirectionalLight(0xffc48a, 2.6);
    key.position.set(-3.5, 4, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3; key.shadow.camera.right = 3; key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6fb8ff, 3.2); rim.position.set(3.5, 2, -4); scene.add(rim);
    const fill = new THREE.PointLight(0x9fe6d2, 6, 10, 2); fill.position.set(2.4, -0.8, 2.5); scene.add(fill);

    const mats = createMaterials();
    const rig = buildAstronaut(mats);
    rig.root.traverse((o) => { (o as THREE.Mesh).receiveShadow = true; });
    const holder = new THREE.Group();
    holder.add(rig.root);
    scene.add(holder);

    // Soft glow disc beneath, sells depth without a floor
    const shadowGeo = new THREE.CircleGeometry(1.3, 48);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x6fb8ff, transparent: true, opacity: 0.08, depthWrite: false });
    const disc = new THREE.Mesh(shadowGeo, shadowMat);
    disc.rotation.x = -Math.PI / 2; disc.position.y = -1.75; scene.add(disc);

    const driver = new MotionDriver();
    driver.setMode(mode);
    driver.step(1);
    driverRef.current = driver;

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.8 ? 8.6 : 7.2;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host); resize();

    let raf = 0, last = performance.now(), clock = 0, visible = !document.hidden;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      clock += dt;
      driver.step(dt);
      driver.apply(rig, clock);
      holder.rotation.y = -0.35;
      renderer.render(scene, camera);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      visible = !document.hidden;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    document.addEventListener('visibilitychange', onVis);
    const canvas = renderer.domElement;
    const onLost = (e: Event) => { e.preventDefault(); if (raf) cancelAnimationFrame(raf); raf = 0; setStatus('lost'); };
    canvas.addEventListener('webglcontextlost', onLost);
    if (visible) raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      driverRef.current = null;
      disposeObject(scene);
      shadowGeo.dispose(); shadowMat.dispose();
      envTarget.dispose(); pmrem.dispose();
      key.shadow.dispose();
      disposeObject(roomEnv);
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
    // mode is applied via its own effect; rebuild only on status/attempt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, attempt]);

  const cycle = () => {
    setMode(nextMotionMode);
  };
  const current = MOTION_MODES.find((m) => m.id === mode)!;

  if (status !== 'ready') {
    const msg = status === 'unsupported' ? 'This browser cannot draw 3D graphics (WebGL unavailable).'
      : status === 'lost' ? 'The graphics context was lost, so the astronaut stopped rendering.'
      : 'The 3D astronaut could not start on this device.';
    return (
      <div className="mascot-stage mascot-fallback" role="status" data-testid="status-mascot">
        <p>{msg}</p>
        <div className="mascot-fallback-actions">
          {status !== 'unsupported' && (
            <button type="button" className="mascot-chip" onClick={() => { setStatus('ready'); setAttempt((a) => a + 1); }} data-testid="button-mascot-retry">
              <RotateCcw size={13} /> Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mascot-stage" data-testid="stage-astronaut">
      <div ref={hostRef} className="mascot-canvas" />
      <button type="button" className="mascot-hit" onClick={cycle}
        aria-label={`Astronaut, currently: ${current.label}. Activate to switch to the next move.`} data-testid="button-mascot-cycle" />
      <p className="sr-only" aria-live="polite">{`Now: ${current.label}.`}</p>
    </div>
  );
}
