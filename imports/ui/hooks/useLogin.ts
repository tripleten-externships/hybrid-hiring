import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    Meteor.loginWithPassword(email, password, (error) => {
      setIsLoading(false);
      if (error) {
        setError(error.reason || 'Login Failed.');
      } else {
        navigate('/jobs');
      }
    });
  };


  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    setError,
    isLoading,
    setIsLoading,
    handleLogin,
  };
};
