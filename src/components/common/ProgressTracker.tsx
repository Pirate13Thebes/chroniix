import type { ApprovalStep } from '../../types';

const STEP_LABELS: Record<ApprovalStep['step'], string> = {
  submitted: 'Submitted',
  team_lead: 'Team Lead',
  manager: 'Manager',
  hr: 'HR',
};

export function ProgressTracker({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="progress-tracker">
      {steps.map((step) => (
        <div key={step.step} className={`tracker-step tracker-step--${step.state === 'done' ? 'done' : step.state === 'in_progress' ? 'current' : 'upcoming'}`}>
          <div className="tracker-connector" />
          <div className="tracker-step-dot">{step.state === 'done' ? '✓' : ''}</div>
          <div className="tracker-step-label">{STEP_LABELS[step.step]}</div>
          {step.date && <div className="tracker-step-date">{step.date}</div>}
        </div>
      ))}
    </div>
  );
}
