import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const DEFAULT_BUSINESS_SETTINGS = {
  companyName: 'Your Business',
  logoUrl: '/chronix_logo.png',
  employeeCount: 0,
  shifts: [],
  workLocations: [],
  checkInMethods: ['gps_face', 'qr', 'kiosk'],
  leaveTypes: ['annual', 'sick', 'personal'],
  approvalFlow: ['submitted', 'team_lead', 'manager', 'hr'],
  notificationChannels: ['email', 'in_app'],
  departments: [],
  trialStartedAt: null,
  trialCancelled: false,
  billingCard: null,
  defaultReportRangeDays: 30,
  plan: null,
  billingStatus: 'none',
  paymentMethod: null,
  paymentReference: null,
};

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function todayIso() {
  return localDateString();
}

function localDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateKioskPin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function isLate(clockInIso, shift) {
  if (!shift) return false;
  const d = new Date(clockInIso);
  const [startHour, startMinute] = shift.start.split(':').map(Number);
  const graceEnd = new Date(d);
  graceEnd.setHours(startHour, startMinute + shift.graceMinutes, 0, 0);
  return d.getTime() > graceEnd.getTime();
}

function normalizeEmployee(e) {
  return {
    ...e,
    avatarUrl: e.avatarUrl ?? '',
    department: e.department ?? '',
    employmentType: e.employmentType ?? 'full_time',
    workLocationId: e.workLocationId ?? '',
    shiftId: e.shiftId ?? null,
    allowedCheckInMethods: e.allowedCheckInMethods ?? ['gps_face'],
    leaveBalance: e.leaveBalance ?? 0,
    hourlyRateMUR: e.hourlyRateMUR ?? 0,
    status: e.status ?? 'active',
    terminatedAt: e.terminatedAt ?? null,
    terminationReason: e.terminationReason ?? null,
    kioskPin: e.kioskPin ?? generateKioskPin(),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'CLOCK_IN': {
      const at = nowIso();
      const employee = state.employees.find((e) => e.id === action.employeeId);
      const shift = state.settings.shifts.find((s) => s.id === employee?.shiftId);
      const late = isLate(at, shift);
      const record = {
        id: uid('att'),
        employeeId: action.employeeId,
        date: todayIso(),
        clockIn: at,
        clockOut: null,
        breakMinutes: 0,
        hours: null,
        workLocationId: action.workLocationId,
        method: action.method,
        status: late ? 'late' : 'on_time',
        live: true,
      };
      const event = {
        id: uid('act'),
        employeeId: action.employeeId,
        kind: late ? 'check_in_late' : 'check_in',
        at,
      };
      return {
        ...state,
        attendance: [record, ...state.attendance],
        activity: [event, ...state.activity],
      };
    }
    case 'CLOCK_OUT': {
      const at = nowIso();
      const openRecord = state.attendance.find((r) => r.employeeId === action.employeeId && r.live);
      if (!openRecord) return state;
      const hours = (new Date(at).getTime() - new Date(openRecord.clockIn).getTime()) / 3600000 - openRecord.breakMinutes / 60;
      const event = { id: uid('act'), employeeId: action.employeeId, kind: 'check_out', at };
      return {
        ...state,
        attendance: state.attendance.map((r) =>
          r.id === openRecord.id ? { ...r, clockOut: at, hours: Math.max(0, Math.round(hours * 100) / 100), live: false } : r
        ),
        activity: [event, ...state.activity],
      };
    }
    case 'SUBMIT_REQUEST': {
      const at = nowIso();
      const id = uid('req');
      const request = {
        ...action.payload,
        id,
        status: 'pending',
        approvalSteps: [
          { step: 'submitted', state: 'done', date: at.slice(0, 10) },
          { step: 'team_lead', state: 'in_progress', date: null },
          { step: 'manager', state: 'pending', date: null },
          { step: 'hr', state: 'pending', date: null },
        ],
        submittedAt: at,
        decidedAt: null,
        decidedBy: null,
      };
      const event = { id: uid('act'), employeeId: request.employeeId, kind: 'request_submitted', at };
      return { ...state, requests: [request, ...state.requests], activity: [event, ...state.activity] };
    }
    case 'DECIDE_REQUEST': {
      const at = nowIso();
      const target = state.requests.find((r) => r.id === action.id);
      if (!target) return state;
      const event = {
        id: uid('act'),
        employeeId: target.employeeId,
        kind: action.decision === 'approved' ? 'request_approved' : 'request_rejected',
        at,
      };
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.id
            ? {
                ...r,
                status: action.decision,
                decidedAt: at,
                decidedBy: action.decidedBy,
                approvalSteps: r.approvalSteps.map((s) => ({ ...s, state: 'done', date: s.date ?? at.slice(0, 10) })),
              }
            : r
        ),
        activity: [event, ...state.activity],
      };
    }
    case 'SUBMIT_REIMBURSEMENT': {
      const at = nowIso();
      const reimbursement = { ...action.payload, id: uid('reim'), status: 'pending', submittedAt: at, decidedAt: null };
      const events = [{ id: uid('act'), employeeId: reimbursement.employeeId, kind: 'request_submitted', at }];
      if (reimbursement.receiptUrl) {
        events.push({ id: uid('act'), employeeId: reimbursement.employeeId, kind: 'receipt_uploaded', at });
      }
      return { ...state, reimbursements: [reimbursement, ...state.reimbursements], activity: [...events, ...state.activity] };
    }
    case 'DECIDE_REIMBURSEMENT': {
      const at = nowIso();
      const target = state.reimbursements.find((r) => r.id === action.id);
      if (!target) return state;
      const event = {
        id: uid('act'),
        employeeId: target.employeeId,
        kind: action.decision === 'approved' ? 'request_approved' : 'request_rejected',
        at,
      };
      return {
        ...state,
        reimbursements: state.reimbursements.map((r) =>
          r.id === action.id ? { ...r, status: action.decision, decidedAt: at } : r
        ),
        activity: [event, ...state.activity],
      };
    }
    case 'ADD_EMPLOYEE': {
      const newEmployee = normalizeEmployee(action.payload);
      return {
        ...state,
        employees: [...state.employees, newEmployee],
      };
    }
    case 'UPDATE_EMPLOYEE': {
      const updatedEmployee = normalizeEmployee(action.payload);
      return { ...state, employees: state.employees.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e)) };
    }
    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }
    default:
      return state;
  }
}

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ businesses: {} }, null, 2));
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { businesses: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Load initial database
readDb();

app.get('/api/auth/google-admins', (req, res) => {
  const db = readDb();
  const admins = [];
  for (const [businessId, biz] of Object.entries(db.businesses)) {
    if (biz.employees) {
      biz.employees.filter(emp => emp.role === 'admin').forEach(emp => {
        admins.push({ emp, businessId });
      });
    }
  }
  res.json(admins);
});

app.post('/api/auth/signup', (req, res) => {
  const { fullName, companyName, businessLocation, employeeCount, email, phone, password } = req.body;
  const db = readDb();
  
  const trimmedEmail = email.trim().toLowerCase();
  
  const existing = Object.values(db.businesses).some((biz) =>
    biz.employees && biz.employees.some((emp) => emp.email.toLowerCase() === trimmedEmail)
  );
  
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const newLocation = {
    id: uid('loc'),
    name: `Main Office - ${businessLocation.trim()}`,
    address: businessLocation.trim(),
    lat: -20.2,
    lng: 57.5,
    radiusMeters: 150,
  };

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'New';
  const lastName = nameParts.slice(1).join(' ') || '—';
  
  const newId = uid('emp');
  const newEmployee = {
    id: newId,
    firstName,
    lastName,
    avatarUrl: '',
    email: trimmedEmail,
    phone: phone.trim(),
    role: 'admin',
    department: '',
    employmentType: 'full_time',
    joinedAt: new Date().toISOString().slice(0, 10),
    workLocationId: newLocation.id,
    shiftId: null,
    allowedCheckInMethods: ['gps_face'],
    leaveBalance: 14,
    hourlyRateMUR: 0,
    credential: password,
    status: 'active',
    terminatedAt: null,
    terminationReason: null,
    kioskPin: generateKioskPin(),
  };
  
  const businessId = uid('biz');
  db.businesses[businessId] = {
    employees: [newEmployee],
    attendance: [],
    requests: [],
    reimbursements: [],
    activity: [],
    settings: {
      ...DEFAULT_BUSINESS_SETTINGS,
      companyName: companyName.trim(),
      employeeCount: Math.max(1, Number(employeeCount) || 1),
      workLocations: [newLocation],
      trialStartedAt: new Date().toISOString(),
      trialCancelled: false,
      billingCard: null,
    },
  };
  
  writeDb(db);
  res.json({ employee: newEmployee, businessId });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const trimmedEmail = email.trim().toLowerCase();
  
  let existing = null;
  let businessId = null;
  
  for (const [id, biz] of Object.entries(db.businesses)) {
    if (!biz.employees) continue;
    const match = biz.employees.find((emp) => emp.email.toLowerCase() === trimmedEmail);
    if (match) {
      existing = match;
      businessId = id;
      break;
    }
  }
  
  if (!existing || !businessId) {
    return res.status(404).json({ error: 'No account found with this email' });
  }
  
  if (existing.credential !== password) {
    return res.status(401).json({ error: 'Incorrect credentials' });
  }
  
  if (existing.status === 'terminated') {
    return res.status(403).json({ error: 'Account has been deactivated' });
  }
  
  res.json({ employee: existing, businessId });
});

app.get('/api/business/:businessId', (req, res) => {
  const { businessId } = req.params;
  const db = readDb();
  const state = db.businesses[businessId];
  if (!state) {
    return res.status(404).json({ error: 'Business not found' });
  }
  res.json(state);
});

app.post('/api/business/:businessId/action', (req, res) => {
  const { businessId } = req.params;
  const action = req.body;
  const db = readDb();
  const state = db.businesses[businessId];
  if (!state) {
    return res.status(404).json({ error: 'Business not found' });
  }
  
  const updatedState = reducer(state, action);
  db.businesses[businessId] = updatedState;
  writeDb(db);
  
  res.json(updatedState);
});

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;
  
  transporterPromise = (async () => {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    
    if (user && pass) {
      console.log(`[Email] Using configured SMTP server: ${host || 'smtp'}`);
      return nodemailer.createTransport({
        host: host || 'smtp.gmail.com',
        port: port,
        secure: port === 465,
        auth: { user, pass }
      });
    } else {
      console.log('[Email] No SMTP credentials found. Creating an Ethereal test account...');
      try {
        const testAccount = await nodemailer.createTestAccount();
        console.log(`[Email] Ethereal account created: User = ${testAccount.user}`);
        return nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      } catch (err) {
        console.error('[Email] Failed to create Ethereal account, falling back to mock transporter:', err);
        return {
          sendMail: async (options) => {
            console.log('[Email Mock] Sending email to:', options.to);
            console.log('[Email Mock] Subject:', options.subject);
            console.log('[Email Mock] Body:', options.html);
            return { messageId: 'mock-id' };
          }
        };
      }
    }
  })();
  
  return transporterPromise;
}

app.post('/api/auth/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing to, subject, or html parameters' });
  }

  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_USER || 'no-reply@chronx.netlify.app';
    const info = await transporter.sendMail({
      from: `"Chronix Notifications" <${fromAddress}>`,
      to,
      subject,
      html,
    });

    console.log(`[Email] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Preview URL] View sent email here: ${previewUrl}`);
    }

    res.json({ success: true, messageId: info.messageId, previewUrl });
  } catch (err) {
    console.error('[Email] Failed to send email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Chronix DB Server] running on port ${PORT}`);
});
