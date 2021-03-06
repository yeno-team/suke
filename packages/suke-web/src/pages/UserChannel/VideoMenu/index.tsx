import { RealtimeRoomData } from '@suke/suke-core/src/types/UserChannelRealtime';
import { captureFrame} from '@suke/suke-util';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useChannel } from '../../../hooks/useChannel';
import { VideoMenuHeader } from './VideoMenuHeader';
import { VideoPlayer } from '@suke/suke-web/src/components/VideoPlayer';


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
    setThumbnail?: (v: string) => void;
    channelData: RealtimeRoomData
}

export interface PlayerProgressState {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
}

const VideoMenuComponent = ({ viewerCount, setThumbnail, handleOpenBrowser, className, playerHeight, playerWidth, isAuthenticated, ownerView, channelId, handleOpenSettings, channelData}: VideoMenuProps): JSX.Element => {
    const { updateRealtimeRoomData } = useChannel();
    const [player, setPlayer] = useState<ReactPlayer | null>(null);
    const [clientPaused, setClientPaused] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState<PlayerProgressState>({} as PlayerProgressState);
    const [seeking, setSeeking] = useState(false);
    const [seekingTimer, setSeekingTimer] = useState<number>();
    
    const [thumbnailTimer, setThumbnailTimer] = useState<number>();
    const isOwner = (isAuthenticated && ownerView ? true : false);

    const channelDataRef = useRef<RealtimeRoomData>();
    channelDataRef.current = channelData;
    const playerRef = useRef<ReactPlayer | null>();
    playerRef.current = player;
    const seekingRef = useRef<number>();
    seekingRef.current = seekingTimer;

    useEffect(() => {
        if (!isOwner) return;
        
        if (thumbnailTimer != null) {
            clearTimeout(thumbnailTimer);
        }

        if (setThumbnail) {
            getThumbnail();
            setThumbnailTimer(setInterval(getThumbnail, 10000) as unknown as number);
        }

        return () => clearTimeout(thumbnailTimer!);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getThumbnail = () => {
        const internalPlayer = playerRef.current?.getInternalPlayer();

        if (internalPlayer != null && internalPlayer instanceof HTMLVideoElement) {
            const image = captureFrame(internalPlayer, "jpeg");
            setThumbnail!("data:image/jpeg;base64," + image.image.toString('base64'))
        } else {
            if (channelDataRef.current?.currentVideo == null) return;
            if (channelDataRef.current.currentVideo.thumbnail_url !== "") {
                setThumbnail!(channelDataRef.current!.currentVideo.thumbnail_url);
            }
        }
    }

    const updateCurrentRealtimeTime = useCallback((currentTime) => {
        updateRealtimeRoomData({
            progress: {
                currentTime: currentTime
            },
            paused: false,
            channelId: channelId
        });
    }, [channelId, updateRealtimeRoomData])

    const handleProgress = (state: PlayerProgressState) => {
        setProgress(state);
        
        if (!isOwner) {
            // disabled syncing the pause state TODO: fix syncing unpause after pause
            // setPlaying(!channelData.paused);
        }

        if (clientPaused)
            return;

        if (Math.abs(progress.playedSeconds - channelData.progress?.currentTime) > 2.5 && isOwner) {
            updateCurrentRealtimeTime(progress.playedSeconds);
        }
 
        if (Math.abs(progress.playedSeconds - channelData.progress?.currentTime) > 2.5 && !isOwner && !seeking ) {
            if (seekingRef.current != null) {
                clearTimeout(seekingRef.current);
            }
            setSeeking(true);
            player?.seekTo(channelData.progress?.currentTime);
            setPlaying(true);
            setSeekingTimer(setTimeout(() => setSeeking(false), 2000) as unknown as number);
        }
    }
 
    const handlePause = () => {
        if (isOwner) {
            updateRealtimeRoomData({
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
            updateRealtimeRoomData({
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

    return (
        <div className={classNames('h-full', className, 'flex flex-col')}>
            <VideoMenuHeader viewerCount={viewerCount ?? 0} handleOpenSettings={handleOpenSettings} handleOpenBrowser={handleOpenBrowser} isAuthenticated={isAuthenticated} category={channelData.category} title={channelData.title} isOwner={ownerView}/>
            <VideoPlayer playing={!clientPaused && playing} ref={ref => setPlayer(ref)} onPause={handlePause} onStart={handleStart} onPlay={handlePlay} onProgress={handleProgress} width={playerWidth ?? "100%"} height={playerHeight ?? "100%"} sources={channelData.currentVideo.sources} />
        </div>
    )
}

export const VideoMenu = React.memo(VideoMenuComponent);