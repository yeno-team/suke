import { Author } from "../entities/User";
import { IVideoSource } from "../entities/SearchResult";

export type VideoRequest = {
    video: IVideoSource
    author: Author;
}

export interface RealtimeChannelData {
    currentVideo: IVideoSource;
    requests: VideoRequest[];
}
