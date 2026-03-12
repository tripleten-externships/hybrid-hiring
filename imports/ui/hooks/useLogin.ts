import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
// import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (email: string, password: string, onSuccess: () => void) => {
    setIsLoading(true);

    Meteor.loginWithPassword(email, password, (error) => {
      setIsLoading(false);

      if (error) {
        setError((error as Meteor.Error)?.reason || 'Login Failed.');
      } else {
        onSuccess();
        // Navitate to jobs page after successful login once /jobs route is implemented
        // navigate('/jobs');
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
