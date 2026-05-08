import React from 'react';
import { useDebounce } from 'use-debounce';
import './SearchBar.css';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
  icon?: React.ReactNode;
  showButton?: boolean;
  ariaLabel?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Job title, keywords, or company',
  delay = 300,
  icon,
  showButton = true,
  ariaLabel,
}) => {
  const [debouncedValue] = useDebounce(value, delay);

  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="search__container">
      {icon && (
        <span className="search__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`search__input${icon ? ' search__input--has-icon' : ''}`}
      />
      {showButton && (
        <button type="submit" className="search__button">
          Search
        </button>
      )}
    </div>
  );
};
