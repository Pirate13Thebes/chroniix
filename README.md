# Chronix — Workforce Attendance & Management

Chronix is a workforce attendance and management web app built for Mauritian businesses SMEs in hospitality, construction, retail, factories, and logistics. It replaces manual attendance sheets and error-prone payroll calculations with a single, accountable, real-time system.

No business owner in Mauritius should spend late nights auditing paper attendance sheets to calculate salaries.

Chronix is accessed entirely through the browser at **chronx.netlify.app** there is no downloadable mobile app, so the web app is built mobile-first and must work flawlessly in mobile browsers and iOS webviews.

## Architecture

Chronix is **one shared system with two views**:

- **Admin View** — for owners, HR, and supervisors. Manage employees, locations, shifts, leave requests, reimbursements, and reports.
- **Employee View** — for staff. Clock in/out, view history, and submit requests (leave, reimbursements, etc.).

Everything an employee does appears instantly on the admin side, and every admin decision appears instantly on the employee side.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Backend Server:** Node.js Express server acting as the database manager
- **Database:** JSON-based local database (`db.json`) for full persistence and multi-device sync
- **Planned production backend:** Rust (axum, sqlx, argon2, rust_decimal, tokio-cron-scheduler)

## Screen Inventory

| Area | Admin side | Employee side |
|---|---|---|
| Landing | chronx.netlify.app marketing page (shared) | same |
| Auth | Login with Business/Employee toggle (shared) | same |
| Home | Dashboard (team overview) | Home (own status + clock in/out) |
| Attendance | Attendance (full team table) | (own record lives in History) |
| Leave | Leave Management (approve/reject) | Request (submit + track) |
| Expenses | Reimbursements (approve/reject) | Request (same form, type = expense) |
| Reports | Reports (4 reports + CSV export + payroll teaser) | History (own shifts) |
| Settings | Business-wide rules (10 sections) | Personal preferences (9 sections) |

> Payroll integration is **"Coming Soon"** shown as a disabled/teaser card on Reports, not a working feature yet.

## Local Development & Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend database server

In one terminal, run:

```bash
npm run server
```

This starts the Express server on port `5000`. A `db.json` file will be created automatically in the project root to store database state.

### 3. Start the frontend dev server

In a separate terminal:

```bash
npm run dev
```

## Multi-Device Sync (Phone & Laptop)

The Vite dev server listens on all local network addresses (`host: true`), so you can test on your phone and laptop at the same time:

1. Connect your laptop and phone to the **same Wi-Fi network**.
2. Check the `npm run dev` terminal output for the **Network URL** (e.g. `http://192.168.1.XX:5173`).
3. Open that URL on your phone's browser.
4. Log in as Employee on your phone and Admin on your laptop. Actions like clocking in or requesting leave sync in real time (5-second polling interval) across both devices.

## Design & Conventions

- **Statuses are consistent everywhere:** `Pending` (amber), `In Review` (blue), `Approved` (green), `Rejected` (red); attendance statuses `On-time` (green), `Late` (amber), `Absent` (grey/red).
- **Currency:** MUR (Mauritian Rupee) wherever money appears (reimbursements, payroll).
- **Language:** default English, with French support planned all user-facing strings live in one place (a strings/i18n object) so translation is trivial later.
- **No inline `onclick` handlers.** Use a central event dispatcher with `data-action` attributes and event delegation (`addEventListener` on a root element) inline handlers break in iOS webviews.
- **Mobile-first responsive.** Sidebar collapses on small screens, tables become scrollable or card-based, all tap targets ≥ 44px.
- **One login page, two roles.** A Business/Employee toggle on the login screen decides which side you land on.
- Frontend keeps data access behind a thin API layer / mock-data module, so it can swap from mock data to real endpoints without touching components.
- Logo: `assets/chronix_logo.png` navy wordmark "Chroni" + amber "x", with an amber clock-face person icon inside the C.

## Docs

Before writing UI code, read:

1. `docs/01-DESIGN-SYSTEM.md` brand colors, typography, component patterns, layout rules.
2. `docs/02-SCREENS.md` full per-screen specification for the marketing site, login, Admin side, and Employee side.
3. `docs/03-DATA-AND-EVENTS.md` shared data model, cross-side sync rules, event handling conventions.