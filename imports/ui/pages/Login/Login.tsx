import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Layout } from '../../layouts/Layout';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout>
      <form className="login__form">
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
    </Layout>
  );
};

export default Login;
