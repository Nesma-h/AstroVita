import { ExternalLink } from 'lucide-react';
import { challengeContext, challengeSource } from '@/data/researchStatus';
import { PageFooter } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';

const contextDescriptions = [
  'Included in the qualitative challenge description; no measurements or individual exposure data are available here.',
  'Named as a long-duration mission condition in the qualitative challenge context; no personal or mission-specific values are available.',
  'Described as challenge context only; no measured gravity exposure or linked health observations are available.',
  'A qualitative condition in the reproduced challenge description; no environmental telemetry is available.',
];

export default function Monitoring() {
  return (
    <div className="page-content">
      <PageHeader index="02" title="Monitoring context" description="A qualitative map of conditions named in the challenge description. This page contains no astronaut measurements, live telemetry, or clinical interpretation." />
      <div className="notice" data-testid="disclaimer-no-measurements"><strong>No measurements are displayed.</strong> This is not an operational monitoring console. The challenge dataset is unavailable, and no individual status, thresholds, alerting, or recommendations can be derived.</div>
      <div className="data-grid" style={{ marginTop: 40 }}>
        <section>
          <div className="section-kicker">Conditions named in source context</div>
          <div className="condition-list" style={{ marginTop: 15 }}>
            {challengeContext.conditions.map((condition, index) => (
              <div className="condition-row" key={condition} data-testid={`condition-row-${index + 1}`}>
                <div className="condition-index">0{index + 1}</div>
                <div><div className="condition-name">{condition}</div><div className="condition-description">{contextDescriptions[index]}</div></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <div className="section-kicker">Possible effects mentioned</div>
            <p className="body-copy" style={{ marginTop: 9 }}>{challengeContext.possibleEffects.join(' · ')}. These are listed in the cited qualitative context only; no outcomes, rates, or causal relationships are measured here.</p>
          </div>
        </section>
        <aside>
          <div className="empty-instrument">
            <div className="empty-mark"><span className="mono" style={{ fontSize: 12 }}>—</span></div>
            <h2 className="empty-title">No mission signals</h2>
            <p className="empty-copy">No health measurements, environmental telemetry, or time series are supplied for this workspace. No readings have been simulated.</p>
            <div className="empty-state-label">Qualitative context only</div>
          </div>
          <div className="meta-label" style={{ marginTop: 22 }}>SOURCE CLASSIFICATION</div>
          <p className="body-copy" style={{ fontSize: 11 }}>{challengeContext.caveat}</p>
          <a className="inline-link" href={challengeContext.sourceUrl} target="_blank" rel="noreferrer" data-testid="link-team-context">View reproduced challenge context <ExternalLink size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} /></a>
        </aside>
      </div>
      <div className="rule" />
      <div className="meta-label">REVIEWED {challengeSource.reviewedOn}</div>
      <p className="body-copy" style={{ maxWidth: 650 }}>Conditions are not mapped to structures in the anatomy model. No documented relationship or measurement data is available to support such a mapping.</p>
      <PageFooter />
    </div>
  );
}
