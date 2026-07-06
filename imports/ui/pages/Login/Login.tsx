import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import './Login.css';

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
    <div className="login">
      {/* ─── Card ─── */}
      <div className="login__card">
        <div className="login__description">
          <h1 className="login__title">Welcome back!</h1>
          <p className="login__subtitle">Log in to continue your job search.</p>
        </div>

        <form className="login__form" onSubmit={onSubmit} noValidate>
          <div>
            <input
              id="email"
              type="email"
              className="login__input"
              placeholder="Email"
              aria-label="Email"
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
            {emailError && (
              <p id="email-error" className="login__error" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className="login__password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="login__input"
              placeholder="Password"
              aria-label="Password"
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
              <img src="/assets/icons/eye.svg" alt="" />
            </button>
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
              'Log In'
            )}
          </button>
        </form>

        <p className="login__signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
