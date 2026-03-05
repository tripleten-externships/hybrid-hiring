import React, { FC } from 'react';
import './SignUp.css';

export const SignUp: FC = () => {
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
        <form className="sign-up__inputs">
          {/* Name - two column for desktop */}
          <div className="sign-up__basic">
            {' '}
            <input className="sign-up__input first-name" type="text" placeholder="First Name" />
            <input className="sign-up__input last-name" type="text" placeholder="Last Name" />
          </div>

          <input className="sign-up__input" type="email" placeholder="Email" />
          <input className="sign-up__input" type="password" placeholder="Password" />
          <input className="sign-up__input" type="password" placeholder="Re-enter password" />
        </form>
        <button type="submit" className="sign-up__btn btn-create">
          Build My Profile
        </button>
      </div>
    </div>
  );
};
