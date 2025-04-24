// `app/job-board/page.tsx` is the UI for the `/job-board/` URL
'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import StoryBoard from '@/components/StoryBoard';

const Title = styled.h1`
    text-align: center;
`   ;

const SubTitle = styled.h2`
    text-align: center;
`   ;

export default function Page() {
  const { status } = useSession()
  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState('READONLY');

  const query = `
  query getJobSearchTasks {
      getJobSearchTasks {
        id
        name
        label
      }
    }
  `;

  console.log("query: " + query);
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

  console.log("baseUrl: " + baseUrl);
  console.log("process.env.NEXT_PUBLIC_VERCEL_URL: " + process.env.NEXT_PUBLIC_VERCEL_URL);
  useEffect(() => {
    fetch(`/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
        }
      })
    })
      .then((response) => {
        const json = response.json();
        console.log("Response from GraphQL:", json);
        return json;
      })
      .then((json) => {
        if (json?.errors) {
          console.error("GraphQL errors:", json.errors);
          return;
        }
        setTasks(json?.data?.getJobSearchTasks);
        console.log("phases: " + JSON.stringify(json.data.getJobSearchTasks));
      })
      .catch((error) => {
        console.error("Error fetching data from GraphQL response:", error);
      });
      setMode(status === 'authenticated' ? 'LIVE' : 'READONLY');
  }, []);

  const isDisabled = (mode == 'LIVE') ? false : true;

  return <div>
    <Title>After processing {tasks.length} total jobs...</Title>
    <SubTitle>These jobs remain as possibilities.</SubTitle>
    <SubTitle>This view is in {mode} mode</SubTitle>
    <div>
      {/* Coming soon... */}
      <StoryBoard isDisabled={isDisabled}></StoryBoard>
    </div>
  </div>
}

