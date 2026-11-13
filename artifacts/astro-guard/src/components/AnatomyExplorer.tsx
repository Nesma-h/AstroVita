import { useEffect, useRef, useState } from 'react';
import { Box, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { anatomyAsset } from '@/data/researchStatus';

type Layer = 'skeleton' | 'deep muscles' | 'superficial muscles';
const layerNames: Layer[] = ['skeleton', 'deep muscles', 'superficial muscles'];
const layerLabels: Record<Layer, string> = {
  skeleton: 'Skeleton',
  'deep muscles': 'Deep muscles',
  'superficial muscles': 'Superficial muscles',
};

function classifyLayer(layerValue: unknown, meshName: string): Layer | null {
  const value = `${String(layerValue ?? '')} ${meshName}`.toLowerCase().replace(/[_-]/g, ' ');
  if (value.includes('skeleton') || value.includes('bone')) return 'skeleton';
  if (value.includes('deep muscle') || value.includes('deepmuscle')) return 'deep muscles';
  if (value.includes('superficial muscle') || value.includes('superficialmuscle')) return 'superficial muscles';
  return null;
}

export function AnatomyExplorer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneApi = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    meshes: THREE.Mesh[];
    initialPosition: THREE.Vector3;
    initialTarget: THREE.Vector3;
    selected: THREE.Mesh | null;
    originalMaterial: THREE.Material | THREE.Material[] | null;
    selectedMaterial: THREE.Material | null;
    frame: number;
  } | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Record<Layer, boolean>>({
    skeleton: true,
    'deep muscles': true,
    'superficial muscles': true,
  });
  const [selectedName, setSelectedName] = useState('');
  const [modelState, setModelState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [modelError, setModelError] = useState('');
  const [meshCount, setMeshCount] = useState(0);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e8eff1');
    const camera = new THREE.PerspectiveCamera(35, stage.clientWidth / Math.max(stage.clientHeight, 1), 0.1, 200);
    camera.position.set(0, 0.2, 5.8);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setModelError('3D rendering is unavailable in this browser. Enable WebGL or use a browser with WebGL support to explore the model.');
      setModelState('error');
      return () => {
        disposed = true;
        sceneApi.current = null;
      };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute('aria-label', 'Interactive Écorché anatomy model. Drag to orbit, scroll to zoom, and select a named mesh.');
    renderer.domElement.setAttribute('role', 'img');
    stage.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xf5fbfa, 0x82939a, 2.05));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xc4dcdf, 1.25);
    fillLight.position.set(-4, 1, -3);
    scene.add(fillLight);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.1;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const api = {
      scene, camera, renderer, controls, raycaster, pointer, meshes: [] as THREE.Mesh[],
      initialPosition: new THREE.Vector3(0, 0.2, 5.8),
      initialTarget: new THREE.Vector3(0, 0, 0),
      selected: null as THREE.Mesh | null,
      originalMaterial: null as THREE.Material | THREE.Material[] | null,
      selectedMaterial: null as THREE.Material | null,
      frame: 0,
    };
    sceneApi.current = api;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      anatomyAsset.modelUrl,
      (gltf) => {
        if (disposed) return;
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        root.position.sub(center);
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        root.scale.setScalar(3.25 / maxDimension);
        root.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          const layer = classifyLayer(mesh.userData.layer, mesh.name);
          if (layer) {
            mesh.userData.astroGuardLayer = layer;
            api.meshes.push(mesh);
          }
        });
        scene.add(root);
        const fitted = new THREE.Box3().setFromObject(root);
        const fittedSize = fitted.getSize(new THREE.Vector3());
        camera.position.set(0, fittedSize.y * 0.05, Math.max(fittedSize.x, fittedSize.y, fittedSize.z) * 1.9);
        camera.near = Math.max(fittedSize.x, fittedSize.y, fittedSize.z) / 100;
        camera.far = Math.max(fittedSize.x, fittedSize.y, fittedSize.z) * 30;
        camera.updateProjectionMatrix();
        api.initialPosition.copy(camera.position);
        api.initialTarget.set(0, 0, 0);
        controls.target.copy(api.initialTarget);
        controls.update();
        setMeshCount(api.meshes.length);
        setModelState('ready');
      },
      undefined,
      () => {
        if (!disposed) {
          setModelError('The attributed model could not be downloaded from its public source repository. Check network access and retry.');
          setModelState('error');
        }
      },
    );
    const animate = () => {
      if (disposed) return;
      api.frame = window.requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    const resizeObserver = new ResizeObserver(() => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(stage);
    const selectMesh = (event: PointerEvent) => {
      if (event.button !== 0 || !renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(api.meshes, false)[0]?.object as THREE.Mesh | undefined;
      if (api.selected && api.originalMaterial) api.selected.material = api.originalMaterial;
      api.selected = hit ?? null;
      api.originalMaterial = hit?.material ?? null;
      if (hit) {
        const base = Array.isArray(hit.material) ? hit.material[0] : hit.material;
        if (base instanceof THREE.MeshStandardMaterial || base instanceof THREE.MeshPhongMaterial || base instanceof THREE.MeshLambertMaterial) {
          const highlight = base.clone();
          highlight.color = base.color.clone().lerp(new THREE.Color('#68b8b0'), 0.52);
          if ('emissive' in highlight) {
            const emissiveMaterial = highlight as THREE.MeshStandardMaterial | THREE.MeshPhongMaterial;
            emissiveMaterial.emissive = new THREE.Color('#244e4d');
            emissiveMaterial.emissiveIntensity = 0.3;
          }
          api.selectedMaterial = highlight;
          hit.material = highlight;
        }
        setSelectedName(String(hit.userData.name || hit.name || 'Unnamed mesh'));
      } else {
        setSelectedName('');
      }
    };
    renderer.domElement.addEventListener('pointerup', selectMesh);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(api.frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerup', selectMesh);
      controls.dispose();
      if (api.selected && api.originalMaterial) api.selected.material = api.originalMaterial;
      api.selectedMaterial?.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      sceneApi.current = null;
    };
  }, [loadAttempt]);

  useEffect(() => {
    const api = sceneApi.current;
    if (!api) return;
    api.meshes.forEach((mesh) => {
      const layer = mesh.userData.astroGuardLayer as Layer;
      mesh.visible = visibleLayers[layer];
    });
    if (api.selected && !api.selected.visible) {
      if (api.originalMaterial) api.selected.material = api.originalMaterial;
      api.selected = null;
      api.originalMaterial = null;
      api.selectedMaterial?.dispose();
      api.selectedMaterial = null;
      setSelectedName('');
    }
  }, [visibleLayers]);

  const setLayer = (layer: Layer, checked: boolean) => {
    setVisibleLayers((current) => ({ ...current, [layer]: checked }));
  };
  const resetCamera = () => {
    const api = sceneApi.current;
    if (!api) return;
    api.camera.position.copy(api.initialPosition);
    api.controls.target.copy(api.initialTarget);
    api.controls.update();
  };
  const changeZoom = (direction: -1 | 1) => {
    const api = sceneApi.current;
    if (!api) return;
    api.camera.position.multiplyScalar(direction === 1 ? 0.82 : 1.22);
    api.camera.position.clampLength(api.controls.minDistance, api.controls.maxDistance);
    api.controls.update();
  };

  return (
    <div className="anatomy-layout" data-testid="anatomy-explorer">
      <div className="model-stage" ref={stageRef}>
        <div className="model-stamp">ÉCORCHÉ / INTERACTIVE STRUCTURE VIEW</div>
        <div className="model-actions">
          <button className="control-button" onClick={resetCamera} aria-label="Reset model view" data-testid="button-reset-view"><RotateCcw /> Reset</button>
          <button className="control-button" onClick={() => changeZoom(1)} aria-label="Zoom in" data-testid="button-zoom-in"><ZoomIn /></button>
          <button className="control-button" onClick={() => changeZoom(-1)} aria-label="Zoom out" data-testid="button-zoom-out"><ZoomOut /></button>
        </div>
        {modelState === 'loading' && <div className="model-loading" data-testid="status-model-loading">Loading attributed model…</div>}
        {modelState === 'error' && <div className="model-loading error" role="alert" data-testid="status-model-error"><div>{modelError || 'The attributed model could not be loaded.'}<br /><button className="control-button" style={{ marginTop: 16 }} onClick={() => { setModelError(''); setModelState('loading'); setLoadAttempt((attempt) => attempt + 1); }} data-testid="button-retry-model">Retry model load</button></div></div>}
        <div className="model-controls-hint">DRAG TO ORBIT <span aria-hidden="true">·</span> SCROLL TO ZOOM <span aria-hidden="true">·</span> CLICK A MESH TO INSPECT</div>
      </div>
      <aside className="model-sidebar">
        <div className="panel-subtitle">Layer controls</div>
        <h2 className="panel-heading">Anatomy</h2>
        <div className="layer-list">
          {layerNames.map((layer) => (
            <label className="layer-option" key={layer} data-testid={`layer-control-${layer.replaceAll(' ', '-')}`}>
              <input type="checkbox" checked={visibleLayers[layer]} onChange={(event) => setLayer(layer, event.target.checked)} aria-label={`Show ${layerLabels[layer]} layer`} />
              <span>{layerLabels[layer]}</span>
            </label>
          ))}
        </div>
        <div className="panel-subtitle">Not in source model</div>
        {anatomyAsset.unavailableLayers.map((layer) => (
          <div className="unavailable-layer" key={layer} data-testid={`unavailable-layer-${layer.toLowerCase().replace(' ', '-')}`}><span>{layer}</span><span>Unavailable</span></div>
        ))}
        <div className="structure-info" aria-live="polite">
          <div className="panel-subtitle">Selected structure</div>
          {selectedName ? (
            <>
              <div className="structure-name" data-testid="text-selected-structure">{selectedName}</div>
              <p className="structure-placeholder">Name as provided by the source mesh. No health relationship is inferred.</p>
            </>
          ) : (
            <p className="structure-placeholder" data-testid="text-structure-prompt">Select a visible named mesh to inspect its source label. {modelState === 'ready' ? `${meshCount} named layer meshes loaded.` : 'Structure names will appear when the model is available.'}</p>
          )}
        </div>
        <div className="rule" />
        <div className="panel-subtitle">Asset scope</div>
        <p className="structure-placeholder" data-testid="text-model-scope">{anatomyAsset.limitation} This third-party educational visual is not NASA data.</p>
        <p className="structure-placeholder" style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'center' }}><Box size={13} /> CC BY-SA 4.0 · attribution in Methodology</p>
      </aside>
    </div>
  );
}
