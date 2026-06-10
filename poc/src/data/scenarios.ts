import type { ScenarioId, ScenarioStep, DemoState } from '../types';
import { PROVIDER_BCA, PRIMARY_SUBSCRIBER_ID } from './actors';

const BMAIL_ADDRESS = 'j.park@bgmail.com';
const ISSUE_DATE = '2026-06-10';
const EXPIRY_DATE = '2027-06-10';
const CERT_JTI = 'cert_kt_2706101a';
const CHANGE_TOKEN_JTI = 'chg_isp_2706102b';

export const SCENARIOS: Record<
  ScenarioId,
  { title: string; desc: string; steps: ScenarioStep[] }
> = {
  S1: {
    title: 'S1. Registration',
    desc: 'Zero-copy certificate issuance — User → ISP → bCA',
    steps: [
      {
        num: 1,
        actor: 'user',
        targetId: 's1-user-submit',
        buttonLabel: 'Submit registration request',
        instruction:
          'Send a new bMail ID registration request from the Mailbox tab. The request carries only the chosen domain and the permission token — no PII.',
        message: 'User → ISP: registration request submitted (bmail_id, bca=KT, mode=real)',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        targetId: 's1-isp-forward',
        buttonLabel: 'Forward certification request to bCA',
        instruction:
          'Forward the certification request from the bMail ISP tab to KT (the bCA). The payload contains no personal data.',
        message: 'ISP → bCA: certification request relayed (no PII attached)',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'bca',
        targetId: 's1-bca-issue',
        buttonLabel: 'Match subscriber and sign certificate',
        instruction:
          'On the bCA tab, match the subscriber in the carrier database and issue a signed certificate JWT. PII stays here.',
        message: 'bCA: subscriber matched, Ed25519 signed certificate issued',
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
        targetId: 's1-isp-activate',
        buttonLabel: 'Verify certificate and activate bMail ID',
        instruction:
          'Verify the signed certificate JWT on the bMail ISP tab and activate the new bMail ID. The ISP stores no PII columns.',
        message: 'ISP: JWT verified, bMail ID activated (no PII persisted)',
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
        targetId: 's1-user-ack',
        buttonLabel: 'Confirm new bMail ID',
        instruction:
          'Return to the Mailbox tab and confirm the new bMail ID is active. The domain bgmail.com now signals lifelong identifiability.',
        message: `User: ${BMAIL_ADDRESS} is now active and lifelong-identifiable`,
        apply: (s: DemoState) => {
          s.user.activeBmailId = BMAIL_ADDRESS;
        }
      }
    ]
  },
  S2: {
    title: 'S2. ID Migration',
    desc: 'Move expiring external ID to a lifelong bMail ID, preserve marketplace history',
    steps: [
      {
        num: 1,
        actor: 'user',
        targetId: 's2-user-request',
        buttonLabel: 'Start ID migration',
        instruction:
          'On the Mailbox tab, request migration of the expiring university email to the new bMail ID.',
        message: 'User → ISP: ID migration requested (jpark@univ.edu → j.park@bgmail.com)',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'bca',
        targetId: 's2-bca-reverify',
        buttonLabel: 'Re-verify identical owner',
        instruction:
          'On the bCA tab, re-verify that both IDs belong to the same subscriber (Jiyeon Park).',
        message: 'bCA: both IDs confirmed as the same subscriber',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'isp',
        targetId: 's2-isp-token',
        buttonLabel: 'Issue signed change token',
        instruction:
          'On the bMail ISP tab, issue a signed change token binding the old ID, the new ID, and the bCA confirmation.',
        message: 'ISP: change token issued (signed by ISP, bound to bCA confirmation JTI)',
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
        targetId: 's2-platform-remap',
        buttonLabel: 'Apply token and remap member',
        instruction:
          'On the Marketplace tab, verify the change token signature and remap the member ID. Purchases and reviews are preserved.',
        message: 'Coupang: token verified, member ID remapped (history preserved)',
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
        targetId: 's2-user-ack',
        buttonLabel: 'Confirm migration',
        instruction:
          'Return to the Mailbox tab and confirm the migration is complete. Reviews now carry the "identifiable author" label.',
        message: 'User: marketplace membership now bMember-tier; reviews tagged identifiable',
        apply: (s: DemoState) => {
          s.user.expiringExternalId = null;
        }
      }
    ]
  },
  S3: {
    title: 'S3. Phishing + Domain Portal',
    desc: 'Detect lookalike domains and verify suspicious mail via backup channel',
    steps: [
      {
        num: 1,
        actor: 'isp',
        targetId: 's3-isp-lookup',
        buttonLabel: 'Look up bgmail.net in the registry',
        instruction:
          'On the bMail ISP tab, look up bgmail.net in the public domain portal.',
        message: 'ISP: bgmail.net queried — not present in domain registry',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        targetId: 's3-isp-classify',
        buttonLabel: 'Classify as fake domain',
        instruction:
          'On the bMail ISP tab, classify bgmail.net as a lookalike fake.',
        message: 'ISP: bgmail.net flagged as fake (lookalike of bgmail.com)',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'isp',
        targetId: 's3-isp-notify',
        buttonLabel: 'Notify sender via backup channel',
        instruction:
          'On the bMail ISP tab, log a phishing report and notify the sender through the registered backup channel (KakaoTalk) — never via the suspect email.',
        message: 'ISP: phishing report recorded, backup-channel notification sent',
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
        targetId: 's3-user-deny',
        buttonLabel: 'Deny — not my message',
        instruction:
          'On the Mailbox tab, deny ownership of the suspicious message. Phishing is now confirmed.',
        message: 'User: denied ownership, phishing confirmed',
        apply: (s: DemoState) => {
          s.isp.phishingReports = s.isp.phishingReports.map((r) =>
            r.id === 'rep-001' ? { ...r, status: 'phishing-confirmed' } : r
          );
        }
      }
    ]
  },
  S4: {
    title: 'S4. Receiver Inbox',
    desc: 'Apply per-sender trust labels in the inbox from the domain registry',
    steps: [
      {
        num: 1,
        actor: 'user',
        targetId: 's4-user-open',
        buttonLabel: 'Open inbox',
        instruction:
          'On the Mailbox tab, open the inbox. Three unread messages are waiting.',
        message: 'User: inbox opened (3 unread)',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        targetId: 's4-isp-batch-lookup',
        buttonLabel: 'Batch-lookup sender domains',
        instruction:
          'On the bMail ISP tab, batch-lookup the three sender domains in the registry.',
        message:
          'Mail client → ISP: batch lookup (bgmail.com, bgmail.net, univ.edu)',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'user',
        targetId: 's4-user-label-1',
        buttonLabel: 'Apply label: prof.lee@bgmail.com (certified)',
        instruction:
          'On the Mailbox tab, apply the certified label to the message from prof.lee@bgmail.com.',
        message: 'Mail client: prof.lee@bgmail.com → certified sender (KT-attested bgmail.com)',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) =>
            m.from === 'prof.lee@bgmail.com' ? { ...m, trustLabel: 'certified' } : m
          );
        }
      },
      {
        num: 4,
        actor: 'user',
        targetId: 's4-user-label-2',
        buttonLabel: 'Apply label: support@bgmail.net (suspicious)',
        instruction:
          'On the Mailbox tab, apply the suspicious label to the message from support@bgmail.net.',
        message: 'Mail client: support@bgmail.net → suspicious (lookalike not in registry)',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) =>
            m.from === 'support@bgmail.net' ? { ...m, trustLabel: 'fake' } : m
          );
        }
      },
      {
        num: 5,
        actor: 'user',
        targetId: 's4-user-label-3',
        buttonLabel: 'Apply label: notice@univ.edu (unverified)',
        instruction:
          'On the Mailbox tab, apply the unverified label to the message from notice@univ.edu.',
        message: 'Mail client: notice@univ.edu → unverified domain (no identifiability guarantee)',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) =>
            m.from === 'notice@univ.edu' ? { ...m, trustLabel: 'unknown' } : m
          );
        }
      },
      {
        num: 6,
        actor: 'user',
        targetId: 's4-user-report',
        buttonLabel: 'Report the suspicious message',
        instruction:
          'On the Mailbox tab, report the suspicious message (support@bgmail.net) to the ISP for verification.',
        message: 'User → ISP: phishing report forwarded for the suspicious message',
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
