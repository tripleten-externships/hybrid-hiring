import React, { FC, useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import './SignUp.css';

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldErrors {
  const errors: FieldErrors = {};

  if (!firstName.trim()) errors.firstName = 'First name is required.';
  if (!lastName.trim()) errors.lastName = 'Last name is required.';

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export const SignUp: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    const errors = validate(firstName, lastName, email, password, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    Accounts.createUser(
      {
        email: email.trim(),
        password,
        profile: { name: `${firstName.trim()} ${lastName.trim()}` },
      },
      (err) => {
        if (err) {
          let message = 'Unable to create account. Please try again.';
          if ('error' in err && err.error === 403) {
            message = 'An account with this email already exists.';
          }
          setServerError(message);
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
          <img src="/assets/icons/skip.svg" alt="Back" />
        </button>
        <div className="sign-up__logo">
          <img src="/assets/icons/company-logo.svg" alt="Logo" />
        </div>
        <button onClick={() => navigate('/jobs')} type="button" className="sign-up__btn btn-skip">
          Skip <img src="/assets/icons/skip.svg" alt="Skip" />
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
          {/* Name row */}
          <div className="sign-up__basic">
            <div className="sign-up__field">
              <input
                value={firstName}
                id="firstName"
                className={`sign-up__input first-name${fieldErrors.firstName ? ' sign-up__input--error' : ''}`}
                type="text"
                placeholder="First Name"
                autoComplete="given-name"
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                onChange={(e) => { setFirstName(e.target.value); clearFieldError('firstName'); }}
              />
              {fieldErrors.firstName && (
                <span id="firstName-error" className="sign-up__field-error">
                  {fieldErrors.firstName}
                </span>
              )}
            </div>

            <div className="sign-up__field">
              <input
                value={lastName}
                id="lastName"
                className={`sign-up__input last-name${fieldErrors.lastName ? ' sign-up__input--error' : ''}`}
                type="text"
                placeholder="Last Name"
                autoComplete="family-name"
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                onChange={(e) => { setLastName(e.target.value); clearFieldError('lastName'); }}
              />
              {fieldErrors.lastName && (
                <span id="lastName-error" className="sign-up__field-error">
                  {fieldErrors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="sign-up__field">
            <input
              id="email"
              value={email}
              className={`sign-up__input${fieldErrors.email ? ' sign-up__input--error' : ''}`}
              type="email"
              placeholder="Email"
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
            />
            {fieldErrors.email && (
              <span id="email-error" className="sign-up__field-error">
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="sign-up__field">
            <input
              id="password"
              className={`sign-up__input${fieldErrors.password ? ' sign-up__input--error' : ''}`}
              type="password"
              placeholder="Password (min. 8 characters)"
              autoComplete="new-password"
              value={password}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
            />
            {fieldErrors.password && (
              <span id="password-error" className="sign-up__field-error">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirm password */}
          <div className="sign-up__field">
            <input
              id="confirmPassword"
              className={`sign-up__input${fieldErrors.confirmPassword ? ' sign-up__input--error' : ''}`}
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={confirmPassword}
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
              onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
            />
            {fieldErrors.confirmPassword && (
              <span id="confirmPassword-error" className="sign-up__field-error">
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          {serverError && (
            <div className="sign-up__error" role="alert">
              {serverError}
            </div>
          )}

          <button type="submit" className="sign-up__btn btn-create" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="sign-up__spinner" />
                Creating account...
              </>
            ) : (
              'Build My Profile'
            )}
          </button>
        </form>

        <p className="sign-up__login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};
