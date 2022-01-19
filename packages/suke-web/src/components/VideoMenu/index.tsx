import { RealtimeChannelData } from '@suke/suke-core/src/types/UserChannelRealtime';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';
import { useChannel } from '../../hooks/useChannel';
import { VideoMenuHeader } from './VideoMenuHeader';

export interface VideoMenuProps {
    channelId: string,
    handleOpenBrowser?: () => void;
    handleOpenSettings?: () => void;
    className?: string;
    playerWidth?: string;
    playerHeight?: string;
    isAuthenticated: boolean;
    ownerView: boolean;
    viewerCount?: number;
    channelData: RealtimeChannelData
}

export interface PlayerProgressState {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
}

export const VideoMenu = ({ viewerCount, handleOpenBrowser, className, playerHeight, playerWidth, isAuthenticated, ownerView, channelId, handleOpenSettings, channelData}: VideoMenuProps): JSX.Element => {
    const { updateRealtimeChannelData } = useChannel();
    const [player, setPlayer] = useState<ReactPlayer | null>(null);
    const [clientPaused, setClientPaused] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState<PlayerProgressState>({} as PlayerProgressState);
    const [seeking, setSeeking] = useState(false);
    const isOwner = (isAuthenticated && ownerView ? true : false);

    const updateCurrentRealtimeTime = useCallback((currentTime) => {
        updateRealtimeChannelData({
            progress: {
                currentTime: currentTime
            },
            paused: false,
            channelId: channelId
        });
    }, [channelId, updateRealtimeChannelData])

    const handleProgress = (state: PlayerProgressState) => {
        setProgress(state);

        if (!isOwner) {
            // disabled syncing the pause state TODO: fix syncing unpause after pause
            // setPlaying(!channelData.paused);
        }

        if (clientPaused)
            return;

        if (Math.abs(progress.playedSeconds - channelData.progress?.currentTime) > 1.5 && isOwner) {
            updateCurrentRealtimeTime(progress.playedSeconds);
        }
 
        if (Math.abs(progress.playedSeconds - channelData.progress?.currentTime) > 2.5 && !isOwner && !seeking ) {
            setSeeking(true);
            player?.seekTo(channelData.progress?.currentTime);
            setPlaying(true);
            setTimeout(() => setSeeking(false), 2000);
        }
    }
 
    const handlePause = () => {
        if (isOwner) {
            updateRealtimeChannelData({
                paused: true,
                channelId: channelId
            });
        }

        if (playing) {
            setClientPaused(true);
        }
    }

    const handlePlay = () => {
        if (isOwner) {
            updateRealtimeChannelData({
                paused: false,
                channelId: channelId
            });
        }
        setClientPaused(false);
    }

    
    const handleStart = () => {
        setClientPaused(false);
        setPlaying(true);
    }

    const currentVideoSource = useMemo(() => {
        const foundSource = channelData.currentVideo?.sources.find(v => ReactPlayer.canPlay(v.url.toString()));

        if (foundSource != null) {
            return foundSource.url.toString();
        }
    }, [channelData.currentVideo?.sources]);

    return (
        <div className={classNames('h-full', className, 'flex flex-col')}>
            <VideoMenuHeader viewerCount={viewerCount ?? 0} handleOpenSettings={handleOpenSettings} handleOpenBrowser={handleOpenBrowser} isAuthenticated={isAuthenticated} category={channelData.category} title={channelData.title} isOwner={ownerView}/>
            <ReactPlayer playing={!clientPaused && playing} ref={ref => setPlayer(ref)} onPause={handlePause} onStart={handleStart} onPlay={handlePlay} onProgress={handleProgress} width={playerWidth ?? "100%"} height={playerHeight ?? "100%"} url={currentVideoSource} style={{backgroundColor: 'black'}} controls={true}/>
        </div>
    )
}