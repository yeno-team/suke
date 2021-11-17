import React from 'react';
import { VideoPlayer } from '../VideoPlayer';

import { VideoMenuHeader } from './VideoMenuHeader';


export interface VideoMenuProps {
    url: string;
}

export const VideoMenu = ({ url }: VideoMenuProps): JSX.Element => {
    return (
        <React.Fragment>
            <VideoMenuHeader />
            <VideoPlayer url={url} />
        </React.Fragment>
    )
}