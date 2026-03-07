import React, { FC, useState, FormEvent } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

export const SignUp: FC = () => {
  //local state for signup page
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);

    //wait time so we can witness spinner
    await new Promise((res) => setTimeout(res, 1000));

    //reate user
    Accounts.createUser(
      {
        email,
        password,
        profile: { name: `${firstName} ${lastName}` },
      },
      (err) => {
        if (err) {
          console.log('Signup error:', err);

          let message = 'Unable to create account. Please try again.';

          if ('error' in err && err.error === 403) {
            message = 'An account with this email may already exist.';
          }

          setError(message);
        } else {
          navigate('/onboarding/1');
        }

        setIsLoading(false);
      }
    );
  };
  return (
    <div className="sign-up">
      <div className="sign-up__header">
        <button type="button" className="sign-up__btn btn-back">
          <img src="/SignUp/skip.svg" alt="Skip" />
        </button>
        <div className="sign-up__logo">
          <img src="/SignUp/CompanyLogo.svg" alt="Logo" />
        </div>
        <button type="button" className="sign-up__btn btn-skip">
          Skip <img src="/SignUp/skip.svg" alt="Skip" />{' '}
        </button>
      </div>
      <div className="sign-up__main-content">
        <div className="sign-up__description">
          <h1 className="sign-up__title">Ready to take the next step?</h1>
          <p className="sign-up__subtitle">
            Build your profile and we will begin the hunt for you.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="sign-up__inputs">
          {/* Name - two column for desktop */}
          <div className="sign-up__basic">
            {' '}
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              className="sign-up__input first-name"
              type="text"
              placeholder="First Name"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              className="sign-up__input last-name"
              type="text"
              placeholder="Last Name"
            />
          </div>

          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sign-up__input"
            type="email"
            placeholder="Email"
            autoComplete="email"
          />
          <input
            id="password"
            className="sign-up__input"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                Creating acount...
              </>
            ) : (
              'Build My Profile'
            )}
          </button>
        </form>

        <p className="sign-up__login-link">
          Already have an account? <Link to="/LogIn"> Log In </Link>{' '}
        </p>
      </div>
    </div>
  );
};
