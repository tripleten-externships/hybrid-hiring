import { useState } from 'react';
import { Button } from '../components/Button/Button';

export const Hello = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  return (
    <div>
      <Button onClick={increment}>
        <span className="btn-label">Click Me</span>
      </Button>
      <p>You've pressed the button {counter} times.</p>
    </div>
  );
};
