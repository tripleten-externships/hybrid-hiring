import './CompanyLogo.css';

type CompanyLogoProps = {
  src: string;
  company: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_CLASS = {
  sm: 'company-logo--sm',
  md: 'company-logo--md',
  lg: 'company-logo--lg',
} as const;

export function CompanyLogo({ src, company, size = 'md', className = '' }: CompanyLogoProps) {
  return (
    <img
      src={src}
      alt={`${company} logo`}
      className={`company-logo ${SIZE_CLASS[size]}${className ? ` ${className}` : ''}`}
      loading="lazy"
      decoding="async"
    />
  );
}
