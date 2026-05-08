import { NavLink } from 'react-router-dom';
import { useIsLoggedIn, useIsAdmin } from '../../hooks/useCurrentUser';
import './Footer.css';

export const Footer = () => {
  const loggedIn = useIsLoggedIn();
  const { isAdmin } = useIsAdmin();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <img
            src="/assets/icons/company-logo.svg"
            alt="Hybrid Hiring Solutions Logo"
            className="footer__logo"
          />
          <NavLink to="/" className="footer__title-nav">
            <h2 className="footer__title">Hybrid Hiring Solutions</h2>
          </NavLink>
        </div>

        <nav className="footer__nav">
          <NavLink to="/employers" className="footer__nav-link">
            Employers
          </NavLink>
          <NavLink to="/jobs" className="footer__nav-link">
            Jobs
          </NavLink>
          <NavLink to="/resources" className="footer__nav-link">
            Resources
          </NavLink>
          <NavLink to="/about" className="footer__nav-link">
            About
          </NavLink>
          <NavLink to="/contact" className="footer__nav-link">
            Contact
          </NavLink>
          {loggedIn ? (
            <NavLink to="/account" className="footer__nav-link footer__account-link">
              Account
            </NavLink>
          ) : (
            <>
              <NavLink to="/signup" className="footer__nav-link">
                Sign Up
              </NavLink>
              <NavLink to="/login" className="footer__nav-link">
                Log In
              </NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="footer__nav-link">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="footer__socials">
          <a href="#" className="footer__socials-link" aria-label="Facebook">
            <img
              src="/assets/icons/ri_facebook-fill.svg"
              alt=""
              aria-hidden="true"
              className="footer__socials-icon"
            />
          </a>
          <a href="#" className="footer__socials-link" aria-label="LinkedIn">
            <img
              src="/assets/icons/mdi_linkedin.svg"
              alt=""
              aria-hidden="true"
              className="footer__socials-icon"
            />
          </a>
          <a href="#" className="footer__socials-link" aria-label="Instagram">
            <img
              src="/assets/icons/ri_instagram-fill.svg"
              alt=""
              aria-hidden="true"
              className="footer__socials-icon"
            />
          </a>
        </div>

        <div className="footer__copyright">
          <hr className="footer__divider" />
          <p className="footer__copyright-text">
            <strong>Legal Disclaimer:</strong> Hybrid Hiring Solutions is a job matching platform.
            We do not guarantee employment and are not responsible for the accuracy of third-party
            job listings. By using this site you agree to our Terms of Service and Privacy Policy.
          </p>
          <hr className="footer__divider" />
          <p className="footer__copyright-text">
            © Hybrid Hiring Solutions {new Date().getFullYear()}. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
