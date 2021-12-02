import { Service } from "typedi";
import * as cheerio from "cheerio";
import hjson from "hjson";
import { ISearchData , IVideoSource, IEpisodeData , StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError"
import { createFormData } from "@suke/suke-util/dist";
import { AxiosRequest } from "@suke/requests/src/";

import { Quality , QualityAsUnion } from "@suke/suke-core/src/entities/SearchResult";
import { 
    AnimeRawSearchResult,
    RawEpisodeData,
    RawNewVideoPlayerSourceFile,
    RawExternalVideoServerResponse,
    KickAssAnimeEpisodeUrl,
    ExternalVideoServer,
    ExternalVideoServerResponse,
} from "./types"
import { IParser, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";

export * from "./types"

/**
 * A wrapper class to extract data from the website KickAssAnime.
 * @class
 * @author TheRealLunatite <bedgowns@gmail.com>
 */
@Service()
export default class KickAssAnimeParser implements IParser {
    private getVideoPlayerUrlRegex = /"link1":"(.+)","link2"/
    private getVideoServersRegex = /sources = (.+);/
    private getSourceFilesRegex = /(?:src=|file: )"([^"]+)"/
    private getBase64StrRegex = /Base64.decode\("(.{1200,})"\)/
    private getVideoIdRegex = /\?id=([^&]*)/
    private getEpisodesRegex = /"episodes":(.+),"types"/
    // eslint-disable-next-line no-useless-escape
    private getGlobalUrlRegex = /(?:http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g

    // An array of excluded servers that shouldn't be dealt with.
    private excludedServers = ["DAILYMOTION"]
    
    // KickAssAnime Pink-Bird and Sapphire-Duck returned video quality in order.
    private sapphireAndPinkQualitys = ["720p","1080p","480p","360p","240p"]

    public name = "kickassanime"
    public hostname = new URL("https://www2.kickassanime.ro")

    constructor(
        public request : AxiosRequest
    ) { }
    
    /**
     * Searches for a Base64 encoded string and returns the decoded content.
     * The encoded string must be wrapped inside a Base64.decode() function and 1200 characters length to be found.
     * @param data  
     * @returns {string}
     */
    private findAndDecodeBase64Str(data : string) : string {
        const base64 = this.getBase64StrRegex.exec(data)

        if(!base64) {
            throw new ParserError("Unable to find base64 string.")
        }

        return Buffer.from(base64[1] , "base64").toString()
    }

    /**
     * Gets the url of the embed video player for a KickAssAnime video.
     * @async
     * @param {Url} url - KickAssAnime episode url
     * @returns {Url}
     */
    private async getEmbedVideoPlayerUrl(url : URL) : Promise<URL> {
        const html = await this.request.get<string>(url)
        const videoPlayerUrlRegex = this.getVideoPlayerUrlRegex.exec(html)
        
        if(!videoPlayerUrlRegex) {
            throw new ParserError("Unable to parse video player url.")
        }

        const videoPlayerUrl = decodeURIComponent(videoPlayerUrlRegex[1].replace(/\\/g,""))
        const videoIdRegex = this.getVideoIdRegex.exec(videoPlayerUrl)

        if(!videoIdRegex) {
            return new URL(videoPlayerUrl)
        }

        return new URL(`https://goload.one/streaming.php?id=${videoIdRegex[1]}`)
    }

    /**
     * Get the external server name and url's of where the sources files are being hosted for a KickAssAnime video.
     * @async
     * @param {Url} url - KickassAnime episode url
     * @returns {Array<ExternalVideoServerResponse>}
     */
    private async getExternalServers(url : URL) : Promise<Array<ExternalVideoServerResponse>> { 
        const html = await this.request.get<string>(url)
        let servers : Array<ExternalVideoServerResponse> = []
        
        // The new video player will have their external servers stored in an array.
        if(this.getVideoServersRegex.test(html)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const rawExternalVideoServers : Array<RawExternalVideoServerResponse> = hjson.parse(this.getVideoServersRegex.exec(html)![1])

            servers = rawExternalVideoServers
            .map(({ name , src }) => ({
                name,
                src : new URL(
                    (name === "BETASERVER3" || name === "BETA-SERVER" || name === "PINK-BIRD" || name === "SAPPHIRE-DUCK") ? 
                    src.replace("player","pref") : src
                ) 
            }))
        } else if(this.getVideoIdRegex.test(url.host)) {
            const $ = cheerio.load(html)

            // Remove the active link server.
            // The active link server will have their data attributes as an empty string and it will not pass the Url check.
            $('.active.linkserver').remove()

            servers = $(".linkserver")
            .map((_ , element) => ({
                name : $(element).text() as ExternalVideoServer,
                src : new URL(element.attribs["data-video"])
            }))
            .toArray()

        } else {
            throw new ParserError("Unable to parse external servers.")
        }   

        return servers.filter(({ name }) => !this.excludedServers.includes(name.toUpperCase()))
    }

    /**
     * Parse the video source files from the old KickAssAnime video player.
     * @async
     * @param {Url} url - KickAssAnime Episode Url
     * @returns {Array<IVideoSource>} An array of video sources.
     */
    private async getOldVideoPlayerSourceFiles(url : URL) : Promise<IVideoSource[]> {
        /**
         * We don't have to make an unnecessary requests to other external servers because the url
         * with an id will have all the available qualities.
         */

        const id = this.getVideoIdRegex.exec(url.host)

        if(!id) {
            throw new ParserError("Unable to parse video id from html.")
        }


        const html = await this.request.get<string>(new URL(`https://streamani.net/download?id=${id[1]}`))
        const $ = cheerio.load(html)

        return $('.dowload a:not([target])') // yes the class name is actually called .dowload
        .map((_ , element) => {         
            return {
                quality : Quality[$(element).text().split(" (")[1].split(" - ")[0].toLowerCase() as QualityAsUnion],
                url : new URL(element.attribs.href)
            }
        })
        .toArray()
    }

    // private async getNewVideoPlayerMP4Files(html : string) : Promise<VideoFile[]> {
    //     // Some external servers loads the content using JS.
    //     const base64Str = this.getBase64StrRegex.exec(html)

    //     if(base64Str) {
    //         html = Buffer.from(base64Str[1] , "base64").toString()
    //     }

    //     const $ = cheerio.load(html)
        
    //     return $("a[href]")
    //     .map((_ , element) => {
    //         const videoQuality = $(element).text().split(" ")

    //         return {
    //             quality : videoQuality.length === 3 ? videoQuality[1] : videoQuality[0],
    //             link : element.attribs.href
    //         }
    //     })
    //     .toArray()
    // }

    /**
     * Parse the video sources files from the new KickAssAnime video player.
     * @async
     * @param {Array<ExternalVideoServerResponse>} extServers 
     * @returns {Array<IVideoSource>} An array of video sources.
     */
    private async getNewVideoPlayerSourceFiles(extServers : Array<ExternalVideoServerResponse>) : Promise<Array<IVideoSource>> {
        /*
            SAPPHIRE-DUCK and PINK-BIRD are unique from other external servers because it doesn't use MP4 files but an m3u8 file.
            And a different way to grab the source file.
            We can access either server because they will return the same amount of supported quality videos.
            Both of these servers have videos than any other external server. 
        */

        const sapphireOrPinkExtServerIndex = extServers.findIndex(({ name }) => name === "PINK-BIRD" || name === "SAPPHIRE-DUCK")

        if(sapphireOrPinkExtServerIndex !== -1) {
            const html = await this.request.get<string>(extServers[0].src)
            // These two servers will always have the code initalizing the video player encoded in Base64.
            const decodedHtml = this.findAndDecodeBase64Str(html)
            const m3u8MasterFileUrlRegex = this.getSourceFilesRegex.exec(decodedHtml)
            
            if(!m3u8MasterFileUrlRegex) {
                throw new ParserError("Unable to parse m3u8 master file url.")
            }       

            const m3u8MasterFileUrl = new URL(m3u8MasterFileUrlRegex[1])
            const m3u8MasterFileContent = await this.request.get<string>(m3u8MasterFileUrl)

            const files = []
            let regexResult

            for(let i = 0; i < this.sapphireAndPinkQualitys.length; i++) {
                regexResult = this.getGlobalUrlRegex.exec(m3u8MasterFileContent)

                if(regexResult) {
                    files.push({
                        url : new URL(regexResult[0]),
                        quality : Quality[this.sapphireAndPinkQualitys[i] as QualityAsUnion]
                    })
                } else {
                    break
                }
            }

            return files
        }   

        // An array containing subarrays of the source files for every external server.
        const rawExternalServerSourceFiles : Array<Array<RawNewVideoPlayerSourceFile>> = await Promise.all(extServers.map(async ({ src }) => {
            try {        
                let html = await this.request.get<string>(src)

                // Some of these servers will have their code initalizing the video player encoded in Base64.
                if(this.getBase64StrRegex.test(html)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    html = this.findAndDecodeBase64Str(html)
                }   

                const sourceFiles = /\[.+]/.exec(html)
                
                if(!sourceFiles) {
                    throw new ParserError("Unable to parse source files.")
                }

                // Had to use this library since it can parse unquoted JSON. The array that has been regex'ed 
                // contains unquoted and quoted objects. 
                return hjson.parse(sourceFiles[0])
            } catch (e) {
                return []
            }
        }))

        // Flatten out the array so we can merge all the subarrays together.
        // Filter out the array because some items can contain file url that are empty.
        const filteredRawExternalSourceFiles = rawExternalServerSourceFiles.flat().filter((rawNewVideoPlayerSourceFile) => rawNewVideoPlayerSourceFile.file.length !== 0)

        return filteredRawExternalSourceFiles.map((rawVideoPlayerSourceFile) => ({
            url : new URL(rawVideoPlayerSourceFile.file),
            quality : Quality[rawVideoPlayerSourceFile.label.trim().toLowerCase() as QualityAsUnion]
        }))
    }
    
    /**
     * Find animes using a specific search term.
     * @async
     * @param {string} searchTerm
     * @param options 
     * @returns {Array<ISearchData>}
     */
    public async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {
        if(options) {
            throw new ParserError("Options is disabled and not being used at the moment.")
        }

    
        
        /*return data.map(({ name , image }) => ({
            type : name.toLowerCase().includes("movie") ? StandaloneType.Movie : StandaloneType.Video,
            thumbnail_url : new URL(`${this.hostname.host}/uploads/${image}`),
            name
        }))*/
        return {} as ISearchData;
    }

    /**
     * Get the video sources for a KickAssAnime episode.
     * @async
     * @param {Url} url - KickAssAnime episode url.
     * @returns {Array<IVideoSource>} An array of video sources.
     */
    public async getVideoSources(url : URL) : Promise<Array<IVideoSource>> {
        const embedVideoPlayerUrl = await this.getEmbedVideoPlayerUrl(url)
        
        // A conditonial check to see which video player the webpage is currently using.
        if(embedVideoPlayerUrl.toString().includes("player.php")) {
            const extServers = await this.getExternalServers(embedVideoPlayerUrl)
            const sourceFiles = await this.getNewVideoPlayerSourceFiles(extServers)

            const sapphireOrPinkExtServerIndex = extServers.findIndex(({ name }) => name === "PINK-BIRD" || name === "SAPPHIRE-DUCK")
            // An external servers array with an external server named Sapphire-Duck or Pink-Bird will always return all the avaliable videos with non duplicates. 
            if(sapphireOrPinkExtServerIndex !== -1) {
                return sourceFiles
            }

            // An external servers array without a Sapphire-Duck or Pink-Bird external server will return all of the avaliable videos for each server.
            // We will have to get rid of the duplicates.   
            const uniqueQualityStorage : Array<string> = []
            const uniqueSourceFiles : Array<IVideoSource> = []

            sourceFiles.forEach((newVideoPlayerSourceFile) => {
                if(!uniqueQualityStorage.includes(Quality[newVideoPlayerSourceFile.quality])) {
                    uniqueQualityStorage.push(Quality[newVideoPlayerSourceFile.quality])
                    uniqueSourceFiles.push(newVideoPlayerSourceFile)
                }
            })

            return uniqueSourceFiles
        } else {
            /**
             * The embed video player url has an id that can lead us to the download page.
             * It also includes the download links for the other external servers beides this one. 
             */
            return await this.getOldVideoPlayerSourceFiles(embedVideoPlayerUrl)
        }
    }
}