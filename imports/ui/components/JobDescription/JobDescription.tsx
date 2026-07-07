import {
  getDescriptionText,
  isHtmlDescription,
  sanitizeJobDescription,
} from '/imports/api/jobs/description';
import './JobDescription.css';

type JobDescriptionProps = {
  description: string;
  className?: string;
};

export function JobDescription({ description, className = '' }: JobDescriptionProps) {
  const safeDescription = sanitizeJobDescription(description);

  if (!getDescriptionText(safeDescription)) {
    return null;
  }

  if (isHtmlDescription(safeDescription)) {
    return (
      <div
        className={`job-description job-description--rich${className ? ` ${className}` : ''}`}
        dangerouslySetInnerHTML={{ __html: safeDescription }}
      />
    );
  }

  const paragraphs = safeDescription.split('\n').filter((p) => p.trim() !== '');

  return (
    <div className={`job-description${className ? ` ${className}` : ''}`}>
      {paragraphs.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
