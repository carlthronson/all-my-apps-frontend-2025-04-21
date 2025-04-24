import { useCollapse } from 'react-collapsed';
import styled from 'styled-components';
import { Avatar, Image } from 'antd';
import React, { useState, useEffect } from 'react';
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

export default function Story({ story, statuses, index, total, isDisabled }) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

  return (
    <StoryArea>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8
      }}>
      <span href='' style={{  }}>{index + 1}/{total} ({story.jobs.length}) {story.label} - {story.location}</span>
      <Link href='' style={{  }} {...getToggleProps()}>{isExpanded ? 'Collapse' : 'Expand'}</Link>
      </div>
      <section {...getCollapseProps()}>
        {story.jobs.map((item, index) => (
            <Task key={index} job={item} story={story} statuses={statuses} index={index} isDisabled={isDisabled}/>
        ))}
      </section>
    </StoryArea>
  );
}
