import { ExternalLink } from 'lucide-react';
import { AnatomyExplorer } from '@/components/AnatomyExplorer';
import { PageFooter } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { anatomyAsset } from '@/data/researchStatus';

export default function ThreeExplorerPage() {
  return (
    <div className="page-content">
      <PageHeader
        index="01"
        title="Anatomy explorer"
        description="Inspect the named skeleton and muscle layers in a separately sourced educational model. The visualization is not connected to astronaut health measurements."
      />
      <div className="notice" style={{ marginBottom: 19 }} data-testid="disclaimer-anatomy-model">
        <strong>Educational visual only.</strong> This third-party asset is not NASA data and is not for clinical use. Skin and internal organs are absent from the source model.
      </div>
      <AnatomyExplorer />
      <div className="data-grid" style={{ marginTop: 23 }}>
        <div>
          <div className="meta-label">ATTRIBUTION</div>
          <p className="body-copy" style={{ fontSize: 10 }}>{anatomyAsset.credit}</p>
        </div>
        <div>
          <div className="meta-label">SOURCE MODEL</div>
          <a className="inline-link" href={anatomyAsset.repositoryUrl} target="_blank" rel="noreferrer" data-testid="link-anatomy-source">{anatomyAsset.name} repository <ExternalLink size={12} style={{ verticalAlign: 'middle', marginLeft: 3 }} /></a>
          <span className="body-copy" style={{ fontSize: 10 }}> · {anatomyAsset.license}</span>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
