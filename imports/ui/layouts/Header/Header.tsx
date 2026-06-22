import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MobileNavOverlay } from '../MobileNavOverlay/MobileNavOverlay';
import { useIsLoggedIn, useIsAdmin, useMyProfile } from '../../hooks/useCurrentUser';
import { NotificationBell } from '../../components/NotificationBell/NotificationBell';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

function AccountIcon() {
  return <FontAwesomeIcon icon={faCircleUser} color="white" size="xl" />;
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const { logOut } = useAuth();
  const isLoggedIn = useIsLoggedIn();
  const { isAdmin } = useIsAdmin();
  const { profile } = useMyProfile();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
    menuTriggerRef.current?.focus();
  };

  const handleLogOut = () => {
    logOut();
    navigate('/');
    closeMenu();
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
        <NavLink to="/about" className="site-header__link">
          About
        </NavLink>
        <NavLink to="/contact" className="site-header__link">
          Contact
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
              {profile?.avatar ? (
                <img src={profile.avatar} alt="" className="site-header__avatar" />
              ) : (
                <AccountIcon />
              )}
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
        ref={menuTriggerRef}
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
        onClose={closeMenu}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogOut={handleLogOut}
      />
    </header>
  );
};
