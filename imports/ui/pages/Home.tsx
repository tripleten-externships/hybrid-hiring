import React, { useState } from 'react';
import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import { TextArea } from '../components';

export const Home = () => {
  const [message, setMessage] = useState('');

  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>

      <Hello />
      <br />

      <Info />
      <br />

      <TextArea
        label="Message"
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={10}
        error={!message ? 'Required' : undefined}
        fullWidth
      />
    </div>
  );
};
