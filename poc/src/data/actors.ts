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
        product: 'Natural latex pillow 60x40, medium-firm',
        rating: 4,
        helpfulCount: 12,
        content: 'Latex pillow held up well through my first month in the dorm. Good firmness.',
        identifiable: false,
        postedAt: '2024-03-12'
      },
      {
        id: 'rev-002',
        memberId: 'coupang-44120',
        product: 'Aluminum laptop stand, height adjustable',
        rating: 5,
        helpfulCount: 7,
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
        body: [
          'Jiyeon, can we sit down Tuesday afternoon to talk through the IS journal submission timeline? I went over the reviewer comments again this morning and I think we can address all three major points with the data we already have.',
          'If Tuesday does not work, Wednesday before noon is also open on my side. Bring the latest draft of the methods section if you can.',
          'Best, Hyunwoo'
        ],
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
        body: [
          'Dear customer, our security system has detected unusual sign-in activity on your bMail account. For your protection, access will be restricted until you confirm your identity.',
          'Please reset your password immediately using the secure link below. Failure to act within 24 hours will result in permanent suspension of your account.',
          'https://account-security.bgmail.net/reset?id=99114',
          'bMail Account Security Team'
        ],
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
        body: [
          'This is a reminder of the administrative procedures for August graduates. Please confirm your diploma name spelling and mailing address on the student portal by 2026-06-20.',
          'The RSVP deadline for the degree ceremony is 2026-06-25. Note that university email accounts are deactivated 90 days after graduation.',
          'Office of the Registrar, Graduate Affairs Division'
        ],
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
        body: [
          'Your order has shipped. Tracking number 5810-2937 was handed to the carrier this morning. Expected delivery in 1–2 days.',
          'Items: aluminum laptop stand (1), USB-C cable 2m (2). Total KRW 38,900 charged to your registered card.',
          'You can track the delivery in real time from the Orders page of your account.'
        ],
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
        body: [
          'Free around 12:30 tomorrow? Trying to compare notes on the qualifying exam reading list before the weekend.',
          'The campus cafe near the library is quiet around that time. I will grab the corner table if I arrive first.',
          'Yuna'
        ],
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
        body: [
          'Section 3 reads cleanly now. Two small edits in section 4 — left them as suggestions in the shared doc so you can accept or reject them directly.',
          'One thing to double-check: the sample size reported in Table 2 differs from the one in the abstract. Probably a leftover from the earlier draft.',
          'Sangmin'
        ],
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
        body: [
          'Our records show your account has been flagged for verification. Confirm ownership within 24 hours to avoid suspension of all mail services.',
          'Click the verification link and enter your account password to keep your mailbox active: https://verify.bgmail-services.com/confirm',
          'bMail Verification Center'
        ],
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
        body: [
          'Two items in your library account are due on 2026-06-13: "Design Science Research Methods" and "Trust in Digital Markets".',
          'Renew online from your library account or return the items at any campus library. Overdue items pause borrowing privileges.',
          'University Library Services'
        ],
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
        body: [
          'Shared the album in the lab Slack but sending here too in case anyone misses it. Good group shot at the end — the one in front of the venue sign.',
          'If anyone wants the full-resolution files for the lab homepage, let me know and I will upload them to the drive.',
          'Minjun'
        ],
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
        body: [
          'Confirmed with the TA — we can submit Friday morning instead of Thursday night. I will push the final commit before then.',
          'Could you go over the references one more time? Two of the links in the appendix returned 404 when I checked yesterday.',
          'Eunji'
        ],
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
