import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useResetPassword';
import '../Login/Login.css';

function validatePassword(password: string, confirmPassword: string) {
  const errors: { password?: string; confirmPassword?: string } = {};

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

export const ResetPassword = () => {
  const { token = '' } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const { error, isLoading, handleResetPassword } = useResetPassword();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    const errors = validatePassword(password, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    handleResetPassword(token, password, () => {
      navigate('/jobs', { replace: true });
    });
  };

  if (!token) {
    return (
      <div className="login">
        <div className="login__card">
          <div className="login__description">
            <h1 className="login__title">Invalid reset link</h1>
            <p className="login__subtitle">
              This password reset link is missing or invalid. Please request a new one.
            </p>
          </div>
          <div className="login__form">
            <Link to="/forgot-password" className="login__submit-btn">
              Request Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__description">
          <h1 className="login__title">Choose a new password</h1>
          <p className="login__subtitle">Enter and confirm your new password below.</p>
        </div>

        <form className="login__form" onSubmit={onSubmit} noValidate>
          <div className="login__password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="login__input"
              placeholder="New password (min. 8 characters)"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
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
            {fieldErrors.password && <p className="login__error">{fieldErrors.password}</p>}
          </div>

          <div>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="login__input"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
            />
            {fieldErrors.confirmPassword && (
              <p className="login__error">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" className="login__submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="login__spinner" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <p className="login__signup-link">
          <Link to="/login">Back to Log In</Link>
        </p>
      </div>
    </div>
  );
};
