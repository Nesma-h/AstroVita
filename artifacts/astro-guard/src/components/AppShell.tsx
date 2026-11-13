import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity,
  BookOpen,
  Database,
  Dna,
  FileText,
  FlaskConical,
  Orbit,
} from 'lucide-react';
import { challengeSource } from '@/data/researchStatus';

const navigation = [
  { href: '/overview', label: 'Overview', icon: Orbit },
  { href: '/3d-explorer', label: '3D Explorer', icon: Dna },
  { href: '/monitoring', label: 'Monitoring context', icon: Activity },
  { href: '/data-explorer', label: 'Data Explorer', icon: Database },
  { href: '/analysis', label: 'Analysis', icon: FlaskConical },
  { href: '/methodology', label: 'Methodology', icon: BookOpen },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const current = navigation.find((item) => item.href === location);
  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><Orbit size={19} strokeWidth={1.5} /></div>
          <div>
            <div className="brand-name">ASTROVITA</div>
            <div className="brand-sub">RESEARCH INTERFACE / 01</div>
          </div>
        </div>
        <div className="nav-caption">Workspace</div>
        <nav className="nav-stack" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={`nav-item${location === href ? ' active' : ''}`}
              aria-current={location === href ? 'page' : undefined}
              data-testid={`link-${href.slice(1)}`}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="rail-status"><span className="status-dot" />Research status</div>
          <div className="rail-note">No challenge dataset is exposed by the official Resources tab as of {challengeSource.reviewedOn}.</div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>AstroVita</span><span>/</span><strong>{current?.label ?? 'Overview'}</strong></div>
          <div className="top-meta">
            <span className="live-mark"><span className="status-dot" />STATIC RESEARCH BUILD</span>
            <span>REV. 01</span>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

export function PageFooter() {
  return <footer className="footer-note" data-testid="text-source-review-footer"><FileText size={12} style={{ verticalAlign: 'middle', marginRight: 7 }} />SOURCE REVIEW: NOV 13, 2026 <span aria-hidden="true"> · </span> NO LIVE TELEMETRY OR CLINICAL ASSESSMENT</footer>;
}
