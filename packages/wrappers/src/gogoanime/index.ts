import Container, { Service } from "typedi";
import * as cheerio from "cheerio";
import { AxiosRequest } from "@suke/requests/src";
import { GogoPlayApiWrapper } from "@suke/wrappers/src/gogoplay";

export interface GogoAnimeSearchResponse {
    content : string;
}

@Service()
export class GogoAnimeApiWrapper {
    constructor(
        private request : AxiosRequest,
        private gogoPlayApiWrapper : GogoPlayApiWrapper
    ) {}

    public async search(keyword : string) : Promise<any> {
        const resp = await this.request.get<GogoAnimeSearchResponse>(new URL(`https://ww2.gogoanimes.org/ajaxsite/loadAjaxSearch?keyword=${keyword}&id=-1&link_web=https://ww2.gogoanimes.org/`))
        const $ = cheerio.load(resp.content)
        
        const results = $('a[class="ss-title"]').toArray()
        const data = []

        for(let i = 0; i < results.length ; i++) {
            const result = $(results[i])
            
            // Image url is stored in inline css backgroundUrl property.
            const divStyleAttr = result.children().first().attr("style")

            const name = result.text().trim()
            const imageUrl = divStyleAttr?.substring(divStyleAttr.indexOf('https'), divStyleAttr.indexOf('")'))

            data.push({
                name,
                imageUrl : imageUrl ? new URL(imageUrl) : null
            })
        }


        return data
    }
}

Container.get(GogoAnimeApiWrapper).search("naruto")