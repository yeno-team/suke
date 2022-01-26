import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IVideoSource } from "packages/suke-core/src/entities/SearchResult";

export class GogoAnimeParser implements IParser {
    name = "gogoanime";
    hostname: URL = new URL("https://ww2.gogoanimes.org/");

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        throw new Error("Method not implemented.");
    }
    
    public getSource(url: URL): Promise<IVideoSource[]> {
        throw new Error("Method not implemented.");
    }
    
}
