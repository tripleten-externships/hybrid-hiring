import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';
interface SpinnerProps {
  className?: string;
  size?: SpinnerSize;
}

export const Spinner = ({ className, size = 'md' }: SpinnerProps) => {
  const classes = ['spinner', `spinner--${size}`, className].filter(Boolean).join(' ');

  return (
    <svg className={classes} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        className="spinner-track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path className="spinner-arc" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
};
