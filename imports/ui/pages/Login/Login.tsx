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

  const { error, isLoading, handleLogin } = useLogin();

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
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
            />
            {emailError && <p className="login__error">{emailError}</p>}
          </div>

          <div className="login__password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="login__input"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
            />
            <button
              type="button"
              className="login__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <img src="/assets/icons/eye.svg" alt="" />
            </button>
            {passwordError && <p className="login__error">{passwordError}</p>}
          </div>

          <p className="login__forgot-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

          {error && <p className="login__error">{error}</p>}

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
