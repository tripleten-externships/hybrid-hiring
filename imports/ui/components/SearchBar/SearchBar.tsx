import React from "react";
// THE TASK:
// - Props: onSearch: (query: string) => void ✔
// - Render a search icon, a text input, and a Search <button> ✔
// - On input change, use setTimeout / clearTimeout to debounce 300ms before calling onSearch(value) 
// - In JobBoard.tsx, add Searchbar above the job list; maintain a searchQuery state and pass it to the jobs.search subscription
// - When searchQuery is empty, fall back to jobs.all (or jobs.recommended for logged-in users)


// MY THOUGHTS:
// Looks like I'm waiting on HH-81, the jobs.search publication, which has a pull request open.

type SearchBarProps = {
    onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const searchTimer = setTimeout((value: string) => { onSearch(value) }, 300);

    return (
        <div className="search__container">
            <img
                src="/assets/search-icon.svg"
                alt="Search Icon"
                className="search__icon" />
            <input
                type="text"
                value={"Job title, keywords, or company"}
                className="search__input"
                onChange={searchTimer} />
            <button type="button" className="search__button" onClick={clearTimeout(searchTimer)}>Search</button>
        </div>
    );
};