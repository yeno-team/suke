import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { DailymotionApiWrapper } from "@suke/wrappers";
import { Service } from "typedi";



@Service()
export class DailymotionParser implements IParser {
    name = "dailymotion";
    hostname: URL = new URL("https://dailymotion.com");

    constructor(
        private wrapper: DailymotionApiWrapper
    ) {}

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        const pageNumber = options?.token ? Buffer.from(options?.token, "base64").toString('ascii') : "1"
        return await this.wrapper.search(searchTerm, Math.max(parseInt(pageNumber), 1), options?.limit || 30);
    }
    async getSource(url: URL): Promise<IVideoSource[]> {
        return [];
    }
    getData(url: URL): Promise<ParserDataResponse | undefined> {
        throw new Error("Method not implemented.");
    }
}