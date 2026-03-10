import { Info } from '../examples/Info';
import { Hello } from '../examples/Hello';
import JobCard from '../components/JobCard/JobCard';

// JobCard Test-----
const testJob = {
  _id: '1',
  title: 'Master Electrician',
  company: 'Trinity Solar',
  location: 'Pittsburgh, PA 15201 (Central Lawrenceville area',
  basePay: 46 - 50,
  payUnit: 'hr',
  jobType: 'Full-time',
  tags: ['Paid Training', '401(K) matching'],
};

export const Home = () => {
  return (
    <div>
      <h1>Welcome to Hybrid Hiring Solutions!</h1>
      <Hello />
      <br />
      <Info />
      {/* JobCard Test */}
      <JobCard job={testJob} isSaved={false} onSave={() => {}} />
    </div>
  );
};
