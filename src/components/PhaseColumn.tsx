'use client';
import React from 'react';
import styled from 'styled-components';
import Story from './Story';
import { useJobSearch } from '@/contexts/JobSearchContext';
import { JobSearchPhase, Company } from '@/types/jobSearchTypes';

const PhaseArea = styled.div`
    background-color: #f4f5f7;
    border-radius: 2.5px;
    height: 475px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border: 1px solid gray;
    flex: 1;
`   ;

const PhaseName = styled.h3`
    padding: 8px;
    background-color: lightblue;
    text-align: center;
    position: 'stick',
`   ;

const StoryListArea = styled.div`
    padding: 3px;
  transistion: background-color 0.2s ease;
  background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`   ;

export default function PhaseColumn({ phase }: { phase: JobSearchPhase }) {
    const { jobListings } = useJobSearch();

    const filteredJobs = jobListings.filter(job =>
        // For each job, check if the task's status's phase matches the current phase
        job?.task?.status?.phase?.name === phase?.name
    );

    // filteredJobs is JobListing[]
    const companies: Company[] = [];
    const companyMap: Record<string, Company> = {};

    for (const job of filteredJobs) {
        const companyId = job.company.id;
        if (!companyMap[companyId]) {
            // Create new story object for this company
            const company: Company = {
                id: companyId,
                name: job.company.name,
                label: job.company.label,
                location: job.company.location,
                jobs: [job],
                // newestPublishedAt: new Date(job.publishedAt),
            };
            companyMap[companyId] = company;
            companies.push(company);
        } else {
            // Add job to existing story
            companyMap[companyId].jobs.push(job);
        }
    }

    return (
        <PhaseArea>
            <PhaseName>
                {phase.label + ' - ' + companies.length}
            </PhaseName>
            <StoryListArea>
                {companies.map((item, index) => (
                    <Story key={index} index={index} phase={phase} story={item} total={companies.length} />
                ))}
            </StoryListArea>
        </PhaseArea>
    );
}
