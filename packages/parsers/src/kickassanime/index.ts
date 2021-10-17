import { Service } from "typedi";
import * as cheerio from "cheerio";
import hjson from "hjson";
import { StandaloneType , SearchVideoData } from "@suke/suke-core/src/entities/SearchResult";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError"
import { createFormData } from "@suke/suke-util/dist";
import { IParser, ParserSearchOptions } from "../IParser";
import { AxiosRequest } from "@suke/requests/src/";

export type KickAssAnimeVideoServer = "SAPPHIRE-DUCK" | "PINK-BIRD" | "BETASERVER3" | "BETA-SERVER" | "A-KICKASSANIME" | "THETA-ORIGINAL"

export interface AnimeRawSearchResult {
    name : string,
    slug : string,
    image : string
}

export interface VideoFile {
    quality : string,
    link : string
}

export interface VideoServer {
    name : KickAssAnimeVideoServer,
    src : string,
    rawSrc? : string
}

@Service()
export class KickAssAnimeParser implements IParser {
    private getVideoPlayerUrlRegex = /"link1":"(.+)","link2"/
    private getVideoServersRegex = /sources = (.+);/
    private getSourceFilesRegex = /(?:src=|file: )"([^"]+)"/
    private getBase64StrRegex = /Base64.decode\("(.{1200,})"\)/
    private getVideoIdRegex = /\?id=([^&]*)/
    private getOldVideoPlayerRedirectUrl = /window.location = '(.+)'/

    // An array of excluded servers that shouldn't be dealt with.
    private excludedServers = ["DAILYMOTION"]

    name = "KickAssAnime"
    hostname = "https://www2.kickassanime.ro"

    constructor(
        public request : AxiosRequest
    ) {}
    
    private findAndDecodeBase64(html : string) : string {
        const base64 = this.getBase64StrRegex.exec(html)

        if(!base64) {
            throw new ParserError("Unable to find base64 string.")
        }

        return Buffer.from(base64[1] , "base64").toString()
    }

    private async getEmbedVideoPlayerUrl(url : string) : Promise<string> {
        const html = await this.request.get<string>(url)
        const videoPlayerUrl = this.getVideoPlayerUrlRegex.exec(html)
        
        if(!videoPlayerUrl) {
            throw new ParserError("Unable to parse video player url.")
        }

        // Remove the escaped charadters from the video url.
        return videoPlayerUrl[1].replace(/\\/g,"")
    }

    private async getServerList(html : string) : Promise<Array<VideoServer>> { 
        let servers : Array<VideoServer> = []
        
        // Videos that utilizes the new video player have the servers stored inside an array.
        if(this.getVideoServersRegex.test(html)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            servers = hjson.parse(this.getVideoServersRegex.exec(html)![1])
        } else if(this.getOldVideoPlayerRedirectUrl.test(html)) {
            // The old video player has to be clicked on to be redirected to a different page where the servers are.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const url = this.getOldVideoPlayerRedirectUrl.exec(html)![1]
            const videoPlayerHtml = await this.request.get<string>(url)
            
            const $ = cheerio.load(videoPlayerHtml)
            servers = $("li.linkserver")
            .map((_ , element) => ({
                name : $(element).text() as KickAssAnimeVideoServer,
                src : element.attribs["data-video"]
            }))
            .toArray()
        }
        
        return servers
        .filter(({ name }) => !this.excludedServers.includes(name.toUpperCase()))
        .map(({ name , src }) => ({
            name,
            // Replacing player with pref for these servers allows us to skip an additional request when fetching the video files.
            src : (name === "BETASERVER3" || name === "BETA-SERVER" || name === "PINK-BIRD" || name === "SAPPHIRE-DUCK") ? 
            src.replace("player","pref") : src
        }))
    }

    private async getOldVideoPlayerMP4Files(html : string) : Promise<VideoFile[]> {
        const id = this.getVideoIdRegex.exec(html)

        if(!id) {
            throw new ParserError("Unable to parse video id from html.")
        }

        const url = `https://streamani.net/download?id=${id[1]}`
        const data = await this.request.get<string>(url)
        const $ = cheerio.load(data)

        return $('.dowload a:not([target])') // yes the class name is actually called .dowload
        .map((_ , element) => ({
            quality : $(element).text().split(" (")[1].split(" - ")[0], // troll
            link : element.attribs.href
        }))
        .toArray()
    }

    private async getNewVideoPlayerMP4Files(html : string) : Promise<VideoFile[]> {
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

    private async getNewVideoPlayerHLSFiles(html : string) : Promise<any> {
        const serverList = await this.getServerList(html)

        /*
            If there are only two servers in the list, it's most likely PINK-BIRD and SAPPHIRE-DUCK.
            SAPPHIRE-DUCK and PINK-BIRD are unique from the other servers because it doesn't use MP4 files but an m3u8 file.
            We can access either server because they will return the same video qualities. 
        */
        if(serverList.length === 2) {
            let html = await this.request.get<string>(serverList[0].src)
            // These two servers will always have the code initalizing the video player encoded in Base64.
            html = this.findAndDecodeBase64(html)
            const m3u8FileUrl = this.getSourceFilesRegex.exec(html)
            
            if(!m3u8FileUrl) {
                throw new ParserError("Unable to parse m3u8 file url.")
            }

            return m3u8FileUrl[1]
        }   

        return await Promise.all(serverList.map(async ({ src }) => {
            try {        
                let html = await this.request.get<string>(src)

                // Some of these servers will have their code initalizing the video player encoded in Base64.
                if(this.getBase64StrRegex.test(html)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    html = this.findAndDecodeBase64(html)
                }   

                const files = /\[.+]/.exec(html)
                
                if(!files) {
                    throw new ParserError("Unable to parse mp4 files.")
                }

                // Had to use this library since it can parse unquoted JSON. The array that has been regex'ed 
                // contains unquoted and quoted objects. 
                return hjson.parse(files[0])
            } catch (e) {
                return []
            }
        }))
        
    }

    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<SearchVideoData[]> {
        if(options) {
            throw new ParserError("Options is disabled and not being used at the moment.")
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

    public async getVideos(url : string) : Promise<any>{
        const embedVideoPlayerUrl = await this.getEmbedVideoPlayerUrl(url)
        const videoPlayerHtml = await this.request.get<string>(embedVideoPlayerUrl)
        
        // A conditonial check to see which video player the webpage is currently using.
        if(embedVideoPlayerUrl.includes("player2.php")) {
            return await this.getOldVideoPlayerMP4Files(videoPlayerHtml)
        } else {
            return await this.getNewVideoPlayerHLSFiles(videoPlayerHtml)
        }
    }
}