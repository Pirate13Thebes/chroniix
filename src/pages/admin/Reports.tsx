// Screen C5 — Admin Reports
import { useState } from 'react';
import { ReportCard } from '../../components/admin/ReportCard';
import { PayrollTeaserBanner } from '../../components/admin/PayrollTeaserBanner';
import { useStore } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getReportsAggregates } from '../../store/selectors';
import { downloadCsv } from '../../utils/csvExport';
import { downloadPdf } from '../../utils/pdfExport';
import { localDateString } from '../../utils/format';
import type { ReportCardDef } from '../../types';
import { FileText, Download } from 'lucide-react';

const REPORT_DEFS: ReportCardDef[] = [
  { id: 'overtime', title: 'Overtime Report', description: 'Overtime hours logged within the date range.', icon: 'overtime' },
  { id: 'absence', title: 'Absence Report', description: 'Absences, leaves, and attendance trends.', icon: 'absence' },
  { id: 'qr', title: 'QR Code Attendance Report', description: 'Attendance captured via QR check-ins.', icon: 'qr' },
  { id: 'department', title: 'Department Performance Report', description: 'Department-wise metrics side by side.', icon: 'department' },
  { id: 'payroll', title: 'Payroll Summary Report', description: 'Hours worked x rate + approved reimbursements per employee.', icon: 'payroll' },
];

export function Reports() {
  const { t } = useLanguage();
  const { state } = useStore();
  const companyName = state.settings?.companyName || 'CX SOLUTIONS LTD';

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - state.settings.defaultReportRangeDays);
    return localDateString(d);
  });
  const [to, setTo] = useState(() => localDateString());

  function allAttendanceRows(): Array<Record<string, string | number>> {
    const empRows = state.attendance
      .filter((r) => r.date >= from && r.date <= to)
      .map((r) => {
        const emp = state.employees.find((e) => e.id === r.employeeId);
        const hours = r.hours ?? 0;
        return {
          'Name/Surname': emp ? `${emp.firstName} ${emp.lastName}` : 'Staff',
          'ID/Passport': emp?.id ?? '-',
          'Clock In': r.clockIn ? new Date(r.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          'Clock Out': r.clockOut ? new Date(r.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
          Hours: hours,
          'Rate (MUR)': emp?.hourlyRateMUR ?? 0,
          'Total (MUR)': Math.round(hours * (emp?.hourlyRateMUR ?? 0) * 100) / 100,
        };
      });

    const tempRows = (state.temporaryWorkers || [])
      .filter((t) => t.date >= from && t.date <= to)
      .map((t) => ({
        'Name/Surname': `${t.name} (Temp)`,
        'ID/Passport': t.phone || '-',
        'Clock In': t.clockIn ? new Date(t.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        'Clock Out': t.clockOut ? new Date(t.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        Hours: t.hours || 0,
        'Rate (MUR)': t.hourlyRateMUR || 0,
        'Total (MUR)': Math.round((t.hours || 0) * (t.hourlyRateMUR || 0) * 100) / 100,
      }));

    return [...empRows, ...tempRows];
  }

  function handleExportAll() {
    downloadCsv(`chronix-report-${from}-to-${to}.csv`, allAttendanceRows());
  }

  function handleExportAllPdf() {
    downloadPdf(`detailed-payroll-report-${from}-to-${to}.pdf`, `Detailed Payroll Report`, allAttendanceRows(), {
      companyName,
    });
  }

  function payrollRows(): Array<Record<string, string | number>> {
    const empPayroll = state.employees.map((emp) => {
      const hours = state.attendance
        .filter((r) => r.employeeId === emp.id && r.date >= from && r.date <= to)
        .reduce((sum, r) => sum + (r.hours ?? 0), 0);

      const reimbursements = state.reimbursements
        .filter((r) => r.employeeId === emp.id && r.status === 'approved' && r.date >= from && r.date <= to)
        .reduce((sum, r) => sum + r.amountMUR, 0);

      const basePay = Math.round(hours * emp.hourlyRateMUR * 100) / 100;
      const totalPayout = Math.round((basePay + reimbursements) * 100) / 100;

      return {
        'Name/Surname': `${emp.firstName} ${emp.lastName}`,
        Department: emp.department || 'General',
        'Hours Worked': Math.round(hours * 100) / 100,
        'Hourly Rate (MUR)': emp.hourlyRateMUR,
        'Base Pay (MUR)': basePay,
        'Reimbursement Cash (MUR)': reimbursements,
        'Total Payout (MUR)': totalPayout,
      };
    });

    const tempPayroll = (state.temporaryWorkers || [])
      .filter((t) => t.date >= from && t.date <= to)
      .map((t) => {
        const basePay = Math.round((t.hours || 0) * (t.hourlyRateMUR || 0) * 100) / 100;
        return {
          'Name/Surname': `${t.name} (Temp)`,
          Department: 'Temporary Worker',
          'Hours Worked': t.hours || 0,
          'Hourly Rate (MUR)': t.hourlyRateMUR || 0,
          'Base Pay (MUR)': basePay,
          'Reimbursement Cash (MUR)': 0,
          'Total Payout (MUR)': basePay,
        };
      });

    return [...empPayroll, ...tempPayroll];
  }

  function reportRows(id: string): Array<Record<string, string | number>> {
    if (id === 'payroll') return payrollRows();
    const aggregates = getReportsAggregates(state, { from, to });
    if (id === 'overtime') return [{ 'Overtime Hours': aggregates.overtimeHours }];
    if (id === 'absence') return [{ 'Absence Count': aggregates.absenceCount }];
    if (id === 'qr') return [{ 'QR Check-ins': aggregates.qrCheckIns }];
    return aggregates.departmentBreakdown.map((d) => ({ Department: d.department, 'On-time %': d.onTimePct, 'Avg Hours': d.avgHours }));
  }

  const REPORT_TITLES: Record<string, string> = {
    overtime: 'Overtime Report',
    absence: 'Absence Report',
    qr: 'QR Code Attendance Report',
    department: 'Department Performance Report',
    payroll: 'Detailed Payroll Report',
  };

  function handleGenerate(id: string) {
    downloadCsv(`${id}-report.csv`, reportRows(id));
  }

  function handleExportPdf(id: string) {
    downloadPdf(`${id}-report.pdf`, `${REPORT_TITLES[id]} (${from} to ${to})`, reportRows(id), { companyName });
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{t('reportsTitle')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('reportsSubtitle')}</p>
        </div>
      </div>

      {/* Date Filter Card aligned with Export PDF & Export CSV buttons matching Page 3 Screenshot */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="date-range-picker" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('fromDate')}</label>
              <input type="date" className="form-input" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('toDate')}</label>
              <input type="date" className="form-input" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn btn-outline" onClick={handleExportAllPdf} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} /> Export PDF
            </button>
            <button className="btn btn-primary-amber" onClick={handleExportAll} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Download size={16} /> {t('exportCsv')}
            </button>
          </div>
        </div>
      </div>

      <div className="features-grid" style={{ marginBottom: '1.5rem' }}>
        {REPORT_DEFS.map((def) => (
          <ReportCard key={def.id} def={def} onGenerate={() => handleGenerate(def.id)} onExportPdf={() => handleExportPdf(def.id)} />
        ))}
      </div>

      <PayrollTeaserBanner />
    </div>
  );
}
