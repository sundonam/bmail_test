import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { EventLog } from '../components/EventLog';

const BASE = {
  domainsCertified: 0,
  issuedIds: 14,
  migratedAccounts: 7,
  verifiedReviews: 125
};

type Status = 'healthy' | 'warning' | 'danger' | 'info';

function StatusDot({ status }: { status: Status }) {
  return <span className={`status-dot status-${status}`} aria-hidden />;
}

function KpiCard({
  label,
  value,
  delta,
  status
}: {
  label: string;
  value: string | number;
  delta?: string;
  status?: Status;
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        {status && <StatusDot status={status} />}
      </div>
      {delta && <div className="kpi-delta">{delta}</div>}
    </div>
  );
}

export function DashboardView() {
  const domains = useDemoStore((s) => s.isp.domains);
  const bmailIds = useDemoStore((s) => s.isp.bmailIds);
  const changeTokens = useDemoStore((s) => s.isp.changeTokens);
  const reviews = useDemoStore((s) => s.platform.reviews);
  const phishing = useDemoStore((s) => s.isp.phishingReports);
  const certs = useDemoStore((s) => s.bca.issuedCertificates);
  const inbox = useDemoStore((s) => s.user.inbox);
  const expiring = useDemoStore((s) => s.user.expiringExternalId);

  const certifiedDomains = domains.filter((d) => d.status === 'certified').length;
  const issuedIds = BASE.issuedIds + bmailIds.length;
  const migratedAccounts = BASE.migratedAccounts + changeTokens.length;
  const verifiedReviews =
    BASE.verifiedReviews + reviews.filter((r) => r.identifiable).length;

  const activePhishing = phishing.filter((p) => p.status === 'verifying').length;
  const confirmedPhishing = phishing.filter((p) => p.status === 'phishing-confirmed').length;
  const pendingTrust = inbox.filter((m) => m.trustLabel === 'pending').length;
  const fakeInbox = inbox.filter((m) => m.trustLabel === 'fake').length;

  return (
    <div className="page dashboard-page">
      <div className="page-title">System dashboard</div>
      <div className="page-sub">
        Live view of registry health, certification volume, marketplace integrity, and current
        security alerts.
      </div>

      <div className="kpi-grid">
        <KpiCard
          label="Verified domains"
          value={certifiedDomains}
          delta="bgmail.com, bnaver.com"
          status="healthy"
        />
        <KpiCard
          label="Issued bMail IDs"
          value={issuedIds}
          delta={bmailIds.length > 0 ? `+${bmailIds.length} this session` : 'no new today'}
          status="info"
        />
        <KpiCard
          label="Migrated accounts"
          value={migratedAccounts}
          delta={changeTokens.length > 0 ? `+${changeTokens.length} this session` : 'idle'}
          status="info"
        />
        <KpiCard
          label="Verified reviews"
          value={verifiedReviews}
          delta="identifiable authors"
          status="healthy"
        />
      </div>

      <div className="grid-2">
        <Card title="Security alerts">
          <div className="alert-list">
            <div className={`alert-row ${activePhishing > 0 ? 'alert-warning' : 'alert-healthy'}`}>
              <StatusDot status={activePhishing > 0 ? 'warning' : 'healthy'} />
              <div className="alert-body">
                <div className="alert-title">Phishing reports under verification</div>
                <div className="alert-desc">
                  {activePhishing > 0
                    ? `${activePhishing} report${activePhishing > 1 ? 's' : ''} awaiting backup-channel response`
                    : 'All clear. No reports currently under verification.'}
                </div>
              </div>
              <div className="alert-count">{activePhishing}</div>
            </div>
            <div className={`alert-row ${confirmedPhishing > 0 ? 'alert-danger' : 'alert-healthy'}`}>
              <StatusDot status={confirmedPhishing > 0 ? 'danger' : 'healthy'} />
              <div className="alert-body">
                <div className="alert-title">Phishing confirmed (lookalike domains)</div>
                <div className="alert-desc">
                  {confirmedPhishing > 0
                    ? `${confirmedPhishing} sender${confirmedPhishing > 1 ? 's' : ''} confirmed as impersonation`
                    : 'No confirmed impersonations.'}
                </div>
              </div>
              <div className="alert-count">{confirmedPhishing}</div>
            </div>
            <div className={`alert-row ${fakeInbox > 0 ? 'alert-warning' : 'alert-healthy'}`}>
              <StatusDot status={fakeInbox > 0 ? 'warning' : 'healthy'} />
              <div className="alert-body">
                <div className="alert-title">Suspicious mail in your inbox</div>
                <div className="alert-desc">
                  {fakeInbox > 0
                    ? `${fakeInbox} message${fakeInbox > 1 ? 's' : ''} flagged as lookalike sender`
                    : 'No suspicious senders in the inbox.'}
                </div>
              </div>
              <div className="alert-count">{fakeInbox}</div>
            </div>
          </div>
        </Card>

        <Card title="Your account">
          <div className="alert-list">
            <div className={`alert-row ${expiring ? 'alert-warning' : 'alert-healthy'}`}>
              <StatusDot status={expiring ? 'warning' : 'healthy'} />
              <div className="alert-body">
                <div className="alert-title">External email status</div>
                <div className="alert-desc">
                  {expiring
                    ? `${expiring} is about to expire. Migrate before graduation.`
                    : 'No expiring external email.'}
                </div>
              </div>
            </div>
            <div
              className={`alert-row ${
                pendingTrust > 0 ? 'alert-warning' : 'alert-healthy'
              }`}
            >
              <StatusDot status={pendingTrust > 0 ? 'warning' : 'healthy'} />
              <div className="alert-body">
                <div className="alert-title">Inbox trust-label coverage</div>
                <div className="alert-desc">
                  {pendingTrust > 0
                    ? `${pendingTrust} message${pendingTrust > 1 ? 's' : ''} awaiting domain verdict`
                    : 'All inbox messages have a verified trust label.'}
                </div>
              </div>
              <div className="alert-count">{pendingTrust}</div>
            </div>
            <div className="alert-row alert-info">
              <StatusDot status="info" />
              <div className="alert-body">
                <div className="alert-title">Certificate authority</div>
                <div className="alert-desc">
                  {certs.length > 0
                    ? `KT Telecom — certificate active, ${certs.length} active issuance this session.`
                    : 'KT Telecom standing by. No certificate issued yet.'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent activity">
        <EventLog />
      </Card>
    </div>
  );
}
