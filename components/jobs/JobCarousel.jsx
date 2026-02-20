import JobCard from "./JobCard";

export default function JobCarousel({
  jobs = [],
  onSave = () => {},
  savedJobs = [],
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      {jobs.map((job, i) => {
        const jobId = job.id || `${job.platform}-${job.title}`;
        const isSaved = savedJobs.some(j => j.job_id === jobId);

        return (
          <div key={i} className="min-w-[260px]">
            <JobCard
              job={job}
              onSave={onSave}
              saved={isSaved}
            />
          </div>
        );
      })}
    </div>
  );
}
