import type { DemoState } from '../types';

export const initialState: DemoState = {
  bca: {
    subscribers: [
      {
        id: 'sub-001',
        fullName: 'Jiyeon Park',
        nationalIdMasked: '900315-2******',
        phone: '+82-10-2741-8830',
        contactEmail: 'jiyeon.park.kt@kt-customer.kr',
        carrier: 'KT'
      },
      {
        id: 'sub-002',
        fullName: 'Hyunwoo Lee',
        nationalIdMasked: '870622-1******',
        phone: '+82-10-5102-7711',
        contactEmail: 'h.lee@kt-customer.kr',
        carrier: 'KT'
      }
    ],
    issuedCertificates: []
  },
  isp: {
    bmailIds: [],
    domains: [
      {
        domain: 'bgmail.com',
        baseProvider: 'Gmail',
        caPartners: ['KT Telecom'],
        dkimStatus: 'pass',
        portalListed: true,
        status: 'certified'
      },
      {
        domain: 'bnaver.com',
        baseProvider: 'Naver Mail',
        caPartners: ['KT Telecom'],
        dkimStatus: 'pass',
        portalListed: true,
        status: 'certified'
      },
      {
        domain: 'bgmail.net',
        baseProvider: 'unknown',
        caPartners: [],
        dkimStatus: 'fail',
        portalListed: false,
        status: 'fake'
      }
    ],
    changeTokens: [],
    identificationRequests: [],
    phishingReports: [],
    backupChannels: []
  },
  platform: {
    members: [
      {
        platformMemberId: 'coupang-44120',
        bmailId: 'jpark@univ.edu',
        joinedAt: '2022-03-04',
        reviewCount: 12,
        purchaseCount: 47
      }
    ],
    reviews: [
      {
        id: 'rev-001',
        memberId: 'coupang-44120',
        content: '학교 기숙사 입주 첫 달, 라텍스 베개 만족도 높음.',
        identifiable: false,
        postedAt: '2024-03-12'
      },
      {
        id: 'rev-002',
        memberId: 'coupang-44120',
        content: '대학원 발표용 노트북 스탠드, 각도 조절 안정적.',
        identifiable: false,
        postedAt: '2024-11-08'
      }
    ]
  },
  user: {
    activeBmailId: null,
    expiringExternalId: 'jpark@univ.edu',
    inbox: [
      {
        id: 'mail-001',
        from: 'prof.lee@bgmail.com',
        fromDisplay: 'Prof. Hyunwoo Lee',
        subject: '공동 연구 미팅 일정 회신 부탁드립니다',
        preview: '박지연 선생, 다음 주 화요일 오후 IS 저널 투고 일정 관련해서 논의하면 좋겠습니다.',
        receivedAt: '2026-06-10 09:14',
        trustLabel: 'pending'
      },
      {
        id: 'mail-002',
        from: 'support@bgmail.net',
        fromDisplay: 'bMail Support',
        subject: '[긴급] bMail 계정 비밀번호 변경 필요',
        preview: '계정 보안을 위해 즉시 비밀번호를 변경해주세요. 아래 링크에서 처리할 수 있습니다.',
        receivedAt: '2026-06-10 08:47',
        trustLabel: 'pending'
      },
      {
        id: 'mail-003',
        from: 'notice@univ.edu',
        fromDisplay: '대학원 행정실',
        subject: '졸업 행정 안내',
        preview: '6월 졸업 예정자 대상 행정 절차를 안내드립니다. 학위 수여식 RSVP 까지 확인 바랍니다.',
        receivedAt: '2026-06-09 17:02',
        trustLabel: 'pending'
      }
    ]
  },
  scenario: {
    current: null,
    step: 0,
    completed: []
  },
  log: [
    {
      ts: '00:00:00',
      actor: 'isp',
      message: '시연 시작 — 시나리오를 우측 하단에서 선택해 진행한다.'
    }
  ]
};

export const PROVIDER_DOMAIN = 'bgmail.com';
export const PROVIDER_BCA = 'KT Telecom';
export const PLATFORM_NAME = 'Coupang';
export const PRIMARY_SUBSCRIBER_ID = 'sub-001';
