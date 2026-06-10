export const DOMAIN_LOOKUPS = [
  {
    domain: 'bgmail.com',
    verdict: 'certified' as const,
    note: 'KT Telecom 인증, DKIM·SPF·DMARC 정상. 발신자는 식별 가능 상태이다.'
  },
  {
    domain: 'bgmail.net',
    verdict: 'fake' as const,
    note: '등록부에 없는 위조 도메인이다. 정상 bMail 도메인과 시각적으로 유사하므로 피싱 의심.'
  },
  {
    domain: 'example.com',
    verdict: 'unknown' as const,
    note: 'bMail 등록부에 없는 일반 도메인이다. 식별 가능성은 보장되지 않는다.'
  }
];
