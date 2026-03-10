import React, { FC, useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';

export const SignUp: FC = () => {
  //local state for signup page
  const [_email, _setEmail] = useState('');
  const [_password, _etPassword] = useState('');
  const [_firstName, _setFirstName] = useState('');
  const [_lastName, _setLastName] = useState('');
  const [_confirmPassword, _setConfirmPassword] = useState('');

  const [_isLoading, _setIsLoading] = useState(false);
  const [_error, _setError] = useState('');

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
        <form className="sign-up__inputs">
          {/* Name - two column for desktop */}
          <div className="sign-up__basic">
            {' '}
            <input
              id="firstName"
              className="sign-up__input first-name"
              type="text"
              placeholder="First Name"
            />
            <input
              id="lastName"
              className="sign-up__input last-name"
              type="text"
              placeholder="Last Name"
            />
          </div>

          <input
            id="email"
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
          />
          <input
            id="confirmPassword"
            className="sign-up__input"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
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
