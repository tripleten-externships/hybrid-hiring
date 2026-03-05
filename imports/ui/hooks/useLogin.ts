import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';

export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);

    Meteor.loginWithPassword(email, password, (err) => {
      setIsLoading(false);

      if (err) {
        setError(err.reason || 'Login Failed.');
      } else {
        navigate('/jobs');
      }
    });
  };

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    handleLogin,
  };
};
