import React, { FC, useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCircleCheck,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { BACKGROUND_IMAGES } from '../../constants/backgroundImages';
import './SignUp.css';

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ASIDE_POINTS = [
  'Build a profile that gets you noticed',
  'Get matched with roles that fit your goals',
  'Track applications and hear back faster',
];

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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="sign-up sign-up--split">
      <aside
        className="sign-up__aside"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGES.homeHeader})` }}
      >
        <div className="sign-up__aside-overlay" aria-hidden="true" />
        <div className="sign-up__aside-content">
          <Link to="/" className="sign-up__brand" aria-label="Hybrid Hiring Solutions home">
            <img src="/assets/icons/hybrid_hiring-alt.svg" alt="" className="sign-up__brand-mark" />
            <span className="sign-up__brand-text">Hybrid Hiring Solutions</span>
          </Link>

          <div className="sign-up__aside-copy">
            <h2 className="sign-up__aside-title">Let's find your next role.</h2>
            <p className="sign-up__aside-subtitle">
              Create your account and we'll begin the hunt for opportunities that match you.
            </p>
            <ul className="sign-up__aside-points">
              {ASIDE_POINTS.map((point) => (
                <li key={point} className="sign-up__aside-point">
                  <FontAwesomeIcon icon={faCircleCheck} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="sign-up__main">
        <div className="sign-up__main-content">
          <div className="sign-up__description">
            <Link to="/" className="sign-up__card-brand" aria-label="Hybrid Hiring Solutions home">
              <img
                src="/assets/icons/hybrid_hiring-alt.svg"
                alt=""
                className="sign-up__card-brand-mark"
              />
            </Link>
            <div className="sign-up__description-text">
              <h1 className="sign-up__title">Create an account</h1>
              <p className="sign-up__subtitle">Build your profile and find your next role.</p>
            </div>
          </div>

          <form className="sign-up__inputs" onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div className="sign-up__basic">
              <div className="sign-up__field">
                <label htmlFor="firstName" className="sign-up__label">
                  First name
                </label>
                <div className="sign-up__input-wrap">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="sign-up__input-icon"
                    aria-hidden="true"
                  />
                  <input
                    value={firstName}
                    id="firstName"
                    className={`sign-up__input${fieldErrors.firstName ? ' sign-up__input--error' : ''}`}
                    type="text"
                    placeholder="Jane"
                    autoComplete="given-name"
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearFieldError('firstName');
                    }}
                  />
                </div>
                {fieldErrors.firstName && (
                  <span id="firstName-error" className="sign-up__field-error">
                    {fieldErrors.firstName}
                  </span>
                )}
              </div>

              <div className="sign-up__field">
                <label htmlFor="lastName" className="sign-up__label">
                  Last name
                </label>
                <div className="sign-up__input-wrap">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="sign-up__input-icon"
                    aria-hidden="true"
                  />
                  <input
                    value={lastName}
                    id="lastName"
                    className={`sign-up__input${fieldErrors.lastName ? ' sign-up__input--error' : ''}`}
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearFieldError('lastName');
                    }}
                  />
                </div>
                {fieldErrors.lastName && (
                  <span id="lastName-error" className="sign-up__field-error">
                    {fieldErrors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="sign-up__field">
              <label htmlFor="email" className="sign-up__label">
                Email
              </label>
              <div className="sign-up__input-wrap">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="sign-up__input-icon"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  value={email}
                  className={`sign-up__input${fieldErrors.email ? ' sign-up__input--error' : ''}`}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                />
              </div>
              {fieldErrors.email && (
                <span id="email-error" className="sign-up__field-error">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="sign-up__field">
              <label htmlFor="password" className="sign-up__label">
                Password
              </label>
              <div className="sign-up__input-wrap">
                <FontAwesomeIcon icon={faLock} className="sign-up__input-icon" aria-hidden="true" />
                <input
                  id="password"
                  className={`sign-up__input sign-up__input--password${fieldErrors.password ? ' sign-up__input--error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={password}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                />
                <button
                  type="button"
                  className="sign-up__password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {fieldErrors.password && (
                <span id="password-error" className="sign-up__field-error">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Confirm password */}
            <div className="sign-up__field">
              <label htmlFor="confirmPassword" className="sign-up__label">
                Confirm password
              </label>
              <div className="sign-up__input-wrap">
                <FontAwesomeIcon icon={faLock} className="sign-up__input-icon" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  className={`sign-up__input sign-up__input--password${fieldErrors.confirmPassword ? ' sign-up__input--error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={
                    fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined
                  }
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError('confirmPassword');
                  }}
                />
              </div>
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
                <>
                  Build My Profile
                  <FontAwesomeIcon icon={faArrowRight} className="sign-up__submit-arrow" />
                </>
              )}
            </button>
          </form>

          <p className="sign-up__login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
