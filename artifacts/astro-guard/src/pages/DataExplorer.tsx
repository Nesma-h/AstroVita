import { ArrowUpRight, Database, FileText } from 'lucide-react';
import { challengeSource, datasetStatus } from '@/data/researchStatus';
import { PageFooter } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';

export default function DataExplorer() {
  return (
    <div className="page-content">
      <PageHeader
        index="03"
        title="Data Explorer"
        description="A provenance-first inventory of the materials reviewed for this build. There is no challenge dataset to browse or download at this time."
        aside={<span className="source-tag">0 files available</span>}
      />
      <div className="empty-instrument" data-testid="empty-dataset-state">
        <div className="empty-mark"><Database aria-hidden="true" /></div>
        <div className="section-kicker">Dataset status / not available</div>
        <h2 className="empty-title" style={{ marginTop: 9 }}>The source file has not arrived.</h2>
        <p className="empty-copy">{datasetStatus.message} No table, chart, record count, or schema is shown because none can be verified.</p>
        <div className="empty-state-label">Availability notice: <span className="availability-date">{challengeSource.reviewedOn}</span></div>
        <p className="body-copy" style={{ fontSize: 11, marginTop: 20 }}>The Resources tab currently displays “Resources will be available on Friday, November 13.”</p>
        <a className="action-link" href={challengeSource.resourcesUrl} target="_blank" rel="noreferrer" data-testid="link-recheck-resources">Recheck official Resources tab <ArrowUpRight aria-hidden="true" /></a>
      </div>
      <div className="data-grid" style={{ marginTop: 42 }}>
        <section>
          <div className="section-kicker">Reviewed source inventory</div>
          <div className="source-line" data-testid="inventory-row-challenge">
            <div><div className="source-title">Official challenge Resources tab</div><div className="source-detail">No downloadable challenge data or document exposed in the page content reviewed.</div></div>
            <span className="source-tag">Unavailable</span>
          </div>
          <div className="source-line" data-testid="inventory-row-context">
            <div><div className="source-title">Challenge description excerpt</div><div className="source-detail">Space Apps-hosted 11:11 team page; surrounding content is user-generated, qualitative context only.</div></div>
            <span className="source-tag">Context</span>
          </div>
          <div className="source-line" data-testid="inventory-row-visual">
            <div><div className="source-title">Écorché anatomy model</div><div className="source-detail">Separate third-party educational visualization. Not a NASA dataset.</div></div>
            <span className="source-tag">Visual only</span>
          </div>
        </section>
        <section>
          <div className="section-kicker">Unavailable by design</div>
          <h2 className="section-heading" style={{ marginTop: 10 }}>No fabricated rows.</h2>
          <p className="body-copy">There are no observations from which to report fields, types, units, missingness, distributions, or relationships. Astro-Guard creates no simulated astronaut data to fill that gap.</p>
          <div className="rule" />
          <a className="inline-link" href={challengeSource.url} target="_blank" rel="noreferrer" data-testid="link-official-challenge"><FileText size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />Official challenge page <ArrowUpRight size={12} style={{ verticalAlign: 'middle' }} /></a>
        </section>
      </div>
      <PageFooter />
    </div>
  );
}
