export interface GogoAnimeSearchResponse {
    content : string;
}

export interface GogoAnimeEpisode {
    url : URL;
    epNum : string;
    type : string;
}
export interface GogoAnimeInfoResponse {
    title : string;
    type : string;
    imageUrl : URL;
    genres : Array<string>;
    summary : string;
    released : string;
    status : string;
    alias : Array<string>;
    episodes : Array<GogoAnimeEpisode>;
}

export interface GogoAnimeSearchResult {
    name : string;
    url : URL;
    imageUrl : URL | null;
}