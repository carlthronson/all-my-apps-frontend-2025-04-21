// import styled from 'styled-components';
"use client";
import PhaseColumn from './PhaseColumn';
import { useJobSearch } from '@/contexts/JobSearchContext';

export default function StoryBoard() {
  const { phases } = useJobSearch();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
      {phases
        .filter(phase => phase.label !== "No" && phase.label !== "Unlikely")
        .map((phase, index) => (
          <PhaseColumn
            key={index}
            id={index}
            phase={phase}
          />
        ))}
    </div>
  );
}
