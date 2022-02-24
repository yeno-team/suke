import { IVideoSource } from "../entities/SearchResult";

export interface RealtimeRoomData {
    id: string,
    title: string,
    category: string,
    viewerCount: number,
    thumbnail: {
        url: string
    },
    currentVideo: {
        sources: IVideoSource[],
        name: string,
        thumbnail_url: string
    },
    paused: boolean,
    progress: {
        currentTime: number,
    },
    password: string,
    private: boolean,
    followerOnlyChat: boolean,
    live: boolean
}

export interface RealtimeTheaterRoomData extends RealtimeRoomData {
    duration: number,
    startedAt: number
}