import {Link} from "react-router-dom";

type Job = {

    _id:string;
    title:string;
    company:string;
    location:string;
    basePay:number;
    payMax?:number;
    payUnit:string;
    jobTyoe:string;
    tags?:string[];

};


export default function JobCard({job, isSaved, onSave}: JobCardProps){

    const firstLetter = job.company.charAt(0).toUppercase();

    const pay = 
    job.payMax
    ? `$${job.basePay}-${job.payMax}/${job.payUnit}`
    : `$${job.basePay}/${job.payUnit}`;

    return(
        <div className="job-card__badge">
            {firstLetter}
        </div>

        <div className="job-card__content">
{/* Title       */}
<Link to={`/jobs/${job._id}`} className="job-card__title">
{job.title}
</Link>

{/* Company */}
{/* Location */}
{/* Pay */}
{/* Job Type Chip */}
{/* Tags */}
{/* Bookmark */}




  </div>


    );


}