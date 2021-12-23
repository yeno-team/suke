import { AxiosRequest } from "@suke/requests/src/";
import { Service } from "typedi";
import { BetterTTVEmoteOpts , BetterTTVEmoteApiResponse , BetterTTVEmoteResponse } from "./types";

@Service()
export class BetterTTVApiWrapper {
    constructor(
        private request : AxiosRequest
    ) {}

    private getEmotePageUrl(opts : BetterTTVEmoteOpts) : URL {
        let url : URL;
        
        switch(opts.type) {
            case "global":
                url = new URL("https://api.betterttv.net/3/cached/emotes/global")
                break
            case "top":
            case "trending":
                url = new URL(`https://api.betterttv.net/3/emotes/shared/${opts.type}`)

                if(opts.offset) {
                    url.searchParams.append("offset" , opts.offset.toString())
                }

                break
            default:
                url = new URL("https://api.betterttv.net/3/emotes/shared")

                if(opts.before) {
                    url.searchParams.append("before" , opts.before)
                }
        }   

        if(opts.limit) {
            url.searchParams.append("limit" , opts.limit.toString())
        }

        return url;
    }

    private getEmoteImageUrl(id : string , size : "1x" | "2x" | "3x") : URL {
        return new URL(`https://cdn.betterttv.net/emote/${id}/${size}`)
    }

    public async getEmotes(opts : BetterTTVEmoteOpts) : Promise<BetterTTVEmoteResponse> {
        const url = this.getEmotePageUrl(opts)
        const resp = await this.request.get<BetterTTVEmoteApiResponse>(url)
        
        return resp.map(({ id, imageType }) => ({
            url : this.getEmoteImageUrl(id , opts.size ?? "3x"),
            type : imageType
        }))
    }
}