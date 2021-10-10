import { Service } from "typedi";
import * as cheerio from "cheerio";
import { StandaloneType , SearchVideoData } from "@suke/suke-core/src/entities/SearchResult";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError"
import { createFormData } from "@suke/suke-util/dist";
import { IParser, ParserSearchOptions } from "../IParser";
import { AxiosRequest } from "@suke/requests/src/";

export enum KickAssAnimeServers {
    "PINK-BIRD",
    "SAPPHIRE-DUCK",
    "MAGENTA13",
    "A-KICKASSANIME",
    "THETA-ORIGINAL",
    "BETAPLAYER",
    "BETASERVER3",
    "BETA-SERVER"
}

export interface AnimeRawSearchResult {
    name : string,
    slug : string,
    image : string
}

export interface Mp4File {
    quality : string,
    link : string
}

@Service()
export class KickAssAnimeParser implements IParser {
    private getVideoPlayerUrlRegex = /"link1":"(.+)","link2"/
    private getBase64StrRegex = /Base64.decode\("(.+)"\)/
    private getVideoIdRegex = /\?id=([^&]*)/
    
    // An array of blacklisted external servers that are unable to retrieve MP4 files from.
    private blacklistedServers = ["SAPPHIRE-DUCK","DAILYMOTION"]

    name = "KickAssAnime"
    hostname = "https://www2.kickassanime.ro"

    constructor(
        public request : AxiosRequest
    ) {}
    
    private async getEmbedVideoPlayerUrl(url : string) : Promise<string> {
        const html = await this.request.get<string>(url)
        const videoPlayerUrl = this.getVideoPlayerUrlRegex.exec(html)
        
        if(!videoPlayerUrl) {
            throw new ParserError("Unable to parse video player url.")
        }

        // Remove the escaped charadters from the video url.
        return videoPlayerUrl[1].replace(/\\/g,"")
    }

    private async getIFrameSources(html : string) : Promise<string[]> { 
        const $ = cheerio.load(html)

        const sources = $("option[value]")
        .filter((_ , element) => !this.blacklistedServers.includes($(element).text()))
        .map((_ , element) => element.attribs.value)
        .toArray()

        return sources
    }

    private async getOldVideoPlayerMP4Files(html : string) : Promise<Mp4File[]> {
        const id = this.getVideoIdRegex.exec(html)
        
        if(!id) {
            throw new ParserError("Unable to parse video id from html.")
        }

        const url = `https://streamani.net/download?id=${id[1]}`
        const data = await this.request.get<string>(url)
        const $ = cheerio.load(data)

        return $('.dowload a:not([target])')
        .map((_ , element) => ({
            quality : $(element).text().split(" (")[1].split(" - ")[0], // troll
            link : element.attribs.href
        }))
        .toArray()
    }

    private async getNewVideoPlayerMP4Files(html : string) : Promise<Mp4File[]> {
        // Some external servers loads the content using JS.
        const base64Str = this.getBase64StrRegex.exec(html)

        if(base64Str) {
            html = Buffer.from(base64Str[1] , "base64").toString()
        }

        const $ = cheerio.load(html)
        
        return $("a[href]")
        .map((_ , element) => {
            const videoQuality = $(element).text().split(" ")

            return {
                quality : videoQuality.length === 3 ? videoQuality[1] : videoQuality[0],
                link : element.attribs.href
            }
        })
        .toArray()
    }

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<SearchVideoData[]> {
        if(options) {
            throw new Error("Options is disabled and not being used at the moment.")
        }

        const formData = createFormData({ keyword : searchTerm })

        const data = await this.request.post<Array<AnimeRawSearchResult>>(`${this.hostname}/api/anime_search` , {
            body : formData,
            headers : {
                "Content-Type" : `multipart/form-data; boundary=${formData.getBoundary()}`
            }
        })

        return data.map(({ name , image }) => ({
            type : name.toLowerCase().includes("movie") ? StandaloneType.Movie : StandaloneType.Video,
            thumbnail_url : `${this.hostname}/uploads/${image}`,
            name
        }))
    }

    public async getVideos(url : string) {
        const embedVideoPlayerUrl = await this.getEmbedVideoPlayerUrl(url)

        if(embedVideoPlayerUrl.includes("kaa-play.me")) {
            const videoPlayerHtml = await this.request.get<string>(embedVideoPlayerUrl)
            return await this.getOldVideoPlayerMP4Files(videoPlayerHtml)
        } else {
            const downloadUrl =  "https://beststremo.xyz/mobile2/player.php?link=" + embedVideoPlayerUrl.split("?link=")[1]
            const downloadHtml = await this.request.get<string>(downloadUrl)
            const iFrameSources = await this.getIFrameSources(downloadHtml)
            
            if(iFrameSources.length === 0) {
                return []
            }

            const externalServersHtml = await Promise.all(iFrameSources.map(async (link) => await this.request.get<string>(link)))
            const files = await Promise.all(externalServersHtml.map(async (html) => await this.getNewVideoPlayerMP4Files(html)))

            return files.reduce((previousVal , currentVal) => {
                if(currentVal.length > previousVal.length) {
                    previousVal = currentVal
                }

                return previousVal
            } , [])
        
        }
    }
}