import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Contact from './Contact';

const ContactsArea = styled.div`
    background-color: #f4f5f7;
    border-radius: 2.5px;
    height: 475px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border: 1px solid gray;
    flex: 1;
`   ;

const ContactsColumnHeader = styled.h3`
    padding: 8px;
    background-color: lightblue;
    text-align: center;
    position: 'stick',
`   ;

const ContactListArea = styled.div`
    padding: 3px;
  transistion: background-color 0.2s ease;
  background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`   ;

export default function ContactColumn({ statuses, phase, id }) {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const url = "/api/rest/contact/findall";
        console.log("url: " + url);
        fetch(url)
            .then((response) => {
                console.log("right here");
                const json = response.json()?.content;
                console.log(json);
                const body = response.body;
                return json;
            })
            .then((data) => {
                setContacts(data);
                setIsLoading(false);
            });
    }, []);

    return (
        <ContactsArea>
            <ContactsColumnHeader>Active contacts</ContactsColumnHeader>
            <ContactListArea>
                {isLoading ? 'Please wait for list of contacts' : contacts.map((item, index) => (
                    <Contact key={index} index={index} contact={item}/>
                ))}
            </ContactListArea>
        </ContactsArea>
    );
}
