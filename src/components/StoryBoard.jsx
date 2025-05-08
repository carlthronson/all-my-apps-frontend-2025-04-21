// import styled from 'styled-components';
"use client";
import PhaseColumn from './PhaseColumn';
import { useJobSearch } from '@/contexts/JobSearchContext';

// const StoryBoardArea = styled.div`
//   display: flex;
//   flex-direction: row;
// `;

export default function StoryBoard() {
  const { phases } = useJobSearch();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
      {phases.map((phase, index) => (
        <PhaseColumn
          key={index}
          id={index}
          phase={phase}
        />
      ))}
    </div>
  );
}
