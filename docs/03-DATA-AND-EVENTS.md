# Chronix — Data Model, Sync Rules, and Event Conventions

## 1. The golden rule of sync

Chronix is **one shared data store rendered through two views**. Never duplicate state per side. Every mutation goes through the store; both views re-render from it.

| Trigger | Effect |
|---|---|
| Employee clocks in | Appears instantly on admin Dashboard (Recent Activity + Employees Present + Team Attendance) and Attendance page |
| Employee clocks out | Shift saved to employee History; hours finalized in admin tables |
| Employee submits a request (leave / half day / remote / permission / expense) | Appears as **Pending** in admin Leave or Reimbursements list + Pending Approvals panels + dashboard counter |
| Admin approves / rejects | Employee's status badge and Approval-in-Progress stepper update immediately; Upcoming Leave panels refresh |
| Admin edits Settings (e.g. allowed clock-in locations, check-in methods) | Employee side enforces the new rule from that moment (location check, available clock-in methods) |
| Everything above | Feeds the Reports page aggregates; payroll integration will consume this later |

## 2. Core entities (mock-data shapes)

Keep these in a single `data`/store module. Field names below are the contract.

```js
// Employee
{ id, firstName, lastName, avatarUrl, email, phone, role: 'employee'|'supervisor'|'hr'|'admin',
  department, employmentType: 'full_time'|'part_time'|'temporary',
  joinedAt, workLocationId, allowedCheckInMethods: ['gps_face','qr','kiosk'], leaveBalance }

// AttendanceRecord (one per shift)
{ id, employeeId, date, clockIn, clockOut|null, breakMinutes, hours|null,
  workLocationId, method: 'gps_face'|'qr'|'kiosk',
  status: 'on_time'|'late'|'absent', live: boolean }

// Request (single type covers leave + everything else)
{ id, employeeId, type: 'leave'|'half_day'|'remote_work'|'permission_slip',
  leaveType: 'annual'|'sick'|'personal'|null,
  dateFrom, dateTo, days, reason, attachmentUrl|null,
  status: 'pending'|'in_review'|'approved'|'rejected',
  approvalSteps: [{ step: 'submitted'|'team_lead'|'manager'|'hr',
                    state: 'done'|'in_progress'|'pending', date|null }],
  submittedAt, decidedAt|null, decidedBy|null }

// Reimbursement
{ id, employeeId, expenseType: 'transport'|'meals'|'supplies'|'accommodation',
  description, date, amountMUR, receiptUrl|null,
  status: 'pending'|'in_review'|'approved'|'rejected', submittedAt, decidedAt|null }

// WorkLocation
{ id, name, address, lat, lng, radiusMeters }

// Shift
{ id, name, start: '09:00', end: '18:00', type: 'general'|'night'|'split', graceMinutes }

// BusinessSettings
{ companyName, logoUrl, employeeCount, shifts: [Shift], workLocations: [WorkLocation],
  checkInMethods, leaveTypes, approvalFlow, notificationChannels: ['email','sms','in_app'] }

// ActivityEvent (feeds Recent Activity everywhere)
{ id, employeeId, kind: 'check_in'|'check_in_late'|'check_out'|'request_submitted'|
        'request_approved'|'request_rejected'|'receipt_uploaded', at }
```

Derivations (never stored, always computed): dashboard stats (avg hours, on-time %, avg check-in/out, present count), attendance distribution, report aggregates, employee monthly counters.

## 3. Event handling — the non-negotiable pattern

**No inline `onclick` attributes anywhere.** iOS webviews broke on them before; the fix was a central dispatcher. Preserve it:

```html
<button data-action="clock-in">Clock In</button>
<button data-action="approve-request" data-id="req_42">✓</button>
```

```js
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, ...params } = el.dataset;
  dispatch(action, params, el);
});

const handlers = {
  'clock-in':        () => store.clockIn(currentUser.id),
  'clock-out':       () => store.clockOut(currentUser.id),
  'approve-request': ({ id }) => store.decideRequest(id, 'approved'),
  'reject-request':  ({ id }) => store.decideRequest(id, 'rejected'),
  'submit-request':  () => submitRequestForm(),
  'nav':             ({ target }) => router.go(target),
  // ...
};
function dispatch(action, params, el) { handlers[action]?.(params, el); }
```

Same delegation pattern for `change`/`input`/`submit` where needed. Dynamic content gets handlers for free — never rebind.

## 4. State + rendering conventions

- Single store object + a `notify()`/subscribe mechanism; views subscribe and re-render their region on change. (When real backend arrives: swap store internals for API calls + optimistic updates; component code untouched.)
- Live timer while clocked in: one `setInterval`, updates Today's Summary and the status card; cleared on clock out.
- Location check: compare device geolocation against the employee's `WorkLocation` radius; show "In Range" / out-of-range states; block Clock In when out of range with a clear message.
- Statuses map 1:1 to badge components — no ad-hoc status strings.
- Dates: display like "May 19 – May 21, 2025 · 3 days"; times "09:15 AM".
- Money: MUR formatting, e.g. `Rs 1,450.00` (use rupee formatting everywhere reimbursement amounts appear).

## 5. Business context worth encoding in copy and defaults

- Pricing: MUR 100 per active employee/month, MUR 1,500 minimum (relevant to marketing page Pricing section).
- Target user: SME owners and managers in Mauritius — not HR departments. Copy stays plain and human.
- Default locale: English; French planned. Keep strings centralized.
- Example work location in designs: "Main office - Portluis" (Port Louis).
