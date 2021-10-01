import React from 'react';
import { VideoPlayer } from '../VideoPlayer';

import { VideoMenuHeader } from './VideoMenuHeader';


export const VideoMenu = (): JSX.Element => {
    return (
        <React.Fragment>
            <VideoMenuHeader />
            <VideoPlayer />
        </React.Fragment>
    )
}