export type KickAssAnimeApiSearchResponse = Array<{
    name : string,
    slug : string,
    image : string
}>

export type KickAssAnimeInfoResponse = {
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
    episodes : Array<KickAssAnimeEpisode>,
    types : Array<{ name : string }>,
    genres : Array<{ name : string , slug : string }>
    aid : string,
    favorited : boolean,
    votes : number,
    rating : boolean
}

export type KickAssAnimeEpisode = {
    epnum : string,
    name : string | null,
    slug : string,
    createddate : string,
    num : string
}

export type KickAssAnimeSourceFile = {
    quality : string,
    url : URL,
    type : string
}

export type KickAssAnimeServer = {
    name : string,
    src : URL,
    rawSrc? : string
}