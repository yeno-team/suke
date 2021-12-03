/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Service } from "typedi";
import { ISearchData , IVideoSource, IEpisodeData , StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError"
import { KickAssAnimeApiWrapper } from "@suke/wrappers/src"
import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { KickAssAnimeApiSearchResponse } from "packages/wrappers/src/kickassanime";

/**
 * @class
 * @author TheRealLunatite <bedgowns@gmail.com>
 */
@Service()
export default class KickAssAnimeParser implements IParser {
    private queryLimits = [5,10]

    name = "kickassanime"
    hostname : URL = new URL("https://www2.kickassanime.ro/")

    constructor(
        private wrapper : KickAssAnimeApiWrapper
    ){}

    /**
     * Query the search data from the KickAssAnime search api.
     * @param searchTerm 
     * @param options 
     * @returns 
     */
    private async query(searchTerm : string , options? : ParserSearchOptions) : Promise<any> {
        const searchResults = await this.wrapper.search(searchTerm)
        
        const startIndex = ((options?.pageNumber ?? 1) - 1) * (options?.limit ?? 5)
        const endIndex = (options?.pageNumber ?? 1) * (options?.limit ?? 5)

        if(startIndex > searchResults.length)  {
            throw new ParserError('This page number exceeds the results.')
        }

        const queryResults = []

        for(let i = startIndex; i < endIndex; i++) {
            // When we access an index position that doesn't exist on the array it will return undefined.
            if(!(searchResults[i])) {
                break
            }

            queryResults.push(searchResults[i])
        }

        return queryResults
    }

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        if(options && options.token) {
            throw new ParserError("Options token property is not supported on the KickAssAnime parser.")
        }

        // eslint-disable-next-line no-prototype-builtins
        if(options && options.hasOwnProperty("pageNumber") && options.pageNumber! <= 0) {
            throw new ParserError("Options pageNumber property is not an invalid integer.")
        }

        if(options && options.limit && !(this.queryLimits).includes(options.limit!)) {
            throw new ParserError("Options limit property allowed values : 5,10,25.")
        }

        const results = await this.query(searchTerm , options)
        console.log(results)

        return {} as ISearchData
    }
}