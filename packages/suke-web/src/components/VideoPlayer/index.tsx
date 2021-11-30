import React from 'react';
import ReactPlayer from 'react-player';

export interface VideoPlayerProps {
    url: string;
    height?: string;
    width?: string;
}

export const VideoPlayer = ({url, width = "100%", height = "100%"}: VideoPlayerProps) => {
    return (
        <ReactPlayer width={width} height={height} url={url} style={{backgroundColor: 'black'}} controls/>
    )
}