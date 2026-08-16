import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldWrapperProps {
  label: string;
  children: ReactNode;
}

function FieldWrapper({ label, children }: FieldWrapperProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export function FormField({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldWrapper label={label}>
      <input className="form-input" {...props} />
    </FieldWrapper>
  );
}

export function FormSelect({
  label,
  options,
  ...props
}: { label: string; options: Array<{ value: string; label: string }> } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldWrapper label={label}>
      <select className="form-select" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function FormTextarea({
  label,
  maxLength,
  value,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const len = typeof value === 'string' ? value.length : 0;
  return (
    <FieldWrapper label={label}>
      <textarea className="form-textarea" maxLength={maxLength} value={value} {...props} />
      {maxLength && (
        <div className="char-counter">
          {len}/{maxLength}
        </div>
      )}
    </FieldWrapper>
  );
}
