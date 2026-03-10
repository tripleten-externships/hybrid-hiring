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
        className={`mobile-nav-overlay${isOpen ? ' mobile-nav-overlay--open' : ''}`}
        aria-label="Navigation menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <button className="mobile-nav-close" onClick={onClose} aria-label="Close menu">
          ✕
        </button>

        <nav className="mobile-nav-links">
          <NavLink to="/" onClick={handleNavClick}>
            Home
          </NavLink>
          <NavLink to="/users/list" onClick={handleNavClick}>
            Users List
          </NavLink>
          <NavLink to="/users/manage" onClick={handleNavClick}>
            Users Manager
          </NavLink>
          {/* <NavLink to="/jobs" onClick={handleNavClick}>
            Jobs
          </NavLink>
          <NavLink to="/about" onClick={handleNavClick}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={handleNavClick}>
            Contact
          </NavLink> */}
          {isAdmin && (
            <NavLink to="/admin" onClick={handleNavClick}>
              Admin
            </NavLink>
          )}
        </nav>

        <hr className="mobile-nav-divider" />

        <div className="mobile-nav-auth">
          {isLoggedIn ? (
            <button onClick={handleLogOut}>Log Out</button>
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
