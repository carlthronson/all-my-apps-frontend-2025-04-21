// contexts/JobSearchContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { JobSearchPhase, JobSearchStatus, JobSearchJobListing } from '@/types/jobSearchTypes';

type JobSearchContextType = {
    phases: JobSearchPhase[];
    statuses: JobSearchStatus[];
    jobListings: JobSearchJobListing[];
    updateJobStatus: (jobId: string, newStatus: JobSearchStatus) => void;
    isDisabled?: boolean;
}

const JobSearchContext = createContext<JobSearchContextType | null>(null);

export function JobSearchProvider({ initialData, children }: { initialData: any; children: React.ReactNode }) {
    const [phases, setPhases] = useState<JobSearchPhase[]>(initialData.phases);
    const [statuses, setStatuses] = useState<JobSearchStatus[]>(initialData.statuses);
    const [jobListings, setJobListings] = useState<JobSearchJobListing[]>(initialData.jobListings);
    const [isDisabled, setIsDisabled] = useState(initialData.isDisabled);

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