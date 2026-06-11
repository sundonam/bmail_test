# bMail ID Infrastructure — PoC

논문 *"A Prescriptive Design for Trustworthy Online Identifiers: The bMail ID Approach"* (Lee et al., 2025) 의 4-stakeholder 모델(User / bMail ISP / bCA / bMember Platform) 을 시연용으로 구현한 단일 SPA 다.

백엔드·데이터베이스·실제 서명 키 없이 in-memory 시뮬레이션만으로 동작한다. 우측 하단 가이드 패널이 안내하는 대로 각 화면의 하이라이트된 컨트롤을 직접 눌러 단계를 진행하는 사용자 주도 방식이다.

## Quickstart

```bash
cd 4_bmail/poc
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 을 연다.

## 시나리오

- **S1. Registration** — User → ISP → bCA Zero-copy 인증서 발급
- **S2. ID-change** — `jpark@univ.edu` 만료, `j.park@bgmail.com` 으로 이전, Coupang 회원·리뷰 이력 보존
- **S3. Phishing + Domain portal** — 의심 메일 백업 채널 확인 및 도메인 등록부 조회
- **S4. Receiver inbox** — 받은 편지함에서 발신자 도메인 기반 신뢰 라벨 즉시 부착
- **S5. Identification request** — 수신 측(플랫폼) 의 발신자 식별 요청, 발신자 승인 후 bCA 확인서 발급

우측 하단 패널에서 시나리오를 선택해 시작한다. S1(등록 폼 제출), S2(이전 배너), S3(`bgmail.net` 도메인 조회) 은 해당 화면의 첫 컨트롤을 직접 눌러도 자연스럽게 시작된다. 한 시나리오가 진행 중일 때는 다른 시나리오 시작이 잠기며, 종료 후 Reset 버튼으로 상태를 되돌릴 수 있다.

## 명령

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 개발 서버 (Vite, 5173 포트) |
| `npm run build` | 타입 체크 + 프로덕션 번들 |
| `npm run preview` | 빌드 산출물 로컬 서빙 |
