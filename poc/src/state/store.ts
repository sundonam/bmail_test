import { create } from 'zustand';
import type { AppTab, DemoState, MailboxView, ScenarioId } from '../types';
import { initialState } from '../data/actors';
import { SCENARIOS } from '../data/scenarios';

type StoreActions = {
  activeTab: AppTab;
  processing: boolean;
  setActiveTab: (t: AppTab) => void;
  setMailboxView: (v: MailboxView) => void;
  selectEmail: (id: string | null) => void;
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

function findScenarioStartingWith(targetId: string): ScenarioId | null {
  const ids: ScenarioId[] = ['S1', 'S2', 'S3', 'S4', 'S5'];
  for (const id of ids) {
    if (SCENARIOS[id].steps[0].targetId === targetId) return id;
  }
  return null;
}

const PROCESS_DELAY_MS = 700;

export const useDemoStore = create<Store>((set, get) => ({
  ...clone(initialState),
  activeTab: 'dashboard',
  processing: false,
  setActiveTab: (t) => set({ activeTab: t }),
  setMailboxView: (v) => set((s) => ({ user: { ...s.user, mailboxView: v } })),
  selectEmail: (id) =>
    set((s) => ({
      user: { ...s.user, selectedEmailId: id, mailboxView: id ? 'detail' : 'inbox' }
    })),
  resetDemo: () => set({ ...clone(initialState), activeTab: get().activeTab, processing: false }),
  cancelScenario: () =>
    set({
      processing: false,
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
    let state = get();
    if (state.processing) return;

    if (!state.scenario.current) {
      const startable = findScenarioStartingWith(targetId);
      if (!startable) return;
      set({
        scenario: { current: startable, step: 1, completed: state.scenario.completed }
      });
      state = get();
    }

    const scenarioId = state.scenario.current!;
    const scenario = SCENARIOS[scenarioId];
    const step = scenario.steps[state.scenario.step - 1];
    if (!step || step.targetId !== targetId) return;

    set({ processing: true });

    setTimeout(() => {
      const cur = get();
      const draft: DemoState = clone({
        bca: cur.bca,
        isp: cur.isp,
        platform: cur.platform,
        user: cur.user,
        scenario: cur.scenario,
        log: cur.log
      });
      step.apply(draft);
      draft.log = [...cur.log, { ts: now(), actor: step.actor, message: step.message }];

      const nextStepNum = step.num + 1;
      const isLast = nextStepNum > scenario.steps.length;

      set({
        processing: false,
        bca: draft.bca,
        isp: draft.isp,
        platform: draft.platform,
        user: draft.user,
        log: draft.log,
        scenario: {
          current: isLast ? null : scenarioId,
          step: isLast ? 0 : nextStepNum,
          completed: isLast
            ? [...cur.scenario.completed, scenarioId]
            : cur.scenario.completed
        }
      });
    }, PROCESS_DELAY_MS);
  }
}));
