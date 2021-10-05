import { StandaloneType , SearchResult } from "packages/suke-core/src/entities/SearchResult";
import { createFormData } from "packages/suke-util/dist";
import { IParser, IParserSearchOptions } from "../IParser";
import axios from "axios"

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


export class KickAssAnimeParser implements IParser {
    name = "KickAssAnime"
    hostname = "https://www2.kickassanime.ro"

    public async search(searchTerm: string, options: IParserSearchOptions): Promise<SearchResult> {
        const formData = createFormData({ keyword : searchTerm })
        const req = await axios({
            url : `${this.hostname}/api/anime_search`,
            data : formData,
            headers : {
                "Content-Type" : `multipart/form-data; boundary=${formData.getBoundary()}`
            }
        })
        
        const data : Array<AnimeRawSearchResult> = req.data

        return data.map(({ name , image }) => ({
            type : StandaloneType.Video,
            thumbnail_url : `${this.hostname}/uploads/${image}`,
            name
        }))
    }
}