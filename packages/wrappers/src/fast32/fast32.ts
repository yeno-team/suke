import { AxiosRequest } from "@suke/requests/src";
import { ISearchData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { Service } from "typedi";
import { EPlayVidWrapper } from "../eplayvid/eplayvid";
import * as cheerio from 'cheerio';

@Service()
export class Fast32Wrapper {
    private host = "https://www.fast32.com/";
    
    constructor(
        private request: AxiosRequest,
        private eplayvidWrapper: EPlayVidWrapper
    ) {}
    
    public async getSources(url: URL): Promise<IVideoSource[]> {
        const EvidServerLink = await this.getServerLink(url);
        return [
            await this.eplayvidWrapper.getSource(new URL(EvidServerLink))
        ];
    }

    public async search(searchTerm: string, pageNumber = 1): Promise<ISearchData> {
        const resp = await this.request.get<string>(new URL(`https://fast32.com/search-movies/${Math.max(1, pageNumber) == 1 ? searchTerm + ".html" : searchTerm + `/page-${pageNumber}.html`}`));
        const $ = cheerio.load(resp);

        const resultLinks = $('.listItem .item-flip > a');
        const resultPosters = $('.listItem .item-flip img');
        const resultTitles = $('.listItem .title > a');
        const searchData: ISearchData = {
            results: {
                standalone: [],
                multi: []
            },
            nextPageToken: Buffer.from(String(pageNumber+1)).toString('base64'),
            prevPageToken: pageNumber > 1 ? Buffer.from(String(pageNumber-1)).toString('base64') : ''
        };
  
        resultLinks.each((i, el) => {
            const link = new URL(el.attribs['href']);
            const posterUrl = new URL($(resultPosters[i]).attr('src') as string);
            const name = $(resultTitles[i]).html()?.trim() as string;

            searchData.results.standalone.push({
                type: StandaloneType.Movie,
                name,
                id: Buffer.from(link.pathname).toString('base64'),
                thumbnail_url: posterUrl.toString(),
                sources: [{
                    url: link,
                    quality: Quality.auto
                }],
                initRequired: true
            });
        });

        return searchData;
    }

    public async getData(url: URL): Promise<{name: string, posterUrl: URL}> {
        const resp = await this.request.get<string>(url);
        const $ = cheerio.load(resp);
        const posterUrl = new URL($('.poster > img').attr('src') as string);
        const name = $('.about > h1').html()?.trim() as string;

        return { name, posterUrl};
    }

    public async tryGetEpisodes(url: URL): Promise<URL[]> {
        const resp = await this.request.get<string>(url);
        const $ = cheerio.load(resp);

        const episodes = $('.episode_series_link');

        if (episodes == null || episodes.length <= 0) return [];

        const output: URL[] = [];

        episodes.each((i, v) => {
            output.push(new URL(v.attribs['href']));
        });

        return output;
    }

    public async getServerLink(url: URL): Promise<string> {
        const resp = await this.request.get<string>(url);
        const b64Regex = /document\.write\(Base64\.decode\("(.*)"/;

        const matches = resp.match(b64Regex);
        if (matches == null || matches.length <= 0) {
            throw new Error("Unexpected Parsing Error, Is the URL correct?");
        }

        const iframeSrc = Buffer.from(matches[1], 'base64').toString('ascii').split("src")[1].split('"')[1];

        if (!iframeSrc) {
            throw new Error("Unexpected Parsing Error.");
        }

        return iframeSrc;
    }

}