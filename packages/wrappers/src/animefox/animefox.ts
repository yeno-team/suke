import { Service } from "typedi";
import { AxiosRequest } from "@suke/requests/src";
import { IMultiData, ISearchData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { load } from "cheerio";
import { ParserDataResponse } from "@suke/suke-core/src/entities/Parser";
import { VM } from "vm2";

@Service()
export class AnimeFoxWrapper {
    private host = "https://animefox.sbs";

    constructor(private request : AxiosRequest) {}

    public async search(searchTerm: string, page = 1): Promise<ISearchData> {
        const resp = await this.request.get<string>(new URL(`/search?keyword=${searchTerm}&page=${Math.max(page, 1)}`, this.host));
        const $ = load(resp);
        const result: ISearchData = {
            results: {
                multi: [],
                standalone: []
            }
        };
        
        const posters = $('.flw-item .film-poster img');
        if (posters.length <= 0) return result;
        const links = $('.flw-item .film-poster a');
        if (links.length <= 0)  return result;
        const titles = $('.flw-item .film-name > a');
        if (titles.length <= 0) return result;
        const pages = $('.pagination li');
        if (pages.length <= 0) return result;

    
        if (page < pages.length) {
            result.nextPageToken = Buffer.from((page + 1).toString()).toString('base64');
        }

        posters.each((i, img) => {
            result.results.standalone.push({
                id: Buffer.from(links[i].attribs["href"]).toString('base64'),
                type: StandaloneType.Movie,
                name: $(titles[i]).attr('title') as string,
                thumbnail_url: img.attribs['src'],
                initRequired: true,
                sources: [
                    {
                        url: new URL(links[i].attribs["href"], this.host),
                        quality: Quality.auto
                    }
                ]
            });
        });

        return result;
    }

    public async getData(url: URL): Promise<ParserDataResponse> {
        const resp = await this.request.get<string>(url);
        let $ = load(resp);
        const posterUrl = $('.film-poster-img').attr('data-src');
        const title = $(".film-name").html()?.trim() as string;
        const watchLink = $(".btn-play").attr('href');

        const watchResp = await this.request.get<string>(new URL(watchLink as string, this.host));
        $ = load(watchResp);
        const episodes = $('.ep-item');
        
        const data: ParserDataResponse = {
            multi: true,
            data: {
                name: title,
                id: Buffer.from(url.pathname).toString('base64'),
                thumbnail_url: posterUrl,
                data: []
            } as IMultiData
        };

        episodes.each((i, el) => {
            data.data.data.push({
                type: StandaloneType.Movie,
                name: el.attribs["title"],
                index: parseInt(el.attribs["id"]),
                sources: [{
                    url: new URL(el.attribs["href"], this.host),
                    quality: Quality.auto
                }]
            });
        });
        
        return data;
    }

    public async getSource(url: URL): Promise<IVideoSource> {
        const resp = await this.request.get<string>(url);
        let $ = load(resp);
        const playerLinkUrl = new URL($('#iframe-to-load').attr('src') as string);
        const serverLink = new URL("https://mplayer.sbs/server2.php?id=" + playerLinkUrl.searchParams.get('id'));
        const serverResp = await this.request.get<string>(serverLink);
        
        const matches = serverResp.match(/eval\((.*)\)/gm);

        if (matches == null || matches.length <= 0) {
            throw new Error("Unknown Error Occured");
        }

        const evalOutput = new VM().run("jwplayer=function(){return {setup: (v) => v}};" + matches[0]);

        const link = !evalOutput.file.startsWith("https:") && !evalOutput.file.startsWith("http:") ? new URL(evalOutput.file, "https://mplayer.sbs") : new URL(evalOutput.file);
        return {
            url: link,
            quality: Quality.auto,
            proxyRequired: true
        };
    }
}