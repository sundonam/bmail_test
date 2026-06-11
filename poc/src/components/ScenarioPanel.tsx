import { useDemoStore, getCurrentStep } from '../state/store';
import { SCENARIOS } from '../data/scenarios';
import type { ActorId, ScenarioId } from '../types';

const IDS: ScenarioId[] = ['S1', 'S2', 'S3', 'S4', 'S5'];

const ACTOR_NAME: Record<ActorId, string> = {
  user: 'Mail',
  isp: 'ISP Console',
  bca: 'bCA (KT)',
  platform: 'Coupang'
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
        <span className="scenario-header-title">
          {current ? 'Scenario in progress' : 'Demo scenarios'}
        </span>
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
            <div className="scenario-guide-meta">{SCENARIOS[current].title}</div>

            <div className="scenario-progress">
              <div className="scenario-progress-label">
                Progress
                <span className="faint">
                  Step {step.num} / {SCENARIOS[current].steps.length}
                </span>
              </div>
              <div className="scenario-progress-squares">
                {SCENARIOS[current].steps.map((s) => (
                  <span
                    key={s.num}
                    className={`progress-square${s.num < step.num ? ' filled' : ''}${
                      s.num === step.num ? ' current' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="scenario-flow">
              {SCENARIOS[current].steps.map((s, i) => {
                const isDone = s.num < step.num;
                const isCurrent = s.num === step.num;
                return (
                  <div key={s.num}>
                    <div
                      className={`scenario-flow-step${isCurrent ? ' current' : ''}${
                        isDone ? ' done' : ''
                      }`}
                    >
                      <span className="scenario-flow-step-name">{ACTOR_NAME[s.actor]}</span>
                      <span className="scenario-flow-step-label">{s.buttonLabel}</span>
                    </div>
                    {i < SCENARIOS[current].steps.length - 1 && (
                      <div className="scenario-flow-arrow">↓</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="scenario-divider" />

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
                  Look for the highlighted control on this view.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
