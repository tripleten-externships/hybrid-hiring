import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import JobCard from '../components/JobCard/JobCard';

const testJob = {
  _id: '1',
  title: 'Frontend Developer',
  company: 'Acme Corp',
  location: 'Remote',
  basePay: 80000,
  payUnit: 'yr',
  jobType: 'Full-time',
  tags: ['React', 'TypeScript'],
};

export const Home = () => {
  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>
      <Hello />
      <br />
      <Info />
      <JobCard job={testJob} isSaved={false} onSave={() => {}} />
    </div>
  );
};
