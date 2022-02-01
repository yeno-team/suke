import { Service } from "typedi";
import * as cheerio from "cheerio";
import { AxiosRequest } from "@suke/requests/src";
import { IVideoSource, Quality } from "@suke/suke-core/src/entities/SearchResult";

export type FzMovie = {
    name: string,
    posterUrl: URL,
    url: URL
}

@Service()
export class FzMoviesWrapper {
    private host = "https://fzmovies.net/";
    constructor(
        private request : AxiosRequest
    ) {}

    public async getSources(url: URL): Promise<IVideoSource[]> {
        const download1Url = await this.request.get<string>(url, {CORS: true});
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

            const download1PageSource = await this.request.get<string>(new URL("https://fzmovies.net/" + download1PageUrl), {CORS: true});
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

        const anchorElements = $('.mainbox > table a');
        const images = $('.mainbox > table img');
        const bElements = $('.mainbox > table a > small > b');
        
        images.each((i, el) => {
            results.push({
                url: new URL(this.host + anchorElements[i].attribs['href']),
                name: $(bElements[i]).html()?.trim() as string,
                posterUrl: new URL(this.host + el.attribs['src'])
            });
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

        return this.request.get<string>(new URL(this.host + downloadPageParams));
    }

    private async extractSources(downloadPage: string): Promise<URL[]> {
        let $ = cheerio.load(downloadPage);
        let i=0;
        let curr = $('#dlink'+i);
        const sources: URL[] = [];

        while (curr.length > 0) {
            const hrefVal = curr.attr('href');
            if (hrefVal != null) {
                const dlinkPage = await this.request.get<string>(new URL(this.host + hrefVal));
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