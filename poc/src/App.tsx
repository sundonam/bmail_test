import { useDemoStore } from './state/store';
import { DashboardView } from './views/DashboardView';
import { UserView } from './views/UserView';
import { ISPView } from './views/ISPView';
import { BCAView } from './views/BCAView';
import { PlatformView } from './views/PlatformView';
import { ScenarioPanel } from './components/ScenarioPanel';
import { ProgressBar } from './components/ProgressBar';
import { Avatar } from './components/Avatar';
import type { AppTab } from './types';

const TABS: { id: AppTab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'user', label: 'Mail' },
  { id: 'isp', label: 'ISP Console' },
  { id: 'bca', label: 'bCA (KT)' },
  { id: 'platform', label: 'Coupang' }
];

function App() {
  const activeTab = useDemoStore((s) => s.activeTab);
  const setActiveTab = useDemoStore((s) => s.setActiveTab);
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const expiring = useDemoStore((s) => s.user.expiringExternalId);
  const signedInAs = activeBmailId ?? expiring ?? 'guest';

  return (
    <div className="app">
      <ProgressBar />
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-mark">b</span>
          <span className="topbar-title">bMail</span>
        </div>
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
        <div className="user-chip">
          <Avatar name="Jiyeon Park" />
          <div className="user-chip-text">
            <span className="user-chip-name">Jiyeon Park</span>
            <span className="user-chip-addr mono">{signedInAs}</span>
          </div>
        </div>
      </header>

      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'user' && <UserView />}
      {activeTab === 'isp' && <ISPView />}
      {activeTab === 'bca' && <BCAView />}
      {activeTab === 'platform' && <PlatformView />}

      <footer className="footer">
        bMail ID Infrastructure — research prototype based on Lee et al. (2025). All data is
        simulated.
      </footer>

      <ScenarioPanel />
    </div>
  );
}

export default App;
