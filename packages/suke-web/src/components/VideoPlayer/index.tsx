import React from 'react';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({...props}) => {
    return (
        <ReactPlayer width="100%" height="100%" url="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" style={{backgroundColor: 'black'}} controls/>
    )
}