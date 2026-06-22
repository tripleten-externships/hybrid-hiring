import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { JobsCollection } from '/imports/api/jobs';
import { useIsLoggedIn, useMyProfile } from '/imports/ui/hooks/useCurrentUser';
import './JobDetail.css';

function DollarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path
        d="M8 4v8M6 5.5h2.5a1.5 1.5 0 0 1 0 3H6.5a1.5 1.5 0 0 0 0 3H10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {filled ? (
        <path
          d="M4 2h8a1 1 0 0 1 1 1v10.382a.5.5 0 0 1-.776.416L8 11.118l-4.224 2.68A.5.5 0 0 1 3 13.382V3a1 1 0 0 1 1-1z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M4 2h8a1 1 0 0 1 1 1v10.382a.5.5 0 0 1-.776.416L8 11.118l-4.224 2.68A.5.5 0 0 1 3 13.382V3a1 1 0 0 1 1-1z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
      )}
    </svg>
  );
}

function JobDetailSkeleton() {
  return (
    <div className="job-detail">
      <div className="job-detail__container">
        <div className="job-detail__skeleton" aria-busy="true">
          <div className="job-detail__sk job-detail__sk--title" />
          <div className="job-detail__sk job-detail__sk--line" />
          <div className="job-detail__sk job-detail__sk--line job-detail__sk--short" />
          <div className="job-detail__sk job-detail__sk--block" />
        </div>
      </div>
    </div>
  );
}

export function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const { profile } = useMyProfile();
  const savedJobIds = profile?.savedJobs ?? [];

  const { isLoading, job } = useTracker(() => {
    const sub = Meteor.subscribe('jobs.byId', jobId);
    return {
      isLoading: !sub.ready(),
      job: JobsCollection.findOne({ _id: jobId }),
    };
  }, [jobId]);

  const isSaved = savedJobIds.includes(jobId ?? '');

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');

  const handleToggleSave = () => {
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }
    if (!jobId) return;
    Meteor.callAsync('UserProfiles.toggleSaveJob', jobId);
  };

  const handleApply = async () => {
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }
    if (!jobId || applying || applied) return;

    try {
      setApplyError('');
      setApplying(true);
      await Meteor.callAsync('applications.submit', jobId);
      setApplied(true);
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      setApplyError(reason || 'Something went wrong submitting your application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return <JobDetailSkeleton />;

  if (!job) {
    return (
      <div className="job-detail">
        <div className="job-detail__not-found">
          <h1>Job not found</h1>
          <p>This listing may have been removed or is no longer active.</p>
          <Link to="/jobs" className="job-detail__cta-link">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const formatDollar = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);
  const payRange =
    job.payMax && job.payMax !== job.basePay
      ? `${formatDollar(job.basePay)} - ${formatDollar(job.payMax)}`
      : formatDollar(job.basePay);
  const payLabel = job.payUnit === 'salary' ? 'Base Salary:' : 'Base Pay:';

  const allChips = [job.jobType, ...(job.tags ?? []), ...(job.benefits?.slice(0, 3) ?? [])].filter(
    Boolean
  );

  const descriptionParagraphs = (job.description ?? '').split('\n').filter((p) => p.trim() !== '');

  return (
    <div className="job-detail">
      {/* ─── Back nav ─── */}
      <div className="job-detail__back-row">
        <button
          type="button"
          className="job-detail__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Jobs
        </button>
      </div>

      <div className="job-detail__container">
        {/* ─── Application confirmation alert ─── */}
        {applied && (
          <div className="job-detail__alert" role="alert">
            <strong>Application submitted!</strong> Your application to "{job.title}" has been
            successfully submitted. The Hybrid Hiring Team will be in contact after your application
            has been reviewed.
          </div>
        )}
        {applyError && (
          <div className="job-detail__alert job-detail__alert--error" role="alert">
            {applyError}
          </div>
        )}

        {/* ─── Title block (above card) ─── */}
        <div className="job-detail__title-block">
          <h1 className="job-detail__title">{job.title}</h1>
          <p className="job-detail__company">{job.company}</p>
          <p className="job-detail__location">{job.location}</p>
        </div>

        {/* ─── Main card ─── */}
        <div className="job-detail__card">
          {/* Job Details section */}
          <section className="job-detail__section">
            <h2 className="job-detail__section-title">Job Details</h2>

            <div className="job-detail__pay-row">
              <DollarIcon />
              <span className="job-detail__pay-label">{payLabel}</span>
              <span className="job-detail__pay-value">{payRange}</span>
            </div>

            {allChips.length > 0 && (
              <div className="job-detail__chips">
                {allChips.map((chip) => (
                  <span key={chip} className="job-detail__chip">
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </section>

          <hr className="job-detail__divider" />

          {/* Benefits section */}
          {job.benefits && job.benefits.length > 0 && (
            <section className="job-detail__section">
              <h2 className="job-detail__section-title">Benefits</h2>
              <ul className="job-detail__list">
                {job.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Description section */}
          <section className="job-detail__section">
            <h2 className="job-detail__section-title">Full Job Description</h2>
            <div className="job-detail__description">
              {descriptionParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        </div>

        {/* spacer so sticky footer doesn't overlap content */}
        <div className="job-detail__footer-spacer" />
      </div>

      {/* ─── Sticky footer ─── */}
      <div className="job-detail__footer">
        <div className="job-detail__footer-inner">
          <button
            type="button"
            className="job-detail__apply-btn"
            onClick={handleApply}
            disabled={applying || applied}
            aria-disabled={applying || applied}
          >
            {applied ? 'Application submitted' : applying ? 'Submitting…' : 'Apply now'}
          </button>
          <button
            type="button"
            className={`job-detail__save-btn${isSaved ? ' job-detail__save-btn--saved' : ''}`}
            onClick={handleToggleSave}
            aria-pressed={isSaved}
          >
            <BookmarkIcon filled={isSaved} />
            {isSaved ? 'Saved' : 'Save job'}
          </button>
        </div>
      </div>
    </div>
  );
}
