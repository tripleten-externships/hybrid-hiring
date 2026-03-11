import React from 'react';
import './SelectionLabel.css';

type SelectionLabelProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export const SelectionLabel = ({ label, selected, onClick }: SelectionLabelProps) => {
  return (
    <button
      type="button"
      className={`chip ${selected ? 'chip--selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="chip-label">{label}</span>
    </button>
  );
};
