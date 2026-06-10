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
    title: 'S1. Register a bMail ID',
    desc: 'Zero-copy certificate issuance — User → ISP → bCA',
    steps: [
      {
        num: 1,
        actor: 'user',
        targetId: 's1-form-submit',
        buttonLabel: 'Submit registration',
        instruction:
          'In the registration form, review the prefilled values and click Submit registration.',
        message: 'User → ISP: registration request submitted (j.park@bgmail.com, mode=real, bca=KT)',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        targetId: 's1-isp-forward',
        buttonLabel: 'Forward to bCA',
        instruction:
          'A new registration request is queued at the ISP. Forward it to KT for certification.',
        pendingTitle: 'New registration request',
        pendingBody:
          'Requester: j.park@bgmail.com · selected bCA: KT Telecom · mode: real name. Forward to KT for subscriber matching.',
        message: 'ISP → bCA: certification request relayed (no PII attached)',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'bca',
        targetId: 's1-bca-issue',
        buttonLabel: 'Match subscriber and sign certificate',
        instruction:
          'KT has received a certification request. Match the subscriber and issue a signed certificate.',
        pendingTitle: 'Certification request from bMail ISP',
        pendingBody:
          'Target: j.park@bgmail.com · matched subscriber sub-001 (Jiyeon Park). Issue an Ed25519-signed certificate JWT. PII does not leave this console.',
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
        buttonLabel: 'Verify and activate bMail ID',
        instruction:
          'KT has returned a signed certificate. Verify the JWT and activate the bMail ID.',
        pendingTitle: 'Certificate received from KT',
        pendingBody:
          'JTI: cert_kt_2706101a · holder: j.park@bgmail.com · valid until 2027-06-10. Verify the signature and activate the bMail ID for the user.',
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
          s.user.activeBmailId = BMAIL_ADDRESS;
          s.user.mailboxView = 'inbox';
        }
      },
      {
        num: 5,
        actor: 'user',
        targetId: 's1-user-ack',
        buttonLabel: 'Got it',
        instruction:
          'Your bMail ID is active. Acknowledge the notification.',
        message: `User: ${BMAIL_ADDRESS} is now active and lifelong-identifiable`,
        apply: () => {}
      }
    ]
  },
  S2: {
    title: 'S2. Migrate university email',
    desc: 'Move the expiring external ID to a lifelong bMail ID',
    steps: [
      {
        num: 1,
        actor: 'user',
        targetId: 's2-user-start',
        buttonLabel: 'Start migration',
        instruction:
          'On the migration banner, click Start migration to begin moving membership history to your bMail ID.',
        message: 'User → ISP: ID migration requested (jpark@univ.edu → j.park@bgmail.com)',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'bca',
        targetId: 's2-bca-reverify',
        buttonLabel: 'Confirm same subscriber',
        instruction:
          'KT has received a re-verification request. Confirm that both IDs belong to the same subscriber.',
        pendingTitle: 'Re-verification request from bMail ISP',
        pendingBody:
          'Old ID: jpark@univ.edu · New ID: j.park@bgmail.com. Confirm both belong to subscriber sub-001 (Jiyeon Park).',
        message: 'bCA: both IDs confirmed as the same subscriber',
        apply: () => {}
      },
      {
        num: 3,
        actor: 'isp',
        targetId: 's2-isp-token',
        buttonLabel: 'Issue change token',
        instruction:
          'KT has confirmed the subscriber match. Issue a signed change token to bind the old and new IDs.',
        pendingTitle: 'Re-verification confirmed by KT',
        pendingBody:
          'Issue an ISP-signed change token binding jpark@univ.edu and j.park@bgmail.com with the bCA confirmation JTI.',
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
          'A signed change token has arrived. Verify it and remap the member ID — purchases and reviews are preserved.',
        pendingTitle: 'Change token received',
        pendingBody:
          'JTI: chg_isp_2706102b · Old: jpark@univ.edu → New: j.park@bgmail.com. Verify the signature and remap member coupang-44120.',
        message: 'Coupang: token verified, member ID remapped (history preserved)',
        apply: (s: DemoState) => {
          s.platform.members = s.platform.members.map((m) =>
            m.platformMemberId === 'coupang-44120' ? { ...m, bmailId: BMAIL_ADDRESS } : m
          );
          s.platform.reviews = s.platform.reviews.map((r) =>
            r.memberId === 'coupang-44120' ? { ...r, identifiable: true } : r
          );
          s.user.expiringExternalId = null;
        }
      },
      {
        num: 5,
        actor: 'user',
        targetId: 's2-user-ack',
        buttonLabel: 'Got it',
        instruction:
          'Migration complete. Your reviews now carry the identifiable-author label.',
        message: 'User: marketplace membership now bMember-tier; reviews tagged identifiable',
        apply: () => {}
      }
    ]
  },
  S3: {
    title: 'S3. Phishing + Domain portal',
    desc: 'Detect a lookalike domain and verify via backup channel',
    steps: [
      {
        num: 1,
        actor: 'isp',
        targetId: 's3-isp-lookup',
        buttonLabel: 'Look up bgmail.net',
        instruction:
          'In the Public Domain Portal, click bgmail.net to look it up against the registry.',
        message: 'ISP: bgmail.net queried — not present in domain registry',
        apply: () => {}
      },
      {
        num: 2,
        actor: 'isp',
        targetId: 's3-isp-notify',
        buttonLabel: 'Notify sender via backup channel',
        instruction:
          'bgmail.net is a lookalike. Log a phishing report and notify the suspected sender via their registered backup channel.',
        pendingTitle: 'Lookalike domain detected',
        pendingBody:
          'bgmail.net was queried and found absent. A report concerns h.lee@bgmail.net. Notify the real h.lee via KakaoTalk — never via the suspect email.',
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
        num: 3,
        actor: 'user',
        targetId: 's3-user-deny',
        buttonLabel: 'Deny — not my message',
        instruction:
          'A backup-channel verification request appeared in your mailbox. Deny ownership to confirm phishing.',
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
    title: 'S4. Trust labels in the inbox',
    desc: 'Apply per-sender trust labels from the domain registry',
    steps: [
      {
        num: 1,
        actor: 'user',
        targetId: 's4-user-open',
        buttonLabel: 'Open suspicious message',
        instruction:
          'Click the message from bMail Support (the suspicious one) to open it.',
        message: 'User: opened suspicious message (support@bgmail.net)',
        apply: (s: DemoState) => {
          s.user.selectedEmailId = 'mail-002';
          s.user.mailboxView = 'detail';
        }
      },
      {
        num: 2,
        actor: 'isp',
        targetId: 's4-isp-sync',
        buttonLabel: 'Sync sender trust labels',
        instruction:
          'Run a batch domain lookup for the three sender domains and propagate trust labels to the inbox.',
        pendingTitle: 'Batch trust-label sync request',
        pendingBody:
          'Mail client requested trust labels for prof.lee@bgmail.com, support@bgmail.net, and notice@univ.edu. Apply registry verdicts.',
        message: 'Mail client → ISP: batch sync verdicts (certified, fake, unknown)',
        apply: (s: DemoState) => {
          s.user.inbox = s.user.inbox.map((m) => {
            if (m.from === 'prof.lee@bgmail.com') return { ...m, trustLabel: 'certified' };
            if (m.from === 'support@bgmail.net') return { ...m, trustLabel: 'fake' };
            if (m.from === 'notice@univ.edu') return { ...m, trustLabel: 'unknown' };
            return m;
          });
        }
      },
      {
        num: 3,
        actor: 'user',
        targetId: 's4-user-report',
        buttonLabel: 'Report phishing',
        instruction:
          'In the open message, click Report phishing to file the lookalike with the ISP.',
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
