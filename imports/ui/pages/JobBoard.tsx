import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { useIsLoggedIn } from '../hooks/useCurrentUser';
import { JobsCollection } from '../../api/jobs/collection';
import { useTracker } from 'meteor/react-meteor-data';
import { Spinner } from '../components/Spinner/Spinner';
import '../components/Spinner/Spinner.css';

import './JobBoard.css';
import { SearchBar } from '../components/SearchBar/SearchBar';

export const JobBoard: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();

  const [searchQuery, setSearchQuery] = React.useState("");

  const { isLoading, jobs } = useTracker(() => {
    let subscription;
    if (searchQuery) {
      subscription = Meteor.subscribe('jobs.search', searchQuery, '');
    } else if (isLoggedIn) {
      subscription = Meteor.subscribe('jobs.recommended');
    } else {
      subscription = Meteor.subscribe('jobs.all');
    }

    return {
      isLoading: !subscription.ready(),
      jobs: JobsCollection.find({}, { sort: { postedAt: -1 } }).fetch(),
    };
  }, [searchQuery, isLoggedIn]);

  if (isLoading) {
    return (
      <div className="job-board-loading">
        <Spinner size="lg" />
        <p>Loading jobs...</p>
      </div>
    );
  }
  return (
    <div className="job-board-container">
      <SearchBar value={searchQuery} onSearch={setSearchQuery} delay={300} />
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
