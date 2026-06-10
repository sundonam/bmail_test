import { useState } from 'react';
import { useDemoStore, getCurrentStep } from '../state/store';
import { Avatar } from '../components/Avatar';
import { TrustBadge } from '../components/TrustBadge';
import { EventLog } from '../components/EventLog';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import type { Email } from '../types';

function useCurrentStepTargetId() {
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const step = getCurrentStep(scenarioId, stepNum);
  return step?.targetId ?? null;
}

function useAdvance() {
  return useDemoStore((s) => s.advanceScenario);
}

function MailboxToolbar() {
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const expiring = useDemoStore((s) => s.user.expiringExternalId);
  const setMailboxView = useDemoStore((s) => s.setMailboxView);
  const mailboxView = useDemoStore((s) => s.user.mailboxView);
  const inbox = useDemoStore((s) => s.user.inbox);
  const address = activeBmailId ?? expiring ?? 'no address';
  const unread = inbox.filter((m) => m.trustLabel === 'pending').length;

  return (
    <div className="mailbox-toolbar">
      <div className="mailbox-toolbar-left">
        {mailboxView !== 'inbox' && (
          <button className="btn btn-sm" onClick={() => setMailboxView('inbox')}>
            ← Back to inbox
          </button>
        )}
        <div className="mailbox-toolbar-title">
          <span className="mono">{address}</span>
          {mailboxView === 'inbox' && (
            <span className="muted" style={{ marginLeft: 12, fontSize: 12 }}>
              {unread} unread
            </span>
          )}
        </div>
      </div>
      <div className="mailbox-toolbar-right">
        <button className="btn btn-sm">Refresh</button>
      </div>
    </div>
  );
}

function MigrationBanner() {
  const expiring = useDemoStore((s) => s.user.expiringExternalId);
  const completed = useDemoStore((s) => s.scenario.completed);
  const currentScenario = useDemoStore((s) => s.scenario.current);
  const processing = useDemoStore((s) => s.processing);
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();

  if (!expiring || completed.includes('S2')) return null;
  const isTarget = targetId === 's2-user-start';

  return (
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
          className={`btn btn-primary${isTarget ? ' scenario-target' : ''}`}
          data-step-target={isTarget ? 's2-user-start' : undefined}
          onClick={() => advance('s2-user-start')}
          disabled={processing || (!!currentScenario && !isTarget)}
        >
          Start migration
        </button>
      </div>
    </div>
  );
}

function SetupBanner() {
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const setMailboxView = useDemoStore((s) => s.setMailboxView);
  const completed = useDemoStore((s) => s.scenario.completed);
  if (activeBmailId || completed.includes('S1')) return null;
  return (
    <div className="banner banner-quiet">
      <div className="banner-body">
        <div className="banner-title">You don't have a bMail ID yet</div>
        <div className="banner-desc">
          A bMail ID is a lifelong, identity-verified mail address. Set one up to get a certified
          domain that recipients can trust and that survives institutional changes.
        </div>
      </div>
      <div className="banner-actions">
        <button className="btn" onClick={() => setMailboxView('register')}>
          Set up bMail ID
        </button>
      </div>
    </div>
  );
}

function InboxList() {
  const inbox = useDemoStore((s) => s.user.inbox);
  const selectEmail = useDemoStore((s) => s.selectEmail);
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();

  function handleClick(email: Email) {
    if (targetId === 's4-user-open' && email.id === 'mail-002') {
      advance('s4-user-open');
    } else {
      selectEmail(email.id);
    }
  }

  return (
    <Card>
      <div className="mail-list">
        {inbox.map((m) => {
          const isUnread = m.trustLabel === 'pending';
          const isTarget = targetId === 's4-user-open' && m.id === 'mail-002';
          return (
            <div
              key={m.id}
              className={`mail-list-row${isUnread ? ' unread' : ''}${
                isTarget ? ' scenario-target-row' : ''
              }`}
              onClick={() => handleClick(m)}
            >
              <Avatar name={m.fromDisplay} />
              <div className="mail-list-body">
                <div className="mail-list-top">
                  <span className="mail-list-from">{m.fromDisplay}</span>
                  <span className="mail-list-time">{m.receivedAt}</span>
                </div>
                <div className="mail-list-subject">{m.subject}</div>
                <div className="mail-list-preview">{m.preview}</div>
                <div className="mail-list-trust">
                  <TrustBadge label={m.trustLabel} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MailDetail() {
  const inbox = useDemoStore((s) => s.user.inbox);
  const selectedId = useDemoStore((s) => s.user.selectedEmailId);
  const setMailboxView = useDemoStore((s) => s.setMailboxView);
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();
  const processing = useDemoStore((s) => s.processing);
  const mail = inbox.find((m) => m.id === selectedId);

  if (!mail) {
    setMailboxView('inbox');
    return null;
  }

  const reportIsTarget = targetId === 's4-user-report' && mail.id === 'mail-002';
  const denyIsTarget = targetId === 's3-user-deny' && mail.id === 'mail-002';

  return (
    <Card>
      <div className="mail-detail">
        <div className="mail-detail-header">
          <div className="mail-detail-subject">{mail.subject}</div>
          <div className="mail-detail-from-row">
            <Avatar name={mail.fromDisplay} />
            <div className="mail-detail-from">
              <div className="mail-detail-from-name">{mail.fromDisplay}</div>
              <div className="mail-detail-from-addr mono">{mail.from}</div>
            </div>
            <div className="mail-detail-time mono">{mail.receivedAt}</div>
          </div>
          <div className="mail-detail-trust">
            <TrustBadge label={mail.trustLabel} />
          </div>
        </div>
        <div className="mail-detail-body">
          <p>{mail.preview}</p>
          <p style={{ marginTop: 12 }}>
            {mail.from === 'support@bgmail.net'
              ? 'Click the link below to verify your account. Failure to act within 24 hours will result in suspension.'
              : mail.from === 'prof.lee@bgmail.com'
                ? 'Best, Hyunwoo'
                : 'Office of the Registrar, Graduate Affairs Division'}
          </p>
        </div>
        <div className="mail-detail-actions">
          <button className="btn">Reply</button>
          <button
            className={`btn${reportIsTarget ? ' btn-primary scenario-target' : ''}`}
            data-step-target={reportIsTarget ? 's4-user-report' : undefined}
            onClick={() => reportIsTarget && advance('s4-user-report')}
            disabled={processing}
          >
            Report phishing
          </button>
          {denyIsTarget && (
            <button
              className="btn btn-primary scenario-target"
              data-step-target="s3-user-deny"
              onClick={() => advance('s3-user-deny')}
              disabled={processing}
            >
              Deny — not my message
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

function RegistrationForm() {
  const setMailboxView = useDemoStore((s) => s.setMailboxView);
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();
  const processing = useDemoStore((s) => s.processing);
  const completed = useDemoStore((s) => s.scenario.completed);
  const [name, setName] = useState('j.park');

  if (completed.includes('S1')) {
    setMailboxView('inbox');
    return null;
  }

  const submitIsTarget = targetId === 's1-form-submit';

  return (
    <Card>
      <div className="reg-form">
        <div className="reg-form-header">
          <div className="reg-form-title">Set up a bMail ID</div>
          <div className="reg-form-sub">
            Your bMail ID is a lifelong identifier. Personal data stays with the certification
            authority — the ISP only stores a signed certificate.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. j.park"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Domain</label>
          <select className="form-input" defaultValue="bgmail.com">
            <option value="bgmail.com">bgmail.com (Gmail-backed, KT-certified)</option>
            <option value="bnaver.com">bnaver.com (Naver-backed, KT-certified)</option>
          </select>
          <div className="form-hint">Both options are listed in the bMail public registry.</div>
        </div>

        <div className="form-group">
          <label className="form-label">Privacy mode</label>
          <div className="radio-row">
            <label>
              <input type="radio" name="mode" defaultChecked /> Real name (Jiyeon Park)
            </label>
            <label>
              <input type="radio" name="mode" /> Anonymous pseudonym
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Certification Authority (bCA)</label>
          <select className="form-input" defaultValue="kt">
            <option value="kt">KT Telecom (mobile subscriber verification)</option>
          </select>
          <div className="form-hint">
            The bCA holds your verified identity. The ISP receives only a signed certificate token.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Backup verification channel</label>
          <input type="text" className="form-input" defaultValue="KakaoTalk: jpark_kr" />
          <div className="form-hint">
            Used by the ISP only when a recipient flags a suspicious mail from your address.
          </div>
        </div>

        <div className="form-preview">
          <span className="form-label">Your bMail address will be</span>
          <span className="mono" style={{ marginLeft: 12 }}>{name}@bgmail.com</span>
        </div>

        <div className="reg-form-actions">
          <button className="btn" onClick={() => setMailboxView('inbox')}>
            Cancel
          </button>
          <button
            className={`btn btn-primary${submitIsTarget ? ' scenario-target' : ''}`}
            data-step-target={submitIsTarget ? 's1-form-submit' : undefined}
            onClick={() => advance('s1-form-submit')}
            disabled={processing}
          >
            Submit registration
          </button>
        </div>
      </div>
    </Card>
  );
}

function ActivationToast() {
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();
  const processing = useDemoStore((s) => s.processing);
  if (targetId !== 's1-user-ack' && targetId !== 's2-user-ack') return null;
  const isS2 = targetId === 's2-user-ack';
  return (
    <div className="toast">
      <div className="toast-body">
        <div className="toast-title">
          {isS2 ? 'Migration complete' : 'bMail ID is now active'}
        </div>
        <div className="toast-desc">
          {isS2
            ? 'Your marketplace memberships have moved to j.park@bgmail.com. Reviews are now tagged as identifiable.'
            : 'j.park@bgmail.com is ready. The bgmail.com domain signals lifelong identifiability at the transport layer.'}
        </div>
      </div>
      <button
        className="btn btn-primary scenario-target"
        data-step-target={targetId}
        onClick={() => advance(targetId)}
        disabled={processing}
      >
        Got it
      </button>
    </div>
  );
}

function AccountStrip() {
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const certs = useDemoStore((s) => s.bca.issuedCertificates);
  const channels = useDemoStore((s) => s.isp.backupChannels);
  const userCert = certs.find((c) => c.bmailId === activeBmailId);

  return (
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
            No backup channels yet. They appear after a successful registration.
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
  );
}

export function UserView() {
  const mailboxView = useDemoStore((s) => s.user.mailboxView);

  return (
    <div className="page mailbox-page">
      <MailboxToolbar />
      <ActivationToast />

      {mailboxView === 'inbox' && (
        <>
          <SetupBanner />
          <MigrationBanner />
          <InboxList />
          <AccountStrip />
          <Card title="Events">
            <EventLog actorFilter="user" />
          </Card>
        </>
      )}
      {mailboxView === 'detail' && <MailDetail />}
      {mailboxView === 'register' && <RegistrationForm />}
    </div>
  );
}
