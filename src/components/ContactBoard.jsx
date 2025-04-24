import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ContactColumn from './ContactColumn.jsx';

const ContactBoardArea = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function ContactBoard() {
  { /* State */ }

  return (
    <ContactBoardArea>
      {/* This is where we will have columns for workflow states */}
      <ContactColumn></ContactColumn>
    </ContactBoardArea>
  );
}

