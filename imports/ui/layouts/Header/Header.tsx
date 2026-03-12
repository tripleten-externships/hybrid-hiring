import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MobileNavOverlay } from '../MobileNavOverlay/MobileNavOverlay';
import { useIsLoggedIn } from '../../hooks/useCurrentUser';
import './Header.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, logOut } = useAuth();
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const handleLogOut = () => {
    logOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <NavLink to="/" className="site-header__logo">
        <img src="/assets/company-logo.svg" alt="Hybrid Hiring Solutions" />
      </NavLink>

      <nav className="site-header__nav">
        {/* <NavLink to="/users/list" className="site-header__link">
          Users List
        </NavLink>
        <NavLink to="/users/manage" className="site-header__link">
          Users Manager
        </NavLink> */}
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

      <div className="site-header__auth">
        {isLoggedIn ? (
          <button className="site-header__auth-btn" onClick={handleLogOut}>
            Log Out
          </button>
        ) : (
          <>
            <NavLink to="/login" className="site-header__link">
              Log In
            </NavLink>
            <NavLink to="/signup" className="site-header__link site-header__link--cta">
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
