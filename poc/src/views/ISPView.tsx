import { useState } from 'react';
import { useDemoStore, getCurrentStep } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { PendingRequest } from '../components/PendingRequest';
import { DOMAIN_LOOKUPS } from '../data/domains';

const ADDRESS_GUIDE = [
  {
    address: 'jiyeon.park@bgmail.com',
    kind: 'Legitimate bMail (real name)',
    note: 'Real name plus certified domain. The sender is identifiable by both the name and the domain certification.'
  },
  {
    address: '19902301@bgmail.com',
    kind: 'Legitimate bMail (anonymous)',
    note: 'Pseudonym name plus certified domain. The sender stays anonymous, yet the domain still guarantees identifiability through the ISP.'
  },
  {
    address: 'jiyeon.park@gmail.com',
    kind: 'Not a bMail address',
    note: 'Familiar name but a non-certified domain (gmail.com is not bgmail.com). The display name carries no guarantee and can be fake.'
  }
];

const FAKE_INTERCEPTS = [
  { domain: 'b-gmail.com', target: 'bgmail.com', via: 'Transport layer filter', at: '2026-06-09 11:04' },
  { domain: 'bnaver.org', target: 'bnaver.com', via: 'Portal allowlist', at: '2026-06-08 14:37' }
];

export function ISPView() {
  const bmailIds = useDemoStore((s) => s.isp.bmailIds);
  const domains = useDemoStore((s) => s.isp.domains);
  const tokens = useDemoStore((s) => s.isp.changeTokens);
  const phishing = useDemoStore((s) => s.isp.phishingReports);
  const identRequests = useDemoStore((s) => s.isp.identificationRequests);
  const advance = useDemoStore((s) => s.advanceScenario);
  const processing = useDemoStore((s) => s.processing);
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const step = getCurrentStep(scenarioId, stepNum);
  const [lookedUp, setLookedUp] = useState<string[]>([]);

  const lookupTarget = step?.targetId === 's3-isp-lookup' ? 's3-isp-lookup' : null;
  const syncTarget = step?.targetId === 's4-isp-sync' ? 's4-isp-sync' : null;

  function handleLookup(domain: string) {
    setLookedUp((prev) => (prev.includes(domain) ? prev : [...prev, domain]));
    if (domain === 'bgmail.net') advance('s3-isp-lookup');
  }

  const certifiedDomains = domains.filter((d) => d.status === 'certified').length;
  const openVerifications = phishing.filter((p) => p.status === 'verifying').length;

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">bMail ISP — operator console</div>
        <div className="page-meta">ops@bgmail.com · Production</div>
      </div>
      <div className="page-sub">
        Manages the public domain registry, issues bMail IDs, and orchestrates change tokens.
        Certificates are stored as signed JWTs only — no PII columns exist here.
      </div>

      <div className="stat-strip">
        <div className="stat-block">
          <div className="stat-value">24,831</div>
          <div className="stat-label">Registered users (cumulative)</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">{bmailIds.length}</div>
          <div className="stat-label">IDs issued this session</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">{certifiedDomains}</div>
          <div className="stat-label">Certified domains</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">{openVerifications}</div>
          <div className="stat-label">Open verifications</div>
        </div>
      </div>

      <PendingRequest actor="isp" title="Inbox — pending requests" />

      <Card title="Issued bMail IDs">
        {bmailIds.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>No bMail IDs issued yet.</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Address</th>
                <th>Display name</th>
                <th>Mode</th>
                <th>Certificate JTI</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {bmailIds.map((b) => (
                <tr key={b.address}>
                  <td className="mono">{b.address}</td>
                  <td>{b.displayName}</td>
                  <td>{b.mode === 'real' ? 'Real name' : 'Anonymous'}</td>
                  <td className="mono">{b.certificateJti}</td>
                  <td>{b.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Domain registry">
        <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
          Snapshot synced 2026-06-11 09:00 KST from CA partner feeds, {domains.length} domains
          on record.
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Provider</th>
              <th>CA partners</th>
              <th>DKIM</th>
              <th>Listed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.domain}>
                <td className="mono">{d.domain}</td>
                <td>{d.baseProvider}</td>
                <td>{d.caPartners.join(', ') || '—'}</td>
                <td>{d.dkimStatus}</td>
                <td>{d.portalListed ? 'yes' : 'no'}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Recent fake-domain intercepts">
        <table className="tbl">
          <thead>
            <tr>
              <th>Attempted domain</th>
              <th>Spoofing target</th>
              <th>Detected via</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {FAKE_INTERCEPTS.map((f) => (
              <tr key={f.domain}>
                <td className="mono">{f.domain}</td>
                <td className="mono">{f.target}</td>
                <td>{f.via}</td>
                <td>{f.at}</td>
                <td>blocked</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          Lookalike domains never enter the registry. They are blocked at the portal allowlist or
          the transport layer, and recorded as fake when queried.
        </div>
      </Card>

      <Card title="Public domain lookup portal">
        <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
          Anyone can query a domain to see whether the bMail registry certifies it. Click a domain
          to run the lookup.
        </div>
        <div className="btn-row" style={{ marginBottom: 12 }}>
          {DOMAIN_LOOKUPS.map((d) => {
            const isLookupTarget = lookupTarget && d.domain === 'bgmail.net';
            return (
              <button
                key={d.domain}
                className={`btn${isLookupTarget ? ' btn-primary scenario-target' : ''}`}
                data-step-target={isLookupTarget ? 's3-isp-lookup' : undefined}
                onClick={() => handleLookup(d.domain)}
                disabled={processing}
              >
                Look up {d.domain}
              </button>
            );
          })}
        </div>
        {lookedUp.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>
            No lookups yet. Query a domain to see its registry verdict.
          </div>
        ) : (
          <div className="domain-result-grid">
            {DOMAIN_LOOKUPS.filter((d) => lookedUp.includes(d.domain)).map((d) => (
              <div key={d.domain} className={`domain-result domain-result-${d.verdict}`}>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                  {d.domain}
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Verdict: {d.verdict}
                </div>
                <div className="faint" style={{ fontSize: 12, marginTop: 6 }}>{d.note}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="How to interpret a bMail address">
        <div className="domain-result-grid">
          {ADDRESS_GUIDE.map((g) => (
            <div key={g.address} className="domain-result">
              <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{g.address}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{g.kind}</div>
              <div className="faint" style={{ fontSize: 12, marginTop: 6 }}>{g.note}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Batch domain trust-label sync">
        <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
          Mail clients periodically request batch verdicts for sender domains so the inbox can show
          per-sender trust labels.
        </div>
        <button
          className={`btn${syncTarget ? ' btn-primary scenario-target' : ''}`}
          data-step-target={syncTarget ?? undefined}
          onClick={() => syncTarget && advance('s4-isp-sync')}
          disabled={processing || !syncTarget}
        >
          {syncTarget ? 'Sync sender trust labels' : 'No pending sync'}
        </button>
      </Card>

      <div className="grid-2">
        <Card title="ID-change tokens">
          {tokens.length === 0 ? (
            <div className="faint" style={{ fontSize: 13 }}>No tokens issued yet.</div>
          ) : (
            tokens.map((t) => (
              <div key={t.jti} style={{ paddingBottom: 8 }}>
                <Field label="JTI" mono>{t.jti}</Field>
                <Field label="Old ID" mono>{t.oldId}</Field>
                <Field label="New ID" mono>{t.newId}</Field>
                <Field label="Issued">{t.issuedAt}</Field>
              </div>
            ))
          )}
        </Card>

        <Card title="Phishing reports">
          {phishing.length === 0 ? (
            <div className="faint" style={{ fontSize: 13 }}>No reports yet.</div>
          ) : (
            phishing.map((p) => (
              <div key={p.id} style={{ paddingBottom: 8 }}>
                <Field label="Reporter" mono>{p.reporter}</Field>
                <Field label="Suspect sender" mono>{p.suspectBmailId}</Field>
                <Field label="Status">
                  {p.status === 'verifying' && 'Verifying via backup channel'}
                  {p.status === 'phishing-confirmed' && 'Phishing confirmed'}
                  {p.status === 'sender-confirmed' && 'Sender confirmed legitimate'}
                </Field>
              </div>
            ))
          )}
        </Card>
      </div>

      <Card title="Identification requests">
        {identRequests.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>
            No identification requests. Receivers can ask whether a sender is identifiable —
            identification proceeds only with the sender&apos;s approval.
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {identRequests.map((r) => (
                <tr key={r.id}>
                  <td>{r.requester}</td>
                  <td className="mono">{r.target}</td>
                  <td>{r.reason}</td>
                  <td>
                    {r.status === 'pending' && 'awaiting sender approval'}
                    {r.status === 'approved' && 'approved by sender'}
                    {r.status === 'denied' && 'denied by sender'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

    </div>
  );
}
