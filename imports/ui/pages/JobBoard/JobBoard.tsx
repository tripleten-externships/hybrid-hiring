import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useIsLoggedIn, useMyProfile, useMyAppliedJobIds } from '/imports/ui/hooks/useCurrentUser';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import type { JobType } from '/imports/types/jobs';

import { SearchBar } from '/imports/ui/components/SearchBar/SearchBar';
import JobCard from '/imports/ui/components/JobCard/JobCard';
import { JobsCollection } from '/imports/api/jobs';

import './JobBoard.css';

const JOB_TYPE_OPTIONS: { label: string; value: JobType }[] = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
];

const PAY_UNIT_OPTIONS: { label: string; value: 'hourly' | 'salary' }[] = [
  { label: 'Hourly', value: 'hourly' },
  { label: 'Salary', value: 'salary' },
];

/** Builds the className for a filter chip from its active state. */
function filterOptionClass(isActive: boolean): string {
  const base = 'job-board__filter-option';
  return isActive ? `${base} ${base}--selected ${base}--active` : `${base} ${base}--inactive`;
}

function LoadingState() {
  return (
    <div className="job-board__loading" aria-live="polite" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="job-card-skeleton" />
      ))}
    </div>
  );
}

function GuestEmptyState() {
  return (
    <div className="job-board__empty">
      <h3 className="job-board__empty-heading">No jobs found</h3>
      <p className="job-board__empty-body">
        Try adjusting your search or check back soon — new listings are added regularly.
      </p>
    </div>
  );
}

function UserEmptyState() {
  return (
    <div className="job-board__empty">
      <h3 className="job-board__empty-heading">No suggested jobs yet</h3>
      <p className="job-board__empty-body">
        Complete your profile to see personalized recommendations.
      </p>
    </div>
  );
}

export function JobBoard() {
  const user = useTracker(() => Meteor.user(), []);
  const isLoggedIn = useIsLoggedIn();
  const { profile } = useMyProfile();
  const savedJobIds = profile?.savedJobs ?? [];
  const appliedJobIds = useMyAppliedJobIds();
  const userProfile = user?.profile as { name?: string; firstName?: string } | undefined;
  const firstName =
    userProfile?.firstName || userProfile?.name?.split(' ')[0] || user?.username || 'there';

  // ── Search state ──────────────────────────────────────────────────────────
  const [titleInput, setTitleInput] = React.useState('');
  const [locationInput, setLocationInput] = React.useState('');
  const [activeTitle, setActiveTitle] = React.useState('');
  const [activeLocation, setActiveLocation] = React.useState('');
  const [debouncedTitle] = useDebounce(titleInput, 300);

  // ── Filter panel state ────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const filtersTriggerRef = React.useRef<HTMLButtonElement>(null);
  const drawerCloseRef = React.useRef<HTMLButtonElement>(null);
  const [selectedJobTypes, setSelectedJobTypes] = React.useState<JobType[]>([]);
  const [selectedPayUnit, setSelectedPayUnit] = React.useState<'hourly' | 'salary' | ''>('');
  const [minPayInput, setMinPayInput] = React.useState('');

  const activeFilterCount =
    selectedJobTypes.length + (selectedPayUnit ? 1 : 0) + (minPayInput ? 1 : 0);

  const hasFilters = !!(activeTitle || activeLocation || activeFilterCount);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTitle(titleInput.trim());
    setActiveLocation(locationInput.trim());
  };

  const handleClearFilters = () => {
    setTitleInput('');
    setLocationInput('');
    setActiveTitle('');
    setActiveLocation('');
    setSelectedJobTypes([]);
    setSelectedPayUnit('');
    setMinPayInput('');
  };

  const toggleJobType = (type: JobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const openFilters = React.useCallback(() => {
    setFiltersOpen(true);
  }, []);

  const closeFilters = React.useCallback(() => {
    filtersTriggerRef.current?.focus();
    setFiltersOpen(false);
  }, []);

  // ── Drawer side-effects: lock body scroll, focus, close on Escape ─────────
  React.useEffect(() => {
    if (!filtersOpen) return;

    drawerCloseRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFilters();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [filtersOpen, closeFilters]);

  // ── Subscription ──────────────────────────────────────────────────────────
  // Always subscribe to jobs.all for a stable, consistent document set.
  // Recommended filtering is applied client-side below.
  const { isLoading, jobs } = useTracker(() => {
    const sub = debouncedTitle
      ? Meteor.subscribe('jobs.search', debouncedTitle, '')
      : Meteor.subscribe('jobs.all');
    return {
      isLoading: !sub.ready(),
      jobs: JobsCollection.find({}, { sort: { postedAt: -1, _id: 1 } }).fetch(),
    };
  }, [debouncedTitle]);

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filteredJobs = React.useMemo(() => {
    let result = jobs;

    if (activeLocation) {
      const loc = activeLocation.toLowerCase();
      result = result.filter((j) => j.location?.toLowerCase().includes(loc));
    }
    if (selectedJobTypes.length > 0) {
      result = result.filter((j) => selectedJobTypes.includes(j.jobType));
    }
    if (selectedPayUnit) {
      result = result.filter((j) => j.payUnit === selectedPayUnit);
    }
    if (minPayInput) {
      const min = parseFloat(minPayInput);
      if (!isNaN(min)) {
        result = result.filter((j) => j.basePay >= min);
      }
    }

    return result;
  }, [jobs, activeLocation, selectedJobTypes, selectedPayUnit, minPayInput]);

  const showingSearch = !!(activeTitle || activeLocation || activeFilterCount);

  const listingsLabel = showingSearch
    ? 'Search Results'
    : isLoggedIn
      ? 'Suggested jobs for you'
      : 'All Jobs';

  return (
    <div className={`job-board${filtersOpen ? ' job-board--drawer-open' : ''}`}>
      {/* ── Search bar ── */}
      <section className="job-board__search-section">
        <form className="job-board__search-form" onSubmit={handleSearch} role="search">
          <SearchBar
            value={titleInput}
            onChange={setTitleInput}
            onSearch={setActiveTitle}
            placeholder="Job title, keywords, or company"
            ariaLabel="Search by job title, keywords, or company"
            showButton={false}
            icon={
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
                <line
                  x1="13.5"
                  y1="13.5"
                  x2="18"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <div className="job-board__search-divider" aria-hidden="true" />
          <SearchBar
            value={locationInput}
            onChange={setLocationInput}
            onSearch={setActiveLocation}
            placeholder="City, state, or zip code"
            ariaLabel="Search by location"
            showButton={false}
            icon={
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                />
                <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
            }
          />
          <button type="submit" className="job-board__search-btn">
            Search
          </button>
        </form>
        <hr className="job-board__divider" />
      </section>

      {/* ── Sticky header / intro ── */}
      <section className="job-board__header">
        <div className="job-board__header-text">
          {isLoggedIn ? (
            <h1 className="job-board__heading">Welcome, {firstName}</h1>
          ) : (
            <h1 className="job-board__heading">Your job search starts here</h1>
          )}
          <p className="job-board__subheading">
            {listingsLabel}
            {!isLoading && (
              <span className="job-board__result-count"> ({filteredJobs.length})</span>
            )}
          </p>
        </div>

        <div className="job-board__header-actions">
          {!isLoggedIn && (
            <Link to="/signup" className="job-board__cta-btn">
              Get Started
            </Link>
          )}

          {hasFilters && (
            <button
              type="button"
              className="job-board__filter-chip job-board__filter-chip--clear"
              onClick={handleClearFilters}
            >
              Clear all
            </button>
          )}

          <button
            ref={filtersTriggerRef}
            type="button"
            className={`job-board__filter-chip${filtersOpen ? ' job-board__filter-chip--active' : ''}`}
            onClick={() => (filtersOpen ? closeFilters() : openFilters())}
            aria-expanded={filtersOpen}
            aria-haspopup="dialog"
            aria-controls="job-board-filters-drawer"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
              <line x1="0" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" />
              <rect
                x="3"
                y="0.25"
                width="3"
                height="3.5"
                rx="1"
                fill="white"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <rect
                x="8"
                y="4.25"
                width="3"
                height="3.5"
                rx="1"
                fill="white"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="job-board__filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </section>

      {/* ── Filter drawer ── */}
      <div
        className={`job-board__drawer-backdrop${filtersOpen ? ' job-board__drawer-backdrop--open' : ''}`}
        onClick={closeFilters}
        aria-hidden="true"
      />
      <aside
        id="job-board-filters-drawer"
        className={`job-board__drawer${filtersOpen ? ' job-board__drawer--open' : ''}`}
        role="dialog"
        aria-modal={filtersOpen ? true : undefined}
        aria-label="Filters"
        {...(!filtersOpen ? { inert: '' as const } : {})}
      >
        <header className="job-board__drawer-header">
          <h2 className="job-board__drawer-title">Filters</h2>
          <button
            ref={drawerCloseRef}
            type="button"
            className="job-board__drawer-close"
            onClick={closeFilters}
            aria-label="Close filters"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <line
                x1="4"
                y1="4"
                x2="14"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="14"
                y1="4"
                x2="4"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="job-board__drawer-body">
          <div className="job-board__filter-group">
            <p className="job-board__filter-label">Job Type</p>
            <div className="job-board__filter-options">
              {JOB_TYPE_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={filterOptionClass(selectedJobTypes.includes(value))}
                  onClick={() => toggleJobType(value)}
                  aria-pressed={selectedJobTypes.includes(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="job-board__filter-group">
            <p className="job-board__filter-label">Pay Type</p>
            <div className="job-board__filter-options">
              {PAY_UNIT_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={filterOptionClass(selectedPayUnit === value)}
                  onClick={() => setSelectedPayUnit((prev) => (prev === value ? '' : value))}
                  aria-pressed={selectedPayUnit === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="job-board__filter-group">
            <label htmlFor="min-pay" className="job-board__filter-label">
              Minimum Pay
            </label>
            <div className="job-board__filter-pay">
              <span className="job-board__filter-pay-symbol">$</span>
              <input
                id="min-pay"
                type="number"
                min="0"
                placeholder="e.g. 20"
                value={minPayInput}
                onChange={(e) => setMinPayInput(e.target.value)}
                className="job-board__filter-pay-input"
              />
            </div>
          </div>
        </div>

        <footer className="job-board__drawer-footer">
          <button
            type="button"
            className="job-board__drawer-clear"
            onClick={handleClearFilters}
            disabled={!hasFilters}
          >
            Clear all
          </button>
          <button
            type="button"
            className="job-board__drawer-apply"
            onClick={closeFilters}
          >
            Show {filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'}
          </button>
        </footer>
      </aside>

      {/* ── Listings ── */}
      <section className="job-board__listings" aria-label="Job listings">
        {isLoading && jobs.length === 0 ? (
          <LoadingState />
        ) : filteredJobs.length === 0 && !isLoading ? (
          isLoggedIn ? (
            <UserEmptyState />
          ) : (
            <GuestEmptyState />
          )
        ) : (
          <div className={`job-board__grid${isLoading ? ' job-board__grid--refreshing' : ''}`}>
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.includes(job._id ?? '')}
                hasApplied={appliedJobIds.has(job._id ?? '')}
                onSave={
                  isLoggedIn
                    ? () => Meteor.callAsync('UserProfiles.toggleSaveJob', job._id)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
