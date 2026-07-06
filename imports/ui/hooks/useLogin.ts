import { useState } from 'react';
import { Meteor } from 'meteor/meteor';

/**
 * Turns a Meteor login error into a user-facing message. Unmatched credentials
 * (unknown email or wrong password) are collapsed into a single generic message
 * so we don't reveal whether an account exists (avoids account enumeration).
 */
function mapLoginError(error: unknown): string {
  if (error instanceof Meteor.Error) {
    // Locked accounts are surfaced explicitly (see validateLoginAttempt).
    if (error.error === 'account-locked') {
      return error.reason || 'This account has been locked. Please contact support.';
    }
    // 403 covers "User not found" and "Incorrect password".
    if (error.error === 403 || error.error === '403') {
      return 'The email or password you entered is incorrect.';
    }
    if (error.reason) return error.reason;
  }
  return 'Something went wrong logging you in. Please try again.';
}

export const useLogin = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (email: string, password: string, onSuccess: () => void) => {
    setError('');
    setIsLoading(true);

    Meteor.loginWithPassword(email, password, (error) => {
      setIsLoading(false);

      if (error) {
        setError(mapLoginError(error));
      } else {
        onSuccess();
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
