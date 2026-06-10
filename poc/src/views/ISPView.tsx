import { useState } from 'react';
import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { EventLog } from '../components/EventLog';
import { ScenarioActionCard } from '../components/ScenarioActionCard';
import { DOMAIN_LOOKUPS } from '../data/domains';

export function ISPView() {
  const bmailIds = useDemoStore((s) => s.isp.bmailIds);
  const domains = useDemoStore((s) => s.isp.domains);
  const tokens = useDemoStore((s) => s.isp.changeTokens);
  const phishing = useDemoStore((s) => s.isp.phishingReports);

  const [lookupVerdict, setLookupVerdict] = useState<typeof DOMAIN_LOOKUPS[number] | null>(null);

  return (
    <div className="page">
      <div className="page-title">bMail ISP — operator console</div>
      <div className="page-sub">
        Manages the public domain registry, issues bMail IDs, and orchestrates change tokens. Certificates
        are stored as signed JWTs only — no PII columns exist in this database.
      </div>

      <ScenarioActionCard actor="isp" />

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
        <div className="btn-row" style={{ marginBottom: 12 }}>
          {DOMAIN_LOOKUPS.map((d) => (
            <button key={d.domain} className="btn" onClick={() => setLookupVerdict(d)}>
              {d.domain}
            </button>
          ))}
        </div>
        {lookupVerdict && (
          <div>
            <Field label="Domain queried" mono>{lookupVerdict.domain}</Field>
            <Field label="Verdict">{lookupVerdict.verdict}</Field>
            <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
              {lookupVerdict.note}
            </div>
          </div>
        )}
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

      <Card title="Events">
        <EventLog actorFilter="isp" />
      </Card>
    </div>
  );
}
