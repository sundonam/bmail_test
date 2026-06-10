import { useDemoStore } from '../state/store';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { EventLog } from '../components/EventLog';
import type { TrustLabel } from '../types';

const TRUST_COPY: Record<TrustLabel, { mark: string; note: string }> = {
  pending: { mark: '...', note: '도메인 확인 대기' },
  certified: {
    mark: '[certified]',
    note: '식별 가능 발신자, bgmail.com 은 KT Telecom 인증 도메인'
  },
  fake: {
    mark: '[fake]',
    note: '위조 도메인 의심, bMail 등록부 미존재 — 링크 클릭과 첨부 열람 자제'
  },
  unknown: {
    mark: '[unknown]',
    note: '일반 미인증 도메인, bMail 식별 보장 없음'
  }
};

export function UserView() {
  const activeBmailId = useDemoStore((s) => s.user.activeBmailId);
  const expiring = useDemoStore((s) => s.user.expiringExternalId);
  const channels = useDemoStore((s) => s.isp.backupChannels);
  const certs = useDemoStore((s) => s.bca.issuedCertificates);
  const inbox = useDemoStore((s) => s.user.inbox);
  const userCert = certs.find((c) => c.bmailId === activeBmailId);

  return (
    <div className="page">
      <div className="page-title">Jiyeon Park · 사용자 콘솔</div>
      <div className="page-sub">
        대학원 졸업을 앞두고 학교 이메일(jpark@univ.edu)이 만료될 예정이다. bMail ID 로 평생 식별자를 이전하려 한다.
      </div>

      <div className="grid-2">
        <Card title="bMail 신원">
          <Field label="활성 bMail ID" mono>
            {activeBmailId ?? '미발급'}
          </Field>
          <Field label="표시 이름">Jiyeon Park</Field>
          <Field label="모드">실명</Field>
          <Field label="인증 기관">{userCert ? 'KT Telecom' : '미인증'}</Field>
          <Field label="인증서 유효기간">
            {userCert ? `${userCert.issuedAt} → ${userCert.validUntil}` : '없음'}
          </Field>
        </Card>

        <Card title="만료 예정 외부 ID">
          <Field label="기존 외부 ID" mono>
            {expiring ?? '이전 완료'}
          </Field>
          <Field label="상태">{expiring ? '곧 만료' : '이전 완료 — 회원 이력 보존됨'}</Field>
          <Field label="ID 이전 프로토콜">S2 시나리오로 자동 처리</Field>
        </Card>
      </div>

      <Card title="받은 편지함">
        {inbox.map((m) => {
          const copy = TRUST_COPY[m.trustLabel];
          return (
            <div key={m.id} className="inbox-row">
              <div className="inbox-meta">
                <div>
                  <span className="inbox-from-name">{m.fromDisplay}</span>
                  <span className="inbox-from-addr">{m.from}</span>
                </div>
                <div className="inbox-time">{m.receivedAt}</div>
              </div>
              <div className="inbox-subject">{m.subject}</div>
              <div className="inbox-preview">{m.preview}</div>
              <div className="inbox-trust">
                {m.trustLabel === 'pending' ? (
                  <span className="faint">{copy.note}</span>
                ) : (
                  <>
                    <span className="inbox-trust-mark">{copy.mark}</span>
                    {copy.note}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      <Card title="백업 검증 채널">
        {channels.length === 0 && (
          <div className="faint" style={{ fontSize: 13 }}>
            아직 등록된 백업 채널이 없다. 등록 시나리오(S1) 진행 후 노출된다.
          </div>
        )}
        {channels.map((c, i) => (
          <Field key={i} label={c.type} mono>
            {c.value}
          </Field>
        ))}
      </Card>

      <Card title="이벤트">
        <EventLog actorFilter="user" />
      </Card>
    </div>
  );
}
