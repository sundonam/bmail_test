import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { PendingRequest } from '../components/PendingRequest';

export function PlatformView() {
  const members = useDemoStore((s) => s.platform.members);
  const reviews = useDemoStore((s) => s.platform.reviews);

  const identifiableReviews = reviews.filter((r) => r.identifiable).length;

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">Coupang — bMember marketplace</div>
        <div className="page-meta">seller-trust team · Admin</div>
      </div>
      <div className="page-sub">
        When a member migrates their ID via a signed change token, the member record is remapped
        while purchase and review history is preserved. Reviews by certified bMail authors are
        tagged as identifiable.
      </div>

      <div className="stat-strip">
        <div className="stat-block">
          <div className="stat-value">2.1M</div>
          <div className="stat-label">Total members</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">847K</div>
          <div className="stat-label">bMembers (identifiable)</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">{identifiableReviews}</div>
          <div className="stat-label">Identifiable reviews this session</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">12,840</div>
          <div className="stat-label">Unreachable members</div>
        </div>
      </div>

      <PendingRequest actor="platform" title="Inbox — pending member actions" />

      <Card title="Member lookup (demo subject)">
        <table className="tbl">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Current bMail / external ID</th>
              <th>Joined</th>
              <th>Purchases</th>
              <th>Reviews</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.platformMemberId}>
                <td className="mono">{m.platformMemberId}</td>
                <td className="mono">{m.bmailId}</td>
                <td>{m.joinedAt}</td>
                <td>{m.purchaseCount}</td>
                <td>{m.reviewCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Review trust layer">
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 4 }}>
              <span className="mono">{r.memberId}</span>
              <span style={{ margin: '0 8px' }}>—</span>
              <span>{r.postedAt}</span>
              <span style={{ margin: '0 8px' }}>—</span>
              <span>{r.identifiable ? 'Identifiable author' : 'Unverified author'}</span>
            </div>
            <div style={{ fontSize: 13 }}>{r.content}</div>
          </div>
        ))}
      </Card>

      <Card title="Unreachable members — why the ID-change protocol matters">
        <Field label="Members with suspended or expired email IDs">12,840</Field>
        <Field label="University and corporate addresses among them">11,119</Field>
        <Field label="Estimated annual order value at risk">KRW 2.4B</Field>
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          Without a secure ID-change protocol these customers are permanently lost when their
          institutional email expires. The signed change token shown in S2 lets the platform remap
          the member record while preserving the full purchase and review history.
        </div>
      </Card>

    </div>
  );
}
