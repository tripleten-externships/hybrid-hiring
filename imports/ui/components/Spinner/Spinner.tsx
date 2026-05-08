import './Spinner.css';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
}

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 18,
  md: 32,
  lg: 48,
};

export const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const px = SIZE_PX[size];
  return (
    <svg
      className="spinner"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
      role="status"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="spinner__track"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="spinner__arc"
      />
    </svg>
  );
};

/** Full-page centered spinner for route-level loading states */
export const PageSpinner = () => (
  <div className="spinner-page">
    <Spinner size="lg" />
  </div>
);
