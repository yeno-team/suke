import CryptoJS from "crypto-js";
import { Service } from "typedi";
import * as cheerio from "cheerio";
import { getRandomInt } from "@suke/suke-util/src/getRandomInt";
import { AxiosRequest } from "@suke/requests/src";
export interface GogoPlayerVideoSource {
    file : string;
    label : string;
    type : "mp4" | "hls";
}

export interface GogoPlayerVideoPlayerSourcesResponse {
    source : Array<GogoPlayerVideoSource>;
    "source_bk" : Array<GogoPlayerVideoSource>;
    tracking : Array<unknown>;
    advertising : Array<unknown>;
    linkiframe : string;
}

@Service()
export class GogoPlayApiWrapper {       
    private parseIFrameSrcRegex = /<iframe src="(.*?)"/m;

    constructor(private request : AxiosRequest) {}
    
    private f_random(int : number) : string {
        let str = ""

        while(int > 0) {
            int--
            str += getRandomInt(0,9)
        }

        return str
    }

    public async getVideoPlayerURL(url : URL) : Promise<URL> {
        const resp = await this.request.get<string>(url)
        const videoPlayerUrl = this.parseIFrameSrcRegex.exec(resp)

        if(!(videoPlayerUrl)) {
            throw new Error("Unable to parse src attribute from an iframe.")
        }

        return new URL(videoPlayerUrl[1])
    }

    /**
     * Translated from https://gogoplay.io/js/player2021.min.js?v=9.2
     * @param url - video player url
     * @returns {Promise} GogoPlayerVideoPlayerSourcesResponse
     */
    public async getSources(url : URL) : Promise<GogoPlayerVideoPlayerSourcesResponse> {
        const resp = await this.request.get<string>(url)
        const $ = cheerio.load(resp)

        // const scriptCrypto = $('script[data-name="crypto"]').get()[0].attribs['data-value']
        const metaCrypto = $('meta[name="crypto"]').get()[0].attribs['content']
        const ts = $('script[data-name="ts"]').get()[0].attribs['data-value']
    
        const longInt = "25746538592938396764662879833288"
        // const smthing = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(scriptCrypto , CryptoJS.enc.Utf8.parse(ts + '' + ts) , { iv : CryptoJS.enc.Utf8.parse(ts)}))
        
        const paramsWordArray = CryptoJS.AES.decrypt(metaCrypto , CryptoJS.enc.Utf8.parse(longInt) , { iv : CryptoJS.enc.Utf8.parse(ts) })
        const decryptedParams = new URLSearchParams(CryptoJS.enc.Utf8.stringify(paramsWordArray))
        const videoId = decryptedParams.keys().next().value
        const time = this.f_random(16)
        const encryptedVideoId = CryptoJS.AES.encrypt(videoId , CryptoJS.enc.Utf8.parse(longInt), { iv : CryptoJS.enc.Utf8.parse(time) }).toString()

        const params = new URLSearchParams({
            id : encryptedVideoId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            title : decryptedParams.get("amp;title")!,
            mip : "0.0.0.0",
            refer : "none",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ch : decryptedParams.get("ch")!,
            time : this.f_random(2) + time + this.f_random(2)
        })

        return await this.request.get<GogoPlayerVideoPlayerSourcesResponse>(new URL("https://gogoplay.io/encrypt-ajax.php?") , { headers : { "X-Requested-With" : "XMLHttpRequest"} , params })
    }
}