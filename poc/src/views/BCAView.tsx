import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { PendingRequest } from '../components/PendingRequest';

export function BCAView() {
  const subscribers = useDemoStore((s) => s.bca.subscribers);
  const certs = useDemoStore((s) => s.bca.issuedCertificates);

  return (
    <div className="page">
      <div className="page-title">KT Telecom — Certification Authority</div>
      <div className="page-sub">
        Under the zero-copy policy, subscriber PII lives only in this console. The bMail ISP receives
        a signed certificate JWT — never the underlying personal data.
      </div>

      <PendingRequest actor="bca" title="Inbox — pending certifications" />

      <Card title="Subscribers (PII)">
        <table className="tbl">
          <thead>
            <tr>
              <th>Subscriber ID</th>
              <th>Full name</th>
              <th>National ID (masked)</th>
              <th>Phone</th>
              <th>Contact email</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td className="mono">{s.id}</td>
                <td>{s.fullName}</td>
                <td className="mono">{s.nationalIdMasked}</td>
                <td className="mono">{s.phone}</td>
                <td className="mono">{s.contactEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          None of these columns appear in the bMail ISP database. The ISP holds only display names
          and certificate JTIs.
        </div>
      </Card>

      <Card title="Issued certificates">
        {certs.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>No certificates issued yet.</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>JTI</th>
                <th>bMail address</th>
                <th>Subscriber</th>
                <th>Mode</th>
                <th>Issued</th>
                <th>Valid until</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.jti}>
                  <td className="mono">{c.jti}</td>
                  <td className="mono">{c.bmailId}</td>
                  <td className="mono">{c.subscriberId}</td>
                  <td>{c.mode === 'real' ? 'Real name' : 'Anonymous'}</td>
                  <td>{c.issuedAt}</td>
                  <td>{c.validUntil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

    </div>
  );
}
