import { ArrowRight, Database, Dna, ExternalLink, FileSearch } from 'lucide-react';
import { Link } from 'wouter';
import { challengeSource, datasetStatus, anatomyAsset } from '@/data/researchStatus';
import { PageFooter } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';

export default function Overview() {
  return (
    <div className="page-content">
      <PageHeader
        index="00"
        title="A clearer view of the evidence."
        description="AstroVita is a research-first exploration of astronaut health monitoring. It separates verified challenge context from an anatomical learning model—and makes the current data gap visible."
        aside={<div className="meta-label">MISSION CONTEXT<br /><span style={{ color: '#435c69', lineHeight: 2 }}>SPACE APPS CHALLENGE / 2026</span></div>}
      />
      <div className="notice fade-in" data-testid="status-dataset-unavailable">
        <strong>Research status · dataset not available.</strong> {datasetStatus.message} The official Resources tab currently says resources will be available on {challengeSource.reviewedOn}.
      </div>
      <div className="data-grid" style={{ marginTop: 38 }}>
        <section>
          <div className="section-kicker">01 / Project scope</div>
          <h2 className="section-heading" style={{ marginTop: 10 }}>Built for careful exploration, not diagnosis.</h2>
          <p className="body-copy">This interface brings together the challenge’s qualitative mission context, a separately sourced interactive anatomy visualization, and a transparent account of what cannot yet be analyzed. It does not receive live NASA telemetry or provide medical advice.</p>
          <div className="rule" />
          <div className="section-kicker">02 / Verified source status</div>
          <div className="source-line" data-testid="source-status-official">
            <div>
              <div className="source-title">Official challenge resources</div>
              <div className="source-detail">No downloadable dataset or document is exposed in the reviewed page content.</div>
            </div>
            <span className="source-tag">Unavailable</span>
          </div>
          <a className="action-link" href={challengeSource.resourcesUrl} target="_blank" rel="noreferrer" data-testid="link-official-resources">
            Check the Resources tab <ExternalLink aria-hidden="true" />
          </a>
        </section>
        <section>
          <div className="section-kicker">03 / Explore the workspace</div>
          <div className="source-line">
            <div>
              <div className="source-title">Anatomy, separately sourced</div>
              <div className="source-detail">{anatomyAsset.name} · educational visual · {anatomyAsset.license}</div>
            </div>
            <Dna size={18} color="#54898b" />
          </div>
          <Link href="/3d-explorer" className="action-link" data-testid="link-explore-anatomy">Open 3D Explorer <ArrowRight /></Link>
          <div className="source-line" style={{ marginTop: 22 }}>
            <div>
              <div className="source-title">No measurements to profile</div>
              <div className="source-detail">Schema, units, records, and missingness cannot be assessed yet.</div>
            </div>
            <Database size={18} color="#54898b" />
          </div>
          <Link href="/data-explorer" className="action-link" data-testid="link-open-data-explorer">View source inventory <ArrowRight /></Link>
        </section>
      </div>
      <div className="rule" style={{ marginTop: 42 }} />
      <div className="data-grid">
        <div>
          <div className="section-kicker">A note on interpretation</div>
          <p className="body-copy" data-testid="text-qualitative-scope">Challenge conditions and possible effects are qualitative context reproduced on a Space Apps-hosted team page. That content is labeled user-generated; it is not a dataset, clinical guidance, or evidence for individual risk.</p>
        </div>
        <div>
          <div className="section-kicker">What comes next</div>
          <p className="body-copy">Revisit the official Resources tab when it is populated. Analysis can begin only after official files and their documentation are available for inspection.</p>
          <Link href="/methodology" className="inline-link" data-testid="link-methodology">Read the methodology <FileSearch size={13} style={{ verticalAlign: 'middle', marginLeft: 4 }} /></Link>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
