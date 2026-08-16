# Chronix — Screen Specifications

Every screen, derived from the approved UI designs and the "How the App Works" document. Build exactly this; do not add screens or remove widgets.

---

## A. Marketing site (chronix.com)

**Purpose:** explain Chronix and drive Sign Up. All CTAs (Get Started Now, Login, Sign Up) lead to the SAME login screen.

- **Navbar:** logo left · Home / Features / Pricing / FAQ center · "Login" text link + amber "Sign Up" pill button right.
- **Hero:** headline "Manage Your Business **Smarter and Faster**" (second line amber). Subtext: "Chronix helps Mauritian companies track staff attendance, verify clock-ins, manage shifts, approve leave, and prepare payroll-ready reports from one simple platform." Buttons: amber "Get Started Now" + navy "Watch Demo".
- **Live preview card** floating over the hero image: mini Chronix Time Clock widget — logo, "Time Clock", "Hello, John" with ID, current time (large, live), date, green "CLOCK IN" button. This is a real visual of the product feature.
- Below the fold: Features, Pricing, FAQ sections (anchor-linked from navbar).

## B. Login (shared)

Split layout: form on the left (warm off-white), brand imagery panel on the right (navy/amber shapes, photo of a person holding a phone showing the Chronix login).

- Centered logo, title "Login to your chronix account", helper text.
- **Business / Employee segmented toggle** — amber highlight on the selected side. This single choice routes the user: Business → Admin Dashboard, Employee → Employee Home. Nothing else is asked.
- Email field (placeholder `ex: j@gmail.com`), password field, "Forgot password" link, full-width amber "Login" button.
- Divider "or login with" + Google sign-in button.

---

## C. Admin side

Sidebar: Dashboard · Attendance · Leave · Reimbursements · Reports · Settings.

### C1. Dashboard

The at-a-glance overview. Everything here is a summary of data that lives on the other pages — no unique data.

- **Header row:** "Good morning, {name} 👋" + "Here's what's happening with your team today." · date-range picker (e.g. "May 12 – May 18, 2025") · Filters button.
- **Insight banner** (navy): e.g. "Keep the momentum going! Your team's on-time rate improved 8% compared to last week." + sparkline + "View Weekly Report" (amber) + "Team Summary" (outline).
- **Five stat cards:** Average Hours (7h 42m, ↑6%) · On-time Arrival (92.6%, ↑8%) · Avg. Check-in (09:24 AM, ↓3m) · Avg. Check-out (06:07 PM, ↑11m) · Employees Present (178 / 210, "85% of workforce").
- **Attendance Overview** line chart (Daily/Weekly toggle): on-time vs late vs absent over the week.
- **Attendance Distribution** donut: total in center, legend with counts + % (On-time 142 (67%), Late 42 (20%), Absent 26 (13%)).
- **Team Attendance table** (preview): Employee (avatar+name), Department, Clock In, Clock Out, Hours, Status badge, Actions (eye view + …). Search-within-table, Export button, navy "View All" → Attendance page. Pagination footer.
- **Right rail:** Pending Approvals panel (count badge; rows like "Leave Request — Priya Sharma [3]", "Overtime Request — Arjun Patel [2]", "Reimbursement — Neha Verma [2]"; "View all approvals →") · Upcoming Leave panel (date block, name, range, status badge) · Recent Activity feed (colored event icons: green check-in, amber late check-in, blue submission; relative timestamps; "View all activity →").

### C2. Attendance

Full version of the dashboard team table.

- Title "Attendance — Track and manage employee attendance in real time." · navy **"Add New Employees"** button (top right) → opens add-employee form/modal.
- **Three stat cards:** Total Employees · On Time · Late Arrival (each with vs-last-week trend).
- **Filters:** From date · To date · Department dropdown.
- **Table:** Employee (avatar+name), Department, Clock In, Clock Out, Hours. Pagination + rows-per-page.

### C3. Leave Management

- Title "Leave Management — Review and manage employee leave requests efficiently." · navy **"New Leave Request"** button (admin can log leave on an employee's behalf).
- **Four stat cards:** Pending Requests (⏳ "Awaiting your approval") · Approved Leaves (↑ vs last month) · Rejected Requests (↓ vs last month) · Upcoming Leave ("Next 30 days").
- **Toolbar:** search, All Departments, All Status, Filters, Export.
- **Table:** Employee, Department, Leave Type (icon + Annual/Sick/Personal), Dates (range + duration "3 days"), Status badge (Pending / In Review / Approved / Rejected), Actions: ✓ approve, ✗ reject, … menu. Decided rows show disabled action icons.
- **Right rail:** Pending Approvals (person + leave type + count) · Upcoming Leave (approved/pending chips).
- **Behavior:** employee submissions appear here as Pending in real time; approve/reject updates the employee's Request page instantly.

### C4. Reimbursements

Identical pattern to Leave, but for expense claims.

- Title "Reimbursements — Review and manage employee expense claims efficiently." · navy **"New Reimbursement"** button.
- **Four stat cards:** Pending Claims · Approved Claims · Rejected Claims · **Total Reimbursed (MUR amount, ↑ vs last month)**.
- **Table:** Employee, Expense Type (icon: Transport / Meals / Supplies / Accommodation), Description, Date, **Receipt ("View Receipt" link → opens attachment)**, Amount, Status badge, ✓ / ✗ / … actions.
- **Right rail:** Pending Approvals (name, type + date, amount) · Recent Activity (approved / submitted / rejected / receipt uploaded events).
- Currency: display in **MUR** (designs show $ placeholders — replace with Rs / MUR formatting).

### C5. Reports

- Title "Reports — Generate and export attendance insights and team performance reports." · amber **"Export CSV"** (top right).
- **Filters:** From / To date range + Filters dropdown.
- **Four report cards** (illustration icon, title, description, amber outline "Generate Report →" / "View Report →" button):
  1. **Overtime Report** — overtime hours logged within the date range.
  2. **Absence Report** — absences, leaves, attendance trends.
  3. **QR Code Attendance Report** — attendance captured via QR check-ins.
  4. **Department Performance Report** — department-wise metrics side by side.
- **Payroll Integration banner:** "Seamlessly sync attendance and payroll data. This feature is under development." + **"Coming Soon"** pill. Decorative, non-functional.

### C6. Settings (business-wide)

- Title "Settings — Manage business preferences, employee policies, and system configuration."
- **Business Profile card:** company logo, name, employee count, "Edit Profile" button.
- **Settings Management list** — each row: tinted icon, title, one-line description, chevron → detail view:
  1. Shift Settings — shifts, schedules, shift policies.
  2. Work Location Settings — office locations, remote work, geo-fencing rules.
  3. Check-In Methods — attendance check-in and verification methods (GPS + face, QR, etc.).
  4. Employee Settings — employee info, onboarding, HR preferences.
  5. Leave and Absence Settings — leave types, policies, approval workflows.
  6. Report Settings — reports, KPIs, visualization preferences.
  7. User Roles and Permissions — roles, access levels, permission controls.
  8. Security Settings — password policies, 2FA, security preferences.
  9. Notification Settings — email, SMS, in-app notification preferences.
- Rules set here (e.g. allowed clock-in locations) immediately govern the employee side.

---

## D. Employee side

Sidebar: Home · Request · History · Settings (+ profile, Log Out, Contact Support).

### D1. Home

- **Header:** "Good morning, {name} 👋" + full date.
- **Status card:** avatar, "Attendance status", big **"Not Clocked In"** / **"Clocked In"**, friendly sub-line ("Have a productive day!").
- **Shift card:** "Current Shift 9:00 AM – 6:00 PM · General Shift · Full Time" + countdown chip ("Starts in 15m") + navy **Clock In** ("Start your shift") and amber **Clock Out** ("End your shift") buttons.
- **Work Location card:** pin icon, "Main office - Portluis", green **"In Range"** chip + "✓ You are within the allowed Work Radius". Clock In is blocked when out of range (show the failure state clearly).
- **Today's Summary:** Worked Hours · Break Hours · Total Hours · Attendance % — live-updating while clocked in.
- **Recent Activity:** own recent clock in/out events with timestamps, "View all".
- **Shortcut tiles:** Leave Request → Request page · Timesheet (View & Submit) · History (View Records).
- **Clock In behavior:** verifies location → records timestamp → flips status card → starts live timer → event appears on admin Dashboard/Attendance instantly. **Clock Out:** stops timer, saves shift to History.

### D2. Request

One form for anything needing approval: Leave, Half Day, Remote Work, Permission Slip (reimbursements/expense claims also submitted here).

- **Three stat cards:** Pending Requests ("Awaiting Approval") · Approved ("This Month") · Rejected ("This Month").
- Navy **"+ New Request"** button.
- **Submit a Request card:** Request Type dropdown · Date Range picker · Reason textarea (0/250 counter) · optional Attachment drag-and-drop ("PDF, JPG, PNG up to 10MB") · Cancel + navy "Submit Request ➢".
- **Approval in Progress stepper:** Submitted → Team Lead → Manager → HR, with per-step status (done / in progress / pending) and dates.
- **Recent Requests panel:** type icon, name, date, status badge (Pending / Approved / Rejected). "View All".
- **Policy Reminder box** (amber): "Submit your request at least 3 working days in advance." "Half day request will be counted as 0.5 day."
- **Behavior:** Submit → lands on admin approval list as Pending; admin decisions update the stepper and status badges here automatically.

### D3. History

- Title "History — View your attendance and activity records."
- **Three stat cards:** Total Days Worked · On-Time Days · Late Days ("Last Month").
- **Filters:** Date Range · Status · Work Location · Clear Filters.
- **Table:** Date, Event (Job), Clock In, Clock Out, Hours, Work Location, Status badge (On-Time / Late), … row menu. Pagination ("Showing 1 to 10 of 120 records").
- Fills automatically on every clock out — never manually edited by the employee.

### D4. Settings (personal)

- **Profile card:** avatar with online dot, name, "Employee" chip, email, phone, "Joined {date}", "Edit Profile".
- **Settings list** (icon, title, description, chevron):
  1. Personal Information — personal details and contact info.
  2. Work Location Settings — assigned location, allowed radius, work preferences.
  3. Attendance Preferences — check-in methods and attendance preferences.
  4. Leave & Absence Settings — leave types, balance visibility, absence preferences.
  5. Notification Preferences — how and when to be notified.
  6. Privacy & Security — password, privacy, account security.
  7. Documents & Attachments — uploaded documents.
  8. App Preferences — language, theme, general app settings.
