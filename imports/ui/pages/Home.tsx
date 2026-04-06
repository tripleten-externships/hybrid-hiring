import React, { ChangeEvent, useState } from 'react';
import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import { TextArea, TextInput } from '../components';

export const Home = () => {

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
