import React, { FC, useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';

export const SignUp: FC = () => {
  //local state for signup page
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="sign-up">
      <div className="sign-up__header">
        <button type="button" className="sign-up__btn btn-back">
          <img src="/assets/skip.svg" alt="Skip" />
        </button>
        <div className="sign-up__logo">
          <img src="/assets/company-logo.svg" alt="Logo" />
        </div>
        <button type="button" className="sign-up__btn btn-skip">
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
        <form className="sign-up__inputs">
          {/* Name - two column for desktop */}
          <div className="sign-up__basic">
            {' '}
            <input
              id="firstName"
              className="sign-up__input first-name"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(evt) => setFirstName(evt.target.value)}
            />
            <input
              id="lastName"
              className="sign-up__input last-name"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(evt) => setLastName(evt.target.value)}
            />
          </div>

          <input
            id="email"
            className="sign-up__input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <input
            id="password"
            className="sign-up__input"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
          <input
            id="confirmPassword"
            className="sign-up__input"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(evt) => setConfirmPassword(evt.target.value)}
          />
        </form>
        <button type="submit" className="sign-up__btn btn-create">
          Build My Profile
        </button>
        <p className="sign-up__login-link">
          Already have an account? <Link to="/LogIn"> Log In </Link>{' '}
        </p>
      </div>
    </div>
  );
};