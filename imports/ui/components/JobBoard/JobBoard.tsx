import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker, useFind} from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { Button } from '/imports/ui/components/Button/Button';
// import JobCard from '/imports/ui/components/JobCard/jobCard';
import { JobsCollection, Job } from '/imports/api/jobs';

import './JobBoard.css';


// job type place holder
// type Job = {
//   _id: string;
//   title: string;
//   company: string;
//   location: string;
//   basePay: number;
//   payMax?: number;
//   payUnit: string;
//   jobType: string;
//   tags?: string[];
// };


// Sub element
function LoadingState(){
    return (
        <div className="job-board__loading" aria-live='polite' aria-busy='true'>
{Array.from({length:6 }).map((_) =>(
    <div key={1} className="job-card-skeleton"/>

    
))}

        </div>
    );
};


function EmptyState() {
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


// Main element
export default function JobBoard() {
    const user = useTracker(() => Meteor.user(),[]);
    const isLoggedIn = !!user;
  const firstName = user?.username ?? 'there';

//   Subscribe to auth state publication
const subName = isLoggedIn ? 'jobs.recommended' : 'jobs.all';
const isLoading = useSubscribe(subName);

const jobs: Job[] = useFind(
    () => JobsCollection.find ({}, {sort:{postedAt:-1}}),
    [isLoggedIn]
);



  return (
    <div className="job-board">
      <section className="job-board__header">
        {isLoggedIn ? (
          <>
            <h1 className="job-board__heading">Welcome, {firstName}!</h1>
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

        <section className="job-board__grid-section" aria-label="Job listing">
          {isLoading() ? (
            <LoadingState />
          ) : jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="job-board__grid">

              {/* JobCard place holder */}
             
            )
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
