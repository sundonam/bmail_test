import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { PendingRequest } from '../components/PendingRequest';

const CERTIFIED_MEMBER_DOMAINS = ['bgmail.com', 'bnaver.com'];

function memberTier(bmailId: string): string {
  return CERTIFIED_MEMBER_DOMAINS.some((d) => bmailId.endsWith(`@${d}`))
    ? 'bMember'
    : 'standard';
}

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
              <th>Tier</th>
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
                <td>{memberTier(m.bmailId)}</td>
                <td>{m.joinedAt}</td>
                <td>{m.purchaseCount}</td>
                <td>{m.reviewCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tbl-caption">
          Tier follows the registered ID: addresses on a bMail-certified domain qualify as bMember.
        </div>
      </Card>

      <Card title="Product reviews — trust layer">
        {reviews.map((r) => (
          <div key={r.id} className="review-item">
            <div className="review-product">{r.product}</div>
            <div className="review-meta">
              <span className="review-rating">Rating {r.rating.toFixed(1)} of 5</span>
              <span className="mono">{r.memberId}</span>
              <span>{r.postedAt}</span>
              <span className="review-author-tag">
                {r.identifiable ? 'Identifiable author, verified purchase' : 'Unverified author'}
              </span>
            </div>
            <div className="review-content">{r.content}</div>
            <div className="review-helpful">{r.helpfulCount} people found this review helpful</div>
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
