import { Service } from "typedi";
import { StandaloneType , SearchResult } from "@suke/suke-core/src/entities/SearchResult";
import { createFormData } from "@suke/suke-util/dist";
import { IParser, ParserSearchOptions } from "../IParser";
import { AxiosRequest } from "@suke/requests/src/";

export enum KickAssAnimeServers {
    "PINK-BIRD",
    "SAPPHIRE-DUCK",
    "MAGENTA13",
    "A-KICKASSANIME",
    "THETA-ORIGINAL",
    "BETAPLAYER",
    "BETASERVER3",
    "BETA-SERVER"
}

export type AnimeRawSearchResult = {
    name : string,
    slug : string,
    image : string
}

@Service()
export class KickAssAnimeParser implements IParser {
    name = "KickAssAnime"
    hostname = "https://www2.kickassanime.ro"

    constructor(
        public request : AxiosRequest
    ) {}

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<SearchResult> {
        if(options) {
            throw new Error("Options is disabled and not being used at the moment.")
        }

        const formData = createFormData({ keyword : searchTerm })

        const data = await this.request.post<Array<AnimeRawSearchResult>>(`${this.hostname}/api/anime_search` , {
            body : formData,
            headers : {
                "Content-Type" : `multipart/form-data; boundary=${formData.getBoundary()}`
            }
        })

        return data.map(({ name , image }) => ({
            type : name.toLowerCase().includes("movie") ? StandaloneType.Movie : StandaloneType.Video,
            thumbnail_url : `${this.hostname}/uploads/${image}`,
            name
        }))
    }
}