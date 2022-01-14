import { IVideoSource } from "../entities/SearchResult";

export interface RealtimeChannelData {
    title: string,
    category: string,
    viewerCount: number,
    thumbnail: {
        url: URL
    },
    currentVideo: {
        sources: IVideoSource[],
        name: string
    },
    paused: boolean,
    progress: {
        currentTime: number,
    },
    password: string,
    private: boolean,
    followerOnlyChat: boolean
}
