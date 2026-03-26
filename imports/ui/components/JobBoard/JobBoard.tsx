import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker, useFind } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { Button } from '/imports/ui/components/Button/Button';
import JobCard from '/imports/ui/components/JobCard/JobCard';
import { JobsCollection } from '/imports/api/jobs';

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
  const isLoggedIn = !!user;
  const firstName =
    (user?.profile as { firstName?: string })?.firstName || user?.username || 'there';

  // Subscription
  const subName = isLoggedIn ? 'jobs.recommended' : 'jobs.all';
  const isLoading = useSubscribe(subName);

  // active job data
  const jobs = useFind(
    () => JobsCollection.find({ isActive: true }, { sort: { postedAt: -1 } }),
    [isLoggedIn]
  );

  return (
    <div className="job-board">
      <section className="job-board__header">
        {isLoggedIn ? (
          <>
            <h1 className="job-board__heading">Welcome back, {firstName}!</h1>
            {/* TODO: Filter Chip */}
            <p className="job-board__subheading">Suggested jobs for you</p>
          </>
        ) : (
          <>
            <h1 className="job-board__heading">Your job search starts here</h1>
            <p className="job-board__subheading">
              Discover opportunities that match your skills and goals.
            </p>
            <Link to="/signup">
              <Button variant="primary" size="md">
                Create Account
              </Button>
            </Link>
          </>
        )}
      </section>

      <div className="job-board__controls">
        {/* SearchBar */}
        {/* <div className='job-board__searchbar' aria-hidden='true'/>
        </div> */}

        <section className="job-board__grid-section" aria-label="Job listings">
          {isLoading() ? (
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
                <JobCard key={job._id} job={job} isSaved={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
