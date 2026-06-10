import { useDemoStore, getCurrentStep } from '../state/store';
import { SCENARIOS } from '../data/scenarios';
import type { ActorId, ScenarioId } from '../types';

const IDS: ScenarioId[] = ['S1', 'S2', 'S3', 'S4'];

const ACTOR_NAME: Record<ActorId, string> = {
  user: 'Mailbox',
  isp: 'bMail ISP',
  bca: 'bCA (KT)',
  platform: 'Marketplace'
};

export function ScenarioPanel() {
  const current = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const completed = useDemoStore((s) => s.scenario.completed);
  const startScenario = useDemoStore((s) => s.startScenario);
  const cancelScenario = useDemoStore((s) => s.cancelScenario);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const activeTab = useDemoStore((s) => s.activeTab);
  const setActiveTab = useDemoStore((s) => s.setActiveTab);

  const step = getCurrentStep(current, stepNum);
  const onCorrectTab = step ? step.actor === activeTab : true;

  return (
    <div className="scenario-panel">
      <div className="scenario-header">
        <span className="scenario-header-title">Demo Scenarios</span>
        {current ? (
          <button className="btn btn-sm" onClick={cancelScenario}>
            Cancel
          </button>
        ) : (
          <button className="btn btn-sm" onClick={resetDemo}>
            Reset
          </button>
        )}
      </div>
      <div className="scenario-body">
        {!current && (
          <div className="scenario-list">
            {IDS.map((id) => {
              const sc = SCENARIOS[id];
              const isDone = completed.includes(id);
              return (
                <div
                  key={id}
                  className={`scenario-item${isDone ? ' done' : ''}`}
                  onClick={() => startScenario(id)}
                >
                  <div className="scenario-item-title">
                    {sc.title}
                    {isDone && <span className="faint"> · done</span>}
                  </div>
                  <div className="scenario-item-desc">{sc.desc}</div>
                </div>
              );
            })}
          </div>
        )}
        {current && step && (
          <div className="scenario-guide">
            <div className="scenario-guide-meta">
              {current} · Step {step.num} of {SCENARIOS[current].steps.length}
            </div>
            <div className="scenario-guide-title">{SCENARIOS[current].title}</div>
            {!onCorrectTab ? (
              <>
                <div className="scenario-guide-instruction">
                  Switch to the <strong>{ACTOR_NAME[step.actor]}</strong> tab to continue.
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab(step.actor)}
                >
                  Go to {ACTOR_NAME[step.actor]}
                </button>
              </>
            ) : (
              <div className="scenario-guide-instruction">
                {step.instruction}
                <div className="scenario-guide-hint">
                  Click the highlighted button to continue.
                </div>
              </div>
            )}
            <div className="scenario-steps-list">
              {SCENARIOS[current].steps.map((s) => (
                <div
                  key={s.num}
                  className={`scenario-step${s.num === step.num ? ' current' : ''}${s.num < step.num ? ' done' : ''}`}
                >
                  <span className="scenario-step-num">{s.num}.</span>
                  <span>
                    <span className="faint">[{ACTOR_NAME[s.actor]}]</span> {s.buttonLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
