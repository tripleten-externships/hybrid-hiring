import { useState } from 'react';
import TextInput from './components/TextInput';
import { Hello } from './Hello';
import { Info } from './Info';
import { UsersList } from './UsersList';
import { UsersManager } from './UsersManager';

export const App = () => {
  const [email, setEmail] = useState('');

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <Hello />
      <Info />
      <hr />
      <UsersList />
      <hr />
      <UsersManager />
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
