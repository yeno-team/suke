import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import {ISearchData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { MobileTvShowsWrapper } from "@suke/wrappers/src";
import { Service } from "typedi";


@Service()
export class MobileTvShowsParser implements IParser {
    name="Tv Shows 1";
    hostname = new URL("https://www.mobiletvshows.net");

    constructor (
        private wrapper: MobileTvShowsWrapper 
    ) { }
    
    getData(url: URL): Promise<ParserDataResponse> {
        throw new Error("Method not implemented.");
    }

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        let pageNumber = 1;

        if (options?.token != null) {
            pageNumber = parseInt(Buffer.from(options.token, 'base64').toString('base64'));
        }

        const data = await this.wrapper.search(searchTerm, pageNumber);
        
        return {
            results: {
                standalone: [],
                multi: data
            }, 
            nextPageToken: data.length >= 20 ? btoa(String(pageNumber+1)) : undefined
        };
    }

    async getSource(url: URL): Promise<IVideoSource[]> {
        return await this.wrapper.getSources(url);
    }
}