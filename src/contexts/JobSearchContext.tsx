"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { JobSearchPhase, JobSearchStatus, JobSearchJobListing, JobSearchVector } from '@/types/jobSearchTypes';
import { gql, useQuery } from '@apollo/client';

type JobSearchContextType = {
  phases: JobSearchPhase[];
  statuses: JobSearchStatus[];
  jobListings: JobSearchJobListing[];
  updateJobStatus: (jobId: string, newStatus: JobSearchStatus) => void;
  isDisabled?: boolean;
}

const JobSearchContext = createContext<JobSearchContextType | null>(null);

const GET_JOBS = gql`
  query GET_JOBS {
    findSimilarJobs(
      query: "Senior Software Engineer Backend"
      topK: 500
    ) {
      score
      text
      # metadata
      jobListing {
        id
        name
        label
        location
        linkedinid
        linkedinurl
        publishedAt
        salary
        sector
        worktype
        company {
          id
          name
          label
          location
        }
        task {
          id
          label
          name
          status {
            id
            label
            name
            phase {
              id
              label
              name
            }
          }
        }
      }
    }
  }
`;

export function JobSearchProvider({
  initialData,
  children,
}: {
  initialData: Omit<JobSearchContextType, 'updateJobStatus'>;
  children: React.ReactNode;
}) {
  const { loading, error, data } = useQuery(GET_JOBS);

  const [phases] = useState<JobSearchPhase[]>(initialData.phases);
  const [statuses] = useState<JobSearchStatus[]>(initialData.statuses);
  const [jobListings, setJobListings] = useState<JobSearchJobListing[]>(initialData.jobListings);
  const [isDisabled] = useState(initialData.isDisabled);

  useEffect(() => {
    if (data) {
      setJobListings(data.findSimilarJobs.map((item: JobSearchVector) => item.jobListing));
    }
  }, [data]);

  const updateJobStatus = useCallback((jobId: string, newStatus: JobSearchStatus) => {
    setJobListings(prev =>
      prev.map(job =>
        job.id === jobId
          ? {
            ...job,
            task: {
              ...job.task,
              status: newStatus
            }
          }
          : job
      )
    );
  }, []);

  if (loading) return <p>Loading job listings...</p>;
  if (error) return <p>Error loading job listings: {error.message}</p>;

  return (
    <JobSearchContext.Provider value={{ phases, statuses, jobListings, updateJobStatus, isDisabled }}>
      {children}
    </JobSearchContext.Provider>
  );
}

export function useJobSearch() {
  const context = useContext(JobSearchContext);
  if (!context) {
    throw new Error('useJobSearch must be used within a JobSearchProvider');
  }
  return context;
}
