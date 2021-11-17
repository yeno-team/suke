import { Author } from "../entities/User";

export type VideoRequest = {
    // video data here when merge #17
    author: Author;
}

export interface RealtimeChannelData {
    videoSrc: string;
    requests: VideoRequest[];
}
