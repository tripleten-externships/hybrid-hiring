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
    body: 'Work directly with staffing agencies to find the right talent. Get the word out and find new hires with specific skills, without spending time screening unqualified candidates.',
    cta: 'Learn more',
    to: '/employers',
  },
  {
    Icon: JobSeekerIcon,
    title: 'For Job Seekers',
    body: 'Provide new job opportunities that match current skill set. Build resumes and get resources for finding relevant jobs or growth opportunities.',
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
          <p className="about__hero-body">
            Hybrid Hiring Solutions is a staffing company located in NE Pennsylvania that provides a
            personalized experience to search and source candidates for job openings clients have.
            The organization largely supports clients in the gas and energy industry that have jobs
            in NE PA as well as globally. The jobs Hybrid Hiring Solutions focuses often require
            specialized skills such as chemists, equipment operators, and financial analysts.
          </p>
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
              At Hybrid Hiring Solutions our mission is clear:{' '}
              <strong>
                to provide job seekers and employers the connections and resources they need to
                succeed.
              </strong>{' '}
              When it comes to new career paths, and fresh opportunities, Hybrid Hiring Solutions
              thrives in creating a personal atmosphere that can accommodate your needs.
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
