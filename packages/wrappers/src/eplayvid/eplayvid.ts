import { AxiosRequest } from "@suke/requests/src";
import { IVideoSource, Quality } from "@suke/suke-core/src/entities/SearchResult";
import { Service } from "typedi";
import * as cheerio from 'cheerio';

@Service()
export class EPlayVidWrapper {
    private host = "https://www.eplayvid.net/";
    
    constructor(
        private request: AxiosRequest
    ) {}
    
    public async getSource(url: URL): Promise<IVideoSource> {
        const resp = await this.request.get<string>(url);
        const $ = cheerio.load(resp);
        const sources = $('source');
        if (sources.length <= 0) {
            throw new Error("Unexpected Source Error, Is the URL correct?");
        }

        const subtitles:  {lang: string, url: URL}[] = [];
        const tracks = $('track');
        if (tracks.length > 0) {
            tracks.each((i, el) =>  {
                subtitles.push({
                    lang: el.attribs["label"],
                    url: new URL(el.attribs["src"])
                }); 
            });
        }
        
        return {
            url: new URL(sources[0].attribs['src']),
            quality: Quality.auto,
            proxyRequired: true,
            subtitles,
            referer: this.host
        };
    }

}