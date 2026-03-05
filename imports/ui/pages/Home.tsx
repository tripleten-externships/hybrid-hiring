import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import { Footer } from '../layouts/Footer';

export const Home = () => {
  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>
      <Hello />
      <br />
      <Info />
      <Footer />
    </div>
  );
};
