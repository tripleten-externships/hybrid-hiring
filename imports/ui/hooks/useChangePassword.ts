import { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

export const useChangePassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = (
    oldPassword: string,
    newPassword: string,
    onSuccess?: () => void
  ) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    Accounts.changePassword(oldPassword, newPassword, (err) => {
      setIsLoading(false);

      if (err) {
        const meteorError = err as Meteor.Error;
        if (meteorError.error === 403) {
          setError('Current password is incorrect.');
        } else {
          setError(meteorError.reason || 'Unable to update password. Please try again.');
        }
        return;
      }

      setSuccess('Password updated successfully.');
      onSuccess?.();
    });
  };

  return {
    error,
    setError,
    success,
    setSuccess,
    isLoading,
    handleChangePassword,
  };
};
