import { type FormEvent, useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useChangePassword } from '../../hooks/useChangePassword';
import './AccountSecurity.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NameFieldErrors = {
  firstName?: string;
  lastName?: string;
};

type EmailFieldErrors = {
  newEmail?: string;
  currentPassword?: string;
};

type PasswordFieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function validateNameForm(firstName: string, lastName: string): NameFieldErrors {
  const errors: NameFieldErrors = {};

  if (!firstName.trim()) {
    errors.firstName = 'First name is required.';
  }
  if (!lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  return errors;
}

function validateEmailForm(newEmail: string, currentPassword: string): EmailFieldErrors {
  const errors: EmailFieldErrors = {};

  if (!newEmail.trim()) {
    errors.newEmail = 'New email is required.';
  } else if (!EMAIL_RE.test(newEmail.trim())) {
    errors.newEmail = 'Please enter a valid email address.';
  }

  if (!currentPassword) {
    errors.currentPassword = 'Current password is required.';
  }

  return errors;
}

function validatePasswordForm(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): PasswordFieldErrors {
  const errors: PasswordFieldErrors = {};

  if (!currentPassword) {
    errors.currentPassword = 'Current password is required.';
  }

  if (!newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

interface AccountSecurityModalProps {
  open: boolean;
  onClose: () => void;
  currentEmail?: string;
  initialFirstName?: string;
  initialLastName?: string;
}

export function AccountSecurityModal({
  open,
  onClose,
  currentEmail,
  initialFirstName = '',
  initialLastName = '',
}: AccountSecurityModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [nameFieldErrors, setNameFieldErrors] = useState<NameFieldErrors>({});
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailFieldErrors, setEmailFieldErrors] = useState<EmailFieldErrors>({});
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<PasswordFieldErrors>({});
  const {
    error: passwordError,
    success: passwordSuccess,
    isLoading: passwordLoading,
    handleChangePassword,
    setError: setPasswordError,
    setSuccess: setPasswordSuccess,
  } = useChangePassword();

  useEffect(() => {
    if (!open) return;

    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setNameFieldErrors({});
    setNameError('');
    setNameSuccess('');
    setNewEmail('');
    setEmailPassword('');
    setEmailFieldErrors({});
    setEmailError('');
    setEmailSuccess('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFieldErrors({});
    setPasswordError('');
    setPasswordSuccess('');
  }, [open, initialFirstName, initialLastName, setPasswordError, setPasswordSuccess]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!nameSuccess) return;
    const timer = setTimeout(() => setNameSuccess(''), 5000);
    return () => clearTimeout(timer);
  }, [nameSuccess]);

  useEffect(() => {
    if (!emailSuccess) return;
    const timer = setTimeout(() => setEmailSuccess(''), 5000);
    return () => clearTimeout(timer);
  }, [emailSuccess]);

  useEffect(() => {
    if (!passwordSuccess) return;
    const timer = setTimeout(() => setPasswordSuccess(''), 5000);
    return () => clearTimeout(timer);
  }, [passwordSuccess, setPasswordSuccess]);

  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');

    const errors = validateNameForm(firstName, lastName);
    if (Object.keys(errors).length > 0) {
      setNameFieldErrors(errors);
      return;
    }

    setNameFieldErrors({});
    setNameLoading(true);

    try {
      await Meteor.callAsync('accounts.updateName', firstName.trim(), lastName.trim());
      setNameSuccess('Name updated successfully.');
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setNameError(reason || 'Unable to update name. Please try again.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    const errors = validateEmailForm(newEmail, emailPassword);
    if (Object.keys(errors).length > 0) {
      setEmailFieldErrors(errors);
      return;
    }

    setEmailFieldErrors({});
    setEmailLoading(true);

    try {
      await Meteor.callAsync('accounts.changeEmail', newEmail.trim(), emailPassword);
      setEmailSuccess('Email updated successfully.');
      setNewEmail('');
      setEmailPassword('');
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setEmailError(reason || 'Unable to update email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const errors = validatePasswordForm(currentPassword, newPassword, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setPasswordFieldErrors(errors);
      return;
    }

    setPasswordFieldErrors({});
    handleChangePassword(currentPassword, newPassword, () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    });
  };

  if (!open) return null;

  return (
    <div className="account-security-modal__overlay" onMouseDown={onClose} role="presentation">
      <div
        className="account-security-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-security-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="account-security-modal__header">
          <h2 id="account-security-modal-title" className="account-security-modal__title">
            Update Contact Info
          </h2>
          <button
            type="button"
            className="account-security-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="account-security-modal__body">
          <div className="account-security__section">
            <h3 className="account-security__section-title">Name</h3>

            <form className="account-security__form" onSubmit={handleNameSubmit} noValidate>
              <div className="account-security__name-row">
                <label className="account-security__field">
                  <span className="account-security__label">First name</span>
                  <input
                    type="text"
                    className={`account-security__input${nameFieldErrors.firstName ? ' account-security__input--error' : ''}`}
                    placeholder="First name"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setNameFieldErrors((prev) => ({ ...prev, firstName: undefined }));
                      setNameError('');
                    }}
                  />
                  {nameFieldErrors.firstName && (
                    <span className="account-security__field-error">
                      {nameFieldErrors.firstName}
                    </span>
                  )}
                </label>

                <label className="account-security__field">
                  <span className="account-security__label">Last name</span>
                  <input
                    type="text"
                    className={`account-security__input${nameFieldErrors.lastName ? ' account-security__input--error' : ''}`}
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setNameFieldErrors((prev) => ({ ...prev, lastName: undefined }));
                      setNameError('');
                    }}
                  />
                  {nameFieldErrors.lastName && (
                    <span className="account-security__field-error">
                      {nameFieldErrors.lastName}
                    </span>
                  )}
                </label>
              </div>

              {nameError && (
                <p
                  className="account-security__message account-security__message--error"
                  role="alert"
                >
                  {nameError}
                </p>
              )}
              {nameSuccess && (
                <p
                  className="account-security__message account-security__message--success"
                  role="status"
                >
                  {nameSuccess}
                </p>
              )}

              <button type="submit" className="account-security__submit" disabled={nameLoading}>
                {nameLoading ? 'Updating name…' : 'Update name'}
              </button>
            </form>
          </div>

          <div className="account-security__divider" aria-hidden="true" />

          <div className="account-security__section">
            <div className="account-security__section-header">
              <h3 className="account-security__section-title">Email address</h3>
              {currentEmail && <p className="account-security__current">Current: {currentEmail}</p>}
            </div>

            <form className="account-security__form" onSubmit={handleEmailSubmit} noValidate>
              <label className="account-security__field">
                <span className="account-security__label">New email</span>
                <input
                  type="email"
                  className={`account-security__input${emailFieldErrors.newEmail ? ' account-security__input--error' : ''}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailFieldErrors((prev) => ({ ...prev, newEmail: undefined }));
                    setEmailError('');
                  }}
                />
                {emailFieldErrors.newEmail && (
                  <span className="account-security__field-error">{emailFieldErrors.newEmail}</span>
                )}
              </label>

              <label className="account-security__field">
                <span className="account-security__label">Current password</span>
                <input
                  type="password"
                  className={`account-security__input${emailFieldErrors.currentPassword ? ' account-security__input--error' : ''}`}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  value={emailPassword}
                  onChange={(e) => {
                    setEmailPassword(e.target.value);
                    setEmailFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                    setEmailError('');
                  }}
                />
                {emailFieldErrors.currentPassword && (
                  <span className="account-security__field-error">
                    {emailFieldErrors.currentPassword}
                  </span>
                )}
              </label>

              {emailError && (
                <p
                  className="account-security__message account-security__message--error"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
              {emailSuccess && (
                <p
                  className="account-security__message account-security__message--success"
                  role="status"
                >
                  {emailSuccess}
                </p>
              )}

              <button type="submit" className="account-security__submit" disabled={emailLoading}>
                {emailLoading ? 'Updating email…' : 'Update email'}
              </button>
            </form>
          </div>

          <div className="account-security__divider" aria-hidden="true" />

          <div className="account-security__section">
            <h3 className="account-security__section-title">Password</h3>

            <form className="account-security__form" onSubmit={handlePasswordSubmit} noValidate>
              <label className="account-security__field">
                <span className="account-security__label">Current password</span>
                <input
                  type="password"
                  className={`account-security__input${passwordFieldErrors.currentPassword ? ' account-security__input--error' : ''}`}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                    setPasswordError('');
                  }}
                />
                {passwordFieldErrors.currentPassword && (
                  <span className="account-security__field-error">
                    {passwordFieldErrors.currentPassword}
                  </span>
                )}
              </label>

              <label className="account-security__field">
                <span className="account-security__label">New password</span>
                <input
                  type="password"
                  className={`account-security__input${passwordFieldErrors.newPassword ? ' account-security__input--error' : ''}`}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                    setPasswordError('');
                  }}
                />
                {passwordFieldErrors.newPassword && (
                  <span className="account-security__field-error">
                    {passwordFieldErrors.newPassword}
                  </span>
                )}
              </label>

              <label className="account-security__field">
                <span className="account-security__label">Confirm new password</span>
                <input
                  type="password"
                  className={`account-security__input${passwordFieldErrors.confirmPassword ? ' account-security__input--error' : ''}`}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    setPasswordError('');
                  }}
                />
                {passwordFieldErrors.confirmPassword && (
                  <span className="account-security__field-error">
                    {passwordFieldErrors.confirmPassword}
                  </span>
                )}
              </label>

              {passwordError && (
                <p
                  className="account-security__message account-security__message--error"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p
                  className="account-security__message account-security__message--success"
                  role="status"
                >
                  {passwordSuccess}
                </p>
              )}

              <button type="submit" className="account-security__submit" disabled={passwordLoading}>
                {passwordLoading ? 'Updating password…' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
