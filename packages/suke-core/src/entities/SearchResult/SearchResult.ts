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
   results: {
       standalone: IStandaloneData[],
       multi: IMultiData[]
   },
   nextPageToken?: string,
   prevPageToken?: string
}

export interface IStandaloneData {
    type: StandaloneType;
    name: string | null;
    id: string,
    thumbnail_url: string | null;
    sources: IVideoSource[];
}

export interface IVideoSource {
    url: URL;
    quality: Quality;
}

export interface IMultiData {
    name: string,
    id: string,
    thumbnail_url: string,
    data: IMultiStandaloneData[]
}

export interface IMultiStandaloneData {
    type: StandaloneType,
    name: string | null,
    index: number,
    sources: IVideoSource[]
}

