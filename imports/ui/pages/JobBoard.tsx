import React from 'react';
import { Link } from 'react-router-dom';
import { useIsLoggedIn } from '../hooks/useCurrentUser';
import { JobsCollection } from '../../api/jobs/collection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import type { Job } from '../../api/jobs/collection';
import { Spinner } from '../components/Spinner/Spinner';
import '../components/Spinner/Spinner.css';

import './JobBoard.css';

export const JobBoard: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();

  const isLoading = useSubscribe('jobs.all');

  const jobs: Job[] = useFind(() => JobsCollection.find({}, { sort: { postedAt: -1 } }));

  if (isLoading()) {
    return (
      <div className="job-board-loading">
        <Spinner size="lg" />
        <p>Loading jobs...</p>
      </div>
    );
  }
  return (
    <div className="job-board-container">
      {!isLoggedIn && (
        <section className="cta-section">
          <h1 className="cta-title">Your job search starts here</h1>
          <p className="cta-description">Create an account or sign in for recommended jobs</p>
          <Link to="/signup" className="btn-jb-signup">
            Get Started
          </Link>
        </section>
      )}

      <section className="jobs-list-jb">
        {jobs.map((job) => {
          return <div key={job._id}> {job.title} </div>;
        })}
      </section>
    </div>
  );
};

export default JobBoard;