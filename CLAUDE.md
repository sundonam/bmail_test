# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

논문 *"A Prescriptive Design for Trustworthy Online Identifiers: The bMail ID Approach"* (Lee et al., 2025) 의 4-stakeholder 신원 인프라(User / bMail ISP / bCA / bMember Platform) 를 학술 시연용으로 구현한 PoC 다. 실제 서비스 구축이 아닌 **시나리오 기반 시각 시연**을 목표로 한다.

- 원본 논문 PDF: [source/](source/)
- 초기 디자인 mock (시각 레퍼런스, 차용하지 않음): [prototype/](prototype/)
- 실제 PoC 코드: [poc/](poc/)
- 프로젝트 계획 (v2): `~/.claude/plans/source-cheerful-dolphin.md`

## 명령

```bash
cd 4_bmail/poc
npm install         # 최초 1회
npm run dev         # 개발 서버 (http://localhost:5173)
npm run build       # tsc -b + vite build, 타입 회귀 검증
npm run preview     # 빌드 산출물 로컬 서빙
npm run lint        # ESLint
```

## 아키텍처

### 단일 SPA · 백엔드 없음
모든 상태와 "API 호출"은 클라이언트 측 in-memory 시뮬레이션이다. 실제 FastAPI/SQLite/JWT 서명은 의도적으로 **포함하지 않는다**. 시연 시 시각적 일관성과 매끄러운 흐름이 더 중요하다고 판단했다.

### 단일 진실 소스 (Zustand store)
[poc/src/state/store.ts](poc/src/state/store.ts) 가 4개 액터(`bca`, `isp`, `platform`, `user`)의 상태를 단일 트리로 보관한다. 어느 탭에서 보든 같은 데이터 위를 본다. 시나리오 진행은 `startScenario(id)` 가 비동기로 단계 배열을 순회하며 mutation + log push 를 반복한다(`STEP_DELAY_MS = 650`).

### 시나리오 정의 ↔ 뷰 분리
[poc/src/data/scenarios.ts](poc/src/data/scenarios.ts) 는 S1/S2/S3 각 시나리오를 **(num, actor, message, apply)** 스텝 배열로 표현한다. `apply(state)` 가 store 의 mutation 을 수행한다. 뷰는 store 만 구독하므로 시나리오를 추가·수정할 때 뷰 코드를 건드리지 않아도 된다.

### 4개 뷰 + 상단 탭
사이드바를 의도적으로 쓰지 않는다(아래 디자인 규칙 참고). [poc/src/App.tsx](poc/src/App.tsx) 가 상단 탭 4개로 액터 콘솔을 전환한다. 각 뷰는 [poc/src/views/](poc/src/views/) 아래 위치한다.

### 시나리오 컨트롤
[poc/src/components/ScenarioPanel.tsx](poc/src/components/ScenarioPanel.tsx) 가 우측 하단 고정 패널로 모든 시나리오 시작·진행 표시·초기화를 담당한다. 자유 입력은 받지 않는다 — 시연 흐름이 깨지지 않도록 모든 입력값을 fixture 로 고정했다.

## 핵심 디자인 규칙

UI 변경·새 컴포넌트 추가 시 반드시 지킬 것:

- **좌측 보더 강조 금지** — 사이드바 nav 또는 카드에 `border-left: Npx solid color` 같은 강조 표현을 절대 추가하지 않는다. 활성 상태는 배경 톤(`--accent-soft`) 또는 굵기로만 표현한다. 사이드바 자체를 쓰지 않는다.
- **단일 액센트 색** — 액센트는 `--accent` (`#1F2A44`) 한 가지만. 성공/경고/오류용 컬러 뱃지를 만들지 않는다. 상태는 텍스트 라벨(`certified`, `fake`, `pass`, `fail`) 로만 표시한다.
- **이모지·중간점(•) 금지** — 글로벌 CLAUDE.md 규칙. 구분이 필요하면 줄바꿈, 쉼표, 좁은 회색 캡션 사용.
- **그라데이션·glow·shadow 금지** (시나리오 패널의 약한 그림자 1개 예외)
- **위계는 크기·굵기·여백으로** — 색상으로 위계 만들지 않는다.
- 디자인 토큰은 [poc/src/index.css](poc/src/index.css) 의 `:root` 변수만 사용. 인라인 컬러 리터럴 금지.

## 한국어 출력 규칙

본 사용자(윤상혁 교수) 의 글로벌 CLAUDE.md 가 적용된다:
- 한국어 문장은 `~있다`, `~하다` 체로 종결한다.
- 이모지·중간점 사용 금지.
- 동일 표현 반복을 지양하고 다양한 어휘를 쓴다.
- 불확실한 정보는 "확인이 필요하다" 로 명시한다.

## 시나리오 추가·수정 시

1. [poc/src/data/scenarios.ts](poc/src/data/scenarios.ts) 의 `SCENARIOS` 객체에 `S4`, `S5` 등의 키로 시나리오를 추가한다.
2. 각 스텝은 `{ num, actor, message, apply }` 형태이며 `apply(s)` 는 `DemoState` 트리를 mutation 한다(JSON-clone 된 draft 위에서 동작).
3. 새 데이터 필드가 필요하면 [poc/src/types.ts](poc/src/types.ts) 의 `DemoState` 와 [poc/src/data/actors.ts](poc/src/data/actors.ts) 의 `initialState` 를 함께 갱신한다.
4. ID 목록 상수 (`IDS`) 가 [poc/src/components/ScenarioPanel.tsx](poc/src/components/ScenarioPanel.tsx) 와 store 의 `startScenario` 시그니처에서 사용되므로 `ScenarioId` 유니온도 함께 확장한다.

## 시연 검증 체크리스트 (수동)

`npm run dev` 후 확인:
1. 사이드바 또는 좌측 액센트 보더가 어디에도 없는가?
2. **Zero-copy 검증** — S1 실행 후 bCA 탭의 가입자 표에 PII 가 있고, ISP 탭의 어디에도 동일 PII (전화번호·주민번호) 가 노출되지 않는가?
3. **ID-change 이력 보존** — S2 실행 후 Platform 탭에서 회원 ID 가 `jpark@univ.edu` → `j.park@bgmail.com` 으로 바뀌었지만 리뷰·구매 수는 그대로 유지되는가?
4. **도메인 포털** — ISP 탭에서 `bgmail.com` / `bgmail.net` / `example.com` 버튼이 각각 다른 판정(certified / fake / unknown) 을 보이는가?

## 의도적으로 하지 않은 것

- 실제 백엔드 서비스, Docker, SQLite, JWT 서명 — 시연 PoC 가 목적이므로 제외.
- 자유 입력 폼 — 시나리오 흐름이 깨지지 않도록 모든 입력은 fixture 로 고정.
- DKIM/SPF/DMARC 실제 검증 — 도메인 등록부의 `dkimStatus` 텍스트 라벨로만 표시.
- 다국가 시드, 다중 bCA — 단일 사용자(Jiyeon Park), 단일 bCA(KT), 단일 플랫폼(Coupang) 로 고정.

## 새 화면을 추가할 때

상단 탭 4개 구조를 유지하는 것이 원칙이다. 추가가 불가피하면 새 카드 영역으로 기존 뷰에 흡수시키고, 그래도 안 되면 탭을 늘리되 좌측 사이드바로 회귀하지 않는다.
