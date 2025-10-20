// `app/job-board/page.tsx` is the UI for the `/job-board/` URL
// import styled from 'styled-components';
import StoryBoard from '@/components/StoryBoard';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { JobSearchProvider } from '@/contexts/JobSearchContext';
import Link from "next/link";

// const Title = styled.h1`
//     text-align: center;
// `   ;

// const SubTitle = styled.h2`
//     text-align: center;
// `   ;

export default async function JobBoardPage() {
  const session = await getServerSession(authOptions);

  const GET_TASKS = `query getJobSearchTasks {getJobSearchTasks { id, name, label}}`;
  const taskData = await fetchGraphQL({ query: GET_TASKS, variables: {} });
  const tasks = taskData?.getJobSearchTasks;
  // console.log("tasks: " + JSON.stringify(tasks));

  const GET_PHASES = `query getJobSearchPhases {getJobSearchPhases { id, name, label}}`;
  const phaseData = await fetchGraphQL({ query: GET_PHASES, variables: {} });
  const phases = phaseData?.getJobSearchPhases;
  // console.log("phases: " + JSON.stringify(phases));

  const GET_STATUSES = `query getJobSearchStatuses {getJobSearchStatuses { id, name, label}}`;
  const statusData = await fetchGraphQL({ query: GET_STATUSES, variables: {} });
  const statuses = statusData?.getJobSearchStatuses;
  // console.log("statuses: " + JSON.stringify(statuses));

  const GET_JOBS = `query GET_JOBS
{
  getJobSearchJobListings(
    pageNumber: 0
    pageSize: 10
    sortDirection: "DESC"
    sortProperties: ["publishedAt"]
  ) {
    content {
      id
      name
      label
      companyName
      company {
        id
        name
        label
        location
      }
      location
      linkedinid
      linkedinurl
      contracttype
      experiencelevel
      salary
      sector
      worktype
      publishedAt
      task {
        id
        name
        label
        status {
          id
          name
          label
          phase {
            id
            name
            label
          }
        } 
      }
    }
    number
    size
    totalElements
    totalPages
    numberOfElements
    first
    last
    hasNext
    hasPrevious
    empty
  }
}
`;
  const jobData = await fetchGraphQL({ query: GET_JOBS, variables: {} });
  const jobsPage = jobData?.getJobSearchJobListings;
  const jobs = jobsPage?.content || [];
  // console.log("stories: " + JSON.stringify(stories));

  const mode = session ? 'LIVE' : 'READONLY';

  return <div>
      <div>
      <Link href="/">
          Home
        </Link>
      </div>
    <h1>After processing {tasks.length} total jobs...</h1>
    <h2>These jobs remain as possibilities.</h2>
    <h2>This view is in {mode} mode</h2>
    <div>
      {/* Coming soon... */}
      <JobSearchProvider initialData={{ phases, statuses, jobListings: jobs, isDisabled: mode === 'READONLY' }}>
        <StoryBoard />
      </JobSearchProvider>
    </div>
  </div >
}
