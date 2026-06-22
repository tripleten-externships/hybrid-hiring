import { Link } from 'react-router-dom';
import './AboutUs.css';

function EmployerIcon() {
  return <img src="/assets/icons/more_info.svg" alt="Employer" />;
}

function JobSeekerIcon() {
  return <img src="/assets/icons/search_jobs.svg" alt="Search Jobs" />;
}

function ConsultationIcon() {
  return <img src="/assets/icons/personal_consultation.svg" alt="Personal Consultation" />;
}

const servicesList = [
  {
    Icon: EmployerIcon,
    title: 'For Employers',
    body: 'Find the right talent faster. We help you promote your opportunities, identify qualified candidates, and streamline the hiring process—eliminating the time and expense of screening unqualified applicants.',
    cta: 'Learn more',
    to: '/employers',
  },
  {
    Icon: JobSeekerIcon,
    title: 'For Job Seekers',
    body: 'Identify and connect with job opportunities that align with your skills, experience, and career goals. Receive assistance with resume development, job search strategies, and access to valuable resources that support career advancement, skill development, and professional growth.',
    cta: 'Search jobs',
    to: '/jobs',
  },
  {
    Icon: ConsultationIcon,
    title: 'Personal Consultation',
    body: 'Work with you to discover your needs and guide you towards the right direction, wherever that might be.',
    cta: 'Book an appointment',
    to: '/contact',
  },
];

export const AboutUs = () => {
  return (
    <div className="about">
      {/* Hero */}
      <section className="about__hero">
        <div className="about__hero-content">
          <h1 className="about__hero-title">About Hybrid Hiring Solutions</h1>
          <div className="about__hero-body">
            <p>
              Hybrid Hiring Solutions is a staffing and recruitment firm based in Northeast
              Pennsylvania, dedicated to connecting employers with qualified talent through a
              personalized and hands-on approach. We specialize in sourcing, recruiting, and
              matching candidates with opportunities that align with their skills, experience, and
              career goals.
            </p>
            <p>
              Our primary focus is supporting businesses within the energy, natural gas, and related
              industries throughout Northeast Pennsylvania and the surrounding region. By
              understanding the unique needs of both employers and job seekers, we create meaningful
              connections that help businesses grow and individuals build successful careers.
            </p>
            <p>
              At Hybrid Hiring Solutions, we believe in a simple philosophy:{' '}
              <strong>Live Local. Work Local.</strong> We are committed to strengthening our
              communities by helping local talent find rewarding employment opportunities close to
              home while providing employers with access to a skilled and reliable workforce.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about__mission">
        <div className="about__mission-inner">
          <img
            src="/assets/images/hh_about_industry.jpg"
            alt="Industrial worker on the job"
            className="about__mission-image"
          />
          <div className="about__mission-text">
            <h2 className="about__mission-title">Our Mission</h2>
            <p className="about__mission-body">
              At Hybrid Hiring Solutions, we believe that the right connection can change
              everything. Our mission is to bridge the gap between talented job seekers and growing
              employers by providing personalized support, valuable resources, and meaningful
              opportunities. Whether you're pursuing a new career path or building a stronger
              workforce, we're dedicated to helping you achieve success.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="about__services">
        <h2 className="about__services-title">Our Services</h2>
        <div className="about__services-grid">
          {servicesList.map(({ Icon, title, body, cta, to }) => (
            <div key={title} className="about__service-card">
              <div className="about__service-icon">
                <Icon />
              </div>
              <h3 className="about__service-name">{title}</h3>
              <p className="about__service-body">{body}</p>
              <Link to={to} className="about__service-btn">
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
