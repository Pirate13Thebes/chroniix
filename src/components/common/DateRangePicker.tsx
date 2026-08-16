interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromLabel?: string;
  toLabel?: string;
}

export function DateRangePicker({ from, to, onFromChange, onToChange, fromLabel = 'From', toLabel = 'To' }: DateRangePickerProps) {
  return (
    <div className="date-range-picker">
      <div className="form-field" style={{ marginBottom: 0 }}>
        <label className="form-label">{fromLabel}</label>
        <input type="date" className="form-input" value={from} onChange={(e) => onFromChange(e.target.value)} />
      </div>
      <div className="form-field" style={{ marginBottom: 0 }}>
        <label className="form-label">{toLabel}</label>
        <input type="date" className="form-input" value={to} onChange={(e) => onToChange(e.target.value)} />
      </div>
    </div>
  );
}
