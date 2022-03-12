import { AxiosRequest } from "@suke/requests/src";
import { IMultiData, ISearchData, IStandaloneData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { Service } from "typedi";
import { ParserDataResponse } from "@suke/suke-core/src/entities/Parser";
import * as cheerio from 'cheerio';

@Service()
export class VumooWrapper {
    private host = "https://vumoo.to/";
    
    constructor(
        private request: AxiosRequest
    ) {}
    
    // a meomeo.pw url is the passed in url
    public async getSource(url: URL): Promise<IVideoSource> {
        const resp = await this.request.get<string>(url, {headers: {"Referer": this.host}});
        const fileRegex = /jwplayer\('player'\)\.setup\((.*)\)/gm;
        const matches = fileRegex.exec(resp);

        if (matches == null || matches?.length <= 0) {
            throw new Error("Could not grab source.");
        }

        const jwplayerConfig = JSON.parse(matches[1]);

        return {
            proxyRequired: true,
            url: new URL("https:" + jwplayerConfig.playlist[0].file),
            quality: Quality.auto,
            subtitles: jwplayerConfig.playlist[0].tracks != null ? jwplayerConfig.playlist[0].tracks.map((v: any) => ({
                lang: v.label,
                url: "https:" + v.file
            })) : []
        };
    }

    public async search(searchData: string): Promise<ISearchData> {
        const resp = await this.request.get<string>(new URL(`https://vumoo.to/search?t=2018BC65S4359XSMloz2HpQU2bXW4T_cTmTZFKx_zfeb1NAvH2OpqEK-aJloaWZL-xo426IMAVLtpWZ3SK1d==&q=${searchData}`), {headers: {"Referer": this.host, "User-Agent": "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0"}});
        const json = JSON.parse(JSON.stringify(resp));
        return {
            results: {
                standalone: json.suggestions.map((v: any) => {
                    const url = new URL(`${this.host.slice(0, this.host.length-1)}${v.data.href}`);
                    return {
                        type: StandaloneType.Movie,
                        name: v.value,
                        id: Buffer.from(url.pathname).toString('base64'),
                        thumbnail_url: v.data.image,
                        initRequired: true,
                        sources: [
                            {
                                url,
                                quality: Quality.auto
                            } as IVideoSource
                        ]
                    };
                }),
                multi: []
            }
        };
    }

    public async getData(url: URL): Promise<ParserDataResponse> {
        const resp = await this.request.get<string>(url, {headers: {"Referer": this.host, "User-Agent": "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0"}});
        const $ = cheerio.load(resp);

        const posters = $('.poster');
        if (posters.length <= 0) throw new Error("Unexpectedly could not grab data.");
        const titles = $('.film-box > h1');
        if (titles.length <= 0) throw new Error("Unexpectedly could not grab data.");
        const episodes = $('#server-1 > .episodes .play');
        if (episodes.length <= 0) throw new Error("Unexpectedly could not grab data.");
        
        const output: ParserDataResponse = {
            multi: true,
            data: {
                name: $(titles[0]).html()?.trim(),
                id: Buffer.from(url.pathname).toString('base64'),
                thumbnail_url: posters.attr('src'),
                data: []
            } as IMultiData
        };

        episodes.each((i, v) => {
            output.data.data.push({
                type: StandaloneType.Movie,
                name: $(v).html()?.trim() as string,
                index: i,
                sources: [{
                    url: new URL(v.attribs["embedurl"]),
                    quality: Quality.auto,
                    proxyRequired: true
                }]
            });
        });

        return output;
    }

}