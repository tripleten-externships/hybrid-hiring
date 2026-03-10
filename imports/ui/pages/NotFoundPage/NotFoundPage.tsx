import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page__content">
      <h2 className="not-found-page__code">404</h2>
      <h3 className="not-found-page__title">Page Not Found</h3>
      <Link to="/" className="not-found-page__link btn btn--outline btn--md">
        Return Home
      </Link>
    </div>
  );
};
