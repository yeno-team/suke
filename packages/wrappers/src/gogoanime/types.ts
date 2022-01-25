export interface GogoAnimeSearchResponse {
    content : string;
}

export interface GogoAnimeEpisode {
    url : URL | null;
    epNum : string;
    type : string;
}
export interface GogoAnimeInfoResponse {
    title : string;
    type : string;
    imageUrl : null | URL;
    genres : Array<string>;
    summary : string;
    released : string;
    status : string;
    alias : Array<string>;
    episodes : Array<GogoAnimeEpisode>;
}

export interface GogoAnimeSearchResult {
    name : string;
    imageUrl : URL | null;
}