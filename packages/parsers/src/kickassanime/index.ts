/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Service } from "typedi";
import { IMultiData, ISearchData , StandaloneType , Quality } from "@suke/suke-core/src/entities/SearchResult";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError"
import { KickAssAnimeApiWrapper } from "@suke/wrappers/src"
import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { KickAssAnimeApiSearchResult, KickAssAnimeEpisode, KickAssAnimeInfoResponse, KickAssAnimeSourceFile } from "@suke/wrappers/src/kickassanime";

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
    name = "kickassanime"
    hostname : URL = new URL("https://www2.kickassanime.ro/")

    constructor(
        private wrapper : KickAssAnimeApiWrapper
    ){}

    private pagination<T>(data : Array<T> , options? : ParserSearchOptions) : KickAssAnimePaginationResponse<T> {
        const startIndex = ((options?.pageNumber ?? 1) - 1) * ((options?.limit ?? 5))
        const endIndex = (options?.pageNumber ?? 1) * ((options?.limit ?? 5))


        if(startIndex > data.length)  {
            throw new ParserError('This page number exceeds the results.')
        }

        const pagination_data : Array<T> = [] 
        
        for(let i = startIndex; i < endIndex; i++) {
            // When we access an index position that doesn't exist on the array it will return undefined.
            if(!(data[i])) {
                break
            }

            pagination_data.push(data[i])
        }

        const result : KickAssAnimePaginationResponse<T> = { data : pagination_data }

        if(startIndex > 0) {
            result["prevPageToken"] = ((options?.pageNumber ?? 1) - 1).toString()
        }

        if(endIndex < data.length) {
            result["nextPageToken"] = ((options?.pageNumber ?? 1) + 1).toString()
        }

        return result
    }   

    /**
     * Query the search data from the KickAssAnime search api.
     * @param searchTerm 
     * @param options 
     * @returns 
     */
    private async query_search(searchTerm : string , options? : ParserSearchOptions) : Promise<KickAssAnimeQuerySearchResponse> {
        const searchResults = await this.wrapper.search(searchTerm)
        const queryResults = this.pagination<KickAssAnimeApiSearchResult>(searchResults , options)
        
        return {
            ...queryResults,
            data : await Promise.all(queryResults.data.map(async ({ url }) => this.wrapper.getAnimeInfo(url)))
        }
    }

    private async getVideoSources(url : URL) : Promise<Array<KickAssAnimeSourceFile>>{
        // Catch error here
        const videoPlayerUrl = await this.wrapper.getVideoPlayerUrl(url)
        const externalServers = await this.wrapper.getExternalServers(videoPlayerUrl)
        
        for(let i = 0; i < externalServers.length; i++) {
            try {
                return await this.wrapper.getVideoSourcesFiles(externalServers[i].src)
            // eslint-disable-next-line no-empty
            } catch (e) {}
        }

        return []
    }

    private query_episodes(data : Array<KickAssAnimeEpisode>, options? : ParserSearchOptions) : KickAssAnimePaginationResponse<KickAssAnimeEpisode> {
        return this.pagination(data , new ParserSearchOptions({ pageNumber : 1 , limit : 10 }))
    }

    private async extractMultis({ name , image , episodes } : KickAssAnimeInfoResponse) : Promise<IMultiData> {
        return {
            name,
            thumbnail_url : image.href,
            data : await Promise.all(episodes.map(async ({ name , num , url }) => ({
                type : StandaloneType.Video,
                name,
                index : parseInt(num),
                sources : await (await this.getVideoSources(url)).map(({ url , quality }) => ({
                    url,
                    quality : Quality[quality]
                }))
            })))
        }
    }

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        if(options && options.token) {
            throw new ParserError("Options token property is not supported on the KickAssAnime parser.")
        }

        // eslint-disable-next-line no-prototype-builtins
        if(options && options.limit) {
            throw new ParserError("Options limit property is not supported on the KickAssAnime parser.")
        }

        // eslint-disable-next-line no-prototype-builtins
        if(options && options.pageNumber !== undefined && options.pageNumber! <= 0) {
            throw new ParserError("Options pageNumber property is not an invalid integer.")
        }

        const { data , nextPageToken , prevPageToken } = await this.query_search(searchTerm , options)
        const animes = data.map((anime) => ({ ...anime , episodes : this.query_episodes(anime.episodes).data }))

        return {
            results : {
                standalone : [],
                multi : await Promise.all(animes.map((anime) => this.extractMultis(anime)))
            },
            nextPageToken,
            prevPageToken
        }
    }
}