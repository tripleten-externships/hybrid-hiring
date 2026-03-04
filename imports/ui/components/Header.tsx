import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileNavOverlay } from '../layouts/MobileNavOverlay';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin, logOut } = useAuth();

  return (
    <header className="site-header">
      {/* Logo */}
      <NavLink to="/" className="site-header__logo">
        Hybrid Hiring Solutions
      </NavLink>

      {/* <Navigation> */}
      <nav className="site-header__nav">
        <NavLink to="/" className="site-header__link">
          Home
        </NavLink>
        <NavLink to="/about" className="site-header__link">
          About
        </NavLink>
        <NavLink to="/contact" className="site-header__link">
          Contact
        </NavLink>
        <NavLink to="/jobs" className="site-header__link">
          Jobs
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className="site-header__link">
            Admin
          </NavLink>
        )}
      </nav>

      {/* Auth */}
      <div className="site-header__auth">
        {isLoggedIn ? (
          <button onClick={logOut}>Log Out</button>
        ) : (
          <>
            <NavLink to="/login" className="site-header__link">
              Log In
            </NavLink>
            <NavLink to="/signup" className="site-header__link">
              Sign Up
            </NavLink>
          </>
        )}
      </div>

      {/* Hamburger Button */}
      <button className="site-header__hamburger" onClick={() => setIsMenuOpen(true)}>
        <span className="site-header__hamburger-bar" />
        <span className="site-header__hamburger-bar" />
        <span className="site-header__hamburger-bar" />
      </button>

      {/* Mobile Nav Overlay */}
      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogOut={logOut}
      />
    </header>
  );
};
