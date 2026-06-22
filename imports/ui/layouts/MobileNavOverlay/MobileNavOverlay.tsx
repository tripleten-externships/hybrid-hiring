import { type HTMLAttributes, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './MobileNavOverlay.css';

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLogOut?: () => void;
}

export const MobileNavOverlay = ({
  isOpen,
  onClose,
  isLoggedIn = false,
  isAdmin = false,
  onLogOut,
}: MobileNavOverlayProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleNavClick = () => {
    onClose();
  };

  const handleLogOut = () => {
    onLogOut?.();
    onClose();
  };

  return (
    <>
      <div
        className={`mobile-nav-backdrop${isOpen ? ' mobile-nav-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mobile-nav"
        className={`mobile-nav-overlay${isOpen ? ' mobile-nav-overlay--open' : ''}`}
        {...(isOpen
          ? {
              role: 'dialog',
              'aria-modal': true,
              'aria-label': 'Navigation menu',
            }
          : ({ inert: '' } as HTMLAttributes<HTMLDivElement>))}
      >
        <button
          ref={closeButtonRef}
          className="mobile-nav-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>

        <nav className="mobile-nav-links">
          <NavLink to="/" onClick={handleNavClick}>
            Home
          </NavLink>
          <NavLink to="/employers" onClick={handleNavClick}>
            Employers
          </NavLink>
          <NavLink to="/jobs" onClick={handleNavClick}>
            Jobs
          </NavLink>
          <NavLink to="/resources" onClick={handleNavClick}>
            Resources
          </NavLink>
          <NavLink to="/about" onClick={handleNavClick}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={handleNavClick}>
            Contact
          </NavLink>
        </nav>

        <hr className="mobile-nav-divider" />

        <div className="mobile-nav-auth">
          {isAdmin && (
            <NavLink to="/admin" onClick={handleNavClick}>
              Admin
            </NavLink>
          )}
          {isLoggedIn ? (
            <>
              <NavLink to="/account" onClick={handleNavClick}>
                Account
              </NavLink>
              <button onClick={handleLogOut}>Log Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={handleNavClick}>
                Log In
              </NavLink>
              <NavLink to="/signup" onClick={handleNavClick}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};
