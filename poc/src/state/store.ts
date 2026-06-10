import { create } from 'zustand';
import type { ActorId, DemoState, ScenarioId } from '../types';
import { initialState } from '../data/actors';
import { SCENARIOS } from '../data/scenarios';

type Tab = ActorId;

type StoreActions = {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  startScenario: (id: ScenarioId) => void;
  advanceScenario: (targetId: string) => void;
  cancelScenario: () => void;
  resetDemo: () => void;
};

type Store = DemoState & StoreActions;

function now(): string {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function getCurrentStep(scenarioId: ScenarioId | null, stepNum: number) {
  if (!scenarioId) return null;
  const sc = SCENARIOS[scenarioId];
  return sc.steps[stepNum - 1] ?? null;
}

export const useDemoStore = create<Store>((set, get) => ({
  ...clone(initialState),
  activeTab: 'user',
  setActiveTab: (t) => set({ activeTab: t }),
  resetDemo: () => set({ ...clone(initialState), activeTab: get().activeTab }),
  cancelScenario: () =>
    set({
      scenario: {
        current: null,
        step: 0,
        completed: get().scenario.completed
      }
    }),
  startScenario: (id) => {
    const state = get();
    if (state.scenario.current) return;
    set({
      scenario: { current: id, step: 1, completed: state.scenario.completed },
      activeTab: SCENARIOS[id].steps[0].actor
    });
  },
  advanceScenario: (targetId) => {
    const state = get();
    const scenarioId = state.scenario.current;
    if (!scenarioId) return;
    const scenario = SCENARIOS[scenarioId];
    const step = scenario.steps[state.scenario.step - 1];
    if (!step || step.targetId !== targetId) return;

    const draft: DemoState = clone({
      bca: state.bca,
      isp: state.isp,
      platform: state.platform,
      user: state.user,
      scenario: state.scenario,
      log: state.log
    });
    step.apply(draft);
    draft.log = [...state.log, { ts: now(), actor: step.actor, message: step.message }];

    const nextStepNum = step.num + 1;
    const isLast = nextStepNum > scenario.steps.length;

    set({
      bca: draft.bca,
      isp: draft.isp,
      platform: draft.platform,
      user: draft.user,
      log: draft.log,
      scenario: {
        current: isLast ? null : scenarioId,
        step: isLast ? 0 : nextStepNum,
        completed: isLast ? [...state.scenario.completed, scenarioId] : state.scenario.completed
      }
    });
  }
}));
