import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IStandaloneData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
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
        return [
            {
                url,
                quality: Quality.auto
            }
        ];
    }
    
    async getData(url: URL): Promise<ParserDataResponse> {
        return {
            multi: false,
            data: {
                quality: Quality.auto,
                thumbnail_url: "",
                type: StandaloneType.Video,
                name: "",
                id: this.hostname.toString() + Date.now() + Math.random()*50,
                sources: await this.getSource(url)
            } as IStandaloneData
        }
    }
}