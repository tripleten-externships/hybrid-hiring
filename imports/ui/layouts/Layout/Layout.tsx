import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { RouteBackgroundPreloader } from '../../components/RouteBackgroundPreloader/RouteBackgroundPreloader';
import { DocumentTitle } from '../../components/DocumentTitle/DocumentTitle';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="layout">
      <ScrollToTop />
      <DocumentTitle />
      <RouteBackgroundPreloader />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
