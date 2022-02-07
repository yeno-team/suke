import { Service } from "typedi";
import * as cheerio from "cheerio";
import { AxiosRequest } from "@suke/requests/src";
import { GogoPlayApiWrapper } from "@suke/wrappers/src/gogoplay";
import { GogoAnimeEpisode, GogoAnimeInfoResponse, GogoAnimeSearchResponse, GogoAnimeSearchResult } from "./types";
import { IVideoSource , Quality , QualityAsUnion } from "@suke/suke-core/src/entities/SearchResult";

export interface GogoAnimeSource extends IVideoSource {
    type : "mp4"
}
@Service()
export class GogoAnimeApiWrapper {
    constructor(
        private request : AxiosRequest,
        private gogoPlayApiWrapper : GogoPlayApiWrapper
    ) {}

    public async search(keyword : string) : Promise<Array<GogoAnimeSearchResult>> {
        const resp = await this.request.get<GogoAnimeSearchResponse>(new URL(`https://ww2.gogoanimes.org/ajaxsite/loadAjaxSearch?keyword=${keyword}&id=-1&link_web=https://ww2.gogoanimes.org/`));
        const $ = cheerio.load(resp.content);
        
        const results = $('a[class="ss-title"]').toArray();
        const data : Array<GogoAnimeSearchResult>= [];

        for(let i = 0; i < results.length ; i++) {
            const result = $(results[i]);
        
            // Image url is stored in inline css backgroundUrl property.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const divStyleAttr = result.children().first().attr("style")!;
            
            const name = result.text().trim();
            
            const imageUrl = divStyleAttr?.substring(divStyleAttr.indexOf('https'), divStyleAttr.indexOf('")'));
            data.push({
                name,
                url : new URL(`https://ww2.gogoanimes.org${result.attr("href")}`),
                imageUrl : new URL(imageUrl)
            });
        }


        return data;
    }

    public async getEpisodesList(url : URL) : Promise<Array<GogoAnimeEpisode>> {
        const params = new URLSearchParams({
            "ep_start" : '0',
            "ep_end" : '',
            id : '0',
            "default_ep" : "",
            alias : url.pathname
        });

        const resp = await this.request.get<string>(new URL("https://ww2.gogoanimes.org/ajaxajax/load-list-episode") , { params });
        const $ = cheerio.load(resp);

        const data = [];
        const episodes = $("li").toArray();

        for(let i = 0; i < episodes.length; i++) {
            const episode = $(episodes[i]);
            const aTag = episode.find("a");
            const epNum = aTag.find('div[class="name"]').text().trim().split(" ")[1];
            const type = aTag.find('div[class="cate"]').text().trim();
            const href = aTag.attr("href")?.trim();

            data.push({
                url : new URL(`https://ww2.gogoanimes.org${href}`),
                epNum,
                type,
            });
        }

        return data;
    }

    public async getAnimeInfo(url : URL) : Promise<GogoAnimeInfoResponse> {
        const resp = await this.request.get<string>(url);
        const $ = cheerio.load(resp);
        const data : Record<string , string> = {};

        const body = $('div[class="anime_info_body_bg"]');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const imageUrl = body.find("img").attr("src")!;
        const title = body.find("h1").text();

        body.find('p[class="type"]').each((index , element) => {
            const ele = $(element);
            const typeData = ele.text().trim().split(":");
            
            data[typeData[0].toLowerCase()] = typeData[1].trim();
        });

        return {
            title,
            imageUrl : new URL(imageUrl),
            type : data["type"],
            genres : body.find("a[title]").toArray().map((element) => $(element).text()),
            summary : data["plot summary"],
            released : data["released"],
            status : data["status"],
            alias : data["other name"].split(";").map((val => val.trim())),
            episodes : await this.getEpisodesList(url)
        };
    }   

    public async getSources(url : URL) : Promise<Array<GogoAnimeSource>> {
        const videoPlayerUrl = await this.gogoPlayApiWrapper.getVideoPlayerURL(url);
        const { source : sources } = await this.gogoPlayApiWrapper.getSources(videoPlayerUrl);
        const data : Array<GogoAnimeSource> = [];

        for(let i = 0; i < sources.length; i++) {
            const { file , label , type } = sources[i];

            if(type === "hls") {
                continue;
            }

            data.push({
                url : new URL(file),
                quality : Quality[label.toLowerCase().split(" ").join("") as QualityAsUnion],
                type,
                proxyRequired: true
            });
        }

        return data;
    }
}