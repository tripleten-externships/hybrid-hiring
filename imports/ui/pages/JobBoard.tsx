import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useIsLoggedIn } from '/imports/ui/hooks/useCurrentUser';
import { Link } from 'react-router-dom';

import { Button } from '/imports/ui/components/Button/Button';
import JobCard from '/imports/ui/components/JobCard/JobCard';
import { JobsCollection } from '/imports/api/jobs';
import { SearchBar } from '/imports/ui/components/SearchBar/SearchBar';
import { SelectionLabel } from '../components/SelectionLabel/SelectionLabel';

import './JobBoard.css';

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
      <p className="job-board__empty-icon">Searching</p>
      <h3 className="job-board__empty-heading">No jobs found</h3>
      <p className="job-board__empty-body">
        Try adjusting your filters or check back soon - new listings are added regularly.
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

export default function JobBoard() {
  const user = useTracker(() => Meteor.user(), []);
  const isLoggedIn = useIsLoggedIn();
  const firstName = (user?.profile as { firstName?: string })?.firstName || user?.username || 'there';

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [activeJobType, setActiveJobType] = React.useState<'full-time' | 'part-time' | null>(null);

  const { isLoading, jobs } = useTracker(() => {
    let sub;
    if (searchQuery || activeJobType) {
      sub = Meteor.subscribe('jobs.search', searchQuery, activeJobType);
    } else if (isLoggedIn) {
      sub = Meteor.subscribe('jobs.recommended');
    } else {
      sub = Meteor.subscribe('jobs.all');
    }

    return {
      isLoading: !sub.ready(),
      jobs: JobsCollection.find({}, { sort: { postedAt: -1 } }).fetch(),
    };
  }, [searchQuery, isLoggedIn, activeJobType]);

  return (
    <div className="job-board">
      <section className="job-board__search">
        <SearchBar value={searchQuery} onSearch={setSearchQuery} delay={300} />
        <SelectionLabel
          label="Full-Time"
          selected={activeJobType === 'full-time'}
          onClick={() => {
            setActiveJobType(activeJobType === 'full-time' ? null : 'full-time');
          }}
        />
        <SelectionLabel
          label="Part-Time"
          selected={activeJobType === 'part-time'}
          onClick={() => {
            setActiveJobType(activeJobType === 'part-time' ? null : 'part-time');
          }}
        />
        <hr className="job-board__header-divider" />
      </section>

      <section className="job-board__header">
        {isLoggedIn ? (
          <>
            <h1 className="job-board__heading">Welcome back, {firstName}!</h1>
          </>
        ) : (
          <>
            <h1 className="job-board__heading">Your job search starts here</h1>
            <p className="job-board__subheading">
              Create an account or sign in for recommended jobs.
            </p>
            <Link to="/signup" className="job-board__button">
              <Button variant="primary" size="lg" fullWidth>
                Get Started
              </Button>
            </Link>
          </>
        )}
      </section>

      <div className="job-board__controls">
        <section className="job-board__grid-section" aria-label="Job listings">
          {isLoading ? (
            <LoadingState />
          ) : jobs.length === 0 ? (
            isLoggedIn ? (
              <UserEmptyState />
            ) : (
              <GuestEmptyState />
            )
          ) : (
            <div className="job-board__grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} isSaved={false} onSave={() => { }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
