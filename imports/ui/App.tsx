import { Hello } from './Hello';
import { Info } from './Info';
import { UsersList } from './UsersList';
import { UsersManager } from './UsersManager';
import { Button } from './components/Button'

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello />
    <Info />
    <hr />
    <UsersList />
    <hr />
    <UsersManager />
      <Button>Click me</Button>
  </div>
);
