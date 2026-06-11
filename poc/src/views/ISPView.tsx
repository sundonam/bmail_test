import { useDemoStore, getCurrentStep } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { PendingRequest } from '../components/PendingRequest';
import { DOMAIN_LOOKUPS } from '../data/domains';

export function ISPView() {
  const bmailIds = useDemoStore((s) => s.isp.bmailIds);
  const domains = useDemoStore((s) => s.isp.domains);
  const tokens = useDemoStore((s) => s.isp.changeTokens);
  const phishing = useDemoStore((s) => s.isp.phishingReports);
  const advance = useDemoStore((s) => s.advanceScenario);
  const processing = useDemoStore((s) => s.processing);
  const scenarioId = useDemoStore((s) => s.scenario.current);
  const stepNum = useDemoStore((s) => s.scenario.step);
  const step = getCurrentStep(scenarioId, stepNum);

  const lookupTarget = step?.targetId === 's3-isp-lookup' ? 's3-isp-lookup' : null;
  const syncTarget = step?.targetId === 's4-isp-sync' ? 's4-isp-sync' : null;

  return (
    <div className="page">
      <div className="page-title">bMail ISP — operator console</div>
      <div className="page-sub">
        Manages the public domain registry, issues bMail IDs, and orchestrates change tokens.
        Certificates are stored as signed JWTs only — no PII columns exist here.
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

      <Card title="Public domain lookup portal">
        <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
          Anyone can query a domain to see whether the bMail registry certifies it.
        </div>
        <div className="btn-row" style={{ marginBottom: 12 }}>
          {DOMAIN_LOOKUPS.map((d) => {
            const isLookupTarget = lookupTarget && d.domain === 'bgmail.net';
            return (
              <button
                key={d.domain}
                className={`btn${isLookupTarget ? ' btn-primary scenario-target' : ''}`}
                data-step-target={isLookupTarget ? 's3-isp-lookup' : undefined}
                onClick={() => isLookupTarget && advance('s3-isp-lookup')}
                disabled={processing && !isLookupTarget}
              >
                Look up {d.domain}
              </button>
            );
          })}
        </div>
        <div className="domain-result-grid">
          {DOMAIN_LOOKUPS.map((d) => (
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

    </div>
  );
}
