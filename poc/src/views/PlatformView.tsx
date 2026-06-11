import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { PendingRequest } from '../components/PendingRequest';

export function PlatformView() {
  const members = useDemoStore((s) => s.platform.members);
  const reviews = useDemoStore((s) => s.platform.reviews);

  return (
    <div className="page">
      <div className="page-title">Coupang — bMember marketplace</div>
      <div className="page-sub">
        When a member migrates their ID via a signed change token, the member record is remapped
        while purchase and review history is preserved. Reviews by certified bMail authors are
        tagged as identifiable.
      </div>

      <PendingRequest actor="platform" title="Inbox — pending member actions" />

      <Card title="Members">
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

    </div>
  );
}
