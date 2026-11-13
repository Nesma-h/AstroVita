import { ArrowRight, CircleHelp } from 'lucide-react';
import { Link } from 'wouter';
import { datasetStatus } from '@/data/researchStatus';
import { PageFooter } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';

export default function Analysis() {
  return (
    <div className="page-content">
      <PageHeader index="04" title="Analysis, on hold." description="Quantitative analysis requires observations, a schema, units, and documented methods. None are available from the challenge Resources tab at this review." />
      <div className="empty-instrument" data-testid="empty-analysis-state">
        <div className="empty-mark"><CircleHelp aria-hidden="true" /></div>
        <div className="section-kicker">Analysis status / not computable</div>
        <h2 className="empty-title" style={{ marginTop: 9 }}>There are no observations to analyze.</h2>
        <p className="empty-copy">{datasetStatus.message} Without source data, metrics, summaries, correlations, or charts would be invented rather than computed.</p>
        <div className="empty-state-label">Quantitative outputs withheld</div>
      </div>
      <div className="data-grid" style={{ marginTop: 42 }}>
        <section>
          <div className="section-kicker">What is unavailable</div>
          <div className="source-line"><div><div className="source-title">Record counts and field names</div><div className="source-detail">No challenge file or schema is exposed.</div></div><span className="source-tag">Not reported</span></div>
          <div className="source-line"><div><div className="source-title">Types, units, and missingness</div><div className="source-detail">No variables or observations can be profiled.</div></div><span className="source-tag">Not assessed</span></div>
          <div className="source-line"><div><div className="source-title">Distributions and correlations</div><div className="source-detail">No measurements or documented relationships are available.</div></div><span className="source-tag">Not computed</span></div>
        </section>
        <section>
          <div className="section-kicker">Analysis boundary</div>
          <h2 className="section-heading" style={{ marginTop: 10 }}>Context is not evidence.</h2>
          <p className="body-copy">Qualitative challenge conditions can frame the problem, but they do not support an individual risk score, thresholds, health recommendations, or a condition-to-anatomy mapping.</p>
          <Link href="/data-explorer" className="action-link" style={{ marginTop: 9 }} data-testid="link-analysis-data">Review data availability <ArrowRight /></Link>
        </section>
      </div>
      <PageFooter />
    </div>
  );
}
