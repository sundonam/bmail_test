import { useDemoStore } from './state/store';
import { UserView } from './views/UserView';
import { ISPView } from './views/ISPView';
import { BCAView } from './views/BCAView';
import { PlatformView } from './views/PlatformView';
import { ScenarioPanel } from './components/ScenarioPanel';
import type { ActorId } from './types';

const TABS: { id: ActorId; label: string }[] = [
  { id: 'user', label: 'Mailbox' },
  { id: 'isp', label: 'bMail ISP' },
  { id: 'bca', label: 'bCA (KT)' },
  { id: 'platform', label: 'Marketplace' }
];

function App() {
  const activeTab = useDemoStore((s) => s.activeTab);
  const setActiveTab = useDemoStore((s) => s.setActiveTab);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-title">bMail ID Infrastructure</div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="topbar-sub">Lee et al. (2025) — Research PoC</div>
      </header>

      {activeTab === 'user' && <UserView />}
      {activeTab === 'isp' && <ISPView />}
      {activeTab === 'bca' && <BCAView />}
      {activeTab === 'platform' && <PlatformView />}

      <ScenarioPanel />
    </div>
  );
}

export default App;
