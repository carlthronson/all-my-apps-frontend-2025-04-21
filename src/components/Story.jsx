import { useCollapse } from 'react-collapsed';
import styled from 'styled-components';
import { Avatar, Image } from 'antd';
import React from 'react';
import Link from 'next/link';
import Task from './Task';

const StoryArea = styled.div`
    border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
    padding: 8px;
    color: #000;
    margin-bottom: 8px;
    min-height: 90px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #DCDCDC;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`   ;

export default function Story({ phase, story, index, total }) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

  const filteredJobs = story.jobs.filter(job =>
    // For each job, check if the task's status's phase matches the current phase
    job?.task?.status?.phase?.name === phase?.name
  );

  return (
    <StoryArea>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8
      }}>
        <span style={{}}>{index + 1}/{total} ({filteredJobs.length}) {story.label} - {story.location}</span>
        <div style={{ color: '-webkit-link', cursor: 'pointer', textDecoration: 'underline' }} {...getToggleProps()}>{isExpanded ? 'Collapse' : 'Expand'}</div>
      </div>
      <section {...getCollapseProps()}>
        {filteredJobs.map((item, index) => (
          <Task key={item.linkedinid} job={item} story={story} index={index} />
        ))}
      </section>
    </StoryArea>
  );
}
