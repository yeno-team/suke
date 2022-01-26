import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { IMultiData, IMultiStandaloneData, ISearchData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { GogoAnimeApiWrapper } from "@suke/wrappers/src/gogoanime";
import { GogoAnimeInfoResponse } from "@suke/wrappers/src/gogoanime/types";
import { Service } from "typedi";

export interface GogoAnimeQuerySearhcResponse {
    data : Array<GogoAnimeInfoResponse>
}

@Service()
export class GogoAnimeParser implements IParser {
    name = "gogoanime";
    hostname: URL = new URL("https://ww2.gogoanimes.org/");

    constructor(
        private gogoAnimeApiWrapper : GogoAnimeApiWrapper
    ) {}

    private async getVideoSources(url : URL) : Promise<IVideoSource[]> {
        return this.gogoAnimeApiWrapper.getSources(url)
    }

    private async query_search(searchTerm : string) : Promise<GogoAnimeQuerySearhcResponse> {
        const data = await this.gogoAnimeApiWrapper.search(searchTerm)

        return {
            data : await Promise.all(data.map(async ({ url }) => await this.gogoAnimeApiWrapper.getAnimeInfo(url)))
        }        
    }

    private extract_multi({ title , imageUrl , episodes } : GogoAnimeInfoResponse) : IMultiData {
        const data : IMultiStandaloneData[] = []

        for(let i = 0; i < episodes.length; i++) {
            const { epNum , url} = episodes[i]

            data.push({
                type : StandaloneType.Video,
                name : "Episode " + epNum,
                index : parseInt(epNum),
                sources : [
                    {
                        url,
                        quality : Quality["auto"]
                    }
                ]
            })
        }

        return {
            id : title + Date.now(),
            name : title,
            thumbnail_url : imageUrl ? imageUrl.href : "",
            data
        }
    }

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        const { data : searchData } = await this.query_search(searchTerm)

        return {
            results : {
                standalone : [],
                multi : searchData.map((data) => this.extract_multi(data))
            }
        }

    }

    public async getSource(url: URL): Promise<IVideoSource[]> {
        return this.getVideoSources(url)
    }
}
