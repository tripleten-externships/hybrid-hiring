import './ContactInfoPanel.css';
import { Button } from '../../components/Button/Button';

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
          If you have any questions, feel free to get in contact with us.
        </p>

        <div className="contact-info__row">
          <img
            src="/assets/ic_baseline-phone.svg"
            alt="Phone icon"
            className="contact-info__icon"
          />
          <span className="contact-info__text">{phone}</span>
        </div>

        <div className="contact-info__row">
          <img
            src="/assets/ic_baseline-email.svg"
            alt="Email icon"
            className="contact-info__icon"
          />
          <span className="contact-info__text">{email}</span>
        </div>

        <Button className="contact-info__cta">
          <div className="contact-info__cta-icon-container">
            <img
              src="/assets/book-appointment-Icons.svg"
              alt=""
              aria-hidden="true"
              className="contact-info__cta-icon"
            />
          <span className="contact-info__cta-text">Book an appointment</span>
          </div>
        </Button>
      </div>

      <div className="contact-info__socials">
        <a href="#" className="contact-info__social-link" aria-label="Facebook">
          <img src="/assets/ri_facebook-fill.svg" alt="" />
        </a>

        <a href="#" className="contact-info__social-link" aria-label="LinkedIn">
          <img src="/assets/linkedin-logo.svg" alt="" />
        </a>

        <a href="#" className="contact-info__social-link" aria-label="Instagram">
          <img src="/assets/ri_instagram-fill.svg" alt="" />
        </a>
      </div>
    </section>
  );
};
