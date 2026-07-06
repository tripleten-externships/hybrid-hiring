import { Link } from 'react-router-dom';
import { PageBackground } from '../../components/PageBackground/PageBackground';
import { BACKGROUND_IMAGES } from '../../constants/backgroundImages';
import { useIsLoggedIn } from '../../hooks/useCurrentUser';
import './Resources.css';

const TIPS = [
  {
    title: 'Tailor Your Resume for Every Application',
    body: 'Generic resumes get generic results. Review each job description and reflect the keywords, required skills, and responsibilities back in your resume. Applicant tracking systems (ATS) often filter candidates before a human ever sees your application.',
  },
  {
    title: 'Write a Compelling Cover Letter',
    body: "A strong cover letter tells the story your resume cannot. Explain why you want this specific role at this specific company, and highlight one or two concrete accomplishments that demonstrate you're the right person for the job.",
  },
  {
    title: 'Optimize Your LinkedIn Profile',
    body: 'Recruiters search LinkedIn every day. Use a professional headshot, write a clear headline, and keep your experience and skills current. Turn on "Open to Work" so opportunities find you.',
  },
  {
    title: 'Prepare for Behavioral Interviews',
    body: 'Most modern interviews include behavioral questions ("Tell me about a time when…"). Use the STAR method – Situation, Task, Action, Result – to structure clear, concise answers that showcase your impact.',
  },
  {
    title: 'Follow Up After Applying and Interviewing',
    body: 'Send a thank-you email within 24 hours of an interview. It demonstrates professionalism and keeps you top-of-mind. A brief, polite follow-up after two weeks without a response is also appropriate.',
  },
  {
    title: 'Know Your Worth',
    body: "Research salary ranges using resources like the Bureau of Labor Statistics, Glassdoor, and LinkedIn Salary. Enter negotiations with data, not guesses. It's normal – and expected – to negotiate.",
  },
];

const FAQS = [
  {
    q: 'Is it free to use Hybrid Hiring Solutions as a job seeker?',
    a: 'Yes, completely free. Create an account, build your profile, and browse and apply to any listing on our platform at no cost.',
  },
  {
    q: 'How do I get personalized job recommendations?',
    a: "Complete your profile through the onboarding flow. Tell us your preferred job types, minimum pay, and location and we'll surface the most relevant listings each time you log in.",
  },
  {
    q: 'How do I save jobs to apply to later?',
    a: 'Click the bookmark icon on any job card while logged in. Your saved jobs are accessible from the Account page.',
  },
  {
    q: 'Can I apply to jobs directly on this platform?',
    a: 'Clicking "Quick Apply" or "Apply Now" takes you to the employer\'s own application page. We do not host applications ourselves, so you\'ll complete the process on the employer\'s system.',
  },
];

export function Resources() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="resources">
      <PageBackground
        className="resources__hero"
        src={BACKGROUND_IMAGES.resourcesHeader}
        position="center 40%"
        fetchPriority="high"
      >
        <div className="resources__hero-content">
          <h1 className="resources__hero-title">Job Search Resources</h1>
          <p className="resources__hero-subtitle">
            Tips, guides, and answers to help you land your next role with confidence.
          </p>
        </div>
      </PageBackground>

      <div className="resources__content">
        <section className="resources__section">
          <h2 className="resources__section-title">Job Search Tips</h2>
          <div className="resources__tips-grid">
            {TIPS.map((tip) => (
              <article key={tip.title} className="resources__tip-card">
                <h3 className="resources__tip-title">{tip.title}</h3>
                <p className="resources__tip-body">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="resources__section">
          <h2 className="resources__section-title">Frequently Asked Questions</h2>
          <dl className="resources__faq">
            {FAQS.map((item) => (
              <div key={item.q} className="resources__faq-item">
                <dt className="resources__faq-question">{item.q}</dt>
                <dd className="resources__faq-answer">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="resources__section resources__cta">
          <h2 className="resources__section-title">Ready to Start Applying?</h2>
          <p className="resources__cta-body">
            {isLoggedIn
              ? 'Browse current openings and personalized job recommendations.'
              : 'Browse current openings and create a free account to unlock personalized job recommendations.'}
          </p>
          <div className="resources__cta-links">
            <Link to="/jobs" className="resources__cta-btn resources__cta-btn--primary">
              Browse Jobs
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
