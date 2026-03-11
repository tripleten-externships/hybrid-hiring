import { Outlet } from 'react-router-dom';
<<<<<<<< HEAD:imports/ui/layouts/Layout/Layout.tsx
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import './Layout.css';
========
import { Header } from '../layouts/Header';
import { Footer } from '../layouts/Footer';
import '../layouts/Layout.css';
>>>>>>>> HH-57/wire-meteor-login:imports/ui/components/Layout.tsx

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
