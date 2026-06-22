import './JobCard.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Job } from '/imports/api/jobs';
import { useIsLoggedIn } from '/imports/ui/hooks/useCurrentUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

type JobCardProps = {
  job: Job;
  isSaved?: boolean;
  onSave?: () => void;
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return <FontAwesomeIcon icon={filled ? faBookmarkSolid : faBookmarkRegular} />;
}

export default function JobCard({ job, isSaved, onSave }: JobCardProps) {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');

  const handleQuickApply = async () => {
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }
    if (!job._id || applying || applied) return;

    try {
      setApplyError('');
      setApplying(true);
      await Meteor.callAsync('applications.submit', job._id);
      setApplied(true);
    } catch (err) {
      const reason = err instanceof Meteor.Error ? err.reason : undefined;
      // Treat "already applied" as a success-like state rather than an error.
      if (err instanceof Meteor.Error && err.error === 'already-applied') {
        setApplied(true);
      } else {
        setApplyError(reason || 'Could not submit. Try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const formatDollar = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}K`;
    return `$${n}`;
  };

  const isSalary = job.payUnit === 'salary';
  const unit = isSalary ? '/yr' : '/hr';
  const payLabel = isSalary ? 'Base Salary:' : 'Base Pay:';
  const pay =
    job.payMax && job.payMax !== job.basePay
      ? `${formatDollar(job.basePay)} - ${formatDollar(job.payMax)}${unit}`
      : `${formatDollar(job.basePay)}${unit}`;

  const allChips = Array.from(
    new Set([job.jobType, ...(job.benefits ?? []), ...(job.tags ?? [])].filter(Boolean))
  );

  return (
    <div className="job-card">
      {/* Bookmark */}
      {onSave ? (
        <button
          className="job-card__bookmark"
          onClick={onSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
        >
          <BookmarkIcon filled={!!isSaved} />
        </button>
      ) : (
        /* show outline bookmark even for guests — clicking navigates to signup */
        <button
          className="job-card__bookmark"
          onClick={() => navigate('/signup')}
          aria-label="Sign in to save this job"
        >
          <BookmarkIcon filled={false} />
        </button>
      )}

      <div className="job-card__content">
        <Link to={`/jobs/${job._id}`} className="job-card__title">
          {job.title}
        </Link>

        <div className="job-card__company-location">
          <div className="job-card__company">{job.company}</div>
          <div className="job-card__location">{job.location}</div>
        </div>

        <div className="job-card__pay">
          {payLabel} {pay}
        </div>

        <div className="job-card__chip-tags">
          {allChips.map((tag, i) => (
            <span key={`${tag}-${i}`} className="job-card__chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="job-card__actions">
          <button
            type="button"
            className="job-card__btn job-card__btn--primary"
            onClick={handleQuickApply}
            disabled={applying || applied}
            aria-disabled={applying || applied}
          >
            {applied ? 'Applied ✓' : applying ? 'Submitting…' : 'Quick Apply'}
          </button>
          <button
            type="button"
            className="job-card__btn job-card__btn--outline"
            onClick={() => navigate(`/jobs/${job._id}`)}
          >
            More Details
          </button>
        </div>

        {applyError && (
          <p className="job-card__apply-error" role="alert">
            {applyError}
          </p>
        )}
      </div>
    </div>
  );
}
