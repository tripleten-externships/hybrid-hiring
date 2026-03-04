import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileNavOverlay } from './MobileNavOverlay';
import './Header.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isAdmin, logOut } = useAuth();

  return (
    <header className="site-header">
      <NavLink to="/" className="site-header__logo">
        Hybrid Hiring Solutions
      </NavLink>

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
        onLogOut={logOut}
      />
    </header>
  );
};
