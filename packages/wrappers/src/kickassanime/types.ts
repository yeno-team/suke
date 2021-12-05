import { QualityAsUnion } from "@suke/suke-core/src/entities/SearchResult";

export type KickAssAnimeApiSearchResponse = Array<KickAssAnimeApiSearchResult>
export type KickAssAnimeApiRawSearchResponse = Array<KickAssAnimeApiRawSearchResult>

export type KickAssAnimeApiRawSearchResult = {
    name : string;
    slug : string;
    image : string;
}

export type KickAssAnimeApiSearchResult = {
    name : string;
    url : URL;
    imageUrl : URL;
}

export interface KickAssAnimeInfoRawResponse {
    name : string,
    en_title : string | null,
    slug : string,
    slug_id : string,
    description : string,
    status : string,
    image : string,
    banner : string | null,
    startdate : string,
    enddate : null | string,
    broadcast_day : string,
    broadcast_time : string,
    source : string,
    duration : string,
    alternate : Array<string>,
    episodes : Array<KickAssAnimeRawEpisode>,
    type : Array<{ name : string }>,
    genres : Array<{ name : string , slug : string }>
    aid : string,
    favorited : boolean,
    votes : number,
    rating : boolean
}

export interface KickAssAnimeInfoResponse extends Pick<KickAssAnimeInfoRawResponse , "name" | "description" | "genres" | "type"> {
    episodes : Array<KickAssAnimeEpisode>
    image : URL,
    url : URL
}

export interface KickAssAnimeRawEpisode {
    epnum : string,
    name : string | null,
    slug : string,
    createddate : string,
    num : string
}

export interface KickAssAnimeEpisode extends Pick<KickAssAnimeRawEpisode , "name" | "num" | "createddate"> {
    url : URL;
}

export type KickAssAnimeSourceFile = {
    quality : QualityAsUnion,
    url : URL,
    type : string
}

export type KickAssAnimeServer = {
    name : string,
    src : URL,
    rawSrc? : string
}