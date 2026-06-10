# 시나리오 flow 문서

`poc/src/data/scenarios.ts` 의 시나리오 정의와 1:1 대응한다. 시퀀스 다이어그램은 GitHub·VS Code mermaid preview 로 직접 렌더링된다.

- [S1. Registration](S1-registration.md) — User → ISP → bCA Zero-copy 인증서 발급
- [S2. ID-change](S2-id-change.md) — 만료 외부 ID 에서 bMail ID 로 이전, 플랫폼 이력 보존
- [S3. Phishing + Domain portal](S3-phishing-and-portal.md) — 백업 채널 검증 + 공개 도메인 조회
- [S4. Receiver inbox](S4-inbox.md) — 받은 편지함에서 발신자 도메인 기반 신뢰 라벨 즉시 부착

각 문서는 (a) mermaid 시퀀스 다이어그램, (b) 데이터 경계 또는 보존 규칙 표, (c) 시연 시 강조할 포인트의 3개 섹션으로 구성한다.
