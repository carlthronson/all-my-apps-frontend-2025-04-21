import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Story from './Story';

const PhaseArea = styled.div`
    background-color: #f4f5f7;
    border-radius: 2.5px;
    height: 475px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border: 1px solid gray;
    flex: 1;
`   ;

const PhaseName = styled.h3`
    padding: 8px;
    background-color: lightblue;
    text-align: center;
    position: 'stick',
`   ;

const StoryListArea = styled.div`
    padding: 3px;
  transistion: background-color 0.2s ease;
  background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`   ;

export default function PhaseColumn({ statuses, phase, id, isDisabled }) {
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const url = "/api/rest/story/phase/" + phase.name + "/?pageNumber=0&pageSize=2000";
        console.log("url: " + url);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log("all companies: " + JSON.stringify(data));
                // const body = response.body;
                // console.log("what is this: " + body);
                // return json;
                setStories(data);
                setIsLoading(false);
            });
    }, []);

    return (
        <PhaseArea>
            <PhaseName>
                {phase.label + ' - ' + stories.length}
            </PhaseName>
            <StoryListArea>
                {isLoading ? 'Please wait' : stories.map((item, index) => (
                    <Story key={index} index={index} statuses={statuses} story={item} total={stories.length} isDisabled={isDisabled}/>
                ))}
            </StoryListArea>
        </PhaseArea>
    );
}
