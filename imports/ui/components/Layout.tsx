import { Outlet } from 'react-router-dom';
import { Header } from '../layouts/Header';
import { Footer } from '../layouts/Footer';
import '../layouts/Layout.css';

export const Layout = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
