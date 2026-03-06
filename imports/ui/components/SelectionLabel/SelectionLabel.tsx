import React from 'react';

type SelectionLabelProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function SelectionLabel({ label, selected, onClick }: SelectionLabelProps) {
  return (
    <button
      type="button"
      className={`chip ${selected ? 'chip--selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )};