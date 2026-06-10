import { useDemoStore, getCurrentStep } from '../state/store';
import { SCENARIOS } from '../data/scenarios';
import type { ActorId } from '../types';

type Props = { actor: ActorId };

const ACTOR_NAME: Record<ActorId, string> = {
  user: 'Mailbox',
  isp: 'bMail ISP',
  bca: 'bCA (KT)',
  platform: 'Marketplace'
};

export function ScenarioActionCard({ actor }: Props) {
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const advanceScenario = useDemoStore((s) => s.advanceScenario);

  if (!scenarioId) return null;
  const step = getCurrentStep(scenarioId, stepNum);
  if (!step || step.actor !== actor) return null;

  const scenario = SCENARIOS[scenarioId];

  return (
    <div className="scenario-action-card">
      <div className="scenario-action-meta">
        Scenario {scenarioId} · Step {step.num} of {scenario.steps.length} · {ACTOR_NAME[actor]}
      </div>
      <div className="scenario-action-title">{scenario.title}</div>
      <div className="scenario-action-instruction">{step.instruction}</div>
      <button
        className="btn btn-primary scenario-target"
        data-step-target={step.targetId}
        onClick={() => advanceScenario(step.targetId)}
      >
        {step.buttonLabel}
      </button>
    </div>
  );
}
