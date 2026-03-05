import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import SelectionLabel from '../components/SelectionLabel';

export const Home = () => {
  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>
      <Hello />
      <br />
      <Info />
<SelectionLabel label="Example" selected={false} onClick={() => {}} />    </div>
  );
};
