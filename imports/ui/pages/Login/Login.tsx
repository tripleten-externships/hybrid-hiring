import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Button } from '../../components/Button/Button';
import { TextInput } from '../../components/TextInput/TextInput';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const { error, isLoading, handleLogin } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const onSuccess = () => {
      setEmail('');
      setPassword('');
      navigate('/jobs');
    };

    const hasEmailError =
      email.trim() === ''
        ? 'Email is required.'
        : !/\S+@\S+\.\S+/.test(email)
          ? 'Invalid email format.'
          : '';

    const hasPasswordError = password.trim() === '' ? 'Password is required.' : '';

    setEmailError(hasEmailError);
    setPasswordError(hasPasswordError);

    if (hasEmailError || hasPasswordError) {
      return;
    }

    handleLogin(email, password, onSuccess);
  };

  return (
    <>
      <img src="/assets/back.svg" alt="Back button" className="login__form-back-btn" />
      <img src="/assets/hhr-logo.svg" alt="Company Logo" className="login__form-company-logo" />
      <div className="login__form-container">
        <form className="login__form" onSubmit={onSubmit}>
          <h2 className="login__form-title">Welcome back!</h2>
          <p className="login__form-subtitle">Log in to continue</p>
          <div className="login__form-inputs">
            {emailError && <div className="login__form-error">{emailError}</div>}
            <TextInput
              type="email"
              id="email"
              label=""
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="login__form-password-wrapper">
              <TextInput
                type={showPassword ? 'text' : 'password'}
                id="password"
                label=""
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <div className="login__form-error">{passwordError}</div>}
              <button
                className="login__form-pword-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  className="login__form-toggle-img"
                  src="/assets/eye.svg"
                  alt="Toggle Password Visibility"
                />
              </button>
            </div>
          </div>
          {error && <div className="login__form-error">{error}</div>}
          <Button
            type="submit"
            loading={isLoading}
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
          <div className="login__form-signup-no-account">Don't have an account?</div>
          <div className="login__form-signup-link">
            <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
