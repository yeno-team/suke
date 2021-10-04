export enum Category {
    Anime,
    Movie,
    TvShow,
    Youtube,
}

export enum StandaloneType {
    Video,
    Stream
}

export enum Quality {
    "360p",
    "480p",
    "720p",
    "1080p",
    "2K",
    "4K",
    "6K"
}

export interface ISearchResult {
    standalones: IStandaloneData[],
    multiples: IMultiData[]
}

export interface IStandaloneData {
    type: StandaloneType
    name: string,
    thumbnail_url: string,
    sources: IVideoSource[]
}

export interface IVideoSource {
    name: string,
    url: string,
    quality: Quality
}

export interface IMultiData {
    name: string,
    thumbnail_url: string,
    data: IMultiStandaloneData[]
}

export interface IMultiStandaloneData {
    type: StandaloneType,
    name: string,
    index: number,
    sources: IVideoSource[]
}
