import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { VumooWrapper } from "@suke/wrappers/src";
import { Service } from "typedi";




@Service()
export class VumooParser implements IParser {
    name = "main";
    hostname = new URL("https://vumoo.to");

    constructor (
        private wrapper: VumooWrapper
    ) {}

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        return await this.wrapper.search(searchTerm);
    }

    async getSource(url: URL): Promise<IVideoSource[]> {
        const data = await this.wrapper.getSource(url);
        return [data];
    }

    async getData(url: URL): Promise<ParserDataResponse | undefined> {
        return this.wrapper.getData(url);
    }
}