import { ValidationError } from "@suke/suke-core/src/exceptions/ValidationError"
import { ValueObject } from "@suke/suke-core/src/ValueObject"
import { Service , Container } from "typedi";
import { createFormData } from "@suke/suke-util/src"
import axios from "axios"
import "reflect-metadata"

export class KickAssAnimeLink extends ValueObject {
    private linkRegex = /^(?:http(?:s|)):\/\/www(?:2|).kickassanime.ro\/anime\/(?:[a-zA-Z0-9]+-){1,}\d*(?:\/|)$/

    constructor(public url : string) {
        super()

        if(!this.IsValid()) {
            throw new ValidationError("Invalid Kickassanime URL.")
        }
    }

    public* GetEqualityProperties(): Generator<unknown, any, unknown> {
        yield this.linkRegex
    }

    public IsValid(): boolean {
        return !!this.url && this.linkRegex.test(this.url)
    }
}

export type RawEpisode = {
    epnum : string,
    name : null | string,
    slug : string,
    createddate : string,
    num : string
}

export type Episode = {
    name : string | null,
    createddate : string,
    url : string,
    num : number
}

export type AnimeRawSearchResult = {
    name : string,
    slug : string,
    image : string
}

export type AnimeSearchResult = {
    name : string,
    url : string,
    imageUrl : string
}

@Service()
export default class KickAssAnime {
    private episodesRegex = /\[{"epnum":"Episode \d+","name":.+,"slug":.+,"createddate":.+,"num":"\d+"}\]/

    public async searchForAnime(keyword : string) : Promise<Array<AnimeSearchResult> | null> {
        const formData = createFormData({ keyword })
        const req = await axios({
            url : "https://www2.kickassanime.ro/api/anime_search",
            method : "POST",
            data : formData,
            headers : {
                "Content-Type" : "multipart/form-data; boundary=" + formData.getBoundary()
            }
        })

        const data : Array<AnimeRawSearchResult> = req.data
        
        return Promise.resolve(
            data.map(({ name , slug , image }) => (
                {  
                    name, 
                    url : "https://www2.kickassanime.ro" + slug,
                    imageUrl : "https://www2.kickassanime.ro/uploads/" + image
                }
            ))
        )
    }

    public async getEpisodes(link : KickAssAnimeLink) : Promise<null | Array<Episode>> {
        const getEpisodesReq = await axios.get(link.url)
        const html = getEpisodesReq.data

        const episodesAsString = this.episodesRegex.exec(html)

        if(episodesAsString) {
            const arrOfEpisodes : Array<RawEpisode> = JSON.parse(episodesAsString[0])
    
            return arrOfEpisodes.map(({ name , slug , createddate , num }) => ({
                name,
                createddate,
                num : +num,
                url : "https://www2.kickassanime.ro" + slug
            }))
        }
    
        return null
    }
}