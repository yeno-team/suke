import React from 'react';
import ReactPlayer from 'react-player';

export interface VideoPlayerProps {
    url: string;
}

export const VideoPlayer = ({url}: VideoPlayerProps) => {
    return (
        <ReactPlayer width="100%" height="100%" url={url} style={{backgroundColor: 'black'}} controls/>
    )
}