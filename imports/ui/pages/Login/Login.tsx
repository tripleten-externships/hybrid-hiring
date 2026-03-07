import React, { useState } from 'react';
<<<<<<< HEAD
// import { Navigate } from 'react-router-dom';
// import { Meteor } from 'meteor/meteor';
import './Login.css';
import { useLogin } from '../../hooks/useLogin';
import { Button } from '../../components/Button/Button';
import { Link } from 'react-router';
// import { useNavigate } from 'react-router-dom';
=======
import { Layout } from '../../layouts/Layout';
import './Login.css';
import { useLogin } from '../../hooks/useLogin';
import { Button } from '../../components/Button/Button';
>>>>>>> 968c6934462fa8b489e41eb55dd21454806bade5

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  // const navigate = useNavigate();
=======
  const [showPassword] = useState(false);
>>>>>>> 968c6934462fa8b489e41eb55dd21454806bade5

  const { error, isLoading, handleLogin } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
<<<<<<< HEAD
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
          <h2 className="login__form-title">Welcome back or LogIn to your account</h2>
          <div className="login__form-inputs">
            <input
              type="email"
              id="email"
              className="login__form-input"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="login__form-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="login__form-input login__form-input--password"
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
=======
  };

  return (
    <Layout>
      <form className="login__form" onSubmit={onSubmit}>
        {error && <div className="login__error">{error}</div>}
        <h2 className="login__form-title">Welcome back or LogIn to your account</h2>
        <label htmlFor="email" className="login__form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="login__form-input"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password" className="login__form-label">
          Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          className="login__form-input"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </form>
      <h3 className="login__signup-btn">
        Don't have an account? <a href="/signup">Sign up</a>
      </h3>
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>
    </Layout>
>>>>>>> 968c6934462fa8b489e41eb55dd21454806bade5
  );
};

export default Login;
