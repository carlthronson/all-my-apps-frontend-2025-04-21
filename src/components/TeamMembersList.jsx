import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TeamMember from './TeamMember';

const TeamArea = styled.div`
    background-color: #f4f5f7;
    border-radius: 2.5px;
    height: 475px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border: 1px solid gray;
    flex: 1;
`   ;

const TeamName = styled.h3`
    padding: 8px;
    background-color: lightblue;
    text-align: center;
    position: 'stick',
`   ;

const TeamMemberListArea = styled.div`
    padding: 3px;
  transistion: background-color 0.2s ease;
  background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`   ;

export default function TeamMembersList({ team, id }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // const url = "/tutorial/polls/question/" + team.name + "/?pageNumber=0&pageSize=2000";
        // const url = "/tutorial/teams/teammembers";
        const url = "/api/rest/teams/teammember/?format=json";
        console.log("url: " + url);
        fetch(url)
            .then((response) => {
                const json = response.json();
                const body = response.body;
                return json;
            })
            .then((data) => {
                setTeamMembers(data);
                setIsLoading(false);
            });
    }, []);

    return (
        <TeamArea>
            {/* <TeamName>
                {phase.label + ' - ' + stories.length}
            </TeamName> */}
            <div>You have {teamMembers.length} members</div>
            <TeamMemberListArea>
                {isLoading ? 'Please wait' : teamMembers.map((item, index) => (
                    <TeamMember key={index} index={index} member={item} total={teamMembers.length}/>
                ))}
            </TeamMemberListArea>
        </TeamArea>
    );
}

