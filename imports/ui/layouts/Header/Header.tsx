import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MobileNavOverlay } from '../MobileNavOverlay/MobileNavOverlay';
import { useIsLoggedIn, useIsAdmin } from '../../hooks/useCurrentUser';
import { NotificationBell } from '../../components/NotificationBell/NotificationBell';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

function AccountIcon() {
  return <FontAwesomeIcon icon={faCircleUser} color="white" size="xl" />;
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logOut } = useAuth();
  const isLoggedIn = useIsLoggedIn();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <NavLink to="/" className="site-header__logo">
        <img src="/assets/icons/company-logo.svg" alt="Hybrid Hiring Solutions" />
      </NavLink>

      <nav className="site-header__nav">
        <NavLink to="/employers" className="site-header__link">
          Employers
        </NavLink>
        <NavLink to="/jobs" className="site-header__link">
          Jobs
        </NavLink>
        <NavLink to="/resources" className="site-header__link">
          Resources
        </NavLink>
        <NavLink to="/contact" className="site-header__link">
          Contact
        </NavLink>
        <NavLink to="/about" className="site-header__link">
          About
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className="site-header__link">
            Admin
          </NavLink>
        )}
      </nav>

      <div className="site-header__actions">
        {isLoggedIn ? (
          <>
            <NotificationBell />
            <NavLink to="/account" className="site-header__icon-btn" aria-label="Account">
              <AccountIcon />
            </NavLink>
            <button className="site-header__logout-btn" onClick={handleLogOut}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="site-header__auth-link">
              Log In
            </NavLink>
            <NavLink to="/signup" className="site-header__auth-btn">
              Sign Up
            </NavLink>
          </>
        )}
      </div>

      <button
        className="site-header__hamburger"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav"
      >
        <span className="site-header__hamburger-bar" />
        <span className="site-header__hamburger-bar" />
        <span className="site-header__hamburger-bar" />
      </button>

      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogOut={handleLogOut}
      />
    </header>
  );
};
