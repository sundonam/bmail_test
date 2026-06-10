import { create } from 'zustand';
import type { ActorId, DemoState, ScenarioId } from '../types';
import { initialState } from '../data/actors';
import { SCENARIOS } from '../data/scenarios';

type Tab = ActorId;

type StoreActions = {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  startScenario: (id: ScenarioId) => void;
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

const STEP_DELAY_MS = 650;

export const useDemoStore = create<Store>((set, get) => ({
  ...clone(initialState),
  activeTab: 'user',
  setActiveTab: (t) => set({ activeTab: t }),
  resetDemo: () => set({ ...clone(initialState), activeTab: get().activeTab }),
  startScenario: async (id) => {
    const state = get();
    if (state.scenario.current) return;
    const scenario = SCENARIOS[id];
    set({
      scenario: { current: id, step: 0, completed: state.scenario.completed }
    });
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      set({
        scenario: { current: id, step: step.num, completed: get().scenario.completed }
      });
      const current = get();
      const draft: DemoState = clone({
        bca: current.bca,
        isp: current.isp,
        platform: current.platform,
        user: current.user,
        scenario: current.scenario,
        log: current.log
      });
      step.apply(draft);
      draft.log = [
        ...current.log,
        { ts: now(), actor: step.actor, message: step.message }
      ];
      set({
        bca: draft.bca,
        isp: draft.isp,
        platform: draft.platform,
        user: draft.user,
        log: draft.log
      });
      await new Promise((r) => setTimeout(r, STEP_DELAY_MS));
    }
    set({
      scenario: {
        current: null,
        step: 0,
        completed: [...get().scenario.completed, id]
      }
    });
  }
}));
