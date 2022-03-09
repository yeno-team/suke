import { RealtimeTheaterRoomData } from '@suke/suke-core/src/types/UserChannelRealtime';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { VideoMenuHeader } from './VideoMenuHeader';

import { VideoPlayer } from '@suke/suke-web/src/components/VideoPlayer';


export interface VideoMenuProps {
    channelId: string,
    className?: string;
    playerWidth?: string;
    playerHeight?: string;
    isAuthenticated: boolean;
    viewerCount?: number;
    roomData: RealtimeTheaterRoomData
}

export interface PlayerProgressState {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
}

const VideoMenuComponent = ({ viewerCount, className, playerHeight, playerWidth, isAuthenticated, channelId, roomData}: VideoMenuProps): JSX.Element => {
    const [player, setPlayer] = useState<ReactPlayer | null>(null);
    const [clientPaused, setClientPaused] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState<PlayerProgressState>({} as PlayerProgressState);
    const [seeking, setSeeking] = useState(false);
    const [seekingTimer, setSeekingTimer] = useState<number>();
    
    const roomDataRef = useRef<RealtimeTheaterRoomData>();
    roomDataRef.current = roomData;
    const playerRef = useRef<ReactPlayer | null>();
    playerRef.current = player;
    const seekingRef = useRef<number>();
    seekingRef.current = seekingTimer;


    const handleProgress = (state: PlayerProgressState) => {
        setProgress(state);

        if (clientPaused)
            return;

        const currentProgress = (Date.now() - roomData.startedAt) / 1000;
        
        if (Math.abs(progress.playedSeconds - currentProgress) > 2.5 && !seeking ) {
            if (seekingRef.current != null) {
                clearTimeout(seekingRef.current);
            }
            setSeeking(true);
            player?.seekTo(currentProgress);
            setPlaying(true);

            setSeekingTimer(setTimeout(() => setSeeking(false), 2000) as unknown as number);
        }
    }
 
    const handlePause = () => {
        if (playing) {
            setClientPaused(true);
        }
    }

    const handlePlay = () => {
        setClientPaused(false);
    }
    
    const handleStart = () => {
        setClientPaused(false);
        setPlaying(true);
    }
    
    return (
        <div className={classNames('h-full relative', className, 'flex flex-col relative')}>
            <VideoMenuHeader viewerCount={viewerCount ?? 0} title={roomData.title}/>
            <VideoPlayer className="" playing={!clientPaused && playing} ref={ref => setPlayer(ref)} onPause={handlePause} onStart={handleStart} onPlay={handlePlay} onProgress={handleProgress} width={playerWidth ?? "100%"} height={playerHeight ?? "100%"} sources={roomData.currentVideo.sources}></VideoPlayer>
        </div>
    )
}

export const VideoMenu = React.memo(VideoMenuComponent);