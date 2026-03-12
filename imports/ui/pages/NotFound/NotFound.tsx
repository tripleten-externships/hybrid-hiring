import { Link } from 'react-router-dom';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="not-found__content">
      <h2 className="not-found__code">404</h2>
      <h3 className="not-found__title">Page Not Found</h3>
      <Link to="/" className="not-found__link btn btn--outline btn--lg">
        Return Home
      </Link>
    </div>
  );
};
