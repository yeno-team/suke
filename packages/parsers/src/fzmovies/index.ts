import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IStandaloneData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { FzMoviesWrapper } from "@suke/wrappers/src";
import { Service } from "typedi";


@Service()
export class FzMoviesParser implements IParser {
    name="fzmovies";
    hostname = new URL("https://fzmovies.net");

    constructor (
        private wrapper: FzMoviesWrapper 
    ) { }

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        let pageNumber = 1;

        if (options?.token != null) {
            pageNumber = parseInt(atob(options.token));
        }

        const data = await this.wrapper.search(searchTerm, pageNumber);

        return {
            results: {
                standalone: [...data.map(v => {
                    return {
                        type: StandaloneType.Movie,
                        name: v.name,
                        id: v.name+v.posterUrl.toString().slice(10,12),
                        thumbnail_url: v.posterUrl.toString(),
                        sources: [{url: v.url, quality: Quality.auto}]
                    } as IStandaloneData;
                })],
                multi: []
            }, 
            nextPageToken: data.length >= 20 ? btoa(String(pageNumber+1)) : undefined
        };
    }

    async getSource(url: URL): Promise<IVideoSource[]> {
        return await this.wrapper.getSources(url);
    }
}