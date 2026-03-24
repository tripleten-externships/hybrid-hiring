import './JobCard.css';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button';

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  basePay: number;
  payMax?: number;
  payUnit: string;
  jobType: string;
  tags?: string[];
};

type JobCardProps = {
  job: Job;
  isSaved?: boolean;
  onSave?: () => void;
};

export default function JobCard({ job, isSaved, onSave }: JobCardProps) {
  const formatPay = (val: number | undefined) => (val != null && !isNaN(val) ? `$${val}` : null);

  const pay = (() => {
    const base = formatPay(job.basePay);
    const max = formatPay(job.payMax);
    if (!base) return 'Pay not listed';
    return max ? `${base} - ${max}` : `${base}/${job.payUnit}`;
  })();

  return (
    <div className="job-card">
      <div className="job-card__content">
        {/* Title       */}
        <Link to={`/jobs/${job._id}`} className="job-card__title">
          {job.title}
        </Link>

        {/* Company & Locations */}
        <div className="job-card__company-location">
          {/* Company */}
          <div className="job-card__company">{job.company}</div>
          {/* Location */}
          <div className="job-card__location">{job.location}</div>
        </div>

        {/* Pay */}
        <div className="job-card__pay">Base Pay: {pay}</div>

        {/* Chip tags */}
        <div className="job-card__chip-tags">
       <span className="chip">{job.jobType}</span>
{job.tags?.map((tag) => (
  <span key={tag} className="chip">{tag}</span>
))}
        </div>

        <Button
          size="sm"
          variant="primary"
          fullWidth
          onClick={() => {
            /* TODO --to quick apply*/
          }}
        >
          Quick Apply
        </Button>
        <Button
          size="sm"
          variant="outline"
          fullWidth
          onClick={() => {
            /* TODO --job details*/
          }}
        >
          More Details
        </Button>
      </div>

      {/* Bookmark */}
      {onSave && (
        <button
          className="job-card__bookmark"
          onClick={onSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
        >
          <img
            src={isSaved ? '/assets/bookmark-saved.svg' : '/assets/bookmark.svg'}
            alt=""
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
