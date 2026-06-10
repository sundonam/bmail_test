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
        preview: 'Jiyeon, can we sit down Tuesday afternoon to talk through the IS journal submission timeline?',
        receivedAt: '2026-06-10 09:14',
        trustLabel: 'pending'
      },
      {
        id: 'mail-002',
        from: 'support@bgmail.net',
        fromDisplay: 'bMail Support',
        subject: '[Urgent] Change your bMail account password now',
        preview: 'For your account security, please reset your password immediately using the link below.',
        receivedAt: '2026-06-10 08:47',
        trustLabel: 'pending'
      },
      {
        id: 'mail-003',
        from: 'notice@univ.edu',
        fromDisplay: 'Graduate School Office',
        subject: 'Graduation administrative notice',
        preview: 'A reminder of the administrative procedures and the RSVP deadline for the degree ceremony.',
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
      message: 'Demo ready. Select a scenario from the bottom-right panel to begin.'
    }
  ]
};

export const PROVIDER_DOMAIN = 'bgmail.com';
export const PROVIDER_BCA = 'KT Telecom';
export const PLATFORM_NAME = 'Coupang';
export const PRIMARY_SUBSCRIBER_ID = 'sub-001';
