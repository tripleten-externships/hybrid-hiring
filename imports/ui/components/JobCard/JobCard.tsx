import './JobCard.css';
import { Link } from 'react-router-dom';
import SelectionLabel from '/imports/ui/components/SelectionLabel/SelectionLabel';

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
  const firstLetter = job.company.charAt(0).toUpperCase();

  const pay = job.payMax
    ? `$${job.basePay}–${job.payMax}/${job.payUnit}`
    : `$${job.basePay}/${job.payUnit}`;

  return (
    <div className="job-card">
      {/* Company Badge */}
      <div className="job-card__badge">{firstLetter}</div>

      <div className="job-card__content">
        {/* Title       */}
        <Link to={`/jobs/${job._id}`} className="job-card__title">
          {job.title}
        </Link>

        {/* Company */}
        <div className="job-card__company">{job.company}</div>

        {/* Location */}
        <div className="job-card__location">{job.location}</div>

        {/* Pay */}
        <div className="job-card__pay">Base Pay:{pay}</div>

        {/* Job Type Chip */}
        <SelectionLabel label={job.jobType} selected={false} onClick={() => {}} />

        {/* Tags */}
        <div className="job-card__tags">
          {job.tags?.map((tag) => (
            <span key={tag} className="job-card__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bookmark */}
      {onSave && (
        <button className={`job-card__bookmark ${isSaved ? 'saved' : ''}`} onClick={onSave}>
          <img src="/bookmark.svg" alt="bookmark" />
        </button>
      )}
    </div>
  );
}
