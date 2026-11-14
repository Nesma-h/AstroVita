import { TriangleAlert } from 'lucide-react';
import type { DemoAlert } from '@/data/demoAlerts';

export function DemoAlertNotice({ alert }: { alert: DemoAlert }) {
  return (
    <section className={`demo-alert-notice ${alert.severity}`} role="note"
      data-testid={`card-demo-alert-${alert.systemId}`}>
      <div className="demo-alert-heading">
        <TriangleAlert size={18} aria-hidden="true" />
        <strong>{alert.severity === 'alert' ? 'Demo alert' : 'Demo watch'} · simulation only</strong>
      </div>
      <h3>{alert.title}</h3>
      <p data-testid={`text-demo-alert-reason-${alert.systemId}`}>{alert.explanation}</p>
      <p className="fine" data-testid={`text-demo-alert-trigger-${alert.systemId}`}>
        Trigger: {alert.scenarioLabel} scenario script. No real sensor or check-in value triggered this event.
      </p>
    </section>
  );
}
