import React from 'react';
import { useDebounce } from 'use-debounce';
import './SearchBar.css';

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
    console.log('debounce has happened');
    onSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <section className="search__container">
      <input
        type="text"
        value={inputValue}
        placeholder="Job title, keywords, or company"
        onChange={(e) => setInputValue(e.target.value)}
        className="search__input"
      ></input>
      <img src="/assets/search-icon.svg" alt="Search Icon" className="search__icon" />
      <button type="button" className="search__button">
        Search
      </button>
    </section>
  );
};
