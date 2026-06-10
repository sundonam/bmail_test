import { useDemoStore } from '../state/store';
import { SCENARIOS } from '../data/scenarios';
import type { ScenarioId } from '../types';

const IDS: ScenarioId[] = ['S1', 'S2', 'S3', 'S4'];

export function ScenarioPanel() {
  const current = useDemoStore((s) => s.scenario.current);
  const step = useDemoStore((s) => s.scenario.step);
  const completed = useDemoStore((s) => s.scenario.completed);
  const startScenario = useDemoStore((s) => s.startScenario);
  const resetDemo = useDemoStore((s) => s.resetDemo);

  return (
    <div className="scenario-panel">
      <div className="scenario-header">
        <span className="scenario-header-title">시연 시나리오</span>
        <button className="btn" onClick={resetDemo} disabled={!!current}>
          초기화
        </button>
      </div>
      <div className="scenario-body">
        <div className="scenario-list">
          {IDS.map((id) => {
            const sc = SCENARIOS[id];
            const isCurrent = current === id;
            const isDone = completed.includes(id);
            return (
              <div
                key={id}
                className={`scenario-item${isCurrent ? ' running' : ''}${isDone ? ' done' : ''}`}
                onClick={() => !current && startScenario(id)}
              >
                <div className="scenario-item-title">
                  {sc.title}
                  {isDone && !isCurrent && <span className="faint"> · 완료</span>}
                  {isCurrent && <span className="faint"> · 진행 중</span>}
                </div>
                <div className="scenario-item-desc">{sc.desc}</div>
              </div>
            );
          })}
        </div>
        {current && (
          <div>
            {SCENARIOS[current].steps.map((s) => (
              <div
                key={s.num}
                className={`scenario-step${s.num === step ? ' current' : ''}`}
              >
                <span className="scenario-step-num">{s.num}.</span>
                <span>{s.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
