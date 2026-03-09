import React from 'react';

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className = 'btn__spinner' }: SpinnerProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      className="btn__spinner-track"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="btn__spinner-arc"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
