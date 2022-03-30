import { Service } from "typedi";
import * as cheerio from "cheerio";
import { AxiosRequest } from "@suke/requests/src";
import { IVideoSource, Quality } from "@suke/suke-core/src/entities/SearchResult";
import { RequestOptions } from "@suke/requests/src/IRequest";
export type FzMovie = {
    name: string,
    posterUrl: URL,
    url: URL
}

@Service()
export class FzMoviesWrapper {
    private host = "https://www.fzmovies.net/";
    private requestOptions: RequestOptions = { CORS: true }
    constructor(
        private request : AxiosRequest
    ) {}

    public async getData(url: URL): Promise<FzMovie | undefined> {
        const resp = await this.request.get<string>(new URL(url.protocol + ("www." + url.hostname.replace(/www\./, "") + url.pathname + url.search)), this.requestOptions);
        const $ = cheerio.load(resp);

        const data: FzMovie = {} as FzMovie;
        const titleEle = $('.moviename > span');
        if (titleEle.length > 0) {
            data.name = $(titleEle[0]).html()?.trim() as string;
        }

        const images = $('.moviedesc img');
        if (images.length > 0) {
            data.posterUrl = new URL($(images[0]).attr('src')?.trim() as string, this.host);
        }

        data.url = url;

        return data;
    }

    public async getSources(url: URL): Promise<IVideoSource[]> {
        const download1Url = await this.request.get<string>(new URL(url.protocol + ("www." + url.hostname.replace(/www\./, "") + url.pathname + url.search)), this.requestOptions);
        const $ = cheerio.load(download1Url);
    
        const downloadoptionslink2 = $('#downloadoptionslink2');
 
        if (downloadoptionslink2.length <= 0) {
            throw new Error("Could not grab source.");
        } 

        const output: IVideoSource[] = [];


        for (let i = 0;i<downloadoptionslink2.length;i++) {
            const el = downloadoptionslink2[i];
            if (el.name != 'a') continue; 
            const download1PageUrl = el.attribs['href'];
            // const download1PageUrl = /window\.location\.href="(.*)";/g.exec(downloadoptionslink2.attr('onclick') as string);
            if (download1PageUrl == null) throw new Error("Unexpected parse error.");

            const download1PageSource = await this.request.get<string>(new URL(this.host + download1PageUrl), this.requestOptions);
            const downloadPage = await this.getDownloadPage(download1PageSource);

            const sources = await this.extractSources(downloadPage);

            output.push(...sources.map(v => ({url: v,quality: i == 0 ? Quality["480p"] : Quality["720p"], proxyRequired: true}) as IVideoSource));
        }

        return output;
    } 

    public async search(searchTerm: string, pageNumber = 1): Promise<FzMovie[]> {
        const resp = await this.request.post<string>(new URL(this.host + `csearch.php?searchname=${searchTerm}&searchBy=name&category=all&pg=${pageNumber}`));
        const $ = cheerio.load(resp);
        const results: FzMovie[] = [];

        const anchorElements = $('.mainbox > table td > a');
        const images = $('.mainbox > table img');
        const bElements = $('.mainbox > table a > small > b');
        images.each((i, el) => {
            results.push({
                url: new URL(this.host + anchorElements[i].attribs['href']),
                name: $(bElements[i]).html()?.trim() as string,
                posterUrl: new URL(this.host + el.attribs['src'])
            });
            i++;
        });
        
        return results;
    }

    private async getDownloadPage(download1PageSource: string): Promise<string> {
        const $ = cheerio.load(download1PageSource);

        const downloadlinkElements = $('#downloadlink');
        
        if (downloadlinkElements.length <= 0) {
            throw new Error("Could not get download link.");
        }

        const downloadPageParams = downloadlinkElements.attr('href');

        return this.request.get<string>(new URL(this.host + downloadPageParams), this.requestOptions);
    }

    private async extractSources(downloadPage: string): Promise<URL[]> {
        let $ = cheerio.load(downloadPage);
        let i=0;
        let curr = $('#dlink'+i);
        const sources: URL[] = [];

        while (curr.length > 0) {
            const hrefVal = curr.attr('href');
            if (hrefVal != null) {
                const dlinkPage = await this.request.get<string>(new URL(this.host + hrefVal), this.requestOptions);
                $ = cheerio.load(dlinkPage);
                const source = $('input[name=download1]').attr('value');
                if (source) {
                    sources.push(new URL(source));
                }
            }
            i++;
            curr = $('dlink'+i);
        }

        return sources;
    }
}