import { useState } from 'react';
import { FormSelect, FormTextarea } from '../common/FormField';
import { FileDropzone } from '../common/FileDropzone';
import { useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { localDateString } from '../../utils/format';
import type { ExpenseType, LeaveType, RequestType } from '../../types';

type FormType = RequestType | 'expense';

const TYPE_OPTIONS: Array<{ value: FormType; label: string }> = [
  { value: 'leave', label: 'Leave' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'remote_work', label: 'Remote Work' },
  { value: 'permission_slip', label: 'Permission Slip' },
  { value: 'expense', label: 'Expense / Reimbursement' },
];

export function RequestForm({ employeeId }: { employeeId: string }) {
  const { t } = useLanguage();
  const { submitRequest, submitReimbursement } = useStoreActions();
  const [type, setType] = useState<FormType>('leave');
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [expenseType, setExpenseType] = useState<ExpenseType>('transport');
  const [dateFrom, setDateFrom] = useState(localDateString());
  const [dateTo, setDateTo] = useState(localDateString());
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (type === 'expense') {
      submitReimbursement({ employeeId, expenseType, description: reason, date: dateFrom, amountMUR: amount, receiptUrl: fileName ? `/mock/receipts/${fileName}` : null });
    } else {
      const days = type === 'half_day' ? 0.5 : Math.max(1, Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000) + 1);
      submitRequest({
        employeeId,
        type,
        leaveType: type === 'leave' ? leaveType : null,
        dateFrom,
        dateTo,
        days,
        reason,
        attachmentUrl: fileName ? `/mock/receipts/${fileName}` : null,
      });
    }
    setReason('');
    setFileName(null);
    setAmount(0);
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('submitRequestCard')}</h3>
      <form onSubmit={handleSubmit}>
        <FormSelect label={t('requestType')} value={type} onChange={(e) => setType(e.target.value as FormType)} options={TYPE_OPTIONS} />

        {type === 'leave' && (
          <FormSelect
            label="Leave Type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            options={[
              { value: 'annual', label: 'Annual' },
              { value: 'sick', label: 'Sick' },
              { value: 'personal', label: 'Personal' },
            ]}
          />
        )}

        {type === 'expense' && (
          <FormSelect
            label="Expense Type"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
            options={[
              { value: 'transport', label: 'Transport' },
              { value: 'meals', label: 'Meals' },
              { value: 'supplies', label: 'Supplies' },
              { value: 'accommodation', label: 'Accommodation' },
            ]}
          />
        )}

        <div className="responsive-grid-1-1">
          <div className="form-field">
            <label className="form-label">{type === 'expense' ? 'Date' : t('dateRange')}</label>
            <input type="date" className="form-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          {type !== 'expense' && type !== 'half_day' && (
            <div className="form-field">
              <label className="form-label">&nbsp;</label>
              <input type="date" className="form-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          )}
          {type === 'expense' && (
            <div className="form-field">
              <label className="form-label">Amount (MUR)</label>
              <input type="number" min={0} className="form-input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
          )}
        </div>

        <FormTextarea label={t('reason')} maxLength={250} value={reason} onChange={(e) => setReason(e.target.value)} />

        <div className="form-field">
          <label className="form-label">{t('attachment')}</label>
          <FileDropzone selectedFileName={fileName} onFileSelected={(file) => setFileName(file.name)} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={() => setReason('')}>
            {t('cancel')}
          </button>
          <button type="submit" className="btn btn-primary-navy">
            {t('submitRequestBtn')}
          </button>
        </div>
      </form>
    </div>
  );
}
