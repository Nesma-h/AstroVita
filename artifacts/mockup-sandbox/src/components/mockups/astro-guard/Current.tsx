import { Activity, ArrowRight, BookOpen, Database, Dna, ExternalLink, FileSearch, FileText, FlaskConical, Orbit } from 'lucide-react';
import type { ReactNode } from 'react';
import './_group.css';

function Link({ children, ...props }: { children: ReactNode; href: string; className?: string; 'data-testid'?: string }) {
  return <a {...props} onClick={(event) => event.preventDefault()}>{children}</a>;
}

const navigation = [
  { href: '/overview', label: 'Overview', icon: Orbit },
  { href: '/3d-explorer', label: '3D Explorer', icon: Dna },
  { href: '/monitoring', label: 'Monitoring context', icon: Activity },
  { href: '/data-explorer', label: 'Data Explorer', icon: Database },
  { href: '/analysis', label: 'Analysis', icon: FlaskConical },
  { href: '/methodology', label: 'Methodology', icon: BookOpen },
];

// Extracted from the existing Overview and AppShell before the requested redesign.
export function Current() {
  return (
    <div className="app-shell astro-guard-current">
      <aside className="side-rail">
        <div className="brand-lockup">
          <div className="brand-mark"><Orbit size={19} strokeWidth={1.5} /></div>
          <div><div className="brand-name">ASTRO-GUARD</div><div className="brand-sub">RESEARCH INTERFACE / 01</div></div>
        </div>
        <div className="nav-caption">Workspace</div>
        <nav className="nav-stack" aria-label="Current navigation">
          {navigation.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={`nav-item${href === '/overview' ? ' active' : ''}`}><Icon /><span>{label}</span></Link>)}
        </nav>
        <div className="rail-bottom"><div className="rail-status"><span className="status-dot" />Research status</div><div className="rail-note">No challenge dataset is exposed by the official Resources tab as of November 13, 2026.</div></div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>Astro-Guard</span><span>/</span><strong>Overview</strong></div>
          <div className="top-meta"><span className="live-mark"><span className="status-dot" />STATIC RESEARCH BUILD</span><span>REV. 01</span></div>
        </header>
        <main className="page-content">
          <div className="title-row fade-in">
            <div><div className="eyebrow">ASTRO-GUARD / RESEARCH NOTE 00</div><h1 className="page-title">A clearer view of the evidence.</h1><p className="page-lede">Astro-Guard is a research-first exploration of astronaut health monitoring. It separates verified challenge context from an anatomical learning model—and makes the current data gap visible.</p></div>
            <div className="title-aside"><div className="meta-label">MISSION CONTEXT<br /><span style={{ color: '#435c69', lineHeight: 2 }}>SPACE APPS CHALLENGE / 2026</span></div></div>
          </div>
          <div className="notice fade-in"><strong>Research status · dataset not available.</strong> No official challenge dataset is currently exposed by the Resources tab. Measurements, units, missingness, and analysis are unavailable. The official Resources tab currently says resources will be available on November 13, 2026.</div>
          <div className="data-grid" style={{ marginTop: 38 }}>
            <section>
              <div className="section-kicker">01 / Project scope</div>
              <h2 className="section-heading" style={{ marginTop: 10 }}>Built for careful exploration, not diagnosis.</h2>
              <p className="body-copy">This interface brings together the challenge’s qualitative mission context, a separately sourced interactive anatomy visualization, and a transparent account of what cannot yet be analyzed. It does not receive live NASA telemetry or provide medical advice.</p>
              <div className="rule" />
              <div className="section-kicker">02 / Verified source status</div>
              <div className="source-line"><div><div className="source-title">Official challenge resources</div><div className="source-detail">No downloadable dataset or document is exposed in the reviewed page content.</div></div><span className="source-tag">Unavailable</span></div>
              <Link className="action-link" href="#resources">Check the Resources tab <ExternalLink /></Link>
            </section>
            <section>
              <div className="section-kicker">03 / Explore the workspace</div>
              <div className="source-line"><div><div className="source-title">Anatomy, separately sourced</div><div className="source-detail">Écorché · educational visual · CC BY-SA 4.0</div></div><Dna size={18} color="#54898b" /></div>
              <Link href="/3d-explorer" className="action-link">Open 3D Explorer <ArrowRight /></Link>
              <div className="source-line" style={{ marginTop: 22 }}><div><div className="source-title">No measurements to profile</div><div className="source-detail">Schema, units, records, and missingness cannot be assessed yet.</div></div><Database size={18} color="#54898b" /></div>
              <Link href="/data-explorer" className="action-link">View source inventory <ArrowRight /></Link>
            </section>
          </div>
          <div className="rule" style={{ marginTop: 42 }} />
          <div className="data-grid">
            <div><div className="section-kicker">A note on interpretation</div><p className="body-copy">Challenge conditions and possible effects are qualitative context reproduced on a Space Apps-hosted team page. That content is labeled user-generated; it is not a dataset, clinical guidance, or evidence for individual risk.</p></div>
            <div><div className="section-kicker">What comes next</div><p className="body-copy">Revisit the official Resources tab when it is populated. Analysis can begin only after official files and their documentation are available for inspection.</p><Link href="/methodology" className="inline-link">Read the methodology <FileSearch size={13} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></Link></div>
          </div>
          <footer className="footer-note"><FileText size={12} style={{ verticalAlign: 'middle', marginRight: 7 }} />SOURCE REVIEW: NOV 13, 2026 · NO LIVE TELEMETRY OR CLINICAL ASSESSMENT</footer>
        </main>
      </div>
    </div>
  );
}
