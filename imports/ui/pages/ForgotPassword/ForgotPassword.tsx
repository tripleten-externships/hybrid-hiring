import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import '../Login/Login.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { error, isLoading, isSubmitted, handleForgotPassword } = useForgotPassword();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const emailErr =
      email.trim() === ''
        ? 'Email is required.'
        : !EMAIL_RE.test(email.trim())
          ? 'Invalid email format.'
          : '';

    setEmailError(emailErr);
    if (emailErr) return;

    handleForgotPassword(email, () => {});
  };

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__description">
          <h1 className="login__title">Reset your password</h1>
          <p className="login__subtitle">
            {isSubmitted
              ? 'If an account exists for that email, we sent a link to reset your password.'
              : 'Enter your email and we will send you a reset link.'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="login__form">
            <Link to="/login" className="login__submit-btn">
              Back to Log In
            </Link>
          </div>
        ) : (
          <form className="login__form" onSubmit={onSubmit} noValidate>
            <div>
              <input
                id="email"
                type="email"
                className="login__input"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
              />
              {emailError && <p className="login__error">{emailError}</p>}
            </div>

            {error && <p className="login__error">{error}</p>}

            <button type="submit" className="login__submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="login__spinner" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}

        <p className="login__signup-link">
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};
