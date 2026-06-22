import { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

export const useForgotPassword = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleForgotPassword = (email: string, onSuccess: () => void) => {
    setIsLoading(true);
    setError('');

    Accounts.forgotPassword({ email: email.trim() }, (err) => {
      setIsLoading(false);

      if (err) {
        setError((err as Meteor.Error)?.reason || 'Unable to send reset email. Please try again.');
        return;
      }

      setIsSubmitted(true);
      onSuccess();
    });
  };

  return {
    error,
    setError,
    isLoading,
    isSubmitted,
    handleForgotPassword,
  };
};
