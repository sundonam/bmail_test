import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { EventLog } from '../components/EventLog';

export function PlatformView() {
  const members = useDemoStore((s) => s.platform.members);
  const reviews = useDemoStore((s) => s.platform.reviews);

  return (
    <div className="page">
      <div className="page-title">Coupang · bMember 플랫폼 콘솔</div>
      <div className="page-sub">
        change token 으로 회원 ID 가 재매핑되어도 구매·리뷰 이력은 그대로 보존된다. bMail ID 등록 회원의 리뷰는 식별 가능 작성자로 표기된다.
      </div>

      <Card title="회원">
        <table className="tbl">
          <thead>
            <tr>
              <th>플랫폼 회원 ID</th>
              <th>현재 bMail / 외부 ID</th>
              <th>가입일</th>
              <th>구매 수</th>
              <th>리뷰 수</th>
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

      <Card title="리뷰 신뢰 계층">
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 4 }}>
              <span className="mono">{r.memberId}</span>
              <span style={{ margin: '0 8px' }}>·</span>
              <span>{r.postedAt}</span>
              <span style={{ margin: '0 8px' }}>·</span>
              <span>{r.identifiable ? '식별 가능 작성자' : '미식별 작성자'}</span>
            </div>
            <div style={{ fontSize: 13 }}>{r.content}</div>
          </div>
        ))}
      </Card>

      <Card title="이벤트">
        <EventLog actorFilter="platform" />
      </Card>
    </div>
  );
}
