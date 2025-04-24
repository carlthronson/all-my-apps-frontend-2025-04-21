import styled from 'styled-components';
import { Avatar, Col, Image } from 'antd';
import Link from 'antd/es/typography/Link';
import React, { useState, useEffect } from 'react';
// import { stat } from 'fs';


const ContactArea = styled.div`
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

export default function Contact({ contact, index }) {

  // console.log("Story: " + JSON.stringify(story));

  return (
    <ContactArea>
      <div>
        <Link style={{ float: 'left' }} href={contact.label} target='_blank'>{contact.name}</Link>
        {/* <p style={{float: 'right'}}>Right-aligned text</p> */}
      </div>
    </ContactArea>
  );
}
