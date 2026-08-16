# Chronix Design System

Derived from the approved UI designs (chronix_Ui PDF) and the official logo. These values are locked — do not invent new colors or layouts.

## 1. Brand colors (extracted from the logo)

```css
:root {
  /* Brand */
  --chronix-navy:      #193A5B;  /* primary brand navy — sidebar, headings, dark buttons */
  --chronix-amber:     #F3AE2C;  /* accent gold — CTAs, active nav item, highlights, the "x" */

  /* Semantic */
  --success:           #22A06B;  /* Approved, On-time, Clock In confirmation */
  --success-bg:        #E6F6EF;
  --warning:           #F3AE2C;  /* Pending, Late */
  --warning-bg:        #FDF3DE;
  --danger:            #E5484D;  /* Rejected, absent, red X action */
  --danger-bg:         #FDECEC;
  --info:              #3B82F6;  /* In Review */
  --info-bg:           #EAF2FE;

  /* Neutrals */
  --bg-page:           #F5F3EF;  /* warm off-white page background (marketing + app) */
  --bg-card:           #FFFFFF;
  --border:            #E8EAED;
  --text-primary:      #1A2433;
  --text-secondary:    #6B7280;
  --text-on-navy:      #FFFFFF;
}
```

Usage rules:
- **Navy** = structure: sidebar background, table header text, primary dark buttons ("Watch Demo", "View All", "Submit Request", "New Leave Request").
- **Amber** = action and attention: primary CTAs ("Get Started Now", "Login", "Upgrade Now", "Export CSV", "Clock Out"), the active sidebar item highlight, notification badge.
- Employee "Clock In" button is **navy**, "Clock Out" is **amber** (as designed).
- Never place amber text on white for body copy (contrast); amber is for buttons/fills/badges with dark text or icons.

## 2. Typography

- One clean geometric/humanist sans throughout (the designs use an Inter/Poppins-like face). Use **Inter** (or Poppins) from a system-safe stack:
  `font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;`
- Scale: page title 24–28px bold · section/card title 16–18px semibold · body 14px · table text 13–14px · stat numbers 24–32px bold · badges 12px semibold.
- Greeting pattern on home screens: **"Good morning, {firstName} 👋"** with a smaller grey subtitle under it.

## 3. Layout

### App shell (both sides)
- **Left sidebar**, navy background, white text, fixed:
  - Chronix logo at top (white/amber variant on navy).
  - Nav items with icons; **active item = amber pill/highlight**.
  - Admin nav: Dashboard, Attendance, Leave, Reimbursements, Reports, Settings. Bottom: "Go Premium" upsell card (amber border, "Upgrade Now" amber button), Help & Support.
  - Employee nav: Home, Request, History, Settings. Bottom: user mini-profile (avatar, name, role, green online dot), Log Out, "Need Help? Contact Support" card.
- **Top bar** (admin): global search ("Search people, reports, or settings…", ⌘K hint), notification bell with amber count badge, user avatar + name + role + dropdown chevron.
- **Top bar** (employee): greeting + date on the left, bell + avatar on the right (no global search).
- Content area: warm off-white `--bg-page`, white rounded cards (radius ~12–16px), soft shadows, generous 16–24px gaps.

### Responsive behavior
- < 1024px: sidebar collapses to a hamburger/drawer.
- < 768px: stat card rows wrap to 2-up then 1-up; tables scroll horizontally or restack as cards; side panels (Pending Approvals, Upcoming Leave) drop below main content.
- All interactive elements ≥ 44px tap target.

## 4. Reusable components

| Component | Description |
|---|---|
| **Stat card** | White card: small tinted icon square (pastel bg matching semantic color), grey label, big bold number, small trend line beneath ("↑ 6% vs last week" green, "↓ …" red, "— vs last week" grey). |
| **Status badge** | Rounded pill, tinted bg + colored text: Pending (amber), In Review (blue), Approved (green), Rejected (red), On-time (green), Late (amber). |
| **Data table** | White card, light grey header row, avatar + name in first column, zebra-free rows with bottom borders, pagination footer ("Showing 1 to N of M results", numbered pager, rows-per-page select). |
| **Approve/Reject actions** | Green circled ✓ and red circled ✗ per row, plus "…" overflow menu. Already-decided rows show these disabled/greyed. |
| **Side panel list** | "Pending Approvals" / "Upcoming Leave" / "Recent Activity": compact rows with avatar or date block, name, sub-label, count or status badge, "View all →" footer link. |
| **Charts** | Line/area chart for attendance trend (navy = on-time, amber = late, grey = absent); donut for attendance distribution with total in the center and a legend showing counts and percentages. |
| **Form fields** | Labelled inputs, rounded, light borders; dropdowns for type/department/status; date-range pickers; textarea with character counter (0/250); drag-and-drop file upload zone ("PDF, JPG, PNG up to 10MB"). |
| **Progress tracker** | Horizontal stepper: Submitted → Team Lead → Manager → HR. Completed = navy filled, current = amber, upcoming = grey outline, dotted connectors. |
| **Banner card** | Navy rounded banner on dashboard: motivational insight ("Keep the momentum going! Your team's on-time rate improved 8%…") with a small sparkline and two buttons (amber primary + outline). |
| **Policy reminder box** | Amber-tinted card with shield icon and short policy notes. |

## 5. Voice and copy

Plain, warm, human English — never corporate marketing-speak. Examples straight from the designs: "Have a productive day!", "Keep the momentum going!", "Track and manage employee attendance in real time." Short sentences. No jargon.
