import { Link } from 'react-router-dom';
import { faCalendar, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ContactInfoPanel.css';

interface ContactInfoPanelProps {
  phone: string;
  email: string;
}

export const ContactInfoPanel = ({ phone, email }: ContactInfoPanelProps) => {
  return (
    <section className="contact-info">
      <div className="contact-info__card">
        <h2 className="contact-info__title">Contact Information</h2>

        <p className="contact-info__description">
          Have a question or looking to post a job opening? Reach out and we'll get back to you shortly.
        </p>

        <div className="contact-info__row">
          <FontAwesomeIcon icon={faPhone} />
          <span className="contact-info__text">{phone}</span>
        </div>

        <div className="contact-info__row">
          <FontAwesomeIcon icon={faEnvelope} />
          <span className="contact-info__text">{email}</span>
        </div>

        <Link to="/contact" className="contact-info__cta">
          <FontAwesomeIcon icon={faCalendar} />
          <span className="contact-info__cta-text">Book an appointment</span>
        </Link>
      </div>

      <div className="contact-info__socials">
        <a href="#" className="contact-info__social-link" aria-label="Facebook">
          <img src="/assets/icons/ri_facebook-fill.svg" alt="" />
        </a>

        <a href="#" className="contact-info__social-link" aria-label="LinkedIn">
          <img src="/assets/icons/linkedin-logo.svg" alt="" />
        </a>

        <a href="#" className="contact-info__social-link" aria-label="Instagram">
          <img src="/assets/icons/ri_instagram-fill.svg" alt="" />
        </a>
      </div>
    </section>
  );
};
