import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import {ISearchData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { MobileTvShowsWrapper } from "@suke/wrappers/src";
import { Service } from "typedi";


@Service()
export class MobileTvShowsParser implements IParser {
    name="mobiletvshows";
    hostname = new URL("https://www.mobiletvshows.net");

    constructor (
        private wrapper: MobileTvShowsWrapper 
    ) { }

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        let pageNumber = 1;

        if (options?.token != null) {
            pageNumber = parseInt(atob(options.token));
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