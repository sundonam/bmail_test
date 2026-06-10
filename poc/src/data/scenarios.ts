import type { ScenarioId, ScenarioStep, DemoState } from '../types';
import { PROVIDER_BCA, PROVIDER_DOMAIN, PRIMARY_SUBSCRIBER_ID } from './actors';

const BMAIL_ADDRESS = 'j.park@bgmail.com';
const ISSUE_DATE = '2026-06-10';
const EXPIRY_DATE = '2027-06-10';
const CERT_JTI = 'cert_kt_2706101a';
const CHANGE_TOKEN_JTI = 'chg_isp_2706102b';

export const SCENARIOS: Record<ScenarioId, { title: string; desc: string; steps: ScenarioStep[] }> = {
  S1: {
    title: 'S1. Registration',
    desc: 'Zero-copy 인증서 발급 — User → ISP → bCA',
    steps: [
      {
        num: 1,
        actor: 'user',
        message: 'User → ISP: bMail ID 등록 신청 (Jiyeon Park, bgmail.com, KT bCA 선택)',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        message: 'ISP → bCA: 인증 요청 전송 — bmail_id + permission token (PII 없음)',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'bca',
        message: 'bCA: 가입자 DB 매칭 확인, Ed25519 서명 인증서 발급',
        apply: (s: DemoState) => {
          s.bca.issuedCertificates.push({
            jti: CERT_JTI,
            bmailId: BMAIL_ADDRESS,
            subscriberId: PRIMARY_SUBSCRIBER_ID,
            mode: 'real',
            issuedAt: ISSUE_DATE,
            validUntil: EXPIRY_DATE
          });
        }
      },
      {
        num: 4,
        actor: 'isp',
        message: 'ISP: 인증서 JWT 수신·검증, bMail ID 활성화 (PII 미저장)',
        apply: (s: DemoState) => {
          s.isp.bmailIds.push({
            address: BMAIL_ADDRESS,
            displayName: 'Jiyeon Park',
            mode: 'real',
            bcaId: PROVIDER_BCA,
            certificateJti: CERT_JTI,
            status: 'active',
            registeredAt: ISSUE_DATE
          });
          s.isp.backupChannels.push({
            type: 'messenger',
            value: 'kakao: jpark_kr',
            validatedAt: ISSUE_DATE
          });
        }
      },
      {
        num: 5,
        actor: 'user',
        message: `User: ${BMAIL_ADDRESS} 활성화 완료, ${PROVIDER_DOMAIN} 도메인은 평생 식별 가능`,
        apply: (s: DemoState) => {
          s.user.activeBmailId = BMAIL_ADDRESS;
        }
      }
    ]
  },
  S2: {
    title: 'S2. ID-change',
    desc: '만료 ID → bMail ID 이전, 플랫폼 회원·리뷰 이력 보존',
    steps: [
      {
        num: 1,
        actor: 'user',
        message: 'User → ISP: jpark@univ.edu 만료 예정, j.park@bgmail.com 으로 이전 요청',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'bca',
        message: 'bCA: 두 ID 의 소유자가 동일 인물(Jiyeon Park)임을 재확인',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'isp',
        message: 'ISP: 서명된 change token 발급 (구 ID + 신 ID + bCA 확인 JTI)',
        apply: (s: DemoState) => {
          s.isp.changeTokens.push({
            jti: CHANGE_TOKEN_JTI,
            oldId: 'jpark@univ.edu',
            newId: BMAIL_ADDRESS,
            issuedAt: ISSUE_DATE
          });
        }
      },
      {
        num: 4,
        actor: 'platform',
        message: 'Coupang: change token 검증, 회원 ID 재매핑 (구매·리뷰 이력 보존)',
        apply: (s: DemoState) => {
          s.platform.members = s.platform.members.map((m) =>
            m.platformMemberId === 'coupang-44120' ? { ...m, bmailId: BMAIL_ADDRESS } : m
          );
          s.platform.reviews = s.platform.reviews.map((r) =>
            r.memberId === 'coupang-44120' ? { ...r, identifiable: true } : r
          );
        }
      },
      {
        num: 5,
        actor: 'user',
        message: 'User: Coupang 에서 bMember 로 승격, 리뷰는 "식별 가능 작성자" 로 표기',
        apply: (s: DemoState) => {
          s.user.expiringExternalId = null;
        }
      }
    ]
  },
  S3: {
    title: 'S3. Phishing + Domain portal',
    desc: '의심 메일 백업 채널 검증 + 도메인 등록부 조회',
    steps: [
      {
        num: 1,
        actor: 'user',
        message: 'User → ISP: 도메인 포털에서 bgmail.net (위조) 와 bgmail.com (정상) 비교 조회',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        message: 'ISP: bgmail.net 은 등록부에 없음 — 위조 도메인으로 분류',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'isp',
        message: 'ISP: 의심 메일 신고 접수, 백업 채널(KakaoTalk) 로 발신자 확인 요청',
        apply: (s: DemoState) => {
          s.isp.phishingReports.push({
            id: 'rep-001',
            reporter: 'kim.s@example.com',
            suspectBmailId: 'h.lee@bgmail.net',
            status: 'verifying',
            createdAt: ISSUE_DATE
          });
        }
      },
      {
        num: 4,
        actor: 'user',
        message: 'User: 본인이 보내지 않은 메일임을 확인 — 피싱 확정 처리',
        apply: (s: DemoState) => {
          s.isp.phishingReports = s.isp.phishingReports.map((r) =>
            r.id === 'rep-001' ? { ...r, status: 'phishing-confirmed' } : r
          );
        }
      }
    ]
  },
  S4: {
    title: 'S4. Receiver inbox',
    desc: '받은 편지함에서 발신자 도메인 기반 신뢰 라벨 즉시 확인',
    steps: [
      {
        num: 1,
        actor: 'user',
        message: 'User: 받은 편지함 열기 — 3개 메일이 미확인 상태로 도착해 있다.',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        message: 'Mail client → ISP: 발신자 도메인 일괄 조회 (bgmail.com, bgmail.net, univ.edu)',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'user',
        message: 'Mail client: prof.lee@bgmail.com 은 KT 인증 도메인 — 식별 가능 발신자로 표기',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) =>
            m.from === 'prof.lee@bgmail.com' ? { ...m, trustLabel: 'certified' } : m
          );
        }
      },
      {
        num: 4,
        actor: 'user',
        message: 'Mail client: support@bgmail.net 은 등록부 미존재 — 위조 도메인 의심 경고',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) =>
            m.from === 'support@bgmail.net' ? { ...m, trustLabel: 'fake' } : m
          );
        }
      },
      {
        num: 5,
        actor: 'user',
        message: 'Mail client: notice@univ.edu 는 일반 미인증 도메인 — 식별 보장 없음',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) =>
            m.from === 'notice@univ.edu' ? { ...m, trustLabel: 'unknown' } : m
          );
        }
      },
      {
        num: 6,
        actor: 'isp',
        message: 'User → ISP: 위조 도메인 메일(support@bgmail.net) 피싱 신고 전달',
        apply: (s: DemoState) => {
          s.isp.phishingReports.push({
            id: 'rep-s4-001',
            reporter: s.user.activeBmailId ?? 'j.park@bgmail.com',
            suspectBmailId: 'support@bgmail.net',
            status: 'verifying',
            createdAt: ISSUE_DATE
          });
        }
      }
    ]
  }
};
