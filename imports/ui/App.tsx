import { useState } from 'react';
import { Hello } from './Hello';
import { Info } from './Info';
import { UsersList } from './UsersList';
import { UsersManager } from './UsersManager';
import TextArea from './components/TextArea';

export const App = () => { 
   const [message, setMessage] = useState('');
  return(
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello />
    <Info />
    <hr />
    <UsersList />
    <hr />
    <UsersManager />
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
