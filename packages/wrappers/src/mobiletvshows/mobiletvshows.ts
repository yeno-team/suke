import { Service } from "typedi";
import * as cheerio from "cheerio";
import { AxiosRequest } from "@suke/requests/src";
import { IMultiData, IMultiStandaloneData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { FzMovie } from "../fzmovies";
import { RequestOptions } from "@suke/requests/src/IRequest";

export type MobileTVShow = {
    name: string,
    posterUrl: URL,
    url: URL
}

@Service()
export class MobileTvShowsWrapper {
    private host = "https://www.tvseries.in/";
    private requestConfig: RequestOptions = {CORS: true, cookies: true};

    constructor(
        private request : AxiosRequest
    ) {}

    // public async getData(url: URL, season: number,  episodeNumber: number): Promise<MobileTvShow> {
    //     const resp = await this.request.get<string>(new URL(url.protocol + ("www." + url.hostname.replace(/www\./, "") + url.pathname + url.search)), this.requestConfig);
    //     const $  = cheerio.load(resp);


    // }

    public async getSources(url: URL): Promise<IVideoSource[]> {
        const download1Url = await this.request.get<string>(new URL(url.protocol + ("www." + url.hostname.replace(/www\./, "") + url.pathname + url.search)), this.requestConfig);
        const $ = cheerio.load(download1Url);

        let downloadlink = $('#dlink1');
        const betterdownloadlink = $('#dlink4');
        if (betterdownloadlink.length > 0) {
            downloadlink = betterdownloadlink;
        }
        
        if (downloadlink.length <= 0) {
            throw new Error("Could not grab source.");
        } 

        const download1PageUrl = downloadlink[0].attribs['href'];
        const downloadPageSource = await this.request.get<string>(new URL(this.host + download1PageUrl), this.requestConfig);
        const sources = await this.extractSources(downloadPageSource);

        return [ 
            ...sources.map(v => ({
                url: v,
                quality: Quality.auto,
                proxyRequired: true
            }))
        ];
    } 

    public async search(searchTerm: string, pageNumber = 1): Promise<IMultiData[]> {
        const resp = await this.request.post<string>(new URL(this.host + `search.php?search=${searchTerm}&by=series&beginSearch=search&pg=${pageNumber}`), this.requestConfig);
        let $ = cheerio.load(resp);
        const results: IMultiData[] = [];
        
        const anchorElements = $('.mainbox > table a');
        const images = $('.mainbox > table img');
        const bElements = $('.mainbox > table a > small > b');
        const showData: FzMovie[] = [];

        images.each((i, el) => {
            showData.push({
                url: new URL(this.host + anchorElements[i].attribs['href']),
                name: $(bElements[i]).html()?.trim() as string,
                posterUrl: new URL(this.host + el.attribs['src'])
            });
        });

        for (const s of showData) {
            const showPage = await this.request.get<string>(s.url);
            $ = cheerio.load(showPage);
            const seasonElements = $('.mainbox3 > a');

            for (const el of seasonElements) {
                const seasonPageUrl = el.attribs['href'];
                if (seasonPageUrl != null) {
                    results.push({
                        id: btoa(el.attribs['href'].slice(6)),
                        thumbnail_url: s.posterUrl.toString(),
                        name: s.name + " - " + $(el).text().trim(),
                        data: await this.extractSeasonData(new URL(this.host + seasonPageUrl))
                    });
                }
            }
        }
 
        return results;
    }

    private async extractSeasonData(seasonPageUrl: URL): Promise<IMultiStandaloneData[]> {
        const pageSource = await this.request.get<string>(seasonPageUrl);
        const $ = cheerio.load(pageSource);
        const anchorElements = $('.mainbox > table a');
        const images = $('.mainbox > table img');
        const bElements = $('.mainbox > table td span small b');
        const episodeData: FzMovie[] = [];

        images.each((i, el) => {
            episodeData.push({
                url: new URL(this.host + anchorElements[i].attribs['href']),
                name: $(bElements[i]).html()?.trim() as string,
                posterUrl: new URL(this.host + el.attribs['src'])
            });
        });


        let i = 0;
        return [
            ...episodeData.map(v => {
                i++;
                return {
                    type: StandaloneType.Movie, 
                    name: v.name, 
                    sources: [{url: v.url, quality: Quality.auto}], 
                    index: i
                };
            })
        ];

    }

    private async extractSources(downloadPageSource: string): Promise<URL[]> {
        let $ = cheerio.load(downloadPageSource);
        let i=1;
        let curr = $('#flink'+i);
        const sources: URL[] = [];
   
        while (curr.length > 0) {
            const hrefVal = curr.attr('href');
            
            if (hrefVal != null) {
                const dlinkPage = await this.request.get<string>(new URL(this.host + hrefVal), this.requestConfig);
                $ = cheerio.load(dlinkPage);
                const source = $('input[name=download1]').attr('value');
                if (source) {
                    sources.push(new URL(source));
                }
            }
            i++;
            curr = $('flink'+i);
        }

        return sources;
    }
}