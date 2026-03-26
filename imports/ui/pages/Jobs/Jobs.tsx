import React from 'react';
import JobBoard from '../../components/JobBoard/JobBoard';

export const Jobs = () => {
  return (
    <div>
      <h2>Hi, I'm the Jobs page!</h2>
      <p>You can only see me if you're logged in! 😏</p>
      <p>There will be jobs here someday...</p>
      <JobBoard/>
    </div>
  );
};
