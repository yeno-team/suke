import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { AnimeFoxWrapper } from "@suke/wrappers/src/";

import { Service } from "typedi";


@Service()
export class AnimeFoxParser implements IParser {
    name = "Anime";
    hostname = new URL("https://animefox.sbs");

    constructor (
        private wrapper: AnimeFoxWrapper
    ) {}

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        let page;
        if (options && options.token) {
            page = parseInt(Buffer.from(options.token, 'base64').toString('ascii'));
        }

        return await this.wrapper.search(searchTerm, page);
    }

    async getSource(url: URL): Promise<IVideoSource[]> {
        const data = await this.wrapper.getSource(url);
        return [data];
    }

    async getData(url: URL): Promise<ParserDataResponse | undefined> {
        return this.wrapper.getData(url);
    }
}