import React, { ChangeEvent, useState } from 'react';
import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import { TextArea, TextInput } from '../components';

// 
import JobCard from '../components/JobCard/JobCard';

// JobCard Test-----
const testJob = {
_id: '1',
title: 'Master Electrician',
company: 'Trinity Solar',
location: 'Pittsburgh, PA 15201 (Central Lawrenceville area',
basePay: 46,
payMax:50,
payUnit: 'hr',
jobType: 'Full-time',
tags: ['Paid Training', '401(K) matching'],
};

// 
export const Home = () => {
  const [saved, setSaved] = useState(false);

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>
{/* JobCard Test */}
<JobCard job={testJob} isSaved={saved} onSave={() => setSaved(prev => !prev)} />


      <Hello />
      <br />

      <Info />
      <br />

      <TextArea
        label="Message"
        id="message"
        value={message}
        onChange={handleMessageChange}
        rows={10}
        error={!message ? 'Required' : undefined}
        fullWidth
      />

      <TextInput
        label="Email"
        id="email"
        value={email}
        onChange={handleEmailChange}
        error={!email ? 'Required' : undefined}
      />
    </div>
  );
};
