// src/types/JobSearch.ts

export interface JobSearchPhase {
    id: string;
    name: string;
    label: string;
}

export interface JobSearchStatus {
    id: string;
    name: string;
    label: string;
    phase: JobSearchPhase;
}

export interface JobSearchTask {
    id: string;
    name: string;
    label: string;
    status: JobSearchStatus;
}

export interface JobSearchVector {
    id: string;
    score: number; // Similarity score
    text: string; // Original text used to create the vector
    jobListing: JobSearchJobListing; // Reference to the associated JobListing
}

export interface JobSearchJobListing {
    id: string;
    name: string;
    label: string;
    companyName: string;
    company: Company
    location: string;
    linkedinid: string;
    linkedinurl: string;
    contracttype: string;
    experiencelevel: string;
    salary: number;
    sector: string;
    worktype: string;
    publishedAt: Date;
    task: JobSearchTask;
}

export interface Company {
    id: string;
    name: string;
    label?: string;
    location?: string;
    jobs: JobSearchJobListing[];
}
