import React from 'react';
import ReactPlayer from 'react-player';

export interface VideoPlayerProps {
    url: string;
    height?: string;
    width?: string;
    controls?: boolean;
}

export const VideoPlayer = ({url, width = "100%", height = "100%", controls}: VideoPlayerProps) => {
    return (
        <ReactPlayer  width={width} height={height} url={url} style={{backgroundColor: 'black'}} controls={controls}/>
    )
}