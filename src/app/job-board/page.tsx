// `app/job-board/page.tsx` is the UI for the `/job-board/` URL
'use client'
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
// import StoryBoard from '../../components/StoryBoard';

const Title = styled.h1`
    text-align: center;
`   ;

const SubTitle = styled.h2`
    text-align: center;
`   ;

export default function Page() {
  const { status } = useSession()
  const [tasks, setTasks] = useState([]);

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
      .then((data) => {
        setTasks(data.data.getJobSearchTasks);
        console.log("phases: " + JSON.stringify(data.data.getJobSearchTasks));
      });
    // setMode(process.env.MODE);
  }, []);

  return <div>
    <Title>After processing {tasks.length} total jobs...</Title>
    <SubTitle>These jobs remain as possibilities.</SubTitle>
    <SubTitle>This view is in {status === 'authenticated' ? 'LIVE' : 'READONLY'} mode</SubTitle>
    <div>
      {/* Coming soon... */}
      {/* <StoryBoard></StoryBoard> */}
    </div>
  </div>
}

