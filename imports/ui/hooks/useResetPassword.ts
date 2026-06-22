import { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

export const useResetPassword = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = (token: string, password: string, onSuccess: () => void) => {
    setIsLoading(true);
    setError('');

    Accounts.resetPassword(token, password, (err) => {
      setIsLoading(false);

      if (err) {
        const meteorError = err as Meteor.Error;
        if (meteorError.error === 403) {
          setError('This reset link is invalid or has expired. Please request a new one.');
        } else {
          setError(meteorError.reason || 'Unable to reset password. Please try again.');
        }
        return;
      }

      onSuccess();
    });
  };

  return {
    error,
    setError,
    isLoading,
    handleResetPassword,
  };
};
