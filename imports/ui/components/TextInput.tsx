import './TextInput.css';
import type { ChangeEvent } from 'react';

type TextInputProps = {
  label: string;
  id: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
};

const TextInput = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  fullWidth = false,
  disabled = false,
  required = false,
}: TextInputProps) => {
  return (
    <div className={`text-input ${fullWidth ? 'full-width' : ''}`}>
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={name}
        type={type}
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

export default TextInput;
