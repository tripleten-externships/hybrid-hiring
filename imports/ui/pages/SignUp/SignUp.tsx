import React, { FC, useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

export const SignUp: FC = () => {
  // local state for signup page
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);

    Accounts.createUser(
      {
        email,
        password,
        profile: { name: `${firstName} ${lastName}` },
      },
      (err) => {
        if (err) {
          let message = 'Unable to create account. Please try again.';

          if ('error' in err && err.error === 403) {
            message = 'An account with this email may already exist.';
          }

          setError(message);
        } else {
          navigate('/onboarding/personal');
        }

        setIsLoading(false);
      }
    );
  };
  return (
    <div className="sign-up">
      <div className="sign-up__header">
        <button onClick={() => navigate('/')} type="button" className="sign-up__btn btn-back">
          <img src="/assets/skip.svg" alt="Skip" />
        </button>
        <div className="sign-up__logo">
          <img src="/assets/company-logo.svg" alt="Logo" />
        </div>
        <button onClick={() => navigate('/jobs')} type="button" className="sign-up__btn btn-skip">
          Skip <img src="/assets/skip.svg" alt="Skip" />{' '}
        </button>
      </div>
      <div className="sign-up__main-content">
        <div className="sign-up__description">
          <h1 className="sign-up__title">Ready to take the next step?</h1>
          <p className="sign-up__subtitle">
            Build your profile and we will begin the hunt for you.
          </p>
        </div>
        <form className="sign-up__inputs" onSubmit={handleSubmit} noValidate>
          {/* Name - two column for desktop */}
          <div className="sign-up__basic">
            {' '}
            <input
              value={firstName}
              id="firstName"
              className="sign-up__input first-name"
              type="text"
              placeholder="First Name"
              onChange={(evt) => {
                setFirstName(evt.target.value);
                setError('');
              }}
              required
            />
            <input
              value={lastName}
              id="lastName"
              className="sign-up__input last-name"
              type="text"
              placeholder="Last Name"
              onChange={(evt) => {
                setLastName(evt.target.value);
                setError('');
              }}
              required
            />
          </div>

          <input
            id="email"
            value={email}
            className="sign-up__input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            onChange={(evt) => {
              setEmail(evt.target.value);
              setError('');
            }}
          />
          <input
            id="password"
            className="sign-up__input"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(evt) => {
              setPassword(evt.target.value);
              setError('');
            }}
          />
          <input
            id="confirmPassword"
            className="sign-up__input"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <div className="sign-up__error">{error}</div>}
          <button type="submit" className="sign-up__btn btn-create" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="sign-up__spinner"></span>
                Creating account...
              </>
            ) : (
              'Build My Profile'
            )}
          </button>
        </form>

        <p className="sign-up__login-link">
          Already have an account? <Link to="/login"> Log In </Link>{' '}
        </p>
      </div>
    </div>
  );
};
