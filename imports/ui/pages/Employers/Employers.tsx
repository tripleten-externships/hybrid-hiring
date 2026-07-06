import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBullseye, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { PageBackground } from '../../components/PageBackground/PageBackground';
import { BACKGROUND_IMAGES } from '../../constants/backgroundImages';
import './Employers.css';

function TargetIcon() {
  return <FontAwesomeIcon icon={faBullseye} className="employers__partner-icon" />;
}

function SpeedIcon() {
  return <FontAwesomeIcon icon={faBolt} className="employers__partner-icon" />;
}

function ClipboardIcon() {
  return <FontAwesomeIcon icon={faClipboard} className="employers__partner-icon" />;
}

function HandshakeIcon() {
  return <FontAwesomeIcon icon={faHandshake} className="employers__partner-icon" />;
}

const BENEFITS = [
  {
    Icon: TargetIcon,
    title: 'Targeted Matching',
    body: 'Our platform connects your listings directly to job seekers whose skills, pay expectations, and job-type preferences align with your open roles.',
  },
  {
    Icon: SpeedIcon,
    title: 'Fast Time-to-Hire',
    body: 'Candidates on Hybrid Hiring are actively looking. Receive quality applications faster and reduce your average time-to-fill.',
  },
  {
    Icon: ClipboardIcon,
    title: 'Simple Posting Process',
    body: 'Submit your job details through our streamlined form and your listing goes live the same day – no complicated dashboards.',
  },
  {
    Icon: HandshakeIcon,
    title: 'Dedicated Support',
    body: 'Our team is available to help you craft compelling listings and optimize your hiring strategy from the first post to final offer.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Contact Us',
    body: 'Reach out through our contact form and tell us about your open roles and hiring needs.',
  },
  {
    step: '02',
    title: 'We Post Your Listing',
    body: 'Our team reviews and publishes your job listing, making it visible to our entire candidate pool.',
  },
  {
    step: '03',
    title: 'Candidates Apply',
    body: 'Qualified candidates apply directly through your preferred application link or ATS.',
  },
  {
    step: '04',
    title: 'Hire Great People',
    body: "Review applicants, conduct interviews, and make an offer – we're here to support every step.",
  },
];

export function Employers() {
  return (
    <div className="employers">
      <PageBackground
        className="employers__hero"
        src={BACKGROUND_IMAGES.employersHeader}
        position="center 35%"
        fetchPriority="high"
      >
        <div className="employers__hero-content">
          <h1 className="employers__hero-title">Find Your Next Great Hire</h1>
          <p className="employers__hero-subtitle">
            Hybrid Hiring Solutions connects employers with motivated, pre-screened candidates
            looking for full-time, part-time, and contract roles.
          </p>
          <Link to="/contact" className="employers__cta-btn">
            Post a Job
          </Link>
        </div>
      </PageBackground>

      <section className="employers__section">
        <h2 className="employers__section-title">Why Partner With Us?</h2>
        <div className="employers__benefits-grid">
          {BENEFITS.map(({ Icon, title, body }) => (
            <div key={title} className="employers__benefit-card">
              <div className="employers__benefit-icon">
                <Icon />
              </div>
              <h3 className="employers__benefit-title">{title}</h3>
              <p className="employers__benefit-body">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="employers__section employers__section--alt">
        <h2 className="employers__section-title">How It Works</h2>
        <ol className="employers__steps">
          {HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="employers__step">
              <span className="employers__step-number">{item.step}</span>
              <div>
                <h3 className="employers__step-title">{item.title}</h3>
                <p className="employers__step-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="employers__section employers__cta-section">
        <h2 className="employers__section-title">Ready to Get Started?</h2>
        <p className="employers__cta-body">
          Send us a message and our team will be in touch within one business day to walk you
          through our process and get your first listing live.
        </p>
        <Link to="/contact" className="employers__cta-btn">
          Contact Us Today
        </Link>
      </section>
    </div>
  );
}
