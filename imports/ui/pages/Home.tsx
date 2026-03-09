import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import TextInput from '../components/TextInput';
import { useState } from 'react';

export const Home = () => {
  const [email, setEmail] = useState('');
  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>
      <Hello />
      <br />
      <Info />
      <TextInput
        label="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!email ? 'Required' : undefined}
      />
    </div>
  );
};
