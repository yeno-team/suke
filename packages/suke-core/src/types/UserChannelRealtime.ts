import { IVideoSource } from "../entities/SearchResult";

export interface RealtimeChannelData {
    currentVideo: {
        sources: IVideoSource[],
        name: string, 
        category: string
    };
    paused: boolean;
    progress: {
        currentTime: number
    }
}
