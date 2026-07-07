import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCircleCheck,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useLogin } from '../../hooks/useLogin';
import { BACKGROUND_IMAGES } from '../../constants/backgroundImages';
import './Login.css';

const ASIDE_POINTS = [
  'Personalized job matches based on your profile',
  'Apply in one click and track every application',
  'Save jobs and pick up where you left off',
];

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const { error, setError, isLoading, handleLogin } = useLogin();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const emailErr =
      email.trim() === ''
        ? 'Email is required.'
        : !/\S+@\S+\.\S+/.test(email)
          ? 'Invalid email format.'
          : '';
    const pwErr = password.trim() === '' ? 'Password is required.' : '';

    setEmailError(emailErr);
    setPasswordError(pwErr);
    if (emailErr || pwErr) return;

    handleLogin(email, password, () => {
      setEmail('');
      setPassword('');
      navigate('/jobs');
    });
  };

  return (
    <div className="login login--split">
      <aside
        className="login__aside"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGES.homeCta})` }}
      >
        <div className="login__aside-overlay" aria-hidden="true" />
        <div className="login__aside-content">
          <Link to="/" className="login__brand" aria-label="Hybrid Hiring Solutions home">
            <img src="/assets/icons/hybrid_hiring-alt.svg" alt="" className="login__brand-mark" />
            <span className="login__brand-text">Hybrid Hiring Solutions</span>
          </Link>

          <div className="login__aside-copy">
            <h2 className="login__aside-title">Your next opportunity starts here.</h2>
            <p className="login__aside-subtitle">
              Log in to continue your search and connect with employers.
            </p>
            <ul className="login__aside-points">
              {ASIDE_POINTS.map((point) => (
                <li key={point} className="login__aside-point">
                  <FontAwesomeIcon icon={faCircleCheck} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="login__main">
        <div className="login__card">
          <div className="login__description">
            <h1 className="login__title">Welcome back</h1>
            <p className="login__subtitle">Log in to continue your job search.</p>
          </div>

          <form className="login__form" onSubmit={onSubmit} noValidate>
            <div className="login__field">
              <label htmlFor="email" className="login__label">
                Email
              </label>
              <div className="login__input-wrap">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="login__input-icon"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  className="login__input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setError('');
                  }}
                />
              </div>
              {emailError && (
                <p id="email-error" className="login__error" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            <div className="login__field">
              <label htmlFor="password" className="login__label">
                Password
              </label>
              <div className="login__input-wrap">
                <FontAwesomeIcon icon={faLock} className="login__input-icon" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login__input login__input--password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                    setError('');
                  }}
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="login__error" role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            <p className="login__forgot-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            {error && (
              <p className="login__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login__submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="login__spinner" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                  <FontAwesomeIcon icon={faArrowRight} className="login__submit-arrow" />
                </>
              )}
            </button>
          </form>

          <p className="login__signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
