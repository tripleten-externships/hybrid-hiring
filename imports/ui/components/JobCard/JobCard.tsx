import './JobCard.css';
import { Link } from 'react-router-dom';
import { SelectionLabel } from '/imports/ui/components/SelectionLabel/SelectionLabel';
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
  console.log(job.basePay, typeof job.basePay);

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
          <SelectionLabel label={job.jobType} selected={false} onClick={() => {}} />
          {job.tags?.map((tag) => (
            <SelectionLabel key={tag} label={tag} selected={false} onClick={() => {}} />
          ))}
        </div>

        <Button size="sm" variant="primary" fullWidth>
          Quick Apply
        </Button>
        <Button size="sm" variant="outline" fullWidth>
          More Details
        </Button>
      </div>

      {/* Bookmark */}
      {onSave && (
        <button className="job-card__bookmark" onClick={onSave} aria-pressed={isSaved}  aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}>
          <img
            src={isSaved ? '/assets/bookmark-saved.svg' : '/assets/bookmark.svg'}
            alt='' aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
