"use client"
import styled from 'styled-components';
import { Avatar, Col, Image } from 'antd';
import Link from 'antd/es/typography/Link';
import Select from 'react-select'
import React, { useState, useEffect, useMemo } from 'react';
import { useCollapse } from 'react-collapsed'
// import { stat } from 'fs';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useJobSearch } from '@/contexts/JobSearchContext';

const DynamicSelect = dynamic(() => import('react-select').then(mod => mod.default), { ssr: false });

const customStyles = {
  container: (provided) => ({
    ...provided,
    display: 'inline-block',
    // width: '250px',
    minHeight: '1px',
    textAlign: 'left',
    border: 'none',
    // backgroundColor: 'pink',
    paddingLeft: '10px',
  }),
  control: (provided) => ({
    ...provided,
    // border: '2px solid #757575',
    borderRadius: '0',
    minHeight: '1px',
    // height: '42px',
    // backgroundColor: 'pink',
  }),
  input: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingTop: '0',
    paddingBottom: '0',
    color: '#757575',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    minHeight: '1px',
    // height: '24px',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '1px',
    // height: '40px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
    // backgroundColor: 'pink',
  }),
  singleValue: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingBottom: '2px',
  }),
};

const TaskArea = styled.div`
    border-radius: 2px;
  box-shadow: 1px 1px 1px 1px grey;
    padding: 8px;
    color: black;
    margin-top: 8px;
    // margin-bottom: 4px;
    min-height: 25px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: cyan;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`   ;

const Row = styled.div`
  flex: 1;
  // background-color: pink;
  padding: 3px
`;

function bgcolorChange(props) {
  return 'lightgreen';
}

export default function Task({ job, story, index }) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()
  const { statuses, updateJobStatus, isDisabled } = useJobSearch();

  // console.log("isDisabled: " + isDisabled);

  const handleChange = (selectedOption) => {
    console.log('selected choice: ' + JSON.stringify(selectedOption));
    // job.task.status.name = selectedOption.value;
    // job.task['story'] = { id: story.id };
    let payload = JSON.stringify({ id: job.task.id, status: selectedOption.value });
    console.log("payload for posting to task api: " + payload);
    fetch('/api/rest/task', {
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // Useful for including session ID (and, IIRC, authorization headers)
    })
      .then(response => response.json())
      .then(data => {
        console.log("response from task api: " + JSON.stringify(data));
        // Update the job status in the context
        updateJobStatus(job.id, data.status);
      })
      .catch(error => console.error(error));
  }

  // console.log("Story: " + JSON.stringify(story));

  // Build options once (memoized)
  const options = useMemo(() =>
    statuses
      .filter(item => item.name !== 'invalid')
      .map(item => ({
        value: item.name,
        label: item.label,
      })), [statuses]);

  // Find the initial value in options
  const initialValue = useMemo(() =>
    options.find(opt => opt.value === job.task.status.name), [options, job.task.status.name]);

  // Controlled state for the select value
  const [selectedOption, setSelectedOption] = useState(initialValue);

  // If job/task/status changes, update the selected option
  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === job.task.status.name));
  }, [job.task.status.name, options]);

  return (
    <TaskArea>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8
      }}>
        <Link style={{}} href={job.linkedinurl} target='_blank'>{job.name}</Link>
        {/* <p style={{float: 'right'}}>Right-aligned text</p> */}
        <Link style={{ flexShrink: 0 }} {...getToggleProps()}>{isExpanded ? 'Collapse' : 'Expand'}</Link>
      </div>
      <div style={{ display: 'flex' }} {...getCollapseProps()}>
        <div style={{ padding: '3px' }}>Status:
          <DynamicSelect
            instanceId={`status-select-${job.id}`}  // Use a unique, stable value for each select
            styles={customStyles}
            className="basic-single"
            classNamePrefix="select"
            value={selectedOption}
            isDisabled={isDisabled}
            isLoading={false}
            isClearable={false}
            isRtl={false}
            isSearchable={false}
            name="Status"
            options={options}
            onChange={handleChange}
          />
        </div>

        <Row>Location: {job.location || story.location}</Row>
        <Row>Posted: {moment.utc(job.publishedAt).fromNow().replace(/^a day ago$/, 'Yesterday')}</Row>
        <Row>Keywords: {job.keywords}</Row>
        <Row>Salary: {job.salary}</Row>
        <Row>Contract type: {job.contracttype}</Row>
        <Row>Experience Level: {job.experiencelevel}</Row>
        <Row>Sector: {job.sector}</Row>

      </div>
    </TaskArea>
  );
}
