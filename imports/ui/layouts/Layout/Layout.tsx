import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import './Layout.css';

export const Layout = () => {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
