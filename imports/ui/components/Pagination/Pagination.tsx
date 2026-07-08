import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Optional summary shown alongside the controls (e.g. "Showing 1–12 of 48"). */
  summary?: string;
  className?: string;
  /** Accessible label for the surrounding nav landmark. */
  ariaLabel?: string;
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

/** Builds a compact page list with ellipses for large ranges. */
function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) items.push('ellipsis-left');
  for (let page = left; page <= right; page++) items.push(page);
  if (right < total - 1) items.push('ellipsis-right');

  items.push(total);
  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  summary,
  className,
  ariaLabel = 'Pagination',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages);
    if (next !== currentPage) onPageChange(next);
  };

  const pageItems = getPageItems(currentPage, totalPages);

  return (
    <nav className={className ? `pagination ${className}` : 'pagination'} aria-label={ariaLabel}>
      {summary && <p className="pagination__summary">{summary}</p>}

      <ul className="pagination__list">
        <li>
          <button
            type="button"
            className="pagination__btn pagination__btn--nav pagination__btn--previous"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3.5 5.5 8l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>

        {pageItems.map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={`pagination__btn${item === currentPage ? ' pagination__btn--active' : ''}`}
                onClick={() => goTo(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className="pagination__ellipsis" aria-hidden="true">
              …
            </li>
          )
        )}

        <li>
          <button
            type="button"
            className="pagination__btn pagination__btn--nav pagination__btn--next"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3.5 10.5 8 6 12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
