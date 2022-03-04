import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { ISearchData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { Fast32Wrapper } from "@suke/wrappers/src";
import { Service } from "typedi";


@Service()
export class Fast32Parser implements IParser {
    name = "Main";
    hostname = new URL("https://fast32.com");

    constructor (
        private wrapper: Fast32Wrapper
    ) {}

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        return await this.wrapper.search(searchTerm, options != null && options.token != null ? parseInt(Buffer.from(options.token, 'base64').toString('ascii')) : 1);
    }

    async getSource(url: URL): Promise<IVideoSource[]> {
        return await this.wrapper.getSources(url);
    }

    async getData(url: URL): Promise<ParserDataResponse | undefined> {
        const episodes = await this.wrapper.tryGetEpisodes(url);
        const data = await this.wrapper.getData(url);
        if (episodes.length > 0) {
            return {
                multi: true,
                data: {
                    name: data.name,
                    id: Buffer.from(url.pathname).toString('base64'),
                    thumbnail_url: data.posterUrl.toString(),
                    data: episodes.flatMap((v, i) => ({
                        type: StandaloneType.Movie,
                        name: 'Episode ' + (i+1),
                        index: i, 
                        sources: [{
                            url: v,
                            quality: Quality.auto
                        }]
                    }))
                }
            };
        } else {
            return {
                multi: false,
                data: {
                    type: StandaloneType.Movie,
                    name: data.name,
                    id: Buffer.from(url.pathname).toString('base64'),
                    thumbnail_url: data.posterUrl.toString(),
                    sources: [
                        {
                            url,
                            quality: Quality.auto
                        }
                    ]
                }
            };
        } 
    }
}