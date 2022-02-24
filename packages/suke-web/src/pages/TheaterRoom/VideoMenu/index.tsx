import { IVideoSource } from '@suke/suke-core/src/entities/SearchResult';
import { RealtimeTheaterRoomData } from '@suke/suke-core/src/types/UserChannelRealtime';
import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { VideoMenuHeader } from './VideoMenuHeader';
import { browserName } from 'react-device-detect';


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

    const currentVideoSource = useMemo(() => {
        const serverUrl = process.env.REACT_APP_PROXY_URL || "http://localhost:4382/";
        let highestQuality: IVideoSource | undefined;
        
        for (const v of roomData.currentVideo?.sources) {
            const canPlay = (v.proxyRequired ? ReactPlayer.canPlay(serverUrl + v.url.toString()) : ReactPlayer.canPlay(v.url.toString()));

            if (canPlay && highestQuality == null) {
                highestQuality = v;
                continue;
            } 

            if ((canPlay || (v.url.toString().endsWith('.mkv') && browserName === "Chrome")) && v.quality > highestQuality!.quality) {
                highestQuality = v;
            }
        }
        
        if (highestQuality != null) {
            return (highestQuality.proxyRequired ? serverUrl : '') + highestQuality.url.toString();
        }
    }, [roomData.currentVideo?.sources]);

    
    return (
        <div className={classNames('h-full', className, 'flex flex-col')}>
            <VideoMenuHeader viewerCount={viewerCount ?? 0} title={roomData.title}/>
            <ReactPlayer playing={!clientPaused && playing} ref={ref => setPlayer(ref)} onPause={handlePause} onStart={handleStart} onPlay={handlePlay} onProgress={handleProgress} width={playerWidth ?? "100%"} height={playerHeight ?? "100%"} url={currentVideoSource} style={{backgroundColor: 'black'}} controls={true} config={{ file: { attributes: {crossOrigin: 'anonymous'}}}}/>
        </div>
    )
}

export const VideoMenu = React.memo(VideoMenuComponent);