import { AxiosRequest } from "@suke/requests/src";
import { createFormData } from "@suke/suke-util/src";
import { Service } from "typedi";
import * as cheerio from "cheerio";
import hjson from "hjson";
import { KickAssAnimeApiSearchResponse, KickAssAnimeInfoResponse, KickAssAnimeServer, KickAssAnimeSourceFile } from "./types";
import { KickAssAnimeApiRawSearchResponse, KickAssAnimeInfoRawResponse } from ".";
import { QualityAsUnion } from "@suke/suke-core/src/entities/SearchResult";

@Service()
export class KickAssAnimeApiWrapper {
    // KickAssAnime Pink-Bird and Sapphire-Duck returned video quality in order.
    private sapAndPinkQualities = ["720p","1080p","480p","360p","240p"]

    constructor(
        private request : AxiosRequest
    ) {}
        
    private findAndDecodeBase64Str(data : string , min = 1200 , max = 2000) : string {
        const findB64StrRegex = new RegExp(`Base64\\.decode\\(\\"(.{${min}${(max) ? `,${max}`: ","}})\\"\\)`)
        const b64 = findB64StrRegex.exec(data)

        if(!b64) {
            return ""
        }

        return Buffer.from(b64[1] , "base64").toString()
    }

    /**
     * Get the source files from a server that is used by the old video player.
     * @example
     * getOldVideoPlayerSourceFiles(new URL("https://gogoplay1.com/streaming.php?id=NzAxMzY=&title=Rakudai+Kishi+no+Cavalry+Episode+12")
     * @param url 
     * @returns 
     */
    private async getOldVideoPlayerSourceFiles(url : URL) : Promise<Array<KickAssAnimeSourceFile>> {
        if(!(url.searchParams.has("id"))) {
            throw new Error("Couldn't find an id param in the url.")
        }

        const resp = await this.request.get<string>(new URL(`https://gogoplay1.com/download?id=${url.searchParams.get("id")}`))
        const $ = cheerio.load(resp)
        
        return $('.dowload a:not([target])')
        .map((_ , element) => ({
            quality : $(element).text().replace(/\n| /g,"") as QualityAsUnion, // Remove unncessary whitespace and a line break.
            url : new URL(element.attribs.href),
            type : "mp4"
        }))
        .toArray()
    }

    /**
     * Get the source files from a server that is used by the new video player.
     * @param url 
     * @returns
     */
    private async getNewVideoPlayerSourceFiles(url : URL) : Promise<Array<KickAssAnimeSourceFile>> {
        if(url.hostname.includes("dailymotion") || url.hostname.includes("maverickki")) {
            throw new Error("")
        }

        const resp = await this.request.get<string>(url)
        const htmlTag = this.findAndDecodeBase64Str(resp , 1000 , 5000)

        if(url.pathname.includes("Sapphire-Duck") || url.pathname.includes("Pink-Bird")) {
            const parseFileUrlFromTagRegex = new RegExp(/(?:src=|file: )"([^"]+)"/)

            let m3u8FileUrl

            if((m3u8FileUrl = parseFileUrlFromTagRegex.exec(htmlTag)) === null) {
                throw new Error("Unable to parse url from source tag.")
            }

            const fileContent = await (await this.request.get<string>(new URL(m3u8FileUrl[1]))).split("\n")
            const sourceFileUrls = []

            for(let i = 2; i <= fileContent.length - 2; i += 2) {
                sourceFileUrls.push({
                    quality : this.sapAndPinkQualities[Math.floor(i / 2) - 1] as QualityAsUnion,
                    url : new URL(fileContent[i]),
                    type : "m3u8"
                })
            }

            return sourceFileUrls
        }

        const parseSourcesArrayRegex = new RegExp(/\[.+]/)
        let unsanitizedSourcesArr;
    
        if((unsanitizedSourcesArr = parseSourcesArrayRegex.exec(htmlTag || resp)) === null) {
            throw new Error("Unable to parse sources array.")
        }

        const sanitizedSourcesArr : Array<{ file : string , label : string , type : string }> = hjson.parse(unsanitizedSourcesArr[0])

        return sanitizedSourcesArr
        .filter(({ file }) => file.length !== 0)
        .map(({ file , type , label }) => ({
            url : new URL(file),
            quality : label as QualityAsUnion,
            type
        }))
    }

    /**
     * Get the url of the embedded video player.
     * @example
     * getVideoPlayerUrl(new URL("https://www2.kickassanime.ro/anime/komi-cant-communicate-178143/episode-08-763299"))
     * @param url 
     * @returns {Promise<URL>}
     */
    public async getVideoPlayerUrl(url : URL) : Promise<URL> {
        const resp = await this.request.get<string>(url)
        const getVideoPlayerUrlRegex = new RegExp(/"(https:(?:\\\/)*beststremo\.com(?:\\\/)*(?:dust|axplayer).+?)"/)
        // const getVideoPlayerUrlRegex2 = new RegExp(/"\"ext_servers\":(\[{\"name\":\".*?\",\"link\":\".*?"}\])"/)

        let videoPlayerUrl

        if((videoPlayerUrl = getVideoPlayerUrlRegex.exec(resp)) === null) {
            throw new Error("Unable to parse video player url.")
        } 

        videoPlayerUrl = new URL(videoPlayerUrl[1])

        if(videoPlayerUrl.searchParams.has("data")) {
            const newVideoPlayerUrl = videoPlayerUrl.searchParams.get("data") as string

            // Sometimes the data parameter doesn't return a valid url.
            if(!(newVideoPlayerUrl.startsWith("https://"))) {
                return new URL("https:" + newVideoPlayerUrl) 
            }

            return new URL(newVideoPlayerUrl)
        }

        return videoPlayerUrl
    }
        
    /**
     * Search for a query on KickAssAnime.
     * @param query 
     * @returns {Promise<KickAssAnimeApiSearchResponse>}
     */
    public async search(query : string) : Promise<KickAssAnimeApiSearchResponse> {
        const apiUrl = new URL("https://www2.kickassanime.ro/api/anime_search")
        const formData = createFormData({
            keyword : query
        })

        const res = await this.request.post<KickAssAnimeApiRawSearchResponse>(apiUrl , {
            body : formData,
            headers : {
                "Content-Type" : `multipart/form-data; boundary=${formData.getBoundary()}`
            }
        })
        
        return res.map(({ image , slug , name }) => (
            {
                name , 
                imageUrl : this.getImageUrl(image),
                url : this.preappendHostname(slug)
            }
        ))
    }

    /**
     * Get information about an anime.
     * @param {url} 
     * @returns {Promise<KickAssAnimeInfoResponse>}
     */
    public async getAnimeInfo(url : URL) : Promise<KickAssAnimeInfoResponse> {
        const parseInfoRegex = new RegExp("\"anime\":(.+),\"wkl\"")
        const res = await this.request.get<string>(url)
        
        let result

        if((result = parseInfoRegex.exec(res)) === null) {
            throw new Error("Unable to parse information from the URL.")
        }

        const data : KickAssAnimeInfoRawResponse = hjson.parse(result[1])

        return {
            ...data,
            episodes : data.episodes.map(({ num , name , slug , createddate }) => ({ num , name , url : this.preappendHostname(slug) , createddate })),
            image : this.getImageUrl(data.image),
            url : this.preappendHostname(data.slug)
        }
    }  

    /**
     * Get the list of servers that host source files for an anime.
     * @param {url}
     * @returns 
     */    
    public async getExternalServers(url : URL) : Promise<Array<KickAssAnimeServer>> {
        const resp = await this.request.get<string>(url)
        const parseListOfServersRegex = new RegExp(/sources = (.+);/)
        let result

        if(url.searchParams.has("id")) {
            const $ = cheerio.load(resp)
            
            // Removes the current active server from the arr because the data attributes is set to an empty string.
            $(".active.linkserver").remove()

            return $(".linkserver")
            .map((_ , element) => ({
                name : $(element).text(),
                src : new URL(element.attribs["data-video"])
            }))
            .toArray()
        } else if((result = parseListOfServersRegex.exec(resp)) !== null) {
            result = hjson.parse(result[1]) as Array<{ name : string , src : string }>

            return result.map(({ name , src }) => ({
                name,
                src : new URL(
                    (name === "BETASERVER3" || name === "BETA-SERVER" || name === "PINK-BIRD" || name === "SAPPHIRE-DUCK") ? 
                    src.replace("player","pref") : src
                )
            }))

        }

        throw new Error("Unable to parse the list of servers.")
    }

    /**
     * Get the episode video source files.
     * @param url 
     * @returns 
     */
    public async getVideoSourcesFiles(url : URL) : Promise<Array<KickAssAnimeSourceFile>> {
        if(url.hostname.includes("gogoplay1")) {
            return this.getOldVideoPlayerSourceFiles(url)
        }

        return this.getNewVideoPlayerSourceFiles(url)
    }

    public preappendHostname(str : string) : URL {
        return new URL("https://www2.kickassanime.ro" + str)
    }

    public getImageUrl(str : string) : URL {
        return new URL("https://www2.kickassanime.ro/uploads/" + str)
    }
}