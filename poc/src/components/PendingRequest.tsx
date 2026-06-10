import { useDemoStore, getCurrentStep } from '../state/store';
import type { ActorId } from '../types';

type Props = { actor: ActorId; title: string };

export function PendingRequest({ actor, title }: Props) {
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const processing = useDemoStore((s) => s.processing);
  const advanceScenario = useDemoStore((s) => s.advanceScenario);

  const step = getCurrentStep(scenarioId, stepNum);
  const isMyTurn = step?.actor === actor;

  if (!isMyTurn || !step?.pendingTitle) {
    return (
      <div className="card pending-empty">
        <div className="card-title">{title}</div>
        <div className="faint" style={{ fontSize: 13 }}>No pending items.</div>
      </div>
    );
  }

  return (
    <div className="card pending-card">
      <div className="card-title">{title}</div>
      <div className="pending-item">
        <div className="pending-item-meta">Just now</div>
        <div className="pending-item-title">{step.pendingTitle}</div>
        <div className="pending-item-body">{step.pendingBody}</div>
        <div style={{ marginTop: 12 }}>
          <button
            className="btn btn-primary scenario-target"
            data-step-target={step.targetId}
            onClick={() => advanceScenario(step.targetId)}
            disabled={processing}
          >
            {processing ? 'Processing…' : step.buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
