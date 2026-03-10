import './JobCard.css';
import { Link } from 'react-router-dom';
import { SelectionLabel } from '../SelectionLabel/SelectionLabel';
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
  // JIRA ticket discrepancy
  // const firstLetter = job.company.charAt(0).toUpperCase();

  const pay = job.payMax
    ? `$${job.basePay}–${job.payMax}/${job.payUnit}`
    : `$${job.basePay}/${job.payUnit}`;

  return (
    <div className="job-card">
      {/* Company Badge  JIRA ticket discrepancy*/}
      {/* <div className="job-card__badge">{firstLetter}</div> */}

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
        <div className="job-card__pay">Base Pay:{pay}</div>

        <div className="job-card__chip-tags">
          {/* Job Type Chip */}
          <SelectionLabel label={job.jobType} selected={false} onClick={() => {}} />

          {/* Tags */}
          <div className="job-card__tags">
            {job.tags?.map((tag) => (
              <SelectionLabel key={tag} label={tag} selected={false} onClick={() => {}} />
            ))}
          </div>
        </div>

        <Button size="lg">Quick Apply</Button>
        <Button size="lg">More Details</Button>
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
