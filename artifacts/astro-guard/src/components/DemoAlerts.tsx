import { ArrowRight, Info, ShieldAlert, TriangleAlert } from 'lucide-react';
import type { DemoAlert } from '@/data/demoAlerts';
import type { Scenario } from '@/data/demoHealth';

export function DemoAlertBanner({ scenario, alerts, checkInMode, onInspectNext }: {
  scenario: Scenario;
  alerts: DemoAlert[];
  checkInMode: boolean;
  onInspectNext: () => void;
}) {
  const severity = alerts.some(a => a.severity === 'alert') ? 'alert' : alerts.length ? 'watch' : 'none';
  return (
    <section className={`simulation-banner ${checkInMode ? 'checkin' : severity}`}
      role="status" aria-live="polite" aria-atomic="true" data-testid="status-simulation">
      {checkInMode ? <Info size={20} aria-hidden="true" /> : <ShieldAlert size={20} aria-hidden="true" />}
      <div className="simulation-copy">
        <strong data-testid="text-simulation-status">
          {checkInMode ? 'Check-in · simulation alerts off'
            : alerts.length ? `Simulation only · ${alerts.length} demo ${severity === 'alert' ? 'alerts' : 'watches'}`
              : 'Simulation only · no scripted alerts'}
        </strong>
        <p data-testid="text-simulation-boundary">{checkInMode
          ? 'Your entries are not assessed by demo rules or NASA medical thresholds.'
          : `${scenario.label}: ${alerts.length ? scenario.blurb : 'Choose Alert drill to simulate events on all five systems.'} Not a medical assessment.`}</p>
      </div>
      {!checkInMode && alerts.length > 0 && (
        <button className="icon-btn" onClick={onInspectNext} data-testid="button-inspect-next-alert">
          Inspect next demo event <ArrowRight size={14} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

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
