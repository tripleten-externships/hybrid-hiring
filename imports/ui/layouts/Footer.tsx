import { NavLink } from 'react-router-dom';
import './Footer.css';
// import hhsLogo from "./assets/hhs-logo.png"

export const Footer = () => {
  return (
    <section className="footer">
      <section className="footer__content">
        <section className="footer__brand">
          <img
            src="./assets/hhr-logo.svg"
            alt="Hybrid Hiring Solutions Logo"
            className="footer__logo"
          />{' '}
          {/* need to add the image */}
          <h2 className="footer__title">Hybrid Hiring Solutions</h2>
        </section>
        <section className="footer__nav">
          <NavLink to="/">
            <button className="footer__nav-btn">Home</button>
          </NavLink>
          <NavLink to="/employers">
            {/* This button isn't mentioned in the task but it is in the figma so I've included it */}
            <button className="footer__nav-btn">Employers</button>
          </NavLink>
          <NavLink to="/jobs">
            <button className="footer__nav-btn">Jobs</button>
          </NavLink>
          <NavLink to="/contact">
            <button className="footer__nav-btn">Contact Us</button>
          </NavLink>
          <NavLink to="/about">
            <button className="footer__nav-btn">About Us</button>
          </NavLink>
          {/* Figma shows an "account" button. Task calls for login/signup buttons. I've included all below. */}
          <NavLink to="/signup">
            <button className="footer__nav-btn">Sign Up</button>
          </NavLink>
          <NavLink to="/login">
            <button className="footer__nav-btn">Log In</button>
          </NavLink>
          <NavLink to="/account">
            <button className="footer__nav-btn">Account</button>
          </NavLink>
        </section>
        <section className="footer__socials">
          {/* Ideally the a tags below would be linked to something, but I wasn't seeing social links anywhere */}
          <a>
            <img
              src="./assets/facebook-logo.svg"
              alt="Facebook Logo"
              className="footer__socials-icon"
            />
          </a>
          <a>
            <img
              src="./assets/linkedin-logo.svg"
              alt="LinkedIn Logo"
              className="footer__socials-icon"
            />
          </a>
          <a>
            <img
              src="./assets/instagram-logo.svg"
              alt="Instagram Logo"
              className="footer__socials-icon"
            />
          </a>
        </section>
        <section className="footer__copyright">
          <hr
            style={{ border: 'none', borderTop: '1px solid #fff', marginTop: 20, marginBottom: 20 }}
          />
          <p className="footer__copyright-text">Legal Disclaimer: This is a legal disclaimer.</p>{' '}
          {/* find out what needs to go here */}
          <hr
            style={{ border: 'none', borderTop: '1px solid #fff', marginTop: 20, marginBottom: 20 }}
          />
          <p className="footer__copyright-text">
            © Hybrid Hiring Solutions 2025 All Rights Reserved
          </p>
        </section>
      </section>
    </section>
  );
};
