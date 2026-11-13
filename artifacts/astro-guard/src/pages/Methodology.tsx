import { ExternalLink } from 'lucide-react';
import { anatomyAsset, challengeContext, challengeSource, datasetStatus } from '@/data/researchStatus';
import { PageFooter } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';

export default function Methodology() {
  return (
    <div className="page-content">
      <PageHeader index="05" title="Methodology & provenance" description="Separate source classes, preserve attribution, and make the limits of this first research build explicit." />
      <div className="data-grid">
        <section>
          <div className="section-kicker">01 / Challenge resource review</div>
          <p className="body-copy">The official challenge Resources tab was reviewed on {challengeSource.reviewedOn}. It displayed “Resources will be available on Friday, November 13.” No downloadable dataset or document was exposed in the page content available to this review.</p>
          <a className="inline-link" href={challengeSource.resourcesUrl} target="_blank" rel="noreferrer" data-testid="link-method-resources">Official Resources tab <ExternalLink size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} /></a>
          <div className="rule" />
          <div className="section-kicker">02 / Qualitative context</div>
          <p className="body-copy">{challengeContext.caveat}</p>
          <a className="inline-link" href={challengeContext.sourceUrl} target="_blank" rel="noreferrer" data-testid="link-method-context">Space Apps-hosted team page <ExternalLink size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} /></a>
          <div className="rule" />
          <div className="section-kicker">03 / Visual asset license</div>
          <p className="body-copy">{anatomyAsset.credit}</p>
          <p className="body-copy">The model is licensed {anatomyAsset.license}. It is a third-party educational visual, not NASA data, and not for clinical use.</p>
          <a className="inline-link" href={anatomyAsset.repositoryUrl} target="_blank" rel="noreferrer" data-testid="link-model-repository">Écorché source repository <ExternalLink size={13} style={{ verticalAlign: 'middle', marginLeft: 3 }} /></a>
        </section>
        <aside>
          <div className="section-kicker">Processing policy</div>
          <div className="source-line"><div><div className="source-title">Challenge observations</div><div className="source-detail">No files available; no processing performed.</div></div></div>
          <div className="source-line"><div><div className="source-title">Original files</div><div className="source-detail">No original challenge data has been downloaded or altered.</div></div></div>
          <div className="source-line"><div><div className="source-title">Display behavior</div><div className="source-detail">The anatomy model is kept separate from challenge data and qualitative context.</div></div></div>
          <div className="rule" />
          <div className="section-kicker">Known limitations</div>
          <p className="body-copy" data-testid="text-model-limitations">{anatomyAsset.limitation}</p>
          <p className="body-copy">Available model layers are skeleton and muscle meshes. Skin and internal organs are not present. No conditions are mapped to anatomy.</p>
          <p className="body-copy">{datasetStatus.message}</p>
        </aside>
      </div>
      <PageFooter />
    </div>
  );
}
