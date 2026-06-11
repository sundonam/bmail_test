import { useEffect, useState } from 'react';
import { useDemoStore, getCurrentStep } from '../state/store';
import { Avatar } from '../components/Avatar';
import { TrustBadge } from '../components/TrustBadge';
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

const TODAY = '2026-06-11';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMailTime(receivedAt: string): string {
  const [date, time] = receivedAt.split(' ');
  if (date === TODAY) return time;
  const [, month, day] = date.split('-');
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

type MailFolder = 'inbox' | 'sent' | 'archive';

function MailboxToolbar({
  query,
  onQueryChange
}: {
  query: string;
  onQueryChange: (q: string) => void;
}) {
  const setMailboxView = useDemoStore((s) => s.setMailboxView);
  const mailboxView = useDemoStore((s) => s.user.mailboxView);

  return (
    <div className="mailbox-toolbar">
      <div className="mailbox-toolbar-left">
        {mailboxView === 'inbox' ? (
          <button className="btn btn-primary" onClick={() => setMailboxView('compose')}>
            Compose
          </button>
        ) : (
          <button className="btn btn-sm" onClick={() => setMailboxView('inbox')}>
            ← Back to inbox
          </button>
        )}
      </div>
      {mailboxView === 'inbox' && (
        <input
          type="search"
          className="mailbox-search"
          placeholder="Search mail"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      )}
      <div className="mailbox-toolbar-right" />
    </div>
  );
}

function FolderChips({
  folder,
  onFolderChange
}: {
  folder: MailFolder;
  onFolderChange: (f: MailFolder) => void;
}) {
  const inbox = useDemoStore((s) => s.user.inbox);
  const unread = inbox.filter((m) => m.trustLabel === 'pending').length;
  const folders: { id: MailFolder; label: string; count?: number }[] = [
    { id: 'inbox', label: 'Inbox', count: unread },
    { id: 'sent', label: 'Sent' },
    { id: 'archive', label: 'Archive' }
  ];
  return (
    <div className="mail-folders">
      {folders.map((f) => (
        <button
          key={f.id}
          className={`mail-folder${folder === f.id ? ' active' : ''}`}
          onClick={() => onFolderChange(f.id)}
        >
          {f.label}
          {f.count ? <span className="mail-folder-count">{f.count}</span> : null}
        </button>
      ))}
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

function InboxList({ query, folder }: { query: string; folder: MailFolder }) {
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

  if (folder !== 'inbox') {
    return (
      <Card>
        <div className="faint" style={{ fontSize: 13, padding: '24px 0', textAlign: 'center' }}>
          {folder === 'sent' ? 'No sent mail.' : 'No archived mail.'}
        </div>
      </Card>
    );
  }

  const q = query.trim().toLowerCase();
  const rows = q
    ? inbox.filter(
        (m) =>
          m.fromDisplay.toLowerCase().includes(q) ||
          m.from.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q)
      )
    : inbox;

  if (rows.length === 0) {
    return (
      <Card>
        <div className="faint" style={{ fontSize: 13, padding: '24px 0', textAlign: 'center' }}>
          No messages match &quot;{query}&quot;.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mail-list">
        {rows.map((m) => {
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
                  <span className="mail-list-time">{formatMailTime(m.receivedAt)}</span>
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

  useEffect(() => {
    if (!mail) setMailboxView('inbox');
  }, [mail, setMailboxView]);

  if (!mail) return null;

  const reportIsTarget = targetId === 's4-user-report' && mail.id === 'mail-002';

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
              <div className="mail-detail-to">to me</div>
            </div>
            <div className="mail-detail-time mono">{mail.receivedAt}</div>
          </div>
          <div className="mail-detail-trust">
            <TrustBadge label={mail.trustLabel} />
          </div>
        </div>
        <div className="mail-detail-body">
          {mail.body.map((p, i) => (
            <p key={i} style={i > 0 ? { marginTop: 12 } : undefined}>
              {p}
            </p>
          ))}
        </div>
        <div className="mail-detail-actions">
          <button className="btn">Reply</button>
          <button className="btn">Forward</button>
          <button className="btn">Archive</button>
          <button
            className={`btn${reportIsTarget ? ' btn-primary scenario-target' : ''}`}
            data-step-target={reportIsTarget ? 's4-user-report' : undefined}
            onClick={() => reportIsTarget && advance('s4-user-report')}
            disabled={processing}
          >
            Report phishing
          </button>
        </div>
      </div>
    </Card>
  );
}

function ComposeView() {
  const setMailboxView = useDemoStore((s) => s.setMailboxView);
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const expiring = useDemoStore((s) => s.user.expiringExternalId);
  const fromAddress = activeBmailId ?? expiring ?? '';

  return (
    <Card>
      <div className="reg-form">
        <div className="reg-form-header">
          <div className="reg-form-title">New message</div>
          <div className="reg-form-sub mono">from {fromAddress}</div>
        </div>
        <div className="form-group">
          <label className="form-label">To</label>
          <input type="text" className="form-input" placeholder="Recipients" />
        </div>
        <div className="form-group">
          <label className="form-label">Subject</label>
          <input type="text" className="form-input" placeholder="Subject" />
        </div>
        <div className="form-group">
          <textarea className="form-input" rows={9} placeholder="Write your message" />
        </div>
        <div className="reg-form-actions">
          <button className="btn" onClick={() => setMailboxView('inbox')}>
            Discard
          </button>
          <button className="btn btn-primary" disabled title="Outbound mail is simulated in this demo">
            Send
          </button>
        </div>
        <div className="form-hint" style={{ marginTop: 8, textAlign: 'right' }}>
          Sending is outside the scope of this demo build.
        </div>
      </div>
    </Card>
  );
}

const REG_SUMMARY: { label: string; value: string }[] = [
  { label: 'bMail address', value: 'j.park@bgmail.com' },
  { label: 'Domain', value: 'bgmail.com (KT-certified)' },
  { label: 'Privacy mode', value: 'Real name — Jiyeon Park' },
  { label: 'Certification Authority', value: 'KT Telecom' },
  { label: 'Backup channel', value: 'KakaoTalk: jpark_kr' }
];

function ConfirmRegistrationModal({
  open,
  onCancel,
  onConfirm,
  busy
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Submit this registration?</div>
        <div className="modal-body">
          KT Telecom will match your mobile-subscriber record and issue a signed certificate.
          The bMail ISP receives only the signed certificate token — personal data stays at KT.
        </div>
        <div className="modal-summary">
          {REG_SUMMARY.map((row) => (
            <div key={row.label} className="modal-summary-row">
              <span className="modal-summary-label">{row.label}</span>
              <span className="modal-summary-value mono">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel} disabled={busy}>
            Review again
          </button>
          <button
            className="btn btn-primary scenario-target"
            data-step-target="s1-form-submit"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Submitting…' : 'Confirm and submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7 12.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function RegistrationSuccess() {
  const setActiveTab = useDemoStore((s) => s.setActiveTab);
  const activeTab = useDemoStore((s) => s.activeTab);
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);

  const ispNext = scenarioId === 'S1' && stepNum === 2;
  const submittedRef = 'REG-2706101A';

  return (
    <Card>
      <div className="success-card">
        <div className="success-mark">
          <SuccessCheckIcon />
        </div>
        <div className="success-title">Registration submitted</div>
        <div className="success-desc">
          Your request <span className="mono">{submittedRef}</span> was queued at the bMail ISP and
          is waiting to be forwarded to KT for certification. You will be notified via the backup
          channel once activation completes.
        </div>

        <div className="success-summary">
          <div className="success-summary-title">Submitted details</div>
          {REG_SUMMARY.map((row) => (
            <div key={row.label} className="field">
              <span className="field-label">{row.label}</span>
              <span className="field-value mono">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="success-next">
          <div className="success-next-title">What happens next</div>
          <ol className="success-next-list">
            <li>The ISP forwards your request to KT — no personal data is attached.</li>
            <li>KT verifies you against the carrier subscriber database.</li>
            <li>KT issues an Ed25519-signed certificate JWT back to the ISP.</li>
            <li>The ISP activates j.park@bgmail.com — your PII never leaves KT.</li>
          </ol>
        </div>

        {ispNext && activeTab !== 'isp' && (
          <div className="reg-form-actions" style={{ borderTop: 'none', marginTop: 18 }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('isp')}>
              Open ISP Console to continue
            </button>
          </div>
        )}
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
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const registered = completed.includes('S1');

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (registered) setMailboxView('inbox');
  }, [registered, setMailboxView]);

  useEffect(() => {
    // Reset local submission state if the scenario is cancelled before completing
    if (!scenarioId && !registered) setSubmitted(false);
  }, [scenarioId, registered]);

  if (registered) return null;

  const submitIsTarget = targetId === 's1-form-submit';
  const pastStep1 = scenarioId === 'S1' && stepNum >= 2;
  const showSuccess = submitted || pastStep1;

  if (showSuccess) return <RegistrationSuccess />;

  function handleSubmitClick() {
    setShowConfirm(true);
  }

  function handleConfirm() {
    setSubmitted(true);
    setShowConfirm(false);
    // Triggers S1 step 1 (also auto-starts S1 when no scenario is active yet).
    advance('s1-form-submit');
  }

  return (
    <>
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
            <input type="text" className="form-input" value="j.park" readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Domain</label>
            <select className="form-input" value="bgmail.com" onChange={() => {}}>
              <option value="bgmail.com">bgmail.com (Gmail-backed, KT-certified)</option>
              <option value="bnaver.com">bnaver.com (Naver-backed, KT-certified)</option>
            </select>
            <div className="form-hint">Both options are listed in the bMail public registry.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Privacy mode</label>
            <div className="radio-row">
              <label>
                <input type="radio" name="mode" checked onChange={() => {}} /> Real name (Jiyeon Park)
              </label>
              <label>
                <input type="radio" name="mode" checked={false} onChange={() => {}} /> Anonymous
                pseudonym (e.g. 19902301@bgmail.com — domain still certifies identifiability)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Certification Authority (bCA)</label>
            <select className="form-input" value="kt" onChange={() => {}}>
              <option value="kt">KT Telecom (mobile subscriber verification)</option>
            </select>
            <div className="form-hint">
              The bCA holds your verified identity. The ISP receives only a signed certificate token.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Backup verification channel</label>
            <input type="text" className="form-input" value="KakaoTalk: jpark_kr" readOnly />
            <div className="form-hint">
              Used by the ISP only when a recipient flags a suspicious mail from your address.
            </div>
          </div>

          <div className="form-preview">
            <span className="form-label">Your bMail address will be</span>
            <span className="mono" style={{ marginLeft: 12 }}>j.park@bgmail.com</span>
          </div>

          <div className="reg-form-actions">
            <button className="btn" onClick={() => setMailboxView('inbox')}>
              Cancel
            </button>
            <button
              className={`btn btn-primary${submitIsTarget ? ' scenario-target' : ''}`}
              data-step-target={submitIsTarget ? 's1-form-submit' : undefined}
              onClick={handleSubmitClick}
              disabled={processing}
            >
              Submit registration
            </button>
          </div>
        </div>
      </Card>

      <ConfirmRegistrationModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        busy={processing}
      />
    </>
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
            ? 'Your marketplace memberships have moved to j.park@bgmail.com. Reviews are now tagged as identifiable. Like an ORCID iD, the bMail ID persists across institutional changes.'
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

function BackupChannelToast() {
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();
  const processing = useDemoStore((s) => s.processing);
  if (targetId !== 's3-user-deny') return null;
  return (
    <div className="toast">
      <div className="toast-body">
        <div className="toast-title">Backup-channel verification (KakaoTalk)</div>
        <div className="toast-desc">
          bMail ISP to the genuine sender: a recipient reported a suspicious message sent as
          h.lee@bgmail.net. Did you send it? This view stands in for the sender&apos;s messenger —
          the suspect email address is never used for verification.
        </div>
      </div>
      <button
        className="btn btn-primary scenario-target"
        data-step-target="s3-user-deny"
        onClick={() => advance('s3-user-deny')}
        disabled={processing}
      >
        Deny — not my message
      </button>
    </div>
  );
}

function IdentApprovalToast() {
  const advance = useAdvance();
  const targetId = useCurrentStepTargetId();
  const processing = useDemoStore((s) => s.processing);
  if (targetId !== 's5-user-approve') return null;
  return (
    <div className="toast">
      <div className="toast-body">
        <div className="toast-title">Identification request</div>
        <div className="toast-desc">
          Coupang seller verification asks to confirm your identity for the high-value seller tier.
          If you approve, the bCA issues a signed confirmation — your personal data stays at KT.
        </div>
      </div>
      <button
        className="btn btn-primary scenario-target"
        data-step-target="s5-user-approve"
        onClick={() => advance('s5-user-approve')}
        disabled={processing}
      >
        Approve identification
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
  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState<MailFolder>('inbox');

  return (
    <div className="page mailbox-page">
      <MailboxToolbar query={query} onQueryChange={setQuery} />
      <ActivationToast />
      <BackupChannelToast />
      <IdentApprovalToast />

      {mailboxView === 'inbox' && (
        <>
          <SetupBanner />
          <MigrationBanner />
          <FolderChips folder={folder} onFolderChange={setFolder} />
          <InboxList query={query} folder={folder} />
          <AccountStrip />
        </>
      )}
      {mailboxView === 'detail' && <MailDetail />}
      {mailboxView === 'register' && <RegistrationForm />}
      {mailboxView === 'compose' && <ComposeView />}
    </div>
  );
}
