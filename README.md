# bMail ID Infrastructure — Research PoC

An executable design-science artifact for *"A Prescriptive Design for Trustworthy Online Identifiers: The bMail ID Approach"* (Lee et al., 2025). The PoC turns the paper's four-stakeholder identity infrastructure into a guided, click-through demo with five end-to-end scenarios.

**Live demo:** [https://bmail-test-qq4f.vercel.app/](https://bmail-test-qq4f.vercel.app/)

---

## What you can demonstrate

| Scenario | Steps | What it shows |
|---|---|---|
| **S1. Register a bMail ID** | 5 | Zero-copy certificate issuance. Submit a real registration form, then watch the request travel User → ISP → bCA → ISP → User. PII stays at the bCA; the ISP holds only signed JWTs. |
| **S2. Migrate university email** | 5 | Move an expiring external email (`jpark@univ.edu`) onto a lifelong bMail ID. The Coupang member record is remapped via a signed change token while purchases and reviews are preserved. |
| **S3. Phishing + Domain portal** | 3 | Look up a lookalike domain (`bgmail.net`) in the public registry, then verify the suspected sender through their registered backup channel — never via the compromised email. |
| **S4. Trust labels in the inbox** | 3 | One batch domain sync attaches per-sender trust labels (`verified`, `suspicious`, `unverified`) to the ten messages already sitting in the inbox. The recipient distinguishes senders at a glance. |
| **S5. Identification request** | 4 | A receiver (Coupang seller-verification) asks the ISP to confirm the sender. The sender must approve before the bCA issues an identification certificate — receiver-initiated, sender-gated, zero-copy. |

Each scenario is driven by clicking the actual UI control inside the relevant tab — a form Submit button, a row inside an operator inbox, a Report-phishing button inside an open message. A thin progress bar at the top of the screen simulates the network round-trip.

---

## Quickstart (local)

```bash
cd poc
npm install
npm run dev
```

Open `http://localhost:5173`. The bottom-right panel lists the five scenarios, then walks through the active one: which tab to be on, which highlighted control to click next, and where you are in the multi-actor flow. S1 (registration form), S2 (migration banner), and S3 (`bgmail.net` domain lookup) also auto-start when you press the relevant control directly, without first picking the scenario from the panel.

---

## Five-tab product shell

The top bar carries a small `b` wordmark on the left, the five tabs in the middle, and a signed-in user chip ("Jiyeon Park" + current address) on the right.

- **Dashboard** — KPI strip (verified domains, issued IDs, migrated accounts, identifiable reviews) plus colour-coded security/account alerts and a recent-activity feed.
- **Mail** — A real-feeling mailbox: Compose button, search field, Inbox / Sent / Archive folder chips, a ten-message list with sender avatars and trust badges, an email detail page with Reply / Report-phishing actions, and a bMail registration form.
- **ISP Console** — Operator stats (registered users, IDs issued this session, certified domains, open verifications), the inbox of pending requests, the domain registry, recent fake-domain intercepts, and the public domain lookup portal.
- **bCA (KT)** — Subscriber lookup with PII (real names, masked national IDs, phone numbers) and the certificate ledger. Stats highlight that the ISP holds zero PII records.
- **Coupang** — Marketplace operator console: 2.1M total members, 847K bMembers, the review trust layer, and the "Unreachable members — why the ID-change protocol matters" card that quantifies the customer-retention story (KRW 2.4B annually at risk).

---

## Four-stakeholder model

```mermaid
flowchart LR
    U[User]
    I[bMail ISP]
    C[bCA]
    P[bMember Platform]

    U -- registration, identity reply --> I
    I -- certification request (zero-copy) --> C
    C -- signed certificate JWT --> I
    I -- signed change token --> P
    P -- identification request --> I
    U -- enroll with bMail ID --> P
```

- **User** — owns the bMail ID, approves identity disclosures, initiates ID migration.
- **bMail ISP** — operates the domain registry, issues bMail IDs, orchestrates change tokens, gates identification requests behind sender approval. Holds no PII columns.
- **bCA (Certification Authority)** — holds the real PII (telco subscriber records). Issues signed certificate JWTs without ever transmitting the underlying data.
- **bMember Platform** — verifies change tokens, remaps member IDs, tags reviews from certified bMail authors as identifiable, and can submit identification requests for high-trust workflows.

---

## Repo layout

```
4_bmail/
├── source/        Original paper PDF
├── prototype/     Initial HTML mockup (visual reference only)
├── poc/           Working demo (Vite + React + TS + Zustand)
│   ├── src/
│   │   ├── data/        Fixtures (actors, scenarios, domains)
│   │   ├── state/       Zustand store + scenario runner
│   │   ├── components/  TrustBadge, PendingRequest, Avatar, ProgressBar, ScenarioPanel
│   │   └── views/       DashboardView, UserView (mail), ISPView, BCAView, PlatformView
│   └── docs/flows/      Mermaid sequence diagrams for S1–S5
├── CLAUDE.md      Developer guide
└── README.md      This file
```

---

## How it works

- **No backend.** Every "API call" is a Zustand mutation wrapped in a 700 ms `setTimeout` so the top progress bar can play and buttons can flicker to "Processing…". Subscriber PII, certificates, change tokens, identification requests, and phishing reports all live in a single client-side store.
- **Single source of truth.** Whichever tab you're on, you're reading the same store. The bCA tab keeps subscriber records that the ISP tab provably never touches — the boundary is enforced at the data-model level, not just visually.
- **Scenarios decoupled from views.** Each scenario step carries `targetId`, `buttonLabel`, `instruction`, and optional `pendingTitle` / `pendingBody`. ISP / bCA / Platform steps render automatically inside the actor's "Inbox — pending requests" card; user steps anchor to specific UI affordances (form submit, banner CTA, mail row, Report button, approval toast).
- **Fixed fixtures.** One user (Jiyeon Park, `jpark@univ.edu` → `j.park@bgmail.com`), one bCA (KT Telecom), two certified ISP domains (`bgmail.com`, `bnaver.com`), one marketplace (Coupang), two lookalikes (`bgmail.net`, `bgmail-services.com`), and a ten-message inbox preseeded with a realistic mix of verified, unverified, and pending senders.

---

## Design principles

- One accent color (indigo `#1F2A44`). No coloured status badges anywhere except the two deliberate exceptions below.
- No side navigation, no accent strips, no glow, no gradients. Visual hierarchy comes from type size, weight, and whitespace.
- **Two intentional colour exceptions, both grounded in the paper's argument:**
  - `TrustBadge` in the inbox — verified / suspicious / unverified / pending — uses a restrained palette plus a small SVG icon. This is the receiver-side trust signal the paper centres.
  - Dashboard `status-dot` and `alert-row` use the same restrained palette for security and account alerts.
- Top tabs only — never a left sidebar.

Detailed design notes and the procedure for adding a sixth scenario are in [CLAUDE.md](CLAUDE.md).

---

## Further reading

- [Developer guide](CLAUDE.md)
- [PoC quickstart](poc/README.md)
- [S1 Registration sequence diagram](poc/docs/flows/S1-registration.md)
- [S2 ID migration sequence diagram](poc/docs/flows/S2-id-change.md)
- [S3 Phishing + Domain portal sequence diagram](poc/docs/flows/S3-phishing-and-portal.md)
- [S4 Receiver inbox sequence diagram](poc/docs/flows/S4-inbox.md)
- [S5 Identification request sequence diagram](poc/docs/flows/S5-identification.md)

---

## Reference

Lee, J. K., et al. (2025). *A Prescriptive Design for Trustworthy Online Identifiers: The bMail ID Approach*. PDF available under [`source/`](source/).
