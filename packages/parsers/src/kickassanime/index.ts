/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Service } from "typedi";
import { IMultiData, ISearchData , StandaloneType , Quality, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError";
import { KickAssAnimeApiWrapper } from "@suke/wrappers/src";
import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { KickAssAnimeInfoResponse, KickAssAnimeSourceFile } from "@suke/wrappers/src/kickassanime";

export type KickAssAnimePaginationResponse<T> = {
    nextPageToken? : string;
    prevPageToken? : string;
    data : Array<T>;
}

export type KickAssAnimeQuerySearchResponse = {
    nextPageToken? : string;
    prevPageToken? : string;
    data : Array<KickAssAnimeInfoResponse>
}

/**
 * @class
 * @author TheRealLunatite <bedgowns@gmail.com>
 */
@Service()
export default class KickAssAnimeParser implements IParser {
    name = "anime 2"
    hostname : URL = new URL("https://www2.kickassanime.ro/")

    constructor(
        private wrapper : KickAssAnimeApiWrapper
    ){}
    
    async getSource(url: URL): Promise<IVideoSource[]> {
        const sources = await this.getVideoSources(url);
        
        const videoSources = sources.map(v => ({
            url: v.url,
            quality: v.quality as keyof typeof Quality
        }));

        return videoSources as unknown as IVideoSource[];
    }

    /**
     * Query the search data from the KickAssAnime search api.
     * @param searchTerm 
     * @param options 
     * @returns 
     */
    private async query_search(searchTerm : string) : Promise<KickAssAnimeQuerySearchResponse> {
        if (searchTerm.length <= 3) 
            throw new Error("Search Term should be greater than 3 characters.");
        const queryResults = await this.wrapper.search(searchTerm);

        return {
            ...queryResults,
            data : await Promise.all(queryResults.map(async ({ url }) => this.wrapper.getAnimeInfo(url)))
        };
    }

    private async getVideoSources(url : URL) : Promise<Array<KickAssAnimeSourceFile>>{
        // Catch error here
        const videoPlayerUrl = await this.wrapper.getVideoPlayerUrl(url);
        const externalServers = await this.wrapper.getExternalServers(videoPlayerUrl);
        
        for(let i = 0; i < externalServers.length; i++) {
            try {
                return await this.wrapper.getVideoSourcesFiles(externalServers[i].src);
            // eslint-disable-next-line no-empty
            } catch (e) {}
        }

        return [];
    }

    private async extractMultis({ name , image , episodes } : KickAssAnimeInfoResponse) : Promise<IMultiData> {
        return {
            id: name + Date.now(),
            name,
            thumbnail_url : image.href,
            data : await Promise.all(episodes.map(async ({ num , url }) => ({
                type : StandaloneType.Video,
                name: 'Episode ' + num,
                index : parseInt(num),
                sources : [
                    {
                        url,
                        quality: Quality.auto
                    }
                ]
            })))
        };
    }

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        if(options && options.token) {
            throw new ParserError("Options token property is not supported on the KickAssAnime parser.");
        }

        const { data , nextPageToken , prevPageToken } = await this.query_search(searchTerm);
        const animes = data.map((anime) => ({ ...anime , episodes : anime.episodes }));

        return {
            results : {
                standalone : [],
                multi : await Promise.all(animes.map((anime) => this.extractMultis(anime)))
            },
            nextPageToken,
            prevPageToken
        };
    }
}