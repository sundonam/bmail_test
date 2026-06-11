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
        content: 'Latex pillow held up well through my first month in the dorm. Good firmness.',
        identifiable: false,
        postedAt: '2024-03-12'
      },
      {
        id: 'rev-002',
        memberId: 'coupang-44120',
        content: 'Laptop stand for grad presentations. Angle adjustment is solid, no wobble.',
        identifiable: false,
        postedAt: '2024-11-08'
      }
    ]
  },
  user: {
    activeBmailId: null,
    expiringExternalId: 'jpark@univ.edu',
    mailboxView: 'inbox',
    selectedEmailId: null,
    inbox: [
      {
        id: 'mail-001',
        from: 'prof.lee@bgmail.com',
        fromDisplay: 'Prof. Hyunwoo Lee',
        subject: 'Re: joint research meeting next week',
        preview:
          'Jiyeon, can we sit down Tuesday afternoon to talk through the IS journal submission timeline?',
        receivedAt: '2026-06-11 09:14',
        trustLabel: 'certified'
      },
      {
        id: 'mail-002',
        from: 'support@bgmail.net',
        fromDisplay: 'bMail Support',
        subject: '[Urgent] Change your bMail account password now',
        preview:
          'For your account security, please reset your password immediately using the link below.',
        receivedAt: '2026-06-11 08:47',
        trustLabel: 'pending'
      },
      {
        id: 'mail-003',
        from: 'notice@univ.edu',
        fromDisplay: 'Graduate School Office',
        subject: 'Graduation administrative notice',
        preview:
          'A reminder of the administrative procedures and the RSVP deadline for the degree ceremony.',
        receivedAt: '2026-06-10 17:02',
        trustLabel: 'unknown'
      },
      {
        id: 'mail-004',
        from: 'orders@coupang.com',
        fromDisplay: 'Coupang Receipts',
        subject: 'Your order has shipped — laptop stand and accessories',
        preview:
          'Tracking number 5810-2937 was handed to the carrier this morning. Expected delivery in 1–2 days.',
        receivedAt: '2026-06-10 16:28',
        trustLabel: 'unknown'
      },
      {
        id: 'mail-005',
        from: 'yuna.kim@bgmail.com',
        fromDisplay: 'Yuna Kim',
        subject: 'Lunch tomorrow at the campus cafe?',
        preview:
          'Free around 12:30? Trying to compare notes on the qualifying exam reading list before the weekend.',
        receivedAt: '2026-06-10 14:05',
        trustLabel: 'certified'
      },
      {
        id: 'mail-006',
        from: 's.choi@bnaver.com',
        fromDisplay: 'Sangmin Choi',
        subject: 'Quick comments on the journal draft',
        preview:
          'Section 3 reads cleanly now. Two small edits in section 4 — left them as suggestions in the doc.',
        receivedAt: '2026-06-10 11:33',
        trustLabel: 'certified'
      },
      {
        id: 'mail-007',
        from: 'verify@bgmail-services.com',
        fromDisplay: 'bMail Verification',
        subject: 'Verify your account or it will be suspended',
        preview:
          'Our records show your account has been flagged. Confirm ownership within 24 hours to avoid suspension.',
        receivedAt: '2026-06-10 10:11',
        trustLabel: 'pending'
      },
      {
        id: 'mail-008',
        from: 'library@univ.edu',
        fromDisplay: 'University Library',
        subject: 'Books due in 3 days',
        preview:
          'Two items in your library account are due on 2026-06-13. Renew online or return at any campus library.',
        receivedAt: '2026-06-09 18:42',
        trustLabel: 'unknown'
      },
      {
        id: 'mail-009',
        from: 'm.kang@bgmail.com',
        fromDisplay: 'Minjun Kang',
        subject: 'Photos from the conference dinner',
        preview:
          'Shared the album in the lab Slack but uploading here too in case anyone misses it. Good group shot at the end.',
        receivedAt: '2026-06-09 16:20',
        trustLabel: 'certified'
      },
      {
        id: 'mail-010',
        from: 'eunji.choi@bnaver.com',
        fromDisplay: 'Eunji Choi',
        subject: 'Re: capstone group submission timeline',
        preview:
          'Confirmed with the TA — we can submit Friday morning. I will push the final commit before then.',
        receivedAt: '2026-06-09 14:55',
        trustLabel: 'certified'
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
      message: 'Demo ready. Select a scenario from the bottom-right panel to begin.'
    }
  ]
};

export const PROVIDER_DOMAIN = 'bgmail.com';
export const PROVIDER_BCA = 'KT Telecom';
export const PLATFORM_NAME = 'Coupang';
export const PRIMARY_SUBSCRIBER_ID = 'sub-001';
