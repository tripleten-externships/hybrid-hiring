import React from 'react';
import { useDebounce } from 'use-debounce';
import './SearchBar.css';

// MY THOUGHTS:
// Search button needs to be inside the input, but I'm getting errors
// Maybe I can achieve that with CSS, I'll worry about it after the addition of the location input

type SearchBarProps = {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
};

export const SearchBar: React.FC<SearchBarProps> = ({ value = '', onSearch, delay = 300 }) => {
  const [inputValue, setInputValue] = React.useState(value);
  const [debouncedValue] = useDebounce(inputValue, delay);

  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <section className="search__container">
      <img src="/assets/search-icon.svg" alt="Search Icon" className="search__icon" />
      <input
        type="text"
        value={inputValue}
        placeholder="Job title, keywords, or company"
        onChange={(e) => setInputValue(e.target.value)}
        className="search__input"
      />
      <button type="button" className="search__button">
        Search
      </button>
    </section>
  );
};
