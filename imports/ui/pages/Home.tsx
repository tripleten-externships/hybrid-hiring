import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useAppSettings } from '../hooks/useCurrentUser';
import './Home.css';

export const Home = () => {
  const settings = useAppSettings();
  const telHref = `tel:${settings.contact.phone.replace(/[^\d+]/g, '')}`;
  const mailHref = `mailto:${settings.contact.email}`;

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__hero-title">
            Innovate.
            <br />
            Grow.
            <br />
            Succeed.
          </h1>
          <p className="home__hero-subtitle">
            At Hybrid Hiring Solutions, based in Northeast Pennsylvania, we offer a personalized
            staffing experience to help our clients search for and source candidates for their job
            openings. We support all industries with a specialty in the Energy industry. Our
            services are mobile throughout the Northeast.
          </p>
          <div className="home__hero-actions">
            <Link to="/jobs" className="home__hero-btn home__hero-btn--primary">
              Find a Job
            </Link>
            <Link to="/employers" className="home__hero-btn home__hero-btn--outline">
              Find Talent
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="home__what-we-do">
        <div className="home__cards">
          <div className="home__card">
            <div className="home__card-icon" aria-hidden="true">
              <img src="/assets/icons/search_jobs.svg" alt="Search Jobs" />
            </div>
            <p className="home__card-body">
              Help job seekers find new career paths through our network within the industry.
            </p>
            <Link to="/jobs" className="home__card-btn">
              Search jobs
            </Link>
          </div>

          <div className="home__card">
            <div className="home__card-icon" aria-hidden="true">
              <img src="/assets/icons/more_info.svg" alt="More info" />
            </div>
            <p className="home__card-body">
              Provide employers connections to talented workers in the gas and energy industry of
              Northeast Pennsylvania.
            </p>
            <Link to="/employers" className="home__card-btn">
              More info
            </Link>
          </div>

          <div className="home__card">
            <div className="home__card-icon" aria-hidden="true">
              <img src="/assets/icons/find_resources.svg" alt="Find resources" />
            </div>
            <p className="home__card-body">
              Provide resources for refining resumes and job search strategies.
            </p>
            <Link to="/resources" className="home__card-btn">
              Find resources
            </Link>
          </div>
        </div>
      </section>

      {/* Start Your New Beginning + Testimonial */}
      <section className="home__cta-banner">
        <div className="home__cta-content">
          <h2 className="home__cta-title">Start Your New Beginning</h2>
          <p className="home__cta-subtitle">
            Get in contact with us, and we'll schedule a consultation to discuss your needs.
          </p>
          <div className="home__cta-actions">
            <Link to="/contact" className="home__cta-btn">
              <FontAwesomeIcon icon={faCalendar} />
              Book an appointment
            </Link>
            <a href={telHref} className="home__cta-btn home__cta-btn--outline">
              <FontAwesomeIcon icon={faPhone} />
              Call us
            </a>
            <a href={mailHref} className="home__cta-btn home__cta-btn--outline">
              <FontAwesomeIcon icon={faEnvelope} />
              Email us
            </a>
          </div>
        </div>

        <blockquote className="home__quote">
          <p className="home__quote-text">"{settings.testimonial.quote}"</p>
          <footer className="home__quote-attribution">
            -{' '}
            <em>
              {settings.testimonial.authorName}
              {settings.testimonial.authorTitle ? `, ${settings.testimonial.authorTitle}` : ''}
            </em>
          </footer>
        </blockquote>
      </section>
    </div>
  );
};
