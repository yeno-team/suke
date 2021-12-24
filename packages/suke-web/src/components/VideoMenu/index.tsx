import classNames from 'classnames';
import React from 'react';
import { VideoPlayer } from '../VideoPlayer';

import { VideoMenuHeader } from './VideoMenuHeader';


export interface VideoMenuProps {
    url: URL;
    handleOpenBrowser?: () => void;
    className?: string;
    playerWidth?: string;
    playerHeight?: string;
    isAuthenticated?: boolean;
    ownerView?: boolean;
    title?: string;
    category?: string;
}

export const VideoMenu = ({ url, handleOpenBrowser, className, playerHeight, playerWidth, isAuthenticated, ownerView, title, category }: VideoMenuProps): JSX.Element => {
    return (
        <div className={classNames('h-full', className, 'flex flex-col')}>
            <VideoMenuHeader handleOpenBrowser={handleOpenBrowser} isAuthenticated={isAuthenticated} category={category} title={title}/>
            <VideoPlayer url={url?.toString()} width={playerWidth} height={playerHeight} controls/>
        </div>
    )
}