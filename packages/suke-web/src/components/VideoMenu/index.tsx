import classNames from 'classnames';
import React from 'react';
import { VideoPlayer } from '../VideoPlayer';

import { VideoMenuHeader } from './VideoMenuHeader';


export interface VideoMenuProps {
    url: string;
    handleOpenBrowser?: () => void;
    className?: string;
    playerWidth?: string;
    playerHeight?: string;
    isAuthenticated?: boolean;
}

export const VideoMenu = ({ url, handleOpenBrowser, className, playerHeight, playerWidth, isAuthenticated }: VideoMenuProps): JSX.Element => {
    return (
        <div className={classNames('h-full', className, 'flex flex-col')}>
            <VideoMenuHeader handleOpenBrowser={handleOpenBrowser} isAuthenticated={isAuthenticated} />
            <VideoPlayer url={url} width={playerWidth} height={playerHeight} />
        </div>
    )
}