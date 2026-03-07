import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { Meteor } from 'meteor/meteor';
import './Login.css';
import { useLogin } from '../../hooks/useLogin';
import { Button } from '../../components/Button/Button';
import TextInput from '../../components/TextInput';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const navigate = useNavigate();

  const { error, isLoading, handleLogin } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
    if (!error) {
      setEmail('');
      setPassword('');

      // Navitate to jobs page after successful login once /jobrelatives route is implemented
      // navigate('/jobs');
    }
  };

  return (
    <>
      <img src="/icons/back.svg" alt="Back button" className="login__form-back-btn" />
      <img src="/icons/companyLogo.svg" alt="Company Logo" className="login__form-company-logo" />
      <div className="login__form-container">
        <form className="login__form" onSubmit={onSubmit}>
          <h2 className="login__form-title">Welcome back or Log In to your account</h2>
          <div className="login__form-inputs">
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
              <button
                className="login__form-pword-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  className="login__form-toggle-img"
                  src="/icons/eye.svg"
                  alt="Toggle Password Visibility"
                />
              </button>
            </div>
          </div>
          {error && <div className="login__form-error">{error}</div>}
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
          <h3 className="login__form-signup-btn">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </h3>
        </form>
      </div>
    </>
  );
};

export default Login;
