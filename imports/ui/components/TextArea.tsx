import './TextArea.css';
import type { ChangeEvent } from 'react';

type TextAreaProps = {
  label: string;
  id: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
};

const TextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  fullWidth = false,
  disabled = false,
  required = false,
}: TextAreaProps) => {
  return (
    <div className={`text-input ${fullWidth ? 'full-width' : ''}`}>
      <label htmlFor={id}>{label}</label>

      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={error ? 'input error' : 'input'}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;