import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Maximize2, Pause, Play, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { createAnatomyEngine, hasWebGL, type AnatomyEngine, type EngineStatus } from '@/components/anatomy/engine';
import {
  DEMO_DISCLAIMER, MODEL_CREDITS, NASA_INDEX, SCENARIOS, SCENARIO_ORDER, SYSTEMS, SYSTEM_ORDER,
  demoReadings, type Readings, type ScenarioId, type SystemId,
} from '@/data/demoHealth';

function readingFor(id: SystemId, r: Readings) {
  switch (id) {
    case 'heart': return { value: String(r.bpm), unit: 'bpm', name: 'Demo heart rate' };
    case 'lungs': return { value: String(r.breaths), unit: 'breaths/min', name: 'Demo breathing rate' };
    case 'brain': return { value: r.sleepHours.toFixed(1), unit: 'h sleep', name: 'Demo sleep last cycle' };
    case 'skeletal': return { value: String(r.exerciseMin), unit: 'min', name: 'Demo exercise today' };
    case 'immune': return { value: r.immuneSample, unit: '', name: 'Demo lab sample status' };
  }
}

export default function Dashboard() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLElement>(null);
  const sourcesButtonRef = useRef<HTMLButtonElement>(null);
  const engineRef = useRef<AnatomyEngine | null>(null);
  const markerEls = useRef<Partial<Record<SystemId, HTMLButtonElement | null>>>({});
  const [status, setStatus] = useState<EngineStatus>({ kind: 'loading', progress: 0 });
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<SystemId | null>(null);
  const [scenario, setScenario] = useState<ScenarioId>('nominal');
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [webgl] = useState(() => typeof document !== 'undefined' && hasWebGL());

  const sc = SCENARIOS[scenario];
  const readings = demoReadings(sc, tick);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !webgl) return;
    setStatus({ kind: 'loading', progress: 0 });
    let engine: AnatomyEngine | null = null;
    try {
      engine = createAnatomyEngine(stage, { onStatus: setStatus, onPick: (id) => setSelected(id) });
    } catch {
      setStatus({ kind: 'error', message: '3D rendering could not start in this browser.' });
      return;
    }
    engineRef.current = engine;
    SYSTEM_ORDER.forEach((id) => engine?.bindMarker(id, markerEls.current[id] ?? null));
    return () => { engine?.dispose(); engineRef.current = null; };
  }, [attempt, webgl]);

  useEffect(() => { engineRef.current?.focus(selected); }, [selected, status.kind]);
  useEffect(() => { engineRef.current?.setRates(readings.bpm, readings.breaths); }, [readings.bpm, readings.breaths, status.kind]);
  useEffect(() => { engineRef.current?.setPaused(paused); }, [paused, status.kind]);
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2000);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (sourcesOpen) setSourcesOpen(false); else setSelected(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sourcesOpen]);

  useEffect(() => {
    if (!sourcesOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const controls = sourcesRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !sourcesRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = previousOverflow;
      sourcesButtonRef.current?.focus();
    };
  }, [sourcesOpen]);

  const info = selected ? SYSTEMS[selected] : null;

  return (
    <div className="dash" data-testid="page-dashboard">
      <header className="dash-top">
        <Link href="/" className="dash-brand" data-testid="link-home">
          <span className="brand-orb" aria-hidden="true" />
          <span>Astro-Guard</span>
        </Link>
        <div className="demo-pill" role="note" data-testid="text-demo-disclaimer">
          <span className="demo-dot" aria-hidden="true" />
          <strong>Local demo</strong><span className="demo-pill-long"> · synthetic values, not NASA readings or sensors, not a diagnosis</span>
        </div>
        <div className="top-actions">
          <div className="seg" role="group" aria-label="Demo scenario" data-testid="control-scenario">
            {SCENARIO_ORDER.map((id) => (
              <button key={id} aria-pressed={scenario === id} className={scenario === id ? 'on' : ''}
                onClick={() => setScenario(id)} data-testid={`button-scenario-${id}`}>
                {SCENARIOS[id].label}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
            aria-label={paused ? 'Resume demo' : 'Pause demo'} data-testid="button-toggle-pause">
            {paused ? <Play size={15} /> : <Pause size={15} />}<span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
          <button ref={sourcesButtonRef} className="icon-btn" onClick={() => setSourcesOpen(true)} data-testid="button-open-sources">
            <BookOpen size={15} /><span>Sources</span>
          </button>
        </div>
      </header>

      <div className="dash-grid">
        <nav className="sys-list" aria-label="Body systems">
          <div className="kicker">Selected HRP contexts</div>
          <p className="sys-note">Five illustrative examples, not a full list and not an individual assessment.</p>
          <ul>
            {SYSTEM_ORDER.map((id, i) => {
              const r = readingFor(id, readings);
              const flag = sc.flags[id];
              return (
                <li key={id}>
                  <button className={`sys-item${selected === id ? ' on' : ''}`} aria-pressed={selected === id}
                    onClick={() => setSelected(selected === id ? null : id)} data-testid={`button-system-${id}`}>
                    <span className="sys-idx">0{i + 1}</span>
                    <span className="sys-name">{SYSTEMS[id].label}<small>{SYSTEMS[id].short}</small></span>
                    <span className="sys-val" data-testid={`text-list-reading-${id}`}>
                      {id === 'immune' ? 'Lab' : r.value}
                      {flag === 'watch' && <i className="flag" title="Scripted demo flag" aria-label="scripted demo flag" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="scenario-blurb" data-testid="text-scenario-blurb">
            <span className="kicker">Scenario</span>
            <AnimatePresence mode="wait">
              <motion.p key={scenario} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                {sc.blurb} {paused ? 'Demo paused.' : 'Values tick every 2 s.'}
              </motion.p>
            </AnimatePresence>
          </div>
        </nav>

        <section className="stage-wrap" aria-label="3D anatomy view">
          <div className="stage" ref={stageRef} data-testid="stage-anatomy">
            {webgl && SYSTEM_ORDER.map((id) => (
              <button key={id} ref={(el) => { markerEls.current[id] = el; engineRef.current?.bindMarker(id, el); }}
                className={`marker${selected === id ? ' on' : ''}${sc.flags[id] === 'watch' ? ' watch' : ''}${id === 'immune' ? ' systemic' : ''}`}
                style={{ opacity: 0 }} onClick={() => setSelected(id)} aria-label={`Inspect ${SYSTEMS[id].label}`}
                tabIndex={-1} data-testid={`marker-${id}`}>
                <span className="marker-ring" /><span className="marker-label">{id === 'immune' ? 'Immune · body-wide' : SYSTEMS[id].label}</span>
              </button>
            ))}
          </div>
          <div className="stage-tools">
            <button className="icon-btn" onClick={() => setSelected(null)} data-testid="button-reset-view"><Maximize2 size={14} /><span>Full body</span></button>
            <button className="icon-btn sq" onClick={() => engineRef.current?.zoom(1)} aria-label="Zoom in" data-testid="button-zoom-in"><ZoomIn size={15} /></button>
            <button className="icon-btn sq" onClick={() => engineRef.current?.zoom(-1)} aria-label="Zoom out" data-testid="button-zoom-out"><ZoomOut size={15} /></button>
          </div>
          <div className="stage-hint">Drag to orbit · scroll to zoom · click a marker</div>
          {!webgl && (
            <div className="stage-overlay" role="alert" data-testid="status-webgl-unavailable">
              <h3>3D view unavailable</h3>
              <p>This browser has WebGL turned off. Use the system list on the left; readings and sources still work.</p>
            </div>
          )}
          {webgl && status.kind === 'loading' && (
            <div className="stage-overlay soft" data-testid="status-model-loading">
              <div className="load-figure" aria-hidden="true" />
              <p>Bringing the body model aboard · {Math.round(status.progress * 100)}%</p>
              <div className="load-bar"><span style={{ transform: `scaleX(${Math.max(0.04, status.progress)})` }} /></div>
            </div>
          )}
          {webgl && status.kind === 'error' && (
            <div className="stage-overlay" role="alert" data-testid="status-model-error">
              <h3>Model not loaded</h3>
              <p>{status.message}</p>
              <button className="icon-btn" onClick={() => setAttempt((a) => a + 1)} data-testid="button-retry-model"><RotateCcw size={14} /><span>Retry</span></button>
            </div>
          )}
          {status.kind === 'ready' && !status.skeleton && (
            <div className="stage-warn" data-testid="status-skeleton-missing">Skeleton model unavailable; other systems still shown.</div>
          )}
        </section>

        <aside className="panel" aria-live="polite" data-testid="panel-system">
          <AnimatePresence mode="wait">
            {info ? (
              <motion.div key={info.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
                <div className="panel-head">
                  <div>
                    <div className="kicker">{info.short}</div>
                    <h2 data-testid="text-panel-title">{info.label}</h2>
                  </div>
                  <button className="icon-btn sq" onClick={() => setSelected(null)} aria-label="Close and show full body" data-testid="button-close-panel"><X size={15} /></button>
                </div>
                {(() => {
                  const r = readingFor(info.id, readings);
                  const flag = sc.flags[info.id];
                  return (
                    <div className="reading">
                      <div className="reading-name">{r.name}</div>
                      <div className={`reading-val${info.id === 'immune' ? ' text' : ''}`}>
                        <motion.span key={r.value} initial={{ opacity: 0.3, y: 4 }} animate={{ opacity: 1, y: 0 }} data-testid={`text-reading-${info.id}`}>{r.value}</motion.span>
                        {r.unit && <small>{r.unit}</small>}
                      </div>
                      <div className={`flag-row ${flag ?? 'none'}`} data-testid={`status-flag-${info.id}`}>
                        {flag === 'watch' ? 'Scripted demo flag: shown for this scenario only' : 'No scripted demo flag in this scenario'}
                      </div>
                      <p className="fine">Flags are part of the demo script, not medical thresholds.</p>
                    </div>
                  );
                })()}
                <div className="block"><div className="kicker">What NASA says</div><p>{info.context}</p>
                  <a href={info.sourceUrl} target="_blank" rel="noreferrer" className="src-link" data-testid={`link-source-${info.id}`}>{info.sourceTitle}<ArrowUpRight size={13} /></a>
                </div>
                <div className="block"><div className="kicker">What this reading can't tell you</div><p data-testid={`text-limit-${info.id}`}>{info.measurementLimit}</p></div>
                <div className="block"><div className="kicker">About the motion</div><p>{info.visualAnimation}</p></div>
              </motion.div>
            ) : (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="kicker">Crew member · demo</div>
                <h2>Full body</h2>
                <p className="lede">Pick a system on the body or in the list. The view will move in close and show its demo reading.</p>
                <div className="mini-grid">
                  {SYSTEM_ORDER.map((id) => {
                    const r = readingFor(id, readings);
                    return (
                      <button key={id} className="mini" onClick={() => setSelected(id)} data-testid={`card-reading-${id}`}>
                        <span className="kicker">{SYSTEMS[id].label}</span>
                        <span className={`mini-val${id === 'immune' ? ' text' : ''}`} data-testid={`text-overview-reading-${id}`}>{r.value} <small>{r.unit}</small></span>
                      </button>
                    );
                  })}
                </div>
                <p className="fine">{DEMO_DISCLAIMER}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      <AnimatePresence>
        {sourcesOpen && (
          <motion.div className="drawer-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSourcesOpen(false)}>
            <motion.aside ref={sourcesRef} className="drawer" role="dialog" aria-modal="true" aria-label="Sources and demo notes"
              initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()} data-testid="drawer-sources">
              <div className="panel-head"><h2>Sources & demo</h2>
                <button className="icon-btn sq" onClick={() => setSourcesOpen(false)} aria-label="Close sources" autoFocus data-testid="button-close-sources"><X size={15} /></button>
              </div>
              <div className="block"><div className="kicker">About the numbers</div><p>{DEMO_DISCLAIMER} Scenarios and flags are scripted for demonstration.</p></div>
              <div className="block"><div className="kicker">NASA Human Research Program</div>
                {NASA_INDEX.map((s, i) => <a key={s.url} className="src-link" href={s.url} target="_blank" rel="noreferrer" data-testid={`link-index-source-${i}`}>{s.title}<ArrowUpRight size={13} /></a>)}
                {SYSTEM_ORDER.map((id) => <a key={id} className="src-link" href={SYSTEMS[id].sourceUrl} target="_blank" rel="noreferrer" data-testid={`link-drawer-source-${id}`}>{SYSTEMS[id].sourceTitle}<ArrowUpRight size={13} /></a>)}
              </div>
              <div className="block"><div className="kicker">Models & imagery</div>
                {MODEL_CREDITS.map((c, i) => (
                  <div key={c.title} className="credit"><strong>{c.title}</strong><p>{c.detail}</p>
                    <a className="src-link" href={c.url} target="_blank" rel="noreferrer" data-testid={`link-model-credit-${i}`}>{c.url.replace('https://', '')}<ArrowUpRight size={13} /></a></div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
