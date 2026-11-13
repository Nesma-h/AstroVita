import type { ReactNode } from 'react';

export function PageHeader({
  index,
  title,
  description,
  aside,
}: {
  index: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="title-row fade-in">
      <div>
        <div className="eyebrow">ASTRO-GUARD / RESEARCH NOTE {index}</div>
        <h1 className="page-title" data-testid={`heading-page-${index}`}>{title}</h1>
        <p className="page-lede" data-testid={`text-page-description-${index}`}>{description}</p>
      </div>
      {aside && <div className="title-aside">{aside}</div>}
    </div>
  );
}
