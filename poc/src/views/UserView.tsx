import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { EventLog } from '../components/EventLog';
import { TrustBadge } from '../components/TrustBadge';
import { ScenarioActionCard } from '../components/ScenarioActionCard';

export function UserView() {
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const expiring = useDemoStore((s) => s.user.expiringExternalId);
  const channels = useDemoStore((s) => s.isp.backupChannels);
  const certs = useDemoStore((s) => s.bca.issuedCertificates);
  const inbox = useDemoStore((s) => s.user.inbox);
  const startScenario = useDemoStore((s) => s.startScenario);
  const currentScenario = useDemoStore((s) => s.scenario.current);
  const completedScenarios = useDemoStore((s) => s.scenario.completed);
  const userCert = certs.find((c) => c.bmailId === activeBmailId);

  const mailboxAddress = activeBmailId ?? expiring ?? 'no address';
  const showMigrationBanner =
    !!expiring && !completedScenarios.includes('S2');

  return (
    <div className="page">
      <div className="mailbox-header">
        <div className="page-title">Inbox</div>
        <div className="page-sub mono">{mailboxAddress}</div>
      </div>

      <ScenarioActionCard actor="user" />

      {showMigrationBanner && (
        <div className="banner">
          <div className="banner-body">
            <div className="banner-title">Your university email is about to expire</div>
            <div className="banner-desc">
              Migrate <span className="mono">{expiring}</span> to a lifelong bMail ID. Your purchases,
              reviews, and marketplace memberships move with you, certified at the domain layer.
            </div>
          </div>
          <div className="banner-actions">
            <button
              className="btn btn-primary"
              onClick={() => startScenario('S2')}
              disabled={!!currentScenario}
            >
              Start migration
            </button>
          </div>
        </div>
      )}

      <Card title="Messages">
        {inbox.map((m) => (
          <div key={m.id} className="mail-row">
            <div className="mail-row-top">
              <div className="mail-from">
                <span className="mail-from-name">{m.fromDisplay}</span>
                <span className="mail-from-addr">{m.from}</span>
              </div>
              <div className="mail-time">{m.receivedAt}</div>
            </div>
            <div className="mail-subject">{m.subject}</div>
            <div className="mail-preview">{m.preview}</div>
            <div className="mail-trust">
              <TrustBadge label={m.trustLabel} />
            </div>
          </div>
        ))}
      </Card>

      <div className="grid-2">
        <Card title="Account">
          <Field label="Active bMail ID" mono>
            {activeBmailId ?? 'Not yet issued'}
          </Field>
          <Field label="Display name">Jiyeon Park</Field>
          <Field label="Mode">Real name</Field>
          <Field label="Certified by">{userCert ? 'KT Telecom' : 'Not certified'}</Field>
          <Field label="Certificate valid">
            {userCert ? `${userCert.issuedAt} → ${userCert.validUntil}` : '—'}
          </Field>
        </Card>

        <Card title="Backup verification channels">
          {channels.length === 0 ? (
            <div className="faint" style={{ fontSize: 13 }}>
              No backup channels yet. Channels appear after registration (S1).
            </div>
          ) : (
            channels.map((c, i) => (
              <Field key={i} label={c.type} mono>
                {c.value}
              </Field>
            ))
          )}
        </Card>
      </div>

      <Card title="Events">
        <EventLog actorFilter="user" />
      </Card>
    </div>
  );
}
