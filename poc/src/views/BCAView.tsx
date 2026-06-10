import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { EventLog } from '../components/EventLog';

export function BCAView() {
  const subscribers = useDemoStore((s) => s.bca.subscribers);
  const certs = useDemoStore((s) => s.bca.issuedCertificates);

  return (
    <div className="page">
      <div className="page-title">KT Telecom · bCA 콘솔</div>
      <div className="page-sub">
        Zero-copy 원칙에 따라 가입자 PII 는 본 콘솔에만 존재한다. ISP 에는 서명된 토큰만 전달되며 PII 는 전송되지 않는다.
      </div>

      <Card title="가입자 데이터 (PII 보유)">
        <table className="tbl">
          <thead>
            <tr>
              <th>가입자 ID</th>
              <th>실명</th>
              <th>주민번호(마스킹)</th>
              <th>전화번호</th>
              <th>연락 이메일</th>
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
          이 표의 어떤 컬럼도 ISP 콘솔에 노출되지 않는다. ISP DB 의 bMail ID 테이블에는 표시 이름과 인증 JTI 만 존재한다.
        </div>
      </Card>

      <Card title="발급된 인증서">
        {certs.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>발급 이력이 없다.</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>JTI</th>
                <th>bMail 주소</th>
                <th>대상 가입자</th>
                <th>모드</th>
                <th>발급일</th>
                <th>만료일</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.jti}>
                  <td className="mono">{c.jti}</td>
                  <td className="mono">{c.bmailId}</td>
                  <td className="mono">{c.subscriberId}</td>
                  <td>{c.mode === 'real' ? '실명' : '익명'}</td>
                  <td>{c.issuedAt}</td>
                  <td>{c.validUntil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="이벤트">
        <EventLog actorFilter="bca" />
      </Card>
    </div>
  );
}
