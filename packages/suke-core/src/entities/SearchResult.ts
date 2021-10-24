import { Url } from "./Url";

export enum Category {
    Anime,
    Movie,
    TvShow,
    Youtube,
}

export enum StandaloneType {
    Video,
    Movie,
    Stream
}

export enum Quality {
    "auto",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "2K",
    "4K",
    "6K"
}

export type QualityAsUnion = keyof typeof Quality

export interface ISearchData {
    type : StandaloneType,
    name : string,
    thumbnail_url : Url
}

export interface IEpisodeData {
    episode_name : string | null,
    episode_num : number,
    thumbnail_url : string | null,
    url : Url
}

export interface IStandaloneData {
    type: StandaloneType
    name: string | null,
    thumbnail_url: string | null,
    sources: IVideoSource[]
}

export interface IVideoSource {
    url: Url
    quality: Quality
}

// export interface IMultiData {
//     name: string,
//     thumbnail_url: string,
//     data: IMultiStandaloneData[]
// }

// export interface IMultiStandaloneData {
//     type: StandaloneType,
//     name: string,
//     index: number,
//     sources: IVideoSource[]
// }
