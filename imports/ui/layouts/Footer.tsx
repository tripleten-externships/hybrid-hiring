import { NavLink } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import './Footer.css';

export const Footer = () => {
  const loggedIn = Meteor.user();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <img
            src="./assets/hhr-logo.svg"
            alt="Hybrid Hiring Solutions Logo"
            className="footer__logo"
          />
          <h2 className="footer__title">Hybrid Hiring Solutions</h2>
        </div>
        <nav className="footer__nav">
          <NavLink to="/" className="footer__nav-link">Home</NavLink>
          {/* Employers is in the Figma design but not explicitly in the task spec */}
          <NavLink to="/employers" className="footer__nav-link">Employers</NavLink>
          <NavLink to="/jobs" className="footer__nav-link">Jobs</NavLink>
          <NavLink to="/contact" className="footer__nav-link">Contact Us</NavLink>
          <NavLink to="/about" className="footer__nav-link">About Us</NavLink>
          {/* Figma shows an "account" button; task spec also calls for login/signup */}
          {/* Shows Signup/Login when logged out, Account when logged in */}
          {loggedIn ? (<NavLink to="/account" className="footer__nav-link">Account</NavLink>)
            : (<>
              <NavLink to="/signup" className="footer__nav-link">Sign Up</NavLink>
              <NavLink to="/login" className="footer__nav-link">Log In</NavLink>
            </>
            )}
        </nav>
        <div className="footer__socials">
          {/* TODO: replace href values with real social URLs when available */}
          <a href="#" className="footer__socials-link" aria-label="Facebook">
            <img
              src="./assets/facebook-logo.svg"
              alt="Facebook Logo"
              className="footer__socials-icon"
            />
          </a>
          <a href="#" className="footer__socials-link" aria-label="LinkedIn">
            <img
              src="./assets/linkedin-logo.svg"
              alt="LinkedIn Logo"
              className="footer__socials-icon"
            />
          </a>
          <a href="#" className="footer__socials-link" aria-label="Instagram">
            <img
              src="./assets/instagram-logo.svg"
              alt="Instagram Logo"
              className="footer__socials-icon"
            />
          </a>
        </div>
        <div className="footer__copyright">
          <hr className="footer__divider" />
          {/* TODO: add legal disclaimer copy */}
          <p className="footer__copyright-text">Legal Disclaimer</p>
          <hr className="footer__divider" />
          <p className="footer__copyright-text">
            © Hybrid Hiring Solutions {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
