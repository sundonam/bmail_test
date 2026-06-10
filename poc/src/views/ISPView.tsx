import { useState } from 'react';
import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { EventLog } from '../components/EventLog';
import { DOMAIN_LOOKUPS } from '../data/domains';

export function ISPView() {
  const bmailIds = useDemoStore((s) => s.isp.bmailIds);
  const domains = useDemoStore((s) => s.isp.domains);
  const tokens = useDemoStore((s) => s.isp.changeTokens);
  const phishing = useDemoStore((s) => s.isp.phishingReports);

  const [lookupVerdict, setLookupVerdict] = useState<typeof DOMAIN_LOOKUPS[number] | null>(null);

  return (
    <div className="page">
      <div className="page-title">bMail ISP · 운영 콘솔</div>
      <div className="page-sub">
        도메인 등록부, bMail ID 발급 현황, change token 발급 이력을 관리한다. 인증서는 서명된 JWT 로만 보관하며 PII 컬럼은 존재하지 않는다.
      </div>

      <Card title="발급된 bMail ID">
        {bmailIds.length === 0 ? (
          <div className="faint" style={{ fontSize: 13 }}>아직 발급된 ID 가 없다.</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>bMail 주소</th>
                <th>표시 이름</th>
                <th>모드</th>
                <th>인증 JTI</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {bmailIds.map((b) => (
                <tr key={b.address}>
                  <td className="mono">{b.address}</td>
                  <td>{b.displayName}</td>
                  <td>{b.mode === 'real' ? '실명' : '익명'}</td>
                  <td className="mono">{b.certificateJti}</td>
                  <td>{b.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="도메인 등록부">
        <table className="tbl">
          <thead>
            <tr>
              <th>도메인</th>
              <th>기반 제공자</th>
              <th>인증 기관</th>
              <th>DKIM</th>
              <th>포털 노출</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.domain}>
                <td className="mono">{d.domain}</td>
                <td>{d.baseProvider}</td>
                <td>{d.caPartners.join(', ') || '—'}</td>
                <td>{d.dkimStatus === 'pass' ? 'pass' : 'fail'}</td>
                <td>{d.portalListed ? '예' : '아니오'}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="공개 도메인 조회 포털">
        <div className="btn-row" style={{ marginBottom: 12 }}>
          {DOMAIN_LOOKUPS.map((d) => (
            <button key={d.domain} className="btn" onClick={() => setLookupVerdict(d)}>
              {d.domain}
            </button>
          ))}
        </div>
        {lookupVerdict && (
          <div>
            <Field label="조회 도메인" mono>{lookupVerdict.domain}</Field>
            <Field label="판정">{lookupVerdict.verdict}</Field>
            <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
              {lookupVerdict.note}
            </div>
          </div>
        )}
      </Card>

      <div className="grid-2">
        <Card title="ID-change 토큰">
          {tokens.length === 0 ? (
            <div className="faint" style={{ fontSize: 13 }}>발급된 토큰이 없다.</div>
          ) : (
            tokens.map((t) => (
              <div key={t.jti} style={{ paddingBottom: 8 }}>
                <Field label="JTI" mono>{t.jti}</Field>
                <Field label="구 ID" mono>{t.oldId}</Field>
                <Field label="신 ID" mono>{t.newId}</Field>
                <Field label="발급일">{t.issuedAt}</Field>
              </div>
            ))
          )}
        </Card>

        <Card title="피싱 신고">
          {phishing.length === 0 ? (
            <div className="faint" style={{ fontSize: 13 }}>접수된 신고가 없다.</div>
          ) : (
            phishing.map((p) => (
              <div key={p.id} style={{ paddingBottom: 8 }}>
                <Field label="신고자" mono>{p.reporter}</Field>
                <Field label="의심 발신자" mono>{p.suspectBmailId}</Field>
                <Field label="상태">
                  {p.status === 'verifying' && '백업 채널 확인 중'}
                  {p.status === 'phishing-confirmed' && '피싱 확정'}
                  {p.status === 'sender-confirmed' && '정상 발신 확인'}
                </Field>
              </div>
            ))
          )}
        </Card>
      </div>

      <Card title="이벤트">
        <EventLog actorFilter="isp" />
      </Card>
    </div>
  );
}
