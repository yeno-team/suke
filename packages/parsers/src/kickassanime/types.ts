import { Url } from "@suke/suke-core/src/entities/Url";
import { ValidationError } from "@suke/suke-core/src/exceptions/ValidationError";

export type ExternalVideoServer = 
"SAPPHIRE-DUCK" | "PINK-BIRD" | 
"BETASERVER3" | "BETA-SERVER" | 
"A-KICKASSANIME" | "THETA-ORIGINAL" | 
"DEVSTREAM" | "HTML5" | "ORIGINAL-QUALITY-V2" |
"ORIGINAL-QUALITY-V4"

export interface AnimeRawSearchResult {
    name : string,
    slug : string,
    image : string
}

export interface RawExternalVideoServerResponse {
    name : ExternalVideoServer,
    src : string
}

export interface ExternalVideoServerResponse {
    name : ExternalVideoServer,
    src : Url
}

export interface RawNewVideoPlayerSourceFile {
    file : string,
    label : string,
    type : string,
    default? : string
}

export interface RawEpisodeData {
    epnum : string,
    name : null | string,
    slug : string,
    createddate : string,
    num : string
}

export class KickAssAnimeEpisodeUrl extends Url {
    constructor(url : string) {
        super(url);

        if(!this.isValidEpisodeUrl()) {
            throw new ValidationError("Invalid KickAssAnime episode URL.")
        }
    }

    private isValidEpisodeUrl() : boolean {
        const episodeUrlRegex = /https:\/\/www2\.kickassanime\.ro\/anime\/[A-Za-z0-9-]+\d{6}\/episode-\d*-\d{6}/
        return episodeUrlRegex.test(this.address)
    }
}

export class KickAssAnimeInfoUrl extends Url {
    constructor(url : string) {
        super(url);

        if(!this.isValidInfoUrl()) {
            throw new ValidationError("Invalid KickAssAnime info URL.")
        }

    }

    private isValidInfoUrl() : boolean {
        const infoUrlRegex = /https:\/\/www2.kickassanime\.ro\/anime\/.*-\d*/
        return infoUrlRegex.test(this.address)
    }
}